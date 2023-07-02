---
sidebar_position: 3
---

# 协议缓存

## 概述

## 缓存流程

- 首先判断有没有强制缓存策略；有的话走强制缓存，先检查是否过期，不过期直接从缓存拿取；过期的话判断有没有协商策略，先判断有没有Etag，有则带上If-None-Match请求头；没有的话在判断有没有Last-Modified，有则带上If-Modified-Since请求头；如果都没有，则直接发送请求。（**Etag比Last-Modified优先级高**）

- 服务端响应：

    1. 协商缓存

        - Etag

        - Last-Modified

    2. 强制缓存：缓存时间（新鲜度）

        - Expires（旧，不推荐使用）

        - Cache-Control:max-age=484200

    3. 控制缓存能力（Pragma首部已被抛弃）

        - **Cache-Control:no-store 告知浏览器不要缓存**

        - **Cache-Control:no-cache 告知浏览器可以缓存，但使用缓存前要先与服务器进行再验证**

        - Cache-Control:max-age 存活时间

        - Expires:过期时间

        - Cache-Control:must-revalidate

        - Cache-Control:private 告知这个只能由客户端缓存，其他什么代理服务器都不能缓存

        - Cache-Control:public 客户端、代理服务器都可以缓存

- 客户端请求：

    1. 协商缓存

        - If-None-Match:对应Etag

        - If-Modified-Since:对应Last-Modified

- 一般来说对get请求的资源进行缓存，也不是说post一定不能缓存，但是一般不做缓存

## vary字段

**Vary 字段主要用于 代理服务器实现缓存服务。**

不同客户端对内容格式的支持程度不同（比如有些支持数据压缩，有些不支持），所以即便请求URL 和请求方法都相同，服务器返回的数据也会不同（称为内容协商）。Vary 字段记录了代理服务器返回特定数据参考了哪些请求字段。代理服务器拿到源服务器的响应报文，会根据 Vary 里的字段列表，缓存不同版本的数据。当客户端再次访问时，代理服务器会分析请求字段，返回正确的版本。在叙述 Vary 的工作原理前，我们先简单了解一下什么是代理服务器。

### 代理服务器

客户端访问网站会发起请求，请求会被发送到所请求资源所在的服务器，服务器会将对应的资源返回给客户端。如果并发访问量很小，服务器并没有什么压力。但如果并发量很大，我们就得考虑缓存了，缓存分为客户端缓存和服务器缓存。服务器可以将数据缓存到内存中，也可以将数据缓存到代理服务器中。我们在客户端到服务器中间添加一些 **代理服务器**，它们的其中一个功能是 **内容缓存**。另外，为了进行区分，我们将真正提供数据的服务器称为 **源服务器**。配合 DNS，我们可以将访问分配到离客户端最近的代理服务器，从里面获取数据。如果没有数据，该代理服务器会再发送和客户端相同的请求给源服务器，并将从源服务器返回的数据缓存起来，并返回数据给客户端。这样，下次客户端再次请求相同的资源时，代理服务器就可以直接返回数据而不需要再转发给源服务器。

### 举例说明 Vary 的工作原理

假设客户端 A 请求了一个数据，且该客户端支持 gzip 压缩，于是请求头字段中带有 `Accept-Encoding: gzip`。

请求来到了代理服务器，但是里面没有缓存，所以代理服务器把请求又发送给了源服务器。源服务器拿到了请求报文，分析了一波，决定返回一个进行了 gzip 压缩的数据。另外，源服务器还希望介于它和客户端之间的代理服务器，也那能够像它一样优秀，可以根据 `Accept-Encoding` 返回正确的数据，于是在响应头字段中加上了 `Vary: Accept-Encoding`，并返回了数据A 给代理服务器。

数据A 来到了代理服务器，代理服务器取出了 Vary 字段，发现里面有个 `Accept-Encoding`，于是它明白了，它需要将当前响应报文的 `Accept-Encoding` 作为一个标志，映射到当前这个缓存数据A。即：

`URL + 请求方法 + "Accept-Encoding: gzip" -> 数据A`

代理服务器缓存好了源服务器的数据后，并保存了映射关系，就把数据返回给了客户端 A。

很快，客户端 A 又发送相同请求，代理服务器接收了请求且缓存还没过期，且发现请求头依旧有 `Accept-Encoding: gzip`，于是缓存命中了数据A，数据A被返回给了客户端A。在缓存未过期的期间，只要任何一个客户端的请求头里有 `Accept-Encoding: gzip`且请求url，代理服务器返回的数据都是数据A。

不久后，不支持解压功能的客户端B 发送一个没有 `Accept-Encoding` 字段的请求。代理服务器拿到了数据，缓存没有命中，于是和上面一样，拿到一个新的缓存数据B，得到了一个新的映射关系：

`URL + 请求方法 + 无 Accept-Encoding 的头字段 -> 数据B`

如果代理服务器不使用 Vary，纯粹只是根据 **请求URL和请求方法** 来判断是否缓存命中，那不支持解压功能的 客户端B 就可能会错误拿到代理服务器中的被压缩过的 数据A。

通过 Vary 头字段，我们可以避免客户端B拿到一个无法解压的数据A。

### 总结

这便是 Vary 头字段的作用：**让代理服务器的缓存命中更多的决定因子，而不仅仅是依据请求 URL 和请求方法来决定是否命中。**
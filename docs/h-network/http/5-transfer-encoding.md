---
sidebar_position: 5
---

# 分块编码

## 概述

## TTFB（Time To First Byte）

由于 `Content-Length` 字段必须真实反映实体长度，但实际应用中，有些时候实体长度并没那么好获得，例如实体来自于网络文件，或者由动态语言生成。这时候要想准确获取长度，只能开一个足够大的 buffer，等内容全部生成好再计算。但这样做一方面需要更大的内存开销，另一方面也会让客户端等更久。

我们在做 WEB 性能优化时，有一个重要的指标叫 TTFB（Time To First Byte），它代表的是从客户端发出请求到收到响应的第一个字节所花费的时间。大部分浏览器自带的 Network 面板都可以看到这个指标，越短的 TTFB 意味着用户可以越早看到页面内容，体验越好。可想而知，服务端为了计算响应实体长度而缓存所有内容，跟更短的 TTFB 理念背道而驰。但在 HTTP 报文中，实体一定要在头部之后，顺序不能颠倒，为此我们需要一个新的机制：不依赖头部的长度信息，也能知道实体的边界。

## Transfer-Encoding

分块编码相当简单，在头部加入 `Transfer-Encoding: chunked` 之后，就代表这个报文采用了分块编码。这时，报文中的实体需要改为用一系列分块来传输。每个分块包含十六进制的长度值和数据，长度值独占一行，长度不包括它结尾的 CRLF（\r\n），也不包括分块数据结尾的 CRLF。最后一个分块长度值必须为 0，对应的分块数据没有内容，表示实体结束。代码：

```js
const net = require("node:net");
const server = net
  .createServer((socket) => {
    socket.on("data", function (data) {
      socket.write("HTTP/1.1 200 OK\r\n");
      socket.write("Transfer-Encoding:chunked\r\n");
      socket.write("\r\n");

      socket.write("b\r\n"); //第一个分块的长度，十六进制表示，不包括\r\n
      socket.write("01234567898\r\n"); //第一个分块的数据

      socket.write("5\r\n"); //第二个分块的长度，十六进制表示，不包括\r\n
      socket.write("12345\r\n"); //第二个分块的数据

      socket.write("0\r\n"); //最后一个分块的长度必须为0，不包括\r\n
      socket.write("\r\n"); //最后一个分块的数据没有内容，表示实体结束
    });
  })
  .on("error", (err) => {
    // Handle errors here.
    throw err;
  });

// Grab an arbitrary unused port.
server.listen(9000, () => {
  console.log("opened server on", server.address());
});

//Transfer-Encoding:chunked响应头部可以不需要content-lenght头部，不依赖头部的长度信息，也能知道实体的边界

// Content-Encoding 和 Transfer-Encoding 二者经常会结合来用； 其实就是针对进行了内容编码（压缩）的内容再进行传输编码（分块）
```
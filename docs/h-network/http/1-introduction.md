---
sidebar_position: 1
---

# 介绍

## 概述

http发展历史

## http1.0

- 持久性连接：Connection：keep-alive

:::tip

keep-alive并不是默认使用的，客户端必须发送一个请求首部来激活keep-alive连接

Keep-Alive首部(Keep-Alive:max=5，timeout=120)，完全可选

:::

        
## http1.1

- 持久性连接：Connection：keep-alive

:::tip

keep-alive是默认使用的

:::

- 管道化连接（基本没用真正用起来，只能在发送端做到并行化，但服务端必须串行响应，不能做到多路复用）

    1. 服务端只能严格串行的返回响应

    2. 由于1的问题，一个慢响应会阻塞后面所有的请求

    3. 由于1的问题，服务端只能按请求顺序相应，即使后来的请求已经处理完，也不能响应，这是服务端必须缓存这个响应，造成不必要的缓存开销

    4. 如果TCP中断了，客户端会重新发送为收到响应的请求之后的所有请求，但服务端有可能已经处理好了这些请求中的某些请求，客户端重新发送的请
    求如果不是幂等性，可能会造成问题，比如post请求（修改了数据库中的数据）
    5. 中间请求如果存在代理，代理不支持这个特性，有可能造成中断或者串行化

- http1.1时代优化方案

    1. 此阶段性能优化方案是浏览器对同一个域名，可以同时开启多个TCP连接，最多6个，可以做域名切片

    2. 雪碧图

    3. 把多个js、css文件等合成一个文件；但会有问题，不如一个小的js文件修改了，那所有的捆绑的js文件都要重新请求，不利于缓存

    4. 小图片、小CSS嵌入到html中

## http2（二进制协议、二进制分帧）

- 使用二进制格式传输
    
- 首部压缩

    - http1.1对于冗长的头部的优化方案：采用域名切分，对于不需要cookie的请求，例如js,css,图片，不发送cookie

    - http2.0：**HPACK**

        - 静态表：对61个常用的头及值的组合做了编码

        - 动态表：允许客户端和服务端通过通信的方式，维护一张动态的字典，这样用索引就可以代表一串很长的文本

        - Huffman编码，常用来压缩body，出现概率更高的字符用更短的编码表示，出现概率低一些的字符用更长的编码表示

- 多路复用

    - http1.1并行：开启多个TCP连接
        
    - http2.0并行：利用二进制分帧和流ID实现（多路复用）

        - 帧是http2.0最小的通讯单元，头可以分成好几个帧，body也可以分成好几个帧发送

        - 流是连接中的一个虚拟信道，可以承载双向消息，每个流都有一个唯一的整数标识符

        - 每个响应都有新的、自增流ID，返回响应采用同样的流ID

        - 为了防止流ID（流标识符）的冲突，客户端发起请求使用奇数ID，服务端如果在连接后推送采用偶数ID

        
- 服务器推送

    - 应用场景：比如客户端请求一个网页，服务端知道该页面需要哪些资源，不必等到客户端拿到html在解析到需要加载的资源再发送请求；当然这也有问题，如果客户端只要html，不需要其他资源，这就需要一些推送策略来控制（什么时候推送，推送什么）
        
- http2.0优势

    1. 可以并行交错的发送请求

    2. 可以并行交错的发送响应

    3. 只使用一个连接可并行发送多个请求和响应

    4. 消除不必要的延迟

    5. 不必绕过http1.1限制而多做很多工作（http1.1中的优化方案都可以不必做了）

- 优先级

    1. 可以设置流标识符的优先级

## http3（http-over-quic）

- 队头阻塞

    - 一种是 **TCP 队头阻塞**

        TCP 是面向连接的、可靠的流协议，其为上层应用提供了可靠的传输，保证将数据有序并且准确地发送至接收端
        
        为了做到这一点，**TCP采用了“顺序控制”和“重发控制”机制**，另外还使用“流量控制”和“拥塞控制”来提高网络利用率
        
        应用层（如HTTP）发送的数据会先传递给传输层（TCP），TCP 收到数据后并不会直接发送，而是先把数据切割成 MSS 大小的包，再按窗口大小将多个包丢给网络层（IP 协议）处理。
        
        IP 层的作用是“实现终端节点之间的通信”，并不保证数据的可靠性和有序性，所以接收端可能会先收到窗口末端的数据
        
        **这个时候 TCP 是不会向上层应用交付数据的，它得等到前面的数据都接收到了才向上交付，所以这就出现了队头阻塞，即队头的包如果发生延迟或者丢失，队尾必须等待发送端重新发送并接收到数据后才会一起向上交付。**
        
        当然 TCP 有**快重传**和**快恢复**机制，一旦收到失序的报文段就立即发出**重复确认**，并且接收端在连续收到三个重复确认时，就会把慢开始门限减半，然后执行**拥塞避免**算法，以快速重发丢失的报文。
        
        除了队头阻塞会影响传输速度，TCP 的**三次握手**、**四次挥手**以及**延迟确认应答**和**Nagle算法**等也会带来一定的延迟。

    - 另一种是 **HTTP 队头阻塞**

        在一个TCP链接里，多个请求是排队一个一个来的，只有前面的连接和数据请求处理完了，才会处理下一个，因此队头阻塞问题明显。所有有了http1.1的开启多了TCP连接的并行方法即管道连接
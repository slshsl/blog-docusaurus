---
sidebar_position: 4
---

# Content-Length

## 概述

```js
const net = require("node:net");
const server = net
  .createServer((socket) => {
    socket.on("data", function (data) {
      socket.write("HTTP/1.1 200 OK\r\n");
      socket.write("Content-Length:10\r\n"); //  1
      socket.write("\r\n");
      socket.write("hello world!");
      socket.destroy(); // 2
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

//  场景一：
//      注释掉1，保留2；
//      虽然当前浏览器都是采用长连接的请求，但服务器每次响应都会挂断，浏览器正常响应

//  场景二：
//      注释掉2，保留1；
//      当前浏览器都是采用长连接的请求，服务器也不会立即挂断（可写个策略，等待多长时间没有数据来时在挂断）
//      如果Content-Length中长度与请求体body长度一致，浏览器正常响应
//      如果Content-Length中长度大于请求体body长度，浏览器一直pending
//      如果Content-Length中长度小于请求体body长度，浏览器会截断内容正常响应
```
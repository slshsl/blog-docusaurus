---
sidebar_position: 2
---

# ETag

## 概述

当浏览器访问网页的时候，会在http请求头中加入If-None-Match头部信息（前提是前次请求时服务器返回了Etag头部信息），内容是以前服务器发送回来的Etag信息。收到该请求后，比较接收到的Etag和自己再次计算出的etag内容，如果两者相等，则返回“304 Not Modified”，如果不相等，则返回200 OK和实际请求的内容。注意这个时候If-None-Match相比于If-Modified-Since具有更高的优先级别。如果ETag被关闭，服务器将使用If-Modified-Since参数来判断页面是否有更新，浏览器的If-Modified-Since参数来自原服务器上一次响应报文中的Last-Modified参数，这个参数精确到秒，也就是说，如果出现1秒内页面被多次修改，使用这个参数就无法判断，这就是要增加ETag的原因。
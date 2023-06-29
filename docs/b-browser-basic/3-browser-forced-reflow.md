---
sidebar_position: 3
---

# 浏览器强制回流

## 概述

现代的浏览器为了优化性能,因为重排都会造成额外的计算消耗,所以浏览器都会通过队列批量执行来优化重排

浏览器将修改操作放入到队列里,直到过了一段时间或者操作达到了一个阈值,才清空队列

**但当你获取布局信息的操作的时候,会强制队列刷新**,比如当你访问以下属性或者使用以下方法：

- offsetTop、offsetLeft、offsetWidth、offsetHeight

- scrollTop、scrollLeft、scrollWidth、scrollHeight

- clientTop、clientLeft、clientWidth、clientHeight

- getComputedStyle() 或者 IE中：currentStyle

- getBoundingClientRect

[What forces layout / reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

以上属性和方法都需要返回最新的布局信息,因此浏览器不得不清空队列,触发回流重绘来返回正确的值。

因此,在修改样式的时候,**最好避免使用上面列出的属性,他们都会刷新渲染队列**,如果要使用它们,最好将值缓存起来

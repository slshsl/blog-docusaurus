---
sidebar_position: 1
---

# iframe

## 概述

## 缺点

- 会阻塞主页面的`load`事件

- 不利于`SEO`

- 占用主页面`http`请求连接池,影响主页面并行加载

:::tip

可以通过`js`动态创建`iframe`元素并设置`src`属性值,以避开1和3这两个问题(这个有点类似`script`元素,动态创建`script`元素并设置`src`属性值,默认是以异步方式加载的,相当于加了`async`属性)

:::



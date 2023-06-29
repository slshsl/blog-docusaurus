---
sidebar_position: 24
---

# 图片懒加载

## 概述

原理：判断图片是否出现在视口，控制图片加载

## 解决思路

- 使用`data-*`自定义数据属性给`img`标签新增一个`data-src`属性

- 全局监听滚动事件，使用节流处理回调函数

- 在回调函数中，判断图片是否已经出现在可视区域，如果已经出现在可视区域，则加载该图片

- 页面初始化的时候执行一下回调函数，保证首屏有图片显示

## 解决方案

- 方法一

    利用`offsetTop`+递归找到合适的`offsetParent`，计算出距离；根据滚动的距离加以判断

- 方法二

    - `getBoundingClientRect`

    - `document.documentElement.clientHeight`

    - `scroll`事件监听

- 方法三

    - `IntersectionObserver`：用于推断某些节点是否可以被用户看见、有多大比例可以被用户看见

- 方法四

    ```html
    <img src='test.png' loading='lazy'>
    ```

:::tip

Chrome 和 Firefox 都支持通过 [loading](https://developer.mozilla.org/zh-CN/docs/Web/Performance/Lazy_loading) 属性实现延迟加载。此属性可以添加到`img`元素中。 `lazy` 值会告诉浏览器，如果图像位于可视区，则立即加载图像，并在用户滚动到它们附近时获取其图像。如果浏览器不支持该属性，则该属性将被忽略，图像将像往常一样立即加载。

:::

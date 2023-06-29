---
sidebar_position: 38
---

# 位置与尺寸

## 概述

- window.screen.width、window.screen.height

    window.outerWidth、window.outerHeigh

    window.innerWidth、window.innerHeight（包含滚动条）

- document.documentElement.clientWidth

    document.documentElement.clientWidth（不包含滚动条）

- HTMLElement.clientWidth

    HTMLElement.clientHeight

- HTMLElement.offsetWidth

    HTMLElement.offsetHeight

- HTMLElement.scrollWidth

    HTMLElement.scrollHeight

- HTMLElement.offsetParent

    dom元素属性，获取某个元素第一个定位的祖先元素，如果没有，则得到body；body的offsetParent为null

- HTMLElement.offsetLeft、HTMLElement.offsetTop

    `dom`元素属性；相对于该元素的`offsetParent`的坐标；如果`offsetParent`是`body`，则将其当作是整个网页
    
    HTMLElement.offsetTop 为只读属性，它返回当前元素相对于其元素的顶部内边距的距离
   
- HTMLElement.getBoundingClientRect()

    `dom`元素方法，该方法得到一个对象，该对象记录了该元素相对于视口的距离
---
sidebar_position: 24
---

# aspect-ratio

## 概述

## 实现固定长宽比的元素

- padding

    过去的解决方案是使用 `padding`
    
    一个元素的 `padding` 如若设置为百分比，则代表的是以父元素宽度为基准，根据这个原理，可设置长宽比
    
    但实际上意义有限，毕竟你把 padding 给占了，content 无任何区域

- aspect-ratio

    现代化的解决方案是使用长宽比的 CSS 属性: `aspect-ratio`
---
sidebar_position: 17
---

# 严格模式

## 概述

StrictMode(`React.StrictMode`)，本质是一个组件，该组件不进行UI渲染（`React.Fragment <> </>`）

## 副作用函数

一个函数中，做了一些会影响函数外部数据的事情，例如：

1. 异步处理

2. 改变参数值

3. setState

4. 本地存储

5. 改变函数外部的变量

相反的，如果一个函数没有副作用，则可以认为该函数是一个纯函数

## 严格模式的作用

在渲染内部组件时，发现不合适的代码。

- 识别不安全的生命周期

- 关于使用过时字符串 ref API 的警告

- 关于使用废弃的 findDOMNode 方法的警告

- 检测意外的副作用

    - React要求，副作用代码仅出现在以下生命周期函数中

    - ComponentDidMount

    - ComponentDidUpdate

    - ComponentWillUnMount

- 检测过时的 context API

:::tip

在严格模式下，虽然不能监控到具体的副作用代码，但它会将不能具有副作用的函数调用两遍，以便发现问题

这种情况，仅在开发模式下有效

:::


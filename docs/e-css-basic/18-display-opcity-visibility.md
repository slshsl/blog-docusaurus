---
sidebar_position: 18
---

# 元素可见

## 概述

display、opacity、visibility

## opacity叠加计算规则

## 区别

- display:none

    不存在dom中，不占位置；设置为none时无法响应事件

- visibility:hidden/visible

    存在dom中，占位置；设置为hidden时无法响应事件；**子元素可以通过设置visibility为visible重新可见；**

- opacity:0/1

    存在dom中，占位置；可以响应事件
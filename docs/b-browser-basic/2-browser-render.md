---
sidebar_position: 2
---

# 浏览器渲染流程

## 概述

```mermaid
graph TD;
    A[构建DOM树]  --> B(构建CSSOM);
    B --> C(构建渲染树);
    C --> D(布局);    
    D --> E(绘制); 
```

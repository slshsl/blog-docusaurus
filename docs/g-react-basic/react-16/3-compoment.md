---
sidebar_position: 3
---

# 组件

## 概述

组件：包含内容、样式和功能的UI单元

## 创建一个组件

- 函数组件

    返回一个React元素

- 类组件

    必须继承React.Component

    必须提供render函数，用于渲染组件

:::tip

组件的名称首字母必须大写

:::

## 组件的属性

- 对于函数组件，属性会作为一个对象的属性，传递给函数的参数

- 对于类组件，属性会作为一个对象的属性，传递给构造函数的参数

:::tip

- React元素本质上就是一个组件（内置组件）

- 组件的属性应该使用小驼峰命名法

- 组件无法改变自身的属性

- React中的哲学：数据属于谁，谁才有权力改动

- React中的数据，自顶而下流动
:::

## 组件状态

组件可以自行维护的数据

组件状态仅在类组件中有效（出现hook之前）

- 状态（state），本质上是类组件的一个属性，是一个对象

- 状态初始化

- 状态的变化

    - 不能直接改变状态：因为React无法监控到状态发生了变化

    - 必须使用this.setState({})改变状态

    - 一旦调用了this.setState，会导致当前组件重新渲染

## 组件中的数据

- props：该数据是由组件的使用者传递的数据，所有权不属于组件自身，因此组件无法改变该数组

- state：该数组是由组件自身创建的，所有权属于组件自身，因此组件有权改变该数据

## 组件的事件

在React中，组件的事件，本质上就是一个属性

按照之前React对组件的约定，由于事件本质上是一个属性，因此也需要使用小驼峰命名法

如果没有特殊处理，在事件处理函数中，this指向undefined

1. 使用bind函数，绑定this

2. 使用箭头函数
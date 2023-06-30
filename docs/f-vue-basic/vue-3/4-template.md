---
sidebar_position: 4
---

# 模板中的变化

## 概述

## v-model

`vue2`提供了两种双向绑定：`v-model`和`sync`

在`vue3`中，去掉了`sync`修饰符，只需要使用`v-model`进行双向绑定即可

为了让`v-model`更好的针对多个属性进行双向绑定，`vue3`作出了以下修改

- 当对自定义组件使用`v-mode`l指令时，绑定的属性名由原来的`value`变为`modelValue`，事件名由原来的`input`变为`update:modelValue`

    ```vue
      <!-- vue2 -->
      <ChildComponent :value="pageTitle" @input="pageTitle = $event" />
      <!-- 简写为 -->
      <ChildComponent v-model="pageTitle" />
    
      <!-- vue3 -->
      <ChildComponent
        :modelValue="pageTitle"
        @update:modelValue="pageTitle = $event"
      />
      <!-- 简写为 -->
      <ChildComponent v-model="pageTitle" />
    ```

- 去掉了`.sync`修饰符，它原本的功能由`v-model`的参数替代

    ```vue
       <!-- vue2 -->
      <ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
      <!-- 简写为 -->
      <ChildComponent :title.sync="pageTitle" />
    
      <!-- vue3 -->
      <ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
      <!-- 简写为 -->
      <ChildComponent v-model:title="pageTitle" />
    ```

- `model`配置被移除

- 允许自定义`v-model`修饰符；`vue2` 无此功能    

## v-if v-for

`v-if`的优先级 现在高于 `v-for`

## key

- 当使用`<template>`进行`v-for`循环时，需要把`key`值放到`<template>`中，而不是它的子元素中

- 当使用`v-if v-else-if v-else`分支的时候，不再需要指定`key`值

    vue3会自动给予每个分支一个唯一的`key`；即便要手工给予`key`值，也必须给予每个分支唯一的`key`，不能因为要重用分支而给予相同的 `key`

## Fragment

vue3现在允许组件出现多个根节点

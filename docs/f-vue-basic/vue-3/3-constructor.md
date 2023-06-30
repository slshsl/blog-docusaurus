---
sidebar_position: 3
---

# 创建vue应用

## 概述

在vue3中，去掉了Vue构造函数，转而使用createApp创建vue应用

## vue2

```html
<!-- vue2 -->
<div id="app1"></div>
<div id="app2"></div>
<script>
    Vue.use(...); // 此代码会影响所有的vue应用
    Vue.mixin(...); // 此代码会影响所有的vue应用
    Vue.component(...); // 此代码会影响所有的vue应用
            
    new Vue({
    // 配置
    }).$mount("#app1")

    new Vue({
    // 配置
    }).$mount("#app2")
</script>
```

## vue3

```html
<!-- vue3 -->
<div id="app1"></div>
<div id="app2"></div>
<script>  
	createApp(根组件).use(...).mixin(...).component(...).mount("#app1")
    createApp(根组件).mount("#app2")  
</script>
```

## 解决的问题

vue2的全局构造函数带来了诸多问题：

1. 调用构造函数的静态方法会对所有`vue`应用生效，不利于隔离不同应用

2. `vue2`的构造函数集成了太多功能，不利于`tree shaking`，`vue3`把这些功能使用普通函数导出，能够充分利用`tree shaking`优化打包体积

3. `vue2`没有把组件实例和`vue`应用两个概念区分开，在`vue2`中，通过new Vue创建的对象，既是一个`vue`应用，同时又是一个特殊的`vue`组件

4. `vue3`中，把两个概念区别开来，通过`createApp`创建的对象，是一个vue应用，它内部提供的方法是针对整个应用的，而不再是一个特殊的组件

---
sidebar_position: 4
---

# keep-alive

## 概述

keep-alive组件是vue的内置组件，用于缓存内部组件实例

这样做的目的在于，keep-alive内部的组件切回时，不用重新创建组件实例，而直接使用缓存中的实例

一方面能够避免创建组件带来的开销，另一方面可以保留组件的状态

## 详细用法

keep-alive具有include和exclude属性，通过它们可以控制哪些组件进入缓存

另外它还提供了max属性，通过它可以设置最大缓存数，当缓存的实例超过该数时，vue会移除最久没有使用的组件缓存

keep-alive内部所有嵌套的组件都具有两个生命周期钩子函数，分别是activated和deactivated，它们分别在组件激活和失活时触发

第一次activated触发是在mounted之后

## 内部实现

在具体的实现上，keep-alive在内部维护了一个key数组和一个缓存对象

`key`数组记录目前缓存的组件`key`值，如果组件没有指定`key`值，则会为其自动生成一个唯一的`key`值

`cache`对象以`key`值为键，`vnode`为值，用于缓存组件对应的虚拟`DOM`

在`keep-alive`的渲染函数中，其基本逻辑是判断当前渲染的`vnode`是否有对应的缓存，如果有，从缓存中读取到对应的组件实例；如果没有则将其缓存。

当缓存数量超过`max`数值时，`keep-alive`会移除掉`key`数组的第一个元素

```js

created () {
  this.cache = Object.create(null)
  this.keys = []
}

render(){
  const slot = this.$slots.default; // 获取默认插槽
  const vnode = getFirstComponentChild(slot); // 得到插槽中的第一个组件的vnode
  const name = getComponentName(vnode.componentOptions); //获取组件名字
  const { cache, keys } = this; // 获取当前的缓存对象和key数组
  const key = ...; // 获取组件的key值，若没有，会按照规则自动生成
  if (cache[key]) {
    // 有缓存
    // 重用组件实例
    vnode.componentInstance = cache[key].componentInstance
    remove(keys, key); // 删除key
    // 将key加入到数组末尾，这样是为了保证最近使用的组件在数组中靠后，反之靠前
    keys.push(key); 
  } else {
    // 无缓存，进行缓存
    cache[key] = vnode
    keys.push(key)
    if (this.max && keys.length > parseInt(this.max)) {
      // 超过最大缓存数量，移除第一个key对应的缓存
      pruneCacheEntry(cache, keys[0], keys, this._vnode)
    }
  }
  return vnode;
}
```
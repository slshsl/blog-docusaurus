---
sidebar_position: 6
---

# 监听数据变化

## 概述

## watchEffect

```js
const stop = watchEffect(() => {
    // 该函数会立即执行，然后追中函数中用到的响应式数据，响应式数据变化后会再次执行
})

// 通过调用stop函数，会停止监听
stop(); // 停止监听
```

## watch

```js
// 等效于vue2的$watch

// 监听单个数据的变化
const state = reactive({ count: 0 })
watch(() => state.count, (newValue, oldValue) => {
    // ...
}, options)

const countRef = ref(0);
watch(countRef, (newValue, oldValue) => {
// ...
}, options)

// 监听多个数据的变化
watch([() => state.count, countRef], ([new1, new2], [old1, old2]) => {
// ...
});
```

:::tip

无论是`watchEffect`还是`watch`，当依赖项变化时，回调函数的运行都是异步的（微队列）

:::

## 应用

除非遇到下面的场景，否则均建议选择`watchEffect`

- 不希望回调函数一开始就执行

- 数据改变时，需要参考旧值

- 需要监控一些回调函数中不会用到的数据
---
sidebar_position: 10
---

# setTimeout

## 概述

setTimeout 为什么最小只能设置 4ms，如何实现一个 0ms 的 setTimeout

不同浏览器的最低时延会不一致，比如 chrome 的最低时延是 1ms

而如果 timer 嵌套层级很多，那么最低时延是 4ms

具体嵌套层级的阈值不同浏览器也不一致，HTML Standard 当中是 >5，chrome 当中是 >=5

## 实现 0ms 的 setTimeout

```js
let timeouts = [];
const messageName = 'zero-setTimeout'

function setTimeoutZero(fn) {
  timeouts.push(fn);
  window.postMessage(messageName, '*')
}

function handleMessage (evt) {
  if (evt.source == window && evt.data === messageName ) {
    if (timeouts.length > 0) {
      const f = timeouts.shift()
      f()
    }
  }
}

window.addEventListener('message', handleMessage)

window.zeroSetTimeout = setTimeoutZero;
```
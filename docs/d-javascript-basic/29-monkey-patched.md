---
sidebar_position: 29
---

# 猴子补丁检测

## 概述

## 解决方案

```js

(function(){
    const { fetch: originalFetch } = window;
    window.__isFetchMonkeyPatched = ()=>{
        return window.fetch !== originalFetch;
    }
})();

window.fetch = new Proxy(window.fetch,{
    apply: function (target ,thisArg,args){        
    }
})

console.log(window.__isFetchMonkeyPatched())

```
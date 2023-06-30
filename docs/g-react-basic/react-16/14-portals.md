---
sidebar_position: 14
---

# Portals

## 概述

插槽：将一个React元素渲染到指定的DOM容器中

`ReactDOM.createPortal`(React元素, 真实的DOM容器)，该函数返回一个React元素

## 事件冒泡

:::tip

1. React中的事件是包装过的

2. 它的事件冒泡是根据虚拟DOM树来冒泡的，与真实的DOM树无关。

:::

```jsx
import React from 'react'
import ReactDOM from "react-dom"

function ChildA() {
    return ReactDOM.createPortal(<div className="child-a" style={{
        marginTop: 200
    }}>
        <h1>ChildA</h1>
        <ChildB />
    </div>, document.querySelector(".modal"));
}

function ChildB() {
    return <div className="child-b">
        <h1>ChildB</h1>
    </div>
}

export default function App() {
    return (
        <div className="app" onClick={e => {
            console.log("App被点击了", e.target)
        }}>
            <h1>App</h1>
            <ChildA />
        </div>
    )
}
```
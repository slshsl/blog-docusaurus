---
sidebar_position: 13
---

# 渲染属性

## 概述

有时候，某些组件的各种功能及其处理逻辑几乎完全相同，只是显示的界面不一样，建议下面的方式认选其一来解决重复代码的问题（横切关注点）

## render props

- 某个组件，需要某个属性

- 该属性是一个函数，函数的返回值用于渲染

- 函数的参数会传递为需要的数据

- 注意纯组件的属性（尽量避免每次传递的render props的地址不一致）

- 通常该属性的名字叫做render

```jsx
import React, { PureComponent } from 'react'
import "./style.css"

//该组件用于监听鼠标的变化
class MouseListener extends PureComponent {
    state = {
        x: 0,
        y: 0
    }

    divRef = React.createRef()

    handleMouseMove = e => {
        //更新x和y的值
        const { left, top } = this.divRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        this.setState({
            x,
            y
        });
    }

    render() {
        return (
            <div ref={this.divRef} className="point" onMouseMove={this.handleMouseMove}>
                {this.props.render ? this.props.render(this.state) : "默认值"}
            </div>
        )
    }
}

const renderPoint = mouse => {
    return <>横坐标：{mouse.x}，纵坐标：{mouse.y}</>;
};

const renderDiv = mouse => {
    return (<div
        style={{
        width: 100,
        height: 100,
        background: "#008c8c",
        position: "absolute",
        left: mouse.x - 50,
        top: mouse.y - 50
    }}></div>);
};

function Test() {
    return (
        <div>
            <MouseListener render={renderPoint} />
            <MouseListener render={renderDiv} />
        </div>
    )
}
```
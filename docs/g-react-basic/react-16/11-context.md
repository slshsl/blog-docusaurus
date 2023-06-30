---
sidebar_position: 11
---

# context

## 概述

上下文：Context，表示做某一些事情的环境

React中的上下文特点：

1. 当某个组件创建了上下文后，上下文中的数据，会被所有后代组件共享

2. 如果某个组件依赖了上下文，会导致该组件不再纯粹（外部数据仅来源于属性props）

3. 一般情况下，用于第三方组件（通用组件）

## 旧的API

1. 创建上下文
    
    只有类组件才可以创建上下文
    
    1. 给类组件书写静态属性 `childContextTypes`，使用该属性对上下文中的数据类型进行约束

    2. 添加实例方法 `getChildContext`，该方法返回的对象，即为上下文中的数据，该数据必须满足类型约束
    
    该方法会在每次render之后运行。（重点）

2. 使用上下文中的数据
    
    要求：如果要使用上下文中的数据，组件必须有一个静态属性 `contextTypes`，该属性描述了需要获取的上下文中的数据类型
    
    1. 可以在组件的构造函数中，通过第二个参数，获取上下文数据

    2. 从组件的context属性中获取

    3. 在函数组件中，通过第二个参数，获取上下文数据

3. 上下文的数据变化
    
    上下文中的数据不可以直接变化，最终都是通过状态改变
    
    在上下文中加入一个处理函数，可以用于后代组件更改上下文的数据
    
4. 如果子组件B的父组件A中创建了上下文；组件A的父组件也创建了上下文，则组件B是使用上下文时，则一级一级往上找，如果父组件A有，则用A的，否则再向A组件的父组件上找，即就近原则

```jsx
import React, { Component } from 'react'
import PropTypes from "prop-types";

const types = {
    a: PropTypes.number,
    b: PropTypes.string.isRequired,
    onChangeA: PropTypes.func
}

class ChildA extends Component {
    static contextTypes = types;

	//给类组件书写静态属性 childContextTypes，使用该属性对上下文中的数据类型进行约束
    static childContextTypes = {
        a: PropTypes.number,
        c: PropTypes.string
    }

	//添加实例方法 getChildContext，该方法返回的对象，即为上下文中的数据，该数据必须满足类型约束，该方法会在每次render之后运行。
    getChildContext() {
        return {
            a: 789,//一般来源于状态或者组件
            c: "hello"//一般来源于状态或者组件
        }
    }

    render() {
        return <div>
            <h1>ChildA</h1>
            <h2>a:{this.context.a}，b:{this.context.b}</h2>
            <ChildB />
        </div>
    }
}
// 函数组件如何拿到上下文
/**
function ChildA(props, context) {
    return <div>
        <h1>ChildA</h1>
        <h2>a:{context.a}，b:{context.b}</h2>
        <ChildB />
    </div>
}

ChildA.contextTypes = types;

**/

class ChildB extends React.Component {

    //声明需要使用哪些上下文中的数据
    static contextTypes = {
        ...types,
        c: PropTypes.string
    }

    render() {
        return <p>
            ChildB，来自于上下文的数据：a: {this.context.a}, b:{this.context.b}
            ，c: {this.context.c}
            <button onClick = {() => {
                this.context.onChangeA(this.context.a + 2);
            }}>子组件的按钮，a+2</button>
        </p>
    }
}

export default class OldContext extends Component {

    //约束上下文中数据的类型
    static childContextTypes = types

    state = {
        a: 123,
        b: "abc"
    }

    //得到上下文中的数据    
    getChildContext() {
        console.log("获取新的上下文");
        return {
            a: this.state.a,
            b: this.state.b,
            onChangeA: (newA) => {
                this.setState({
                    a: newA
                })
            }
        }
    }

    render() {
        return (
            <div>
                <ChildA />
                <button onClick = {() => {
                    this.setState({
                        a: this.state.a + 1
                    })
                }}>a加1</button>
            </div>
        )
    }
}
```

## 新版API

旧版API存在严重的效率问题，并且容易导致滥用

1. 创建上下文
    
    上下文是一个独立于组件的对象，该对象通过`React.createContext`(默认值)创建
    
    返回的是一个包含两个属性的对象
    
    1. `Provider`属性：生产者。一个组件，该组件会创建一个上下文，该组件有一个value属性，通过该属性，可以为其数据赋值

        1. 同一个`Provider`，不要用到多个组件中，如果需要在其他组件中使用该数据，应该考虑将数据提升到更高的层次（重）

    2. `Consumer`属性

2. 使用上下文中的数据

    1. 在类组件中，直接使用`this.context`获取上下文数据

        1. 要求：必须拥有静态属性 `contextType` , 应赋值为创建的上下文对象

        2. 类组件也可以通过`Consumer`获取，此时不需要写静态属性`contextType` 

    2. 在函数组件中，需要使用`Consumer`来获取上下文数据

        1. Consumer是一个组件

        2. 它的子节点，是一个函数（它的props.children需要传递一个函数）

        3. 函数组件中不需要写静态属性`contextType`

3. 注意细节
    
    如果，上下文提供者（Context.Provider）中的value属性发生变化(Object.is比较)，会导致该上下文提供的所有后代元素全部重新渲染，无论该子元素是否有优化（无论shouldComponentUpdate函数返回什么结果）（重：实际上是强制更新forceUpdate）
    

```jsx
import React, { Component } from 'react'

const ctx = React.createContext();

class ChildB extends React.Component {

    static contextType = ctx;

    shouldComponentUpdate(nextProps, nextState) {
        console.log("运行了优化")
        return false;
    }

    render() {
        console.log("childB render");
        return (
            <h1>
                a:{this.context.a}，b:{this.context.b}
            </h1>
        );
    }
}

function ChildA(props) {
    return <div>
        <h1>ChildA</h1>
        <h2>
            <ctx.Consumer>
                {value => <>{value.a}，{value.b}</>}
            </ctx.Consumer>
        </h2>
        <ChildB />
    </div>
}

export default class NewContext extends Component {

    // 至于为什么要把上下文的数据放到state中再套一层，是因为只要
    // ctx。Provider中的value变化就会强制更新（不管使用上下文的子组件
    // 是否进行了优化shouldComponentUpdate），它是比较的地址，所以套一层
    // 如果上下文中的数据没有更新，子组件就会走正常的生命周期，不会跳过shouldComponentUpdate
    state = {
        ctx: {
            a: 0,
            b: "abc",
            changeA: (newA) => {
                this.setState({
                    a: newA
                })
            }
        }
    }

    render() {
        return (
			// 这地方使用state中的ctx
            <ctx.Provider value={this.state.ctx}>
                <div>
                    <ChildA />
                    <button onClick={() => {
                        this.setState({})
                    }}>父组件的按钮，a加1</button>
                </div>
            </ctx.Provider>
        )
    }
}
```
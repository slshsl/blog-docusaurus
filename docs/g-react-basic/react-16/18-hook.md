---
sidebar_position: 18
---

# hook

## 概述

HOOK是React16.8.0之后出现

组件：无状态组件（函数组件）、类组件

类组件中的麻烦：

1. this指向问题

2. 繁琐的生命周期

3. 其他问题

HOOK专门用于增强函数组件的功能（HOOK在类组件中是不能使用的），使之理论上可以成为类组件的替代品

官方强调：没有必要更改已经完成的类组件，官方目前没有计划取消类组件，只是鼓励使用函数组件

## 本质

HOOK（钩子）本质上是一个函数(命名上总是以use开头)，该函数可以挂载任何功能

## HOOK种类

1. useState

2. useEffect

3. 其他...

## State Hook

State Hook是一个在函数组件中使用的函数（useState），用于在函数组件中使用状态

useState

- 函数有一个参数，这个参数的值表示状态的默认值

- 函数的返回值是一个数组，该数组一定包含两项

    - 第一项：当前状态的值

    - 第二项：改变状态的函数

一个函数组件中可以有多个状态，这种做法非常有利于横向切分关注点。

:::tip

1. useState最好写到函数的起始位置，便于阅读

2. useState严禁出现在代码块（判断、循环）中

3. useState返回的函数（数组的第二项），引用不变（节约内存空间）

4. 使用函数改变数据，若数据和之前的数据完全相等（使用Object.is比较），不会导致重新渲染，以达到优化效率的目的。

5. 使用函数改变数据，传入的值不会和原来的数据进行合并，而是直接替换。

6. 如果要实现强制刷新组件

    1. 类组件：使用forceUpdate函数

    2. 函数组件：使用一个空对象的useState

7. 如果某些状态之间没有必然的联系，应该分化为不同的状态，而不要合并成一个对象

8. 和类组件的状态一样，函数组件中改变状态可能是异步的（在DOM事件中），多个状态变化会合并以提高效率，此时，不能信任之前的状态，而应该使用回调函数的方式改变状态。如果状态变化要使用到之前的状态，尽量传递函数。

:::

## Effect Hook

Effect Hook：用于在函数组件中处理副作用

副作用：

1. ajax请求

2. 计时器

3. 其他异步操作

4. 更改真实DOM对象

5. 本地存储

6. 其他会对外部产生影响的操作

函数：useEffect，该函数接收一个函数作为参数，接收的函数就是需要进行副作用操作的函数

1. 副作用函数的运行时间点，是在页面完成真实的UI渲染之后。因此它的执行是异步的，并且不会阻塞浏览器

    1. 与类组件中componentDidMount和componentDidUpdate的区别

    2. componentDidMount和componentDidUpdate，更改了真实DOM，但是用户还没有看到UI更新，同步的

    3. useEffect中的副作用函数，更改了真实DOM，并且用户已经看到了UI更新，异步的

2. 每个函数组件中，可以多次使用useEffect，但不要放入判断或循环等代码块中

3. useEffect中的副作用函数，可以有返回值，返回值必须是一个函数，该函数叫做清理函数

    1. 该函数运行时间点，在每次运行副作用函数之前

    2. 首次渲染组件不会运行

    3. 组件被销毁时一定会运行

4. useEffect函数，可以传递第二个参数

    1. 第二个参数是一个数组

    2. 数组中记录该副作用的依赖数据

    3. 当组件重新渲染后，只有依赖数据与上一次不一样的时，才会执行副作用

    4. 所以，当传递了依赖数据之后，如果数据没有发生变化

        1. 副作用函数仅在第一次渲染后运行

        2. 清理函数仅在卸载组件后运行

5. 副作用函数中，如果使用了函数上下文中的变量，则由于闭包的影响，会导致副作用函数中变量不会实时变化。
    
    ```jsx
    import React, { useState, useEffect } from 'react'
    
    export default function App() {
        const [n, setN] = useState(0)
        useEffect(() => {
            setTimeout(() => {
                console.log(n); //n指向，当前App函数调用时的n
            }, 5000);
        })
        return (
            <div>
                <h1>{n}</h1>
                <button onClick={() => {
                    setN(n + 1);
                }}>n+1</button>
            </div>
        )
    }
    ```

6. 副作用函数在每次注册时，会覆盖掉之前的副作用函数，因此，尽量保持副作用函数稳定，否则控制起来会比较复杂

    ```jsx
    import React, { useState, useEffect } from 'react'
    
    let n = 1;
    
    function func1() {
        console.log("odd 副作用函数")
        return () => {
            console.log("odd 清理函数")
        }
    }
    
    function func2() {
        console.log("even 副作用函数")
        return () => {
            console.log("even 清理函数")
        }
    }
    
    export default function App() {
        const [, forceUpdate] = useState({})
        useEffect(n % 2 === 0 ? func2 : func1);
        n++;
        return (
            <div>
                <button onClick={() => {
                    forceUpdate({});
                }}>强制刷新</button>
            </div>
        )
    }
    ```

## 自定义Hook

State Hook： useState 

Effect Hook：useEffect

自定义Hook：将一些常用的、跨越多个组件的Hook功能，抽离出去形成一个函数，该函数就是自定义Hook，自定义Hook，由于其内部需要使用Hook功能，所以它本身也需要按照Hook的规则实现：

1. 函数名必须以use开头
2. 调用自定义Hook函数时，应该放到顶层

例如：

1. 很多组件都需要在第一次加载完成后，获取所有学生数据
2. 很多组件都需要在第一次加载完成后，启动一个计时器，然后在组件销毁时卸载

> 使用Hook的时候，如果没有严格按照Hook的规则进行，eslint的一个插件（eslint-plugin-react-hooks）会报出警告


## Reducer Hook

### 数据流相关概念

1. 规定了数据是单向流动的

2. **数据存储在数据仓库中（目前，可以认为state就是一个存储数据的仓库）**

3. **action是改变数据的唯一原因（本质上就是一个对象，action有两个属性）**

    1. **type：字符串，动作的类型**

    2. **payload：任意类型，动作发生后的附加信息**

    3. 例如，如果是添加一个学生，action可以描述为：

        1. `{ type:"addStudent", payload: {学生对象的各种信息} }`

    4. 例如，如果要删除一个学生，action可以描述为：

        1. `{ type:"deleteStudent", payload: 学生id }`

4. **具体改变数据的是一个函数，该函数叫做reducer**

    1. **该函数接收两个参数**

        1. **state：表示当前数据仓库中的数据**

        2. **action：描述了如何去改变数据，以及改变数据的一些附加信息**

    2. **该函数必须有一个返回结果，用于表示数据仓库变化之后的数据**

        1. Flux要求，对象是不可变的，如果返回对象，必须创建新的对象

    3. **reducer必须是纯函数，不能有任何副作用**

5. **如果要触发reducer，不可以直接调用，而是应该调用一个辅助函数dispatch**

    1. 该函数仅接收一个参数：action

    2. 该函数会间接去调用reducer，以达到改变数据的目的

### useReducer

```jsx
import React from "react"
**import useReducer from "./useReducer"**

/**
 * 该函数，根据当前的数据，已经action，生成一个新的数据
 * @param {*} state 
 * @param {*} action 
 */
function reducer(state, action) {
    switch (action.type) {
        case "increase":
            return state + 1;
        case "decrease":
            if (state === 0) {
                return 0;
            }
            return state - 1;
        default:
            return state;
    }
}

export default function App() {
    // useReducer
    // 第一个参数是reducer
    // 第二个参数是初始值
    // 第三个参数是一个函数，该函数的返回值作为初始值，函数的参数为第二个参数
    const [n, dispatch] = useReducer(reducer, 10, (args) => {
        console.log(args)
        return 100
    });
    return (
        <div>
            <button onClick={() => {
                dispatch({ type: "decrease" })
            }}>-</button>
            <span>{n}</span>
            <button onClick={() => {
                dispatch({ type: "increase" })
            }}>+</button>
        </div>
    )
}
```

### 手写useReducer

```jsx
import { useState } from "react"
/**
 * 通用的useReducer函数
 * @param {function} reducer reducer函数，标准格式
 * @param {any} initialState 初始状态
 * @param {function} initFunc 用于计算初始值的函数
 */
export default function useReducer(reducer, initialState, initFunc) {
    const [state, setState] = useState(initFunc? initFunc(initialState): initialState)

    function dispatch(action) {
        const newState = reducer(state, action)
        console.log(`日志：n的值  ${state}->${newState}`)
        setState(newState);
    }

    return [state, dispatch];
}
```

## Context Hook

用于获取上下文数据

```jsx
import React, { useContext } from 'react'

const ctx = React.createContext();

// function Test() {
//     return <ctx.Consumer>
//         {value => <h1>Test，上下文的值：{value}</h1>}
//     </ctx.Consumer>
// }

function Test() {
    const value = useContext(ctx);
    return <h1>Test，上下文的值：{value}</h1>
}

export default function App() {
    return (
        <div>
            <ctx.Provider value="abc">
                <Test />
            </ctx.Provider>
        </div>
    )
}
```

## Callback Hook

函数名：useCallback

用于得到一个固定引用值的函数，通常用它进行性能优化

useCallback:该函数有两个参数

1. 函数，useCallback会固定该函数的引用，只要依赖项没有发生变化，则始终返回之前函数的地址

2. 数组，记录依赖项

该函数返回：引用相对固定的函数地址

```jsx
import React, { useState, useCallback } from 'react'

class Test extends React.PureComponent {

    render() {
        console.log("Test Render")
        return <div>
            <h1>{this.props.text}</h1>
            <button onClick={this.props.onClick}>改变文本</button>
        </div>
    }
}

function Parent() {
    console.log("Parent Render")
    const [txt, setTxt] = useState(1)
    const [n, setN] = useState(0)
    const handleClick = **useCallback**(() => {
        setTxt(txt + 1)
    }, [txt])

    return (
        <div>
            {
                /* 函数的地址每次渲染都发生了变化，导致了子组件跟着重新渲染,
                    若子组件是经过优化的组件，则可能导致优化失效 
                */
            }
            <Test text={txt} onClick={handleClick} />
            <input type="number"
                value={n}
                onChange={e => {
                    setN(parseInt(e.target.value))
                }}
            />
        </div>
    )
}

export default function App() {

    return (
        <div>
            <Parent />
        </div>
    )
}
```

## Memo Hook

用于保持一些比较稳定的数据，通常用于性能优化

如果React元素本身的引用没有发生变化，一定不会重新渲染（重）

```jsx
import React, { useState, useMemo } from 'react'

class Test extends React.PureComponent {

    render() {
        console.log("Test Render")
        return <div>
            <h1>{this.props.text}</h1>
            <button onClick={this.props.onClick}>改变文本</button>
        </div>
    }
}

function Parent() {
    console.log("Parent Render")
    const [txt, setTxt] = useState(1)
    const [n, setN] = useState(0)
    const handleClick = **useMemo**(() => {
        return () => {
            setTxt(txt + 1)
        };
    }, [txt])

    return (
        <div>
            {/* 函数的地址每次渲染都发生了变化，导致了子组件跟着重新渲染，若子组件是经过优化的组件，则可能导致优化失效 */}
            <Test text={txt} onClick={handleClick} />
            <input type="number"
                value={n}
                onChange={e => {
                    setN(parseInt(e.target.value))
                }}
            />
        </div>
    )
}

export default function App() {

    return (
        <div>
            <Parent />
        </div>
    )
}
```

```jsx
import React, { useState, useMemo } from 'react'

function Item(props) {
    // console.log("Item Render " + props.value);
    return <li>{props.value}</li>
}

export default function App() {
    const [range,] = useState({ min: 1, max: 10000 })
    const [n, setN] = useState(0)
    const list = useMemo(() => {
        const list = [];
        for (let i = range.min; i <= range.max; i++) {
            list.push(<Item key={i} value={i}></Item>)
        }
        return list;
    }, [range.min, range.max])
    // const list = [];
    // for (let i = range.min; i <= range.max; i++) {
    //     list.push(<Item key={i} value={i}></Item>)
    // }
    return (
        <div>
            <ul>
                {list}
            </ul>
            <input type="number"
                value={n}
                onChange={e => {
                    setN(parseInt(e.target.value))
                }}
            />
        </div>

    )
}
```

## Ref Hook

useRef函数：固定对象

函数组件中一般不要使用React.createRef()，使用useRef

1. 一个参数：默认值
2. **返回一个固定的对象，`{current: 值}`**

```jsx
import React, { useState, useRef } from 'react'
window.arr = [];

export default function App() {
    const inpRef = useRef();
    window.arr.push(inpRef);
    const [n, setN] = useState(0)
    return (
        <div>
            <input ref={inpRef} type="text" />
            <button onClick={() => {
                console.log(inpRef.current.value)
            }}>得到input的值</button>

            <input type="number"
                value={n}
                onChange={e => {
                    setN(e.target.value)
                }} />
        </div>
    )
}
```

## ImperativeHandle Hook

函数：useImperativeHandleHook

```jsx
import React, { useRef, useImperativeHandle } from 'react'

function Test(props, ref) {
    useImperativeHandle(ref, () => {
        //如果不给依赖项，则每次运行函数组件都会调用该方法
        //如果使用了依赖项，则第一次调用后，会进行缓存，只有依赖项发生变化时才会重新调用函数
        //相当于给 ref.current = 1
        return {
            method(){
                console.log("Test Component Called")
            }
        }
    }, [])
    return <h1>Test Component</h1>
}

const TestWrapper = React.forwardRef(Test)

// class Test extends React.Component {

//     method() {
//         console.log("Test method called");
//     }

//     render() {
//         return <h1>Test Component</h1>
//     }
// }

export default function App() {
    // const [, forceUpdate] = useState({})
    const testRef = useRef();
    return (
        <div>
            <TestWrapper ref={testRef} />
            <button onClick={() => {
                testRef.current.method();
                // console.log(testRef)
                // forceUpdate({})
            }}>点击调用Test组件的method方法</button>
        </div>
    )
}
```

## LayoutEffect Hook

useEffect：浏览器渲染完成后，用户看到新的渲染结果之后 useLayoutEffectHook：完成了DOM改动，但还没有呈现给用户

应该尽量使用useEffect，因为它不会导致渲染阻塞，如果出现了问题，再考虑使用useLayoutEffectHook

```jsx
import React, { useState, useLayoutEffect, useRef } from 'react'

export default function App() {
    const [n, setN] = useState(0)
    const h1Ref = useRef();
    useLayoutEffect(() => {
        h1Ref.current.innerText = Math.random().toFixed(2);
    })
    return (
        <div>
            <h1 ref={h1Ref}>{n}</h1>
            <button onClick={() => {
                setN(n + 1)
            }}>+</button>
        </div>
    )
}
```

## DebugValue Hook
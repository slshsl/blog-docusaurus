---
sidebar_position: 10
---

# ref

## 概述

场景：希望直接使用dom元素中的某个方法，或者希望直接使用自定义组件中的某个方法

## reference: 引用 

1. ref作用于内置的html组件，得到的将是真实的dom对象

2. ref作用于类组件，得到的将是类的实例

3. ref不能作用于函数组件

```jsx
import React, { Component } from 'react'

class A extends Component {

    method() {
        console.log("调用了组件A的方法")
    }

    render() {
        return <h1>组件A</h1>
    }
}

export default class Comp extends Component {

    handleClick = () => {
        console.log(this);
        this.refs.txt.focus();
        this.refs.compA.method();
    }

    render() {
        return (
            <div>
                **<input ref="txt" type="text" />**
                <A ref="compA" />
                {/* <B ref="compB" /> */}
                <button onClick={this.handleClick}>聚焦</button>
            </div>
        )
    }
}
```

## React.createRef

ref不再推荐使用字符串赋值，字符串赋值的方式将来可能会被移出

目前，ref推荐使用对象或者是函数

- **对象**
        
    通过 React.createRef 函数创建

    ```jsx
    import React, { Component } from 'react'

    export default class Comp extends Component {

        constructor(props){
            super(props);
            **this.txt = React.createRef();**
        }

        handleClick = () => {
            this.txt.current.focus();
        }

        render() {
            return (
                <div>
                    <input ref={this.txt} type="text" />
                    <button onClick={this.handleClick}>聚焦</button>
                </div>
            )
        }
    }
    ```

- 函数
    
    函数的调用时间：
    
    1. componentDidMount的时候会调用该函数
    
        1. 在componentDidMount事件中可以使用ref

    2. 如果ref的值发生了变动（旧的函数被新的函数替代），分别调用旧的函数以及新的函数，时间点出现在componentDidUpdate之前

        1. 旧的函数被调用时，传递null

        2. 新的函数被调用时，传递对象

    3. 如果ref所在的组件被卸载，会调用函数
    
    ```jsx
    import React, { Component } from 'react'
    
    export default class Comp extends Component {
    
        state = {
            show: true
        }
    
        handleClick = () => {
            // this.txt.focus();
            this.setState({
                show: !this.state.show
            });
        }
    
        componentDidMount() {
            console.log("didMount", this.txt);
        }
    
        getRef = el => {
            console.log("函数被调用了", el);
            this.txt = el;
        }
    
        render() {
    
            return (
                <div>
                    {
                        this.state.show && <input ref={this.getRef} type="text" />
                    }
                    <button onClick={this.handleClick}>显示/隐藏</button>
                </div>
            )
        }
    }
    ```
        
- 谨慎使用ref
    
    能够使用属性和状态进行控制，就不要使用ref

    1. 调用真实的DOM对象中的方法

    2. 某个时候需要调用类组件的方法

## ref转发

forwardRef方法：

1. 参数，传递的是函数组件，不能是类组件，并且，函数组件需要有第二个参数来得到ref
2. 返回值，返回一个新的组件

```jsx
import React from 'react'

function A(props, ref) {
    return <h1 ref={ref}>
        组件A
        <span>{props.words}</span>
    </h1>
}

//传递函数组件A，得到一个新组件NewA
const NewA = React.forwardRef(A);

export default class App extends React.Component {

    ARef = React.createRef()

    componentDidMount() {
        console.log(this.ARef);
    }

    render() {
        return (
            <div>
                <NewA ref={this.ARef} words="hello" />
                {/* this.ARef.current:  h1 */}
            </div>
        )
    }
}
```
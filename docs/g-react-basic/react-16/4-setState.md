---
sidebar_position: 4
---

# setState

## 概述

## 注意事项

- setState，它对状态的改变，可能是异步的

    如果改变状态的代码处于某个HTML元素的事件中，则其是异步的，否则是同步

- 如果遇到某个事件中，需要同步调用多次，需要使用函数的方式得到最新状态

- 最佳实践

    - 把所有的setState当作是异步的

    - 永远不要信任setState调用之后的状态

    - 如果要使用改变之后的状态，需要使用回调函数（setState的第二个参数）

    - 如果新的状态要根据之前的状态进行运算，使用函数的方式改变状态（setState的第一个参数）

    - React会对异步的setState进行优化，将多次setState进行合并（将多次状态改变完成后，再统一对state进行改变，然后触发render）

```jsx
import React, { Component } from 'react'

export default class Comp extends Component {

    state = {
        n: 0
    }

    // constructor(props) {
    //     super(props);
    //     setInterval(() => {
		**//     构造函数中是同步的**    
    //         this.setState({
    //             n: this.state.n + 1
    //         });

    //         this.setState({
    //             n: this.state.n + 1
    //         });
    //         this.setState({
    //             n: this.state.n + 1
    //         });
    //     }, 1000)
    // }

    handleClick = () => {
        this.setState(cur => {
            **//参数cur表示当前的状态
            //该函数的返回结果，会混合（覆盖）掉之前的状态
            //该函数是异步执行**
            return {
                n: cur.n + 1
            }
        }, ()=>{
            **//所有状态全部更新完成()，并且重新渲染后执行,**					
            console.log("state更新完成", this.state.n);
        });

        this.setState(cur => ({
            n: cur.n + 1
        }));

        this.setState(cur => ({
            n: cur.n + 1
        }));
    }

    render() {
        console.log("render");
        return (
            <div>
                <h1>
                    {this.state.n}
                </h1>
                <p>
                    <button onClick={this.handleClick}>+</button>
                </p>
            </div>
        )
    }
}
```

## react设计思路

不在html元素的事件里面就是同步的，具体设计的原因是通常情况下在元素的事件里处理的东西很多

比如果一个按钮的点击事件，点击事件要做10件事情，这10件事情是分散到10个函数中去完成的

有可能每个函数都需要改变状一个态，如果不加限制就会触发10次更新，这样效率太低了

所以改成异步，把它们放到一个队列里，等所有状态改变完成后，再去渲染

而react认为如果不在dom事件里，一般不会做一些复杂的处理，所以是同步的

比如上面注释的**constructor中的**代码就是同步执行的，每次setState就是渲染调用一次render,所以构造函数中的每隔一秒就会调用三次render（即每次调用setState就会触发render,且下面的setState中的状态是可以信任的，是再上一次状态变化之后的下一个状态）
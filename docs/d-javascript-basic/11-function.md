---
sidebar_position: 11
---

# 函数

## 函数提升

- 通过字面量声明的函数,会提升到脚本块的顶部.

- 当函数成为一个表达式时,它既不会提升,也不会污染全局对象.

## 函数内部声明的变量

- 如果不使用var声明,和全局变量一致,表示给全局对象添加属性

- 如果使用var声明,变量提升到所在函数的顶部,函数外部不可以使用该变量

- 函数中声明的变量,仅能在函数中使用,在外部无效

## 函数返回值

- return 会直接结束整个函数的运行

- return 后面如果不跟任何数据,返回undefined

- 如果函数中没有书写return,则该函数会在末尾自动return undefined.

## 同名参数

- **如果有同名的参数,则取最后出现的那个值**
    
    ```js
    function f(a, a) {
        console.log(a);
    }
    f(1, 2) // 2
    ```
    
    上面代码中,函数f()有两个参数,且参数名都是a.取值的时候,以后面的a为准,即使后面的a没有值或被省略,也是以其为准.
    
    ```js
    function f(a, a) {
        console.log(a);
    }
    f(1) // undefined
    ```
    
    调用函数f()的时候,没有提供第二个参数,a的取值就变成了undefined.这时,如果要获得第一个a的值,可以使用arguments对象.
    
    ```js
    function f(a, a) {
    	console.log(arguments[0]);
    }
    f(1) // 1
    ```
---
sidebar_position: 3
---

# Number类型转换

`Number`背后的转换规则比较复杂,分成两种情况讨论：

- 参数是原始类型的值

- 参数是对象

## 原始类型转Number

- 数值：转换后还是原来的值

    ```jsx
    Number(324) // 324
    ```

- 字符串：
    1. 如果可以被解析为数值,则转换为相应的数值
        
        ```jsx
        Number('324') // 324
        ```
        
    2. 如果不可以被解析为数值,返回 `NaN`
        
        ```jsx
        Number('324abc') // NaN
        ```
        
    3. 空字符串转为0
        
        ```jsx
        Number('') // 0
        ```
        
- 布尔值：`true` 转成 1,`false` 转成 0
    
    ```jsx
    Number(true) // 1
    Number(false) // 0
    ```
    
- `undefined`：转成 `NaN`
    
    ```jsx
    Number(undefined) // NaN
    ```
    
- `null`：转成0
    
    ```jsx
    Number(null) // 0
    ```
    

## 对象转Number

1. 第一步,调用对象自身的`valueOf`方法.如果返回原始类型的值,则直接对该值使用`Number`函数,不再进行后续步骤.

2. 第二步,如果`valueOf`方法返回的还是对象,则改为调用对象自身的`toString`方法.如果`toString`方法返回原始类型的值,则对该值使用`Number`函数,不再进行后续步骤.

3. 第三步,如果`toString`方法返回的是对象,就报错.
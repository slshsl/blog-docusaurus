---
sidebar_position: 13
---

# 原型

## 函数对象与普通对象

- 所有的函数也是对象

- 所有对象都是通过```new 函数```创建

:::tip

`Function` 这个函数(也是对象),是浏览器引擎注入的

:::

```mermaid
graph TD;
    A[Function函数] -- new --> B(Object);
    A -- new --> C(Array);
    A -- new --> D(Date);
    A -- new --> E(...);
    B -- new --> F(普通对象);
    C -- new --> G(普通对象);
    D -- new --> H(普通对象);
    E -- new --> I(普通对象);
```

## 函数原型

- 所有函数都有一个属性：prototype,称之为函数原型

:::tip

例外:箭头函数没有函数原型

:::

- 默认情况下,prototype是一个普通的Object对象

- 默认情况下,prototype中有一个属性,constructor,它也是一个对象,它指向构造函数本身

```mermaid
graph TD;
    A[Function函数] -- new --> B(Object);
    A -- new --> C(Array);
    A -- new --> D(Date);
    A -- new --> E(...);
    B -- prototype --> F(Object的原型);    
    C -- prototype --> G(Array的原型);
    D -- prototype --> H(Date的原型);
    E -- prototype --> I(...的原型);
    F -- constructor --> B;    
    G -- constructor --> C;
    H -- constructor --> D;
    I -- constructor --> E;
```

## 隐式原型

- 所有的对象都有一个属性：`__proto__`，称之为隐式原型
    
:::tip

`Object.creat(null)`，得到的结果也是对象，但该对象没有隐式原型

代理对象也有没有隐式原型

:::

- 默认情况下，**隐式原型指向创建该对象的函数的原型**

```mermaid
graph TD;
    A[add函数] -- new --> B(对象1);
    A -- new --> C(对象2);   
    A -- prototype --> D(add的原型);
    D -- constructor --> A;
    B -- __proto__ --> D;
    C -- __proto__ --> D;
```
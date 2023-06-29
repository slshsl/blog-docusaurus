---
sidebar_position: 4
---

# String类型转换

`String`背后的转换规则比较复杂。分成两种情况讨论：

- 一种是参数是原始类型的值

- 另一种是参数是对象

## 原始类型转String

- 数值：转为相应的字符串

    ```jsx
    String(324) // '324'
    ```

- 字符串：转换后还是原来的值

    ```jsx
    String('asd') // 'asd'
    ```

- 布尔值：`true`转为字符串'true'，`false`转为字符串'false'

    ```jsx
    String(true); // 'true'
    String(false); // 'false'
    ```

- `undefined`：转为字符串'undefined'

    ```jsx
    String(undefined) // 'undefined'
    ```

- `null`：转为字符串'null'

    ```jsx
    String(null) // 'null'
    ```

## 对象转String

1. 第一步：先调用对象自身的`toString`方法。如果返回原始类型的值，则对该值使用`String`函数，不再进行以下步骤。

2. 第二步：如果`toString`方法返回的是对象，再调用原对象的`valueOf`方法。如果`valueOf`方法返回原始类型的值，则对该值使用`String`函数，不再进行以下步骤。

3. 第三步：如果`valueOf`方法返回的是对象，就报错。
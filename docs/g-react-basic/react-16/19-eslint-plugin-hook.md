---
sidebar_position: 19
---

# eslint-plugin-react-hooks

## 概述

我们在使用Hooks时需要遵循一定的规则,这应用在日常的开发中,就必须时刻注意不能写错

## 使用Hooks需要遵循一定规则

- 在 useEffect 的回调函数中使用的变量，都必须在依赖项中声明；

- Hooks 不能出现在条件语句或者循环中，也不能出现在 return 之后；

- Hooks 只能在函数组件或者自定义 Hooks 中使用

React 官方为我们提供了一个 ESLint 的插件，专门用来检查 Hooks 是否正确被使用,它就是 eslint-plugin-react-hooks 

通过这个插件，如果发现缺少依赖项定义这样违反规则的情况，就会报一个错误提示（类似于语法错误的提示），方便进行修改，从而避免 Hooks 的错误使用。

## 使用步骤

- 安装插件：npm install eslint-plugin-react-hooks --save-dev

- 修改ESLint 配置文件

    ```js
    {
        "plugins": [
            // ...
            "react-hooks"
        ],
        "rules": {
            // ...
            // 检查 Hooks 的使用规则
            "react-hooks/rules-of-hooks": "error",
            // 检查依赖项的声明
            "react-hooks/exhaustive-deps": "warn"
        }
    }
    ```
---
sidebar_position: 35
---

# GPU加速

## 概述

## 开启调试方法

chrome在更多里打开rendering与layers

## demo

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .div {
        width: 100px;
        height: 100px;
        background-color: red;
        margin: 0 auto;
        animation: fade-num ease-in 2s;
        animation-fill-mode: forwards;
        position: absolute;
        left: 20px;
        top: 600px;
        /* will-change:left; */
      }
      @keyframes fade-num {
        50% {
          left: 80px;
          /* transform: translateX(80px); */
          /* opacity: 0; */
        }
        100% {
          left: 140px;
          /* transform: translateX(140px); */
          /* opacity: 0; */
        }
      }
    </style>
  </head>
  <body>
    <div class="div">这是一个想做平移的div</div>
  </body>
</html>
```
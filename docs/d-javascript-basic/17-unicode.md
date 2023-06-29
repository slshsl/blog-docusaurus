---
sidebar_position: 17
---

# Unicode

## 概述

早期，由于存储空间宝贵，Unicode使用16位二进制来存储文字

## Code Unit

将一个16位的二进制编码叫做一个码元（Code Unit）,Js中取字符串得长度是按码元得个数来计算长度得

## Code Point

由于技术的发展，Unicode对文字编码进行了扩展，将某些文字扩展到了32位（占用两个码元），并且将某个文字对应的二进制数字叫做码点（Code Point）

## codePointAt

ES6为了解决这个问题，为字符串提供了方法：codePointAt;

根据字符串码元的位置得到其码点。同时，ES6为正则表达式添加了一个flag: u，如果添加了该配置，则匹配时，使用码点匹配。
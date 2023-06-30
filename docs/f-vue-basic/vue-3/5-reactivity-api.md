---
sidebar_position: 5
---

# 响应式API

## 概述

## 响应式API

| API        | 传入                   | 返回             | 备注                                                                                                                |
| ---        | ---                   | ---             | ---                                                                                                                  |
| reactive   | plain-object          | 对象代理         | 深度代理对象中的所有成员                                                                                               |
| readonly   | plain-object or proxy | 对象代理         | 只能读取代理对象中的成员，不可修改                                                                                      |
| ref        | any                   | { value: ... }  | 对value的访问是响应式的<br />如果给value的值是一个对象<br />则会通过reactive函数进行代理<br />如果已经是代理，则直接使用代理 |
| computed   | function              | { value: ... }  | 当读取value值时，会根据情况决定是否要运行函数                                                                            |

## 响应式辅助API

|API        | 含义                                  |
|---        | ---                                   |
|isProxy    | 判断某个数据是否是由reactive或readonly  |
|isReactive | 判断某个数据是否是通过reactive创建的     |
|isReadonly | 判断某个数据是否是通过readonly创建的    |
|isRef      | 判断某个数据是否是一个ref对象           |  
---
sidebar_position: 4
---

# 浏览器存储

## 概述

## cookie

cookie 兼容性较好，所有浏览器均支持

浏览器针对 cookie 会有一些默认行为，比如当响应头中出现`set-cookie`字段时，浏览器会自动保存 cookie 的值

再比如，浏览器发送请求时，会附带匹配的 cookie 到请求头中

这些默认行为，使得 cookie 长期以来担任着维持登录状态的责任

与此同时，也正是因为浏览器的默认行为，给了恶意攻击者可乘之机，CSRF 攻击就是一个典型的利用 cookie 的攻击方式

虽然 cookie 不断的改进，但前端仍然需要另一种更加安全的保存数据的方式

cookie 的大小是有限制的，一般浏览器会限制同一个域下的 cookie 总量为 4M

cookie 会与 domain、path 关联

## sessionStorage 

sessionStorage 用于保存会话级别的数据

sessionStorage 只与 domain 关联

## localStorage

localStorage 用于更持久的保存数据

localStorage 只与 domain 关联

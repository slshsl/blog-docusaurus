---
sidebar_position: 20
---

# 随机数

## 概述

- PRNG(PseudoRandom Number Generator)：伪随机数生成器

    Math.random()使用的一个名为 xorshift 128+的算法来模拟随机的特性

- CSPRNG(Cryptographically Secure PseudoRandom Number Generator)：密码学安全伪随机数生成器

    crypto.getRandomValues(typedArray)
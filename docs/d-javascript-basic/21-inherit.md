---
sidebar_position: 21
---

# 继承

## 概述

- 原型链继承

    - 原理：将子的原型设置为**父的实例（调用父的构造函数）**;利用原型链实现继承

    - 缺点：原型中包含的引用值会在所有实例间共享;**基本不会单独使用**

- 构造函数继承（盗用构造函数）

    - 原理：**子中构造函数调用父的构造函数**

    - 缺点：无法共享父原型上的方法，除非把方法定义在父的构造函数中;**基本不会单独使用**

- 组合式继承

    - 原理：**原型链继承结合构造函数继承**

    - 缺点：父的构造函数调用两次，一次在子构造函数中，一次在子原型赋值;

- 原型式继承

    - 原理：Object.create()方法就是根据此种继承规范化的，主要是在**一个对象的基础上再创建一个新对象**

    - **与原型链继承的区别：这种方法并没有使用严格意义上的构造函数,借助原型可以基于已有的对象创建新的对象**

    - 缺点：**原型中包含的引用值会在所有实例间共享**（与原型链继承一致）;

- 寄生式继承

    - 原理：**创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。**

    - 理解：理解就是在原型式继承的工厂模式，除了及成员对象原有的属性，同时增加新的属性的方法

    - 缺点：**原型中包含的引用值会在所有实例间共享**（与原型链继承一致）;方法无法共享

- 寄生式组合继承

    - 原理：**寄生组合式继承, 即通过借用构造函数来继承属性, 在原型上添加共用的方法, 通过寄生式实现继承.**

    - 缺点：属性与方法分开

- ES6 class 继承
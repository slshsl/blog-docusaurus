---
slug: typescript
title: Typescript
authors: leo
date: 2023-06-29T00:00
tags: [零碎]
---

![Alt text](img/typescript.png)

# 前言

为什么要用`TypeScript`（简称`TS`）？从开发的角度来讲，好处很多，例如代码规范、可阅读性、可维护性、智能提示、类型安全等等；从性能上来讲利用`TS`写出的代码有利于`V8`引擎进行优化；简单举例，`V8`引擎如果发现一个函数执多次，参数类型都一样，这时候`V8`引擎可以对代码进行热优化（具体不展开）。

本人之前使用过`Angular`框架，对`TS`自认为有一定的了解；那既然`TS`有这么多好处，值得我们深入的研究一下；结果不知不觉中，从了解协变、逆变开始逐渐走入了一个无底的深渊；于是乎打算以这篇文章为终点，回到温暖的大地的怀抱，仰望天空，继续发呆。

## 概念

在查找资料的过程中，特别是在`TS`官网文档中读到可靠性（`Soundness`）一词，是我开始感觉掉入深渊的开始；看了几篇关于数理逻辑的入门，猛然间发现我这是在看什么；关于具体的专业术语就不提了，基本上是看了就忘，也不误人子弟了；只是从中感觉出可以从逆变的角度来看待什么是可靠性；在此之前，我们先了解一下一些概念。

## 类型系统

类型系统有结构化类型（`Structural Typing`）与名义类型（`Nominal Typing`）之分，首先解释一下什么是结构化类型。

### 结构化类型

一言以概之，就是如果两个类型具有相同的结构或者说形状，那么这两个类型是相互兼容的（这里不展开讨论结构化子类型）。示例代码如下：

```typescript
interface Point2D {
    x: number;
    y: number;
}

interface Location2D {
    x: number;
    y: number;
}

let point: Point2D = {
    x: 1,
    y: 1
};

let location: Location2D = {
    x: 2,
    y: 2
};

location = point; // Ok
point = location; // Ok
```

```typescript
class Point2D {
    constructor(public x: number, public y: number) {}
}

class Location2D {
    constructor(public x: number, public y: number) {}
}

let point: Point2D = new Location2D(1, 1); // Ok
let location: Location2D = new Point2D(2, 2); // Ok
```

### 名义类型

名义类型是通过明确的声明和类型名称来判断两个类型是否相互兼容（这里也不展开讨论名义子类型）；简单来讲就是看一下类型名称是否相同，不相同就不能相互兼容。示例代码如下：

```typescript
class Point2D {
    constructor(public x: number, public y: number) {}
}

class Location2D {
    constructor(public x: number, public y: number) {}
}

let point: Point2D = new Location2D(1, 1); // Error
let location: Location2D = new Point2D(2, 2); // Error
```

在该类型系统中，以上代码是会报错的。

### TS的类型系统及原因

`TS`选择了结构化类型，`Flow`是一种结构化类型与名义类型混合的类型系统；至于为什么`TS`选择结构化类型，而`Flow`选择两者的混合，大概是结构化类型更适合`JavaScript`（简称`JS`）这种动态语言，结构化类型中类型兼容的原则即结构化子类型与`JS`中会经常使用的鸭子辩型法非常相似，且能更好得保持其原有的灵活性；目的是为了`JS`开发人员以更少的认知负担去使用`TS`（`Flow`没有接触过，期待大神的解惑）。

## 集合

提及集合（`Set`）的概念，主要是为了后面更好得理解结构化子类型的原则。在此之前我们先以相互兼容的类型来举个例子，为什么集合更为容易被人理解。

```typescript
type TypeA = 1 | 2 | 3;
type TypeB = 1 | 2 | 3;
let a: TypeA;
let b: TypeB = 1;
a = b; // Ok
```

我们从结构化类型的定义来理解上面为什么变量`a`、`b`可以相互兼容，就是说`TypeA`和`TypeB`具有相同的结构；但感觉来讲用`TypeA`和`TypeB`是相同的集合来解释，是不是更容易让人理解，所以我们这引入集合的概念；在后面讲到类型兼容时，特别是`TS`中的联合类型时，用集合的关系来判断子类型更加容易理解。

这里想要说明一下，为什么在本篇文章中的示例代码中定义了许多结构一样的而名字不同的类型，不是多此一举吗？因为对于一个系统来说，有一些数据需要区分开来，即使它们有相同的结构；所以利用类型加以区分，是有对应的实际应用场景的。

Ok，到这里，概念准备得差不多了，下面来聊一下类型兼容。

## 类型兼容

类型兼容（`Type Compatibility`），就是判断类型间的兼容性。

在`TS`官网中提到，在一个语言的类型中并没有关于兼容的定义，关于判断类型兼容用两个术语来表示，一种是可分配（`Assignment`），一种是子类型（`SubType`）；并且接着说道，在实际应用中，类型的兼容性取决于可分配，即使在使用`implements`与`extends`得时候也是。

> [TypeScript: Documentation - Type Compatibility (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/type-compatibility.html#advanced-topics)

个人的理解是：

1.  **只要可分配，那一定兼容，只要兼容，一定可分配，他们之间是充分必要条件**；
2.  **一个类型是另一个类型的子类型，也有可能出现不兼容的场景，这些特殊的场景用是否可分配来描述**。

写到这想起了`Soundness`与`Completeness`的概念，恐怖的数理逻辑，恐怖的自然演绎规则，说实话，看了一点就没往下看，等有机会吧。之前认为逻辑这东西有啥难的，编程的`if else`，多容易，真是丢人丢到家了；下面分别表述一下可分配与子类型。

### 可分配

可分配用于判断类型间的兼容，就是如果`TypeA`类型的变量`a`，可以分配给`TypeB`类型的变量`b`，那么`TypeB`类型是兼容`TypeA`类型的。

### 子类型

子类型有两种，一种就是名义类型系统中的名义子类型（`Nominal Subtyping`），这种子类型就是两个类型之间通过显示的声明（比如`extends`）形成父子类型关系，这与里氏替换原则所表述得子类的实例可以赋值给父类的实例是一样的；另一种就是结构类型系统中的结构子类型（`Structural Subtyping`），两个类型之间无需通过显示得声明，而是仅从结构上就可以形成父子类型关系。

子类型用于判断类型间的兼容，就是父类型兼容子类型；

从类型安全角度来讲，子类型的变量分配给父类型的变量是类型安全的，但这不是绝对的，有些场景下，父类型的变量分配给子类型的变量才是类型安全的。

### TS的类型兼容设计

**`TS`是结构化类型系统，其类型兼容是基于结构化子类型的基本原则上扩展了许多原则，这些原则采用是否可分配来描述是否类型兼容**。

个人认为这些扩展的原则，不能再用结构化子类型的概念来描述，比如扩展的任何类型的变量都可以分配给`any`类型的变量，就说任何类型都是`any`类型的子类型是不恰当地；这个规则只是让`any`类型具有了`top type`的性质；由可分配原则带来的表象，以后我将用表现这个词来描述；比如我会说，`any`类型表现为`top type`；之所以这么较真，是因为类型兼容的规则太多了，如果不加以区分，特别让人觉得混乱，这也是写这篇文章的原因之一。

说了半天，忘记提及鸭子辩型法及其在`JS`中的应用，临时再加个小节吧。

### 鸭子类型

什么是鸭子类型，或者鸭子辩型法（`Duck Typing`）；引用一句名言，当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子。

```javascript
function isArrayLike(o) {
    if (
        o &&
        typeof o === 'object' &&
        isFinite(o.length) &&
        o.length >= 0 &&
        o.length === Math.floor(o.length) &&
        o.length < 2 ** 23
    ) {
        return true;
    } else {
        return false;
    }
}
```

上面的代码是鸭子辩型法在`JS`中的简单应用；调用`isArrayLike`函数，传入一个变量，如果返回为`true`，那传入的这个变量就可以认为是数组类型，即使有可能不是数组，而是一个类数组。

鸭子辩型法用语言来描述就是如果一个变量具备某种类型的特性，那便认为这个变量是这个类型的。可以看出鸭子辩型法是运行时的类型检查，出错也会在运行时。

`TS`中的结构化子类型是静态的类型检查，出错是在编译阶段；所以可以说结构化子类型是鸭子辩型法的静态实现；这也是我没有把鸭子类型放到结构化类型与名义类型的那个小节中一起描述的原因。

### 结构化子类型

结构化子类型（`Structural Subtyping`）的基本原则就是如果目标类型结构中的属性（包括属性的类型）在源类型结构中都存在对应的属性，那么就可以说源类型是目标类型的子类型（这个原则是和鸭子辩型法的原则是一样的，只是不同的表述而已）；举个例子来说明：

```typescript
interface Point2D {
    x: number;
    y: number;
}

interface Point3D {
    x: number;
    y: number;
    z: number;
}

let point2D: Point2D = { x: 1, y: 2 };
let point3D: Point3D = { x: 1, y: 2, z: 3 };

point2D = point3D; // Ok
```

在上面的例子中，`Point3D`类型的变量可以分配给`Point2D`类型的变量；这里目标类型结构是`Point2D`，源类型结构是`Point3D`。

**`TS`在基于结构化子类型基本原则的基础上，为了类型安全及考虑到`JS`的特点和典型写法，设计了或者应用了一些其他的原则，这些原则有的是和结构子类型的原则相悖的，有的是增加了一些类型。**

至此，基本的类型兼容原则清楚后，梳理一下`TS`的基础知识，对于熟悉`TS`的，可以跳至[TS 类型兼容中的其他原则](#heading-83)。

## TS 类型

### 对应JS原始类型

#### boolean

对应`JS`中的`boolean`原始类型数据的类型。

#### number

对应`JS`中的`number`原始类型数据的类型。

#### string

对应`JS`中的`string`原始类型数据的类型。

#### bigint

对应`JS`中的`bigint`原始类型数据的类型。

#### symbol

对应`JS`中的`symbol`原始类型数据的类型。

#### null

对应`JS`中的`null`原始类型数据的类型。

#### undefined

对应`JS`中的`undefined`原始类型数据的类型。

### 对应JS非原始类型

#### Object

对应`JS`中的`Object`类的实例的类型与`Object`类的构造函数的类型

```typescript
// Object类的实例的类型
let oi: Object;

// Object类的构造函数的类型
let oc: typeof Object;
```

#### object

对应`JS`中的`Object`类的实例中除原始类型数据的类型。

> `TS`官网中建议：`object` is not `Object`. **Always** use `object`!
> [TypeScript: Documentation - More on Functions (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/2/functions.html#object)

#### 空对象类型 {}

对应`JS`中的`Object`的函数原型的类型，`Object`类的无属性实例的类型.

#### Function

对应`JS`中的`Function`类的实例的类型与`Function`类的构造函数的类型

```typescript
// Function类的实例的类型
let fi: Function;

// Function类的构造函数的类型
let fc: typeof Function;
```

> `TS`官网中建议：This is an *untyped function call* and is generally best avoided because of the unsafe `any` return type.[TypeScript: Documentation - More on Functions (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/2/functions.html#function)

那在`TS`中如何定义函数类型，具体如下：

##### 函数类型表达式

函数类型表达式（`Function Type Expressions`）

```typescript
type move = (x: number, y: number) => void;
```

##### 调用签名

调用签名（`Call Signatures`）

```typescript
type move = {
    (x: number, y: number): void;
};
```

##### 构造签名

构造签名（`Construct Signatures`）

```typescript
class Point2D {
    constructor(public x: number, public y: number) {}
}

type Point2DConstructor = {
    new (x: number, y: number): Point2D;
};

function point2DFactory(ctor: Point2DConstructor): Point2D {
    return new ctor(1, 2);
}
```

#### Array

对应`JS`中的数组类型数据的类型。

### 对应JS索引类型

索引类型是TS中索引签名中索引的类型；首先什么是索引签名（`Index Signature`）？索引签名是当在定义一个类型时，在不知道类型属性名称，但知道属性的类型时，采用的一种语法。

```typescript
interface OnlyTest {
    [index: number]: string;
}
```

`TS`主要有4种索引类型：`string`、`number`、`symbol`、`template string patterns`，对应4种索引签名；此外也可以是以上4个类型的任意联合类型。

```typescript
interface OnlyTest {
    [index: number]: string;
    [index: string]: string;
    [index: symbol]: string;
    [index: `a-${string}`]: string;
    [index: `b-${number}`]: string;
}

let v1: OnlyTest = {
    1: '1',
    name: '2',
    [Symbol('red')]: '3',
    'a-test': '4',
    'b-1': '5'
};
```

### 对应JS字面量类型

定义字面量类型有两种方式

#### 冒号加字面量

```typescript
enum PointDimension {
    TwoDimension,
    ThreeDimension
}

let v1: true = true; // true
let v2: 1 = 1; // 1
let v3: 1n = 1n; // 1n
let v4: '1' = '1'; // '1'
let v5: [1, 2] = [1, 2]; // [1,2]
let v6: { name: 'l' } = { name: 'l' }; // { name: 'l' }
let v7: PointDimension.TwoDimension = PointDimension.TwoDimension; // PointDimension.TwoDimension
```

#### 字面量后加 as const

`as const`可以把`number`、`bigint`、`boolean`、`string`、`array`、`object`字面量及枚举成员转成相应的字面量类型。

```typescript
enum PointDimension {
    TwoDimension,
    ThreeDimension
}

let v1 = true as const; // true
let v2 = 1 as const; // 1
let v3 = 1n as const; // 1n
let v4 = '1' as const; // '1'
let v5 = [1, 2] as const; // readonly [1,2]
let v6 = { name: 'l' } as const; // { readonly name: 'l' }
let v7 = PointDimension.TwoDimension as const; // PointDimension.TwoDimension
```

两种方式基本等同，在对数组、对象字面量的处理上不同，`as const`分别在数组前、对象属性前添加了`readonly`修饰符

显然`as const`更为简洁，且更符合语义，在定义字面量类型时，建议使用`as const`。

#### 字面量类型与const关键字

上面定义字面量类型两种方式的代码中都使用了`let`关键字来声明变量，没有使用`const`关键字声明的一点原因是想以此说明一下他们之间的关系。

`const`关键字声明的变量不可以重新赋值（地址不能变，如果是引用类型，其属性是可以更改的），即只能在变量初始化时赋值，之后无法赋值，即使是与之前一样的值也不可以；运行时也不行。

在`TS`中与之对应的类型是字面量类型，不同点在于字面量类型的变量不可以重新赋**其他值**（除了地址可以变，其他什么都不能变，如果是引用类型，其属性也不能变），即变量初始化是可以只指定类型，不赋值；在赋值之后，也可以再赋相同的值；在运行时类型约束早就无效了。

```typescript
let v1: { name: 'l' };
v1 = { name: 'l' };
v1 = { name: 'l' }; //Ok
v1.name = 'l'; //Ok
v1.name = 'x'; //Error

const v2 = { name: 'l' };
v2 = { name: 'l' }; //Error
v2.name = 'x'; //Error
```

**在TS中可以用`const`关键字+字面量类型来声明一个不可改变的常量**

```typescript
const point = { x: 1, y: 1 } as const;
point = { x: 1, y: 1 }; //Error
point.x = 1; //Error
point.y = 1; //Error
```

### 高级类型

#### 类型别名 type

```typescript
type ID = number;

type Point2D = {
    x: number;
    y: number;
};
```

#### 接口 interface

后面单独章节讲解，定义语法如下：

```typescript
interface Point2D {
    x: number;
    y: number;
}

interface Point3D extends Point2D {
    z: number;
}
```

#### 交叉类型 &

后面单独章节讲解，定义语法如下：

```typescript
interface Point2D {
    x: number;
    y: number;
}

type Point3D = Point2D & { z: number };
```

#### 类 class

后面单独章节讲解，定义语法如下：

```typescript
class Point2D {
    x: number;
    y: number;
}
```

#### 元组 tuple

后面单独章节讲解，定义语法如下：

```typescript
type StringNumberPair = [string, number];
```

#### 枚举 enum

后面单独章节讲解，定义语法如下：

```typescript
enum PointDimension {
    TwoDimension = 1,
    ThreeDimension
}
```

### 组合的复杂类型

#### 联合类型 |

后面单独章节讲解，定义语法如下：

```typescript
type ID = number | string;
```

#### 泛型 <T\>

后面单独章节讲解，定义语法如下：

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```

### 其他类型

#### any

```typescript
let point: any = { x: 0 };
point.move(); // Ok
point(); // Ok
point.z = 100; // Ok
point = 'hello'; // Ok
const n: number = point; // Ok
```

#### unknown

```typescript
function onlyTest1(p: any) {
    p.move(); // OK
}

function onlyTest2(p: unknown) {
    p.move(); // Error
}
```

#### never

```typescript
function onlyTest1(p: string | number) {
    if (typeof p === 'string') {
        // do something
    } else if (typeof p === 'number') {
        // do something else
    } else {
        p; // has type 'never'!
    }
}

function onlyTest2(msg: string): never {
    throw new Error(msg);
}
```

#### void

```typescript
function onlyTest() {
    return;
}
```

## TS 类型收窄

以下几种方式只有控制流分析需要注意一下，其他的是很自然的事情。

### typeof 类型保护

`typeof` 类型保护（`typeof type guards`）

```typescript
interface Point2D {
    x: number;
    y: number;
}

function onlyTest(p: Point2D | undefined) {
    if (typeof p === 'object') {
        // p 类型收窄为 Point2D
        console.log('2D:', p);
    } else {
        // p 类型收窄为 undefined
        console.log(p);
    }
}
```

### 布尔收窄

布尔收窄（`Truthiness narrowing`）

JS中假值有：`false、0、''、null、undefined、NaN、0n`，其他均为真。

```typescript
interface Point2D {
    x: number;
    y: number;
}

function onlyTest(p: Point2D | undefined) {
    if (p) {
        // p 类型收窄为 Point2D
        console.log('2D:', p);
    } else {
        // p 类型收窄为 undefined
        console.log(p);
    }
}
```

### 相等性收窄

相等性收窄（`Equality narrowing`)：通过`===、!==、==、!=`来收窄类型

```typescript
function onlyTest(x: string | number, y: string | boolean) {
    if (x === y) {
        // x、y 收窄为 string
        x.toUpperCase();
        y.toLowerCase();
    } else {
        // x 为string | number
        console.log(x);
        // y 为string | number
        console.log(y);
    }
}
```

### in 操作符收窄

`in`操作符收窄（`The in operator narrowing`）

```typescript
interface Point2D {
    x: number;
    y: number;
}

interface Point3D extends Point2D {
    z: number;
}

function onlyTest(p: Point2D | Point3D) {
    if ('z' in p) {
        // p 类型收窄为 Point3D
        console.log('3D:', p);
    } else {
        // p 类型收窄为 Point2D
        console.log('2D:', p);
    }
}
```

### instanceof 操作符收窄

`instanceof` 操作符收窄（`instanceof narrowing`）

```typescript
class Point2D {
    constructor(public x: number, public y: number) {}
}

class Point3D {
    constructor(public x: number, public y: number, public z: number) {}
}

function onlyTest(p: Point2D | Point3D) {
    if (p instanceof Point2D) {
        // p 类型收窄为 Point2D
        console.log('2D:', p);
    } else {
        // p 类型收窄为 Point3D
        console.log('3D:', p);
    }
}
```

### 赋值

通过赋值（`Assignments`）来收窄类型

```typescript
interface Point2D {
    x: number;
    y: number;
}

interface Point3D extends Point2D {
    z: number;
}

let p: Point2D | Point3D;

// p 类型收窄为 Point2D
p = { x: 1, y: 1 };
console.log(p);

// p 类型收窄为 Point3D
p = { x: 1, y: 1, z: 1 };
console.log(p);
```

### 控制流分析

控制流分析（`Control flow analysis`）：主要解决的是类型收窄失效的场景；这种场景发生在应用其他类型收窄的方法中，将判断类型收窄的表达式赋值给了一个变量，然后通过这个变量来控制不同的逻辑。

```typescript
type Shape =
    | { kind: 'circle'; radius: number }
    | { kind: 'square'; sideLength: number };

function area1(shape: Shape): number {
    // TS 4.4 版本之前失效场景一
    // 把 shape.kind === 'circle' 赋值给了一个变量
    const isCircle = shape.kind === 'circle';
    if (isCircle) {
        return Math.PI * shape.radius ** 2;
    } else {
        return shape.sideLength ** 2;
    }
}

function area2(shape: Shape): number {    
    // TS 4.4 版本之前失效场景二
    // 把 shape 通过解构赋值给了一个变量
    const { kind } = shape;
    if (kind === 'circle') {
        return Math.PI * shape.radius ** 2;
    } else {
        return shape.sideLength ** 2;
    }
}
```

`TS`解决方案是对在将`const`关键字声明的变量作为流程控制语句的判断时，会去检查这个变量是否进行了类型收窄的操作，如果有，即触发类型保护。

**触发控制流分析的前提，注意必须是`const`关键字声明的变量，其他的不行。**

### 自定义类型谓词 is

自定义类型谓词（`Using type predicates`）

```typescript
function isNumber(x: any): x is number {
    return typeof x === 'number';
}

function isString(x: any): x is string {
    return typeof x === 'string';
}
```

### 可辨识联合类型

可辨识联合类型（`Discriminated unions`），通过联合类型中相同的字段来区分不同的类型。

```typescript
interface Circle {
    kind: 'circle';
    radius: number;
}

interface Square {
    kind: 'square';
    sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
    switch (shape.kind) {
        case 'circle':
            // shape 收窄为 Circle
            return Math.PI * shape.radius ** 2;
        case 'square':
            // shape 收窄为 Square
            return shape.sideLength ** 2;
    }
}
```

### 穷尽性检查

穷尽性检查（`Exhaustiveness checking`）

```typescript
interface Circle {
    kind: 'circle';
    radius: number;
}

interface Square {
    kind: 'square';
    sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
    switch (shape.kind) {
        case 'circle':
            // shape 收窄为 Circle
            return Math.PI * shape.radius ** 2;
        case 'square':
            // shape 收窄为 Square
            return shape.sideLength ** 2;
        default:
            // 收窄为 never
            const _exhaustiveCheck: never = shape;
            return _exhaustiveCheck;
    }
}
```

## TS 断言

### 类型断言

#### 尖括号断言

`<>`尖括号断言语法，示例:

```typescript
const v1: string = 'Hello';
const v2: number = <number>v1; //Error
const v3: number = <number>(<unknown>v1); //Ok
const v4: number = <number>(<any>v1); //Ok
```

#### AS 断言

`as`断言语法，示例:

```typescript
const v1: string = 'Hello';
const v2: number = v1 as number; //Error
const v3: number = v1 as unknown as number; //Ok
const v4: number = v1 as any as number; //Ok
```

### 非空断言

具体⽽⾔，`x!`排除`null`和`undefined`。

```typescript
function onlyTest1(maybeString: string | undefined | null) {
    const onlyString: string = maybeString; // Error
    const ignoreUndefinedAndNull: string = maybeString!; // Ok
}

type NumGenerator = () => number;

function onlyTest2(numGenerator: NumGenerator | undefined) {
    const num1 = numGenerator(); // Error
    const num2 = numGenerator!(); //OK
}
```

### 确定赋值断⾔

确定赋值断⾔操作符`!`（`definite assignment assertion operator`），即允许在实例属性和变量声明后⾯放置⼀个`!`号，从⽽告诉`TS`该属性或变量会被明确地赋值。

```typescript
let x: number;
initialize();
console.log(2 * x); // Error: Variable 'x' is used before being assigned.(2454)
function initialize() {
    x = 10;
}
```

```typescript
let x!: number;
initialize();
console.log(2 * x); // Ok
function initialize() {
    x = 10;
}
```

## TS 函数细节

### 可选参数

可选参数（`Optional Parameters`）通过函数参数后面根`?`来表示参数可选，示例代码如下：

```typescript
function f(x?: number): void {}
f(); // Ok
f(10); // Ok
f(undefined); // Ok
```

### 剩余参数

剩余参数（`Rest Parameters`）只能是函数的最后一个参数，通过`...`语法来表示，示例代码如下：

```typescript
function multiply(n: number, ...m: number[]) {
    return m.map((x) => n * x);
}
const a = multiply(10, 1, 2, 3, 4);
```

### 函数重载

函数重载（`Function Overloads`）：在TS中，通过重载签名指定函数可以以不同的方式调用。函数重载**至少要有两个**重载签名。

#### 重载签名与实现签名

重载签名（`Overload Signatures`）、实现签名（`Implementation Signature`），主要注意两点：

1、重载签名不可以有函数体，至少有两个重载签名

2、**实现签名必须要兼容所有的重载签名，实现签名不能直接调用**

```typescript
function makeDate(timestamp: number): Date; // 重载签名
function makeDate(m: number, d: number, y: number): Date; // 重载签名
// 实现签名
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
    if (d !== undefined && y !== undefined) {
        return new Date(y, mOrTimestamp, d);
    } else {
        return new Date(mOrTimestamp);
    }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3); // Error
```

上面的例子实现签名有1个参数，2个可选参数，但不可以以传入两个形参的方式调用该函数，如何调用函数只能以重载签名的方式调用函数。

### this声明

可以通过在函数的第一个参数的位置指定函数运行的`this`，该`this`的指定不作为函数的参数，只是指定运行时的`this`。

```typescript
interface User {
    id: number;
    admin: boolean;
    // 在函数第一个参数的位置指定`this:this type`
    becomeAdmin(this: User): void;
}
const user: User = {
    id: 123,
    admin: false,
    becomeAdmin: function () {
        // 定义User接口时，指定了becomeAdmin函数中的this
        // 这里就有智能提示
        this.admin = true;
    }
};

const bA = user.becomeAdmin;
bA();// Error:The 'this' context of type 'void' is not assignable to method's 'this' of type 'User'.
```

## TS 类型推断

类型推断（`Type Inference`）

### 变量定义类型推断

变量定义类型推断（`Variable Definition Typing`），这种类型推断发生在初始化变量、设置参数默认值和解构等等，不必多言，一行示例代码如下：

```typescript
const foo = 123; // foo is a `number`
```

### 函数返回类型推断

函数返回类型推断（`Function Return Typing`）主要是根据函数的返回语句来推断函数的返回类型，不必多言，示例代码如下：

```typescript
// return type is 'number'
function add(a: number, b: number) {
    return a + b;
}
```

### 最佳通用类型推断

最佳通用类型（`Best common type`）；不必多言，两行示例代码如下：

```typescript
const x = [0, 1, null]; // (number | null)[]

type X = (typeof x)[number]; // number | null
```

### 上下文类型推断

上下文类型推断（`Contextual Typing`），具体来说就是根据表达式的位置推断出表达式的类型，示例代码如下：

```typescript
window.onmousedown = function (mouseEvent) {
    console.log(mouseEvent.button); // Ok
    console.log(mouseEvent.kangaroo); //Error
};
```

## TS 类型操作

**类型操作**是指根据其他的类型或者变量表达一个*新的*类型；所以也可以称为**根据类型创建类型**。

以下，除了`typeof`操作的是变量外，其他操作的都是类型。

### 泛型

不做过多描述，所有的类型操作都是为了复用原有的类型；泛型本身就是为了重用设计的。

### keyof 操作符

1.  接收一个`object`类型，返回该`object`类型所有`key`的（字符串或者数字的）字面量类型的联合类型

```typescript
type Point = { x: number; y: number };
type P = keyof Point; // "x" | "y"

type OnlyTest = { 0: number; 1: number };
type O = keyof OnlyTest; // 0 | 1
```

2.  如果接受的类型含有索引签名，则返回索引类型的联合类型

```typescript
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish; // number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish; // string | number

type Symbolish = { [k: symbol]: boolean };
type S = keyof Symbolish; // symbol
```

### typeof 操作符

`typeof`**只能操作标识符（例如变量标识符、属性标识符），返回它的类型**

```typescript
let s = 'hello';
let n: typeof s; // string
```

### 索引访问类型 操作符

索引类型（`Indexing type`）或者索引访问类型（`Indexed Access Types`）：**中括号`[]`**

从下面的例子我们可以看到，索引访问类型操作符`[]`，操作得是类型；**即中括号里只能填写类型，且只能填写索引签名类型、索引签名类型对应的字面量类型、基于以上两种的联合类型。**

```typescript
interface OnlyTest {
    [index: symbol]: boolean; // 索引签名类型
    [index: number]: number; // 索引签名类型
    [index: string]: string | number; // 索引签名类型
    name: string;
    age: number;
}

// 索引访问类型
type t1 = OnlyTest[symbol]; //boolean
type t2 = OnlyTest[number]; //number
type t3 = OnlyTest[string]; //string | number;
type t4 = OnlyTest[symbol | number]; //number | boolean
type t5 = OnlyTest['name']; //string
type t6 = OnlyTest['name' | 'age']; //string | number;
type t7 = OnlyTest[1]; //string | number;

let points = [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 3 }
];

// {
//     x: number;
//     y: number;
// }[]
type Points = typeof points;

// {
//     x: number;
//     y: number;
// }
type Point1 = Ponits[number]; // 索引访问类型

// {
//     x: number;
//     y: number;
// }
type Point2 = (typeof points)[number]; // 索引访问类型
```

### 条件类型 操作符

条件类型（`Conditional Types`），操作符如下，类似三目表达式：

**`SomeType extends OtherType ? TrueType : FalseType;`**

#### 条件类型中的 extends

上面公式中的`extends`的含义是指`SomeType`可分配给`OtherType`，或者`OtherType`兼容`SomeType`的意思

```typescript
interface Animal {
    live(): void;
}
interface Dog extends Animal {
    woof(): void;
}

type Example1 = Dog extends Animal ? number : string; // number

type Example2 = RegExp extends Animal ? number : string; // string
```

#### 条件类型中的 infer

在条件类型语句中，可以在条件表达式中⽤ `infer` 声明⼀个类型变量并可以在后面的两个结果表达式中使⽤。

```typescript
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return ? Return : never;

type Num = GetReturnType<() => number>; // number
```

#### 分发条件类型

分发条件类型（`Distributive Conditional Types`）：当条件类型作用到泛型上时，且判断的是一个联合类型，那么此场景下条件类型就变为分发条件类型，得到的是一个联合类型。

```typescript
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>; // string[] | number[]
```

**触发分发条件类型的条件**：

1.  条件类型作用到泛型上
2.  条件类型判断的是一个联合类型

满足触发分发条件类型的条件，如何禁止分发：把`extends`两边操作的类型包上中括号：

```typescript
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

type StrOrNumArr = ToArrayNonDist<string | number>; // (string | number)[]
```

### 映射类型

映射类型（`Mapped Types`）：映射类型是一个泛型类型，它是基于索引签名的语法；通过（`in`操作符）迭代一个联合类型（通常通过`keyof`获得）作为所创建新的类型的属性，同时可以在迭代的过程中增加或删除属性修饰符、修改属性名、过滤属性等等。

```typescript
type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean;
};

type CreateMutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};

type Concrete<Type> = {
    [Property in keyof Type]-?: Type[Property];
};
```

映射类型过程有一般有三种操作：

1.  第一种是对原有类型的属性增加或删除可读、可选的修饰符；映射类型过程中可以使用的属性修饰符有`readonly`、 `?`，通过在这两个修饰符前添加`+`或`-`前缀，表示增加和删除。

2.  第二种是对原有类型的属性名更改、过滤；映射类型过程中可以使用`as`语法，将迭代的属性名通过其他操作映射为别的属性名称，或者根据条件类型过滤掉一个属性。

3.  第三种是对原有类型的属性的类型更改。

*   通过模板字符串字面量类型操作符更改属性名称

```typescript
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property];
};

interface Person {
    name: string;
    age: number;
    location: string;
}

// {
//    getName: () => string;
//    getAge: () => number;
//    getLocation: () => string;
// }
type LazyPerson = Getters<Person>;
```

*   通过条件类型对属性名称判断返回一个`never`来过滤掉该属性

```typescript
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, 'kind'>]: Type[Property];
};

interface Circle {
    kind: 'circle';
    radius: number;
}

// {
//    radius: number;
// }
type KindlessCircle = RemoveKindField<Circle>;
```

### 模板字符串字面量类型 操作符

模板字面量类型操作符（`Template Literal Types`）可以在模板字符串中对**字符串字面量类型**进行**拼接**、**联合**操作。

```typescript
type World = 'world';
type Greeting = `hello ${World}`; // "hello world"

type EmailLocaleIDs = 'welcome_email' | 'email_heading';
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff';

// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
```

`TS`提供的以下几个字符串字面量类型的操作类型

```typescript
type Greeting1 = Uppercase<'hello, world'>; // "HELLO, WORLD"
type Greeting2 = Lowercase<'HELLO, WORLD'>; // "hello, world"
type Greeting3 = Capitalize<'hello, world'>; // "Hello, world"
type Greeting4 = Uncapitalize<'HELLO, WORLD'>; // "hELLO, WORLD"
```

以上几个是内置在编译器内部的，无法在`TS`的`.d.ts`文件中找到

```typescript
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;
```

## TS 类

### 类的成员

#### 字段

类的字段

```typescript
class Point2D {
    x!: number;
    y!: number;
}
```

#### 构造函数

```typescript
class Point2D {
    x: number;
    y: number;
    
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
```

#### 方法

类的方法

```typescript
class Point2D {
    x = 10;
    y = 10;

    move(n: number): void {
        this.x += n;
        this.y += n;
    }
}
```

#### 存取器

```typescript
class Point2D {
    _x = 0;
    
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
}
```

##### 自动存取器

```typescript
class Person {
    accessor name: string;
    constructor(name: string) {
        this.name = name;
    }
}
```

### 类的继承

#### implements

```typescript
interface Pingable {
    ping(): void;
}

class Ball implements Pingable {
    ping() {
        console.log('ping!');
    }
}
```

#### extends

```typescript
class Animal {
    move() {
        console.log('Moving along!');
    }
}

class Dog extends Animal {
    woof() {
        console.log('woof!');
    }
}
```

### 成员可见性

成员可见性（`Member Visibility`）

#### public

`public`修饰的成员可以在声明该成员的类中、类外、子类中访问；类中的成员默认的可访问修饰符是`public`。

```typescript
class Greeter {
    public greet() {
        console.log('hi!');
    }
}

const g = new Greeter();
g.greet();
```

#### private

`private`修饰的成员只可以在声明该成员的类中访问，类外、子类中都不可以访问。

```typescript
class Base {
    private x = 0;
}

const b = new Base();

console.log(b.x); // Error

class Derived extends Base {
    showX() {
        console.log(this.x); // Error
    }
}
```

#### protected

`protected`修饰的成员只可以在声明该成员的类中、子类中访问，类外不可以访问。

```typescript
class Greeter {
    public greet() {
        console.log('Hello, ' + this.getName());
    }
    protected getName() {
        return 'hi';
    }
}

class SpecialGreeter extends Greeter {
    public howdy() {
        // 子类可以访问父类中被protected修成的成员
        console.log('Howdy, ' + this.getName());
    }
}

const g = new SpecialGreeter();
g.greet(); // OK
g.getName();// Error
```

### 静态成员

静态成员（`Static Members`）

```typescript
class MyClass {
    static x = 0;
}
console.log(MyClass.x);
```

#### 类的静态块

静态块（`Static Blocks`）

```typescript
class MyClass {
    static x = 0;

    static {
        this.x = 6;
    }
}
console.log(MyClass.x);
```

### 参数属性

参数属性（`Parameter Properties`）：构造函数的参数前如果加上成员访问修饰符的话，会自动转化为类的有对应成员访问修饰符修饰的同名字段成员。

```typescript
class Point {
    constructor(public x: number, public y: number) {}
}

// 相当于
class Point {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
```

### 抽象类

抽象类（`Abstract Classes`）

```typescript
abstract class Base {
    abstract getName(): string;

    printName() {
        console.log('Hello, ' + this.getName());
    }
}

const b = new Base(); //Error
```

## TS 模块

### Type-Only

```typescript
import type { Options } from './some-module';

import { type Options } from './some-module';

export type { Options };
// 或者
export { type Options };
```

## TS 模块解析

### 相对模块与非相对模块

1. 相对模块（`relative module`）导入：以`/`、`./` 、`../`为开始的导入
    
    ```typescript
    import Entry from './components/Entry';
    import { DefaultHeaders } from '../constants/http';
    import '/mod';
    ```

2. 非相对模块（`non-relative module`）导入
    
    ```typescript
    import * as $ from 'jquery';
    import { Component } from '@angular/core';
    ```

### 模块解析策略

#### Classic

+ 对于相对模块的导入查找规则

   以导入该模块文件的路径为相对路径查找对应的文件（默认会查找`.ts`、`.ts.d.ts`为后缀的文件）（**只查找文件**）

+ 对于非相对模块的导入查找规则

    首先以导入该模块文件的路径为相对路径查找对应的文件，找不到再去上级目录去查找对应的文件，一直到根目录（**只查找文件**）。

#### Node

按照`node`的模块解析策略的思路查找，此处不介绍`node`的模块解析策略。

+ 对于相对模块的导入查找规则

   1. 首先以导入该模块文件的路径为相对路径查找对应的文件
   2. 如果找不到，则以导入该模块文件的路径为相对路径查找对应的文件夹
   3. 如果找到了对应的文件夹，则进入下一个的流程，否则报错
   4. 判断该文件夹下是否存在`package.json`文件，如果存在`package.json`文件，则进入下一个流程；如果不存在`package.json`文件，则查找该文件夹下是否存在名称为`index`（默认后缀为`.ts`、`.ts.d.ts`）的文件；如果找不到则报错
   5. 判断`package.json`文件是否存在`types`字段，如果存在`types`字段，则导入`types`字段指定的文件，如果指定的文件找不到，则查找该文件夹下是否存在名称为`index`（默认后缀为`.ts`、`.ts.d.ts`）的文件；如果找不到则报错；如果不存在`types`字段，则进入下一个流程；
   6. 判断`package.json`文件是否存在`main`字段，如果不存在`main`字段，则查找该文件夹下是否存在名称为`index`（默认后缀为`.ts`、`.ts.d.ts`）的文件，如果找不到，则报错；如果存在`main`字段，查找`main`字段对应的文件所在目录下的同名文件（默认后缀为`.ts`、`.ts.d.ts`的文件）；如果找不到，则查找该文件夹下是否存在名称为`index`（默认后缀为`.ts`、`.ts.d.ts`）的文件，如果找不到则报错。

+ 对于非相对模块的导入查找规则
  
  ![module-node.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd6f91442bca47d6a836548544c62728~tplv-k3u1fbpfcp-watermark.image?)

## TS 工具类型

工具类型（`Utility Types`）

### Awaited<Type\>

```typescript
type Awaited<T> = T extends null | undefined
    ? T
    : T extends object & { then(onfulfilled: infer F, ...args: infer _): any }
    ? F extends (value: infer V, ...args: infer _) => any
        ? Awaited<V>
        : never
    : T;
```

### Partial<Type\>

将一个类型转换为属性可选（增加可选修饰符）的类型

```typescript
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

### Required<Type\>

将一个类型转换为属性必选（删除可选修饰符）的类型

```typescript
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

### Readonly<Type\>

将一个类型转换为属性只读（添加只读修饰符）的类型

```typescript
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

### Record<Keys, Type\>

```typescript
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

### Pick<Type, Keys\>

从类型中摘取指定的属性形成一个新的类型

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

### Omit<Type, Keys\>

从类型中删除指定的属性形成一个新的类型

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### Exclude<UnionType, ExcludedMembers\>

从联合类型中排除指定的类型形成一个新的类型

```typescript
type Exclude<T, U> = T extends U ? never : T;
```

### Extract<Type, Union\>

从联合类型中提取指定的类型形成一个新的类型

```typescript
type Extract<T, U> = T extends U ? T : never;
```

### NonNullable<Type\>

从联合类型中排除`null`、`undefined`类型形成一个新的类型

```typescript
type NonNullable<T> = T & {};
```

### Parameters<Type\>

根据函数类型获取参数的元组类型

```typescript
type Parameters<T extends (...args: any) => any> = T extends (
    ...args: infer P
) => any
    ? P
    : never;
```

### ConstructorParameters<Type\>

根据构造函数类型获取参数的元组类型

```typescript
type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : never;
```

### ReturnType<Type\>

根据函数类型获取其返回类型

```typescript
type ReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
) => infer R
    ? R
    : any;
```

### InstanceType<Type\>

根据构造函数获取其实例的类型

```typescript
type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
```

### ThisParameterType<Type\>

根据函数类型获取其`this`类型

```typescript
type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any
    ? U
    : unknown;
```

### OmitThisParameter<Type\>

根据函数类型获取其不含有`this`类型的函数类型

```typescript
type OmitThisParameter<T> = unknown extends ThisParameterType<T>
    ? T
    : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T;
```

### ThisType<Type\>

```typescript
interface ThisType<T> { }
```

## TS 枚举

### 枚举成员

枚举成员名称：只能为字符串，只包含数字的字符串也不可以

枚举成员的值：只能是枚举表达式（该表达式的值只能是数字或者字符串）

枚举成员根据枚举成员的值分为：常量枚举成员（`constant enum member`）、计算枚举成员（`computed enum member`）

#### 常量枚举成员

枚举成员的值为常量枚举表达式（`constant enum expression`）的称为常量枚举成员

##### 常量枚举表达式

1.  字面量枚举表达式（`literal enum expression`）：关于字符串字面量、数字字面量的表达式

2.  常量枚举成员

3.  带括号的常量枚举表达式

4.  `+`、`-`、`~`：常量枚举表达式作为操作数的一元运算

5.  `+`、`-`、`*`、`/`、`%`、`<<`、`>>`、`>>>`、`&`、`|`、`^`：常量枚举表达式作为操作数的二元运算

```typescript
enum PointDimension {
    TwoDimension = 1,
    ThreeDimension
}

// 字面量枚举表达式                  1
// 自己之前声明的常量枚举成员         Up
// 其他之前声明的常量枚举成员         PointDimension.ThreeDimension
// 带括号的常量枚举表达式             (-Left + 5) * 2
// 常量枚举表达式作为操作数的一元运算  (-Left + 5) * 2
// 常量枚举表达式作为操作数的二元运算  (-Left + 5) * 2;
enum Direction {
    Up = 1,
    Down = Up + 1, 
    Left = PointDimension.ThreeDimension + 1, 
    Right = (-Left + 5) * 2
}
```

**常量枚举成员在编译后其值会转化为表达式的值**

```javascript
"use strict";
var PointDimension;
(function (PointDimension) {
    PointDimension[PointDimension["TwoDimension"] = 1] = "TwoDimension";
    PointDimension[PointDimension["ThreeDimension"] = 2] = "ThreeDimension";
})(PointDimension || (PointDimension = {}));

var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction || (Direction = {}));
```

#### 计算枚举成员

枚举成员的值不为常量枚举表达式的称为计算枚举成员，未想出应用场景

```typescript
enum OnlyTest {
    M = '1'.length, // 计算枚举成员
    N = true ? 2 : 3, // 计算枚举成员
    O = (() => 3)(), // 计算枚举成员
    P = false || 4, // 计算枚举成员
    Q = Math.random() // 计算枚举成员
}
```

**计算枚举成员在编译后其值依然是原表达式，所以计算枚举成员在编译时是不知道它的值的，这点很重要**，上面代码编译后如下：

```javascript
"use strict";
var OnlyTest;
(function (OnlyTest) {
    OnlyTest[OnlyTest["M"] = '1'.length] = "M";
    OnlyTest[OnlyTest["N"] = true ? 2 : 3] = "N";
    OnlyTest[OnlyTest["O"] = (() => 3)()] = "O";
    OnlyTest[OnlyTest["P"] = false || 4] = "P";
    OnlyTest[OnlyTest["Q"] = Math.random()] = "Q";
})(OnlyTest || (OnlyTest = {}));
```

**计算枚举成员在编译后其值依然是原表达式的同时，该表达式值也不可以是字符串，必须是数字**：

在解释上面的原因前，先对枚举得编译结果分析如下：

1.  对于枚举成员的值为数字时在编译后会在枚举成员名称与枚举成员值形成双向映射

2.  对于枚举成员的值为字符串时在编译后会在枚举成员名称与枚举成员值形成单向映射

```typescript
enum OnlyTest {
    M = 1,
    N = '2'
}
```

编译结果如下：

```javascript
"use strict";
var OnlyTest;
(function (OnlyTest) {
    OnlyTest[OnlyTest["M"] = 1] = "M"; // 双向映射
    OnlyTest["N"] = "2"; // 单向映射
})(OnlyTest || (OnlyTest = {}));
```

OK，根据上面得编译结果结合计算枚举成员编译得结果（双向映射）来看；计算枚举成员的值所对应的表达式的值必须是数字。

### 联合枚举与枚举成员类型

枚举类型还具有两个特点：

1.  枚举成员也是类型

2.  枚举作为类型相当于枚举成员类型的联合类型

```typescript
enum Color {
    Red,
    Green,
    Blue
}

type ColorEqual = Color.Red | Color.Green | Color.Blue;

function onlyTest1(c: Color) {}
function onlyTest2(c: ColorEqual) {}
```

### 数字枚举

关于枚举，上面已讲了太多，不再赘述；示例代码如下：

```typescript
enum Direction {
    Up = 1, // 未初始化的话从0开始
    Down, // 未初始化的话在前一个成员的基础上+1
    Left,
    Right
}
```

### 字符串枚举

关于枚举，上面已讲了太多，不再赘述；示例代码如下：

```typescript
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```

### 异构枚举

关于枚举，上面已讲了太多，不再赘述；示例代码如下：

```typescript
enum Direction {
    Up = 1,
    Down = "DOWN",
}
```

### 常量枚举

被`const`修饰的枚举叫做常量枚举（`const enum`），否则叫做非常量枚举（`non-const enum`）

**常量枚举的成员都应该是常量枚举成员，不能是计算枚举成员**

```typescript
const enum Direction {
    Up = 1,
    Down,
    Left,
    Right = '1234'.length // Error
}
```

#### 常量枚举与非常量枚举的区别

声明的常量枚举会从编译结果中移除，使用常量枚举成员的地方会使用其值替换掉，也叫内联（`inline`）；非常量枚举既不会从编译结果中移除，也不会被内联。

```typescript
// 不会从编译结果中移除
enum Direction1 {
    Up,
    Down
}

// 会从编译结果中移除
const enum Direction2 {
    Left,
    Right
}

console.log(Direction1.Up); // 不会被内联
console.log(Direction2.Left); // 会被内联
```

编译结果如下：

```javascript
"use strict";
// 不会从编译结果中移除
var Direction1;
(function (Direction1) {
    Direction1[Direction1["Up"] = 0] = "Up";
    Direction1[Direction1["Down"] = 1] = "Down";
})(Direction1 || (Direction1 = {}));
console.log(Direction1.Up); // 不会被内联
console.log(0 /* Direction2.Left */); // 会被内联
```

### 环境枚举

环境枚举或者外部枚举（`Ambient Enum`），通过`declare`关键字声明的枚举叫做`ambient enum`，否则就是非环境枚举（`non-ambient enum`），或者叫常规枚举（`regular enums`）；上面讨论得都是非环境枚举，来讨论一下环境枚举。

环境枚举分为：环境常量枚举（`ambient const enum`）与环境非常量枚举（`ambient non-const enum`）。

#### 环境枚举与非环境枚举的区别

环境枚举的特点：

1.  环境枚举（不管是环境常量枚举还是环境非常量枚举）的枚举成员的值如果未初始化，则为计算枚举成员。

2.  环境枚举（不管是环境常量枚举还是环境非常量枚举）的枚举成员的值如果要初始化，则必须为常量枚举表达式。

```typescript
declare enum OnlyTest1 {
    Up, // 计算枚举成员
    Down = 1, // 如果要初始化，必须初始化为常量枚举表达式
    Left,
    Right,
}

// 环境常量枚举也是一样
declare const enum OnlyTest2 {
    Up, // 计算枚举成员
    Down = 1, // 如果要初始化，必须初始化为常量枚举表达式
    Left,
    Right,
}

```

**即环境枚举中枚举成员成为计算枚举成员的唯一条件就是不初始化**

#### 环境枚举的使用场景

在说明环境枚举的使用场景前，说一下环境类型的使用场景

##### 环境类型

### 枚举注意事项

1.  **不建议使用异构枚举**，想不到应用场景

2.  在数字枚举时，由于存在双向映射，应使用枚举成员而不要使用兼容的数字类型，这在存在计算枚举成员的枚举时尤为重要

    ```typescript
    enum OnlyTest1 {
        M = '1'.length, // 计算枚举成员
        N = true ? 2 : 3, // 计算枚举成员
        O = (() => 3)(), // 计算枚举成员
        P = false || 4 // 计算枚举成员
    }

    // 即 你可以给枚举变量赋值枚举中不包含的值
    let v1: OnlyTest1 = 0; // 不会报错
    ```

3.  建议使用常量枚举

## TS 配置

### 语言和环境

1. `lib`

    配置内置的库文件，可以理解为内置环境类型；如果想用`DOM`的`API`，可以在`lib`中包含`DOM`，关于`DOM`的类型声明文件是随着`TS install`时一起安装的。
    
    当然也可以使用第三方写的类型包，因为有可能`TS`内置的类型文件不满足项目的要求；具体思路和`@types/*`的思路类似；可以发布`@typescript/lib-*`这样规则的包名，来实现`TS`在使用内置`API`的类型文件时的查找规则；比如查找`DOM`内置`API`的类型文件是先去`node_modules`下的`@typescript`中查找`lib-dom`包，如果能找到，则可以使用第三方的；如果没找到，再去`TS`包中去查找`lib.dom.d.ts`。

2. `target`

    指定要编译生成的`JS`文件的语法遵循的`ECMAScript`版本
    
3. `moduleDetection`

    配置如何确定一个文件是否是一个模块的原则；默认为`auto`，这里只讲一下`legacy`原则；`legacy`原则就是看有没有顶级的`import`或者`export`语句，有的话该文件就是一个模块。

4. `noLib`

    不包含任何内置的类型API类型文件，这意味着所有的内置API类型文件你都要使用第三方包或者自己去写。    
    
5. `useDefineForClassFields`

    配置类中字段初始化器的编译结果，开启时以`Object.defineProperty`的方式初始化字段
    
    ```typescript
    class C {
        foo = 100;
    }
    ```    
    
    开启时，编译结果如下：
    
    ```typescript
    "use strict";
    class C {
        constructor() {
            Object.defineProperty(this, "foo", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: 100
            });
        }
    }    
    ```    
    
    未开启时，编译结果如下：
    
    ```typescript
    "use strict";
    class C {
        constructor() {
            this.foo = 100;
        }
    }   
    ```

6. `emitDecoratorMetadata`

    配置是否启用为装饰器提供元数据的支持

7. `experimentalDecorators`

    配置是否启用处于实验性质阶段的装饰器功能。

8. `jsx`

9. `jsxFactory`

10. `jsxFragmentFactory`

11. `jsxImportSource`

12. `reactNamespace`

    
### 生成相关选项

1. `outDir`

    配置编译结果的输出⽬录
    
2. `removeComments`

    配置是否删除编译结果的所有注释

3. `declaration`

    配置是否⽣成相应的类型声明文件（`.d.ts`⽂件）

4. `declarationDir`

   `declaration`配置为`true`时，配置其输出的目录

5. `declarationMap`

    配置是否为生成的类型声明文件同时生成对应的源码地图文件（指向原`TS`文件），`.d.ts`文件都生成一个`.d.ts.map`文件

6. `emitDeclarationOnly`

    配置是否只⽣成相应的类型声明文件（`.d.ts`⽂件），不生成`JS`文件

7. `sourceMap`

    配置是否为生成的`JS`文件同时生成对应的源码地图文件

8. `inlineSourceMap`

    配置是否在生成的`JS`文件中内联对应的源码地图文件
    
9. `sourceRoot`

    `sourceMap`或者`inlineSourceMap`开启时，配置生成的源码地图中源码文件的基地址，可以配置为一个`URL`，即指定调试器查找源码地图的根路径

10. `mapRoot`

    `sourceMap`开启时，配置生成的`JS`文件中末尾链接源码地图（`sourceMappingURL`）的基地址，可以配置为一个`URL`

11. `inlineSources`

    `sourceMap`或者`inlineSourceMap`开启时，配置`inlineSources`，来决定生成的源码地图是否包含源码

12. `outFile`

    配置所有编译结果输出到一个`JS`文件（应用场景是`module`配置为`AND`或`System`）

13. `noEmitOnError`

    配置如果有错误是否还⽣成输出⽂件

14. `noEmit`

    配置是否⽣成输出⽂件
    
15. `emitBOM`

    配置输出文件的时候是否生成`with BOM`格式的文件

16. `newLine`

    配置输出文件的`CRLF (dos) or LF (unix)`

17. `stripInternal`

    配置标注`@internal`文档注释的代码不导出其类型声明    
    
18. `downlevelIteration`

    为迭代相关语法降级成更为符合迭代思想，但更冗长、性能差的`polyfill`，该代码称为`helper function code`（前提是`target`配置了不支持迭代的目标）

19. `importHelpers`

    `downlevelIteration`配置为`true`时，生成了许多`helper function code`,这些代码是内联到文件中的，为了避免代码冗余，可以配置`importHelpers`为`true`，这将会把所有的帮助代码将替换为从`tslib`中引入（需要单独安装）

20. `noEmitHelpers`

    `downlevelIteration`配置为`true`时，生成了许多`helper function code`，可以配置`noEmitHelpers`为`true`，不导入这些帮助函数的实现，转而自己在全局去实现这些函数。

21. `preserveConstEnums`
 
22. `importsNotUsedAsValues`

    即将废弃，用`verbatimModuleSyntax`替代。

23. `preserveValueImports`

    即将废弃，用`verbatimModuleSyntax`替代。

### 模块相关选项

1. `allowArbitraryExtensions`

    配置为`false`时，
    
2. `allowImportingTsExtensions`

    配置为`false`时，
    
3. `allowUmdGlobalAccess`

    配置为`false`时，
    
4. `baseUrl`

    配置优先⽤于解析**⾮相对模块**的基路径，主要是为`paths`选项服务，`paths`中配置的路径是基于`baseUrl`的
    
5. `customConditions`

    配置为`false`时，
    
6. `module`

    配置编译结果使用的模块化标准：`commonjs`、`ES6`、`ES2015`
    
7. `moduleResolution`

    配置模块的解析方式，即模块的查找规则
    
8. `moduleSuffixes`

    配置模块查找规则可以匹配的后缀
    
9. `noResolve`

    
    
10. `paths`

    配置模块名到基于 `baseUrl` 的路径映射的列表，解析**⾮相对模块**时，优先级高于`moduleResolution`配置，找不到的话按再按照`moduleResolution`配置的规则查找
    
11. `resolveJsonModule`

    配置是否启用解析后缀为`.json`的文件，该配置项常用于`node`的项目中
    
12. `resolvePackageJsonExports`

    配置为`true`时，`TS`在查找包的声明文件时优先从包的`package.json`文件中的`export`字段查找所指定的文件，会由于`package.json`文中件的`types`所指定的文件；且只能从`export`字段所指定的文件范围内查找，找不到就报错。
    
13. `resolvePackageJsonImports`

    配置为`false`时，
    
14. `rootDir`

    该配置⽤来控制输出⽬录结构，使其和源码中的结构一样，所有要编译的TS文件的最长的公共路径，如果出现导入了该路径之外的`TS`文件，会报错，但不会影响编译。
    
15. `rootDirs`

    
    
16. `typeRoots`

    配置包含类型声明的文件列表
    
17. `types`

    配置需要包含的类型声明文件名列表
    
### 模块转换约束相关选项

1. `isolatedModules`

   

2. `verbatimModuleSyntax`

    配置为`true`时，保留所有没有被`type`修饰的`import`语句，移除被`type`修饰的`import`语句；同时会有一个影响`esModuleInterop`的结果，如果`module`设置为了`CommonJS`，那将不能使用`ESModule`，需要使用`TS`提供的对应`CommonJS`模块化的语法： `export =`与`import = require()`

3. `allowSyntheticDefaultImports`

    当模块没有默认的导出时，允许`import x from y`。

4. `esModuleInterop`

    对导入`CommonJS`模块的支持

5. `preserveSymlinks`


6. `forceConsistentCasingInFileNames`

    配置为`true`时，`import`文件时对文件名强制区分大小写

### 编译相关选项

相关配置项之间有前置关系，例如某些原则只能在某些原则启用的情况下启用，具体不阐述，可自行配置观察。

1.  `allowUnreachableCode`

    配置为`false`时，对于不可达的代码提出警告

    ```typescript
    function fn(n: number) {
        if (n > 5) {
            return true;
        } else {
            return false;
        }
        return true; // Unreachable code detected.
    }
    ```

2.  `allowUnusedLabels`

    配置为`false`时，如果存在未使用的`label`时会报警告

    ```typescript
    function countLoop() {
        var num = 0;
        labelbreak1: for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                    console.log('i,j:', i, j);
                    if (i == 2 && j == 2) {
                            break labelbreak1; // 如果未使用会报警告
                    }
                    num++;
            }
        }
        console.log('num:', num);
    }
    countLoop();
    ```

3.  `exactOptionalPropertyTypes`

    对于可选属性的限制，如果为`false`，则可以给可选属性赋值为`undefined`；如果配置为`true`，可以不定义该属性，但不可以配置该属性为`undefined`。

    ```typescript
    interface UserDefaults {
        colorThemeOverride?: 'dark' | 'light';
    }

    // exactOptionalPropertyTypes为false时
    let ud1: UserDefaults = {
        colorThemeOverride: undefined //Ok
    };
    let ud2: UserDefaults = {}; //Ok

    // exactOptionalPropertyTypes为true时
    let ud3: UserDefaults = {
        colorThemeOverride: undefined //Error
    };
    let ud4: UserDefaults = {}; //Ok
    ```

4.  `noFallthroughCasesInSwitch`

    配置为`true`时，每个`switch`中的`case`必须要有`break`或者`return`

    ```typescript
    const a: number = 6;
    switch (a) {
        case 0: //Error: Fallthrough case in switch.
            console.log('even');
        case 1:
            console.log('odd');
            break;
    }
    ```

5.  `noImplicitOverride`

    配置为`true`时，在类继承时不可以有隐式的`override`父类的成员，如果需要重写父类的成员，必须显示得加上`override`修饰符；示例代码如下：
    
    ```typescript
    class Album {
        count: number = 1;
        setup() {}
    }

    class MLAlbum extends Album {
        override count: number = 2; //Ok
        override setup() {} //Ok
    }

    class SharedAlbum extends Album {
        setup() {} // Error
    }
    ```
    
6. `noImplicitReturns`

    配置为`true`时，函数不可以有隐式的`return`，前提是程序控制的所有分支，如果有的分支有明确的返回值（返回值不为`undefined`），那么其他的分支也必须有返回语句（可以不加返回值，也可以显示返回`undefined`，总之必须有`return`语句）

    ```typescript
    // 不能有隐式得return
    function onlyTest(color: 'blue' | 'black') {
        if (color === 'blue') {
            return 'beats';
        } else {
            ('bose');
        }
    }
    ```
    
7. `noPropertyAccessFromIndexSignature`

    配置为`true`时，不可以通过点（`.`）的方式访问索引签名的属性

    ```typescript
    interface GameSettings {
        speed: 'fast' | 'medium' | 'slow';
        quality: 'high' | 'low';
        [key: string]: string;
    }

    let settings!: GameSettings;

    settings.speed; //Ok

    settings.quality; //Ok

    settings.username; //Error

    settings['username']; //Ok
    ```
    
8. `noUncheckedIndexedAccess`

    配置为`true`时，将未明确赋值的索引签名的属性赋值给一个变量，该变量的推导类型会多加`undefined`类型

    ```typescript
    interface EnvironmentVars {
        NAME: string;
        OS: string;
        [propName: string]: string;
    }

    let env!: EnvironmentVars;

    const sysName = env.NAME;
    const os = env.OS;

    // 未给 env['NODE_ENV'] 明确赋值时，例如 env['NODE_ENV'] = 'a';
    // 开启时：string | undefined
    // 未开启时：string
    const nodeEnv = env['NODE_ENV'];
    ```
    
9. `noUnusedLocals`

    配置为`true`时，存在已声明但未使用的局部变量会警告
    
10. `noUnusedParameters`
 
    配置为`true`时，存在函数体中未使用的函数参数会警告
    
11. `strict`

    配置为`true`时，开启所有的严格模式选项；严格模式家族选项有以下几个：
    
    `alwaysStrict、strictNullChecks、strictBindCallApply、strictFunctionTypes、strictPropertyInitialization、noImplicitAny、noImplicitThis、useUnknownInCatchVariables`

12.  `alwaysStrict`

    配置为`true`时，输出`use strict`到编译结果中

13. `strictNullChecks`

    配置为`true`时，开启严格的`null`、`undefined`检查，具体看`Void Type`相关原则

    ```typescript
    const users = [
        { name: 'Oby', age: 12 },
        { name: 'Hera', age: 32 }
    ];

    const loggedInUser = users.find((u) => u.name === 'Hera');
    console.log(loggedInUser.age); // Error:'loggedInUser' is possibly 'undefined'.
    ```

14. `strictBindCallApply`

    配置为`true`时，调用函数的`call`、`apply`、`bind`也要传入正确的参数类型，否则报错

    ```typescript
    function fn(x: string) {
        return parseInt(x);
    }

    const n1 = fn.call(undefined, '10');

    const n2 = fn.call(undefined, false); // Error
    ```

15. `strictFunctionTypes`

    配置为`true`时，函数兼容性判断时函数参数采用逆变，配置为`false`时采用双向协变（具体参考型变的章节）

16. `strictPropertyInitialization`

    配置为`true`时，类中字段成员必须初始化

    ```typescript
    class UserAccount {
        name: string;
        accountType = 'user';

        email: string; // Error
        address: string | undefined;

        constructor(name: string) {
            this.name = name;
            // Note that this.email is not set
        }
    }
    ```

17. `noImplicitAny`

    配置为`true`时，不可以有隐式的`any`类型
    
18. `noImplicitThis`

    配置为`true`时，函数中`this`不可以有隐式的`any`类型

    ```typescript
    class Rectangle {
        width: number;
        height: number;

        constructor(width: number, height: number) {
            this.width = width;
            this.height = height;
        }

        getAreaFunction() {
            return function (this: Rectangle) {
                return this.width * this.height;
            };
        }

        getCircumferenceFunction() {
            return function () {
                return (this.width + this.height) * 2; // this不能有隐式得any类型
            };
        }
    }
    ```

19. `useUnknownInCatchVariables`

    配置为`true`时，`catch`的参数类型为`unknow`，配置为`false`时，`catch`的参数类型为`any`

    ```typescript
    try {
        // ...
    } catch (err) {
        // We have to verify err is an
        // error before using it as one.
        if (err instanceof Error) {
            console.log(err.message);
        }
    }
    ```
    
### JS支持相关选项

1. `allowJs`

    配置是否允许编译`JS`⽂件

2. `checkJs`

    配置是否检查`JS`⽂件中的类型错误

3. `maxNodeModuleJsDepth`
   
    `allowJs`为`true`时，配置检查导入的`node_modules`中的`JS`⽂件中的类型错误，其深度的含义是如果你直接导入`JS`，算一层；导入的`JS`中有导入其他的`JS`，这个其他的`JS`算第二层    

### 项目相关选项

`incremental`、`composite`、`tsBuildInfoFile`、`disableSourceOfProjectReferenceRedirect`、`disableSolutionSearching`、`disableReferencedProjectLoad` ：一些项目的配置，大部分是对于复杂的项目来说，如何提高编译的性能。

### 完备性相关选项

1. `skipDefaultLibCheck`



2. `skipLibCheck`

### 顶级选项

1. `files`
  
   指定需要编译文件的名称

2. `exclude`

   设置⽆需进⾏编译的⽂件，⽀持路径模式匹配
   
3. `include`

    设置需要进⾏编译的⽂件，⽀持路径模式匹配 
   
4. `extends`
      

## TS 类型兼容中的其他原则

### Freshness 相关原则

`Freshness`意思是`strict object literal checking`，即严格的对象字面量检查。为什么要有这条原则？举例如下：

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = { color: 'white', area: 100 };
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

// 场景一：赋值给变量
let config: SquareConfig;
config = { color: 'red' }; // Ok
config = { color: 'red', width: 100 }; // Error

// 场景二：作为参数传递
let mySquare1 = createSquare({ color: 'red' }); // OK
let mySquare2 = createSquare({ color: 'red', width: 100 }); // Error

// 对于字面量对象赋值给变量或则作为参数传递时会进行额外的属性检查
// 解决方式可以有以下几种方案

// 方案一：使用类型断言
let mySquare3 = createSquare({ width: 100, opacity: 0.5 } as SquareConfig); // Ok

// 方案二：就是将这个字面量对象赋值给一个另一个变量： 因为squareOptions不会经过额外属性检查，所以编译器不会报错。
let squareOptions = { color: 'red', width: 100 };
let mySquare4 = createSquare(squareOptions); // Ok

// 方案三：修改接口定义
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
let mySquare5 = createSquare({ color: 'red', width: 100 }); // Ok
```

原因比较好理解，就是对一个类型的变量赋值，如果采用字面量对象，那就应该有哪些属性就写哪些,不应该有多余的；如果采用另一个变量（该变量可能来自后端），是允许多余的属性的，只要满足结构化子类型的原则就可以。

### Any Type 相关原则

`any`类型比较特殊，有把他认为是`top type`；个人认为说他表现为`top type`，更为合适，毕竟我在`TS`官网文档中未找到相关依据。

`any`类型的特点是会跳过类型检查，表现为两方面：

*   在属性访问或者函数调用时：在访问`any`类型的变量的属性、方法或函数调用时，会跳过类型检查

*   在判断类型兼容时

    1.  在其他类型的变量分配给`any`类型的变量时，会跳过类型兼容判断，表现为`top type`（顶级类型）

    2.  在`any`类型的变量分配给除`never`类型之外的其他类型的变量时，会跳过类型兼容判断，表现为除`never`类型之外的其他类型的子类型

### Unknown Type 相关原则

1.  `unknow`类型是`top type`（顶级类型），是其他类型的父类型，即其他类型的变量都可以分配给`unknow`类型的变量。

### Never Type 相关原则

1.  `never`类型是`bottom type`（底部类型），是其他类型的子类型，即`never`类型的变量可以分配给其他类型的变量。

### Void Type 相关原则

1.  `strictNullChecks`配置未开启时，`null`类型的、`undefined`类型的变量可以分配给`void`类型的变量；亦可以分配给除`never`类型之外的其他类型的变量

2.  `strictNullChecks`配置开启时，`undefined`类型的变量可以分配给`void`类型的变量

3.  **关于`void`作为函数的`return type`的原则**

    *   如果在函数声明或者函数表达式中显示得指定`void`作为函数的`return type`，即为函数返回值指定了`void type annotation`，则函数不能有返回值；如果有，只能是第1、2条规则下void兼容类型的返回值。

        ```typescript
        // 显示的为函数返回值指定了void type annotation
        function fn1(): void {
            return true; // Error
        }

        // 显示的为函数返回值指定了void type annotation
        const fn2 = function (): void {
            return true; // Error
        };
        ```

    *   如果在函数赋值的`Contextual typing`场景下，即目标函数的`return type`是`void`，源函数没有显示的指定`return type`，那么源函数的返回值是什么类型都可以分配给目标函数

        ```typescript
        type voidFunc = () => void;

        const fn1: voidFunc = () => {
            return true;
        }; // Ok

        const fn2: voidFunc = () => true; // Ok

        const fn3: voidFunc = function () {
            return true;
        }; // Ok
        ```

        并且理所当然的`fn1`、`fn2`、`fn3`函数运行后的结果分配给变量，这些变量的类型也为`void`

        ```typescript
        const v1 = fn1(); // void

        const v2 = fn2(); // void

        const v3 = fn3(); // void
        ```

        来看一个实际的例子，下面是数组的foreach方法的类型定义

        ```typescript
        interface Array<T> {
            //

            forEach(
                    callbackfn: (value: T, index: number, array: T[]) => void,
                    thisArg?: any
            ): void;

            //
        }
        ```

        ```typescript
        const src = [1, 2, 3];

        const dst = [0];

        // 该规则的应用
        src.forEach((el) => dst.push(el));
        ```

### 枚举类型 相关规则

1.  数字枚举类型与数字类型相互兼容；不同枚举类型之间是不兼容的

    ```typescript
    enum Status {
    Ready,
    Waiting
    }    
    enum Color {
        Red,
        Blue,
        Green
    }

    let status = Status.Ready;
    let color: Color = 1; //Ok
    let ready: number = Status.Ready; //Ok
    status = Color.Green; // Error
    ```

2.  字符串类型兼容字符串枚举类型；反之不兼容

    ```typescript
    enum Status {
        Ready = 'R',
        Waiting = 'W'
    }

    let status = Status.Ready;
    let ready: string = Status.Ready; // Ok
    status = 'W'; // Error
    ```

3.  关于枚举类型。还有些其他的原则，占个坑吧

### 索引签名 相关规则

4种索引签名（`Index Signature`）可以同时使用，在同时使用的场景下：

1.  `string`、`number`、`template string patterns`索引签名同时使用的场景下，数字、模板字符串模式索引的返回值类型必须是字符串索引的返回值类型的子类型

    ```typescript
    interface Animal {
    name: string;
    }

    interface Dog extends Animal {
        breed: string;
    }

    // Ok
    interface Okay {
        [x: number]: Dog;
        [x: string]: Animal;
    }

    // Error: 'number' index type 'Animal' is not assignable to 'string' index type 'Dog'.
    interface NotOkay {
        [x: number]: Animal;
        [x: string]: Dog;
    }

    ```

    因为当使用`number`来索引时，`JS`会先将它转换成`string`。

### 类 相关原则

1.  判断两个`class`类型的变量是否兼容，在结构化子类型中只考虑实例成员，静态成员和构造函数不考虑

    ```typescript
     class Animal {
         feet: number;
         constructor(name: string, numFeet: number) {
             this.feet = numFeet;
         }
     }
     class Size {
         feet: number;
         constructor(numFeet: number) {
             this.feet = numFeet;
         }
     }
     
     let a!: Animal;
     let s!: Size;
     a = s; // OK
     s = a; // OK
    ```

2.  对于具有`private`、`protected`修饰的成员，判断两个`class`类型的变量是否兼容，还要考虑`private`和 `protected`的成员必须来自同一个类

    ```typescript
    class Animal {
        private wing!: number;
        protected feet!: number;
    }
    class Cat extends Animal {}

    let animal!: Animal;
    let cat!: Cat;

    animal = cat; // Ok
    cat = animal; // Ok

    /** Looks just like Animal */
    class Size {
        private wing!: number;
        protected feet!: number;
    }

    let size!: Size;

    animal = size; // Error
    size = animal; // Error
    ```

### 型变 相关原则

型变（`Type Variance`）相关的概念有协变、逆变、双向协变、不变。

#### 协变

子类型可以分配给父类型，叫做协变(`Covariance`)，在两个变量（函数除外）赋值时、函数调用传参时都是协变是类型安全的，例子如下：

```typescript
interface Point2D {
    x: number;
    y: number;
}

interface Point3D {
    x: number;
    y: number;
    z: number;
}

let point2D: Point2D = { x: 1, y: 2 };
let point3D: Point3D = { x: 1, y: 2, z: 3 };

// 变量赋值
point2D = point3D; // Ok

function getX(point: Point2D): number {
    return point.x;
}

getX(point3D); // Ok
```

这个应该容易理解，如果你了解里氏替换原则，这里就没什么说的了。

#### 逆变

父类型可以分配给子类型，叫做逆变(`Contravariance`)，这个发生在判断两个函数类型是否类型兼容时；以在两个函数**变量**赋值时来举例；两个函数的参数类型采用逆变，两个函数的返回值类型采用协变，这样是类型安全的。

```typescript
interface Point2D {
    x: number;
    y: number;
}

interface Point3D {
    x: number;
    y: number;
    z: number;
}

interface changePoint<T, U> {
    (param: T): U;
}

let convertToPoint3D: changePoint<Point2D, Point3D> = (
    point2D: Point2D
): Point3D => {
    const point3D = {
        ...point2D,
        z: Math.random()
    };
    return point3D;
};

let convertToPoint2D: changePoint<Point3D, Point2D> = (
    point3D: Point3D
): Point2D => {
    console.log(point3D.z)
    const point2D = {
        x: point3D.x,
        y: point3D.y
    };
    return point2D;
};

convertToPoint2D = convertToPoint3D; // Ok
convertToPoint3D = convertToPoint2D; // Error
```

具体原因从上面的例子中也好理解，因为在定义函数时，参数是什么类型，函数体内就有可能调用该参数的所有属性和方法；如果在两个函数变量赋值时，参数之间采用协变是不安全的；假如函数`convertToPoint2D`可以赋值给函数`convertToPoint3D`，在函数`convertToPoint3D`调用传参时，按照要求传入`Point2D`类型的参数，但此时函数`convertToPoint3D`的函数体是函数`convertToPoint2D`的函数体，而函数`convertToPoint2D`的函数体中是按照参数为Point3D类型写得逻辑，那么运行时就会出现问题；所以在两个函数变量赋值时，函数的参数传递应该为逆变，即父类型可以分配给子类型。

#### 双向协变

`TS 2.x`之前在两个函数变量赋值时，两个函数的参数类型既支持逆变，也支持协变，叫做双向协变（`Bivariance`）；为了更严格的保证类型安全，`TS`添加了`strictFunctionTypes`的编译选项，开启以后函数参数就只支持逆变，否则支持双向协变。

这里强调一下两个函数变量赋值时，两个函数的返回值类型一定是协变的；之所以为什么强调，这个原则在`Void Type` 相关原则的小节中是不适用的，再举个例子如下：

```typescript
type voidFunc = () => void;

type booleanFunc = () => boolean;

let fn1: voidFunc = () => {
    return;
};

let fn2: booleanFunc = () => true;

fn1 = fn2; // Ok
```

#### 不变

不变（`Invariance`），上面讲了协变，逆变，并且说了在什么场景下采用什么样的型变是安全的；如果脱离场景，协变与逆变都是不安全的，而不变是安全的。

这里和`Invariance`没什么关系，只是畅想一下；关于不变，是否想到了`Immutable`，在`React`框架中经常会用到；脱离技术聊一下对象的不可变性，是否就像平行宇宙一样，做的每一个选择，都会产生一个新的宇宙。

### 函数参数 相关原则

有了协变、逆变的概念后，聊一下在两个不同函数参数个数变量赋值时，两个函数参数类型的兼容性。

1.  在上面的场景下，参数少的可以分配给参数多的函数

    ```typescript
    // 以回调来举例
    type Cb = (p1: boolean, p2: number, p3: string) => void;

    const fn = (cb: Cb) => {};

    fn(() => null); // Ok
    fn((p) => null); // Ok
    fn((p1, p2) => null); // Ok
    fn((p1, p2, p3) => null); // Ok 
    ```

    这个怎么用逆变来解释呢？用集合的包含关系来判断子类型？用结构子类型的概念来解释？直接上升到越具体的是越模糊的子类型？好像怎么着都没找到好的角度。首先明确的是，肯定参数少的是参数多的父类型（这个说的只是参数部分，对于整个函数类型来说，参数多的函数类型是参数少的函数类型的父类型）；那么回想一下，对于一个参数时举的例子，可以明确的判断出`Point2D`是`Point3D`的父类型，提到这你是否想到一个角度了呢？

    稍微改变一下上边的代码，如下：

    ```typescript
    type Cb = ({ p1, p2, p3 }: { p1: boolean; p2: number; p3: string }) => void;

    const fn = (cb: Cb) => {};

    fn(() => null); // Ok
    fn(({}) => null); // Ok
    fn(({ p1 }) => null); // Ok
    fn(({ p1, p2 }) => null); // Ok
    fn(({ p1, p2, p3 }) => null); // Ok
    ```

    把他转成单个参数的场景，是不是就是和之前在逆变举的例子一样了；感觉是不是偷换概念了？明明是在说多个参数的场景，这不又回到了单个参数的场景；我认为在理解多个参数的逆变时，这是最容易理解的角度，可能不太恰当，如有异议，还请大神留言。

2.  函数参数中的剩余参数在判断函数兼容时被当作无限长度的参数

    稍微改变一下上边的代码，如下：

    ```typescript
    type Cb = (...args: unknown[]) => void;

    const fn = (cb: Cb) => {};

    fn(() => null); // Ok
    fn((p1) => null); // Ok
    fn((p1, p2) => null); // Ok
    fn((p1, p2, p3) => null); // Ok
    ```

3.  函数参数中的剩余参数在判断函数兼容时被当作无限长度的可选参数

    > `TS`官方文档中提到 'When a function has a rest parameter, it is treated as if it were an infinite series of optional parameters.This is unsound from a type system perspective,...' [TypeScript: Documentation - Type Compatibility (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/type-compatibility.html#optional-parameters-and-rest-parameters)

    简单来讲，就是上面的规则是`no sound`的，不可靠的；官网举了一些例子，完全没看懂；个人感觉先不管举的例子是否可以说明该问题，是否在这个地方举个例子来说明为什么是可选的更好些，可能关注点不一样；一般提出个规则要先说明解决什么问题，适用什么场景，再讲一下可能存在的问题，以及为什么存在问题依然认为是适用的，背后的深思熟虑是什么？(当然这是我没看懂得一点啰嗦，不是针对什么，是对自己知识面太窄无法理解得一点小情绪)

    不啰嗦了，其实这里的场景很简单，看一下下面的示例：

    ```typescript
    const fn = (...args: unknown[]): void => {
        console.log(args);
    };

    fn(1); // Ok
    fn(1, 2); // Ok
    fn(1, 2, 3); // Ok
    ```

    以上就是说我们在函数调用时，为什么对于`fn`类型的函数可以少传参数，写个伪代码如下：

    ```text
    args like [p1?, p2?, p3?, ......]
    fn   like (p1?, p2?, p3?, ......):void
    ```

    **注意不是`args`可选，是`args`里面的元素可选。**

总结一下，可选修饰符主要是为了解决**调用函数时**的类型兼容，即可以少传参数；而判断两个函数类型是否兼容时，参数多的可以兼容参数少的；这两个**少**字有时让人困惑，个人理解，逻辑自洽就可以；如果有不同意见，可以留言。

### 属性修饰符 相关规则

属性修饰符（Property Modifiers）

#### Readonly

首先确定一点`readonly`修饰符不仅可以修饰属性，也可以修饰数组类型与元组类型，而且在这两个应用场景的兼容规则也是不同的。

1.  修饰属性时，`TS`在判断两个类型兼容时不会考虑两个类型中**属性**的可读性

    ```typescript
    interface Person {
    name: string;
    age: number;
    }

    interface ReadonlyPerson {
        readonly name: string;
        readonly age: number;
    }

    let writablePerson: Person = {
        name: 'Person McPersonface',
        age: 42
    };

    // works
    let readonlyPerson: ReadonlyPerson = writablePerson; // Ok
    writablePerson = readonlyPerson; // Ok

    console.log(readonlyPerson.age); // prints '42'
    writablePerson.age++;
    console.log(readonlyPerson.age); // prints '43'
    ```

2.  修饰数组类型与元组类型时，`TS`在判断两个类型兼容时，可变数组类型(`mutable array type`)的变量可以分配给只读数组类型(`readonly array type`)的变量，反之则不可以；同样的，可变元组类型(`mutable tuple type`)的变量可以分配给只读元组类型(`readonly tuple type`)的变量，反之则不可以。

    ```typescript
    let a1: number[] = [3, 4];
    let a2: readonly number[];
    a2 = a1; // Ok
    a1 = a2; // Error

    let t1: [number, number] = [3, 4];
    let t2: readonly [number, number];
    t2 = t1; // Ok
    t1 = t2; // Error
    ```

**上面两个原则并没有违背结构化子类型原则，那为什么会有不同的兼容场景呢？**
其实`readonly`在修饰属性时，并没有改变其类型结构，所以判断兼容时可以不用考虑；
然而`readonly`在修饰数组类型或元素类型时，对于只读性的数组或元组类型变量是不能改变其内部元素的，例如不能使用push方法（当然运行时依然可以），那么相当于在原有的数组类型结构上去掉了一些改变数组的方法；根据结构化子类型的原则，所以只有`readonly array type`可以兼容`mutable array type`，`readonly tuple type`可以兼容`mutable tuple type`，反之不行。

## 可靠性与完备性

可靠性（`Soundness`）与完备性（`Completeness`），在一开始提到过可靠性的概念，那么可靠性的含义是什么？其实已经不重要了，起头的原因不重要，重要的是从中学到了什么；如果你有兴趣，可以去了解一下，凝视一下深渊。

## 总结

没什么好总结的，东西有点多；忘了说了，文章中的原则是参考的`TS 5.04`版本；暂时不打算写新的关于`TS`的文章，后期会不断得更新该文章的内容；文章中措辞经过了反复推敲，依然会有不合适或者词不达意的地方，还请大家指教。

## 参考文献

*   [TypeScript: Handbook - The TypeScript Handbook (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/intro.html)
*   [README - TypeScript Deep Dive (gitbook.io)](https://basarat.gitbook.io/typescript/)
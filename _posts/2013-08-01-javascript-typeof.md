---
layout: post
title: "JavaScript typeof操作符"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

昨天讨论`instanceof`运算符，其中有一个比较坑的限制是，当使用iframe的时候可能会有意想不到的场景：

    var a = [];
    alert(a instanceof top.Array); // 当这段代码出现在iframe里面的时候是false

原因很简单，就是`window.Array`跟`top.Array`是两个不同的对象。虽然我们写代码的时候不会像上面那样显式地引用`top.Array`，但是在iframe集成的场景下我们可能会这么调用：

    if (isArray(a)) { ... }

而`isArray`可能会这么写：

    function isArray(a) { return top.isArray(a); }

这样就会出现上述的坑爹问题。今天来讨论另外一个检测JavaScript变量的运算符`typeof`，看它是否能解决以上这个坑爹的问题。

> typeof操作符返回一个字符串，代表一个未估值的操作数(unevaluated operand)的类型。

`typeof`接受一个操作数和一对可选的括号，返回表示该操作数的类型的字符串，操作数可以是字符串、对象、数字甚至是未定义的变量等。

`typeof`运算符能返回以下表示操作数类型的字符串：

1. `undefined`，操作数是未定义的变量或者属性，例如`undefined`，或者`var a = {}; alert(typeof a.foo);`。
2. `object`，操作数是一个对象，例如`null`、`{}`、正则表达式等。
3. `boolean`，操作数是一个布尔值，如`true`、`false`或者`Boolean("false")`。
4. `number`，操作数是一个数字，如`1`、`1.123`或者`Number("123")`等。
5. `string`，操作数是一个字符串，如`"123"`或者`String("123")`等。
6. `function`，操作数是一个方法，如`function () {}`或者`new Function()`等。

其中一个比较奇怪的是`typeof null === "object"`，这个貌似从JavaScript诞生以来就是这样，下面是MDN的解释：

> 在JavaScript最初的实现中,JavaScript中的值是由一个类型标签和一个数值组成的,对象的类型标签是0,由于null代表的是空指针(大多数平台下值为0x00),因此,null的类型标签也成为了0,typeof null就错误的返回了"object".(该段文字没有具体的出处,正确性有待考证)

使用`typeof`可以跨iframe判断一个变量是否对象、布尔值、数字、字符串或者方法，这里引用玉伯的代码：

    function isType(type) {
      return function(obj) {
        return Object.prototype.toString.call(obj) === "[object " + type + "]"
      }
    }
    var isObject = isType("Object")
    var isString = isType("String")
    var isArray = Array.isArray || isType("Array")
    var isFunction = isType("Function")

另外，由于当`type`是`undefined`或者`null`的时候，`typeof`操作都不会报错，所以也免去了对输入参数的非空判断的代码，引入闭包还能减少代码数量，快哉！

---
layout: post
title: "《JavaScript设计模式与开发实践》读书笔记"
description: ""
category: 
tags: [JavaScript, 读书笔记]
---

### 第2章 this、call和apply

JavaScript的`this`总是指向一个对象，而具体指向哪个对象是在运行时基于函数的执行环境**动态绑定**的，而非函数被声明时的环境。

当函数作为对象的方法被调用时，`this`指向该对象；当函数作为普通函数调用时，`this`指向全局对象。在ECMAScript
5的严格模式下，函数作为普通函数调用时的`this`已经被规定为不会指向全局对象，而是`undefined`；当函数作为构造器调用（`new`运算符），构造器里的`this`就指向返回的这个对象，但是如果构造器显式地返回了一个`object`类型的对象，那么这次运算结果最终会返回这个对象，而不是`this`；最后，`Function.prototype.call`或`Function.prototype.apply`能够动态地改变传入函数的`this`。

注1：许多引擎的`document.getElementById`方法的内部实现中需要用到`this`。

`call`和`apply`的作用一模一样，区别仅在于传入参数形式的不同。JavaScript的参数在内部就是用一个数组来表示的，从这个意义上讲`apply`比`call`的使用率更高，只要使用`apply`一股脑地把参数堆过去即可。如果我们传入的第一个参数为`null`，函数体内的`this`会指向默认的宿主对象，在浏览器中则是`window`。但在严格模式下，函数体内的`this`还是为`null`。

`call`和`apply`的用途有：

1. 改变函数内部的`this`指向。
2. 内置的`Function.prototype.bind`来指定函数内部的`this`的指向。
3. 借用其他对象的方法，例如`Array.prototype.push`等应用到`arguments`对象。

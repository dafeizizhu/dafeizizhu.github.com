---
layout: post
title: "《JavaScript设计模式与开发实践》读书笔记"
description: ""
category: 
tags: [JavaScript, 读书笔记]
---

### 第15章 装饰者模式

装饰者模式可以动态地给某个对象添加一些额外的职责，而不会影响从这个类中派生的其他对象。

传统的继承并不灵活，还会带来许多问题：

1. 导致超类和子类之间存在强耦合性。
2. 继承这种复用方式通常被称为“白箱复用”，在继承方式中，超类的内部细节是对子类可见的，继承常常被认为破坏了封装性。
3. 完成一些复用功能的同时，有可能创建出大量的子类，使子类的数量呈爆炸性增长。

装饰者模式能够在不改变对象自身的基础上，在程序运行时给对象动态地添加职责。

作为一门解释执行的语言，给JavaScript中的对象动态添加或者改变职责是一件最简单不过的事情：

    var obj = {
      name: 'sven',
      adress: 'shenzhen'
    }
    obj.address = obj.address + ' futian'

动态增加职责的方式，并没有真正地改动对象自身，而是将对象放入另一个对象之中，这些对象以一条链的方式进行引用，行程一个聚合对象。这些对象都拥有相同的接口，使得用户不需要了解它曾经被装饰过，这种透明性使得我们可以递归地嵌套任意多个装饰对象。

在JavaScript中可以很方便地给某个对象扩展属性和方法，但却很难在不改动某个函数源代码的情况下，给该函数添加一些额外的功能。要想为函数添加一些功能，最简单粗暴的方式就是直接改写该函数，但这是最差的办法，直接违反开放-封闭原则。

通过保存原引用的方式就可以改写某个函数：

    window.onload = function () {
      alert(1)
    }
    var _onload = window.onload
    window.onload = function () {
      _onload()
      alert(2)
    }

这种方式也存在以下问题：

1. 必须维护`onload`这个中间变量，虽然看起来并不起眼，但如果函数的装饰链过长，或者需要装饰的函数变多，这些中间变量的数量也会越来越多。
2. `this`被劫持。需要使用`Function.prototype.apply`来改变函数内部的`this`引用。

用AOP装饰函数：

    Function.prototype.before = function (beforefn) {
      var __self = this
      return function () {
        beforefn.apply(this, arguments)
        return __self.apply(this, arguments)
      }
    }
    Function.prototype.after = function (afterfn) {
      var __self = this
      return function () {
        var ret = __self.apply(this, arguments)
        afterfn.apply(this, arguments)
        return ret
      }
    }

    // Demo
    window.onload = function () {
      alert(1)
    }
    window.onload = (window.onload || function () {}).after(function () {
      alert(2)
    }).after(function () {
      alert(3)
    })

不污染原型的另一种实现：

    var before = function (fn, beforefn) {
      return function () {
        beforefn.apply(this, arguments)
        return fn.apply(this, arguments)
      }
    }

    window.onload = function () {
      alert(1)
    }
    before(window.onload, function () {
      alert(2)
    }

用AOP的方式给函数动态装饰功能，保证了原来的函数是一个相对纯净的函数，提高了原来的函数的可复用性，它被迁移到其他项目的时候，不需要做任何修改。

值得注意的是，因为函数通过`Function.prototype.before`或者`Function.prototype.after`被封装之后，返回的实际是一个新的函数，如果在原函数上保存了属性，那么这些属性会丢失。另外，这种装饰方式也叠加了函数的作用域，如果装饰的链条过长，性能上也会受到一些影响。

装饰者模式和代理模式的区别：

1. 代理模式的目的是，当直接访问本体不方便或者不符合需要时，为这个本体提供一个代替者。
2. 装饰着模式的作用就是为对象动态地加入行为。

通常，代理模式强调一种关系，这种关系可以静态的表达，一开始就可以确定的。而装饰者模式用于一开始不能确定对象的全部功能时。

代理模式通常只有一层代理-本体的引用，而装饰者模式经常会行程一条长长的装饰链。

---
layout: post
title: "Object.defineProperty()"
description: ""
category: 
tags: [JavaScript]
---

### 引用

1. [Object.defineProperty() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
2. [不会Object.defineProperty你就out了 - 腾讯Web前端 IMWeb 团队社区 | blog | 团队博客](http://imweb.io/topic/56d40adc0848801a4ba198ce)
3. [vue 源码分析之如何实现 observer 和 watcher - front-end - SegmentFault](https://segmentfault.com/a/1190000004384515)

`Object.defineProperty()`方法会直接在一个对象上定义一个新属性，或者修改一个已经存在的属性，并返回这个对象。

### 语法

> Object.defineProperty(obj, prop, descriptor)

其中接受3个参数：

1. `obj`：需要定义属性的对象。
2. `prop`：需定义或修改的属性的名字。
3. `descriptor`：将被定义或修改的属性的描述符。

### 描述

一般我们使用`var obj = {}; obj.a = 'a'`这种方式为对象添加属性，它们能在`for...in`或者`Object.keys()`方法中被遍历，也可以直接通过重新赋值的方式被改变，也可以使用`delete`操作符来删除。而使用`Object.defineProperty()`方法定义或者修改的属性可以改变这些额外细节的默认设置。

对象里目前存在的属性描述符有两种主要形式：**数据描述符**和**存取描述符**。数据描述符是一个拥有可写或者不可写值的属性，而存取描述符则是由一对getter-setter函数功能来描述的属性。**描述符必须是两种形式之一，不能同时是两者。**

两种描述符均具有以下可选键值：

1. `configurable`：当这个属性为`true`时，改属性描述符才能被改变，默认为`false`。
2. `enumerable`：当这个属性为`true`时，该属性才能够出现在对象的枚举属性中，默认为`false`。

例如：

    var o = {}
    Object.defineProperty(o, 'a', {
      value: 37,
      configurable: false
    })

    console.log(o.a) // 37

    Object.defineProperty(o, 'a', {
      value: 37,
      configurable: true
    })  // Uncaught TypeError: Cannot redefine property

还有：

    var o = {}
    Object.defineProperty(o, 'a', {
      value: 'a',
      configurable: true,
      enumerable: true
    })

    console.log(Object.keys(o)) // ['a']

    Object.defineProperty(o, 'a', {
      value: 'a',
      enumerable: false
    })

    console.log(Object.keys(o)) // []

数据描述符同时具有以下可选键值：

1. `value`：该属性对应的值，可以是任何有效的JavaScript值（数值、对象和函数等），默认为`undefined`。
2. `writable`：当该属性的值为`true`时，该属性才能被赋值运算符改变，默认为`false`。

例如：

    var o = {}
    Object.defineProperty(o, 'a', {
      value: 'a',
      writable: false
    })

    console.log(o.a) // a

    o.a = 'b'

    console.log(o.a)  // a

存取描述符同时具有以下可选键值：

1. `get`：一个给属性提供getter的方法，该方法返回值被用作属性值，默认为`undefined`。
2. `set`：一个给属性提供setter的方法，该方法接受唯一参数，并将该参数的新值分配给该属性，默认为`undefined`。

例如：

    var o = {}
    Object.defineProperty(o, 'a', {
      get: function () {
        return 'a'
      },
      set: function (value) {
        console.log('set value', value)
      }
    })

    console.log(o.a)  // a
    o.a = 'b'         // set value b

使用点运算符和`Object.defineProperty()`为对象的属性赋值时，数据描述符中的属性默认值是不同的：

    var o = {}

    o.a = 1

    // equals

    Object.defineProperty(o, 'a', {
      value: 1,
      writable: true,
      configurable: true,
      enumerable: true
    })

    Object.defineProperty(o, 'a', { value: 1 })

    // equals

    Object.defineProperty(o, 'a', {
      value: 1,
      writable: false,
      configurable: false,
      enumerable: false
    })

### 应用

一个具有observe能力的对象：

    export default class Observer {
      constructor(value) {
        this.value = value
        this.walk(value)
      }
      walk(value) {
        Object.keys(value).forEach(key => this.convert(key, value[key]))
      }
      convert(key, val) {
        defineReactive(this.value, key, val)
      }
    }

    export function defineReactive(obj, key, val) {
      var childOb = observe(val)
      Object.definePropety(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => val,
        set: newVal => {
          childOb = observe(newVal)
        }
      })
    }

    export function observe(value) {
      if (!value || typeof value !== 'object') {
        return
      }
      return new Observer(value)
    }

优化对象获取和修改属性的方式：

    Object.defineProperty(dom, 'translateX', {
      set: function (value) {
        var transformText = 'translateX(' + value + 'px')
        dom.style.webkitTransform = transformText
        dom.style.transform = transformText
      }
    })

    // usage
    dom.translateX = 10
    dom.translateX = -10

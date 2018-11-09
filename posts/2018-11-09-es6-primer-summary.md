---
layout: post
title: "《ES6标准入门（第3版）》读书笔记"
description: ""
category: 
tags: [javascript, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 变量解构赋值的用途

交换变量的值：

    let x = 1
    let y = 2
    { x, y } = { y, x }

从函数返回多个值：

    function example () {
      return [1, 2, 3]
    }
    let [a, b, c] = example()

    function example2 () {
      return { foo: 1, bar: 2 }
    }
    let { foo, bar } = example2()

函数参数的定义：

    function f ([x, y, z]) { ... }
    f([1, 2, 3])

    function b ({ x, y, z }) { ... }
    f({ x: 1, y: 2, z: 3 })

提取JSON数据：

    let jsonData = {
      id: 42,
      status: 'ok',
      data: [867, 5309]
    }
    let { id, status, data: number } = jsonData
    console.info(id, status, number) // 42, 'ok', [867, 5309]

函数参数的默认值：

    jQuery.ajax = function (url, {
      async = true,
      beforeSend = function () {},
      ...
    }) {
      ...
    }

任何部署了`Iterator`接口的对象都可以用`for...of`遍历，配合变量的解构赋值，遍历`Map`结构：

    let map = new Map()
    map.set('first', 'hello')
    map.set('second', 'world')

    for (let [key, value] of map) {
      console.info(key + ' is ' + value)
    }

    // 获取键名
    for (let [key] of map) { ... }
    // 获取值
    for (let [, value] of map) { ... }

输入模块的指定方法：

    const { SourceMapConsumer, SourceNode } = require('source-map')

### 模板字符串

模板字符串用反引号标识，可以作为普通的字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量：

    // 普通字符串
    console.info(`In Javascript '\n' is a line-feed`)
    // 多行字符串
    console.info(`In Javascript this is
    not legal.`)
    // 字符串中嵌入变量
    let name = 'Bob'
    let time = 'today'
    console.info(`Hello ${name}, how are you ${time}?`)

大括号内可以放入任意的JavaScript表达式，可以进行运算，以及引用对象属性，还能调用函数。可以使用模板字符串实现模板编译的功能：

<p data-height="265" data-theme-id="0" data-slug-hash="MzyZJb" data-default-tab="js,result" data-user="dafeizizhu" data-pen-title="ES6模板Demo" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/MzyZJb/">ES6模板Demo</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

这个例子使用了模板字符串模拟类似EJS的模板系统。注意的就是使用了`eval`，所以特别要注意被恶意注入JavaScript代码。

### 标签模板

模板字符串可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串，例如：

    alert`123` // 等同于 alert(123)

规则是：

1. 函数的第一个参数是一个数组，这个数组的成员是模板字符串里面没有变量替换的部分。
2. 其他参数都是模板字符串各个变量被替换后的值。

例如：

    let a = 5
    let b = 10
    tag`Hello ${ a + b } world ${ a * b }`
    // tag(['Hello ', ' world'], 15, 50)

其中一个重要的应用就是过滤HTML字符串：

<p data-height="265" data-theme-id="0" data-slug-hash="bQpOxE" data-default-tab="js,result" data-user="dafeizizhu" data-pen-title="ES6标签模板过滤HTML字符串" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/bQpOxE/">ES6标签模板过滤HTML字符串</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

使用这个标签模板可以过滤掉变量中的HTML字符串，防止用户可以控制变量值的情况下的JavaScript代码注入。

未完待续......

---
layout: post
title: "《ES6标准入门（第3版）》读书笔记（续）"
description: ""
category: 
tags: [JavaScript, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 引用

1. [Javascript 提案 BigInt 的一些坑 - 知乎](https://zhuanlan.zhihu.com/p/36385254)

### 书接上回

1. [《ES6标准入门（第3版）》读书笔记](/posts/2018/11/09/es6-primer-summary.html)

### Interger数据类型

JavaScript所有数字都保存成64位浮点数，这决定了整数的精确程度只能到53个二进制位，大于这个范围的整数，JavaScript是无法精确表示的。

为了解决这个问题，有一个提案引入了新的数据类型Integer（整数）来解决这个问题。整数类型的数据只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。例如：

    1n + 2n // 3n

这个数据类型，在Chrome 67（V8的6.7版本）以`BigInt`类型的形式来支持。由于Node.js 10内置的V8是6.6版本的，所以`BigInt`不能在Node.js 10中使用。

注：由于在codepen里面不支持数字字面量加`n`的表示形式，所以例子都使用`BigInt`构造函数来演示。

对于`BigInt`类型的数据，`typeof`运算符返回`bigint`：

    typeof BigInt(123) // 'bigint'

使用`BigInt`转换数值：

    BigInt(123)       // 123n
    BigInt('123')     // 123n
    BigInt(false)     // 0n
    BigInt(true)      // 1n
    BigInt(undefined) // TypeError
    BigInt(null)      // TypeError
    BigInt('123n')    // SyntaxError
    BigInt('abc')     // SyntaxError

在数学运算方面，`BigInt`的加、减、乘和阶乘这四个二院运算符和`Number`类型的行为一致。除法运算会舍弃小数部分，返回一个整数：

    BigInt(9) / BigInt(5) // 1n

使用不带符号的右移运算符和一元求正运算符会报错。而且`BigInt`类型不能和`Number`类型进行混合运算：

    1n + 1  // TypeError

具体例子：

<p data-height="265" data-theme-id="0" data-slug-hash="PxjmbO" data-default-tab="js,result" data-user="dafeizizhu" data-pen-title="Interger数据类型" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/PxjmbO/">Interger数据类型</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### `Set`的应用

使用扩展运算符和`Set`结构相结合就可以去除数组的重复成员：

    let arr = [3, 5, 2, 2, 5, 5]
    let unique = [...new Set(arr)] // [3, 5, 2]

实现并集、交集和差集：

    let a = new Set([1, 2, 3])
    let b = new Set([4, 3, 2])

    let union = new Set([...a, ...b])
    // Set { 1, 2, 3, 4 }

    let intersect = new Set([...a].filter(x => b.has(x)))
    // Set { 2, 3 }

    let difference = new Set([...a].filter(x => !b.has(x)))
    // Set { 1 }

### `WeakMap`的用途

`WeakMap`典型场景就是以DOM节点作为键名的场景，例如：

    let myElement = document.getElementById('logo')
    let myWeakMap = new WeakMap()

    myWeakMap.set(myElement, { timesClicked: 0 })

    myElement.addEventListener('click', function () {
      let logoData = myWeakMap.get(myElement)
      logoData.timesClicked += 1
    }, false)

一旦这个DOM节点删除，该状态就会自动消失。注册监听事件的处理函数很适合用`WeakMap`来实现：

    const listener = new WeakMap()

    listener.set(element1, handler1)
    listener.set(element2, handler2)

    element1.addEventListener('click', listener.get(element1), false)
    element2.addEventListener('click', listener.get(element2), false)

部署私有属性：

    const _counter = new WeakMap()
    const _action = new WeakMap()

    class Countdown {
      constructor (counter, action) {
        _counter.set(this, counter)
        _action.set(this, action)
      }
      dec () {
        let counter = _counter.get(this)
        if (counter < 1) return
        counter -= 1
        _counter.set(this, counter)
        if (counter === 0) {
          _action.get(this)()
        }
      }
    }

    // Demo
    const c = new Countdown(2, {} => console.info('DONE'))
    c.dec()
    c.dec() // DONE

未完待续......

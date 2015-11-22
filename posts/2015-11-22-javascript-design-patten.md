---
layout: post
title: "《JavaScript设计模式与开发实践》读书笔记"
description: ""
category: 
tags: [JavaScript, 读书笔记]
---

### 第3章 闭包和高阶函数

JavaScript同时拥有许多函数式语言的特性。许多设计模式都可以用闭包和高阶函数来实现。

如果在函数中声明一个变量的时候，如果该变量前面没有带上关键字`var`，这个变量就会成为全局变量。反之，使用`var`声明的变量为局部变量，只有在该函数内部才能访问到这个变量。

在JavaScript中，函数可以用来创造函数作用域。如果该函数内没有声明某个变量，搜索这个变量的过程会随着代码执行环境创建的作用域链往外层逐层搜索，一直搜索到全局对象为止。

全局变量的生存周期当然是永久的，而局部变量会随着函数调用的结束而被销毁。而局部变量所在的环境还能被外界访问，这个局部变量就有了不被销毁的理由，这里产生了一个闭包结构。闭包的作用有：

1. 封装变量，闭包可以帮助把一些不需要暴露在全局的变量封装成“私有变量”，例如封装一些经过提炼后的小函数。
2. 延续局部变量的寿命。

通常用面向对象思想能实现的功能，用闭包也能实现。例如命令模式，在面向对象版本中，预先植入的命令接收者被当成对象的属性保存起来；而在闭包版本的命令模式中，命令接收者会被封装在闭包形成的环境中：

    var Tv = {
      open: function () { console.log('open') },
      close: function () { console.log('close') }
    }
    var createCommand = function (receiver) {
      var execute = function () { return receiver.open() }
      var undo = function () { return receiver.close() }
      return {
        execute: execute,
        undo: undo
      }
    }
    var setCommand = function (command) {
      document.getElementById('execute').onclick = function () {
        command.execute()
      }
      document.getElementById('undo').onclick = function () {
        command.undo()
      }
    }
    setCommand(createCommand(Tv))

闭包也会使一些数据无法被及时销毁，如果在将来需要回收这些变量，我们可以手动把这些变量设为`null`。

高阶函数是指至少满足下列条件之一的函数：

1. 函数可以作为参数被传递，可以分离业务代码中变化与不变的部分。
2. 函数可以作为返回值输出，更能体现函数式编程的巧妙，意味着运算过程是可延续的。

AOP的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，保持业务逻辑模块的纯净和高内聚性，提高功能模块的可复用性。在JavaScript中实现AOP：

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

柯里化：

    var currying = function (fn) {
      var args = []
      return function () {
        if (arguments.length == 0) {
          return fn.apply(this, args)
        } else {
          [].push.apply(args, arguments)
          return arguments.callee
        }
      }
    }

反柯里化：

    Function.prototype.uncurrying = function () {
      var self = this
      return function () {
        var obj = Array.prototype.shift.call(arguments)
        return self.apply(obj, arguments)
      }
    }

或者：

    Function.prototype.uncurrying = function () {
      var self = this
      return function () {
        return Function.prototype.call.apply(self, arguments)
      }
    }

函数被频繁调用的场景：

1. `window.onresize`事件。
2. `mousemove`事件。
3. 上传进度。

函数节流的代码实现：

    var throttle = function (fn, interval) {
      var __self = fn, timer, firstTime = true
      return function () {
        var args = arguments, __me = this
        if (firstTime) {
          __self.apply(__me, args)
          return firstTime = false
        }
        if (timer) {
          return false
        }
        timer = setTimeout(function () {
          clearTimeout(timer)
          timer = null
          __self.apply(__me, args)
        }, interval || 500)
      }
    }

分时函数：

    var timeChunk = function (ary, fn, count) {
      var obj, t
      var len = ary.length
      var start = function () {
        for (var i = 0; i < Math.min(count || 1, ary.length); i++) {
          var obj = ary.shift()
          fn(obj)
        }
      }
      return function () {
        t = setInterval(function () {
          if (ary.length == 0) {
            return clearInterval(t)
          }
          start()
        }, 200)
      }
    }

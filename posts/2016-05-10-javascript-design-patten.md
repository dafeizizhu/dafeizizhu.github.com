---
layout: post
title: "《JavaScript设计模式与开发实践》读书笔记"
description: ""
category: 
tags: [JavaScript, 读书笔记]
---

### 第8章 发布-订阅模式

发布-订阅模式又叫观察者模式，它定义对象间的一种多对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。在JavaScript开发中，我们一般用事件模型来替代传统的发布-订阅模式。

发布-订阅模式可以广泛应用于异步编程中，这是一种替代传统回调函数的方案。在异步编程中使用发布-订阅模式，我们就无需过多关注对象在异步运行期间的内部状态，而只需要订阅感兴趣的事件发生点。

发布-订阅模式可以取代对象之间硬编码的通知机制，一个对象不用再显式地调用另外一个对象的某个接口。只要之前约定的事件名没有变化，就可以自由地改变它们。

发布-订阅模式的通用实现：

    var event = {
      clientList: [],
      listen: function (key, fn) {
        if (!this.clientList[key]) {
          this.clientList[key] = []
        }
        this.clientList[key].push(fn)
      },
      trigger: function () {
        var key = Array.prototype.shift.call(arguments)
            fns = this.clientList[key]

        if (!fns || fns.length === 0) {
          return false
        }

        for (var i = 0, fn; fn = fns[i++]; ) {
          fn.apply(this, arguments)
        }
      },
      remove: function (key, fn) {
        var fns = this.clientList[key]

        if (!fns) {
          return false
        }
        if (!fn) {
          fns && fns.length = 0
        } else {
          for (var l = fns.length - 1; l >=0; l--) {
            var _fn = fns[l]
            if (_fn === fn) {
              fn.splice(l, 1)
            }
          }
        }
      }
    }

    var installEvent = function (obj) {
      for (var i in event) {
        obj[i] = event[i]
      }
    }

    // Demo
    var salesOffices = {}
    installEvent(salesOffices)

    salesOffices.listen('squareMeter88', function (price) {
      console.log('price = ' + price)
    })

    salesOffices.listen('squareMeter100', function (price) {
      console.log('price = ' + price)
    })

    salesOffices.trigger('squareMeter88', 2000000) // output price = 2000000
    salesOffices.trigger('squareMeter100', 3000000) // output price = 3000000

全局的发布-订阅模式：

    var Event = (function () {
      var clientList = {},
          listen,
          trigger,
          remove

      listen = function (key, fn) {
        if (!clientList[key]) {
          clientList[key] = []
        }
        clientList[key].push(fn)
      }
      trigger = function () {
        var key = Array.prototype.shift.call(arguments),
            fns = clientList[key]
        if (!fns || fns.length === 0) {
          return false
        }
        for (var i = 0, fn; fn = fns[i++]; ) {
          fn.apply(this, arguments)
        }
      }
      remove = function (key, fn) {
        var fns = clientList[key]
        if (!fns) {
          return false
        }
        if (!fn) {
          fns && fns.length = 0
        } else {
          for (var l = fns.length - 1; l >= 0; l--) {
            var _fn = fns[l]
            if (_fn === fn) {
              fns.splice(l, 1)
            }
          }
        }
      }

      return {
        listen: listen,
        trigger: trigger,
        remove: remove
      }
    })()

    Event.listen('squareMeter88', function (price) {
      console.log('price = ' + price)
    })

    Event.trigger('squareMeter88', 2000000) // output price = 2000000

要留意另一个问题，模块之间如果用了太多的全局发布-订阅模式来通信，那么模块与模块之间的联系就被隐藏到了背后。我们最终会搞不清楚消息来自哪个模块，或者消息会流向哪些模块，这有会给我们的维护带来一些麻烦。

在JavaScript中，我们用注册回调函数的形式来代替传统的发布-订阅模式，显得更加优雅和简单。我们也无需去选择使用推模还是拉模型。推模型是指事件发生时，发布者一次性把所有更改的状态和数据都推送给订阅者。拉模型不同的地方是，发布者仅仅通知订阅者事件已经发生，此外发布者要提供一些公开的接口供订阅者来主动拉取数据。

拉模型的好处是可以让订阅者“按需获取”，但同时有可能让发布者变成一个“门户大开”的对象，同时增加了代码量和复杂度。

在JavaScript中，`arguments`可以很方便地表示参数列表，所以我们一般会选择推模型，使用`Function.prototype.apply`方法把所有参数都推送给订阅者。

---
layout: post
title: "《JavaScript设计模式与开发实践》读书笔记"
description: ""
category: 
tags: [JavaScript, 读书笔记]
---

### 第4章 单例模式

单例模式的定义是：保证一个类仅有一个实例，并提供一个访问它的全局访问点。要实现一个标准的单例模式并不复杂，无非是用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象。

用代理实现单例模式：

    var ProxySingletonCreateDiv = (function () {
      var instance
      return function (html) {
        if (!instance) {
          instance = new CreateDiv(html)
        }
        return instance
      }
    })()

在JavaScript中，我们经常会把全局变量当成单例来使用。但是使用全局变量存在很多问题，容易造成命名空间污染，JavaScript中的全局变量也很容易被不小心覆盖。我们有必要减少全局变量的使用，即使需要，也要把它的污染降到最低。第一种方式是使用命名空间，可以减少全局变量的数量：

    var namespace1 = {
      a: function () { alert(1) },
      b: function () { alert(2) }
    }

第二种方式是使用闭包封装私有变量，只暴露一些接口与外界通信：

    var user = (function () {
      var __name = 'sven',
          __age = 29
      return {
        getUserInfo: function () {
          return __name + '-' + __age
        }
      }
    })()

惰性单例是指在有需要的时候才创建对象实例。通用的惰性单例：

    var getSingle = function (fn) {
      var result
      return function () {
        return result || (result = fn.apply(this, arguments))
      }
    }

这样就把单例的逻辑和创建对象的逻辑成功分离，达到使用设计模式的目的。

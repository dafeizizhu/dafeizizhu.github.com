---
layout: post
title: "《JavaScript设计模式与开发实践》读书笔记"
description: ""
category: 
tags: [JavaScript, 读书笔记]
---

### 第6章 代理模式

代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。

代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际访问的是替身对象。替身对象对请求做出一些处理之后，再把请求转交给本体对象。

1. 保护代理：代理B可以帮助A过滤掉一些请求。
2. 虚拟代理：代理B把一些开销很大的对象，延迟到真正需要它的时候才创建。

虚拟代理实现图片预加载：

    var myImage = (function () {
      var imgNode = document.createElement('img')
      document.body.appendChild(imgNode)

      return {
        setSrc: function (src) {
          imgNode.src = src
        }
      }
    })()

    var proxyImage = (function () {
      var img = new Image
      img.onload = function () {
        myImage.setSrc(this.src)
      }
      return {
        setSrc: function (src) {
          myImage.setSrc('http://path/to/loading.gif')
          img.src = src
        }
      }
    })()

    proxyImage.setSrc('http://path/to/real-image.png')

单一职责原则指的是，就一个类（通常也包括对象和函数等）而言，应该仅有一个引起它变化的原因。如果一个对象承担了多项职责，就意味着这个对象将变得巨大，引起它变化的原因可能也会有多个。面向对象设计鼓励将行为分布到细粒度的对象中，如果一个对象承担的职责过多，等于把这些职责耦合到了一起，这种耦合会导致脆弱和低内聚的设计。当变化发生时，设计可能会遭到意外的破坏。

在面向对象的程序设计中，大多数情况下，若违反其他任何原则，同时将违反开放-封闭原则。

通过代理对象，实际上给系统添加了新的行为。新的行为和原来的行为被隔离在两个对象里，它们可以各自变化而不影响对方。在不需要新的行为时，只需要改成请求本体而不是请求代理对象即可。

在客户看来，代理对象和本体是一致的，代理接手请求的过程对于用户来说是透明的。在Java语言中，代理和本体都需要显式地实现同一个接口，一方面接口保证了它们会拥有同样的方法，另一方面，面向接口编程迎合依赖倒置原则，通过接口进行向上转型，从而避开编译器的类型检查，代理和本体将来可以被替换使用。

**在JavaScript中并没有接口**。全部依赖于程序猿的自觉性，对于程序的健壮性是有影响的。

如果代理和本体都为一个函数，函数必然都能被执行，则可以认为它们也具有一致的“接口”。最好能使用同一组参数。

用高阶函数动态创建代理：

    var mult = function () {
      var a = 1
      for (var i = 0, l = arguments.length; i < length; i++) {
        a = a * arguments[i]
      }
      return a
    }

    var createProxyFactory = function (fn) {
      var cache = {}
      return function () {
        var args = Array.prototype.join.call(arguments, ',')
        if (args in cache) {
          return cache[args]
        }
        return cache[args] = fn.apply(this, arguments)
      }
    }

    var proxyMult = createProxyFactory(mult)

    console.log(proxyMult(1, 2, 3, 4) // output 24
    console.log(proxyMult(1, 2, 3, 4) // output 24 from cache

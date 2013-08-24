---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 with语句"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

刚接触JavaScript，其中N本入门的书都说不要使用`with`。可是大家有没有了解过为什么不能使用`with`，会造成变量的混淆，还是因为别的什么原因？为了了解其中的缘由，我们需要了解`with`究竟是什么，会对代码造成怎么样的影响。今天先简单介绍一些`with`的用法以及一些需要注意的地方。

> A  with statement creates a scope within which the properties of a specified object can be referenced without a prefix. 

使用`with`可以创建出一个执行作用域。在这个作用域中，作为`with`的参数传入的对象的属性可以直接引用，而不需要通过这个对象引用，例如：

    var o = { "a": "a" };
    with(o) {
      alert(a); // "a"
    }

###在`with`中引用属性

上面说过，`with`是创建了一个临时的作用域，使得可以直接访问`with`参数中变量的属性。所以，在`with`的作用域中，当属性跟外面的变量冲突的时候，**`with`中的属性优先级比较高**，例如：

    var use = "other";
    var katana = {
      isSharp: true,
      use: function () {
        this.isSharp = !this.isSharp;
      }
    };
    with(katana) {
      alert(use);
    }

结果表明在`with`作用域中`use`是`katana`中的属性，例子[参考这里](http://jsfiddle.net/D2ZT8/)。这个结果可能会混淆在`with`作用域中变量`use`的内容，这是其中一个不愿意使用`with`的原因。

###在`with`中对变量进行赋值操作

那如果在`with`中对参数中的属性进行赋值又如何，看以下这个例子：

    var katana = {
      isSharp: true,
      use: function () {
        this.isSharp = !this.isSharp;
      }
    };
    with(katana) {
      isSharp = false;
      assert(katana.isSharp === false,
        "properties can be assigned");
      cut = function () {
          isSharp = false;
      };
      assert(typeof katana.cut == "function",
        "new properties can be created on the scoped object");
      assert(typeof window.cut == "function",
        "new properties are created in the global scope");
    }

例子运行结果[参考这里](http://jsfiddle.net/FLe5m/)。可以看到第二个断言失败了。从这三个断言可以得出以下结论：

1. 如果给参数中已存在的属性（如上例的`isSharp`）赋值，则会成功改变参数中对应属性的值。
2. 如果给参数中不存在的属性（如上例的`cun`）赋值，则会在全局作用域中增加这个属性。

如果想为参数增加一个属性，则需要这么写：

    katana.cut = function(){
      isSharp = false;
    };

这个是第二个不使用`with`的原因，很可能因为一个拼写错误而为全局作用域增加一个属性。

###性能

由于`with`会创建一个临时的作用域，当`with`内部的代码引用了一个变量，由于作用域链的增加会导致遍历层数的增加，造成性能损耗。更有甚者，即使`with`内部不访问也不修改`with`参数中的属性，也会导致遍历层数的增加！所以使用`with`之后会有一个微小的性能损耗，当使用`with`的函数调用次数非常巨大的时候，会造成性能瓶颈。**当性能要求非常高的场景，也不要使用`with`。**

尽管`with`这么多缺点，但是在一些特殊的应用场景下还是有它特殊的作用，会有一些意想不到的效果，明天再继续周末读书时间，讨论`with`在真实场景下的应用。

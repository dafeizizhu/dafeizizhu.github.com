---
layout: post
title: "jQuery源码解析之jQuery.Callbacks"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

昨天介绍了`jQuery.Callbacks`方法，今天简单看一下它的源码。github上的代码链接[在这里](https://github.com/jquery/jquery/blob/master/src/callbacks.js)。

jQuery的主干已经是2.0版本了。几乎每个文件的开始都是按照以下的形式给出：

    define([
      "./core",
      "./var/rnotwhite"
    ], function( jQuery, rnotwhite ) {

通过一个全局的`define`函数，实现类似于node的依赖管理。现在还没有看`define`的源码，可以猜测第一个参数就是这个js文件（模块）的依赖，而这个模块的逻辑都被封装在第二个匿名函数的闭包里面。

首先是一个工具方法，解析`jQuery.Callbacks`方法传入的参数，即各种flag。这里有一个性能优化点，`Callbacks`方法会以每次调用的字符串参数作为key，解析的结果作为value缓存起来，下次使用同样的字符串调用`jQuery.Callbacks`就可以省去解析参数的过程了。

这个方法的核心就是返回的对象，这个对象的核心就是`fire`、`add`和`remove`等方法。

首先来看一个工具函数`fire`，`Callbacks`对象上的`fire`跟`fireWidth`这两个方法都是基于这个工具函数的。这个工具函数会递归调用自己，并每次更改`fire`的索引来遍历整个回调列表。这里关注一下递归的结束条件：

    if ( stack ) {
      if ( stack.length ) {
        fire( stack.shift() );
      }
    } else if ( memory ) {
      list = [];
    } else {
      self.disable();
    }

`stack`这个变量很有意思。当`once`标志生效时，这个`stack`永远都为`false`。如果`once`标志不生效，这个`stack`就是作为在`fire`的过程中，再调用`fire`时的一个类似于消息队列的东西。第一个逻辑是判断是否有消息队列，如果有则从消息队列中取出一个消息递归调用`fire`本身。如果没有消息队列，说明`stack`为`false`，这时也有两种情况。

1. `memory`标志生效，则把`list`重置为空数组，接受下一次的`add`操作。
2. `memory`标志不生效，则说明个只有`once`标志生效，禁用这个`Callbacks`对象。

第二个要关注的方法就是`add`，负责添加回调到`Callbacks`对象上面。这个方法支持传入参数的方式有很多种：可以是简单的一个方法，也可以是一个方法的数组，也可以是前两者的混搭，例如：

    var cbs = $.Callbacks();
    cbs.add(fn);
    cbs.add([fn1, fn2, fn3]);
    cbs.add(fn, fn1, [fn2, fn3, fn4]);

要实现这种机制，需要一个递归去遍历`arguments`。判断`arguments`中的每个参数的类型：

1. 如果是方法，直接加到回调列表`list`中。
2. 如果是一个类似数组的东西，递归调用`add`（实现中是一个内部的匿名函数）。

通过这个机制就可以把上面三种类型的参数传入方式都解析出来，提取对应的回调，并添加到回调列表里面。再关注一下最后的几行代码：

    // Do we need to add the callbacks to the
    // current firing batch?
    if ( firing ) {
      firingLength = list.length;
    // With memory, if we're not firing then
    // we should call right away
    } else if ( memory ) {
      firingStart = start;
      fire( memory );
    }

注意，`fire`的时候也可以调用`add`。如果正处在`fire`的过程中（`firing === true`），需要把要遍历的回调列表长度调整到调用`add`之后的长度。如果不在`fire`过程中，则要判断`memory`标志是否生效，生效则需要重新触发`fire`，保证刚增加的回调函数能顺利执行。

最后再关注一下`remove`方法，这里值得注意的也是`fire`过程中的`remove`。需要判断当前删除的回调是否已经执行，代码片段如下：

    // Handle firing indexes
    if ( firing ) {
      if ( index <= firingLength ) {
        firingLength--;
      }
      if ( index <= firingIndex ) {
        firingIndex--;
      }
    }

`Callbacks`对象还有其他方法，例如`has`、`empty`、`disable`、`lock`，还有几个获取状态的方法，这里就不详细展开了，有兴趣的同鞋可以参考上面的github上的链接看其他的源码。不得不佩服jQuery为了满足各种各样的场景而写出这样完备的代码，在日常工作中，我个人还是觉得应该根据具体的应用场景去考虑代码的健壮性，如果每一个功能、每一段代码都得像jQuery那样严谨完备，的确是件十分美妙的事情，工作往往是更现实的事情，各种无奈就不多展开了啊！

---
layout: post
title: "jQuery.Callbacks"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

今天第一天入职，就听到`jQuery.Callbacks`这个方法。使用这个方法可以实现功能强大的观察者模式。

> A multi-purpose callbacks list object that provides a powerful way to manage callback lists.

这个方法是`jQuery.ajax`和`jQuery.Deffered`的内部实现呢。今天先不看代码，先简单看看这个方法是怎么使用的。这个方法接受一个参数`flag`，可选的值有以下几个或者这几个的组合（之间用空格隔开）：

1. `once`，保证相关的绑定的回调只会调用一次。
2. `memory`，这个是一个相当有趣的标志。当先触发，再绑定的情况下绑定的回调照样会执行！
3. `unique`，保证每个回调函数只能被绑定一次。
4. `stopOnFalse`，当任何一个回调函数返回`false`的时候停止其他回调函数的执行。

执行这个方法后会返回一个`Callbacks`类型的对象。该对象有几个比较重要的方法：

1. `add`，绑定回调，可以绑定单个函数或者绑定一个函数的数组。
2. `remove`，解除绑定，接受的参数与`add`一致。
3. `fire`，触发回调，传入的参数也会传入到每一个回调函数里面。
4. `disable`，不接受参数，禁用该对象，`fire`、`remove`等都被禁用。

使用`jQuery.Callbacks`可以实现一个观察者模式。下面是jQuery文档里面的一个例子：

    var topics = {};
 
    jQuery.Topic = function( id ) {
      var callbacks,
        method,
        topic = id && topics[ id ];
      
      if ( !topic ) {
        callbacks = jQuery.Callbacks();
        topic = {
          publish: callbacks.fire,
          subscribe: callbacks.add,
          unsubscribe: callbacks.remove
        };
        if ( id ) {
          topics[ id ] = topic;
        }
      }
      return topic;
    };

使用方法为：

    // Subscribers
    $.Topic( "mailArrived" ).subscribe( fn1 );
    $.Topic( "mailArrived" ).subscribe( fn2 );
    $.Topic( "mailSent" ).subscribe( fn1 );
 
    // Publisher
    $.Topic( "mailArrived" ).publish( "hello world!" );
    $.Topic( "mailSent" ).publish( "woo! mail!" );

例子[参考这里](http://jsfiddle.net/x5NNQ/)。明天继续围观相关jQuery的源码！

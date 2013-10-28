---
layout: post
title: "jQuery扫盲之Callbacks"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

jQuery在1.7的时候引入了一个`jQuery.Callbacks`方法，返回一个强力的对象去管理我们的回调函数列表。这个对象支持对回调函数列表的增删改、触发停用等操作。

先来看看这个方法用来干嘛的：

>  A multi-purpose callbacks list object that provides a powerful way to manage callback lists

简单的说就是返回一个对象让我们去管理回调函数。这个方法接受一个参数，可以配置`callbacks`的行为。返回的对象提供了一些方法，让我们可以去控制这些回调函数，例如增加、删除、触发或者禁用等。

最简单的用法是：

    var callbacks = $.Callbacks();
    callbacks.add(function () { alert(1); });
    callbacks.fire(); // alert(1);

`add`就是增加回调函数，`fire`就是触发这些回调，就是这么简单。在调用`jQuery.Callbacks`的时候我们还可以传入一个标志位，它是若干的标志的集合，用空格分开，支持以下标志位：

1. `once`，表示这个回调函数列表只能被`fire`一次，之后的`fire`都不会调用这些回调函数。
2. `memory`，表示会跟踪触发的状态，即`fire`之后再`add`的回调函数，不需要再次`fire`也会被执行。
3. `unique`，表示一个回调只能被`add`一次。
4. `stopOnFalse`，表示当一个回调函数返回`false`的时候剩下的回调函数都不会被执行。

可以看到这些标志位的设置跟jQuery常用的事件处理的方式都有点联系，例如`one`可以看到`jQuery.fn.one`这种绑定事件的方式，而`stopOnFalse`正好也是jQuery在处理事件的时候`return false`有点关系。其实jQuery关于事件的操作很多都是基于这个`callbacks`对象去做的，例如`$.Deffered`。

通过这个方法，我们可以实现一个比较优雅的观察者模式：

    var topics = {};
 
    jQuery.Topic = function( id ) {
      var callbacks, method,
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

---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 闭包（一）"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

又到读书笔记的时候了！闭包，是JavaScript的重要特性之一，这里不聊什么是闭包，这篇文章主要关注闭包的作用。

###绑定函数的执行上下文

我们知道，为一个DOM元素绑定事件，无论使用原生的`addEventListener`或者jQuery的`on`，事件处理程序里面的上下文`this`都是DOM元素本身。如果把一个对象的方法作为事件处理程序绑定到DOM元素的某个事件上，而这个方法又使用了`this`引用这个对象的其他方法，这样触发事件执行处理程序的时候必然会出错。所以我们需要手动把事件处理程序的执行上下文`this`改变成这个对象本身，如：

    if (!Function.prototype.bind) {
      Function.prototype.bind = function (context){
        var fn = this;
        return function(){                                
          return fn.apply(context,arguments);  
        };                                                
      }
    ｝

这里我作了一些小改动，在JavaScript 1.8.5中，`bind`已经是`Function`原型的方法了。通过闭包把原来的方法记录下来，在返回的匿名函数中调用原来方法的`apply`改变执行上下文`this`指向的对象，这样就可以手动地改变事件处理程序中的`this`。

我个人更偏好于使用jQuery的`proxy`方法来做这个事情，如：

    $("#id").on("click", $.proxy(obj.func, obj));

保持对象（或者“类”的“实例”）方法中`this`的指向永远是该对象本身，对于面向对象的JavaScript来说我认为是十分必要的，可以增加一个“类”中代码的可读性与可维护性。

###柯里化

柯里化就是把一个函数的某些参数预置好，返回一个新的函数，接受没有预置的参数。实现的方式有很多种，如果不通过闭包可以将函数进行二次封装而产生新的函数。纯粹地预置参数，这样做未免有些冗余，如果使用闭包，只需要调用某个`curry`函数，传入预置的参数，就可以返回一个新的函数了。这里分享一个比较有意思的实现，它能预置一个函数中任意位置的参数：

    Function.prototype.partial = function() {
      var fn = this, args = Array.prototype.slice.call(arguments);
      return function() {
        var arg = 0;
        for (var i = 0; i < args.length && arg < arguments.length; i++) {
          if (args[i] === undefined) {
            args[i] = arguments[arg++];
          }
        }
        return fn.apply(this, args);
      };
    };

通过柯里化过程中传入`undefined`的位置，预留给结果函数来传入非预置的参数。传给结果函数的参数会像填坑一样把那些之前标识为`undefined`的参数填充起来。

今天就先到这里，闭包的作用还有很多很多，明天继续！

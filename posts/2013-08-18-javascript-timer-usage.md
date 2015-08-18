---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 使用定时器"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

继续周末读书时间。昨天讨论了定时器的基本原理，今天来看看定时器在实际使用中能做些什么有趣的事情。

###连续执行耗时任务

在某些应用场景中，需要对一大堆数据进行处理（例如根据数据渲染表格，数据量超过1000+条）。如果仅仅用一个`for`循环对每一个数据项进行处理，由于整个处理的过程都是同步的，而JavaScript的处理线程（包括浏览器渲染、事件处理等）是单线程的，这样连续的同步操作会导致浏览器没有办法对用户的操作进行响应，某些浏览器（例如FireFox），在超过特定的时间内执行的JavaScript代码，会弹出提示框提示用户是否继续执行这些操作。这样的用户体验是相当糟糕的。那么如何在处理这一大堆数据的同时，也不让浏览器弹出类似的提示框呢？

我们可以利用定时器把这一系列的同步操作分割成多个异步操作连续执行，在每个异步操作执行的间隔，把JavaScript线程空闲出来处理浏览器另外的事务。可以抽象出这样一个方法，对大数据（一般是`length`相当长的数组）进行分段操作：

    function asyncProcess(data, fn, complete, blockSize, timeout, context) {
      data = data || [];
      fn = fn || function () {};
      blockSize = blockSize || data.length;
      timeout = timeout || 200;
      complete = complete || function () {};
    
      var index = tId = 0;
    
      function process() {
        var block = data.slice(index, index + blockSize);
        for (var i = 0; i < block.length; i++) {
          fn.call(context, block[i]);
        }
        if (index + blockSize > data.length) {
          complete.call(context);
          clearTimeout(tId);
        } else {
          index = index + blockSize;
          tId = setTimeout(process, timeout);
        }
      }
    
      tId = setTimeout(process, timeout);
    }

在处理好每次分段处理的数据量之后，再也不会担心浏览器弹出那些讨厌的对话框了！例子[参考这里](http://jsfiddle.net/bVjxX/1/)。

###统一控制的定时器

当一个功能比较简单的时候，可能仅仅需要一个或者两个定时器就能完成对应的功能。但是，随着需求的增加，可能会不断地往页面中添加定时器。当定时器的数量不断增多的时候，整个页面的定时器就越来越难管理起来。更多的定时器也意味着要处理更多相关的撤销代码、内存问题等。

应该尽量减少定时器的数量。能否用一个定时器，通过增加、删除对应的处理逻辑来实现相关的增加、撤销定时器的功能？统一控制的定时器就是为了解决这个问题。统一控制的定时器有下列特点：

1. 只有一个定时器实例。
2. 可以随时启停定时器。
3. 简化删除一个“定时器”的逻辑。

以下是实现这个定时器的代码：

    var timers = {                               
      timerID: 0,                                           
      timers: [],                                           
      add: function(fn) {                            
        this.timers.push(fn);
      },
      start: function() {                             
        if (this.timerID) return;
        (function runNext() {
          if (timers.timers.length > 0) {
            for (var i = 0; i < timers.timers.length; i++) {
              if (timers.timers[i]() === false) {
                timers.timers.splice(i,1);
                i--;
              }
            }
            timers.timerID = setTimeout(runNext, 0);
          }
        })();
      },
      stop: function() {                                  
        clearTimeout(this.timerID);
        this.timerID = 0;
      }
    };

通过对应的`start`和`stop`来实现定时器的启停。通过`add`增加一个“定时器”。通过在“定时器”逻辑中返回`false`来删除这个“定时器”。

---
layout: post
title: "jQuery扫盲之jQuery.holdReady"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

今天来看一下一个我们平常都不会使用的方法`jQuery.holdReady`：

> Holds or releases the execution of jQuery's ready event.

顾名思义，这个方法是用来延迟`ready`事件的触发时间。它接受一个参数`hold`，是个布尔值，表示这次调用是把`ready`事件hold住还是释放`ready`事件。

那把`ready`事件hold住有什么场景？有时候我们需要为页面动态加载一段代码，而又想我们的其他代码在这动态加载的代码之后执行，一般会这么做：

    $(function () {
      $.getScript("path/to/script", function () {
        ... // our code here
      });
    });

本来直接写到`$()`里面的代码要写到`$.getScript`的回调中去。这时候使用`jQuery.holdReady`就可以不改原来的代码，直接增加以下的代码：

    $.holdReady(true);
    $.getScript("path/to/script", function () {
      $.holdReady(false);
    });
    // old code
    $(function () {
      ... // our code here
    });

当`ready`事件已经被触发了之后再调用`jQuery.holdReady`是不会有任何效果的哦。

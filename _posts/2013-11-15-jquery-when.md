---
layout: post
title: "jQuery扫盲之jQuery.when"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

现实工作中我们经常会遇见一个场景，需要多次调用Ajax，在所有请求都完成的时候再执行一个回调函数。我们可以自己做一个计数器，每次Ajax执行完计数器加一，这样就可以知道是不是所有Ajax都调用完成了。其实jQuery已经提供了这么一个功能，就是`jQuery.when`：

> Provides a way to execute callback functions based on one or more objects, usually Deferred objects that represent asynchronous events.

这个方法接受一个或者多个`Deffered`对象，例如`jQuery.ajax`返回的东东。如果只传入一个`Deffered`对象，这个方法会简单地返回这个`Deffered`对象，例如：

    $.when($.ajax());
    $.ajax(); // equals

如果传入一个不是`Deffered`对象的参数，这相当于`Deffered`对象已经resolve了，所有注册的回调都会立刻执行，例如：

    $.when( { testing: 123 } ).done(function( x ) {
      alert( x.testing ); // Alerts "123"
    });

这个方法最有用的用法还是传入多个`Deffered`对象的时候。这时，返回的对象要在所有参数都被`resolve`的时候才会被`resolve`，而当有一个参数被`reject`的时候就会被`reject`。当这个对象被`resolve`的时候，会回传各个单独`resolve`时返回的结果（就是每个回调函数中的参数），顺序就是参数传入的顺序，例如：

    $.when( $.ajax( "/page1.php" ), $.ajax( "/page2.php" ) ).done(function( a1, a2 ) {
      // a1 and a2 are arguments resolved for the page1 and page2 ajax requests, respectively.
      // Each argument is an array with the following structure: [ data, statusText, jqXHR ]
      var data = a1[ 0 ] + a2[ 0 ]; // a1[ 0 ] = "Whip", a2[ 0 ] = " It"
      if ( /Whip It/.test( data ) ) {
        alert( "We got what we came for!" );
      }
    });

这不就是我们需要的功能吗？当然，这个方法只适用于各个Ajax请求独立的场景，如果这几个Ajax请求是有顺序的话就只能求助于别的方式了。

---
layout: post
title: "window.requestAnimationFrame"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

基于脚本的动画，我们通常会使用`setTimeout`或者`setInterval`去做：

    setInterval(step, interval);

但是有没有想过当中的`interval`要设置多少才合适呢？为了动画的流畅，我们可能会把这个时间设置成尽可能的小，例如`10`。这样，动画就会每10毫秒绘制一祯。但是，由于显示的时候还是有一个频率的（例如60HZ），过小的时间间隔会造成某些祯处于显示的间隔时间，这样这些祯就显示不出来。而且设置这么小的时间间隔也会加大浏览器对CPU的消耗。

这时候，可以使用`window.requestAnimationFrame`来替代以前基于`setTimeout`的实现：

> The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint.

这个方法告诉浏览器现在需要为一个动画重绘一祯，浏览器会自行计算调用的时间，调用传入的回调函数。回调函数的单位时间调用次数跟显示设备的刷新频率有关，不过不用担心，这些东西浏览器都会帮我们算好的。回调函数接受一个参数，就是这次调用的时间间隔。调用这个方法之后跟`setTimeout`一样，会返回一个`id`，调用`window.cancelAnimationFrame`也可以终止下一个回调函数的执行，跟`clearTimeout`是一致的。

很可惜，`window.requestAnimationFrame`不是所有IE都支持，只有IE10才支持这个方法。但是由于这个方法的调用方式跟`setTimeout`是一致的，我们其实可以比较方便地在IE上做一个退化方案：

    function reqAnimationFrame(callback) {
      if (typeof requestAnimationFrame == "function") {
        return requestAnimationFrame(callback);
      } else {
        return setTimeout(callback, 60); // Default interval
      }
    }
    function cancel(id) {
      if (typeof requestAnimationFrame == "function") {
        cancelAnimationFrame(id);
      } else {
        clearTimeout(id);
    }

在不支持`requestAnimationFrame`的实现中需要一个默认的时间间隔，基本能满足需求。以后要做动画，记得要使用这个API哦亲！

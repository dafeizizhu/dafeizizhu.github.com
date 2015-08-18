---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 闭包（三）"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

这次读书笔记的最后一篇。今天主要分享即时执行函数的作用。我们知道，在JavaScript中是没有块作用域的（例如`if`里面的块），唯一产生作用域的就是函数。常见的制造私有作用域的方法如以下代码所示：

    (function () {...})();

书中强调了两个括号有不同的作用。第一组括号其实是声明了运算的优先级，而第二组括号却是一个运算符，用来执行第一组括号中的匿名函数。比较有趣的用法是：

    document.addEventListener("click", (function(){
      var numClicks = 0;  
      return function(){
        alert( ++numClicks );
      };
    })(), false);

这里使用了闭包，为事件处理程序增加了一个`numClicks`的状态。这种写法适用于这个状态只是在这个事件处理程序中使用，可以减少外围作用域中的变量，也可以使代码更加简洁，层次更加清晰。

通过给即时执行函数传入参数，可以解决一些重名冲突的问题。例如在即时执行函数中使用`$`来使用jQuery，而在外部则可以让`$`指向另外的变量（例如Prototype框架的`$`）：

    (function ($, undefined) {...})(jQuery, undefined);

这种方式也可以解决一些长变量名或者引用层次深的变量的引用问题，也可以帮助JavaScript代码压缩的时候提高压缩比，例如把`undefined`压缩成`a`等。

书中也讲到了一个循环与闭包的常见问题，例如给一系列的DOM元素绑定事件处理程序（不使用jQuery）。通常我们使用`for`循环来绑定事件，要注意以下代码：

    for (var i = 0; i < div.length; i++) (function(n){
      div[n].addEventListener("click", function(){
        alert("div #" + n + " was clicked.");
      }, false);
    })(i);

注意以上的写法，没有简单调用`addEventListener`去绑定事件，而是为每次循环制造了一个闭包来保存迭代子`i`的值。这样做才能保证在事件处理程序调用的时候能正确引用正确的`i`的值，否则当事件处理程序调用的时候只能获取到迭代子`i`最后的状态！

最后一个点就是在闭包内部，如果需要暴露到全局的对象，要注意这么写：

    (function(){
      var jQuery = window.jQuery = function(){
        // Initialize
      };
      // ...
    })();

或者

    var jQuery = (function(){
      function jQuery(){
        // Initialize
      }
      // ...
      return jQuery;
    })();

这样写的好处是，如果外部有恶意用户写出`jQuery = null`这样的恶意代码，也不影响之前正确使用jQuery的相关功能，因为这样的代码影响的只是全局变量中的jQuery的引用，而不会影响闭包内部逻辑的正确处理，[参考这里](http://jsfiddle.net/XBy5X/)。

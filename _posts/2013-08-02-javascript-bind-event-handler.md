---
layout: post
title: "三种原生JavaScript绑定事件方式对比"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

今天又被问到三种原生JavaScript绑定事件的方式有什么不一样。感觉自己答不全啊，惭愧。晚上立马来恶补一下它们究竟有什么区别。下文主要从执行上下文（`this`）、返回值等几个方面说明三者的区别。

###HTML标签上面的`onclick`特性

曾经有那么一个时候，以下这种事件绑定的方式使用频率最高：

    <input type="button" value="Click me!" onclick="alert('Hello World');" />

当单击按钮的时候会弹出一个消息框。先来看看这个事件处理程序的特点：

1. 执行上下文是DOM元素。而MDN上面说的是`window`对象。
2. 当返回值是`false`的时候阻止默认行为，但不阻止事件传播。
3. 事件的传播只能是冒泡的。

对于第一点MDN说的情况我猜是这样的，假如有以下代码：

    <input type="button" value="Click me!" onclick="doSomething();" />

JavaScript：

    function doSomething() { alert(this === window); } // true

当单击按钮的时候执行`doSomething`函数时，里面的`this`就是`window`，因为执行上下文在`window`中。

例子[参考这里](http://jsfiddle.net/MB9af/5/)。当JavaScript代码偏少的时候，这种方式还能勉强接受。当代码规模变大的时候，这种方式明显地带来很多不方便的东西。例如修改行为的时候还需要去修改HTML文件，这不是我们想要看到的。我们希望HTML与JavaScript能够分开维护，当修改行为的时候不要修改负责显示的东西。所以就有了下面这个绑定事件的方式。

###DOM对象上的`onclick`属性

为了能够分开HTML和JavaScript代码，我们也曾经广泛使用了一下这种方式去绑定事件：

    var button = document.getElementById("#id");
    button.onclick = function (evt) { evt = evt || windowo.event; alert("Hello World"); };

这个事件处理程序的特点是：

1. 执行上下文是绑定的DOM元素`button`。
2. 返回值是`false`的时候阻止默认行为，但不阻止事件传播。
3. 事件的传播只能是冒泡的。

例子[参考这里](http://jsfiddle.net/ZbR4J)。以上这段JavaScript代码就为一个按钮绑定了一个单击事件。从代码结构上看，HTML和JavaScript确实分开了。但是这种方式有个严重的问题，就是只能为一个DOM元素的一个事件绑定唯一一个事件处理程序，重复绑定会覆盖了第一个绑定的事件处理程序，如：

    button.onclick = function (evt) { alert(1); }
    button.onclick = function (evt) { alert(2); }

以上代码，单击`button`只会弹出`2`，第一个事件处理程序已经被覆盖了。而且在低版本的IE浏览器里面这种写法很容易就会导致DOM与JavaScript对象的循环引用，导致内存泄露。

###addEventListener

为了能在一个DOM上面的一个事件绑定多个事件处理程序，DOM level 2定义了以下的方式去绑定事件：

    button.addEventListener("click", function (evt) { ... }, true); // IE9, IE9+, Chrome, Safari, Opera
    button.attatchEvent("onclick", function () { ... }); // IE9-

这个事件处理程序的特点是：

1. 执行上下文是DOM元素。
2. 返回值是`false`的时候不阻止默认行为，也不阻止事件传播，只能通过调用事件对象的`preventDefault`才能阻止默认行为，调用`stopPropagation`才能阻止事件传播。
3. 事件的传播可以选择是冒泡（默认）或者是捕获的。（IE不支持事件捕获）
4. 绑定的事件处理程序可以通过`removeEventHandler`或者`detachEvent`来删除。
5. 多个事件处理程序的执行顺序是由绑定的顺序决定的，而且如果一个事件处理程序报错，不影响其他事件处理程序的执行。例子[参考这里](http://jsfiddle.net/myPP7/)。

例子[参考这里](http://jsfiddle.net/5zpLT/3/)。DOM level 2的事件绑定机制可以让我们把HTML和JavaScript代码分开，也支持为一个DOM的同一个事件绑定多个事件处理程序，基本满足了我们对事件绑定的需求。由于IE这个奇葩不支持事件捕获机制，所以要写跨浏览器的代码，只能使用冒泡来传播事件哦！

貌似还不太够啊，等哥再仔细看看MDN和W3的规范后再补补。

---
layout: post
title: "模拟触发DOM事件之原生模拟事件"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

昨天讲到一个如何在测试的时候模拟一个DOM事件，例如单击鼠标、输入文字等。当时我第一反应就是使用jQuery的`trigger`方法触发事件，那哥们竟然说了一个原生的API：`document.createEvent`。当时我就震惊了，为啥不用jQuery哦亲。今天先简单了解一下这个API的作用，科普科普。

先看看MDN上面对`document.createEvent`的说明是啥：

> Creates an event of the type specified. The returned object should be first initialized and can then be passed to element.dispatchEvent.

这个API是创建一个Event对象，接受一个参数，就是表示事件类型的字符串。该字符串的可能取值为：

1. `UIEvent`，通用的UI事件，键盘鼠标事件都是继承于这个事件。
2. `MouseEvent`，鼠标事件。
3. `MutationEvent`，通用的突变事件。
4. `HTMLEvent`，通用的HTML事件。

使用该API创建出事件对象之后，需要在触发模拟事件的DOM上调用`dispatchEvent`方法，触发该模拟事件。MDN的实例代码如下，[参考这里](http://developer.mozilla.org/samples/domref/dispatchEvent.html)：

    function simulateClick() {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var cb = document.getElementById("checkbox"); 
        var canceled = !cb.dispatchEvent(evt);
        if(canceled) {
            // A handler called preventDefault
            alert("canceled");
        } else {
            // None of the handlers called preventDefault
            alert("not canceled");
        }
    }

`dispatchEvent`会返回该事件是否取消浏览器默认行为的布尔值。

注意哦，不同类型的Event对象使用的初始化方法也不同，上述的四个事件类型对应的初始化事件的方法分别是：

1. `initUIEvent`，初始化基本UI事件，该方法接受事件类型、是否冒泡、是否能取消默认行为、关联的视图（window）、详细信息（如鼠标单击事件鼠标被单击多少次）等参数。
2. `initMouseEvent`，初始化鼠标事件，前五个参数与`initUIEvent`类似，后面有鼠标位置相对于屏幕的坐标、相对于client的坐标、修饰键、哪个鼠标按键被按下以及鼠标移入或者移出的DOM对象。
3. `initMutationEvent`，初始化通用突变事件。
4. `initEvent`，初始化HTML通用事件，与`initUIEvent`的前三个参数类似。
5. `initKeyboardEvent`，这个是键盘事件对应事件类型，可以在`createEvent`方法中传入`KeyboardEvent`来创建键盘事件，该事件继承于`UIEvent`。

更详细的信息请猛击[这里](https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent)。

一个值得注意的地方是，MDN上有这么一个警告：

> The createEvent method is deprecated. Use event constructors instead.

原来这个方法已经被废弃了，MDN建议使用Event的构造方法来创建Event对象。明天将继续研究Event的构造方法以及jQuery的`trigger`方法是如何实现的。

两天的阿里D2结束了，接收到不少干货，也走了西湖，匆忙的旅行也算是比较满足了。两天的演讲里面，让我真的非常佩服于阿里人的演讲水平。一些本来是非常好的干货，讲得太干了原来也让人难以下咽。借用一个前同事的话来总结：程序员发展到一定的水平后，瓶颈并不在技术水平上，而是在表达能力上。再见啦杭州，下次一定会再来！

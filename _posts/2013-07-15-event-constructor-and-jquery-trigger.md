---
layout: post
title: "模拟触发DOM事件之jQuery trigger"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

昨天写了一下`document.createEvent`这个方法，并描述了如何使用该方法模拟DOM事件。今天看看MDN建议的`Event`构造函数，以及jQuery是如何处理`trigger`的。

`Event`构造函数接受两个参数：

1. 表示事件类型的字符串，如`click`、`change`甚至是自定义的字符串。
2. 事件的附加属性，用一个JavaScript对象表示，如`{ "a": "something additional" }`。

由于简化了事件附加属性的设置，不需要像`document.createEvent`那样分开各种事件类型，并且使用不同的`init`方法。下面给出一个MDN上面的例子：

    var event = new Event('build');

    // Listen for the event.
    elem.addEventListener('build', function (e) { ... }, false);

    // Dispatch the event.
    elem.dispatchEvent(event);

`Event`构造函数在绝大部分的现代浏览器里面都支持（IE9也支持，可怜的IE8）。如果要兼容老版本的IE浏览器，需要使用昨天的`document.createEvent`方法。

现在来看看jQuery的`trigger`方法，是如何实现跨浏览器模拟触发DOM事件的。

看了源码我震惊了，jQuery完全没有使用上述任何一个API，包括`document.createEvent`和`Event`构造函数。jQuery使用的是自定义的事件对象`jQuery.Event`，里面包括了原生事件里面的所有属性和方法（封装了浏览器的差异），以及一些jQuery的扩展属性。当使用`trigger`时，jQuery会遍历这个DOM元素的事件冒泡路径，就是这个DOM元素在DOM树里面的完整路径。然后收集在DOM树上所有这个事件的处理程序，根据冒泡的顺序触发对应的事件处理程序。整个过程都没有使用DOM原生的模拟事件。

有趣的是，即使不是使用jQuery绑定的事件，都可以通过`trigger`触发，这个是由于有以下两段代码：

    handle = ontype && cur[ ontype ];
    if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
        event.preventDefault();
    }

和

    tmp = elem[ ontype ];
    if ( tmp ) {
        elem[ ontype ] = null;
    }
    // Prevent re-triggering of the same event, since we already bubbled it above
    jQuery.event.triggered = type;
    elem[ type ]();
    jQuery.event.triggered = undefined;

通过`elem`上面属性可以获取到通过`onXXX`（DOM2）以及`addEventListener`（DOM3）绑定的事件处理程序，并执行它们。可以[参考这里](http://jsfiddle.net/qxAz8/2/)。

今天终于收到offer了，下个月就离开我司。最后享受这一个月的时光吧，fight！

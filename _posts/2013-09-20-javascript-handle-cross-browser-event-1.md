---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 跨浏览器处理事件（一）"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

处理事件是JavaScript最最最最最最重要的一部分，负责用户与页面的交互逻辑。由于种种历史遗留问题，从绑定事件，到事件对象、处理程序的上下文等，IE跟标准的浏览器不太一样，这需要我们抽象出绑定事件的一般接口，根据不同的浏览器给出不同的实现。

###绑定与解绑定事件
____

标准浏览器使用`addEventListener`和`removeEventListener`去绑定和解绑定事件，而IE9之前版本的IE使用`attachEvent`和`detachEvent`。

标准的事件处理有捕获和冒泡两个阶段，而IE只支持事件冒泡阶段。还有，标准的事件处理程序中的`this`是DOM元素，而IE则是`window`对象。标准的事件处理程序接受一个事件对象作为参数，而IE则是把事件对象存储在一个全局变量（`window.event`）中。

为了保持每个浏览器的行为一致，我们需要编写一些代码使得IE也具有跟标准事件绑定一致的行为：

1. 抽象通用的接口绑定事件。
2. 抽象通用的接口解绑定事件。
3. 调用事件处理程序的时候传入事件对象。
4. 调用事件处理程序的时候保证上下文为DOM本身。

最简单的实现就是使用特性检测：

    if (document.addEventListener) {
      // DOM Modal
    } else if (document.attachEvent) {
      // IE Modal
    }

在IE的实现中要使用`apply`改变事件处理程序中的`this`，让其指向DOM元素。

###跨浏览器的事件对象
____

不仅是传递事件信息的方式不一样，连事件对象本身的数据结构也不一样。我们需要抽象出一个新的对象，兼容这两种事件对象的模型。需要关注的是以下几个属性：

1. `target`，对应IE模型里面的`srcElement`。
2. `relatedElement`，对应IE模型里面的`fromElement`或者`toElement`。
3. `preventDefault`，在IE模型中没有这个方法，需要增加一个新的方法，把`returnValue`设为`true`。
4. `stopPropagation`，同上，需要增加一个方法把`cancelBubble`设为`true`。
5. `clientX`和`clientY`，在IE模型上需要自行计算。
6. `which`，对应IE模型里面的`charCode`或者是`keyCode`。
7. `button`，两种模型的标记方式不一致，需要转化到DOM模型上。

---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 document的ready事件"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

在没有jQuery之前，我们为了保证代码运行时文档已经加载完全，使用`window.onload`来执行我们的代码。但是，这个事件有一个十分坑爹的地方：

> The load event fires at the end of the document loading process. At this point, all of the objects in the document are in the DOM, and all the images and sub-frames have finished loading.

要所有图片等外部资源全部加载完成之后才会触发`window.onload`。其实我们是不需要等到外部资源加载完毕的，只要DOM树构造完全即可。所以，在jQuery之后，通常会这么写：

    $(function () { ... });

这种是`$(document).ready(function () { ... })`的缩写，其中使用的就是`document`的`DOMContentLoaded`事件。在DOM树构造完成，已经可以操作的时候这个事件就会触发。标准的浏览器已经支持直接使用`addEventListener`来绑定事件处理程序。但是，IE9之前的IE是不支持这个事件的，所以必须要编写一些代码在IE上模拟这个事件。

可以通过两个途径来模拟。第一个是比较腻害的，它会把页面滚动到最左方，如果抛出异常，则说明文档没有加载完成，然后继续滚动直到没有抛出异常为止，这个时刻就十分靠近标准中的`DOMContentLoaded`事件触发的时刻。

第二个是使用IE中特有的`onreadystatechange`，来近似模拟模拟标准的实现。当`document.readystate`为`complete`的时候说明文档已经准备好了。虽然这个时刻一般会比标准的要晚，可是一定早于`window.onload`，所以可以作为`doScroll`的一个备用方案。

写了一些测试代码，测试以上的几种方法的触发顺序：

<iframe width="100%" height="300" src="http://jsfiddle.net/3ZHWX/4/embedded/js/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

可以看到标准浏览器是`DOMContentLoaded`先触发，等图片加载完成后`onload`才触发。在IE6上是`doScroll`最先触发，`onreadystatechange`为`complete`虽然比`onload`要早，但是也早不了多少，所以在IE6上应该是`doScroll`最接近`DOMContentLoaded`。

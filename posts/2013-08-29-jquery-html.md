---
layout: post
title: "jQuery扫盲之.html"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

今天工作中遇到了一个小问题：使用`.html`和`.append`往一个元素内部添加内容的时候，在IE7、IE8下有两种不同的表现：用`.append`往元素内部添加特定的HTML字符串，在IE7、8下面是空白的；用`.html`刷新元素内部的HTML，虽然显示的样式和结构有点异常，但是大部分元素还是正常显示出来了。原因是那段HTML字符串里面有反引号，而且是当反引号成对而且是特定结构的时候才会导致页面空白。到现在还没有查出为什么会有这个问题，今天先来看看`.html`的使用方法，往后会继续深入`.html`的源码、`append`的用法与源码以及两者的区别。

> Get the HTML contents of the first element in the set of matched elements or set the HTML contents of every matched element.

`.html`有两种使用方法，分别对应`getter`和`setter`，它们按是否传入参数区分。

###.html()
____

当没有传入任何参数的时候，`.html`以`getter`方式调用，返回匹配元素的内部HTML字符串。注意，**如果该jQuery对象包含的元素个数大于1，调用`.html`方法只会返回第一个元素的内部HTML字符串**。

返回的字符串未必跟HTML中的代码完全一致，包括HTML标签的大小写或者属性上面的引号等等。

###.html(HTMLString)或者.html(function(index, oldhtml))
____

当传入HTML字符串或者传入一个回调函数的时候，`.html`以`setter`方式调用，设置jQuery对象中所有元素内部的HTML。传入字符串的时候，会直接替换元素内部的HTML字符串；传入回调函数时，会使用回调函数返回的字符串替换元素内部的HTML字符串。

回调函数接受两个参数，一个是元素的在jQuery对象中的索引，第二个是元素原来的内部HTML字符串。注意，**在调用回调函数之前元素的内部字符串会先被置空**。

再替换完元素内部的HTML字符串之后，原来内部元素的一些`data`还有绑定的事件处理程序都会被删除哦。

这里还有些小细节，在jQuery的文档里面特别指出的：

1. 在IE8之前的版本，IE会自动把`href`属性转成绝对路径。
2. 在IE9之前的版本，有可能不能正确处理HTML5的相关元素，请使用[html5shiv](http://code.google.com/p/html5shiv/)。

最后，jQuery建议为了防止某些浏览器（特指IE9以及之前的版本），最好先调用`.empty`再调用`.html`，防止产生一些孤立的文本节点，如：

    $("#id").empty().html(htmlString);

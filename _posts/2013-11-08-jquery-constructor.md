---
layout: post
title: " jQuery扫盲之jQuery"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

jQuery的`jQuery`方法（通常是`$`）相信是最最最最常用的方法了，通常会传入一个选择器然后返回匹配这个选择器的元素的集合（jQuery对象）。其实这个函数还有一些其他的调用形式，一起看下去。

###选择元素

第一类是在文档中选择元素，有以下几种调用形式：

**jQuery(selector[, context])**

其中`selector`就是CSS选择器，`context`是可选的上下文元素，默认是在整个文档中查找。传入`context`即等于`jQuery(context).find(selector)`。

**jQuery(element)**

其中`element`就是DOM元素，即把DOM元素“包裹”成jQuery对象。

**jQuery(elementArray)**

同上，只是传入的是DOM元素的一个数组。

**jQuery(object)**

其中`object`是一个普通的JavaScript对象，也是把它“包裹”成jQuery对象。这样我们就可以在普通的元素上使用jQuery的方法，例如一个简单的观察者模式：

    var obj = {};
    $(obj).on("foo", function () {
      alert("foo");
    });
    $(obj).trigger("foo");

**jQuery(jQueryObject)**

克隆一个jQuery对象（只复制引用哦）。

**jQuery()**

什么都不传，在jQuery 1.4之后会返回一个空的（`length`为`0`）jQuery对象。

###创建元素

`jQuery`方法也可以由HTML字符串创建DOM对象：

**jQuery(html[, ownerDocument])**

其中`html`就是HTML字符串，可选的`ownerDocument`就是这个DOM属于哪个文档对象，默认是当前的文档。

**jQuery(html, attributes)**

第一个参数同上，`attribute`就是DOM对象上的特性。例如：

    $( "<div/>", {
      "class": "test",
      text: "Click me!",
      click: function() {
        $( this ).toggleClass( "test" );
      }
    }).appendTo( "body" );

奇怪的是，查找元素和创建元素的第一个参数都是字符串，jQuery是怎么判断是哪种模式呢？原来jQuery会判断这个字符串是否类似于一个HTML字符串，如果不是则当作是CSS选择器。第二个值得注意的是jQuery会自动纠错，例如：

    $("<a/>"); // $("<a></a>");
    $("<a>"); // $("<a></a>");

第三个要注意的是某些标签可能会被过滤，例如`html`、`title`、`head`等。

###文档准备好了！

这个也是十分常用的一个用法，就是`jQuery(callback)`，其中`callback`会在文档准备好的时候触发（可以[参考这里](http://dafeizizhu.github.io/2013/10/01/javascript-document-ready-event/)）。

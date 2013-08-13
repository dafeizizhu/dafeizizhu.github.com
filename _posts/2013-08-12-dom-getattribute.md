---
layout: post
title: "DOM的getAttribute方法"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

获取一个DOM元素的特性（Attribute），相信也是一个前端攻城师天天都要涉及的问题。虽然日常我们都被jQuery宠坏了，还是要了解一下原生的应该如何获取一个DOM元素的特性值的方法。

> getAttribute() returns the value of the named attribute on the specified element.

`getAttribute`返回特定DOM元素上的特性的值。该方法接受一个参数，就是表示特性的名称的字符串。当该特性存在时返回该特性的字符串的值，否则返回`null`或者空字符串。

###标准

调用`getAttribute`，传入的代表特性名称的字符串是大小写不敏感的，内部实现先会把参数转换成小写再进行操作。

大部分浏览器在没有找到该特性值的时候会返回`null`，例子[参考这里](http://jsfiddle.net/GVT4E/)。但是，在DOM 3 Core的标准下应该返回的是**空字符串**，而某些浏览器是按照标准去实现的。所以，当`getAttribute`返回一个空字符串的时候，可能是该特性没有找到，也可能是该特性的值就是一个空字符串。此时，应该使用`hasAttribute`去判断一个元素上的某个特性是否存在，如：

    function getAttr(test) {
      if (test.hasAttribute("a")) {
        alert("has attribute a, value is " + test.getAttribute("a"));
      } else {
        alert("has not attribute a");
      }
    }

例子[参考这里](http://jsfiddle.net/crctX/)。P.S. IE 7不支持`hasAttribute`……

###奇葩的IE

IE对`getAttribute`有着自己一套实现（这太可怕了……）。在IE7以及之前的版本，`getAttribute`接受两个参数：

1. 需要获取的特性名字的字符串。
2. 一个标志位，规定返回特性值的方式。

该标志位接受4个值：

1. `0`，默认值，特性名称大小写不敏感，并根据需要转化特性值（例如把`href`转成完整的URL）。
2. `1`，特性名称大小写敏感。
3. `2`，返回特性值的字符串值，即不做任何转换。
4. `4`，返回完整的URL对象，仅针对返回URL的特性，如`href`、`background`等。

还有一些需要注意的：

1. 在IE8之前的版本，特性（Attribute）的名称必须与元素对应的属性（Property）对应。
2. 在IE8及其之后的版本，第二个参数已经没用了。

在IE中，还有一些跟别的浏览器（甚至IE高版本和低版本之间）的区别。例如：

    <input id="test" readonly="readonly" />

JavaScript

    alert(document.getElementById("test").getAttribute("readonly"));

以上的代码，在IE7以及之前的IE版本返回的是`true`，而IE8、IE9、Chrome、Firefox返回的是`readonly`这个字符串。例子[参考这里](http://jsfiddle.net/rSDhp/)。

由于IE的特殊实现，导致`getAttribute`在某些情况下返回的结果会不一致，例如获取一个`a`的`href`特性：

    var href = document.getElementById("id").getAttribute("href"); // 123.html

在Chrome、Firefox、IE8、IE9返回的都是`href`特性上面的字符串，而IE7返回的则是完整的URL（例如`http://host:port/path/to/123.html`）。要避免这个问题，得在调用`getAttribute`中加入第二个参数`2`，保证`getAttribute`返回的是原始的字符串。例子[参考这里](http://jsfiddle.net/xEA3B/2/)。P.S. 据说加入第二个参数Opera会崩溃，暂时无法验证……

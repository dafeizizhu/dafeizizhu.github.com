---
layout: post
title: "DOM的setAttribute方法"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

昨天讨论了`getAttribute`，今天继续讨论`setAttribute`的使用方法。

###标准

> Adds a new attribute or changes the value of an existing attribute on the specified element.

`setAttribute`这个方法就是用来增加或者修改一个DOM元素上的特性（Attribute）。当指定名称的特性不存在，则会新增一个该名称的特性；如果该特性已经存在，则会修改现有特性的值。这个方法接受两个参数：

1. 表示特性名称的字符串。
2. 这个特性的新的值。当传入的参数不是字符串的时候会隐式调用参数的`toString`方法。例子[参考这里](http://jsfiddle.net/7Tenq/)。IE7貌似有不一样的行为，下面会提到。

使用的例子如下:

    var d = document.getElementById("d1"); 
    d.setAttribute("align", "center");

与`getAttribute`类似，在HTML DOM里面`setAttribute`也是大小写不敏感的。当需要删除一个特性的时候不应该使用`setAttribute("someAttr", null)`，而是应该使用`removeAttribute`。

###又是IE

与`getAttribute`类似，IE7以及更早的版本有一套自己的实现。在比较早的IE的版本又可以传入第三个参数：`lflag`，这个标志位接受以下两个值：

1. `0`，默认值，对特性的名称大小写不敏感。
2. `1`，对特性的名称是大小写敏感的。

同样，在IE8之前的版本特性（Attribute）与属性（Property）的名称必须一致（例如`className`等）、在IE8以及更高版本的IE上第三个参数已经不支持了，不要使用。这个方法甚至可以绑定事件处理程序，如：

    document.getElementById("test").setAttribute('onclick', 'alert(1)');

经测试，IE7不支持，例子[参考这里](http://jsfiddle.net/M3PLw/2/)。

有一个比较有趣的现象，就是第二个参数`val`的取值类型。标准里面应该是传入字符串的，会隐式调用这个参数的`toString`方法。但是，在IE7，通过`getAttribute`返回的特性值与标准实现是不一样的，如以下代码：
    
    function test(attr, val) {
      var el = document.getElementById("test");
      el.setAttribute(attr, val);
      alert("Set Attr: " + attr + 
        " value: " + el.getAttribute(attr) + 
        " valute type: " + typeof el.getAttribute(attr));
    }

    test("a", null); // null
    test("b", undefined); // undefeined
    test("c", {}); // object
    test("d", [1, 2, 3]); // Array
    test("e", /test/); // RegExp
    test("f", 0); // Number
    test("g", true); // Boolean

在IE7上面，通过`getAttribute`返回的值的类型竟然跟`setAttribute`的第二个参数的类型一样的！而在高版本的IE或者Chrome等现代浏览器里面`getAttribute`返回的都是字符串。说明在IE7上，`setAttribute`并没有把第二个参数转化成字符串，而是把参数直接存在DOM上面了。例子[参考这里](http://jsfiddle.net/7Tenq/show/)。

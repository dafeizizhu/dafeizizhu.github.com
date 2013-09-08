---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 DOM特性跨浏览器的那些事"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

昨天简单地介绍了一下特性和属性的区别。今天来看看跨浏览器编程中，DOM特性和属性的一些问题，以防掉坑。

###id/name in form
____

第一个问题有关于`form`以及其中的表单域。在“Big Five”浏览器中，都会自动为`form`创建有`id`或者`name`特性的表单域同名的属性，以方便快速访问以及设置这些表单域的值。这个方便的功能有时候会造成误会，例如：

    <form id="testForm" action="/">                     
      <input type="text" id="id"/>
      <input type="text" name="action"/>
    </form>

以上这个`form`就有一个问题，就是其中有表单域的`id`或者`name`的值跟`form`的一些特性，例如`id`和`action`冲突，导致这样的代码：

    document.getElementById("testForm").id;

获取的不是`form`上的`id`的特性值，而是那个表单域。虽然Chrome、Firfox等标准浏览器可以通过`getAttribute`获取到特性值，可惜不是所有版本的IE都支持。还有一个办法去获取特性值：

    var actionValue = element.getAttibuteNode("action").nodeValue;

鉴于以上代码的复杂性，还是HTML书写阶段不要用`form`的一些内建特性或者是方法（例如`submit`）作为表单域的`id`或者`name`的值。

###URL标准化
____

获取一个为URL的特性值，例如`href`，不同浏览器会有不同的响应。在IE8以及以下版本的IE上，调用`getAttribute`获取的`href`属性可是绝对路径哦，而其他浏览器则是返回`href`上写的字符串的值。在这些版本的IE上，我们可以在调用`getAttribute`的时候加上第二个参数：

    var original = link.getAttribute('href',2);

强迫IE返回原始的字符串值。注，在Opera上不要加第二个参数，某些版本会导致浏览器崩溃。

###style特性
____

我们可以设置DOM上的`style`属性来改变元素的样式。而这个属性的值并不是一个字符串，而是浏览器生成的一个对象，里面包含这个元素的样式信息。大部分浏览器可以通过`getAttribute`去获取`style`特性上的字符串值，除了IE。

奇葩的IE使用`style.cssText`来获取`style`特性的字符串值。

###type特性
____

在IE8以及之前的版本，当一个`input`被插入到文档中后，该`input`的`type`特性就不能更改，强行更改会抛出异常，而其他浏览器则可以正确处理`type`变更。

这个问题没有直接的解决方案，只有权宜的方案，例如删掉旧的`input`，再插入一个新的`input`；又或者就不让用户去修改`input`的`type`特性。在jQuery中是使用了后者，不让用户修改`input`的`type`特性。这是由于：

1. 使用场景太少。
2. 保持API在不同浏览器上的表现一致。

可以看到与事件绑定的时候采取的策略是一样的（由于IE只支持冒泡，所以放弃事件捕获阶段）。

###tab index
____

如果一个元素的`tab-index`特性没有被设置，调用`getAttribute`去获取这个属性的值可能会返回`0`或者`null`。这意味着没有显式设置每个元素的`tab-index`特性的时候，我们没有办法知道确切的`tab-index`的值。

这个问题是有必要解决的，因为这个影响了一大部分用户的使用习惯（习惯使用`tab`在表单域中切换等场景）。只能靠行政手段约束，HTML上的元素要显式设置`tab-index`，而动态生成的HTML元素也要根据一定的规则生成`tab-index`。

###Node名称
____

在HTML DOM里面，标签的名字会以全大写的形式返回，例如`DIV`， `SPAN`等。但是在XML DOM里面，`nodeName`会返回文档中一模一样的字符串，包括大小写。

解决这个问题非常简单，在比较`nodeName`的时候，把两个要比较的字符串都统一转成大写或者小写去比较，如：

    var all = document.getElementsByTagName("*")[0];
    for (var i = 0; i < all.length; i++) {
      var nodeName = all[i].nodeName.toLowerCase();
      if (nodeName === "div" || nodeName === "ul") {
        all[i].className = "found";
      }
    }

在跨平台，跨浏览器的编程中，这些标准化的动作最好不要缺少哦亲！

---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 简述CSS选择器引擎"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

随着jQuery的风靡，CSS选择器引擎已经作为一个标准，现代浏览器都可以通过例如`querySelector`等API去使用像jQuery那样的CSS选择器去选择DOM了。既然这样，为什么还要讨论JavaScript实现的CSS选择器引擎呢？

其中一个比较重要的原因是因为浏览器实现的CSS选择器引擎还是一个半成品，所以有一些细节没有考虑，例如DOM的缓存、错误报告机制和扩展机制等。而一些JavaScript类库提供的CSS选择器引擎（尤其是jQuery），以上的这些细节都是有所考虑的。所以，在现实的项目中，由于使用场景比较多，其性能可能比浏览器实现的CSS选择器引擎要高，例如多次使用相同的选择器去选择DOM等。

那又是为什么要去了解一个JavaScript实现的选择器引擎是如何工作的呢？通过了解其工作机制，我们可以了解怎样去遍历一个文档树。而且，只有了解一个选择器引擎的工作机制，我们才可以写出高性能的选择器（例如`.className`和`div.className`的区别）。由于使用CSS选择器去获取DOM几乎是我们每个功能都必须要使用，而且要使用多次的功能，所以提高其性能是十分重要的哦。

其实，我们的日常工作都可以抽象成以下两个步骤：

1. 获取我们需要操作的DOM。
2. 在这些DOM上面弄点什么。

在使用CSS选择器之前，由于浏览器的API的限制（`document.getElementById`和`document.getElementsByTagName`），要选中我们需要操作的DOM，可能还需要一大部分代码。所以，通过CSS选择器选择DOM元素是一个十分高效而且准确的手段。通过减少步骤1的代码量，我们可以把更多的心思花在步骤2里面，例如提供更好的用户体验等。

除了以上的原因，我们需要一个JavaScript实现的CSS选择器引擎的原因，就是要支持那些没有内置CSS选择器的浏览器，所以需要我们抽象另外一个接口去使用CSS选择器引擎。一般实现一个JavaScript的CSS选择器有以下几个步骤：

1. 优先使用W3C的标准API。
2. 使用XPath。
3. 使用JavaScript遍历DOM树。

---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 过滤元素"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

一个CSS选择器是由多个部分组成，例如`div.class[id]`，这里有三个部分：`div`、`.class`、`[id]`。首先，我们会根据`div`这个选择器，使用`getElementsByTagName`去获取文档中所有`div`。然后，我们需要对这个集合进行过滤，过滤出匹配`.class`和`[id]`这两个选择器的元素。

过滤操作基本上在每一个CSS选择器引擎的实现都会有。通常会根据特性和元素的位置对集合进行过滤：

1. 特性过滤，需要在每一个元素上面调用`getAttribute`来获取对应的特性，跟特性选择器进行对比（特性的名称或者特性的值）。这里包括类选择器的过滤，因为`class`也可以作为一个特性。
2. 位置过滤，例如`nth-child`或者`first-child`等。这些过滤通常会优先使用DOM的`children`，这个属性是这个DOM元素的所有子孙元素。如果不支持这个属性，则需要遍历每一个DOM元素，访问其`childNodes`属性，这个属性只会包含这个元素的子元素。使用这两个属性就可以判断元素在集合中的位置是否匹配位置选择器。

这种过滤功能还能提供给用户，例如`jQuery.fn.filter`或者`jQuery.grep`，使用这个方法可以使用自定义的过滤逻辑过滤这个集合，提供比CSS选择器更方便、更灵活的过滤功能。

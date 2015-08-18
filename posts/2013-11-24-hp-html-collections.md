---
layout: post
title: "High Performance JavaScript 读书笔记之 访问和修改DOM（二）"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

今天讨论一下`HTMLCollection`。`HTMLCollection`是一个类似数组的东西，里面包含了一组DOM对象。下面的API返回的结果都是一个`HTMLCollection`：

1. `document.getElementsByName`。
2. `document.getElementsByClassName`。
3. `document.getElementsByTagName`。

而下面的这些`document`的属性也会返回一个`HTMLCollection`：

1. `document.images`，返回文档中所有`img`。
2. `document.links`，返回文档中所有带`href`特性的`a`。
3. `document.forms`，返回文档中所有`form`。
4. `document.forms[0].elements`，返回第一个表单中的所有表单域。

`HTMLCollection`不是数组，所以它没有`push`或者`slice`等方法。但是它有`length`属性，也可以通过下标访问，所以它是一个“类数组”。值得注意的是，`HTMLCollection`是“活”的，即在访问这个集合的时候，该集合的状态是当前文档的状态。例如这样的代码可能会进入一个死循环：

    var alldivs = document.getElementsByTagName("div");
    for (var i = 0; i < alldivs.length; i++) {
      document.body.appendChild(
        document.createElement("div"));
    }

由于在循环中不断加入`div`，导致`alldiv.length`不断被增大，退出条件永远都不会成立。

除了这些逻辑上的问题，每次去访问这个集合的时候，浏览器都需要在文档中重新查询，这样会导致性能问题。为了防止这种查询，在进行DOM操作之前，我们可以先用一个数组缓存`HTMLCollection`的内容：

    for(var i = 0, a = [], len = alldivs.length; i < len; i++) {
      a[i] = alldivs[i];
    }

操作`a`就可以避免每次去查询文档。更简单的办法就是用一个变量去记录`length`属性，防止每次访问`length`的时候浏览器重新查询文档内容。

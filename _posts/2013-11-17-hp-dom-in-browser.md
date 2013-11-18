---
layout: post
title: "High Performance JavaScript 读书笔记之 浏览器中的DOM"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

操作DOM是十分耗时的，至少在老版本的IE上是如此。为什么DOM操作就那么耗时呢？

DOM是一个语言无关的接口，它定义了我们的程序如何跟HTML或者XML文档进行交互。在浏览器中，我们通常都是跟HTML DOM打交道，也不排除作为数据传输格式的时候操作XML DOM。

尽管DOM是语言无关的，我们在浏览器中使用的是它的JavaScript的实现。由于前端的工作大部分都是跟界面有关，所以DOM操作在前端的工作中占的比例是相当大的。

浏览器通常会把DOM接口的实现跟JavaScript引擎分开。举个例子，在某个版本的IE中，JavaScript引擎的实现是放在`jscript.dll`的动态库中，而DOM的实现则在`mshtml.dll`中。之所以把这两个实现分开，是因为微软可以方便地为其他脚本（例如`VBScript`）调用同一套DOM的实现。Safari、Chrome等都是把渲染引擎跟JavaScript引擎分开的。

那为什么DOM操作会慢呢？简单地说，就是这种两种实现的分开造成的。当某一方需要调用另一方的时候会产生额外的消耗。举个例子，想象一下DOM的实现和JavaScript的实现是两个小岛，中间有一条桥连接，所以他们能通过这条桥进行交互。但是过桥必须交过路费。每次它们之间相互调用的时候都要产生“过路费”的消耗，调用得越多消耗的越多。

所以，尽可能地减少DOM操作，包括访问、修改DOM等操作，能有效地减少这种“过路费”的消耗，也更容易地在代码的逻辑上分开展现和逻辑两个部分，提高代码的可读性与重用性。

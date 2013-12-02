---
layout: post
title: "High Performance JavaScript 读书笔记之 Repaints和Reflow"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

当浏览器下载完所有HTML标签、脚本、样式、图片，它会创建两种数据结构：DOM树和展现树。DOM树中不可见的节点在展现树上是没有对应节点的。展现数上的节点通常被称为`frames`或者`boxes`，浏览器会把这些节点当成一个个”盒子“来处理（包括`padding`、`margin`、`border`和`position`）。当展现树构造完成之后，浏览器就可以把整个页面”画“出来了。

当页面的元素发生几何变化时（例如高度、宽度变化，或者`padding`、`margin`、`border`变化等），浏览器需要重新计算页面上其他元素的几何位置。这个过程就是`reflow`。当`reflow`发生的时候，浏览器需要重绘所有受影响的元素，这个过程是一个`repaint`。

不是更改所有HTML元素都会出发`reflow`，例如改变一个元素的背景色，是不会改变这个元素的几何属性的。这种情况下，只会发生`repaint`。

不管是`reflow`还是`repaint`，都会有比较高昂的性能损耗。所以，减少`reflow`和`repaint`的次数对性能是十分重要的。

什么时候会发生`reflow`：

1. 增加或者移除可视的DOM元素。
2. 元素的位置发生改变。
3. 元素的大小发生变化，包括`padding`、`margin`等。
4. 元素内容发生变化，当元素是自适应内容的情况下（`height`为`auto`等）。
5. 页面初始化的时候。
6. 浏览器`resize`的时候。

通常浏览器会有一个队列缓冲对展现树的改变，在适当的时候一次性`reflow`或者`repaint`。但是，使用到DOM上的某些属性会导致队列被刷新，立刻执行`reflow`或者`repaint`：

1. 使用`offsetTop`等`offsetXxx`属性。
2. 使用`scrollTop`等`scrollXxx`属性。
3. 使用`clientTop`等`clientXxx`属性。
4. 使用`getComputedStyle`或者IE下的`currentStyle`。

由于这些属性或者方法需要在`reflow`和`repaint`完成之后才能得到正确的值，所有使用到以上的属性或者方法会导致浏览器立马`reflow`和`repaint`。所以，在更改样式的过程中尽量不要使用到以上的属性或者方法。

---
layout: post
title: "Href中的JavaScript link"
description: ""
category: 
tags: [html, JavaScript]
---
{% include JB/setup %}

在`A`标签的`href`属性写上JavaScript“表达式”，其中一个目的就是为了那些不是链接的`A`标签通过HTML验证，[参考这里](http://stackoverflow.com/questions/7755088/href-expression-a-href-javascript-a)。*（注：刚才试了一下在最新的W3C的HTML在线校验里面没有`name`和`href`属性的`A`标签也能通过校验）*

不能写“#”，因为会跳到页面的头部*（可以通过取消浏览器默认事件防止该行为，[参考这里](http://dafeizizhu.github.io/2013/07/03/a-tag/)）*。也不能写空字符串，在IE下会刷新页面。那只能写一个JavaScript表达式，该表达式什么也不做。最常见的就是以下这个代码：

    <a href="javascript:void(0)">Do not refresh or go to the top of this page.</a>

JavaScrit提供了一种机制，供页面与JavaScript方法进行交互，其中一种机制就是`href`中的JavaScript链接（JavaScript link）。一个最简单的JavaScript链接示例如下：

    <a href="javascript:MyFunction();">Text to Click</a>

其中`MyFunction`是全局的一个函数，当单击这个`A`标签的时候，对应JavaScript链接的语句会被执行。

如果同时设置了`href`上的JavaScript链接，又设置了`onclick`属性*（当然这个应该存在于黑暗之中永远不让它出来o(╯□╰)o）*，会是怎样的一个场景呢？立马做一个实验，[参考这里](http://jsfiddle.net/b7YLJ/1/)。

    <a href="javascript:alert(1);" onclick="alert(2);">Text to Click</a>

结果是先弹出了2，再弹出1。仔细思考一下，其实这个结果是跟前天写的内容是吻合的。事件处理函数先执行，再执行浏览器的默认行为，在这里浏览器的默认行为就是弹出1。

最后简单看看JavaScript中一个被忽略的运算符：`void`。这个运算符有两种使用方式：

    void (expression)

    void expression

这个运算符的作用是执行JavaScript语句，但是不返回任何东西。可以作为`href`的值，当单击`A`标签的时候会执行该JavaScript语句。详细情况可以[参考这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#void)。

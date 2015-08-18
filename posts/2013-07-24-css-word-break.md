---
layout: post
title: "换行还是不换行之word-break"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

再继续前两天的问题，今天介绍另一个影响单词断行的CSS样式`word-break`。

> The word-break property specifies line breaking rules for non-CJK scripts.

`word-break`声明了非CJK单词的断行规则，其中也有属性值是跟CJK单词有关系。这个样式的可选取值有以下几个：

1. `normal`，默认值，单词根据其默认的规则进行断行。
2. `break-all`，非CJK单词会在一个单词之间断行以防止单词内容溢出。
3. `keep-all`，保持CJK单词，不让其断行。

看样子跟昨天介绍的`word-wrap`看上去作用都是差不多的，都是控制单词的断行规则。与`word-wrap`类似，**当`white-space`声明为不允许自动换行的情况下是没有任何效果的**。

而`word-break`跟`word-wrap`主要有以下这几个不同点：

1. Opera和低版本的FireFox（低于15）不支持`word-break`，而所有主流的浏览器都支持`word-wrap`。
2. 虽然`word-break: break-all`和`word-wrap: break-word`都是允许断开非CJK单词，但是前者明显暴力于后者。前者会忽略所有排版规则强制断开单词，而后者则会尽最大限度保持现有的排版规则。例子[参考这里](http://jsfiddle.net/RsUqv/)。
3. `word-break: keep-all`还特别声明了针对CJK单词的规则，这个是`word-wrap`所没有的。*（但是`keep-all`Chrome和Safari都不支持……）。*

针对`word-break`：

1. 当需要强制换行时，设置成`break-all`。
2. 当需要强制不换行时，设置成`normal`。

关于换行和不换行的话题暂时先讨论到这里吧。现在总结一下三天的内容：

如果要强制换行：

    white-space: normal;
    word-wrap: break-word;
    word-break: break-all; /** 超级暴力换行！ **/

如果要强制不换行：

    white-space: nowrap;
    word-wrap: normal;
    word-break: keep-all;

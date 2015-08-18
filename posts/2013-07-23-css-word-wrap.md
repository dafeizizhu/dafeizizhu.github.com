---
layout: post
title: "换行还是不换行之word-wrap"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

继续昨天的话题，今天介绍另一个影响文字换行的属性`word-wrap`。

> This property specifies whether the UA may arbitrarily break within a word to prevent overflow when an otherwise-unbreakable string is too long to fit within the line box. **It only has an effect when ‘white-space’ allows wrapping.**

`word-wrap`这个属性声明用户代理（一般就是指浏览器）能否从一个单词中间断开，防止这个单词溢出容器。这里值得注意的是，要`word-wrap`属性生效，必须让`white-space`这个属性允许自动换行（即`white-space`的属性只能是`normal`、`pre-wrap`和`pre-line`）。

可选的取值有：

1. `normal`，默认值，不允许从一个单词中间断开，显示溢出部分。
2. `break-word`，如果一行中没有其他可接受的断点，那么将强行断开文本单词。

这里的“单词”，指的是非CJK（Chinese、Japanese、Korean）中由若干个字母组成的单词。这个单词是有独立意义的，不同单词使用空格或者`-`分开。所以如果随意把超长的单词从中间断开，可能会导致理解上的误差。例子[参考这里](http://jsfiddle.net/VKP78/)。

这个属性所有浏览器都支持。IE引入了一个别名叫`-ms-word-wrap`，在标准的IE8里面已经支持标准的`word-wrap`，所以也不需要加上这个前缀了。

还有一个值得注意的是，在最近的CSS3规范中，`word-wrap`已经被改名叫`overflow-wrap`了，在最新的Chrome和Opera中已经支持新名字了哦。在往后的标准实现中，`word-wrap`只能作为`overflow-wrap`的一个别名存在，太悲催了。

总结一下，在`white-space`声明支持自动换行的情况下：

1. `normal`不会中断一个非CJK单词。
2. `break-wrod`会最大限度维持排版规则去中断溢出的非CJK单词。

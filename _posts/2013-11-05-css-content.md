---
layout: post
title: "css content"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

`content`属性通常会跟`before`和`after`伪类一起使用。这个属性就是`before`或者`after`插入到文档中的“伪元素”的内容。

这个属性接受以下几个值：

1. `none`，不生成伪元素。
2. `normal`，在`before`或者`after`的时候会被当成`none`。
3. `<string>`，一个字符串，表示伪元素的内容。
4. `<url>`，使用格式是`content: url(path/to/resource)`，表示伪元素是一个外部资源，例如图片等。
5. `<counter>`，使用格式是`content: counter(name, decimal)`，表示伪元素是一个计数器，第一个参数是计数器的名字，使用`conter-increment`声明一个CSS类为计数器；第二个参数是计数器的样式，默认是十进制数字。
6. `attr(x)`，表示伪元素的内容是当前元素的`x`特性的值。
7. `open-quote|close-quote`，表示伪元素的内容是引号。
8. `no-open-quote|no-close-quote`，增加或者减少引号的层次。

下面是几个例子：

<iframe width="100%" height="300" src="http://jsfiddle.net/r8sv8/embedded/html,css,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

注意几点：

1. IE6、IE7不支持`content`，其他主流浏览器都支持。
2. `content`插入的内容其实只是“视觉”上的，所以不存在于文档中，无法复制粘贴。

`content`配合`after`伪类，可以修复浮动元素容器的高度塌陷问题：

<iframe width="100%" height="300" src="http://jsfiddle.net/Vx3j7/embedded/html,css,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

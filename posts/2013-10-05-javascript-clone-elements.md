---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 复制DOM"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

复制一个DOM对象，只需要直接调用其`cloneNode`方法即可。但是，现实永远是那么的骨感，古老版本的IE又有一些问题，为了支持它们，我们又要写出一些额外丑陋的代码去封装这些差异。

首先，它会把DOM对象的事件处理程序复制到新元素中，例如：

<iframe width="100%" height="300" src="http://jsfiddle.net/KaY7s/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

在Chrome等标准浏览器中，单击克隆出来的`div`是不会触发事件处理程序的。但是在IE6中，单击克隆出来的`div`则触发了事件处理程序。

避免这个问题的最简单的方法就是删除克隆元素的事件处理程序。悲剧的是，在IE上，如果删除了克隆元素的事件处理程序，连原来元素上面的处理程序也会被删除！（注，这是书中所写的，在IE6、7上测试是不会删除原来元素上的事件处理程序的。）

<iframe width="100%" height="300" src="http://jsfiddle.net/HRwHE/2/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

最后的解决方案只能是，先调用`cloneNode`克隆出一个DOM对象，然后把它放入到一个容器中，再读出其`innerHTML`的值，最后把该值转成新的DOM对象。这个时候，IE又来了。有一些特性的值，例如书中提到的`name`，在`innerHTML`中是不正确的，哎！而且这个方案不能用于XML DOM，因为XML的DOM对象是没有`innerHTML`这个属性的。由于XML DOM中极少存在事件处理程序这一事物，所以XML DOM的复制可以直接使用`cloneNode`即可。

所以，需要为上述的方案进行优化，先区分是XML DOM还是HTML DOM，为HTML DOM作特殊处理。当所有步骤都结束之后，我们还需要在克隆出来的DOM对象中为重新那些丢失了的特性重新赋值。

由于jQuery不是直接把事件处理程序绑定到元素中，所以它做了一个非常有意思的事情：

    var clone = ret.find("*").andSelf().each(function () {
      if (this[ expando ] !== undefined)
        this[ expando ] = null;
    });

复制出DOM对象之后，把其相关的数据，包括事件处理程序都删除了，所以复制出来的对象不会有相关的事件处理程序被绑定。

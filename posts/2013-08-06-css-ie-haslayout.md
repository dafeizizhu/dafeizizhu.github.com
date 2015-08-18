---
layout: post
title: "IE的hasLayout"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

只有在IE8之前版本的IE上才会有hasLayout这个纠结的东西。在这些版本的IE中，有两种类型的元素：

1. a拥有布局的元素，可以控制自己的大小及其子元素的布局。
2. a没有布局的元素，只能根据最近的拥有布局的祖先元素来确定自己的大小和布局。

拥有布局的元素可以控制自己的大小，也可以控制其自身及其子元素的布局。一些没有特定声明宽度和高度的元素，但是有一些大小限制的元素，例如表单控件、图片等，通常也是拥有布局的元素。只有拥有布局的元素才能控制是否出现滚动条。

拥有布局的元素意味着：

1. a限制这个元素成为一个矩形（强制行内元素的布局行为变得像块元素一样）。
2. a一些关于这个元素的大小位置等属性会被缓存起来，也会参与到大小位置改变的算法中，造成额外的内存于时间消耗。
3. a不能根据子元素的内容进行自适应。

当一个元素拥有布局的时候，我们说这个元素触发了`hasLayout`，也就是说这个元素有个内部属性为`hasLayout: true`。注意，这个不是一个CSS的样式，某种特定的情况下一个元素就会拥有布局。

首先是默认就拥有布局的元素：

1. a图片
2. a表格、表格行、单元格
4. a表单控件
5. a`frameset`等框架元素
6. a`object`等嵌入元素
7. a绝对定位元素
8. a浮动元素
9. a`inline-block`元素
10. a`filter`
11. a`body`

当元素满足以下条件的时候也可以变成拥有布局的元素：

1. a在严格模式下，声明了宽度和高度的块元素
2. a在兼容模式下，任何声明了宽度和高度的元素
3. a拥有`zoom`的元素
4. a处于编辑模式下的元素
5. a阅读顺序与父元素不一样的元素
6. a一个拥有`viewlink`特性的元素

最好是使用`zoom: 1`来触发元素的`hasLayout`，因为该CSS样式不会对元素造成任何可视的影响。

个人感觉这个`hasLayout`的最大用处就是在不支持`display: inline-block`的浏览器（例如IE6）中模拟出对应的效果。由于触发了`hasLayout`的元素可以拥有类似BFC（明天会讨论这个）的视觉效果，即可以让一个行内元素的布局行为变成类似于块元素的布局行为。所以，在IE8-的浏览器中，如果需要触发`hasLayout`，最好也同时触发BFC，保证显示效果一致。例子[参考这里](http://jsfiddle.net/rweLu/2/)。

参考资料：

<ol>
  <li><a href="http://msdn.microsoft.com/en-us/library/bb250481(v=vs.85).aspx">"HasLayout" Overview</a></li>
  <li><a href="http://kayosite.com/internet-explorer-haslayout-in-detail.html">详说 IE hasLayout</a></li>
</ol>

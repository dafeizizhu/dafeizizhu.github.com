---
layout: post
title: "CSS outline"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

如果我们没有任何`reset.css`，当Chrome上的输入框获得焦点的时候会有一圈淡黄色的“边框”，这个就是`outline`在搞鬼。

> An outline is a line that is drawn around elements, outside the border edge, to make the element stand out.

`outline`是在`border`之外的另外一圈“边框”，让该元素能突显出来。它是一个复合的CSS样式，跟`border`一样，由以下几个部分组成：

1. `outline-color`，表示“边框”的颜色。
2. `outline-width`，表示“边框”的宽度。
3. `outline-style`，表示“边框”的样式，取值的范围几乎跟`border`是一样的。

每个部分都跟`border`类似，那`outline`跟`border`有什么不一样的地方吗？主要是以下两个方面：

1. `outline`不会占用空间，而`border`则是盒模型的一部分，有独立的空间。`outline`就像“浮空”在元素上面一样。
2. `outline`在某些浏览器（例如Opera）上可以不是矩形的，而`border`则什么时候都是矩形的。

这个会造成一些非常有意思的例子，如：

<iframe width="100%" height="300" src="http://jsfiddle.net/aaG3R/embedded/css,html,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

这个例子里面，两个元素的HTML是一样的，一个是设置了`outline`，一个是设置了`border`。可以看到`outline`里面的框是把折行后的`span`包围起来，而中间重复的部分是没有框的。而`border`重复的部分则把原来`span`的元素给遮住了。

正如`outline`的定义所说，这个样式就是为了让一个元素“突显”出来，所以设置这个样式是不会影响布局的。可能也是因为这样所以Chrome的默认样式里面就为获得焦点的`input`设置`outline`，让用户更清晰地知道焦点在哪。

最后说一下兼容性，在IE8之前的IE是不支持`outline`的哦，如果需要在这些浏览器中模拟`outline`的效果，可以[这样](http://stackoverflow.com/questions/9480587/alternative-to-outline-property-for-ie-6-7)：

    .element_name {
      border:1px solid black;
      margin:-1px;
    }

---
layout: post
title: "再谈CSS等高布局"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

之前写过一篇CSS等高布局相关的文章，讲的是使用负外边距和内边距的相互抵消做出来的一个“障眼法”。大湿看过之后立马表示有更科学的办法实现，就是CSS3的`box-flex`。今天再来回顾一下到底还有什么方法实现CSS等高布局。

###display: box

通过`display: box`声明该元素的盒模型是一个弹性的盒模型，与CSS2中的盒模型是不一样的。其内部元素可以通过设置`box-flex`来声明其空间占的比例是多少。

简单看一下声明了`display: box`之后该元素还能设置CSS属性：

1. `box-orient`，声明其内部元素的排列方向，可选的值有`horizontal`、`vertical`、`inline-axis`、`block-axis`、`inherit`。默认值是`inline-axis`，所以在`diplay: box`元素内部的子元素都会表现得像行内元素一般的行为。
2. `box-direction`，声明其内部元素的排列顺序，可选的值有`normal`、`reverse`、`inherit`。通过设置`reverse`可以把元素的顺序反转过来。
3. `box-align`，声明其内部元素的垂直对齐方式（有点类似`vertical-align`），可选的值有`start`、`end`、`center`、`baseline`、`stretch`。**默认值`stretch`就是拉伸其子元素让其高度（或者宽度）一致，所以在`display: box`下使用`box-flex`就可以做出等高的效果。**
4. `box-pack`，声明其内部元素的对齐方式（有点类似`text-align`），可选的值有`start`、`end`、`center`、`justify`。

`box-flex`用来声明子元素占父元素内部的空间，其值是一个大于1的整数。当一个弹性盒模型计算其内部元素占用的空间时，优先计算显式声明了`width`（以默认排列方向为例）的元素，其占用的空间就是`width`声明的空间。然后根据`box-flex`这个属性的权重值去设置该子元素的占用的空间。

一个简单的例子[参考这里](http://jsfiddle.net/gt8rN/1/)。

这个方法的优点是代码简洁、功能强大。缺点则是CSS3面临的其中一个严重的缺点：老版本的IE不支持CSS3（甚至IE9也不支持，太惨烈了）。

###display: table

看了这个标题，仿佛又回到了那个使用`table`做布局的石器时代。很多人反对使用`table`作为布局工具，但是有没有想过究竟为什么不使用`table`来布局？因为`table`布局不具有语义。这个不是一个表，是一个布局，所以用`table`是不合适的。但是反过来看，这里说的`table`只得是HTML中的`table`标签。可以通过CSS，使元素能像表格一样布局，而又可以保持元素原来的语义，这样何乐而不为呢？

首先使用最经典的HTML模式：

    <div id="container">
        <div id="left" class="col">This is left<br/><br/></div>
        <div id="middle" class="col">This is middle</div>
        <div id="right" class="col">This is right</div>
    </div>

加两行简单的CSS：

    #container { display: table; width: 100%; }
    .col { display: table-cell; }

来了！等！高！布！局！

其实就是把上面的HTML片段当成一个表格来进行布局了，简单不，兴奋不？所有适用于表格布局的CSS设置方式都适用于这里。

这个方法的优点是代码简洁，兼容性比上面的好一点（IE8、IE9都支持，可怜的IE6、IE7……）。缺点是门槛高，要详细理解表格是怎么布局的，不然很难达到精确布局的效果。

一个简单的例子[参考这里](http://jsfiddle.net/TvYgB/1/)。

感谢黄大湿抽出宝贵的事件看小弟的技术唠叨，还提出了不少关于如何改进这个博客跟微信之间的互动建议。希望大家也多来拍个砖，小弟在这里谢谢大家啦！

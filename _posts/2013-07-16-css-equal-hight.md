---
layout: post
title: "CSS等高布局"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

今天本来想写express的，不过还没看清楚它的文档，以免误人子弟，先放一下。今天来写一个以前遗留的问题，CSS三列布局如何等高。

接着上次写的“经典三列布局之如何让中间的列先显示出来“的代码，[参考这里](http://jsfiddle.net/zBXbp/7/)：

HTML：

    <div id="container">
        <div id="middle">This is middle!</div>
        <div id="left">This is left!</div>
        <div id="right">This is right!</div>
    </div>

CSS：

    #left { width: 100px; background: red;}
    #right { width: 100px; background: blue;}
    #middle { width: 100%; background: green;}

    #container { 
        position: relative;
        padding: 0 100px;
        overflow: hidden;
        margin: 0 auto;
    }

    #middle {
        float: left;
    }

    #left {
        position: relative;
        left: -100px;
        float: left;
        margin-left: -100%;   
    }

    #right {
        float: left;
        margin-right: -100%;
    }

从效果看来，虽然左右固定像素、中间自适应的布局是实现了，但是可以看到，三列的高也“自适应”了，非常难看。怎么能这三列等高显示呢？

首先，绝对的等高，出了用JavaScript之外，用HTML、CSS实现是不行的。所以这个只能看上去“等高”。我们的目的就是让这三列的背景色等高。参考了一些网上的资料，最简单的方法是加入以下一条样式：

    #left, #middle, #right {
        margin-bottom: -10000px;
        padding-bottom: 10000px;
    } 

原理看似简单又不简单，最好的解释可以参考这里：

> 首先把列的padding-bottom设为一个足够大的值，再把列的margin-bottom设一个与前面的padding-bottom的正值相抵消的负值，父容器设置超出隐藏，这样子父容器的高度就还是它里面的列没有设定padding-bottom时的高度，当它里面的任一列高度增加了，则父容器的高度被撑到它里面最高那列的高度，其他比这列矮的列则会用它们的padding-bottom来补偿这部分高度差。因为背景是可以用在padding占用的空间里的，而且边框也是跟随padding变化的，所以就成功的完成了一个障眼法。

效果[参考这里](http://jsfiddle.net/3depS/1/)。

这个方案也有缺点，当需要用`border`显示边框的时候，边框是不能自适应的。只能通过背景的层叠模拟边框的效果。能否不通过JavaScript解决，留一个遗留问题。

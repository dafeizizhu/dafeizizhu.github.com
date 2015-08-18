---
layout: post
title: "响应式设计入门之media query"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

今天再简单介绍一下响应式设计中的另外一个比较重要的技术，媒体查询media query。

> A media query consists of a media type and at least one expression that limits the style sheets' scope by using media features, such as width, height, and color. Media queries, added in CSS3, let the presentation of content be tailored to a specific range of output devices without having to change the content itself.

相比HTML4和CSS2中，只能根据特定的媒体类型（例如屏幕、打印机等）选择应用不同的样式，在CSS3中，可以利用更多的属性进行判断，例如宽度、高度还有颜色等。因此，可以根据当前设备的分辨率等要素，决定整个页面的布局以及应用特定的样式，从而让页面能够适应不同的设备以及不同的分辨率。

CSS3中的媒体查询跟CSS2中的使用方式一样，有以下两种方式：

    <link rel="stylesheet" media="(max-width: 800px)" href="example.css" /> // 在link标签上声明媒体查询

或者在样式文件或者内联的style标签中声明媒体查询：

    <style>
    @media (max-width: 600px) {
      .facet_sidebar {
        display: none;
      }
    }
    </style>

媒体查询表达式由属性还有其可选的值组成，属性与值之间用`:`分隔。日常使用中常用的属性有下列几个：

1. `width`和`device-width`，分别代表页面渲染的宽度和设备宽度。
2. `height`和`device-height`，分别代表页面渲染的宽度和设备宽度。
3. `resolution`，设备的分辨率。
4. `device-aspect-ratio`，设备的宽高比。
5. `orientation`，设备当前是横屏模式还是竖屏模式，分别对应常量`portrait`和`landscape`。

具体的属性列表可以[参考这里](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries#Media_features)。上面的高度、宽度、分辨率等大部分基于像素的属性都可以通过`min-`或者`max-`前缀来声明一个范围。例如声明设别的最大宽度为1024像素的媒体查询表达式为：

    max-width: 1024px

多个媒体查询的表达式可以进行逻辑运算，分别使用`and`，逗号分隔列表和`not`进行与、或、非三个逻辑运算。例如以下媒体查询：

    @media tv and (min-width: 700px) and (orientation: landscape) 

当设备类型为`tv`，设备最小宽度为700像素并且屏幕方向是竖向时生效。

IE9以下不支持CSS3媒体查询。不过幸好要使用媒体查询的场景多是在移动终端上使用，而这些设备上的浏览器（iOS的Safari、Andriod的webkit核心）一般都支持CSS3媒体查询，所以在响应式设计中大胆地使用它吧！

参考资料：

1. [Media Queries](http://www.w3.org/TR/css3-mediaqueries/)
2. [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries)
3. [media type与media query](http://www.qianduan.net/media-type-and-media-query.html)

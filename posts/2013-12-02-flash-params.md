---
layout: post
title: "给Flash影片传参数"
description: ""
category: 
tags: [Flash, html]
---
{% include JB/setup %}

在页面中插入Flash影片有两个标签都可以用，一个是`object`，一个是`embed`。无论使用那个标签，我们都需要传入一些参数给Flash影片，今天来看看有什么参数可以设置。

首先是必要的参数，`width`和`height`这两个属性无论使用哪个标签都必须设置的：

    <object width="500" height="400"></object>

如果使用的是`object`，则还需要以下几个参数：

1. `classid`，为浏览器指定ActiveX控件，一般都是`D27CDB6E-AE6D-11cf-96B8-444553540000`。
2. `codebase`，如果浏览器没有安装指定的控件，则可以通过这个特性的值去下载指定的控件，例如`codebase="downloader.cab#version=1,0,0,0"`。
3. `movie`，这个是`object`内部的一个`param`标签的`name`，指定Flash影片的地址：`<param name="movie" value="path/to/swf" />`。

如果使用的是`embed`，内部不会有`param`标签，所有参数都是以特性写在`embed`标签里面。使用`embed`标签的时候还需要以下几个参数：

1. `src`，同以上的`movie`。
2. `pluginspage`，同以上的`codebase`。

以下是可选的参数，使用`object`的时候使用`param`标签在内部声明值，使用`embed`则直接以特性写在`embed`里面：

1. `play`，表示是否在影片加载完成之后自动播放，默认是`true`。
2. `loop`，表示影片是否循环播放，默认是`true`。
3. `menu`，表示是否在上下文菜单显示播放控件。
4. `quality`，声明播放的品质，可选的值有`low`、`autolow`、`autohigh`、`medium`、`high`和`best`。
5. `scale`，声明Flash Player如何处理影片内容和标签大小之间的适应处理，可选的值有：
    1. `default`，会在标签中显示影片完整的内容，并保持原始的宽高比。
    2. `noborder`，会占满整个标签，并保持原始的宽高比。
    3. `exactfit`，同上，不过不会保持原始的宽高比。
    4. `noscale`，保持影片原始的大小。
6. `align`，向哪边对齐，默认是居中对齐，可选的值有`l`、`r`或者`t`。
7. `wmode`，声明Flash影片与HTML元素之间的显示关系，可选的值有：
    1. `window`，由浏览器去决定如何显示。
    2. `direct`，使用直接路径来渲染，可以获得最高的性能。
    3. `opaque`，影片的背景是不透明的，即会把所有在影片底下的元素遮盖起来。
    4. `transparent`，影片的背景是透明的。
8. `bgcolor`，影片的背景颜色。
9. `allowFullScreen`，是否允许全屏显示，默认是`false`。
10. `fullScreenAspectRatio`，全屏时设备的方向，可选的值有`portrait`和`landscape`。
11. `flashvars`，传给Flash影片的变量，是`key=value`的格式，多个键值对用`&`隔开。最多能传64KB的数据。明天继续讨论这个参数。

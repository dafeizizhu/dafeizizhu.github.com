---
layout: post
title: "使用HTML5的audio和video（一）"
description: ""
category: 
tags: [html5]
---
{% include JB/setup %}

HTML5提供了内建`audio`和`video`，使用它们可以简单地在我们的页面中插入一些媒体：

    <video src="http://v2v.cc/~j/theora_testsuite/320x240.ogg" controls>
      Your browser does not support the <code>video</code> element.
    </video>

以下是一个真实的例子：

<iframe width="100%" height="300" src="http://jsfiddle.net/BzGex/embedded/html,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

以`video`为例：

1. `src`，声明这个媒体文件的路径，可以是一个URL或者是一个本地路径。
2. `controls`，声明是否显示控件。
3. `autoplay`，声明是否自动开始播放。
4. `loop`，声明是否自动循环播放。
5. `preload`，声明缓存的方式：
    1. `none`表示不缓存文件。
    2. `auto`表示缓存文件。
    3. `metadata`表示只缓存文件的元数据。

其中`src`可以通过`sorce`子标签声明多个：

    <video controls>
      <source src="foo.ogg" type="video/ogg">
      <source src="foo.mp4" type="video/mp4">
      Your browser does not support the <code>video</code> element.
    </video>

这样浏览器就可以选择自己能播放的媒体进行播放。如果全部`srouce`都没法播放，则浏览器会抛出一个异常。如果没有显式声明`type`，则`type`由相应头中的`Content-Type`指定。

我们还可以通过`video`的DOM元素去控制媒体的播放：

    var v = document.getElementsByTagName("video")[0];
    v.play();

只能简单的控制播放（`play`）和暂停（`pause`），而声音的大小是通过设置`volumn`属性来实现。通过这些方法我们可以自定义控制器。

当我们暂停了媒体的播放，浏览器还是会一直下载这个媒体。我们可以通过以下的代码停止下载：

    var mediaElement = document.getElementById("myMediaElementID");
    mediaElement.pause();
    mediaElement.src='';
    //or
    mediaElement.removeAttribute("src");

就是把DOM的`src`特性置空或者删除掉即可。因为删除了`src`特性，就会销毁DOM内部的解码器，它也负责下载这个媒体文件，销毁它即可停止下载。

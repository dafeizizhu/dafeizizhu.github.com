---
layout: post
title: "使用JavaScript在页面中嵌入Flash"
description: ""
category: 
tags: [JavaScript, Flash]
---
{% include JB/setup %}

今天讨论的是使用`swfobject`在页面中嵌入一个Flash影片。对于不熟悉Flash的前端来说，`swfobject`提供了完整的JavaScript API来插入Flash影片，封装了很多内部的实现细节。使用`swfobject`还能做一些例如版本检测、提示下载Flash Player等操作。

这个库的使用方法很简单，首先肯定是在页面中引入这个库的脚本文件：

    <script type="text/javascript" src="swfobject.js"></script>

HTML片段：

    <div id="myContent">
      <p>Alternative content</p>
    </div>

假设我们需要在`#myContent`中插入一个Flash影片，只需要调用`swfobject.embedSWF`就可以了，这个方法接受如下几个参数：

1. `swfUrl`，影片的地址。
2. `id`，影片容器的ID，如上例的`myContent`。
3. `width`，影片的宽度。
4. `height`，影片的高度。
5. `version`，目标Flash Player的版本。
6. `expressInstallSwfurl`，可选，利用这个flash跳转到官方下载最新版本的flash插件。
7. `flashvars`，可选，一个JavaScript对象，传递给Flash影片的变量。
8. `params`，可选，`object`内部的`param`标签。
9. `attributes`，可选，`object`标签的特性。
10. `callbackFn`，可选，Flash影片加载完成之后的回调函数。

调用的例子如下：

    swfobject.embedSWF("myContent.swf", "myContent", "300", "120", "9.0.0");

在SWFObject 2.3中建议用这种形式嵌入一个Flash影片：

    var el = document.getElementById("my-target-element");
    swfobject.embedSWF("myContent.swf", el, 300, 120, 10);

主要是显式指定了参数的类型，例如容器是使用DOM，宽高使用数字等。

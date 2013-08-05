---
layout: post
title: "JavaScript与Flash通信"
description: ""
category: 
tags: [前端]
---
{% include JB/setup %}

虽然说iOS不支持Flash，但是Flash在桌面端的使用量还是很大的。作为一个专业的前端开发人员，至少也要懂得如何使用JavaScript与Flash进行通信。

###JavaScript => Flash

使用JavaScript调用Flash内部的方法。假设有以下Flash片段：

    <object type="application/x-shockwave-flash" id="myFlashID" width="85" height="85" data="framejump.swf">
      <param name="allowScriptAccess" value="sameDomain">
      <param name="movie" value="framejump.swf">
      <param name="quality" value="high">
      <param name="scale" value="noscale">
      <param name="wmode" value="transparent">
    </object>

我们可以通过JavaScript先获取该Flash影片的引用：

    function getFlashMovieObject(movieName){
      if (window.document[movieName]){
        return window.document[movieName];
      }else if (navigator.appName.indexOf("Microsoft")==-1){
        if (document.embeds && document.embeds[movieName])
          return document.embeds[movieName];
      }else{
        return document.getElementById(movieName);
      }
    }

获取引用后，还需要Flash内部使用增加回调的方式暴露接口：

    ExternalInterface.addCallback("frameJump", frameJump);

`frameJump`的代码如下：

    function frameJump(whichFrame:String):void {
      gotoAndStop(whichFrame);
    }

这样就可以在JavaScript中直接调用该引用上的方法：

    var flashObj = getFlashMovieObject("movieName");
    flashObj.frameJump(5);

例子[参考这里](http://iviewsource.com/exercises/javascripttoflash/)。通过这个机制可以让JavaScript调用Flash中的方法。

###Flash => JavaScript

Flash调用JavaScript的方法是使用`ExternalInterface.call`这个方法去调用外部的JavaScript方法，使用方法很简单：

    ExternalInterface.call("alert", "This alert comes from Flash");

其中第一个参数是全局作用域中的函数名称，后面的参数是传给要调用的JavaScript方法的参数。例子[参考这里](http://iviewsource.com/exercises/flashtojavascript/)。

参考资料：

1. [Communication between JavaScript and Flash](http://iviewsource.com/codingtutorials/communication-between-javascript-and-flash/)
2. [Javascript与Flash通信全解析](http://www.imququ.com/post/39.html)

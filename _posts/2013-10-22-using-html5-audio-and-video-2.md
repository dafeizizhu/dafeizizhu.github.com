---
layout: post
title: "使用HTML5的audio和video（二）"
description: ""
category: 
tags: [html5]
---
{% include JB/setup %}

昨天讨论了如何加入一个媒体、如何进行简单控制等内容。今天继续来看一下关于html5内建媒体`audio`和`vedio`还有什么其他功能。

除了控制媒体的播放、暂停和音量，通过`currentTime`我们还可以定位到具体的某个时间点。

先通过`seekable`这个属性去获取媒体的范围：

    var mediaElement = 
      document.getElementById('mediaElementID');
    mediaElement.seekable.start();
    mediaElement.seekable.end();

其中`start`和`end`方法会返回整个媒体的开始和结束，单位是秒。然后我们就可以设置`currentTime`让媒体定位到指定的时间点：

    mediaElement.currentTime = 122;

除了以上的方法，我们还可以通过DOM上的`played`属性去获取媒体已经播放过的时间：

    mediaElement.played.end();

全部都以秒为单位。

我们还可以指定媒体的播放范围。在URL后增加`#t=[starttime][,endtime]`参数即可。里面的参数可以是秒，也可以是类似`2:05:01`这样的字符串：

    <video src="http://path/to/video#t=10,20"></video>

注意，这个功能只有基于Gecko的浏览器才实现了哦！

由于不是所有的浏览器都支持内建的媒体（例如老版本的IE），如果我们也要支持这些浏览器，必须使用一个兼容的方案。其中最通用的应该就是使用Flash了：

    <video src="video.ogv" controls>
      <object data="flvplayer.swf" type="application/x-shockwave-flash">
        <param value="flvplayer.swf" name="movie"/>
      </object>
    </video>

最后谈论一下错误处理。最常见的错误应该是浏览器不支持播放制定的媒体，例如在FireFox上播放MP4。现在的实现是，`video`本身不抛出错误，而当特定的`soruce`不能播放的时候，在该`source`元素上面抛出错误。

所以现在只能够通过判断最后一个`source`是否播放成功来判断这个`video`是否能成功播放：

    var v = document.querySelector('video'),
        sources = v.querySelectorAll('source'),
        lastsource = sources[sources.length-1];
    lastsource.addEventListener('error', function(ev) { ... });

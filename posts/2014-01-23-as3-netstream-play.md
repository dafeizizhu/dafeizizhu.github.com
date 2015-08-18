---
layout: post
title: "用NetStream播放视频，包括二进制数据哦！"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

昨天只是简单地将在Flash中播放视频的最基本的方法介绍了一遍。其实我们可以自己去下载视频的数据，然后通过`NetStream`的`appendBytes`方法把获取到的数据添加到流里面。这样，我们可以对数据的传输进行更精确的控制。

`play`方法最简单的用法就是传入一个本地或者Web URL，后面的数据加载就交给`NetStream`的内部实现了。我们也可以传入一个`null`，这时`NetStream`就启动“数据生成模式”。在这个模式下面，调用`appendBytes`方法就可以把二进制数据添加到流中。

要注意的是，在构造`NetStream`对象的时候需要在调用`NetConnection`的`connect`方法传入一个`null`。

然后我们就可以从网络或者其他任意地方读取二进制数据，调用`appendBytes`把它们加入到这个流中播放：

    var MyNC:NetConnection = new NetConnection();
    MyNC.connect(null);
 
    var MyNS:NetStream = new NetStream(MyNC);
    MyVideo.attachNetStream(MyNS);
    MyNS.play(null);
    MyNS.appendBytes(ba);

注意，在`appendBytes`执行后续调用之前，字节分析程序可能无法完整地解码对`appendBytes`的调用。

通过这种播放方式，我们可以先把视频加载到内从，校验视频内容（MD5等），然后直接把这些二进制数据加载到流中播放，这样播放的时候就不需要再从网络或者本地文件系统中加载数据了。

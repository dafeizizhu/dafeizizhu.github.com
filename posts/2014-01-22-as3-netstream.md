---
layout: post
title: "在Flash中播放视频之NetStream"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

昨天讨论的`Video`只是视频的一个容器，真正拉取视频内容，控制视频播放的是`NetStream`类。使用`NetStream`可以从本地或者Web服务器播放媒体文件，也可以将视频、音频、数据流发布到远程服务器。今天主要讨论的是如何从一个本地路径或者Web路径播放媒体文件。

要创建一个`NetStream`，先要构造一个`NetConnection`对象。由于是播放本地或者Web上的视频文件，所以在构造`NetConnection`的时候，需要调用`connect`方法的时候传入一个`null`：

    var nc:NetConnection = new NetConnection(); 
    nc.connect(null);

当需要连接到Media Server的时候才需要传入一个服务器的地址。然后我们就可以用这个`NetConnection`对象构造一个`NetStream`：

    var ns:NetStream = new NetStream(nc); 

然后就可以把这个`NetStream`附加到`Video`上：

    vid.attachNetStream(ns);

最后调用`NetStream`的`play`方法就可以播放视频了：

    ns.play("video.mp4");

其中的参数就是视频的地址，可以是一个本地路径或者是一个Web路径，要注意安全策略的限制。

在`play`之后，会触发多次`NetStatusEvent.NET_STATUS`事件，其中`info`属性声明了这次是什么状态，常用的状态有：

1. `NetConnection.Connect.Success`，尝试连接成功，表示这个视频正常。
2. `NetStream.Play.StreamNotFound`，无法找到指定路径的视频文件。
3. `NetStream.Buffer.Full`，缓冲区已满，流开始播放。
4. `NetStream.Play.Stop`，播放已结束。

实在有太多的状态了，包括了视频从加载到播放的几乎所有场景。通过这些状态，我们可以知道当前视频的播放状态，也可以实现一些类似于自动重播的功能：

    switch (event.info.code) 
    {  
      case "NetConnection.Connect.Success" :   
        // play   
        break;
      case  "NetStream.Play.Stop" :
        // play
        break; 
     }

`NetStream`还提供了几个方法供我们控制视频的播放：

1. `pause`，暂停播放视频流，如果已经暂停则什么都不干。
2. `resume`，回复播放已暂停的视频流，如果正在播放则什么都不干。
3. `seek`，搜索到指定位置最靠近的关键帧，接受一个参数，就是偏移的秒数。
4. `togglePause`，暂停或者回复播放视频流。

注意，没有`stop`方法，如果想要停止播放视频流，则必须怎听播放并搜索到开始位置：

    ns.pause();
    ns.seek(0);

而`play`方法则不会恢复播放，之用于加载视频流。

结合`NetStream`和`Video`就可以实现在Flash中播放常见的视频了，包括`flv`和`mp4`,现在就来做一个简单的播放器吧！

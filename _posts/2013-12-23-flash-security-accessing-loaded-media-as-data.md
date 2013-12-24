---
layout: post
title: "Flash安全性之访问加载媒体中的数据"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

默认情况下，无法从其他沙箱中加载的媒体（如图形、音频、视频等）获取像素数据或者音频、视频数据。可以通过以下方式授予对应的权限：

1. 在目标媒体的内容中调用`Security.allowDomain`。
2. 在目标媒体的服务器上添加策略文件（`crossdomain.xml`）。

###访问位图数据

`BitmapData`对象的`draw`和`drawWithQuality`方法，可以将任何显示对象的当前显示像素绘制到`BitmapData`对象，包括`MovieClip`、`Bitmap`等。需要满足以下条件：

1. 源对象和目标对象需要在同一个域，或者目标对象调用`Security.allowDomain`授权的域。
2. 源对象和调用`draw`方法的对象在同一个域，或者源服务器包含一个授予调用域权限的策略文件。

如果使用`Loader`去加载图像，则可以指定第二个参数`context`，配置`checkPolicyFile`为`true`，则Flash Player会在加载图像的服务器上面查找策略文件。同理，文本对象的`img`标签也可以配置`checkPolicyFile`特性来检查策略文件。

###访问声音数据

以下是一些跟声音相关的安全限制：

1. `SoundMixer.computeSpectrum`。
2. `SoundMixer.stopAll`。
3. `Sound.id3`。

这些方法和属性对于与声音文件在同一安全沙箱中的代码，始终允许执行。对于其他沙箱的代码需要进行安全检查。

与图像类似，可以通过`Security.allowDomain`或者配置URL策略文件来授予对应的权限。

###访问视频数据

可以使用`Bitmap.draw`或者`Bitmap.drawWithQuality`方法捕获当前视频帧中的像素数据。视频的形式有：

1. 从Flash Media Server通过RTMP流式传输的视频。
2. 从FLV或者F4V文件加载的渐进式视频。

如果是从RTMP提取图形，需要使用服务端的`Action|Script Client.videoSampleAccess`属性允许访问服务器上的特定目录。

如果是FLV或者F4V则跟图像类似，可以通过`Security.allowDomain`或者配置URL安全策略文件来授予对应的权限。

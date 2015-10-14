---
layout: post
title: "当使用appendBytes播放视频的时候使用Bitmap截图"
description: ""
category: 
tags: [Flash]
---

当使用`NetStream`类的`play(url)`方法播放视频的时候，只要在`url`所在的域上配置正确的跨域策略，可以用以下方式进行截图：

    var video:Video = new Video()
    video.attachNetStream(netStream)
    netStream.play('http://path.to/video/file')
    var bitmapData:BitmapData = new BitmapData(video.width, video.height, false, 0)
    bitmapData.drwa(video)
    var bitmap = new Bitmap(bitmapData)
    addChild(bitmap)

但是当使用`NetStream`类的`play(null)`方法，并使用`appendBytes`的方式进行播放的时候，在使用以上的截图方式中会抛出错误：

    Error #2123: Security sandbox violation: BitmapData.draw: cannot access null. No policy files granted access.

原因可能是在整个播放过程中，数据是从`URLStream`等类拉取过来的，并没有声明`NetStream`中的内容是从哪个域获取的，导致出现安全沙箱异常。

这时候需要使用另一种方案来截图，就是使用`Graphics`类的`drawGraphicsData()`和`readGraphicsData()`两个方法来进行截图：

    // 省略attach netstream的代码
    var bitmapData:BitmapData = new BitmapData(video.width, video.height, false, 0)
    var bufferContainer:Sprite = new Sprite()
    bufferContainer.graphics.drawGraphicsData(video.graphics.readGraphicsData())
    bitmapData.draw(bufferContainer)
    // 省略创建bitmap的代码

这样就可以绕过直接使用`BitmapData`类的`draw()`方法所导致的跨域问题。`readGraphicsData()`这个方法在11.6以上版本的Flash Player才支持，那么问题又来了，对于Flash Builder 4.6来说（就是我当前的编译环境），默认的Flash Player版本是11.1，当直接使用这个方法的时候会编译不过！

这时候又要升级本地的Flash Builder使用的Flash Player版本。首先在项目上指定Flash Player的版本：

    //.actionScriptProperties
    <compiler ... targetPlayerVersion="11.6.0">...</compiler>

在编译这个项目的时候，Flash Builder就会去指定的目录查找`playerglobal.swc`：

    %FLASH_BUILDER_HOME%/sdks/4.6.0/frameworks/libs/player/11.6/playerglobal.swc

下载地址在[这里](http://fpdownload.macromedia.com/get/flashplayer/updaters/11/playerglobal11_6.swc)。重新构建项目的时候就不会有编译错误信息了。但是，当你调试的时候，还是发现会抛出错误，依然没有找到`readGraphicsData()`这个方法。其实还需要最后一个步骤，修改`flex-config.xml`文件：

    // %FLASH_BUILDER_HOME%/sdks/4.6.0/frameworks/flex-config.xml
    <flex-config>
      <target-player>11.6</target-player>
      <swf-version>19</swf-version>
      ...
    </flex-config>

把`target-player`和`swf-version`改成对应的版本就可以了。在重新编译一次，功能正常，嗨森！

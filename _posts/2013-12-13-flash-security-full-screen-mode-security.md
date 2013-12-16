---
layout: post
title: "Flash安全性之全屏模式安全性"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

要进入全屏模式，要将`stage`的`displayState`属性设置为`StageDisplayState.FULL_STAGE`常量。

对于在远程沙箱中运行的`swf`文件，有一些安全注意事项。第一个就是要在`object``或者`embed`标签中添加`allowFullScreen`参数，设置成`true`：

    <object>
      <param name="allowFullScreen" value="true" />
    </object>

或者：

    <embed allowFullScreen="true" />

仅当在响应鼠标事件或者键盘事件时才会调用启动全屏模式的ActionScript。当内容进入全屏模式时，程序会显示一条信息，例如`按ESC退出全屏模式`。

在全屏模式下会限制使用键盘，禁止文本输入。

在独立的播放器，例如计算机上的Flash Player上播放的`swf`文件，始终允许进入全屏模式，而且也完全支持键盘。

如果修改`stage.displayState`的`swf`文件跟`stage`所有者不是位于同一个安全沙箱，会引发异常。管理员也可以通过在`mms.cfg`文件中设置`FullScreenDisable = 1`对浏览器中运行的`swf`文件禁用全屏模式。

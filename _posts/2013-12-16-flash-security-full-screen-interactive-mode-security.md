---
layout: post
title: "Flash安全性之全屏交互模式安全性"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

Flash Player 11.3和更高版本支持全屏交互模式，即昨天讨论的全屏模式下，在Flash Player 11.3之前是不支持文本输入的。而在11.3之后的版本则可以通过配置参数让浏览器中的Flash Player在全屏模式下也能支持文本输入。

若要进入全屏交互模式，首先需要把`stage`的`displayState`属性设置为`StageDisplayState.FULL_SCREEN_INTERACTIVE`常量。

对于运行在远程沙箱中的`swf`文件，需要额外配置参数，允许`swf`进入全屏交互模式。在`object`或者`embed`标签中配置`allowFullScreenInteractive`参数，并将其配置成`true`：

    <object>
      <param name="allowFullScreenInteractive" value="true" />
    </object>

或者：

    <embed allowFullScreenInteractive="true" />

与一般的全屏模式相同，仅当在响应鼠标事件和键盘事件时，才能调用启动全屏交互模式的ActionScript。也会显示如何退出全屏模式的提示信息。

管理员可以通过在`mms.cfg`中设置`FullScreenInteractiveDisable = 1`对浏览器中运行的`swf`文件禁用全屏交互模式。

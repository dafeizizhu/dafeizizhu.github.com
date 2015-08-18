---
layout: post
title: "全局声音控制：SoundMixer"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

之前讨论的`MovieClip`实例中的`soundTransform`可以控制这个视频剪辑的声音播放以及声音大小的控制。但不是所有从`Loader`中加载的`swf`都是`MovieClip`实例，例如使用早期Flash创作工具创作的`swf`文件，它并没有`soundTransform`这个属性。这时候，我们只能通过全局声音来控制这个视频剪辑的声音播放。

在AS3中，全局声音控制是通过`SoundMixer`类提供的静态属性和方法来控制的。这个类有两个静态属性：

1. `bufferTime`，表示预加载到缓冲区中所用的秒数。
2. `soundTransform`，是`SoundTransform`的实例，通过控制这个属性的`volumn`方法就可以控制声音播放的大小。

这个类还提供了几个静态工具方法：

1. `areSoundsInaccessible`，确定是否因安全限制而无法访问任何声音，例如播放的声音所在的服务器没有授权所在域访问的URL策略文件等。
2. `computeSpectrum`，用来获取当前声音波形的快照。使用获取到的数据可以绘制出当前声音播放的波形。
3. `stopAll`，停止当前正在播放的声音。默认情况下，只会停止与调用此方法的对象在相同安全沙箱中的声音。注，没有恢复功能，只能调用`Sound`实例的`play`方法恢复声音播放。

由于普通的应用不会出现同时播放两种声音的情况，所以大多数情况下我们可以使用这个全局的声音控制方法为我们的`swf`应用提供静音功能：

    var soundtrans:SoundTransform = new SoundTransform(0, 0);
    SoundMixer.soundTransform = soundtrans;

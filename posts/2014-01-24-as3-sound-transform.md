---
layout: post
title: "在Flash中控制声音之SoundTransform"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

`Sprite`中有一个属性，`soundTransform`，就是用于控制这个`Sprite`的声音播放，包括音量大小和声道等。这个属性是`SoundTransform`类的一个实例，通过调整`soundTransform`的对应属性，就可以控制这个`Sprite`的声音播放。

`SoundTransform`有以下几个属性可以供我们调整：

1. `leftToLeft`，指定左输入在左扬声器播放的量。
2. `leftToRight`，指定左输入在右扬声器播放的量。
3. `pan`，声音从左到右的平移。
4. `rightToLeft`，指定右输入在右扬声器的量。
5. `rightToRight`，指定右输入在右扬声器的量。
6. `volume`，指定音量范围。

其实上面的属性，平常只会使用到`volume`。这个属性的取值范围是`0`到`1`,分别表示静音和最大音量。

这个类只有构造函数一个公共方法，接受两个参数，分别是`volume`和`pan`两个属性的值。

下面的代码演示了如何控制一个`Sound`实例的声音播放：

    var mySound:Sound = new Sound();
    var url:URLRequest = new URLRequest("mySound.mp3");
    var channel:SoundChannel;
    var transform:SoundTransform = new SoundTransform(0.5, 1.0);

    mySound.load(url);    
    channel = mySound.play();
    channel.soundTransform = transform;

我们也可以把`SoundTransform`的实例设置到`Sprite`实例的`soundTransform`属性来调整`Sprite`的声音播放。

但是有个问题，如果`swf`文件是在ActionScript 3.0之前的版本创作的，从`Loader`加载回来的内容不是`Sprite`的实例，自然也没有办法通过`soundTransform`来调整音量。明天将继续介绍全局音量是如何控制的。

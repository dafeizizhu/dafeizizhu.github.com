---
layout: post
title: "Loader.loadBytes传递参数"
description: ""
category: 
tags: [Flash]
---

近期广告播放的逻辑需要修改，由于单击广告跳转的逻辑交给素材去实现，需要把单击广告的统计也移动到素材里面，通过传递URL来实现这个统计功能。在对接的过程中，素材方提供的测试素材接收一个参数，内容就是单击广告需要发送统计的URL。为了方便对接，我这边写了一个简单的demo来校验素材方是否能正确处理单击广告的统计发送：

    var loader:Loader = new Loader()
    loader.load(new URLRequest('path/to/creative?adcl=path/to/statistic'))

在测试的过程中，看到对方的日志已经成功接收到对应的URL参数。但是集成到播放器的时候就出事了，日志里面素材方并没有接收到任何参数。奇怪了，demo里面的地址明明是我用Fiddler抓出来的啊，应该是一模一样的，怎么就不行了呢？

看了播放器里面素材的加载代码，发现了一个重要的区别：demo使用的是`load()`方法加载的，而播放器里面的代码是用`loadBytes()`加载的！是不是这个原因导致播放器加载素材的时候参数传递失败呢？

查了手册，果然是这样的，需要在`LoaderContext`里面增加`parameters`这个参数：

>通常，通过分析请求URL来获得`contentLoaderInfo.parameters`属性的值。如果设置了`parameters`变量，则`contentLoaderInfo.parameters`从`LoaderContext`对象而不是从请求URL中获取其值。与URL类似，`parameters`变量仅接受包含名称-值字符串对的对象。如果对象不包含名称-值字符串对，则会引发`IllegalOperationError`。

>此API的目的是使加载SWF文件能够将其参数转发给已加载的SWF文件。使用`loadBytes()`方法时，此功能特别有用，这是因为`LoadBytes`不提供通过URL传递参数的手段。只能将参数成功转发给其他AS3 SWF文件。

根据手册的指引，调用`loadBytes()`方法的时候为`LoaderContext`参数增加`parameters`参数：

    var loaderContext:LoaderContext = new LoaderContext()
    loaderContext.parameters = {
      adcl: 'path/to/statistic'
    }
    loader.loadBytes(bytes, loaderContext)

这样素材就能接收到我传递的参数啦。

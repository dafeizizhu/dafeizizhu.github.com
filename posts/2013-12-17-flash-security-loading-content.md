---
layout: post
title: "Flash安全性之加载内容"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

Flash可以加载多种类型的内容，作为显示对象显示在舞台上，包括`swf`影片、图像、声音、视频等。

###加载SWF和图像

使用`Loader`可以加载`swf`文件或者图像。可以加载属于自己沙箱权限范围之内的资源，例如受信任的`swf`可以加载本地或者网络的资源等。下面是使用`Loader`的一个例子：

    var ldr:Loader = new Loader(); 
    var url:String = "http://www.unknown.example.com/content.swf"; 
    var urlReq:URLRequest = new URLRequest(url); 
    ldr.load(urlReq); 
    addChild(ldr);

`load`方法可以传入第二个参数`context`，定义如何使用加载的上下文。这个参数有以下几个比较重要的属性：

1. `checkPolicyFile`，当加载图片的时候使用该属性。如果图像文件所在的域与包含`Loader`对象的文件所在的域不同，则指定此属性。当设置成`true`的时候，会检查远程服务器上面的策略文件。如果授予了适当的权限，`swf`文件就可以访问加载图像中的数据（例如调用`BitmapData.draw`等操作图像的像素等）。
2. `securityDomain`，当加载`swf`的时候使用该属性。有两个可选的取值：`null`或者`SecurityDomain.currentDomain`。如果指定为后者，则视为远程`swf`文件在本地服务器加载一样，可以自由访问本地`swf`文件的属性和方法。请注意，多数情况可以通过执行普通加载操作然后让加载的`swf`文件调用`Security.allowDomain`方法来取代沙箱导入。由于加载的`swf`文件将位于自己的原始沙箱中，并因而能够访问自己实际服务器上的资源，因此后一种方法会更易于使用。
3. `applicationDomain`，当加载ActionScript 3.0编写的`swf`才会使用这个属性。当加载文件时，可以指定文件应放置在特定的应用程序域中，而不是默认放置在一个新的应用程序域中。

###加载声音和视频

允许任何内容使用`Sound.load`、`NetConnection.connect`和`NetStream.play`方法从网络源加载声音和视频，只能与本地文件系统内容交互的沙箱中的内容除外。

###使用文本域的img标签加载swf和图像

通过使用`img`标签，可以将`SWF`文件和位图加载到文本字段中：

    <img src = 'filename.jpg' id = 'instanceName' >

可以通过以下代码获取到图像的显示对象：

    var loadedObject:DisplayObject = myTextField.getImageReference('instanceName');

`img`标签上可以指定加载上下文，例如：

    <img src = 'filename.jpg' checkPolicyFile = 'true' id = 'instanceName' >

当使用这些标签加载外部资源的时候，会在`TextField`内部创建一个`Loader`实例去加载这些内容。虽然`Loader`对象跟本地`swf`文件是在同一个安全沙箱中，不过访问`Loader`的`content`属性的时候，就需要应用到响应的安全规则了。

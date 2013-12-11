---
layout: post
title: "Flash安全性之安全沙箱"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

在HTML中，传统Ajax的限制就是跨域。在Flash中，安全性比较复杂，因为`swf`文件可以在本地通过Flash Player直接播放，也可以嵌入HTML页面中播放。在不同的环境中的`swf`文件的安全策略是不一样的。我们可以通过访问`Security`的只读静态属性`sandboxType`来确定`swf`文件当前是处于那种沙箱当中。

###远程沙箱

第一种情况是来自Internet的资源，例如在页面播放的`swf`文件等。这时候，Flash Player会根据资源所在的域把它们分到不同的安全沙箱中。默认情况下，这些资源只能访问自身所在的安全沙箱中的内容。这个策略是基于域控制的，可以通过Web站点许可（通过昨天介绍的`crossdomain.xml`来配置）或者作者许可（调用`Security.allowDomain`方法），可以允许远程的`swf`文件访问其他安全沙箱中的资源。

当`swf`文件处于远程沙箱中，`Security.sandboxType`为`Security.REMOTE`。来自Internet的资源无法加载任何本地文件和资源。

###本地沙箱

本地文件的意思是通过`file`协议或者统一命名约定（UNC）路径引用的任何文件，例如一个本地HTML文件嵌入的`swf`或者直接在本地Flash Player播放的`swf`。本地`swf`文件有四种安全沙箱的类型，映射到`Security.sandboxType`这个静态只读属性：

1. `Security.LOCAL_WITH_FILE`，表示`swf`文件是本地文件，但是未受信任，且没有使用网络名称发布。此`swf`文件可以从本地读取数据，但无法与Internet进行通讯。
2. `Security.LOCAL_WITH_NETWORK`，表示`swf`文件是本地文件，但是未受信任，但已使用网络名称进行发布。此`swf`文件可以与Internet通讯，但是无法读取本地数据。
3. `Security.LOCAL_TRUSTED`，表示`swf`已受信任。此`swf`文件既可以读取本地数据，也可以访问Internet。
4. `Security.APPLICATION`，表示`swf`文件在AIR应用程序中运行，并随AIR文件一起安装。此`swf`文件可以访问AIR应用程序沙箱的任何文件。

其中`Security.LOCAL_WITH_FILE`跟`Security.LOCAL_WITH_NETWORK`这两类安全沙箱中的内容是无法互相访问的。

经过实验观察，直接从本地Flash Player播放的`swf`文件显示的是`Security.LOCAL_TRUSTED`，表示这个`swf`文件既可以访问本地数据也可以访问Internet，不受基于域的沙箱规则控制。而嵌入在远程HTML页面中的`swf`文件显示的是`Security.REMOTE`，这种情况下要进行跨域访问需要在远程服务器中配置We站点许可，也就是`crossdomain.xml`。

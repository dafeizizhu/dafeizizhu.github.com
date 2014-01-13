---
layout: post
title: "使用安全域"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

`SecurityDomain`类代表当前安全性“沙箱”，也称为“安全域”。通过此类的一个实例传递给`Loader`的`load`方法，可以请求将所加载的媒体防止到特殊的沙箱中。

这个类只有一个静态属性`currentDomain`，只读，用来获取当前的安全域。通过在`load`方法的第二个参数`context`中设置`securityDomain`这个属性，当前`swf`文件可以授信给所加载的`swf`文件，而所加载的`swf`文件的授信则需要通过URL策略文件：

    var context:LoaderContext = new LoaderContext(true); 
    context.securityDomain = SecurityDomain.currentDomain; 

用这种方式加载的`swf`文件的权力比用`allowDomain`授权的更大。把`swf`加载到同一个安全域中，等同于能做任何事，这些`swf`文件可以在当前域下面做任意操作，例如：

1. 获取当前`swf`中的任意引用。
2. 读取当前`swf`所在域的文件。
3. 读取主域上的共享对象。
4. 获取通过当前`swf`所在域建立的共享连接通讯。

所以在引入跨域`swf`文件到当前的安全域下面千万要注意，不要引入恶意的`swf`文件。

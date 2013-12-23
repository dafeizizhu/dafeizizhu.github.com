---
layout: post
title: "Flash安全性之跨脚本访问"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

如果使用AS3.0编写的两个`swf`文件来自同一个域，那么它们是可以互相访问和修改另一个文件的变量、对象、属性和方法。反之则视为是跨脚本访问。

在默认情况下，Flash Player不允许这种跨域的脚本访问。通过调用`Security.allowDomain`，可以授予其他域的`swf`文件编写其脚本的权限。例如：

    Security.allowDomain("siteA.com");

这样，这个`swf`文件就可以被`siteA.com`中的`swf`访问其变量、对象、属性和方法。

注意，调用`Security.allowDomain`是不对称的，这个`swf`文件想要访问`siteA.com`中的`swf`文件需要在`siteA.com`的`swf`文件中也调用`allowDomain`。

###Stage安全性

`stage`对象的所有者是地一个加载的`swf`文件。`stage`对象的一些属性和方法只能用于在所有者同一安全沙箱中的`swf`文件，例如`stage.align`或者`stage.addChild`等。

在所这者的`swf`文件中调用`allowDomain`可以授予其他安全沙箱中的`swf`访问`stage`的这些属性和方法。

###遍历显示列表

一个`swf`文件能够访问从其他沙箱中加载的显示对象也受到一定的限制。如果需要能访问到其他沙箱中的`swf`文件，需要在目标文件中调用`allowDomain`授予相应的权限。

###事件安全性

与显示列表相关的事件具有一定的安全性限制。如果父对象和源显示对象位于不同的安全沙箱，则不或阶段和冒泡阶段在父对象的下方停止，除非两个对象的所有者是互相信任的，例如通过调用`allowDomain`。

---
layout: post
title: "Flash调用外部JavaScript"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

`ExternalInterface`是用来支持ActionScript和`swf`容器（例如`HTML`页面）之间进行交互的接口。通过`ExternalInterface`，可以在`swf`文件内部的ActionScript代码调用外部HTML页面的JavaScript代码，反之亦然。

今天先来讨论下`swf`文件内部是如何访问外部HTML页面的JavaScript代码。在获得授权的情况下，ActionScript可以调用JavaScript的任何全局函数、可以传递任意数量的基本类型的参数、可以接收JavaScript函数的返回值。

在使用`ExternalInterface`之前，我们都必须检查这个类的静态属性`available`的值。这个属性表示外部容器（例如HTML页面）是否支持提供外部接口。当这个属性的值为`true`的时候，我们可以使用静态方法`call`来调用HTML的JavaScript函数。

`call`方法接受可变长度的参数，其中第一个参数是执行的JavaScript函数的名称。注意的是，不仅仅可以传递函数名称，也可以传递一个匿名函数：

    ExternalInterface.call("function(){alert(1);}");

这样十分方便，再也不需要担心要在HTML页面暴露出几个全局函数让ActionScript执行了。

后面可以传递多个参数，这些参数也会传递到JavaScript函数中，会自动把ActionScript的类型转化成JavaScript的类型。

调用这个方法后，如果调用成功，则返回JavaScript函数的返回值，否则返回`null`表示调用失败。有很多种场景都会使调用失败，例如该JavaScript函数不可用、在Netscape或者Opera发生递归等。

这个方法会引发两个异常：

1. 容器不支持调用，引发`Error`。
2. 包含环境属于调用代码无权访问的安全沙箱，引入`SecurityError`。

要解决安全问题，需要以下两个步骤：

1. 在包含`swf`的HTML页面中，让`allowScriptAccess`特性为`always`。
2. 在`swf`文件中，加入`Security.allowDomain(sourceDomain)`。

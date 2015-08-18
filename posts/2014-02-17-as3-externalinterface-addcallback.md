---
layout: post
title: "在JavaScript中调用AS3的代码"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

在信任的容器中，也可以通过JavaScript调用ActionScript的代码。通过`ExternalInterface.addCallback`这个方法，可以将ActionScript方法注册为容器可用。

这个方法接受两个参数：

1. `functionName`，在容器中注册的方法名。调用这个方法之后，会在Flash的DOM对象中生成一个同样名称的方法，外部容器通过这个方法来访问ActionScript中对应的方法。
2. `closure`，注册的方法。

当成功调用`addCallback`之后，容器中的JavaScript就可以调用对应的ActionScript的代码：

    var swf = document.getElementById("id");
    swf.functionName(...);

跟`call`一样，调用之前要检查`availible`属性的值。如果不支持传入调用，会引发`Error`。

同样，也要通过代码给对应的`swf`文件和容器赋予权限：在容器中设置`allowScriptAccess`参数的值为`always`；在`swf`内部调用`allowDomain`赋予对应域中的容器权限。

通过`allCallback`和`call`，我们可以在ActionScript和外部容器（例如HTML中的JavaScript）进行交互，例如读取页面的URL、读取cookie、调用容器对应功能，如调用`alert`等方法，非常方便。

其中要注意的是，在IE6上有部分关键字，例如`stop`，不能用在`functionName`，考虑这种情况的话`functionName`最好是一些比较特别一点的名字，如`stopMe`（囧）。

---
layout: post
title: "Flash安全性之限制网络API"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

可以使用两种方式限制网络API。这些限制不能通过代码覆盖。

###阻止的端口

Flash Player和Adobe AIR对某些端口的HTTP访问设有限制。通常用于非HTTP类型服务器的某些标准端口上不允许使用HTTP请求。

适用于端口阻止的API包括：

1. `FileReference`的`download`、`upload`方法。
2. `Loader`的`load`、`loadBytes`方法。
3. `navigateToURL`方法。
4. `NetConnection`的`call`、`connect`方法。
5. `NetStream`的`play`方法。
6. `Security.loadPolicyFile`。
7. `sendToURL`。
8. `Sound`、`URLLoader`和`URLStream`的`load`方法。

端口阻止也适用于文本字段中有关`url`的字段，例如`img`、`object`或者`embed`等。

###使用allowNetworking参数

可以在`object`或者`embed`标签中设置`allowNetworking`参数来控制`swf`文件访问网络功能。它可以有以下的取值：

1. `all`，允许`swf`文件访问所有网络的API。
2. `internal`，不可调用浏览器导航或者浏览器交互的API，如`navigateToURL`等。
3. `none`，除了浏览器交互的API，也不能使用任何`swf`到`swf`通信的API，如`Loader.load`等。

调用被禁止的API会触发`SecurityError`。这个参数的使用示例如下：

    <object>
      <param name="allowNetworking" value="none" />
    </object>

或者：

    <embed allowNetworking="none" />

如果该参数的值为`none`，除了API被禁用，当`TextField`对象的`htmlText`属性包含`img`等涉及URL的参数的标签时，也是无法引用到外部资源的哦。

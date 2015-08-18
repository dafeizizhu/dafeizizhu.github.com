---
layout: post
title: "在Flash中发送请求之二：URLLoader"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

使用`URLRequest`生成请求的内容之后，我们需要发送这个请求，这时候就需要用到`URLLoader`这个类。这个类相当于Ajax中的`XMLHttpRequest`，使用其`load`方法就可以把请求发送出去。这个类除了可以处理文本之外，还能处理二进制的数据哦，例如文件等。

这个类有以下几个实例属性：

1. `bytesLoaded`，表示加载完毕的字节数。
2. `bytesTotal`，表示这个请求完全加载后的字节数。
3. `data`，表示接收到的数据。数据类型又`dataFormat`这个属性决定。
4. `dataFormat`，表示接收数据的格式，默认是文本`URLLoaderDataFormat.TEXT`。可选的值是二进制`URLLoaderDataFormat.BINARY`和URL编码变量`URLLoaderDataFormat.VARIABLES`。

这个类的实例方法很简单，只有两个：

1. `load(request:URLRequest)`，发送请求，参数为请求的内容，类似于`xhr.send`。
2. `close()`，取消这次请求，类似于`xhr.abort`。

`load`方法是异步的，所以处理这次请求的过程跟Ajax也是十分类似，需要通过绑定事件去监听加载中的每一个过程。调用`load`之后，会触发以下几个事件：

1. `complete`，请求完成，数据可以通过事件对象的`target`属性中的`data`属性获取。
2. `httpStatus`，如果请求是通过HTTP协议发送的，当接收到HTTP请求的状态码的时候会触发这个事件。状态码通过事件对象的`status`属性获取。
3. `ioError`，请求无法完成的时候触发，具体失败的内容可以通过事件对象的`text`属性获取。
4. `progress`，请求进行中会触发若干遍，通过监听这个事件我们可以做出进度条的效果。根据事件对象的`bytesLoaded`属性和`bytesTotal`属性可以知道当前加载完成的百分比。
5. `securityError`，加载操作尝试从调用方安全沙箱外部的服务器检索数据时触发。
6. `open`，加载开始的时候触发。

调用`load`还可能抛出以下几个错误，需要根据情况使用`try...catch`来捕获： 

1. `ArgumentError`，请求头（`URLRequest`中的`URLRequestHeaders`）对象包含某些被禁用的HTTP请求标头。
2. `MemoryError`，内存分配错误。
3. `SecurityError`，本地不受信任的 SWF 文件可能无法与 Internet 进行通信。
4. `TypeError`，传入的`URLRequest`参数为`null`。

下面是一个使用`URLRequest`和`URLLoader`发送请求的一段示例代码：

    var urlRequest:URLRequest = new URLRequest();
    urlRequest.url = "path/to/url";
    var urlLoader:URLLoader = new URLLoader();
    urlLoader.addEventListener(Event.Complete, function (event:Event):void
    {
      trace(event.target.data);
    }
    urlLoader.load(urlRequest);

这两个类的基本的使用方法就是这么简单。但是在实战中，还有很多需要注意的问题，特别是涉及到跨域访问还有异常（包括错误事件）的处理，对一个初学者来说真是非常的蛋疼菊紧啊！

---
layout: post
title: "window.postMessage"
description: ""
category: 
tags: [JavaScript, html5]
---
{% include JB/setup %}

以前我们需要在跨域的`iframe`中通讯，只能使用一个中间`iframe`跳转（或者`window.name`）来进行数据交换。而`window.postMessage`允许我们进行安全的跨域通讯。

调用`window.postMessage`的时候会在目标的`window`上分发`MessageEvent`。这个事件对象包括事件类型`message`和一些关于这次消息通讯的属性，包括数据、源还有调用`postMessage`的`window`等。

这个方法接受两个参数：

1. `message`，要传输的数据。
2. `targetOrigin`，声明特定的域接收这个事件，可以是`*`或者是一个URI。如果目标`window`的域与这个参数不匹配，则不会把事件分发到这个`window`。这样就可以防止事件的信息被不信任的代码捕获到。

我们可以通过以下的代码接收别的`window`发送过来的消息：

    window.addEventListener("message", receiveMessage, false);
    function receiveMessage(event) {
      if (event.origin !== "http://example.org:8080")
        return;
	    // ...
    }

事件对象有以下几个属性：

1. `data`，就是通过`postMessage`传入的第一个参数的值。
2. `origin`，调用`postMessage`的`window`所在的域。这个属性包括协议、主机还有端口。这个域只是调用`postMessage`当时的`window`所在的域。
3. `source`，调用`postMessage`的`window`的一个引用。

有以下几个实践建议：

1. 如果你不需要任何其他`window`发送的消息，不要绑定`message`事件！
2. 如果需要这些消息，记得在处理的时候校验事件对象中的`origin`和`source`属性是否合法。任何`window`都可以向这个页面发送消息，所以一定要过滤掉一些恶意的消息。除了对来源的校验，还必须对消息的内容进行校验和过滤，防止有害的消息影响系统功能。
3. 在发送消息的时候记得带上一个特定的`targetOrigin`，而不是`*`。这样可以防止其他恶意的站点截获你的消息。

最后一个需要注意的地方是，事件对象中的`origin`属性与`document.domain`的值是没有关系的哦，有兴趣的小伙伴可以做一个实验来验证一下！

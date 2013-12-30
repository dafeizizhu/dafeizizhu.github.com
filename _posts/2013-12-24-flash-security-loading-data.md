---
layout: post
title: "Flash安全性之加载数据"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

类似于HTML中的Ajax或者表单提交，Flash必须也可以与服务端交换数据。比HTML要灵活一点的是，Flash可以通过在站点上配置策略文件允许跨域访问，而Ajax则不能（当然，现在可以配置服务端的响应头实现跨域的Ajax……）。

在Flash中可以使用`URLLoader`或者`URLStream`的`load`方法加载数据：

    var request:URLRequest = new URLRequest("path/to/res");
    var urlLoader:URLLoader = new URLLoader(request);
    urlLoader.load();

跟Ajax类似，加载的过程是异步的，需要监听事件才能获取到加载完之后的数据。Flash内建了`Progress`的事件，这个比传统的Ajax真要方便多了（虽然貌似现在HTML5也有……）。

比HTML跟进一步的是，Flash可以直接连接Socket，当然，也需要配置策略文件保护安全。Socket的策略文件可以从以下几个地方获取：

1. 端口`843`，这个是主策略文件，相当与`http://host/crossdomain.xml`。
2. 与主套接字连接相同的端口。
3. 之外的其他端口，由其他策略文件指定。

在Flash中可以调用`Socket.connet`或者`XMLSocket.connet`来链接套接字：

    var socket:Socket = new Socket();
    socket.connet("host", 12345);

当需要传送敏感数据的时候，可以使用传输层安全性（TLS）或者套接字安全性（SSL）来保护数据，可以使用`HTTPS`协议来连接。

在调用`URLLoader.load`和`URLStream.load`的时候，可以把一些数据（例如文本、文件、二进制数据等）发送到服务器，这时候也要遵循基于域的安全沙箱机制。

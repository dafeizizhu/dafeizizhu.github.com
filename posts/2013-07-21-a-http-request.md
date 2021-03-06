---
layout: post
title: "HTTP协议之简述一个HTTP请求的经过"
description: ""
category: 
tags: [http]
---
{% include JB/setup %}

之前已经科普过HTTP的请求/响应头还有HTTP状态码，今天简单的看看一个HTTP请求的过程。

先来根据W3的HTTP 1.1官方规范来看一些术语：

1. 连接（connection），指的是两个程序为了通讯而建立的一个“虚拟”的通道。
2. 客户端（client），指的是发出HTTP请求的一方。
3. 服务端（server），指的是接收HTTP请求并返回HTTP响应的一方。
4. 代理（proxy），指的是接收HTTP请求，作出一些处理（例如翻译），然后发送HTTP请求到某个特定的服务端的中间件。
5. 网关（gateway），与代理类似，不过它更着重于一个“关口”的概念，把接收到的HTTP请求继续传递给其下级子网来进行处理。
6. 隧道（tunnel），与代理类似，不过它更着重于一个“透传”的概念，把接收到HTTP请求直接透传到某个特定的服务端中间件。
7. 缓存（cache），一个本地存储及其管理系统，程序可以根据特定的机制决定是否在服务端真正地进行处理作为响应还是直接读取本地存储中的内容作为响应。

术语还有很多，详情可以[参考这里](http://www.w3.org/Protocols/rfc2616/rfc2616-sec1.html)。同学们如果发现英文翻译有误的请赶紧拍砖啊。

现在来看看一个HTTP请求究竟经历了哪些步骤：

1. 建立连接，客户端会根据服务器的ip地址和端口号与服务器建立socket连接。
2. 客户端发送一个HTTP请求，里面的HTTP请求头会包含一些这个请求的信息，例如URI、HTTP方法等。
3. 服务器根据请求的内容进行处理，并返回一个HTTP响应。
4. 客户端接收HTTP响应，关闭socket连接。

这样，一个最简单的HTTP请求就完成了。现实中的场景可能会比较复杂，例如一个HTTP请求，经过N个中间件（例如代理、网关和隧道），转发了N+1这么多次才到达真正要处理这个请求的服务器。而每一个中间件也有可能把接收到的HTTP请求进行转发，转发到更多的服务器上面进行处理。

为了提高转发的效率，每一个中间件，包括发出请求的客户端，还有最后真正处理请求的服务端，都可以进行缓存。当其中一个中间件判断这个请求的缓存可用的情况下，这个HTTP请求就不会再被转发到下一个中间件，而是直接返回，这样能大大地减少网络带宽和请求处理的时间。

HTTP协议相关的内容实在太多了，还有HTTP请求、HTTP响应，MIME类型等等等等。再次引用一个前同事的话，当遇到一个与浏览器或者Web服务器相关的疑难问题攻不下来，这时不妨看看对应的规范，才能了解浏览器或者是Web服务器为什么要这样实现，说不定会有种豁然开朗的感觉。

---
layout: post
title: "HTTP协议之HTTP 头"
description: ""
category: 
tags: [http]
---
{% include JB/setup %}

今天启程去阿里ADC，无奈被困机场，飞机起飞遥遥无期，故趁等飞机起飞的闲暇事件写一下HTTP协议之HTTP头的简介，来慰藉我寂寞的心（顺便鄙视周围的家伙们都在玩手机）。

看了一下RFC关于HTTP头的规范，我跟我的小伙伴们都惊呆了，有这么多，[参考这里](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html)。今天我决定先从一个比较简单的角度入手，对HTTP头及几个重要的头进行解析，抛砖引玉一下。

> HTTP header fields are components of the message header of requests and responses in the Hypertext Transfer Protocol (HTTP). They define the operating parameters of an HTTP transaction.

简单地说就是一些关于HTTP协议中请求与响应的传输中的控制参数。HTTP头由多个头域组成，至一个空的头域结束。每个头域是一个冒号分隔的键值对。HTTP头有标准头跟自定义头两种。标准头是每个实现都必须支持的头，如`Expires`、`Set-Cookie`等。非标准头可以由实现者自己定义，如IE的`X-UA-Compatible`等。

在HTTP协议本身是没有限制HTTP头的大小。尽管如此，很多Web服务器、客户端和代理软件都对HTTP头的大小进行限制。如Apache2.3中，每个头的大小最多是8160个字节，一个请求里面最多包含100个头。

头域大致可以分成两种，一种是请求头，客户端向服务器发请求的时候使用什么方法、请求什么URI、协议版本等都是在请求头中指定。另一种是相应头，服务器接到客户端的请求后返回相应的是否成功、返回的MIME类型是什么都在请求头中指定。


###请求头

常用的标准请求头包括下面几个：

1. `Accept`，声明哪种相应是可接受的，如`text\plain`、`application\json`等。
2. `Cache-Control`，声明缓存控制机制，如`no-cache`声明不做缓存。
3. `Connection`，声明与服务器的连接机制，如`keep-alive`等。
4. `Cookie`，声明Cookie信息。
5. `Content-Type`，声明请求体的MIME类型。
6. `Host`，声明需要请求URI的主机信息。
7. `If-Match`，声明匹配这个请求的Key，如果服务器的ETag与这个Key一致，则认为这个请求的资源没有发生改变，客户端可以选择从还从中加载这个请求。
8. `Origin`，声明跨域请求的时候支持什么域名进行访问。
9. `User-Agent`，声明发出这个请求的客户端的描述，如果是浏览器发出的请求，可以根据这个头判断是哪个浏览器的哪个版本。

非标准请求头包括下面几个：

1. `X-Request-With`，通常通过这个头告诉服务器这个请求是XMLHttpRequest发送的。
2. `DNT`，表示是否开启`DNT`（Do not track）功能，`1`表示开启，`0`表示关闭。
3. `Front-End-Https`，是微软用的一个自定义头，与负载均衡有关。
4. `Proxy-Connection`，与标准头`Connection`一致，是早期HTTP协议的产物。


###相应头

常用的标准相应头大概有以下几个：

1. `Accept-Allow-Controll-Origin`，声明这个响应可以参与到哪个域的跨域访问中。`*`表示可以参与到任何域的跨域访问。
2. `Allow`，声明这个HTTP响应是使用哪个HTTP方法，如`GET`、`POST`等。如果是一个不支持的HTTP方法，则会返回错误码`405 Method not allowed`。
3. `Content-Type`，声明这个响应的MIME类型。
4. `ETag`，声明这个响应版本的key，可以标识一个资源是否有改变过（参考请求头`If-Match`）。
5. `Pragma`，声明这个响应是否支持缓存，可以设置`no-cache`禁用这个响应的缓存。
6. `Refresh`，声明这个响应在特定时间后刷新或者跳转到新的URL。例如`Refresh: 5;http://example.com`，就表示5秒之后跳转到指定的URL。
7. `Status`，声明这个响应的状态码，后面会专门写一篇关于状态码的文章。

非标准的相应头包括下面几个：

1. `X-Frame-Options`，声明防止Clickjacking攻击的参数，如`deny`就是防止响应被渲染在iframe里面，而`sameorigin`就是防止响应在非本域的页面中渲染。
2. `X-Content-Type-Options`，帮助IE能不识别MIME类型不对的stylesheet和script，也用于Chrome下载其扩展。只有一个合法值`nosniff`。
3. `X-Powered-By`，声明该响应是通过哪种语言生成的，如`X-Powered-By: PHP/5.4.0`。
4. `X-UA-Compatible`，帮助IE使用特定的文档模式显式该响应，也可以指导IE使用Google Chrome Frame来渲染页面。

在`meta`里面定义的`http-equiv`头，跟某些HTTP头是相通的。可以设置服务器返回的HTTP头，让整个站点的所有页面都在HTTP传输过程中的行为保持一直。这样可以减少纯HTML（服务器脚本，如JSP、PHP、ASP等可以通过`include`的方式实现类似效果）的页面的代码量，减轻维护成本。

今天晚上12点才到杭州，1点半才到酒店，不过精神还行，期待明天阿里ADC！

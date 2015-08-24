---
layout: post
title: "跨域Ajax前后端具体配置"
description: ""
category: 
tags: [JavaScript, html5]
---

之前的博客有讨论过如何使用HTML5的`FormData`等API做一个文件分块上传的应用。今天具体回顾一下前端JavaScript和后端HTTP服务器应该如何配置才能正确使用跨域`XMLHttpRequest`。

### 允许跨域`XMLHttpRequest`

前端JavaScript以`jQuery`为例。`jQuery.ajax()`函数已经直接支持跨域`XMLHttpRequest`：

    $.ajax({
      url: 'http://other.host.com/path/to/resource',
      crossDomain: true
    })

配置`crossDomain`参数能显式指示`jQuery`使用跨域的`XMLHttpRequest`。

服务端则需要配置`Access-Control-Allow-Origin`头：

    Access-Control-Allow-Origin: *

这个头声明了这个服务器接受哪些域提起的跨域请求，`*`表示允许所有域发起的跨域请求。

### 读取Cookie

如果需要读取Cookie，则需要在调用`jQuery.ajax()`函数的时候加上`xhrFields`这个参数：

    $.ajax({
      url: 'http://other.host.com/path/to/resource',
      xhrFields: {
        widthCredentials: true
      },
      crossDomain: true
    })

这样才能把Cookie带过去。

服务端也需要写入一个`Access-Control-Allow-Credentials`头：

    Access-Control-Allow-Credentials: true

**注意，当配置了这个头为`true`的时候，`Access-Control-Allow-Origin`头的值就不能是`*`，需要配置一个具体的域名。**如果还是想允许所有域发起的`XMLHttpRequest`请求，则需要服务端动态写入`Access-Control-Allow-Ogrigin`头，值为发起请求的域名。

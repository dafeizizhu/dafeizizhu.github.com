---
layout: post
title: "JavaScript同源策略"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

当一个不是当前页面的域下的脚本要跟当前页面进行交互，要受到这个同源策略的限制。这里的同源指的是页面和脚本路径的协议、端口和主机都一样。其中一项不一样都视作不同源，也就是我们常说的跨域：

    http://store.company.com/dir/other.html
    http://store.company.com/dir2/other.html // same
    http://store.company.com:81/dir/other.html // not same

一个页面还可以更改其所在的域，不过有很多限制。可以通过设置`document.domain`改变当前页面的域，但是只能够设置到当前域的后缀部分，例如：

    // current domain: www.duowan.com
    document.domain = "duowan.com"; // success
    document.domain = "u.duowan.com"; // error

设置了域之后的跨域检查都会使用设置后的值去计算。有一点需要注意的是，设置`document.domain`之后端口会被重置为`null`，所以`company.com:8080`和`company.com`要通讯，两个页面都需要设置`document.domain`，这样端口才能一致。

跨域的访问通常可以分成三种：

1. 跨域“写”，即链接、跳转和表单提交，这种行为是允许的。
2. 跨域“嵌入”，即`script`、`link`、`img`、`video`、`object`、`embed`、`iframe`等，这些也是被允许的。
3. 跨域“读”，例如`XMLHttpRequest`，一般是不允许的，需要设置CORS才能允许这些跨域访问。

在JavaScript中，我们可以通过`iframe.contentWindow`、`window.parent`等API去访问页面中的其他文档。如果这些文档不在同一个域，访问这些文档的`winodw`和`location`会被禁止。如果需要跨域的`iframe`通讯，请使用HTML5提供的`postMessage`API或者使用一些框架去实现，例如[MessengerJS](https://github.com/biqing/MessengerJS)。

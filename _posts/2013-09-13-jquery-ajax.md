---
layout: post
title: "jQuery扫盲之jQuery.ajax"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

继续扫盲，今天是`jQuery.ajax`方法详解。

> Perform an asynchronous HTTP (Ajax) request.

这个方法应该是jQuery有关Ajax的最底层的一个方法。

###用法
____

这个方法有两种调用形式：

1. 接受两个参数，第一个是`url`，第二个是Ajax的配置。
2. 接受一个参数，就是Ajax的配置。

其实第一种调用方式就是方便发出请求，只需要传递URL作为参数即可。注意哦，所有配置都是可选的，可以通过`$.ajaxSetup`来设置默认配置。

###配置
____

1. `accepts`，用来设置接受那些MIME类型的数据，例如`accepts: { xml: "text/xml" }`。默认值与`dataType`配置有关。
2. `async`，声明这个Ajax请求是否异步。默认值是`true`，表示请求是异步的。可以通过`async: false`来显式声明这个请求是同步的。使用跨域的请求或者是jsonp的时候，不支持同步请求。**注意，在1.8之后，同步的请求只能通过`success`等回调进行处理，而不能使用jqXHR的promise。**
3. `beforeSend`，配置一个回调函数，在Ajax请求发出之前调用。接受两个参数，第一个是jqXHR对象，第二个是这次Ajax请求的配置。如果在回调函数中返回`false`，则这个Ajax请求会被取消。
4. `cache`，声明这个Ajax请求是否允许缓存。默认值是`true`。只对GET请求有效，原理是通过在GET的URL后面附上一个时间戳参数`_=13xxxxxxx`来达到不取缓存的作用。使用其他HTTP方法的时候是没有效的（除了奇葩IE8，当POST之前已经使用GET请求相同URL的时候）。

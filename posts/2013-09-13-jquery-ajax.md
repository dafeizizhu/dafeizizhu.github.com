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
5. `complete`，请求完成时的回调函数，接受jqXHR对象还有一个字符串形式的状态组为参数。这个回调函数会在`success`或者`error`后调用。在1.5之后的版本，还可以接受一个函数数组，当Ajax请求完成的时候会按顺序执行数组中的回调函数。
6. `contents`，配置特定的`contentType`按照特定的正则表达式去转换返回的数据。
7. `contentType`，配置`Content-Type`请求头，默认是`application/x-www-form-urlencoded; charset=UTF-8`，适用于大部分的情况。
8. `context`，指定回调函数的执行上下文。
9. `converters`，指定返回数据类型的转化方式，例如`json`的是`jQuery.parseJSON`。
10. `crossDomain`，当同域请求的时候默认为`false`，当不同域请求的时候默认为`true`。
11. `data`，被发送到服务器的数据，可以是一个字符串，也可以是一个对象，这个对象会被序列化成一个查询串的形式。
12. `dataFilter`，在数据返回前执行的回调函数，接受原始数据的字符串和数据类型两个参数。返回值会被当作参数传到下一个回调函数中（例如`success`）。
13. `dataType`，返回数据的类型，可以是字符串、JSON对象或者是XML等。jQuery会根据相应头自动进行判断返回的数据类型。可以通过这个配置显式指定返回的数据类型。
14. `error`，Ajax请求发生错误的时候执行的回调函数，接受三个参数，分别是jqXHR对象、状态字符串还有抛出的错误。状态可能是`timeout`、`error`、`abort`或者是`parsererror`。而抛出的错误大部分是HTTP的错误，例如`Not Found`（404）、`Internal Server Error`（50X）等。
15. `global`，配置这个请求是否触发全局Ajax事件，默认为`true`。
16. `headers`，配置请求头。该配置是一个对象，其中的键是请求头的名字，值是对应请求头的值，例如`"Content-Type": "application/x-www-form-urlencoded"`。
17. `ifModified`，默认值是`false`。当这个配置为`true`的时候，返回值发生变化才认为请求成功，否则不会触发`success`回调。
18. `isLocal`，当页面是在本地环境（文件系统等）打开的时候是`true`。强烈建议在`jQuery.ajaxSetup`中设置该配置的值。
19. `jsonp`，配置jsonp回调函数名在查询串中的键名，默认是`callback`。
20. `jsonpCallback`，配置jsonp回调的函数名。默认情况下jQuery会生成一个随机的函数名以确保每次的回调都能与这个Ajax请求匹配上。我们可以配置一个特定的函数名称，当Ajax请求完成时就回直接调用该函数。
21. `mimeType`，配置XHR的MIME类型。
22. `password`，配置认证需要的密码信息。
23. `processData `，默认值是`true`，表示对提交的数据进行查询串形式的转换。如果想传递XML DOM等非查询串形式的数据，则需要把这个配置设置成`false`。
24. `scriptCharset`，当数据类型是`script`或者是`jsonp`的时候，而且远程的脚本使用的编码与页面编码不一致的时候才需要配置这个选项。需要显式指定远程脚本的字符集编码。
25. `statusCode`，配置一个对象，键是HTTP状态码，例如`200`、`404`等，值是一个回调函数，当Ajax请求完成时，会执行返回的状态码对应的回调函数。
26. `success`，Ajax请求成功时执行的回调函数，该函数接受三个参数，返回的数据（已经根据`dataType`进行转换后的数据）、状态字符串还有jqXHR对象。
27. `timeout`，设置这个请求的超时时间。
28. `traditional`，当配置为`true`的时候使用`jQuery.param`来序列化传给服务器的数据。
29. `type`，声明这次请求的HTTP方法，例如`GET`、`POST`等。
30. `url`，声明请求的URL，默认值是当前页面。
31. `username`，配置认证需要的用户名信息。
32. `xhr`，配置获取XMLHttpRequest的方法，默认是优先使用`ActiveXObject`，其次是使用标准的`XMLHttpRequest`。可以通过配置一个回调函数，配置自定义的方法获取XMLHttpRequest对象。
33. `xhrField`，在xhr对象上配置自定义的属性。

哇，竟然有33个配置这么多！其实日常使用也不会用到这么多的配置，更多的情况下我们是会使用jQuery包装的函数去发送Ajax请求，例如`$.get`或者`$.getScript`等。我们还可以根据自己的需要封装自己的工具函数与服务器进行交互。

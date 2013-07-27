---
layout: post
title: "HTTP协议之HTTP方法"
description: ""
category: 
tags: [http]
---
{% include JB/setup %}

今天看阿雄写代码，封装与服务器交互的相关工具方法。各种`get`、`post`、`put`、`del`的方法，对应各种HTTP方法。`get`和`post`不用说，看到`put`和`delete`的时候，阿雄说这两个方法的参数都不是放在请求体里面。奇怪了，按照常理来说对服务有影响的操作都应该把参数放到请求体里面啊（类似`post`），难道不是这样的？

看W3的规范里面，HTTP协议能使用的方法大概有以下几种：

1. `OPTIONS`，列出当前服务器支持哪些HTTP方法（几乎没有人用这个HTTP方法，不过可以利用这个方法做自文档的Restful服务的查询方法，[参考这里](http://zacstewart.com/2012/04/14/http-options-method.html)）。
2. `GET`，最常用的HTTP方法之一，从服务器获取URI指定的资源。资源会放到响应体里面返回。`GET`方法获取数据应该是有缓存机制的，通过`If-Modified-Since`等HTTP头可以声明当前这个URI对应的信息是否发生变化，如果没有变化则可以使用之前的缓存信息，这样可以减少不必要的网络数据传输。当请求含有`Range`头的时候，这次`GET`请求所返回的信息是部分的，当分块下载的时候会用到。**注意，`GET`请求的参数都是作为查询串放到URL后面，所以当请求参数含有敏感数据的时候千万不要用`GET`。**
3. `HEAD`，与`GET`类似，只是返回的响应体的内容是空的，只包含响应头。这个方法常用作校验有效性、校验权限以及查看信息是否被修改。
4. `POST`，往URI指定的路径新增一个资源。`POST`的参数是放在请求体里面的，一般这个参数就是声明了一个新的资源，例如文件夹里面的一个新文件、邮件列表里面的一个新邮箱或者数据表中的一条新的记录。与我们日常使用的场景不同，如果服务器没有增加新的资源，或者这个请求体是空的，应该返回状态码200或者204；如果服务器正确增加了一个新的资源，应该返回一个201表示资源已经被创建。而我们日常一般就是用200表示服务器已经正确处理请求而已。一般`POST`是不会缓存的，除非设置了`Cache-Control`或者`Expires`头。
5. `PUT`，分两种情况。如果URI指定的资源不存在，则当`POST`处理，往服务器新增一个指定的资源；如果存在，则修改现有的资源，修改成功返回状态码200或者204，修改失败则按照失败的具体原因返回5XX等状态码。
6. `DELETE`，删除URI指定的资源。
7. `TRACE`，对可能经过代理服务器传送到服务器上去的报文进行追踪。
8. `CONNECT`，一个保留的方法，指定代理改变发送请求时使用的协议，例如从HTTP到HTTPS。

下面使用`jQuery.ajax`方法来看看真实场景下HTTP方法是如何运用的。例子[参考这里](http://jsfiddle.net/4Y8t2/2/show/)。

例子非常简单，就是使用不同的HTTP方法往服务器发送HTTP请求。可以看到`GET`和`HEAD`的参数是放到查询串（search）上面的。其他方法一律是放到请求体里面。这个例子里面的`POST`、`PUT`和`DELETE`都被服务器拒绝了，返回状态码403（Forbidden）。

有趣的是，同样一段代码，在IE9上面返回的结果跟Chrome上不一样。主要表现在`TRACE`和`CONNECT`上。IE9上的`TRACE`输出“参数无效”，`CONNECT`是403；而Chrome则都是输出一个“DOM Exception 18”，这个往后可以研究一下`jQuery.ajax`的具体实现才能看出什么端倪来。
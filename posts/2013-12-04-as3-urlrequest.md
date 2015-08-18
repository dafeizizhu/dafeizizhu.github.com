---
layout: post
title: "在Flash中发送请求之一：URLRequest"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

无论在哪个前端开发的环境中，向后台发送请求获取数据、修改数据都是必须的。在AS3中，可以使用`URLRequest`配合`URLLoader`来发送请求。今天先简单看看`URLRequest`怎么用。

`URLRequest`像一个包含这次请求的配置、内容等信息的一个类。类似浏览器中的Ajax，这个类的对象包含一些跟HTTP请求有关的参数，例如头、发送的数据、HTTP方法以及请求的URL等。具体有以下几个属性：

1. `contentType`，`data`的MIME类型，默认跟表单一样`application/x-www-form-urlencoded`。
2. `data`，跟随请求一起发送到服务端的数据。
3. `followRedirects`，是否遵循重定向。
4. `method`，HTTP方法。
5. `requestHeaders`，请求头，是一个包含`URLRequestHeader`实例的数组。
6. `url`，请求的URL。
7. `userAgent`，标识用户代理的字符串，类似于浏览器的`window.navigator.usrAgent`。

大部分参数都是字符串。`data`是一个对象，默认会按照表单形式进行编码：

    key1=value1&key2=value2

其中`URLRequestHeader`的实例其实就是一个键值对：

    var urlRequestHeader:URLRequestHeader = 
      new URLRequestHeader("Content-Type", "text/html");

然后这么加到`URLRequest`中：

    urlRequest.requestHeaders.push(urlRequestHeader);

由于这个类的作用是用于存储请求的具体信息，所以在方法上面比较简单。除了构造方法之外只有一个方法。构造方法可以传入一个可选的`url`参数，如果传入这个参数则在实例化之后`url`属性会自动设置为参数的值：

    var urlRequest:URLRequest = new URLRequest("my/url");
    trace(urlRequest.url); // "my/url"

另外一个方法就是`useRedirectedURL`方法，允许用源`URLRequest`中的重定向URL替换新`URLRequest`中的某部分URL，用于在重定向的情况下，允许对URL进行操作，然后再一次发送该请求。

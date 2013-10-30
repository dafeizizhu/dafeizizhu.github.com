---
layout: post
title: "document.cookie"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

什么是cookie？

> cookie 是存储于访问者的计算机中的变量。每当同一台计算机通过浏览器请求某个页面时，就会发送这个 cookie。你可以使用 JavaScript 来创建和取回 cookie 的值。

对应的JavaScript API就是`document.cookie`。这是一个非常奇怪的属性，我们可以通过访问这个属性得到当前页面的所有cookie：

    allCookies = document.cookie;

返回的字符串是一系列的键值对，用`;`隔开，键值用`=`连接：

    key1=value1;key2=value2

我们需要使用一个正则表达式去把这个字符串转成JavaScript对象（摘自[arale/cookie](https://github.com/aralejs/cookie/blob/master/src/cookie.js)）：

    var cookieParts = document.cookie.split(/;\s/g);
    for (var i = 0, len = cookieParts.length; i < len; i++) {
      var cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
      if (cookieNameValue) {
        var cookieName = decodeURIComponent(cookieNameValue[1]);
		var cookieValue = decodeURIComponent(cookieParts[i]
          .substring(cookieNameValue[1].length + 1));
        result[cookieName] = cookieValue;
      }
    }

设置的话我们可以直接设置一个新的键值对，浏览器会自动判断是增加还是更新一个cookie的值：

    document.cookie = "key1=value1"; // insert
    document.cookie = "key1=value2"; // update

在设置cookie的时候可以在字符串后附加一些信息，例如：

1. `;path=path`，声明这个cookie的路径，默认是当前页面的路径。
2. `;domain=domain`，声明这个cookie适用的域，默认是当前页面的域（`window.location.host`）。
3. `;max-age=max-age-in-seconds`，声明cookie的最长有效时间。
4. `;expires=date-in-GMTString-format`，声明cookie的过期时间，默认是在这个session失效之后失效，例如`;expires=Mon, 03 Jul 2006 21:44:38 GMT`。
5. `secure`，声明这个cookie只有在安全的通道（例如`https`）才会被传输。

由于cookie是使用以上的格式存储在一个字符串中，所以当cookie的值包含了`;`或者`=`的时候可能会扰乱整个解码过程，所以在设置的时候最好调用`encodeURIComponent`进行URL编码：

    document.cookie = encodeURIComponent(key) + "=" + 
      encodeURIComponent(value);

最后要注意的是：

1. 现在有比cookie更好的客户端存储方案（`LocalStorage`等），如果这些信息不需要与服务端交互请尽量使用新的存储方案。
2. 如果要删除一个cookie可以简单把过期时间设置为`0`。
3. 由于cookie会随着请求发送到服务器，请时刻留意cookie的大小以免请求过大。

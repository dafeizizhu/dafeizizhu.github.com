---
layout: post
title: "XMLHttpRequest对象"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

XMLHttpRequest最初是微软设计的，现在已经是W3C的标准了。使用XMLHttpRequest，我们可以不需要重新刷新页面，又可以获得服务端的数据。这样，我们就可以只更新页面的某一个部分，而不影响其他的部分。基本上所有Ajax的应用都在使用XMLHttpRequest（除了老式的某些应用使用`iframe`）。

尽管名字含有XML，使用XMLHttpRequest可以获取任何类型的数据，不仅是XML。它也不仅仅支持HTTP协议，例如`file`、`ftp`等它也支持。

###构造
____

可以通过以下这行代码实例化一个XMLHttpRequest对象（IE6除外）：

    var myRequest = new XMLHttpRequest();

###实例方法
____

1. `abort()`，手动终止一个已经发出去的请求。
2. `getAllResponseHeaders()`，返回包含所有相应头信息的字符串。
3. `getResponseHeader(header)`，返回`header`指定名称的相应头信息的字符串。
4. `open(method, url, async, user, password)`，初始化一个请求。**注意，如果重复调用`open`则第二次调用视为是调用了`abort`，会中止已经发出的请求。例子可以[参考这里](http://jsfiddle.net/C6RNA/)。**
5. `overrideMimeType(mimeType)`，使用`mimeType`指定的MIME类型覆盖服务端返回的MIME类型。
6. `send(data)`，发送该请求。如果请求是异步的，调用这个方法后会立刻返回；否则会一直阻塞直到请求返回。其中`data`是可选的，可以是各种类型的数据，例如二进制数据、XML文档、字符串或者是表单数据等。**注意，所有事件监听器都必须在调用`send`之前绑定好，不然就没法触发了。**
7. `setRequestHeader(header, value)`，设置请求头，其中`header`为请求头的名字，`value`为对应请求头的值。

###实例属性
____

1. `onreadystatechange`，当请求的状态发生变化的时候会触发`readystatechange`事件，当事件触发的时候会调用这个方法。**注意，当请求是同步的时候不要使用这个事件回调机制。**
2. `readyState`，这个请求当前的状态：
    1. `0`，表示`UNSENT`，即还没有调用`open`。
	2. `1`, 表示`OPENED`，即调用了`open`但是还没调用`send`。
	3. `2`，表示`HEADERS_RECEIVED`，即调用了`send`，而且相应头已经返回。
	4. `3`，表示`LOADING`，正在下载`responseText`。
	5. `4`, 表示`DONE`，即这个请求已经完成。
3. `response`，请求返回的内容，根据`responseType`来决定是什么数据类型，例如XML文档或者json对象等。当请求没有完成或者请求失败的时候这个属性的值是`null`。
4. `responseText`，请求返回内容的字符串表达形式，这个属性是只读的。当请求没有完成或者请求失败的时候这个属性是`null`。
5. `responseType`，请求返回的数据类型，默认是字符串。可以更改它的值去改变返回的数据类型。
6. `responseXML`，请求返回内容的XML表达形式。这个属性是只读的。当请求没有完成或者请求失败或者请求返回的内容不能转成一个XML或者HTML文档，这个属性的值是`null`。
7. `status`，这个请求返回的HTTP状态码，例如成功返回的`200`等。这个属性是只读的。
8. `statusText`，服务端返回的状态字符串，除了状态码之外还能包含一些别的信息，例如一些自定义的错误提示信息等。这个属性是只读的。
9. `timeout`，超时时间，当超过这个超时时间请求还没有返回，则自动中止。默认是`0`，表示没有超时时间。

###事件
____

`onreadystatechange`是所有浏览器都支持的事件。通过监听这个事件我们可以针对（异步）请求的每个阶段作不同的处理。

还有一些不是所有浏览器都都支持的事件，例如`onload`、`onerror`、`onprocess`等。使用它们的时候要留意要支持的浏览器列表中有没有不支持这些事件的浏览器哦。

---
layout: post
title: "jQuery扫盲之ajaxSetup和ajaxTransport"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

Ajax系列的最后一篇文档翻译。今天讨论的是Ajax的全局配置`jQuery.ajaxSetup`和配置真正传输对象`jQuery.ajaxTransport`。

###jQuery.ajaxSetup
____

> Set default values for future Ajax requests. Its use is not recommended.

这个方法十分简单，就是配置Ajax默认的参数。这个方法接受一个参数，跟`jQuery.ajax`的配置参数一模一样。调用`jQuery.ajax`的时候，会合并传入的参数和默认的参数，传入的参数优先级较高。其他所有的快捷方式，例如`jQuery.get`，都会使用这些默认的参数。

jQuery文档强烈建议我们不要使用这个方法配置默认参数，以防发生难以预料的错误，例如改变了一个快捷方式的默认行为。

###jQuery.ajaxTransport
____

> Creates an object that handles the actual transmission of Ajax data.

这个方法比较有趣，可以更改Ajax数据真正的传输方式。我们知道，默认的Ajax是使用XMLHttpRequest去把数据发送到服务器。jQuery提供了这个方法，供我们改变数据传输的方式。

这个方法接受两个参数：

1. `dataType`，声明该传输对象只对特定的数据类型生效。
2. `handler`，一个回调函数，接受三个参数，与`jQuery.ajaxPrefilter`一致。该回调函数返回的对象就是作为数据的传输对象。

回调函数返回的传输对象有两个方法：

1. `send`，发送数据的方法，接受两个参数，第一个是HTTP头信息，第二个是请求完成后的回调函数。
2. `abort`，取消请求的方法，不接受任何参数。

`jQuery.ajaxTransport`应该是我们可以操作的最底层的方法了，建议在`jQuery.ajaxPrefilter`和`ajaxSetting.converters`都没办法实现的功能时才使用这个最强大的方法。

其中`send`的第二个参数，请求完成后的回调函数需要传入以下几个参数：

1. `status`，HTTP状态码。
2. `statusText`，HTTP状态的文字描述。
3. `response`，返回的数据，是一个对象，其中的键是数据类型，例如`xml`、`text`等，值就是对应类型的数据。
4. `headers`，经过处理后的HTML头信息。

通过这个方法，我们可以改变发送数据的方式，不仅仅是使用XMLHttpRequest，甚至可以使用`img`标签、`script`标签、`link`标签和`iframe`来发送数据到服务端。jQuery文档上有个例子就是使用`img`标签去发送数据的，有兴趣的小伙伴可以去参考一下，我自己写了一个简单的DEMO，使用`setTimeout`模拟发送请求的过程，例子[参考这里](http://jsfiddle.net/vx528/1/)。

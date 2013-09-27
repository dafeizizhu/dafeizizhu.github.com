---
layout: post
title: "jQuery扫盲之Ajax常用方法"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

由于`jQuery.ajax`参数配置太多，日常应该也用不到所有参数配置，所以jQuery声明了一些比较符合日常使用场景的方法，例如`jQuery.get`和`jQuery.post`等，让我们方便地发送Ajax请求。

###jQuery.get
____

> Load data from the server using a HTTP GET request.

这个方法封装了使用GET方法发送Ajax请求，接受四个参数：

1. `url`，发送请求的URL。
2. `data`，可选，发送的数据。由于使用的是GET方法，所以数据默认是使用`jQuery.params`序列化之后的字符串。
3. `success`，可选，请求成功后的回调，跟`ajaxSetting`的一致。
4. `dataType`，可选，指定返回数据的数据类型。

由于没有设置`ajaxSetting.error`，请求失败的时候只能通过Promise接口或者`jQuery.document.ajaxError`来处理错误。

这个方法等同于：

    $.ajax({
      url: url,
      data: data,
      success: success,
      dataType: dataType
    });

###jQuery.getJSON
____

> Load JSON-encoded data from the server using a GET HTTP request.

这个方法跟`jQuery.get`类似，只是返回的数据类型被固定为`json`而已。所以只接受前三个参数，`dataType`固定为`json`。

这个方法等同于：

    $.ajax({
      dataType: "json",
      url: url,
      data: data,
      success: success
    });

###jQuery.getScript
____

> Load a JavaScript file from the server using a GET HTTP request, then execute it.

这个方法使用GET方法加载一个JavaScript脚本，并执行。只接受两个参数：

1. `url`，要加载的脚本URL。
2. `success`，可选，加载成功后调用的回调。回调接受三个参数：
    1. `script`，执行脚本后的返回值。
	2. `textStatus`，请求状态的字符串值。
	3. `jqXHR`，请求的jqXHR对象。

这个方法加载的脚本是在全局作用域中（`window`）中执行的，要注意加载的脚本的可靠性，防止各种变量名冲突或者逻辑冲突等问题。

这个方法等同于：

    $.ajax({
      url: url,
      dataType: "script",
      success: success
    });

###jQuery.post
____

> Load data from the server using a HTTP POST request.

与`jQuery.get`几乎一样，只有两个不同点：

1. `jQuery.post`使用POST方法发送请求。
2. `jQuery.post`中的数据是放在请求体里面，而不是放到URL查询串中。

这个方法等同于：

    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: success,
      dataType: dataType
    });

###jQuery.fn.load
____

> Load data from the server and place the returned HTML into the matched element.

这个是jQuery对象的实例方法。加载数据完成后，使用返回的HTML字符串去替换jQuery对象原来的innerHTML。这个方法接受三个参数：

1. `url`，发送请求 的URL。
2. `data`，可选，发送的数据。
3. `complete`，可选，请求完成时的回调函数。回调接受三个参数：
    1. `responseText`，请求返回的字符串。
	2. `textStatus`，请求状态字符串。
	3. `XMLHttpRequest`，请求的xhr对象。

注意哦，如果jQuery对象的`length`为0，即找不到该选择器对应的对象，这个请求是不会发送的。

`complete`在返回的HTML字符串被替换后才触发。会触发jQuery对象的`length`这么多次。

如果`data`是一个对象，则会使用POST发送请求，否则使用GET发送请求。

我们还可以在`url`后面带上一个jQuery选择器，则只替换返回HTML字符串中选择器选中的DOM对象。例如：

    $( "#result" ).load( "ajax/test.html #container" );

但是，加上选择器之后，返回的HTML中的`script`就不会被执行了哦！

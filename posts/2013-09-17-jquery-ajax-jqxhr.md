---
layout: post
title: "jQuery扫盲之jqXHR对象"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

当执行`jQuery.ajax`的时候会返回一个jQuery封装的XMLHttpRequest对象，简称jqXHR对象。该对象是原生的XMLHttpRequest对象扩展，不仅含有所有原生对象中的属性和方法，jQuery还加入了一些新的属性，例如promise模式的`done`、`fail`等方法。还有，jQuery为jsonp等方式获取的脚本模拟了XMLHttpRequest对象，使得所有Ajax的行为趋于一致。

从1.5之后，jQuery在jqXHR中提供了Promise接口。接口中的方法接受一个或者多个回调函数，当Ajax请求终止的时候会根据请求的状态，例如成功或者失败等，调用不同的回调函数。接口中的方法有：

1. `jqXHR.done`，跟`ajaxSetting`中的`success`类似，在Ajax请求成功时调用作为参数的回调函数。
2. `jqXHR.fail`，跟`ajaxSetting`中的`error`类似，在Ajax请求失败时调用作为参数的回调函数。
3. `jqXHR.always`，跟`ajaxSetting`中的`complete`类似，无论请求成功或者失败都调用作为参数的回调函数。
4. `jqXHR.then`，接受两个参数，第一个是成功时的回调函数，同`done`中的参数；第二个是失败时的回调函数，同`fail`中的参数。

回调函数中的`this`指向的都是调用`jQuery.ajax`时，指定的`context`。如果没有指定`context`，则为这次调用的`ajaxSetting`对象。

由于需要兼容原生的XMLHttpRequest，jqXHR对象中还有很多XMLHttpRequest上的属性，例如`readyState`、`status`、`responseText`等。唯一不同的是`onreadystatechange`机制不再提供，需要使用`jqXHR.done`等Promise接口去处理对应的逻辑。

包含`jQuery.ajax`的配置还有这几个Promise接口，jQuery允许我们在各种不同的阶段”勾入“我们的代码，这些钩子按以下的顺序执行：

1. `ajaxSetting.beforeSend`。
2. `ajaxSetting.error`。
3. `ajaxSetting.dafaFilter`。
4. `ajaxSetting.success`。
5. `jqXHR.done`等Promise接口。
6. `ajaxSetting.complete`。

写到最后，才发现原来原生的XMLHttpRequest有什么属性和方法都不太了解呢。明天先补这一块再继续翻译jQuery的文档吧。

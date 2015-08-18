---
layout: post
title: "jQuery扫盲之全局Ajax事件"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

当今天没啥东西写的时候，会强迫自己看看一些常用的，但是又不完全了解的东西，例如各种文档、各种API参考等。扫盲系列其实就是去读这些API的文档，去发掘一些我们不知道的用法和要注意的事情。

今天讨论的是jQuery中有关Ajax的全局事件，这些事件有时候可以使我们的代码更加简洁，表现更加一致。

当`jQuery.ajaxSetup()`返回的`global`属性是`true`的时候（这个也是默认值），全局的Ajax事件才能生效。还有，调用`jQuery.ajax`的时候如果选项中的`global`为`false`，这次请求也不会触发全局的Ajax事件。注意，**跨域的Ajax或者是jsonp是无论如何都不会触发这些全局的Ajax事件的**。

强烈建议在`document`上绑定这些事件（在jQuery 1.8往后的版本只能绑定在`document`上了）。这些全局Ajax事件的绑定方法都只接受一个参数，就是要绑定的事件处理程序。

###ajaxComplete

处理程序接受三个参数，事件对象、XMLHttpRequest对象、调用这次Ajax的`ajaxOptions`。每一个Ajax请求完成（无论成功或者失败）时，都会调用所有事件处理程序。

###ajaxError

处理程序接受四个参数，事件对象、jQuery封装的XHR对象、调用这次Ajax的`ajaxOptions`、还有抛出的错误，例如服务器错误（5xx）、路径错误（4xx）或者是当数据类型是`json`或者其他特定类型时解析错误（json语法错误）等。错误以字符串的形式返回，例如`Not found`、`Internal Server Error`等。每一次Ajax请求以失败告终的时候，都会调用所有事件处理程序。

###ajaxSend

处理程序接受三个参数，与`ajaxError`的前三个参数一致。每一次发出一个Ajax请求时，都会嗲用所有事件处理程序。

###ajaxStart

处理程序不接受任何参数。当一个Ajax请求发出之前，jQuery会检测是否正在有其他Ajax请求已经发出。如果没有，则认为这个请求是当前第一个发出的Ajax请求，`ajaxStart`会被触发。触发时会调用所有事件处理程序。

###ajaxStop

处理程序不接受任何参数。当一个Ajax请求完成之后，jQuery会检测是否还有其他Ajax请求还没完成。如果没有，则认为这个请求是当前完成的最后一个Ajax请求，`ajaxStop`会被触发。触发时会调用所有事件处理程序。

###ajaxSuccess

处理程序接受三个参数，与`ajaxComplete`一致。当请求正确返回（2xx或者304）时，会调用所有事件处理程序。

###执行顺序

经过上面的解释，其实已经可以得出这几个事件的执行顺序了。先是`ajaxStart`，然后是`ajaxSend`，请求返回后根据返回正确与否触发`ajaxSuccess`或者是`ajaxError`，然后是`ajaxComplete`，最后是`ajaxStop`。我写了一个例子，可以[参考这里](http://jsfiddle.net/MCacd/)。

例子的执行跟文档有一点出入，就是事件处理程序的接受的参数不同（jQuery是2.x的最高版本）：

1. `ajaxStart`和`ajaxStop`的事件处理程序接受一个参数，就是jQuery封装的事件对象。
2. `ajaxSuccess`和`ajaxComplete`的事件处理程序接受的第二个参数也是jQuery封装过的jqXHR对象，而不是原生的XMLHttpRequest对象。
3. `ajaxSuccess`的事件处理程序还接受第四个对象，就是返回的数据转化后的对象，例如`json`、`xml`等有格式的数据。

根据官网上的文档去使用这些API不会有太大的问题，不过不知道在哪里可以看到jQuery最新版本的文档呢？

---
layout: post
title: "HTML Form的enctype"
description: ""
category: 
tags: [html]
---
{% include JB/setup %}

表单的这个特性用来声明这个表单的内容类型。当我们没有显式声明这个特性的值的时候，使用的是其默认值`application/x-www-form-urlencoded`，对表单中的每个控件的值进行URL编码，提交编码之后的字符串。

这种编码方式满足大部分的场景，但是当我们需要传输一些非文本数据（例如文件、二进制数据等），这种方式是低效的。这时候我们需要把表单的`enctype`特性设置成`multipart/form-data`。

设置成这个值之后提交的表单，请求头的`Content-Type`会变成`multipart/form-data`。还需要跟上一个字符串，这个字符串不能存在于每个部分当中。这样表单接收方就可以根据这个字符串正确地分割请求体。分割后的每一个部分对应表单中的一个“控件”，里面包含了这个部分的名字和值。

每一个部分由以下几个部分组成：

1. `Content-Disposition`，固定为`form-data`。
2. `name`，声明这个部分“控件”的名称，例如一般表单提交的时候就是表单控件对应的`name`特性的值。

例如：

    Content-Disposition: form-data; name="mycontrol"

然后一个回车换行之后就是这个部分对应的值。默认的`Content-Type`是`text/plain`，即是一个文本。当这个部分是一个文件或者二进制数据，需要显式声明这个部分的`Content-Type`，例如：

    Content-Disposition: file; filename="file2.gif"
    Content-Type: image/gif

这种部分还需要一个额外的头信息，`filename`，声明这个文件或者二进制块的名称，方便表单接收方获取文件的原来的名字。

当表单中的上传文件控件可以上传多个文件（`multiple`）的时候，这个控件的部分的`Content-Type`则会声明成`multipart/mixed`，再跟上一个边界字符串，以分割这个部分里面的每一个文件：

    --AaB03x
    Content-Disposition: form-data; name="files"
    Content-Type: multipart/mixed; boundary=BbC04y

    --BbC04y
    Content-Disposition: file; filename="file1.txt"
    Content-Type: text/plain

    ... contents of file1.txt ...
    --BbC04y
    Content-Disposition: file; filename="file2.gif"
    Content-Type: image/gif
    Content-Transfer-Encoding: binary

    ...contents of file2.gif...
    --BbC04y--
    --AaB03x--

如果我们是使用HTML表单的提交，那这些编码的工作浏览器其实已经做好了，我们只需要把表单设置好就可以了。但是，现在很多上传的控件都是不需要刷新页面的，类似于Ajax的效果。这时候，有没有可能我们自己构筑这个请求的请求体，然后通过Ajax提交出去呢？明天将继续介绍HTML5的File API，还有`multipart/form-data`的Ajax提交利器`FormData`。

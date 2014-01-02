---
layout: post
title: "HTML5的File API"
description: ""
category: 
tags: [html5]
---
{% include JB/setup %}

如果我们要上传文件，以前只能使用表单的`file`控件进行上传，而且只能把这个表单POST出去。这时候我们如果需要做类似分块上传的功能，特别是上传大文件，例如视频等，只能通过Flash或者浏览器插件来做这些分块上传的功能。

现在HTML5提供了一套文件API，使用这套API配合`FormData`就可以实现文件分块、Ajax上传二进制数据等功能。今天先来介绍File API。

File API提供了一个接口供我们访问文件信息和文件的二进制内容。可以通过表单上的`file`控件的`files`属性获取`File`对象：

    var file = $("#upload_file").files[0];

`File`实现了`Blob`这个接口，所以它能处理二进制数据。`File`对象有以下几个属性，全部都是只读的：

1. `lastModifiedDate`，表示这个文件的修改日期。
2. `name`，表示这个文件的文件名。

还有两个`Blob`接口的属性：

1. `size`，表示这个文件的大小。
2. `type`，表示这个文件的MIME类型。

使用`Blob`接口的`slice`方法可以处理文件的内容：

    blob = file.slice(startPos, endPos);

以上的例子可以获取文件中某个范围的二进制数据，达到文件分块的功能。在不同的浏览器中`slice`可能会有别名：

    if (file.webkitSlice) {
      blob = file.webkitSlice(startPos, endPos);
    } else if (file.mozSlice) {
      blob = file.mozSlice(startPos, endPos);
    } else {
      blob = file.slice(startPos, endPos);
    }

获取到文件内容的二进制数据之后，就可以配合`FormData`发送`Content-Type`为`multipart/form-data`的表单数据了，而且还可以使用`XMLHttpRequest`来发送哦！这样以前只能用Flash或者浏览器插件的无刷新文件上传的功能HTML5也能做了哦！

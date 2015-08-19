---
layout: post
title: "使用FormData"
description: ""
category: 
tags: [html5]
---
{% include JB/setup %}

`XMLHttpRequest` Level 2增加了`FormData`这个接口，我们可以通过这个接口构造键值对，代表表单中的表单域，使用`XMLHttpRequest`就可以像Ajax一样提交表单。这与使用Ajax Post不同的是，`FormData`还可以提交文件！

使用`FormData`的Ajax请求，其`Content-Type`会变成`multipart/form-data`。`FormData`的构造函数接受一个可选的参数，可以传入一个表单的DOM：

    var formData = new FormData(document.forms[0]);

会根据表单的内容生成一个`FormData`对象，而且里面的键和值都经过编码了。如果不传入这个参数则会生成一个空的`FormData`对象。

`FormData`提供了`append`方法，供我们往这个对象里面添加键值对。这个方法接受三个参数：

1. `name`，对应于表单控件的`name`特性，表示这个键值对的名称。
2. `value`，对应于表单控件的`value`，表示这个键值对的值。
3. `filename`，可选，当传入的`value`为一个`Blob`的时候，表示文件本来的名称。

例如，调用`formData.append("name1", "value1")`会在请求体里面生成类似以下的内容：

    --ABCDEFG
    Content-Disposition: form-data; name="name1"
	value1
    --ABCDEFG

边界字符串是由浏览器生成的一个随机的字符串。使用`FormData`，我们可以方便地构造出`multipart/form-data`需要的请求体，还可以通过`XMLHttpRequest`来提交。jQuery也支持`FormData`：

    var formData = new FormData();
    formData.append("name1", "value1");
    formData.append("name2", "value2");
    $.ajax({
      url: "path/to/server",
      data: formdata,
    }).done(...);

最后还是那句，IE10才支持`FormData`！

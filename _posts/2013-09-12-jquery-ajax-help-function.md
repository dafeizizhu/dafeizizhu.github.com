---
layout: post
title: "jQuery扫盲之Ajax工具函数"
description: ""
category: 
tags: [jQuery, JavaScript]
---
{% include JB/setup %}

jQuery为了方便用户使用Ajax，提供了几个工具函数，提供一些有关参数传递与序列化的功能。

###jQuery.param
____

> Create a serialized representation of an array or object, suitable for use in a URL query string or Ajax request.

这个方法可以提供数组或者对象的一个序列化之后的字符串，可以用作URL上的`query`，也可以作为Ajax的`data`传递。该方法接受两个参数：

1. `obj`，需要序列化的数组或者对象。
2. `traditional`，可选的标志位，是否使用“浅层次”的序列化。默认是`false`，会递归地序列化对象的属性或者数组的元素。

返回一个这个数组或者对象的一个序列化之后的字符串。

在jQuery 1.4及之前的版本，可以通过`jQuery.ajaxSetting.traditional = true`去设置全局的Ajax都使用浅层次的序列化。

在jQuery 1.8及之后的版本，这个设置对`jQuery.param`已经没有效果了。这时候要使用浅层次的序列化只能通过调用`jQuery.param`的时候传入第二个参数`true`来显式声明这次序列化是使用浅层次的序列化。

注意，如果传入的是数组，里面的元素需要是以下这种格式的才可以（是调用`jQuery.fn.serializeArray`返回的数组元素的格式）：

    [{name:"first",value:"Rick"},
     {name:"last",value:"Astley"},
     {name:"job",value:"Rock Star"}]

返回的字符串中，每一项的键和值都经过HTML编码了，省去了一大部分编码的工作量。

由于`jQuery.param`是按照特定的格式去序列化，不一定能满足所有使用场景。当序列化的对象或者数组的数据结构比价复杂（例如嵌套层级比较深），这种情况下不适宜使用这个方法进行序列化。

###jQuery.fn.serialize
____

> Encode a set of form elements as a string for submission.

当jQuery对象里面选择了表单元素（`input`、`textarea`、`select`等），或者是表单，可以调用`jQuery.fn.serialize`去序列化表单元素的值或者整个表单的数据。

最佳实践，选择`form`去序列化，而不是选择`form`里面的表单元素进行序列化。

注意哦，表单元素要有`name`特性且`disable`为`false`才能被序列化。而`type="file"`的表单元素中的数据不会被序列化。如果表单提交的时候不是通过`type=submit`的按钮触发，则这个按钮也不会被序列化。

###jQuery.fn.serializeArray
____

> Encode a set of form elements as an array of names and values.

提取表单元素的键和值，返回一个包含表单数据的数组。表单元素是否被提取的规则跟`jQuery.fn.serialize`的规则是一样的。简单地说，`jQuery.fn.serialize`就是：

1. 调用`jQuery.fn.serializeArray`把表单提取成一个数组。
2. 把数组传递到`jQuery.param`里面返回一个序列化后的对象。

###总结
____

虽然这个方法能减少前端对表单数据的编码工作，但是在使用的时候一定要注意跟后台的接口要求的数据格式要能对得上（根据经验，很难很难……—），所以一定要多加小心地使用哦亲！

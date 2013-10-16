---
layout: post
title: "jQuery扫盲之attr"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

`jQuery.fn.attr`是一个根据传入参数的个数判断是setter还是getter的一个方法。

###getter
____

> Get the value of an attribute for the first element in the set of matched elements.

作为getter的`attr`方法只接受一个参数：`attrName`，指定需要获取的特性的名字。如果该jQuery对象包含多个元素，则只会返回第一个元素的特性值。如果需要获取所有元素的值，需要遍历这个jQuery对象，再逐个调用`attr`方法。

调用这个方法获取特性值有两个好处：

1. 方便，直接通过jQuery对象就可以调用。
2. 跨浏览器兼容。有一些特性在不同的浏览器中表现是不一致的，`attr`方法封装了这些不一致，提供统一的API以及结果。

有两个值得注意的地方：

1. 返回的值一般都是字符串，而一些`value`和`tabindex`除外。
2. 修改一个已经存在在文档中的`input`的`type`特性，在IE6、7、8会抛出异常。

如果指定的特性不存在，则`attr`返回`undefined`。诸如`checked`、`disabled`或者`selected`等特性，最好使用`prop`来获取。再介绍完`prop`之后会为两者进行一个对比。

###setter
____

> Set one or more attributes for the set of matched elements.

作为setter的`attr`方法有几种传输参数的形式：

1. `attributeName`和`value`，为指定的特性名称设置指定的值。
2. `attributes`，是一个键值对，键为特性名称，值为特性的值。
3. `attributeName`和`function(index, attr)`，第二个参数是一个回调函数，接收当前元素在jQuery对象中的索引和当前的特性值，该函数的返回值将作为特性的新值。如果没有返回值（或者返回`undefined`），特性值将不会发生任何改变。

与getter不同，它会设置jQuery对象中所有元素的特性值。如果指定的特性名称不存在，jQuery会在这个元素上增加这个特性。

###removeAttr
____

> Remove an attribute from each element in the set of matched elements.

这个方法可以删除指定的特性。这个方法只接受一个参数`attributeName`，就是要删除的特性的名字。其内部实现是使用JavaScript内建的`removeAttribute`。

其中有一个坑，就是在IE6、7、8中使用`removeAttr`去删除指定在DOM中的事件处理程序（例如`onclick`等）是没有效果的，要使用`prop`：

    $element.prop( "onclick", null );

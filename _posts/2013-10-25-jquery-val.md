---
layout: post
title: "jQuery扫盲之val"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

jQuery提供了一个简便的方法让我们去获取DOM的`value`特性，就是`jQuery.fn.val`方法。跟`attr`和`prop`一样，它也是一个`getter`和`setter`一体的方法。

###getter

> Get the current value of the first element in the set of matched elements.

跟`attr`和`prop`也一样的是，作为`getter`的`val`方法不接受任何参数，只会获取jQuery对象中地一个元素的`value`的值：

    $(elem).val();

通常我们会在`input`、`select`或者`textarea`元素上使用`val`方法。当`select`的`multiple`特性声明为有效的时候，`val`会返回一个数组，包含了选中的`option`的`value`；如果没有选中任何`option`，则会返回`null`。

如果目标对象不是以上的元素（例如`div`、`a`等），`val`方法会返回一个空字符串。其实就是返回DOM上的`value`属性，而不是`value`特性：

<iframe width="100%" height="300" src="http://jsfiddle.net/Hrv6u/embedded/js,html/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

###setter

> Set the value of each element in the set of matched elements.

跟`attr`和`prop`也十分类似，有两种传输参数的方式：

1. `value`，传入要设置的`value`的值。
2. `function(index, value)`，一个回调函数，会把该函数的返回值设置到`value`里面。回调函数接受元素在jQuery对象的索引和元素原来的`value`值作为参数。

这个方法通常用来设置表单元素中的`value`值。我们还可以传入一个数组，让`checkbox`、`radio`（只会选中最后一个……）和多选模式下的`select`选中多个元素：

<iframe width="100%" height="300" src="http://jsfiddle.net/b9mkA/embedded/html,js,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

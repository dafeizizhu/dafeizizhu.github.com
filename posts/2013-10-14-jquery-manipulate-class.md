---
layout: post
title: "jQuery扫盲之处理class"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

这个class当然是指HTML上面的class了！今天看一些jQuery有关操作DOM的class的一些方法，就是增删改查它们！

###jQuery.fn.addClass
____

> Adds the specified class(es) to each of the set of matched elements.

为DOM加上特定的class，该方法接受一个参数，但是可以传入两种不同的参数：

1. `className`，要增加的class的名字，可以是多个，用空格分开。
2. `function(index, currentClass)`，一个回调函数，返回一个字符串，增加字符串指定的class。回调函数接受的参数，`index`是当前jQuery对象的索引，而`currentClass`则为当前的class，也可以有多个，用空格隔开。

不用担心重复，jQuery已经做了这些工作，所以重复增加相同的class是没有问题的。

###jQuery.fn.removeClass
____

> remove a single class, multiple classes, or all classes from each element in the set of matched elements.

这个方法接受的参数跟`addClass`一模一样。有一个要注意的是，如果什么都不传入，则会把元素上的所有class都删掉，如：

    $(elem).removeClass(); // remove all class

如果需要替换class，jQuery建议直接使用`jQuery.fn.attr`方法：

    $(elem).attr( "class", "newClass" );

###jQuery.fn.hasClass
____

> Determine whether any of the matched elements are assigned the given class.

判断给定的class是否存在，接受一个参数，就是给定的class的名字，也可以是多个用空格隔开。只要存在这个class，则会返回`true`，无论是否有其他的class。

###jQuery.fn.toggleClass
____

> Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.

这个是最有趣的方法了，它会判断该元素是否有给定的class而决定是增加还是删除这些class。这个方法有四种传输参数的形式：

1. `className`，一个或者多个class的名字。
2. `className`和`switch`，其中`switch`表示这次操作是要增加还是删除class。注意，这个值要是布尔值而不仅仅是表示`true`或者`false`的值。
3. `switch`，可选的，即可以不传任何参数调用`toggleClass`。只传入一个`switch`表示要toggle所有的class。
4. `function(index, class, switch)`和`switch`，第一个参数是一个回调函数，返回需要toggle的class的名字。

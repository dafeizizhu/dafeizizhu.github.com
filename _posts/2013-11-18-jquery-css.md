---
layout: post
title: "jQuery扫盲之css"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

这个也是我们日常使用频率比较高的jQuery方法了。这个方法跟`attr`类似，也是`geter`和`setter`一体的方法。

###getter

> Get the value of style properties for the first element in the set of matched elements.

如果只传入一个参数（不是对象），则视为是`getter`调用。只会获取jQuery对象中第一个元素的CSS属性值。有两种传参的形式：

1. `propertyName`，表示要获取CSS属性名称的字符串。
2. `propertyNames`，表示获取多个CSS属性名称的一个数组。

`css`方法是一个十分方便的方法，它封装了不同浏览器对于获取元素当前样式所提供的API，例如IE的`elem.currentStyle`和标准的`getComputedStyle`等。它还统一了不同浏览器对于某些CSS属性名，例如`float`，在IE里面是`styleFloat`，而标准则是`cssFloat`，现在我们可以这么获取`float`的值：

    $(elem).css("float");

这个方法还提供了驼峰大小写和`-`连接两种形式去写我们的CSS属性，例如以下两个语句返回的结果是一样的：

    $(elem).css("backgroundColor");
    $(elem).css("background-color");

值得注意的是，jQuery不支持获取复合属性，例如`border`、`background`等，需要获取这些属性要提供他们所有属性的完整的名称：

    $(elem).css("border-top-width");

在1.9之后，我们还可以传入一个数组获取多个CSS属性，会返回一个键值对表示每个属性对应的值：

    $( elem ).css([ "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth" ]).

###setter

> Set one or more CSS properties for the set of matched elements.

如果传入两个参数，或者一个对象，则视为是`setter`调用。会设置jQuery对象中所有元素的对应的CSS属性的值。有三种传参的形式：

1. `propertyName`和`value`，对应的CSS属性名和值。
2. `propertyName`和`function(index, value)`，第一个参数是属性名，第二个回调函数会传入当前元素在jQuery对象中的索引以及原来的属性值，回调函数返回的值将作为新值设置到对应的CSS属性上。
3. `properties`，一个对象，包含要设置的CSS属性的键值对。

与`getter`不一样的是，对于复合属性`setter`也可以设置了，例如：

    $(elem).css("background", "white");
    $(elem).css("border", "1px solid black");

可以通过设置一个CSS属性为空字符串删除该条CSS属性：

    $(elem).css("color", "");

在1.6之后，我们可以使用`+=`或者`-=`去设置CSS属性，跟脚本中的`+=`和`-=`是一样的，例如：

    $(elem).css("padding-left", "+=15");

这样会使得`elem`的`padding-left`增加15像素。

以上的这个例子还可以使用回调函数来实现同样的效果：

    $(elem).css("padding-left", function (i, paddingLeft) {
      return paddingLeft + 15;
    });

当回调函数不返回任何东西的时候将不会为CSS属性设置新值哦。

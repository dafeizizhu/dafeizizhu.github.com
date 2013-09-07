---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 DOM的特性和属性"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

今天介绍一下DOM上面的特性（Attribute）和属性（property）。

当我们需要获取一个DOM元素上面的特性值，例如`id`，我们可以使用原生的`getAttribute("id")`，也可以使用`elem.id`直接获取`id`的值。但是不要简单地认为这两个方式获取的值都是一样的。

###跨浏览器的命名
____

每一个浏览器对于特性和属性的命名都有一些细微的差别。例如`class`这个特性，Chrome、FireFox可以用`getAttribute("class")`去获取其值，而IE则需要使用`className`作为特性的名字才能获取到值，例子[参考这里](http://jsfiddle.net/DVHvy/show/)。

我们可以使用jQuery等库去规范这些命名，而当我们使用原生的JavaScript的时候也要注意这些命名的细微差别。

###命名的限制
____

由于特性的名称是一个字符串，理论上特性的命名是没有限制的。而属性则不一样，由于属性是一个JavaScript标识符，受到很多标识符的限制，例如不能是JavaScript的关键字或者保留字等等。例如`for`这个特性对应的属性名称是`htmlFor`，`class`这个特性对应的属性名称是`className`等。

###XML和HTML
____

为DOM元素上的特性创建对应的属性其实是HTML DOM的一个能力，而XML DOM是没有这个能力的。这样可以通过以下代码判断一个DOM是否XML DOM：

    function isXML(elem) {
      return (elem.ownerDocument ||
        elem.documentElement.nodeName.toLowerCase() !== "html";
    }

###自定义特性的行为
____

只有HTML DOM定义的特性，才会自动创建其对应的属性。如果是自定义的特性，则不会自动创建属性。要访问这些自定义特性的值，只能通过`getAttribute`来获取。

强烈建议自定义特性使用`data-`作为前缀，以区分自定义特性和HTML DOM定义的原生的特性。这样写以后就可以方便地过渡到HTML5了。

###性能
____

通常来说，访问DOM元素上的属性会比使用`getAttribute`访问特性性能要高，尤其是IE。为了提高性能，我们需要优先访问DOM元素上的属性，如果没有，则访问其对应的特性。由于属性名和特性名之间并不是一模一样的，所以要注意一些属性名和特性名之间的转化规则（使用一个`map`去保存这些规则）。

###还有其他坑
____

浏览器的一些实现也可能对特性和属性造成一些影响，而不仅仅是名字不同而已。明天将继续这个话题，去试探更多的坑。

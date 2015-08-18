---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 获取层叠后的style"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

昨天讨论过，简单通过`elem.style`只能获取到内联在HTML标签的样式值，而不能获取到`style`标签的样式和`link`标签的外部样式表的样式。需要获取经过浏览器计算后的元素“真正的”样式，要调用浏览器特定的API。很遗憾，又是IE。

###标准
____

这里的标准浏览器是所有现代浏览器加上IE9及其以上的版本。标准的浏览器提供`window.getComputedStyle`这个API去获取经过层叠计算后的样式。这个方法接受一个参数，就是要计算样式的DOM元素。该方法返回一个接口，通过调用其上面的`getPropertyValue`去获取特定名称的CSS样式的值，如：

    var computedStyle = window.getComputedStyle(elem);
    var fontSize = computedStyle.getPropertyValue("font-size");

注意哦，`getPropertyValue`接受的是CSS样式真正的名字，不需要转化成驼峰大小写的形式。

###老IE
____

在IE9之前的版本，需要通过DOM上面的`currentStyle`来获取经过层叠后的样式。这个属性跟`style`属性的使用方式相同，唯一的区别就是前者可以获取到`style`标签或者外部样式表中的CSS样式的值。

由于是使用属性，`currentStyle`上的CSS样式的名字跟`style`一样，也要使用驼峰大小写的形式。

###坑
____

要注意的坑是例如`border`、`background`等复合的CSS样式。以`border`为例，以下这个CSS样式：

    border: 1px solid black;

其实包含了12个独立的CSS样式：

    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: black;
    border-right-width: 1px;
    ...

上下左右与边框的宽度、样式、颜色都是独立的CSS样式，而`border`只是它们的一个“shortcut”而已。所以，使用以上的API获取`border`样式，是获取不到我们需要的值的。这意味着我们需要使用最原子的CSS样式去获取边框的属性，例如：

    computedStyle.getPropertyValue("border-top-width"); // 1px
    computedStyle.getPropertyValue("border-top-style"); // solid
    computedStyle.getPropertyValue("border-top-color"); // rgb(255, 255, 255)

虽然这比较麻烦，但是可以确保当边框的上下左右不一致的时候可以正确获取到我们需要获取的值。

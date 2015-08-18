---
layout: post
title: "jQuery扫盲之jQuery.fn.append"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

今天又来扫盲啦，带来的是`jQuery.fn.append`的用法。

> Insert content, specified by the parameter, to the end of each element in the set of matched elements.

这个方法就是用来插入DOM元素的。有两种调用的方式：

第一种方式接受不定长的参数列表，每一个参数可以是HTML字符串、DOM元素、数组或者jQuery对象。调用该方法后，会在jQuery对象中所有元素的后面插入指定的内容，如：

    $( ".inner" ).append( "<p>Test</p>" );
    $( ".container" ).append( $( "h2" ) );
    $( "p" ).append( document.createTextNode( "Hello" ) );
    $( "body" ).append( $newdiv1, [ newdiv2, existingdiv1 ] );
    $('body').append( $newdiv1, newdiv2, existingdiv1 );

第二种方式接受一个函数，调用`jQuery.fn.append`之后会在jQuery对象中所有元素的后面插入该函数返回的内容。该函数有两个参数，与`jQuery.fn.html`类似，是该元素在jQuery对象中的索引以及该元素在调用`append`之前的`innerHTML`，如：

    $("body").append(function (i, oldHTML) { return "Hello World"; });

与`jQuery.fn.append`对应的有`jQuery.fn.appendTo`。这两个方法唯一的区别是，`jQuery.fn.append`是把`append`的参数插到jQuery对象中的每一个元素中；而`jQuery.fn.appendTo`是把该jQuery对象的元素插入到`appendTo`的每一个参数中。例子可以[参考这里](http://jsfiddle.net/r6Quz/)。

注意哦，如以下代码：

    $(".test1").append($(".test2"));

当`$(".test1")`的个数大于一个的时候，jQuery会将`append`中的参数复制**多份**插入到`$(".test1")`的每一个元素中去哦。例如上例中`$(".test1")`的`length`为3，则jQuery会把原来的`$(".test2")`插入到其中一个`class`为`test1`的元素中，后面会复制两份分别插入到余下的元素中。

翻译就到这里结束了。有点奇怪的是竟然没有讲到任何关于插入的HTML字符串中是否带有脚本或者样式的情况，可能要看代码方能探知究竟！

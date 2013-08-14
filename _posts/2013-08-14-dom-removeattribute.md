---
layout: post
title: "DOM 的removeAttribute方法"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

今天是Attribute系列的最后一篇。前面两篇讨论了如何获取、增加、修改一个DOM元素的特性。今天轻松一下，把删除讨论完。

> removeAttribute removes an attribute from the specified element.

`removeAttribute`的功能很简单，就是删除指定名称的特性。该方法只接受一个参数，就是指定特性名称的字符串。以下是一个使用的例子：

    document.getElementById("div1").removeAttribute("align");

昨天也讨论过类似的例子，就是如果需要删除一个特性的话，使用`removeAttribute`比使用`setAttribute`把该特性置成`null`或者空字符串要好。尝试删除一个不存在的特性不会抛出任何异常。

既然用`setAttribute`可以为一个DOM元素绑定事件处理程序，那么对应使用`removeAttribute`也可以解除事件绑定，如以下代码：

    <div id="test" onclick="alert(1);">Test</div>

JavaScript：

    document.getElementById("test").removeAttribute("onclick");

单击该`div`元素不会弹出消息框。可惜IE7又再一次华丽地失败了。例子[参考这里](http://jsfiddle.net/PnKh6/show/)。

最后一个要注意的点是，如果删除的特性有默认值，则调用`removeAttribute`删除该特性之后会把该特性重置成该特性的默认值，如以下代码：

    <input id="test" type="radio" value="hello" />

JavaScript

    var test = document.getElementById("test");
    test.removeAttribute("type");

在Chrome上，执行完以上的代码，该`input`会变成一个输入框，并有默认值`hello`显示在里面。该例子在IE7、IE8上执行失败，仍然是一个`radio`，而在IE9上，虽然变成了输入框，但是默认值`hello`没有显示在里面。P.S. 我们日常也不会这么用，这里当作一个小偏门知识介绍给大家吧。

关于Attribute，我们日常还是会依赖于jQuery去做相关的操作，包括`attr`、`prop`、`data`等，看来一篇jQuery源码分析又要来啦！

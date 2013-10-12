---
layout: post
title: "DOM的innerHTML属性"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

`innerHTML`可以访问一个DOM对象的子孙节点的HTML字符串，也可以设置该DOM元素内部的HTML字符串，浏览器会自动把这些字符串转成DOM结构并塞到该DOM元素内，例如：

    var content = element.innerHTML;
    element.innerHTML = content;

访问`innerHTML`属性的时候，该元素内部的文本节点如果有`&`、`<`或者`>`，则会转成对应的XML实体，需要注意。

`innerHTML`简化了DOM操作，多层嵌套的DOM结构如果用`document.createElement`等DOM API生成的话需要非常多的代码，而使用`innerHTML`则只需要编写一段HTML字符串即可，简单高效。

`innerHTML`的作用有很多，可以清空一个元素内部的所有DOM节点：

    element.innerHTML = "";

也可以查看页面的DOM结构：

    javascript:"<pre>"+document.documentElement.innerHTML.replace(/</g,"&lt;") + "</pre>";

注意哦，由于安全问题，通过`innerHTML`设置的`script`标签是不会被执行的哦。但是，还是可以通过某种手段执行一些代码：

    var name = "<img src=x onerror=alert(1)>";
    el.innerHTML = name; // shows the alert

所以需要用户输入HTML的场景要格外小心，可以使用一些手段去校验用户输入的HTML，例如[XSS Filter](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)等。

`innerHTML`还有一些坑，第一个就是浏览器会自动校正错误格式的HTML字符串，例如：

<iframe width="100%" height="300" src="http://jsfiddle.net/tSH6a/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

可以看到`a`标签被补全了。这很多时候都是一个非常棒的事情，但是也有可能导致上述的mXSS攻击校验手段失效，例如：

    // in
    <img src="foo" alt="``onerror=alert(1)" />
    // out in IE8 or older
    <IMG alt=``onerror=alert(1) src="x">

还有很多关于`innerHTML`的攻击方式，有兴趣的童鞋可以[参考这里](http://www.slideshare.net/x00mario/the-innerhtml-apocalypse)（需要翻墙）。

还有一个设置的`innerHTML`，再访问，就算不校正，也有可能不一样。例如上例在IE8或者IE7，`a`标签的标签名变成大写。还有一个更坑的：

<iframe width="100%" height="300" src="http://jsfiddle.net/tSH6a/1/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

在IE7里面，`href`被补全成绝对路径了！这样会导致以下的代码失效：

    $("a[href='#']").length;  // in IE7, is 0

太坑爹了！只能把属性选择器改成`a[href$='#']`才能规避这个问题。

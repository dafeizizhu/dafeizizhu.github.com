---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 解析选择器"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

之前的纯JavaScript实现的CSS选择器引擎中，只是简单地使用标签选择器，所以解析起来十分简单，就是按空格`split`就好了。但是，CSS选择器有很多种，例如特性选择器（`[name="value"]`等）就没有办法通过空格去解析。

一个完整的实现需要有很多解析的规则，去处理所有合法的CSS选择器。这时候使用正则表达式就最合适不过了：

    var selector = "div.class > span:not(:first-child) a[href]"
    var chunker = /((?:\([^\)]+\)|\[[^\]]+\]|[^ ,\(\[]+)+)(\s*,\s*)?/g;
    var parts = [];
    chunker.lastIndex = 0;                        
    while ((m = chunker.exec(selector)) !== null) {     
      parts.push(m[1]);
      if (m[2]) {                         
        extra = RegExp.rightContext;
        break;
      }
    }

使用书中提供的这个正则表达式就可以解析出上面那个这么复杂的选择器了！

这个例子只是完整的实现的其中一部分，还有一些其他我们要支持的CSS选择器需要增加自己的规则。某些选择器引擎使用一个Map把正则表达式映射到一个函数，当一个正则表达式匹配的时候，对应的函数就会执行，解析其中的CSS选择器。

如果大家有兴趣去查看完整的CSS选择器是如何实现的，可以去查看[jQuery的源码](https://github.com/jquery/jquery)。

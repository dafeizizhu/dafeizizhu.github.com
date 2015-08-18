---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 寻找元素"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

解析完选择器之后，需要根据每个部分去查找匹配的元素。要使用哪些技术要取决于要支持什么CSS选择器和浏览器对CSS选择器的支持能力。

第一个是`getElementById`，只在文档的根元素上（`document`）提供的API，用于在当前文档中找出第一个`id`是指定参数的元素。Id选择器就是直接调用这个API去获取匹配的元素。但是IE和Opera还会找到第一个`name`是指定参数的元素。这个“有用”的副作用是我们所不需要的，所以还要编写一些代码去过滤这些额外的元素：

    if (elem.getAttribute("id") == id) { ... }

如果我们希望找到文档中所有包含指定`id`的元素，则需要遍历这个文档中所有元素，并比较它们的`id`特性，或者使用`document.all["id"]`，这个会返回一个匹配该`id`的元素的一个数组（IE、Opera、Safari支持）。

第二个是`getElementsByTagName`，可以寻找所有匹配该标签名的元素。这个API还有另外一个作用，就是查找元素的所有子孙元素：

    elem.getElementsByTagName("*");

当传入的CSS选择器中不包含标签选择器的时候（例如`.class`等），这种调用方式十分有用。

有一个使用`*`的陷阱：IE会返回注释（IE把注释视为标签名为`!`的元素）！所以这里又需要一个过滤器把所有注释过滤掉。

第三个是`getElementsByName`，根据`name`特性去查找元素，在使用`[name=name]`这种选择器的时候十分有用。

最后一个是`getElementsByClassName`，这个是HTML5的API，根据`class`特性去寻找元素。这个方法的出现大大提高了类选择器的查找速度。

以上就是用来寻找元素的最常用的API。匹配到元素之后，我们就可以根据某些选择器去过滤结果集（例如`nth-child`等），得到最后的结果。

---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 插入DOM（一）"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

DOM的插入操作应该是最日常的行为了。我们会插入DOM来显示提示信息、把服务器返回的数据转成HTML字符串再插入到文档中显示出来等。一般来说，插入DOM可以按照以下几个步骤：

1. 把合法的HTML或者XML字符串转成DOM。
2. 把生成的DOM插入到文档中。
3. 执行字符串中内联的脚本。

今天先来看步骤一，把字符串转成DOM。这里使用了DOM元素中的`innerHTML`属性。步骤是：

###确保传入的字符串是合法的HTML字符串
____

首先是要兼容XML的自关闭的标签。在HTML里面，也有一些自关闭的标签，例如`img`、`br`等。但是，像`div`这种标签如果写成自关闭的形式，HTML解析器没有办法解析。所以，我们要把传入字符串中的自关闭标签，而在HTML里面又不是自关闭的这些标签转一下形式，例如：

    $("<div />"); // $("<div></div>");

###根据浏览器的规则修改传入的字符串
____

有一些标签必须是某个标签的自标签，例如`option`一定要在`select`里面。如果发现传入字符串中的第一个标签有这些特殊的规则，则需要修改传入的HTML字符串，为其加上必须的父元素标签。下面是除了`option`之外有一些特殊父元素要求的标签：

1. `legend`必须在`fieldset`中。
2. `thead`、`tbody`、`tfoot`、`colgroup`、`caption`必须在`table`中。
3. `tr`必须在`table`、`tbody`、`tfoot`中。
4. `td`、`th`必须在`tr`中。
5. `col`必须在`colgroup`中。
6. `link`和`script`必须在`<div></div><div>...</div>`中。

###在一个新建的容器DOM中设置innerHTML
____

经过前两个步骤之后就能得出可靠的HTML字符串了，现在只需要生成一个`div`，把该`div`的`innerHTML`设置为生成的HTML字符串即可：

    div.innerHTML = mapEntry[1] + htmlString + mapEntry[2];

###返回生成的DOM
____

最后使用容器的`childNodes`属性就可以把生成好的DOM返回：

    return div.childNodes;

最后有一些坑，例如IE会在一个空表中生成`tbody`，还有IE会把HTML字符串开头的空白全部去掉，导致生成的DOM缺少了开头空白的`textNode`等。如果要做到每个浏览器得出的行为绝对一致，还需要为这些坑编写更多的代码哦。

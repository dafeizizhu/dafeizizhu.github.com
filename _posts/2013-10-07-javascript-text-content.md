---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 文本内容"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

处理文本内容看起来要比处理DOM元素要简单得多，特别是浏览器已经提供了通用的API让我们去处理文本内容。但是，API的行为在不同的浏览器中也有一些小区别需要注意。

最常用的操作就是获取和设置DOM的文本内容。标准浏览器提供了一个`textContent`的属性，可以通过这个属性访问DOM对象中的文本内容，包括其子孙元素的文本内容，如：

<iframe width="100%" height="300" src="http://jsfiddle.net/8hUR5/embedded/html,js,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

老版本的IE提供了另外一个属性`innerText`，跟标准的`textContent`的行为是一致的，Webkit核心的浏览器也支持`innerText`。

注意，当设置了`textContent`或者`innerText`之后，DOM对象里面的HTML结构也会被清除哦，只剩下设置的文本内容。这样会导致一些问题。

第一个问题就是内存泄漏。因为直接设置文本内容后，该DOM对象的子孙元素会被删除，但是这些元素上面可能会有绑定的事件处理程序等数据，这些数据占用的内容有可能不能释放。

还有一个问题就是各种浏览器对于空白的处理都不一致，这样导致直接使用浏览器提供的操作文本内容的属性不能产生一致的效果。

所以我们需要额外地编写一些代码以提供跨浏览器表现一致的API。

###设置文本内容
____

由于要避免子孙元素的事件处理程序等数据的内存泄漏，需要分成两个步骤去设置文本内容：

1. 删掉该元素所有子孙DOM对象，清除所有附加的数据。
2. 在清空后的元素中插入文本内容。

在步骤2里面，我们使用了`document.createTextNode`去插入一个文本节点。这个方法创建的文本节点，可以为我们传入的字符串进行HTML编码，防止插入的内容含有HTML片段或者注入脚本，如：

<iframe width="100%" height="300" src="http://jsfiddle.net/b9JEa/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

###获取文本内容
____

如果我们需要在不同浏览器上表现一致，那么就不能直接使用`textContent`或者`innerHTML`。我们需要遍历DOM对象的所有子孙元素，自行收集所有文本节点，然后组装出一个稳定的结果：

    function getText(elem) {
      var text = "";
      for (var i = 0; i < elem.childNodes.length; i++) {
        var cur = elem.childNodes[i];
        if (cur.nodeType === 3) {
          text += cur.nodeValue;
        } else if (cur.nodeType === 1) {
          text += getText(cur); // 递归
        }
      }
	  return text;
    }

这样就可以避免不同浏览器对于空格的处理影响到最后的结果。

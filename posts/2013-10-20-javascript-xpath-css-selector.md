---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 使用XPath"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

当浏览器不支持W3C标准的CSS选择器API，我们可以使用XPath作为替代的实现。XPath是一个用来在DOM文档中选择元素的一门语言，比CSS选择器功能更为强大。在大部分的现代浏览器中也实现了XPath，我们可以使用相关的API在HTML文档中去获取元素。可惜IE6以及之前的版本只支持在XML DOM中使用XPath（囧）。

其中一个使用XPath的原因是，当选择器比较复杂的时候XPath的效率要比纯JavaScript实现的选择器引擎高。相反的，当选择器比较简单（例如Id选择器或者是标签等）XPath的效率就比较低了。

浏览器实现了一个`evaluate`方法去使用XPath选择DOM元素，下面是书中的一个例子：

    if (typeof document.evaluate === "funtion") {
      function getElementByXPath(expression, parentElement) {
        var results = [];
        var query = document.evaluate(expression,
            parentElement || document,
            null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0, length = query.snapshotLength; i <length; i++) {
          results.push(query.snapshotItem(i));
        }
        return results;
      }
    }

但是如果直接使用XPath的表达式的话，对于用户来说是比较复杂的。我们可以把CSS选择器映射到特定的XPath表达式，用户就可以通过CSS选择器来使用我们提供的API了，例如：

    $("#foo"); // XPath: *[@id='foo']

如果我们要支持IE6，那么还是要实现一个纯JavaScript的CSS选择器引擎，这时候引入XPath的效益就比较低了。第一，引入XPath之后选择器引擎的代码复杂度会提高；第二，由于日常使用的选择器一般不会太复杂，那么XPath带来的性能提升会比较少。所以在使用XPath的时候要考虑性能提升和代码复杂度提升的平衡。

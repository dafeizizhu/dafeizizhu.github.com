---
layout: post
title: "High Performance JavaScript 读书笔记之 遍历DOM"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

DOM提供了多种方式供我们去遍历整个文档。虽然使用哪种方式都可以达到目的，但是有些时候还是需要选出一个效率最高的方式去达到某些性能基线。

我们可以使用`childNodes`去访问一个DOM的所以子元素，这样就可以递归地遍历整个文档中的DOM，下面是一个使用`childNodes`的例子：

    function testChildNodes() {
      var el = document.getElementById('mydiv'),
          ch = el.childNodes,
          len = ch.length,
          name = '';
      for (var count = 0; count < len; count++) {
        name = ch[count].nodeName;
      }
      return name;
    };

我们也可以使用`nextSibling`去访问一个DOM的邻接节点，这样也可以遍历整个文档中的DOM：

    function testNextSibling() {
      var el = document.getElementById('mydiv'),
          ch = el.firstChild,
          name = '';
      do {
        name = ch.nodeName;
      } while (ch = ch.nextSibling);
      return name;
    };

这两种方式在现代浏览器中的效率是差不多的，但是在IE上，`nextSibling`要比`childNodes`的效率要高得多。

`childNodes`、`nextSibling`或者`firstChild`等属性是不区分DOM的类型的，也就是说注释和文本节点都会包含在里面。大多数时候我们不会关心这些注释或者文本节点，所以在遍历的过程中我们需要判断元素的类型。基于这种需求，DOM也提供了一些过滤之后的属性，如`children`和`nextElementSibling`等。使用这些属性去遍历DOM，只会遍历到元素节点，不会包括注释和文本。注意，IE6、7、8只支持`children`。

由于`children`等属性已经过滤掉注释和文本，所以其效率通常要比`childNodes`要高哦。

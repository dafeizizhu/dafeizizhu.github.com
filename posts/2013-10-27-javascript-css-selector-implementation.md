---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 纯JavaScript实现的CSS选择器引擎"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

一个CSS选择器引擎的核心其实是纯JavaScript实现的这个部分。最主要的功能就是把CSS选择器映射到一系列浏览器原生提供的API（例如`getElementById`或者`getElementsByTagName`等）的调用序列，通过这些原生的API去寻找我们想要定位到的元素。

为什么还需要一个纯JavaScript实现的CSS选择器引擎？

1. 因为IE6和IE7不支持原生的CSS选择器、也不支持使用XPath。
2. 因为我们的站点可能需要向前兼容这些古董浏览器。
3. 因为效率，某些CSS选择器使用原生的API速度更快（例如`id`选择器）。
4. 因为CSS选择器的覆盖率，由于不是所有支持原生CSS选择器的浏览器都支持所有CSS选择器，所以当某个选择器在某个浏览器里面不支持就要退化到纯JavaScript的实现。

通常我们会从左到右分析一个CSS选择器，然后顺着`root`往下找，例如以下的选择器：

    div.ninja a span

按照一般的逻辑，我们会找`class`是`ninja`的`div`，在它的子元素中找`a`，在`a`的子元素中找`span`。这里要注意两个问题：

1. 返回的结果可能有多个，它们的顺序要跟定义的顺序一致。
2. 返回的结果中不能有重复的DOM。

由于这两个问题，使用从上到下分析DOM文档树的方法可能需要一些额外的工作量，所以就有了从下到上分析DOM文档树的方法去解析CSS选择器。原理就是先找出文档树中匹配最右边的选择器的元素，再去匹配它的祖先元素是否满足左侧的CSS选择器：

    function find(selector, root) {
      root  = root || document;
      var parts = selector.split(" "),
          query = parts[0],
          rest = parts.slice(1).join(" "),
          elems = root.getElementsByTagName(query),
          results = [];
      
      for (var i = 0; i < elems.length; i++) {
        if (rest) {
          results = results.concat(find(rest, elems[i]));
        } else {
          results.push(elems[i]);
        }
      }
      return results;
    }

这里通过一个递归，从最底层的DOM元素开始，顺着文档树往上找就能找到所有匹配这个选择器的元素了，十分简单的逻辑。也是因为逻辑简单，所以效率没有从上往下实现的CSS选择器引擎要高，这就看大家的取舍了。

---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 插入DOM（二）"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

昨天讨论如何把HTML字符串转成DOM，今天就要把生成的DOM插入到文档中去。这里使用DOM fragments去保证插入操作的最小化。DOM fragments可以作为容器存放多个DOM元素，而又不影响页面的显示。当操作完成之后再把fragments里面的DOM一把插入到文档中，这样浏览器就只需要渲染一次。如果不使用这种方式，每插入一个DOM都会渲染一次，这样效率比较低。

有些时候我们需要在文档中的多个位置插入生成的DOM，所以如果位置是大于一的时候，我们需要使用`cloneNode`，去复制fragments里面的内容，然后插入到多个位置中。

首先，在获取DOM的方法中加入第三个参数`fragments`，如果有这个参数就把生成的DOM塞到这个fragments里面：

    if (fragment) {
      while (div.firstChild) {
        fragment.appendChild(div.firstChild);
      }
    }

这样，我们可以通过`fragments`的引用获得里面的DOM。然后插入的动作就变成在特定的位置插入这个`fragments`：

    function insert(elems, args, callback) {
      if (elems.length) {
        var doc = elems[0].ownerDocument || elems[0],
            fragment = doc.createDocumentFragment(),
            scripts = getNodes(args, doc, fragment),
            first = fragment.firstChild;
        if (first) {
          for (var i = 0; elems[i]; i++) {
            callback.call(root(elems[i], first),
                i > 0 ? fragment.cloneNode(true) : fragment);
          }
        }
      }
    }

其中的`for`循环就是当位置大于一的时候需要复制多个`fragments`来插入到特定的位置中。

最后要注意的就是如果要把一些`tr`直接插入到`table`中，为了保持浏览器之间的一致性，我们需要手动加入一个`tbody`：

    function root(elem, cur) {
      return elem.nodeName.toLowerCase() === "table" &&
        cur.nodeName.toLowerCase() === "tr" ?
          (elem.getElementsByTagName("tbody")[0] ||
             elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
          elem;
    }

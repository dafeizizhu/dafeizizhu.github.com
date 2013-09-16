---
layout: post
title: "Document Fragment"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

如果我们需要对一些DOM进行操作，而又不想这些操作造成的变化体现在浏览器中，可以创建一个文档片段（Document Fragment）临时把我们要操作的DOM放入其中，待操作完成后再放回原来的位置。

###Document Fragment
____

> The DocumentFragment interface represents a minimal document object that has no parent. It is used as a light-weight version of Document to store well-formed or potentially non-well-formed fragments of XML.

一个文档片段相当于一个轻量级的文档，可以存放一部分的XML（HTML）DOM。可以通过`document.createDocumentFragment`来创建一个文档片段。

其实一个文档片段就是一个小型的文档，可以使用`appendChild`加入DOM、使用`childNodes`去获取文档片段中的子元素等。

###document.createDocumentFragment
____

上文已经提到了这个方法。这个方法的作用就是创建一个空白的文档片段，所以这个方法不接受任何参数，而返回一个文档片段的DOM。这个DOM不在当前的文档树中。通常会在这个文档片段中进行DOM操作，例如从某个地方使用`appendChild`把相关的DOM插入到文档片段中，然后对文档片段中的DOM进行修改或者删除，最后把这个文档片段（或者只把它的子元素）插入到当前的文档树中。这时这些DOM操作才真正生效。

由于这种操作方式不会导致页面的reflow，所以使用文档片段去操作DOM是一种效率比较高的方式，建议使用。

###range.createContextualFragment
____

今天看书的时候提到了一种比`document.createFragment`效率更高的方式，就是`range.createContexualFragment`，其中`range`是通过`document.createRange`创建的对象。

> The Range.createContextualFragment() method returns a DocumentFragment by invoking the HTML fragment parsing algorithm or the XML fragment parsing algorithm with the start of the range (the parent of the selected node) as the context node.

这个方法的作用是使用`range`所表示的选择区域去创建一个文档片段，即这个方法也是返回一个文档片段。跟`document.createFragment`不同的是：

1. 需要以选中的开始元素作为文档片段的上下文。
2. 接受一个参数，就是HTML格式的字符串。

创建的文档片段会自动包括该参数表示的DOM。例子[参考这里](http://jsfiddle.net/ppS3x/)。

这个方法会调用浏览器解析XML或者HTML的解析器去转化这个HTML字符串，类似于`innerHTML`属性，一方面效率会比较高，另一方面使用起来也比较方便。由于只是一个实验性质的API，所以不是所有浏览器都支持，特别是IE哦亲！

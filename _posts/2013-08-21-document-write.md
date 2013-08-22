---
layout: post
title: "document.write"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

说到`document.write`，在之前的工作中都不会使用到，有几个原因：一个是不需要，可以通过DOM原生的或者jQuery的相关方法动态增加DOM元素；第二个原因是在文档已经被加载完毕之后再调用`document.write`会导致整个文档被重写，像以下的代码：

    <div id="clickme">Click me!</div>
    <script>
      document.write("<div>Hello World</div>")
      window.onload = function () {
        document.getElementById("clickme").onclick = function () {
          document.write("<div>I write after document.loaded!</div>");
        };
      }
    </script>

单击按钮之后之前写入的`Hello World`会被清除，只剩下调用`document.write`输出的那一行HTML代码。

但是在展现型的页面，我发现经常都会使用这个方法来做一些输出，例如说广告、页脚等与页面内容关系不大的内容。这样做的好处可能是可以把一些与整个页面没有太大关系的内容独立到一个JavaScript文件里面去，类似于一些服务器脚本的`include`方法实现的效果。

这个方法适用于各种类型的DOM（包括XML和HTML等）。

> Writes a string of text to a document stream opened by document.open().

这个方法接受一个参数（也可以是可变参数列表，会把所有参数都连接起来），就是要输出的字符串（可以包含标签）。

为什么在文档完成加载的时候再调用`document.write`会导致文档内容被清除，是因为**调用`document.write`的之前没有调用`document.open`，`open`会被自动调用一次**。就是这个`open`导致文档内容被清除。有一个特例，当JavaScript代码是内嵌在`script`标签里面的话，`document.open`不会被执行。

完成写入之后最好调用`document.close`来告诉浏览器写入完成。

**注意，在MIME类型为`application/xhtml+xml`的情况下，调用`document.write`会抛出错误。**详细情况请[参考这里](http://www.w3.org/MarkUp/2004/xhtml-faq#docwrite)。

最后是一个为了使调用`document.write`不要清除文档之前内容的例子，请[参考这里](http://www.cnblogs.com/hongcaomao/archive/2012/03/27/javascript_loadad.html)。

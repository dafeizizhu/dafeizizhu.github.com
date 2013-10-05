---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 执行内联脚本"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

执行HTML字符串中的内联脚本也是一个非常常见的需求，特别是服务器返回的HTML字符串，其中包括一些有关于这段HTML字符串的行为，需要内联在这些HTML字符串中一并传到前端。执行这些内联的脚本大概可以分成两个步骤。

###收集内联脚本
____

无论是直接内联的脚本，还是外部引入的脚本，都是用`script`标签的形式引入到HTML中。所以，假设现在已经从HTML字符串中生成了一个DOM的集合`ret`，从该集合收集内联脚本可以分成以下几个步骤：

1. a遍历这个集合。
2. a如果是`script`，而且`type="text/javascript"`，则认为这个是内联脚本，放入到结果集中。
3. a如果是普通的DOM，则调用该DOM对象的`getElementsByTagName`就可以获取到这个对象中的`script`标签。

当收集完所有内联的脚本之后，并且DOM已经被插入到文档中，就可以执行这些内联的脚本了。

###执行内联脚本
____

这些内联的脚本要在全局中执行，即所有在最外边定义的变量和方法都是全局的。这里使用动态插入`script`的方式来执行这些代码：

    function globalEval(data) {
      data = data.replace(/^\s+|\s+$/g, "");
      if (data) {
        var head = document.getElementsByTagName("head")[0] ||
            document.documentElement,
        script = document.createElement("script");
        script.type = "text/javascript";
        script.text = data;
        head.insertBefore(script, head.firstChild);
        head.removeChild(script);
      }
    }

这里只执行了那些直接写在`script`标签里面的代码，那些外部代码需要根据`src`，先去获取脚本的内容，在执行它们。这里是使用jQuery实现的一个例子：

    function evalScript(elem) {
      if (elem.src)
        jQuery.ajax({
          url:elem.src,
          async:false,
          dataType:"script"
        });
      else
        jQuery.globalEval(elem.text || "");
      if (elem.parentNode)
        elem.parentNode.removeChild(elem);
    }

这里注意的是我们加入到文档中的任何元素（例如`script`标签），都要在脚本执行完毕后删除。

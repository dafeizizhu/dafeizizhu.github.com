---
layout: post
title: "Script标签上的onload和onreadystatechange"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

之前做一个效果，涉及到动态加载脚本的问题。这个效果需要做成本地文件直接打开可以看到效果，所以下面的代码在Chrome是会报错的：

    $.getScript("./js/dynamic.js", function () {...});

由于本地文件使用的是`file`协议，而`$.getScript`在这个情况下是使用Ajax去请求脚本的内容，Chrome在使用`file`协议的页面进行Ajax请求时会抛出跨域访问的异常。所以只能用动态插入`script`标签的方式去实现：

	var done = false;
    var head = document.getElementsByTagName("head")[0];
    var s = document.createElement("script");
    s.type = "text/javascript";
	s.onload = s.onreadystatechange = function (evt) {
      if (!done && (!this.readyState || 
        this.readyState == "loaded" ||
        this.readyState == "complete")) {
        // do something with the script
        s.onload = s.onreadystatechange = null;
        head.removeChild(s);
      }
    }
    s.src = "path/to/script.js";
    head.appendChild(s);

在Chrome和FireFox上，`onload`会在脚本加载完之后触发，在回调函数中脚本的内容已经加载完全。而这两个浏览器的`script`标签是不支持`onreadystatechange`事件的。

在IE上比较有趣。IE9两个事件都是支持的，而IE8、7、6则只支持`onreadystatechange`。在`onreadystatechange`事件处理程序中还需要判断`script.readyState`属性。经观察之后发现其实当`loaded`的时候，脚本的内容已经可用了。但是在某些情况下，`loaded`之后脚本的内容还没有完全加载。遇到这些情况只能增加一个`setTimeout`了。实验的代码可以参考下面的例子：

<iframe width="100%" height="300" src="http://jsfiddle.net/8HY6k/2/embedded/js,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

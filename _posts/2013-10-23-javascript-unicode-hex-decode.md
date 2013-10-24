---
layout: post
title: "Unicode 16进制编码"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

这里的16进制编码，指的是`\u0001`这样的编码。有时候我们为了防止文件编码格式（例如`utf-8`或者`GBK`等）影响到文件中的内容（特别是中文），会在代码中使用这些编码，例如：

    alert('\u6211\u662f\u4e2d\u6587');

这样写的话，无论文件是什么编码，显示的信息都不会乱码，因为JavaScript无论如何都会把这个字符串解析成Unicode的编码。以前在国际化资源文件中大量使用到这个编码，所有非ASCII的字符都会以这种编码写入（当然是通过工具输入的……）。

在原生的JavaScript是没有实现这种编解码的API，写一个也十分方便：

    function getHex(str) {
      var result = "";
      for(var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i).toString(16);
        for (var j = 4 - ("" + c).length; j > 0; j--) {
          c = "0" + c;
        }
        result += "\\u" + c;
      }
      return result;
    }

为什么要写这个？因为今天发现了一个很厉害的注入：

    [flash]http://1.com/\u0022\u003e\u003c\u0069\u0066\u0072\u0061\u006d\u0065\u0020\u006f\u006e\u006c\u006f\u0061\u0064\u003d\u0022\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0029\u0022\u003e\u003c\u002f\u0069\u0066\u0072\u0061\u006d\u0065\u003e.swf[flash]

这个是一个论坛粘贴视频（Flash）的例子。看上去没有任何问题啊，就是一个比较奇怪的URL而已。如果我们有一段这样的代码：

    eval(
      'document.getElementById("test").innerHTML = \'' +
      '<embed src="' + 
      document.getElementById("testInput").value + 
      '"></embed>\';');

然后在`testInput`中输入的就是上面那个字符串，就被注入了一个`iframe`：

<iframe width="100%" height="300" src="http://jsfiddle.net/bJwUu/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

可能我们直接写的代码不会带`eval`，但是现在有很多扰码的工具会把代码变成一个字符串（通常经过特殊的编码）然后用`eval`执行，这样是不是就有可能发生以上这种注入呢？

关于这种注入，还需要分析前后台是如何处理这些用户输入的，最简单的方式就是做过滤，譬如把`\u`去掉、把多余的特性（特别是`onXXX`）去掉等。

---
layout: post
title: "High Performance JavaScript 读书笔记之 访问和修改DOM（一）"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

之前已经讨论过为什么访问和修改DOM会带来额外的性能消耗，这种消耗会在循环的内部被加剧地放大。参考下面的代码：

    function innerHTMLLoop() {
      for (var count = 0; count < 15000; count++) {
        document.getElementById('here').innerHTML += 'a';
      }
    }

以上就是一个在循环中访问以及修改DOM的例子，它在循环的内部进行了两个DOM操作：

1. 访问DOM的`innerHTML`属性。
2. 修改DOM的`innerHTML`属性。

根据之前讨论过的结果，我们要尽量减少DOM操作的次数，可以这么修改：

    function innerHTMLLoop2() {
      var content = '';
      for (var count = 0; count < 15000; count++) {
        content += 'a';
      }
      document.getElementById('here').innerHTML += content;
    }

所以，原则就是：**尽可能地保留在ECMAScript中**。

提到`innerHTML`，不得不说到一个问题：究竟是`innerHTML`效率比较高还是DOM的API效率比较高？虽然它们之间性能的差别不大，但是，`innerHTML`在非Webkit核心的浏览器比DOM API性能要好。但是由于这个差别真是不太大，所以考虑使用哪个还是要看其他方面比较好，例如可读性、可维护性、团队编码风格还有代码编写的复杂度（使用DOM API明显要比`innerHTML`要的代码多）等。

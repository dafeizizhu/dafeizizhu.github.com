---
layout: post
title: "获取浏览器视口的大小"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

在日常工作中，经常需要浏览器当前视口的大小，以防止一些绝对定位的元素跑到视口之外（例如Tips等）。最稳妥的办法是使用jQuery：

    var dimension = {
      "width": $(window).width(),
      "height": $(window).height()
    };

那用原生的JavaScript是如何获取视口大小的呢？有以下几个属性可以供我们使用：

1. `window.innerWidth`和`window.innerHeight`。
2. `document.documentElement.clientWidth`和`document.documentElement.clientHeight`。
3. `document.body.clientWidth`和`document.body.clientHeight`。

第一组是`innerXXX`，只有`window`有这个属性，而这个属性就是代表了视口的大小！第二组和地三组都是是一个DOM元素的大小，不同是DOM元素而已，一个是`documentElement`，即`html`元素，一个是`body`元素。

不同的浏览器对于以上这几个属性的处理有所不同，大概可以分成标准和非标准两类：

1. 标准，即Chrome、FireFox、IE9及以上版本。
2. 非标准，即IE8及以下版本。

我们将运行以下的代码测试浏览器对于这些属性的处理，运行例子可以[参考这里](http://jsfiddle.net/s4PhQ/show/)：

    function print(code) {
      $("body").append(code + ":" + eval(code)).append("<br/>");
    }

    print("window.innerWidth");
    print("document.documentElement.clientWidth");
    print("document.body.clientWidth");

    print("window.innerHeight");
    print("document.documentElement.clientHeight");
    print("document.body.clientHeight");

###标准
____

以Chrome为例，执行结果是这样的：

![Chrome](https://raw.github.com/dafeizizhu/dafeizizhu.github.com/master/images/2013-09-05/Chrome.PNG)

可以看到，第一组和第二组的取值是完全一致的，说明标准浏览器的实现两者都是表示浏览器视口的大小。而第三组表示的则是`body`的大小，即页面内容的大小，跟浏览器的视口没有必然联系。

###非标准
____

以IE8（使用的是IE9的IE8模式）为例，执行结果是这样的：

![IE8](https://raw.github.com/dafeizizhu/dafeizizhu.github.com/master/images/2013-09-05/IE8.PNG)

第一组的值竟然是`undefined`！这说明非标准浏览器是不支持`window.innerWidth`和`window.innerHeight`的。第二组跟第三组的值跟标准浏览器的实现是一样的。

###总结
____

原生JavaScript与jQuery的执行结果比较可以[参考这里](http://jsfiddle.net/xxQaA/1/show/)。只有第二组的值是主流的浏览器都支持的。所以，要获取浏览器视口的大小，最好的办法还是使用……jQuery，哈哈！

###坑
____

要注意避免页面使用怪异模式渲染，因为即使是jQuery，**在怪异模式下面获取的视口大小都为0**！

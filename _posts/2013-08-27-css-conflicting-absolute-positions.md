---
layout: post
title: "利用Absolute进行自适应布局"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

昨天做一个类似于幻灯片左右切换的功能，鼠标移动到容器的左边显示前一张的箭头，移动到右边显示后一张的箭头。最简单的实现方式是在容器上面加两个遮盖层，并在遮盖层上设置`cursor`样式，例如如下代码片段：

    <div id="wrapper">
      <div id="left"></div>
      <div id="right"></div>
    </div>

CSS：

    #wrapper {
      width: 100px;
      height: 100px;
      background: red;
      position: relative;
    }

    #wrapper div {
      width: 33.3333%;
      top: 0;
      bottom: 0;
      position: absolute;
      background: blue;
    }

    #right {
      right: 0;
    }

实现的效果[参考这里](http://jsfiddle.net/KbH86/1/show/)。这里利用了一个`absolute`的特性，当同时指定了`top`、`bottom`，而宽度是`auto`的话，绝对定位的元素的宽度会根据`top`和`bottom`所限定的范围内自适应容器，同样的垂直方面也是一样的。这样，很容易就能做出一个能自适应容器的元素。

现实永远是残酷的，又是IE。很遗憾，IE6的表现差强人意，上面的例子在IE6下面有很奇怪的行为，高度并没有撑开，而只有小小的一段。这个`absolute`的特性IE6并不支持。

幸好，上述的需求还能有一个权宜的解决方案。

1. 把高度设置到一个非常大的值（例如：`9999999px`），一般普通的应用是没有办法到达的高度。
2. 把容器的`overflow`设置成`hidden`，这样，超出的部分就不会显示出来了。

代码如下：

    #wrapper {
      _overflow: hidden;
    }

    #wrapper div {
      _height: 999999px;
    }

运行结果[参考这里](http://jsfiddle.net/2T4X4/1/show/)。可以看到在IE6上面的表现也跟其他现代浏览器一致了，太happy了！

美中不足的是这个解决方案只能解决上述的场景，即`bottom`为`0`的场景，当`bottom`不为`0`的时候，就不能使用上述的方案了。这个时候只能使用CSS表达式或者求助于JavaScript了。哎，IE6啊啊啊啊啊啊啊！

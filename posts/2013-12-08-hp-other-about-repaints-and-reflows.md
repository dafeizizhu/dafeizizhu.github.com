---
layout: post
title: "High Performance JavaScript 读书笔记之 还有一些关于Repaint和Reflow"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

###缓存关于布局的信息

之前已经讨论过了，虽然浏览器会把触发Repaint和Reflow的DOM操作用一个队列缓存起来，但是只要我们去访问有关布局的属性（例如各种`offset`），这时候浏览器为了保证返回的值是正确的，只能把操作队列清空，把之前的DOM操作应用到页面中去。例如以下的代码是非常低效的：

    myElement.style.left = 1 + myElement.offsetLeft + 'px';
    myElement.style.top = 1 + myElement.offsetTop + 'px';
    if (myElement.offsetLeft >= 500) {
      stopAnimation();
    }

由于在设置DOM的位置的时候访问了`offsettLeft`和`offsetTop`两个有关布局的属性，导致第一行代码和第二行代码分别触发了Reflow。比较好的方式是使用一个局部变量把当前位置相关的值记录下来，而不是使用`offset`这样的属性：

    currentLeft++;
    myElement.style.left = currentLeft + "px";

###在动画的过程中把DOM从文档流中移除

举个例子，像jQuery的`slideDown`和`slideUp`这样的效果在日常的页面中出现的次数非常多，例如各种手风琴菜单、下拉菜单等。像手风琴菜单那样的效果，当菜单展开的时候，会把它之后的菜单往后挤。由于位置不断发生变化，会频繁地触发Reflow。后面的内容越多，对性能的影响就越大。

为了减少动画造成的Reflow次数，我们可以这么修改一下这个效果：

1. 把展开的菜单项的`position`设置成`absolute`。（注：这样可能会导致页面在展开的过程中样式发生错误。）
2. 在菜单项上应用动画，由于是绝对定位，DOM已经从文档流中移除，只会导致Repaint。
3. 在动画完毕之后，把`position`恢复回来，样式恢复正常。

###IE和hover伪类

从IE7开始，IE就支持`:hover`了。不过，如果有很多元素都适用于这个`:hover`定义的样式的时候，性能会受到严重的影响，IE8更甚。当存在500－1000个DOM应用`:hover`定义的样式的时候，在IE7、8下CPU占用可能会长期达到80%－90%。所以在大量的DOM存在的时候，在IE7、8上要小心`:hover`造成的性能影响。

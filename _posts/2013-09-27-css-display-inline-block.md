---
layout: post
title: "消除display: inline-block引起的元素之间的缝隙"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

记得以前在看bootstrap的例子的时候，发现它的按钮之间都是有空隙的。检查元素的样式，发现并没有任何`margin`被设置了，那为什么会出现空隙呢？

先来看看`display: inline-block`干了些什么。

> The element generates a block element box that will be flowed with surrounding content as if it were a single inline box (behaving much like a replaced element would).

简单地说就是一个行级的块元素，即像行内元素一样排版，但又可以像块元素一样设置元素的大小。我们可以尝试用`inline-block`去模拟一个浮动的效果：

<iframe width="100%" height="300" src="http://jsfiddle.net/e6EQ9/embedded/" frameborder="0"> </iframe>

惊讶地发现，元素之间竟然出现了缝隙！查看代码并没有任何`margin`被设置了，跟bootstrap中的情况一样。其实非常简单，就是元素被当成行内元素排版的时候，元素之间的空白符（空格、回车换行等）都会被浏览器处理，根据`white-space`的处理方式（默认是`normal`，合并多余空白），原来HTML代码中的回车换行被转成一个空白符，所以元素之间就出现了空隙。

有时候加入这些空隙是好事，例如并排显示多个按钮，按钮之间留有一定空隙是比较好看的。但是，有时候为了完美地实现设计搞，元素之间的空隙都要精确限制。由于这个空隙是一个空白符，占用的空间跟父元素的`font-size`有之间关系，所以这个空隙的大小是不可控的。这时候，要先消除这些空隙，再根据设计搞设置精确的`margin`。

上网查了一下，最有效的办法就是在父元素中设置`font-size: 0`，然后在子元素上重置正确的`font-size`：

<iframe width="100%" height="300" src="http://jsfiddle.net/e6EQ9/1/embedded/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

又到了我们可爱的IE出场的时间了。很遗憾，虽然IE从5.5就开始支持`display: inline-block`，但是它的实现跟标准实现的表现是不一致的。我们需要以下的代码让IE的表现跟标准趋于一致：

    display:inline-block; /* 现代浏览器 +IE6、7 inline 元素 */
    *display:inline; /* IE6、7 block 元素 */
    *zoom:1;

其中`zoom`就是为了触发IE的`hasLayout`。以下这个例子能在IE6上实现类似的效果：

<iframe width="100%" height="300" src="http://jsfiddle.net/e6EQ9/2/embedded/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>


其实要消除这个空隙还有一个非常简单的方法，就是**把所有回车换行都删掉**！这样意味着这些代码都要写成一行！哎呀，这样牺牲可读性貌似有点大，所以可以这样：

1. 使用以上的方法去消除元素之间的空隙。
2. 在发布的时候用工具除去HTML的所有空白。这个方案意味着需要有一个类似watcher的东西，在开发的时候实时地进行预处理去查看效果。

参考资料：

1. [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
2. [inline-block 前世今生](http://www.iyunlu.com/view/css-xhtml/64.html)

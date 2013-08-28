---
layout: post
title: "background:url(about:blank)的作用"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

接着昨天的话题，做那个需求的时候还有一个问题，就是在IE6上，鼠标指针移动到左右遮盖层上并没有变成对应的箭头！明明其他浏览器都是好的，我艹！这时，想起隔壁前辈跟我说要在遮盖层上面加一个`background`。参考了公司其他网页的类似功能，是这么一个样式：

    background: url(background.png);

其中那个图片是一个透明的png图片。由于一些历史原因这里才用了一个透明的png图片，其实比较好的实现方式是：

    background: url(about:blank);

例子可以[参考这里](http://jsfiddle.net/6yS7G/1/show/)还有[这里](http://jsfiddle.net/g7gvq/1/show/)。前者在IE6上只能把鼠标放到`border`上才会变成手型，而后者则是正常的行为。

查了一下资料，发现这个样式可以解决以下的一些问题：

1. 如果给空a标签定义了宽度和高度且使用了`absolute`，则需要用这个样式“撑开”这个标签。
2. IE6上的`position: fixed`，使用CSS表达式来实现对应的功能时，浏览器滚动条滚动的时候会有抖动的情况。

以下的内容描述了问题2的解决方案以及原因：

> 解决此问题的技巧就是使用background-attachment:fixed为body或html元素添加一个background-image。这就会强制页面在重画之前先处理CSS。因为是在重画之前处理CSS，它也就会同样在重画之前首先处理你的CSS表达式。这将让你实现完美的平滑的固定位置元素！

> 注：如果是在样式里写position:absolute再用expression()表达式来实现的话，给html一个background:fixed url(about:blank);就能解决抖动的bug，但如果是用js重新计算浮动对像的位置background:fixed url(about:blank);就不能解决抖动问题，因为重新计算浮动对象的位置是基于一个onscroll事件的。

总结，当使用了`absolute`并指定了宽度或者高度（无论是显示设置`witdh`和`height`或者使用`top`、`bottom`隐式设定自适应大小），在IE6下面最好加上以下的样式保证显示效果正确：

    background-image: url(about:blank);
    background-attachment: fixed;

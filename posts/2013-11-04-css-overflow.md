---
layout: post
title: "css overflow"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

`overflow`声明当一个块元素的内容超过块元素的高度的时候应该如何显示。

当这个属性的值不是默认值（`visible`）的时候，会创建一个BFC，这意味着这个容器会把里面的`float`的元素包裹起来（也就是修复浮动元素的高度塌陷问题）。注：即使是`hidden`，还是可以用脚本控制内部元素的`scrollTop`等滚动相关的属性。

这个属性可选的值有4个：

1. `visible`，默认值，内容不被裁剪，直接渲染到盒子外面，但是不影响布局。
2. `hidden`，内容被裁剪，且没有滚动条，意味着这些内容在页面上没法直接看见。
3. `scroll`，内容被裁剪，浏览器会显示滚动条，通过滚动条可以查看完整的内容。注：在打印设备上`scroll`是没效的，同`visible`。
4. `auto`，由浏览器去决定怎么显示，一般是当内容超过容器的时候自动出现滚动条。

常见的用法就是修复容器内部浮动元素导致的高度塌陷问题，一般只需要在容器上写上一条CSS：

    overflow: hidden;

这样容器就可以把内部浮动元素也包裹起来，高度也就是正常的了。

最后有兴趣的童鞋可以看看[这里](http://edskes.net/ie/ie8overflowandexpandingboxbugs.htm)，是一些关于IE8的`overflow`的bug，竟然有一个bug是可以把页面弄不见的，太牛逼了！

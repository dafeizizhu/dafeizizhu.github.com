---
layout: post
title: "window.getComputedStyle"
description: ""
category: 
tags: [JavaScript, css]
---
{% include JB/setup %}

使用DOM的`style`属性只能获取`style`特性指定的CSS属性，而外部样式表（`link`）或者内联样式表（`style`）中对这个元素生效的CSS属性是不能通过`style`获取的。这时，调用`getComputedStyle`可以返回一个DOM元素当前的CSS属性，即经过层叠之后的CSS属性（包括外部样式表、内联样式表还有`style`）。

这个方法可以接受两个参数：

1. `element`，要获取CSS属性的DOM元素。
2. `pseudoElt`，可选，一个伪类，可以获取到这个DOM元素的某个伪类的CSS属性，如`:hover`、`:active`，甚至是`:before`。IE和Opera不支持这个参数。

返回的对象可以像`style`属性一样的使用，不过只能读，写是无效的：

    var result = getComputedStyle(elem);
    alert(result.height);

也可以调用元素上的`getPropertyValue`去获取对应的CSS属性：

    alert(result.getPropertyValue("height");

这个方法IE9才支持。我们可以利用这个方法在脚本中准确判断现在是哪个响应式的样式表在生效。以前我们判断现在是哪个生效，可能会写这么一些代码：

    if ($(window).width() > 1024) {
      // min-width: 1024px
    } else if ($(window).width() > 768) {
      // max-width: 1024px and  min-width: 768px
    } else {
      // max-width: 768px
    }

但是这样有几个问题。第一个就是由于浏览器的不同的实现，没有办法保证样式跟代码一致；第二个就是响应式的宽度判断需要在脚本和样式那边都要写。这个时候，我们可以使用`getComputedStyle`。首先在样式表中编写以下代码：

    body: after{ display: none; }
    @media (min-width: 1024px) {
      body:after{ content: "l" }
    }
    @media (max-width: 1023px) and (min-width: 768px) {
      body:after{ content: "m" }
    }
    @media (max-width: 767px) {
      body:after{ conetnt: "s" }
    }

然后编写以下脚本：

    var size = getComputedStyle(document.body, ":after").
      getPropertyValue("content");
    if (size == "l") {
      // something happend in large size
    }

太牛逼了！详细过程请参考[伪类+js实现CSS3 media queries跨界准确判断](http://www.zhangxinxu.com/wordpress/2012/05/after-js-content-css3-media-queries/)。里面还有一个大图自动变小图的例子，十分棒。

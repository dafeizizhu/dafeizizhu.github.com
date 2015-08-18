---
layout: post
title: "CSS的width、max-width和min-width"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

昨天虽然说用`width`和`height`控制图片大小的方法生成缩略图的方式不是十分完美，但总是有它适用的场景的。使用这个方式生成缩略图，重要的是保持图片的宽高比，而且高度和宽度都不能超过特定的值。这时候，使用`max-width`和`max-height`就是非常好的选择了。今天就简单讨论一下`width`、`max-width`和`min-width`三个CSS样式的属性的区别。

###width
____

> The width CSS property specifies the width of the content area of an element. The content area is inside the padding, border, and margin of the element.

`width`声明的是元素的内容宽度，即不包括`padding`、`border`和`margin`的宽度。

`width`的默认值是`auto`，块元素会继承包含块的宽度，而行内元素则会根据行内内容自适应宽度，所以行内元素设置`width`是没有效果的。

`width`可以是绝对的长度，例如`100px`、`100em`等，也可以是百分比的长度（包含块的绝对宽度的百分比）。

###max-width
____

> The max-width CSS property is used to set the maximum width of a given element. It prevents the used value of the width property from becoming larger than the value specified for max-width.

从名字就可以看出来，`max-width`就是为了限制元素的宽度不能超过某个特定的值。当元素的宽度（无论是绝对长度或者是经百分比计算后的长度）超过`max-width`所设置的值，元素的宽度就是等于`max-width`设置的值。这样就是说**`max-width`能覆盖`width`的值**。

`max-width`的默认值是`none`，表示元素默认是没有最大宽度的。与`width`一样，值可以是绝对长度也可以是百分比长度（同样是包含块的绝对宽度的百分比）。

###min-width
____

> The min-width CSS property is used to set the minimum width of a given element. It prevents the used value of the width property from becoming smaller than the value specified for min-width.

从名字又可以看出来，`min-width`是为了限制元素的宽度不能低于某个特定的值。当元素的宽度低于`min-width`所设置的值，元素的宽度就是等于`min-width`设置的值。有一个比较有趣的事情：**`min-width`能覆盖`max-width`和`width`的值**，如：

    #test {
      width: 200px;
      max-width: 100px;
      min-width: 150px;
      background: red;
    }

执行结果[参考这里](http://jsfiddle.net/DxyYH/)。可以看到`div`的宽度是`min-width`设置的`150px`。

与`max-width`一致，`min-width`的默认值也是`none`，值可以是绝对长度或者是百分比长度。

###兼容性
____

很遗憾，这么好的属性，IE6又是不支持。当要支持IE6的时候，而又要使用`max-width`等CSS样式的时候，就是考虑兼容方案。第一个是使用脚本，获取需要设置`max-width`等样式DOM元素，根据需要显式设置`width`。如果不想使用脚本，则可以考虑使用CSS表达式：

    max-width: 100px;
    _width: expression((documentElement.clientWidth > 100) ? "100px" : "auto");

例子[参考这里](http://jsfiddle.net/N7jSx/show/)。在IE6上面宽度也被限制在`100px`以内。

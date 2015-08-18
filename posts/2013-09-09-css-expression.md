---
layout: post
title: "CSS表达式"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

对于一些呈现型的网站（例如门户、资讯类的），在国内还是必须照顾一大部分使用IE6的用户。这样导致我们的代码为了兼容很多IE6，需要在IE6上模拟一些高级浏览器的功能，例如`fixed`的CSS样式，还有`max-width`等。在不希望使用JavaScript的时候，css表达式还是可以作为一个不错的向下兼容的方案的。

CSS表达式，严格来说应该是CSS中的动态属性，在MSDN中的定义是这样的：

    Using the power of dynamic properties, it is now possible to declare property values not only as constants, but also as formulas. 

使用CSS表达式，使得CSS样式中的值不仅仅只有常量，如`10px`、`100%`等，还可以是变量、可以通过N条语句计算出来的值。由于IE8及更高版本已经完全支持CSS 2.1的全部功能，像上述说的`fixed`和`max-width`等都可以直接使用CSS来实现了。而其他更具体的功能还是推荐使用JavaScript去完成。

###接口
____

1. `getExpression`，获取CSS表达式。
2. `recalc`，强制刷新CSS表达式的值。
3. `removeExpression`，删除CSS表达式。
4. `setExpression`，设置CSS表达式。

可以在JavaScript脚本中使用以上的命令操作CSS表达式，例如：

    oDiv.style.setExpression("left",
      "document.body.clientWidth/2 - oDiv.offsetWidth/2"
    );

    oDiv.style.setExpression("top",
      "document.body.clientHeight/2 - oDiv.offsetHeight/2"
    );
    document.recalc(true);

也可以在`style`特性的内联样式、`style`标签块、甚至是外部CSS样式表中书写CSS表达式，例如：

    <DIV ID="oDiv"
    STYLE="background-color: #CFCFCF; position: absolute; 
         left:expression(document.body.clientWidth/2-oDiv.offsetWidth/2);
         top:expression(document.body.clientHeight/2-oDiv.offsetHeight/2)">
    Example DIV
    </DIV>

以上的代码实现了一个无论怎么`resize`一个浏览器窗口，该`div`始终保持居中的这么一个功能。注意哦，没用任何一段“脚本”。

###问题
____

既然CSS表达式可以省去一大堆代码，例如上例中绑定`window`的`resize`事件等代码，那为什么现代的CSS教程、书籍、规范都不约而同的要我们不要去使用CSS表达式呢？

其中一个最重要的原因是它不是标准的CSS实现，在现代的浏览器中是不支持的。

另外一个重要的原因，就是性能问题。有没有考虑过，这些写在CSS样式中的代码什么时候会被执行？这个是摘自YUI的一篇文档的翻译：

> 表达式的问题就在于它的计算频率要比我们想象的多。不仅仅是在页面显示和缩放时，就是在页面滚动、乃至移动鼠标时都会要重新计算一次。给CSS表达式增加一个计数器可以跟踪表达式的计算频率。在页面中随便移动鼠标都可以轻松达到10000次以上的计算量。

这里有一个[例子](http://www.17css.com/works/09/03/CSS%20Expressions1.html)供大家参考。当鼠标随便移动几下，在IE6上CSS表达式就被执行超过1000次。就算执行的逻辑十分简单，随着执行的次数增大，性能消耗也是相当高的，尤其是IE6这些蹩脚的浏览器。

###总结
____

虽然CSS表达式有兼容性和性能等问题，使用它有时候对代码的简洁以及可靠性也是有一定帮助的。例如解决IE6上`fixed`的方案，使用JavaScript脚本就不能完美解决（会造成`fixed`元素的抖动），而使用CSS表达式就可以比较完美地解决。

请记住，只能在IE6上使用对应的CSS表达式哦亲！这时候条件注释或者是对应的CSS hack就要出场啦！

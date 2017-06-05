---
layout: post
title: "行内垂直居中实践"
description: ""
category: 
tags: [css]
---

引用：

1. [vertical-align - CSS | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)
2. [我对CSS vertical-align的一些理解与认识（一） «  张鑫旭-鑫空间-鑫生活](http://www.zhangxinxu.com/wordpress/2010/05/%E6%88%91%E5%AF%B9css-vertical-align%E7%9A%84%E4%B8%80%E4%BA%9B%E7%90%86%E8%A7%A3%E4%B8%8E%E8%AE%A4%E8%AF%86%EF%BC%88%E4%B8%80%EF%BC%89/)
3. [CSS vertical-align的深入理解(二)之text-top篇 «  张鑫旭-鑫空间-鑫生活](http://www.zhangxinxu.com/wordpress/2010/06/css-vertical-align%E7%9A%84%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%EF%BC%88%E4%BA%8C%EF%BC%89%E4%B9%8Btext-top%E7%AF%87/)
4. [关于Vertical-Align你需要知道的事情 - 弗里得木 - SegmentFault](https://segmentfault.com/a/1190000002668492)

最近在做播放器的UI，工具栏式的布局还是占主导地位。一般的实现有几种：

1. 使用`float: left;`或者`float: right;`。
2. 使用`display: inline-block;`。用`inline-block`替代`inline`是为了可以让工具栏上的按钮、状态文字都可以设置固定的宽度。
3. 使用`display: flex;`。

第一种方式几乎所有浏览器都支持，但是由于浮动，各个浏览器的表现不一定一致（说的就是低版本的IE们）。第三种方式最科学，灵活性最高，但是IE9都不支持（苦逼的项目要求至少支持IE8）。综上所述，还是选用了第二种方式，使用`display: inline-block;`配合`vertical-align: middle;`达到工具栏内垂直居中对齐。

假设工具栏的HTML如下：

    <div class='bar'>
      <span><button>Button 1</button></span>
      <span><button>Button 2</button></span>
      <span><input type='text' placeholder='Enter Something' /></span>
      <span><button>Button 3</button></span>
    </div>

工具栏一般有固定的高度：

    .bar {
      height: 50px;
      background: red;
    }

效果如下：

<a class="jsbin-embed" href="https://jsbin.com/napitarabi/1/embed?output">JS Bin on jsbin.com</a><script src="https://static.jsbin.com/js/embed.min.js?4.0.2"></script>

首先，我们可以看到按钮跟按钮之间有一段缝隙，这是因为我们的HTML代码里面，`div`里面的每一个`span`都用回车分开了，这样可以提高代码的可读性。这些回车就会在每个`span`之间生成一个空隙。有两个办法可以去掉这些缝隙：

1. 去掉`span`之间的回车。这样我们代码的可读性会变差。
2. 在`div`上面设置`font-size: 0;`，在每个`span`里面重新设置文本大小。

这里选用第二种方案：

    .bar {
      height: 50px;
      background: red;
      font-size: 0;
    }

效果如下：

<a class="jsbin-embed" href="https://jsbin.com/vafeyohupu/1/embed?output">JS Bin on jsbin.com</a><script src="https://static.jsbin.com/js/embed.min.js?4.0.2"></script>

最后我们要想办法让这些按钮居中对齐：

    .bar span {
      vertical-align: middle;
    }

咦，貌似不行啊，没有任何效果。这时候需要看看`vertical-align`的机制是什么样的。

> `vertical-align`被用于垂直对齐`inline`元素，也就是`display`值为`inline`和`inline-block`的元素。

> `inline`元素一个挨着一个的摆放在行内，当行内元素太多的情况下，一个新行会被创建出来，这些行也叫做`line--box`。它将行内的所有内容都包裹了起来。根据行内内容的不同，`line-box`的尺寸也会不同。

幸运的是，这个`line-box`的高度是可以通过`line-height`来调整的：

    .bar {
      ...
      line-height: 50px;
    }

效果如下：

<a class="jsbin-embed" href="https://jsbin.com/buhigovica/1/embed?output">JS Bin on jsbin.com</a><script src="https://static.jsbin.com/js/embed.min.js?4.0.2"></script>

咦，虽然位置是往下了，但是为什么还是不像居中呀？

上面的CSS只是设置了`div`下面的`span`的基线是按`middle`来对齐的，而`span`里面的元素还是按照`baseline`来对齐的。这就是说，真正的按钮和输入框与外部容器的对齐方式并不完全是`middle`的。需要再增加一条规则：

    .bar span * {
      vertical-align: middle;
    }

效果如下：

<a class="jsbin-embed" href="https://jsbin.com/qiqekujoke/1/embed?output">JS Bin on jsbin.com</a><script src="https://static.jsbin.com/js/embed.min.js?4.0.2"></script>

这次的效果基本是好了。假如在`div`内再增加一文本字段：

    <div class='bar'>
      <span class='text'>Hello</span>
      ...
    </div>

再增加一段CSS设置文本的字号：

    .text {
      font-size: 12px;
    }

效果如下：

<a class="jsbin-embed" href="https://jsbin.com/qazaduhaqo/1/embed?output">JS Bin on jsbin.com</a><script src="https://static.jsbin.com/js/embed.min.js?4.0.2"></script>

可以看到，由于同时设置了`span`以及`span`内部元素的`vertical-align`，`div`内部的元素都是居中对齐了，而且基线十分平整，nice！

注：IE上的效果可能因为`button`的默认样式会有一些差别，需要自行reset后方可使用。

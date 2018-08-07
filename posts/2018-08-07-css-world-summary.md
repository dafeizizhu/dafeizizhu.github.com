---
layout: post
title: "《CSS世界》读书笔记（续5）"
description: ""
category: 
tags: [css, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 书接上回

1. [《CSS世界》读书笔记](/posts/2018/06/22/css-world-summary.html)
2. [《CSS世界》读书笔记（续）](/posts/2018/06/29/css-world-summary.html)
3. [《CSS世界》读书笔记（续）（续）](/posts/2018/07/16/css-world-summary.html)
4. [《CSS世界》读书笔记（续）（续）（续）](/posts/2018/07/23/css-world-summary.html)
5. [《CSS世界》读书笔记（续4）](/posts/2018/07/30/css-world-summary.html)

### 内容两端对齐

使用`text-align: justify`想要两端对齐的效果，需要满足两点：

1. 有分隔点，例如空格。
2. 超过一行，此时非最后一行内容会两端对齐。

借助为元素自动补一行能实现内容两端对齐的效果：

    .justify:after {
      content: '';
      display: inline-table;
      width: 100%;
    }

这样之后内容是两端对齐了，但是内容莫名其妙多出来一些高度，修正方法：

1. 容器设置`font-size: 0`，内容再还原。
2. 辅助两端对齐的内联元素设置`vertical-align: top`或者`vertical-align: bottom`。

在IE下设置了`font-size: 0`会使得空格变成不存在一样，无法两端对齐。使用`font-size: .1px`规避之后，Chrome又有12px字号的限制导致又多出来一些莫名其妙的高度。为了伟大的IE，最终代码如下：

    .justify:after {
      text-align: justify;
      font-size: .1px;
      font-size: -webkit-calc(0px + 0px);
    }

预览效果：

<p data-height="265" data-theme-id="0" data-slug-hash="ZjMvRX" data-default-tab="css,result" data-user="dafeizizhu" data-pen-title="内容两端对齐" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/ZjMvRX/">内容两端对齐</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

借助这个两端对齐的效果，我们可以实现任意宽度元素在容器里面的流式排列，并保持两端对齐，自动分配间隙。由于内容的个数可能不确定，导致最后一行会出现不同个数的元素，这样中间就会出现空隙。这时候，需要人工补上占位符：

    <ul class='justify'>
      <!-- 一行4个 -->
      <li><img src='1.png'><p>描述1</p></li>
      <li class='placeholder'></li>
      <li class='placeholder'></li>
      <li class='placeholder'></li>
    </ul>

对应的样式：

    .placeholder {
      display: inline-block;
      width: 144px; // 内容的宽度
      vertical-align: bottom;
    }

预览效果：

<p data-height="265" data-theme-id="0" data-slug-hash="ZjMvRX" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="多行内容两端对齐" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/ZjMvRX/">多行内容两端对齐</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### `::first-letter`实际应用举例

标识价格符号：

    .price:first-letter {
      margin-right: 5px;
      font-size: 32px;
    }

预览效果：

<p data-height="265" data-theme-id="0" data-slug-hash="PBdQYN" data-default-tab="css,result" data-user="dafeizizhu" data-pen-title="::first-letter实际应用举例" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/PBdQYN/">::first-letter实际应用举例</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 元素隐藏显示的最佳实践

1. 如果希望元素不可见，同时不占据空间，辅助设备无法访问，同时不渲染，可以使用`<script>`标签包裹隐藏。
2. 如果希望元素不可见，同时不占据空间，辅助设备无法访问，但是资源有加载，DOM可以访问，可以直接使用`display: none`进行隐藏。
3. 如果希望元素不可见，同时不占据空间，辅助设备无法访问，但是显隐的时候可以用`transisition`淡入淡出效果，可以使用`position: absolute; visibility: hidden`进行隐藏。
4. 如果希望元素不可见，不能点击，辅助设备无法访问，但保留占据的空间，则可以使用`visibility: hidden`进行隐藏。
5. 如果希望元素不可见，不能点击，不占据空间，但键盘可以访问，则可以使用`position: absolute; clip: rect(0 0 0 0);`进行隐藏。
6. 如果希望元素不可见，不能点击，占据空间，且键盘可以访问，层叠上下文之间如果存在设置了背景色的元素，可以使用更友好的方式进行隐藏：`position: relative; z-index: -1`。
7. 如果希望元素不可见，可以点击，不占据空间，则可以使用`position: absolute; opacity: 0`进行隐藏。
8. 如果单纯希望元素不可见，单位置保留，可以点击可以选择，则直接使用`opacity: 0`进行隐藏。

未完继续待续。。。

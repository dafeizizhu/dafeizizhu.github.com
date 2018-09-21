---
layout: post
title: "《SVG精髓》读书笔记（续2）"
description: ""
category: 
tags: [svg, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 书接上回

1. [《SVG精髓》读书笔记](/posts/2018/08/29/svg-essentials-summary.html)
2. [《SVG精髓》读书笔记（续1）](/posts/2018/09/07/svg-essentials-summary.html)

### 路径与填充

路径中不仅可以有相交线，还可以有“缺口”。当路径出现缺口时，可能会存在图形的嵌套。这时候，需要使用`fill-rule`这个属性判断嵌套的部分是否需要填充，例如：

    <path d='M0 0 60 0 60 60 0 60Z M15 15 45 15 45 45 15 45Z' fill='none' stroke='black' />
    <path d='M0 0 60 0 60 60 0 60Z M15 15 15 45 45 45 45 15Z' fill='none' stroke='black' />

这两条路径绘制出来的图像，在没有填充之前是一致的，加上填充之后，会根据`fill-rule`属性发生变化。默认情况下，`fill-rule`的值是`nonzero`，这种情况下，确认一个点是否在路径的内部还是外部需要参考线条的方向：

1. 如果交点所在的线条方向都是一致的，则表示点在路径内部，需要填充。
2. 如果交点所在的线条方向是相反的，则表示点在路径外部，不需要填充。

可以修改`fill-rule`的值为`evenodd`，这样，前面的判断会忽略线条的方向，只使用交点个数去判断是否在路径内部。完整的例子如下：

<p data-height="265" data-theme-id="0" data-slug-hash="MqxWOd" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="路径与填充" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/MqxWOd/">路径与填充</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

有关`fill-rule`，请参考[这里](http://svgtrick.com/tricks/2f610e5c28e3349c8d6fa69edf3aead0)。

### 图案 - 尺寸基于对象大小计算

需要制定图案左上角的`x`和`y`坐标，以及其`width`和`height`（百分比或者0到1之间的小数），然后设置`patternUnits`属性为`objectBoundingBox`，例如：

    <pattern id='tile' x='0' y='0' width='0.2' height='0.2' patternUnits='objectBoundingBox'></pattern>

几个效果：

<p data-height="265" data-theme-id="0" data-slug-hash="JazExb" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="图案 - 尺寸基于对象大小计算" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/JazExb/">图案 - 尺寸基于对象大小计算</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

可以看到：

1. 第一个由于容器的宽高的五分之一跟图案的宽高一致，跟图案上面的`width`和`height`匹配，所以刚好平铺容器，图案也没有缩放变形。
2. 第二个由于容器的宽高的五分之一不够完全展示一个图案，导致图案被截断了。
3. 第三个由于容器的宽高的五分之一比图案的宽高要大，所以产生了额外的空间。

由于图案设置了`x`和`y`都为`0`，所以左上角都正好是矩形的左上角。

### 图案 - 一个接一个放置

如果需要跟大多数图形设计程序一样，在画布上将图案一个一个放置，不管尺寸是多少，不会产生额外的间隙，这需要设置`patternUnits`属性值为`userSpaceOnUse`，并按用户单位指定图案的`width`和`height`：

    <pattern id='tile' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'></pattern>

几个效果：

<p data-height="265" data-theme-id="0" data-slug-hash="zJbZqo" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="图案 - 一个接一个放置" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/zJbZqo/">图案 - 一个接一个放置</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

值得注意的是，图案的对齐方式取决于所在的坐标系统，所以第二个矩形的左上角不能与图案的左上角重合。

### 图案 - 设置基于对象大小的单位

使用`patterContentUnits`属性设置使用什么单位表达图案数据本身：

1. `userSpaceOnUse`，默认值，图案的边界框左上角应该在原点`(0, 0)`位置。
2. `objectBoundingBox`，以对象大小为基数。

设置`objectBoundingBox`的效果：

<p data-height="265" data-theme-id="0" data-slug-hash="NLJpbZ" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="图案 - 设置基于对象大小的单位" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/NLJpbZ/">图案 - 设置基于对象大小的单位</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

可以看到图案按照比例完整地填充容器了。

### 使用`dy`改变文本的垂直位置

SVG不会处理换行符，不会自动换行，所以需要手动为每一行设置`x`属性值，并使用`y`或者`dy`来垂直定位：

    <text>
      <tspan x='0' y='50'>This is the second line</tspan>
      <tspan x='0' dy='20'>This is the third line</tspan>
      <tspan x='0' dy='20'>This is the fourth line</tspan>
      <tspan x='0' dy='20'>This is the fifth line</tspan>
    </text>

例如：

<p data-height="265" data-theme-id="0" data-slug-hash="Mqxpre" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="使用dy改变文本的垂直位置" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/Mqxpre/">使用dy改变文本的垂直位置</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

未完待续......

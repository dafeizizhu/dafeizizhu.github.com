---
layout: post
title: "《SVG精髓》读书笔记（续3）"
description: ""
category: 
tags: [svg, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 书接上回

1. [《SVG精髓》读书笔记](/posts/2018/08/29/svg-essentials-summary.html)
2. [《SVG精髓》读书笔记（续1）](/posts/2018/09/07/svg-essentials-summary.html)
2. [《SVG精髓》读书笔记（续2）](/posts/2018/09/21/svg-essentials-summary.html)

### 为图形添加文本

使用`textPath`可以让文本按照指定的路径进行排列：

    <text>
      <textPath xlink:href='#pathId'>Text</textPath>
    </text>

还可以使用`textPath`的`startOffset`指定文本起始位置。如果希望文本相对路径居中，这样就可以了：

    <text style='text-anchor: middle'>
      <textPath xlink:href='#pathId' startOffset='50%'>Text in middle</textPath>
    </text>

例如：

<p data-height="265" data-theme-id="0" data-slug-hash="mzyjZQ" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="为图形添加文本" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/mzyjZQ/">为图形添加文本</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

可以看到文本按照路径相对居中显示了。

### 为图形添加蒙版

SVG蒙版会变换对象的透明度。如果蒙版是不透明的，被蒙版覆盖的对象的像素就是不透明的；如果蒙版是半透明的，蒙版的透明部分会使被覆盖对象的相应部分不可见。

我们使用`<mask>`元素创建蒙版，其中：`x`、`y`、`width`、`height`属性指定蒙版的尺寸，这些尺寸默认按照`objcetBoundingBox`计算。如果想根据用户空间坐标计算尺寸，设置`maskUnits`为`userSpaceOnUse`即可。

蒙版中的元素默认使用用户坐标空间表达，设置`maskContentUnits`为`objectBoundingBox`即可让这些元素使用对象边界框计算尺寸。

例如：

    <mask maskContentUnits='objectBoundingBox'>
      <rect x='0' y='0' width='0.5' height='0.5' style='fill: #000'>
    <mask>

现在我们给上面例子中的太极图加一个图片，并设置一个渐变的蒙版：

<p data-height="265" data-theme-id="0" data-slug-hash="vVEzXb" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="为图形添加蒙版" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/vVEzXb/">为图形添加蒙版</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

可以看到图形的四周有一个渐变的效果。

### 基本滤镜效果

演示SVG 2个基本滤镜：

1. 投影
2. 加入图片背景：`<feImage xlink:href='path/to/bg' result='bg' x='0' y='0' width='100%' height='100%' preserveAspectRatio='none' />`

投影需要两步：

1. 高斯模糊：`<feGaussianBlur in='SourceAlpha' stdDeviation='2' result='blur' />`
2. 使用`<feMerge>`在投影上显示原始图像。

例子：

<p data-height="265" data-theme-id="0" data-slug-hash="yRyxvX" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="基本滤镜效果" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/yRyxvX/">基本滤镜效果</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 使用滤镜做出蒙版效果

使用`<feComposite>`，可以指定`in`和`in2`，根据`operator`属性将两个输入源进行合并，其中`operator`的取值有：

1. `over`，层叠，跟`<feMerge>`的作用类似。
2. `in`，结果是`in`的一部分重叠在`in2`的不透明区域，类似于蒙版（仅仅基于`in2`的alpha通道）。
3. `out`，结果是`in`的一部分在`in2`的不透明区域外面，半透明区域有反转蒙版的效果。
4. `atop`，在没有`<feFlood>`滤镜的情况下与`in`一致。
5. `xor`，在没有`<feFlood>`滤镜的情况下与`out`一致。
6. `arithmetic`，使用4个系数计算出每个通道的结果（太复杂了先忽略）。

使用`<feImage>`和`<feComposite>`可以模拟出蒙版和反转蒙版的效果，例如：

    <!-- 蒙版 -->
    <filter id='sky-out'>
      <feImage xlink:href='path/to/image' result='img' />
      <feComposite in='img' in2='SourceGraphic' operator='in' />
    </filter>
    <!-- 反转蒙版 -->
    <filter id='sky-out'>
      <feImage xlink:href='path/to/image' result='img' />
      <feComposite in='img' in2='SourceGraphic' operator='out' />
    </filter>

例子：

<p data-height="265" data-theme-id="0" data-slug-hash="xybaYJ" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="使用滤镜做出蒙版效果" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/xybaYJ/">使用滤镜做出蒙版效果</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

未完待续......

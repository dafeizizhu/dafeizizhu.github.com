---
layout: post
title: "《SVG精髓》读书笔记"
description: ""
category: 
tags: [svg, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 创建一个SVG图像

文档结构：

    <?xml version="1.0"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

    <svg width="140" height="170" xmlns="http://www.w3.org/2000/svg">
      <title>Cat</title>
      <desc>Stick Figure of a Cat</desc>
      <!-- 在这里绘制图像 -->
    </svg>

绘制圆（脸）：

    <circle cx="70" cy="95" r="50" style="stroke: black; fill: none;" />

指定样式（眼睛）：

    <circle cx="55" cy="80" r="5" stroke="black" fill="#393" />
    <circle cx="85" cy="80" r="5" stroke="black" fill="#393" />

绘制线，分组（胡须）：

    <g id="whiskers">
      <line x1="75" y1="95" x2="135" y2="85" style="stroke: black;" />
      <line x1="75" y1="95" x2="135" y2="105" style="stroke: black;" />
    </g>

变换坐标（另一侧的胡须）：

    <use xlink:href="#whiskers" transform="scale(-1 1) translate(-140, 0)" />

绘制折线（嘴巴，耳朵）：

    <polyline points="108 62, 90 10, 70 45, 50 10, 32 62" style="stroke: black; fill: none;" />
    <polyline points="35 110 45 120 95 120 105 110" stroke="black" fill="none" />

绘制路径（鼻子）:

    <path d="M75 90 65 90 A5 10 0 0 0 75 90" style="stroke: black; fill: #fcc" />

绘制文字：

    <text x="60" y="165" style="font-family: sans-serif; font-size: 14pt; stroke: none; fill: black;">Cat</text>

完成！预览效果如下：

<p data-height="265" data-theme-id="0" data-slug-hash="oPzbVR" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="创建一个SVG图像" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/oPzbVR/">创建一个SVG图像</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 为视口指定用户坐标

在svg中，没有单位的数值都被视为像素。为了实现用户自定义的坐标单位，可以在`<svg>`元素上设置`viewBox`属性，这个属性由4个数值组成，它们分别代表想要叠加在视口上的用户坐标系统的最小x坐标、最小y坐标、宽度和高度。

例如，要在4厘米长5厘米高的图纸上绘制一个每厘米16个单位的坐标系统：

    <svg width="4cm" height="5cm" viewBox="0 0 64 80">

这样就可以改变svg的大小时，里面的内容可以按比例缩放：

<p data-height="265" data-theme-id="0" data-slug-hash="qMaZXB" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="为视口指定用户坐标" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/qMaZXB/">为视口指定用户坐标</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

上面的例子中，svg的高度和宽度是按比例增长的（第二个图的宽高都是第一个图的两倍）。如果窗口跟视口的宽高比是不一致的，svg可以做以下3种处理方式：

1. 按较小的尺寸等比例缩放图形，以使图形完全填充视口。
2. 按较大的尺寸等比例缩放图形并裁剪掉超出视口的部分。
3. 拉伸和挤压绘图以使其恰好填充新的视口，不保留源的宽高比。

使用`<svg>`上的`preserveAspectRatio`属性指定被缩放的图像和视口的对齐方式：

    preserveAspectRatio="alignment [meet|slice]"

其中`alignment`指定轴和位置，对齐说明由一个x对齐方式的值和一个y对齐方式的值（min、mid或者max）组合而成，默认值是`xMidYMid meet`。其中：

1. `meet`表示缩小图像图像适配视口的宽高比。
2. `slice`表示按视口的宽高比放大图像适配窗口，裁剪掉不适合的部分。

例子如下：

<p data-height="265" data-theme-id="0" data-slug-hash="MqjyVZ" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="保留宽高比" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/MqjyVZ/">保留宽高比</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 复用元素

svg使用`<use>`元素，为定义在`<g>`元素内的组合或者任意独立图形元素提供类似复制粘贴的能力：

    <g id="house"></g>
    <use xlink:href="#house" x="70" y="100" />

使用`<defs>`元素可以告诉svg只定义但是不显示它们：

    <defs>
      <g id="house"></g>
    </defs>
    <use id="house1" xlink:href="#house" x="70" y="100" />
    <use id="house2" xlink:href="#house" x="140" y="100" />

例子：

<p data-height="265" data-theme-id="0" data-slug-hash="oPzLoG" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="复用元素" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/oPzLoG/">复用元素</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

未完待续……

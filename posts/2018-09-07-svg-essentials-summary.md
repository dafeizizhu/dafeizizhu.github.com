---
layout: post
title: "《SVG精髓》读书笔记（续1）"
description: ""
category: 
tags: [svg, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 书接上回

1. [《SVG精髓》读书笔记](/posts/2018/08/29/svg-essentials-summary.html)

### 笛卡尔坐标系统转换

在笛卡尔坐标系统中，点`(0, 0)`位于画布的左下角，y坐标向上递增，这与SVG中的默认约定相反，我们可以使用变换序列让SVG做这种转换工作：

1. 在原始绘图中找到最大的y坐标，也就是原始y轴的末端。
2. 讲整个绘图放入`<g>`元素中。
3. 启用平移，根据最大y值向下移动坐标系统：`transform="translate(0, max-y)"`。
4. 接下来的变化就是缩放y轴`-1`倍，让它倒置翻转：`transform="translate(0, max-y) scale(1, -1)"`。

例子：

<p data-height="265" data-theme-id="0" data-slug-hash="pOWGrY" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="笛卡尔坐标系统转换" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/pOWGrY/">笛卡尔坐标系统转换</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 围绕中心点缩放

要围绕某个点按照给定的比例缩放对象可以这么做：

    translate(-centerX * (factor - 1), -centerY * (factor - 1)) scale(factor)

注意，当对象缩放之后描边的宽度也会对应被缩放，可以设置`stroke-width`来恢复原始边框的宽度：

    stroke-width: strokeWidth / factor;

例子：

<p data-height="265" data-theme-id="0" data-slug-hash="VGMgrp" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="围绕中心点缩放" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/VGMgrp/">围绕中心点缩放</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 使用椭圆弧

圆弧命令的使用方法：

1. 以字母`A`开始，后面紧接7个参数
2. 点所在椭圆的x半径和y半径。
3. 椭圆的x轴寻找角度`x-axis-rotation`。
4. `large-arc-flag`，如果需要圆弧的角度小于180度，为`0`，反之为`1`。
5. `sweep-flag`，如果需要弧以负角度绘制则为`0`，反之为`1`。
6. 终点的x坐标和y坐标（起点由最后一个绘制的点或者最后一个`moveto`命令确定）。

例如：

    <path d='M125 75 A100 50 0 0 0 255 125' />

使用圆弧绘制一个太极符号：

<p data-height="265" data-theme-id="0" data-slug-hash="ZMXwqE" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="使用圆弧绘制一个太极符号" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/ZMXwqE/">使用圆弧绘制一个太极符号</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 从其他弧线格式转换

在SVG中，弧线并不能单独存在，它要成为线和曲线连接路径的一部分，比如，一个圆角矩形就是通过一系列线和椭圆弧组成的。然而，有时候我们需要一个独立的半（椭）圆，假设有一个按照如下方式指定的椭圆：

    <ellipse cx='cx' cy='cy' rx='rx' ry='ry' />

下面是绘制四种可能的半椭圆路径：

    <!-- 北半球 -->
    <path d='M (cx - rx) cy A rx ry 0 1 1 (cx + rx) cy' />
    <!-- 南半球 -->
    <path d='M (cx - rx) cy A rx ry 0 1 0 (cx + rx) cy' />
    <!-- 东半球 -->
    <path d='M cx (cy - ry) A rx ry 0 1 1 cx (cy + ry)' />
    <!-- 西半球 -->
    <path d='M cx (cy - ry) A rx ry 0 1 0 cx (cy + ry)' />

例子：

<p data-height="265" data-theme-id="0" data-slug-hash="zJEeVB" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="从其他弧线格式转换" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/zJEeVB/">从其他弧线格式转换</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

未完待续......

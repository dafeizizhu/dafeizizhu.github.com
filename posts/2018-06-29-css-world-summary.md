---
layout: post
title: "《CSS世界》读书笔记（续）"
description: ""
category: 
tags: [css, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 书接上回

1. [《CSS世界》读书笔记](/posts/2018/06/22/css-world-summary.html)

### 菜单分隔线

借助内联元素和`padding`属性实现：

    a + a::before {
      content: '';
      font-size: 0;
      padding: 10px 3px 1px;
      margin-left: 6px;
      border-left: 1px solid gray;
    }

<p data-height="265" data-theme-id="0" data-slug-hash="KebwXR" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="菜单分隔线" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/KebwXR/">菜单分隔线</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 水平列表

防止一行最后一个元素因为其`margin-right`导致布局错位：

    .box {
      width: 320px;
      background-color: red;
    }

    .box > ul {
      padding: 0;
      font-size: 0;
      margin-right: -10px;
    }

    .box > ul > li {
      list-style: none;
      display: inline-block;
      width: 100px;
      height: 100px;
      margin-right: 10px;
      margin-bottom: 10px;
      background-color: green;
    }

<p data-height="265" data-theme-id="0" data-slug-hash="gKZpYX" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="gKZpYX" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/gKZpYX/">gKZpYX</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 等高布局（`padding`和`margin`实现）

使用垂直方向的`margin-bottom`改变元素的外部尺寸：

    .column-box {
			overflow: hidden;
			width: 400px;
		}

		.column-left,
		.column-right {
			margin-bottom: -9999px;
			padding-bottom: 9999px;
			float: left;
			width: 50%;
		}

		.column-left {
			background: red;
		}

		.column-right {
			background: green;
			height: 200px;
		}

<p data-height="265" data-theme-id="0" data-slug-hash="GGPJoy" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="等高布局（`padding`和`margin`实现）" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/GGPJoy/">等高布局（`padding`和`margin`实现）</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

优势：

1. 兼容性好，IE6都支持；
2. 支持任意个分栏布局；

缺点：

1. 需要父级`overflow: hidden`；
2. 触发锚点定位或者使用`DOM.scrollIntoview()`等方法时候可能出现奇怪的定位问题。

### 等高布局（`table-cell`实现）

    .column-box {
			width: 400px;
			display: table;
		}

		.column-left,
		.column-right {
			width: 50%;
			display: table-cell;
		}

		.column-left {
			background: red;
		}

		.column-right {
			background: green;
			height: 200px;
		} 

<p data-height="265" data-theme-id="0" data-slug-hash="dKwoNR" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="等高布局（`table-cell`实现）" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/dKwoNR/">等高布局（`table-cell`实现）</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

优势：

1. 天然等高；

缺点：

1. 需要IE8及以上的浏览器才能支持；

未完继续待续……

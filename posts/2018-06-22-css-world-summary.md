---
layout: post
title: "《CSS世界》读书笔记"
description: ""
category: 
tags: [css, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 宽度分离原则

CSS中的`width`属性不与影响宽度的`padding`和`border`（甚至是`margin`）属性共存，也就是不能出现以下组合：

    .box {
      width: 100px;
      border: 1px solid;
    }

或者：

    .box {
      width: 100px;
      padding: 20px;
    }

应该`width`独立使用一层标签，而`padding`、`border`和`margin`利用流动性在内部自适应呈现：

    .father {
      width: 180px;
    }
    .son {
      margin: 0 20px;
      padding: 20px;
      border: 1px solid;
    }

好处是，父元素定宽，子元素因为`width`使用默认值`auto`，所以会如流水般自动填满父级容器。因此，子元素的contentbox的宽度就是100像素。这时候，再增加`padding`为20像素的时候，子元素的contentbox的宽度就会自动变成60像素。这种情况下独立修改`padding`、`border`或者`margin`都不会影响父元素的大小。

### 任意高度元素的展开收起动画

使用`max-height`：

    .element {
      max-height: 0;
      overflow: hidden;
      transition: max-height .25s;
    }
    .element:hover {
      max-height: 666px;
    }

<p data-height="265" data-theme-id="0" data-slug-hash="eKrrwV" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="任意高度元素的展开收起动画" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/eKrrwV/">任意高度元素的展开收起动画</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 图片alt占位大法

使用`content`属性生成一个提示信息：

    img::after {
      content: attr(alt);
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, .5);
      transform: translateY(100%);
      transition: transform .2s;
    }
    img:hover::after {
      transform: translateY(0);
    }

<p data-height="265" data-theme-id="0" data-slug-hash="zajaom" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="图片alt占位大法" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/zajaom/">图片alt占位大法</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

当我们点击按钮给图片添加一个`src`地址，图片从普通元素变成替换元素，原本都还支持的`::befoter`和`::after`此时全部无效，再hover图片，是不会与任何信息出现的。

### 垂直分栏两端对齐

CSS：

    .box {
      weidth: 256px;
      height: 256px;
      text-align: justify;
    }
    .box:before {
      content: '';
      display: inline-block;
      height: 100%;
    }
    .box:after {
      content: '';
      display: inline-block;
      width: 100%;
    }
    .bar {
      display: inline-block;
      width: 20px;
    }

HTML：

    <div class='box'><i class='bar'></i>
      <i class='bar'></i>
      <i class='bar'></i>
      <i class='bar'></i>
    </div>

<p data-height="265" data-theme-id="0" data-slug-hash="XYqBJv" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="垂直分栏两端对齐" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/XYqBJv/">垂直分栏两端对齐</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

注意：每个`.bar`元素必须用一个空格符分开（例如回车或者空格）。而且柱子总宽度也不能超过容器宽度，不然后面的柱子就会被挤下去了。


### 加载中点点点动画

    dot {
			display: inline-block;
			height: 1em;
			line-height: 1;
			text-align: left;
			vertical-align: -.25em;
			overflow: hidden;
		}
		dot::before {
			display: block;
			content: '...\A..\A.';
			white-space: pre-wrap;
			animation: dot 3s infinite step-start both;
		}

		@keyframes dot {
			33% { transform: translateY(-2em); }
			66% { transform: translateY(-1em); }
		}

<p data-height="265" data-theme-id="0" data-slug-hash="JZvBOR" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="加载中点点点动画" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/JZvBOR/">加载中点点点动画</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

细节：

1. 为什么使用`<dot>`元素：低版本浏览器不认识自定义元素会自动忽略所有css。
2. 为什么使用`::before`而不用`::afeter`：为了在高版本浏览器把原来的三个点推到元素外面。
3. 为什么3个点在第一行，1个点在最后一行：IE9认识自定义元素和`::before`，但是不认识`animation`，为了能使IE9也能正确显示三个点，所以把三个点放在第一行。

下班咯，未完待续。

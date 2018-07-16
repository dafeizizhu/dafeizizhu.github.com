---
layout: post
title: "《CSS世界》读书笔记（续）（续）"
description: ""
category: 
tags: [css, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 书接上回

1. [《CSS世界》读书笔记](/posts/2018/06/22/css-world-summary.html)
2. [《CSS世界》读书笔记（续）](/posts/2018/06/29/css-world-summary.html)

### 块级元素右对齐

原理是固定宽度且`margin-left`为`auto`，由于`margin`的缺省值是`0`，实现的效果刚好是块级元素右对齐的效果：

    .son {
      width: 200px;
      margin-left: auto;
    }

<p data-height="265" data-theme-id="0" data-slug-hash="LBGXBL" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="块级元素右对齐" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/LBGXBL/">块级元素右对齐</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 绝对定位`margin: auto`居中

1. 子元素绝对定位，且4个方向都设成`0`，导致子元素的“格式化宽度”和“格式化高度”等于外部尺寸。
2. 固定子元素的宽高，原本该填充的空间被多余出来，这多余的空间就是`margin: auto`计算的空间。
3. 此时设置`margin: auto`，由于这个`margin`把上下左右的剩余空间全部等分了，所以子元素就自然居中了。

代码：

    .f {
      width: 300px;
      height: 150px;
      position: relative;
      background: red;
    }

    .s {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      width: 200px;
      height:100px;
      margin: auto;
      background: green;
    }

<p data-height="265" data-theme-id="0" data-slug-hash="MBKzzY" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="绝对定位margin: auto居中" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/MBKzzY/">绝对定位margin: auto居中</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 基于右侧布局的图片背景

使用透明`border`来撑开右侧宽度：

    .b {
      border-right: 25px solid transparent;
      background-position: 100% 50%;
    }

<p data-height="265" data-theme-id="0" data-slug-hash="zLryrw" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="基于右侧布局的图片背景" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/zLryrw/">基于右侧布局的图片背景</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 去掉图片下方空隙的方法

1. 图片块状化：`display: block`。
2. 容器`line-height`足够小：`line-height: 0`。
3. 容器`font-size`足够小：`font-size: 0`。
4. 图片设置其他`vertical-align`属性值：`vertical-align: top | middle | bottom`。

### 大小不固定的弹窗永远居中

优点：

1. 不需要JavaScript。
2. 性能更改、渲染速度更快。
3. 可以灵活控制垂直居中的比例：`.container:after { height: 90%; }`。
4. 容器设置`overflow: auto`可以实现弹框高度超过一屏时依然能看见屏幕外的内容。

代码：

    .container {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, .5);
      text-align: center;
      font-size: 0;
      white-space: nowrap;
      overflow: auto;
    }

    .container:after {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }

    .dialog {
      display: inline-block;
      vertical-align: middle;
      text-align: left;
      font-size: 14px;
      white-space: normal;
      background: #fff;
      width: 300px;
      height: 150px;
    }

<p data-height="265" data-theme-id="0" data-slug-hash="LBGMxm" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="大小不固定的弹窗永远居中" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/LBGMxm/">大小不固定的弹窗永远居中</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

未完继续待续……

---
layout: post
title: "《CSS世界》读书笔记（续4）"
description: ""
category: 
tags: [css, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 书接上回

1. [《CSS世界》读书笔记](/posts/2018/06/22/css-world-summary.html)
2. [《CSS世界》读书笔记（续）](/posts/2018/06/29/css-world-summary.html)
3. [《CSS世界》读书笔记（续）（续）](/posts/2018/07/16/css-world-summary.html)
3. [《CSS世界》读书笔记（续）（续）（续）](/posts/2018/07/23/css-world-summary.html)

### `z-index`“不犯二”准则

对于非浮层元素，避免设置`z-index`值，`z-index`值没有任何道理需要超过2。原因：

1. 定位元素一旦设置了`z-index`值，就从普通定位元素变成了层叠上下文元素，相互间的层叠顺序发生了根本的变化，很容易出现设置了巨大的`z-index`值也无法覆盖其他元素的问题。
2. 避免`z-index`一山比一山高的样式混乱问题。

如果你的定位发现必须`z-index: 3`或者以上才能满足效果，试试使用“`relative`的最小化原则”来实现，试试利用原生的层叠顺序进行层级控制等等。

### 文字后的图标居中对齐

原理：内联元素默认基线对齐，图片的基线可以看作是图片的下边缘，文字内容的基线是字符`x`的下边缘，因此，通过`vertical-align: 25%`声明让图片的下边缘和文字的中心线对齐，再通过图标偏移自身的一半高度来实现居中：

    p > img {
      width: 16px;
      height: 16px;
      vertical-align: 25%;
      position: relative;
      top: 8px;
    }

<p data-height="265" data-theme-id="0" data-slug-hash="bjaeJM" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="文字后的图标居中对齐" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/bjaeJM/">文字后的图标居中对齐</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 文字大小的最佳实践

1. 即使是定宽的传统桌面端，也需要响应式处理，尤其是针对1200像素宽度设计的页面，需要响应到800像素即可。如果做到这一步，那么是否需要响应浏览器的字号设置这一点可以忽略。
2. 如果因各种原因无法做响应式处理，也没必要全局都使用相对单位，只需要在图文内容为主的重要局部区域使用可缩放的`font-size`处理即可，例如小说网站的阅读页、微信公众号文章等。
3. 容器设置`font-size: medium`，默认值为`16px`。
4. 容器内文字字号全用相对单位，基于`16px`进行转换。
5. 间距，例如`margin`等，都使用相对单位。

### `@font-face`最佳实践

    @font-face {
      font-family: ICON;
      src: url('icon.eot');
      src: local(''),
        url('icon.woff2') format('woff2'),
        url('icon.woff') format('woff'),
        url('icon.ttf');
    }

### 响应式图标

使用`font-weight`作为变量实现：

    @font-face {
      font-family: ICON;
      src: url('icon-large.woff');
      font-weight: 700;
    }
    @font-face {
      font-family: ICON;
      src: url('icon-medium.woff');
      font-weight: 400;
    }
    @font-face {
      font-family: ICON;
      src: url('icon-small.woff');
      font-weight: 100;
    }
    .icon {
      font-family: ICON;
    }
    .icon-large {
      font-weight: 700;
      font-size: 128px;
    }
    .icon-medium {
      font-weight: 400;
      font-size: 64px;
    }
    .icon-small {
      font-weight: 100;
      font-size: 16px;
    }

### 文字依次飞入效果

使用`letter-spacing`负值重叠特性实现：

    .title {
      animation: textIn 1s both;
    }
    @keyframes textIn {
      0% { letter-spacing: -200px; }
      100% { letter-spacing: 0; }
    }

<p data-height="265" data-theme-id="0" data-slug-hash="JBMRZJ" data-default-tab="css,result" data-user="dafeizizhu" data-pen-title="文字依次飞入效果" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/JBMRZJ/">文字依次飞入效果</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### `word-break: break-all`和`word-wrap: break-word`的区别

1. `word-break: break-all`的作用是所有都换行，毫不留情，一点儿空隙都不放过。
2. `word-wrap: break-word`则带有怜悯的心，如果这一行文字有可以换行的点，如空格或者CJK之类的，在这些换行点换行。至于对不对齐，好不好看则不关心，因此很容易出现一片空白区域的情况。

### `white-space`的应用场景

1. “包含块”尺寸过小处理，防止“一柱擎天”。
2. 单行蚊子溢出“点点点”效果，配合`text-overflow: ellipsis; white-space: nowrap;`。
3. 水平列表切换，使用`white-space: nowrap`强制列表一行显示。最大的好处是可以通过一行简单的`box.clientWidth - box.scrollWidth`代码就可以知道最大滚动宽度。

未完继续待续...

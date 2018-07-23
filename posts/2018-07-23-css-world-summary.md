---
layout: post
title: "《CSS世界》读书笔记（续）（续）（续）"
description: ""
category: 
tags: [css, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 书接上回

1. [《CSS世界》读书笔记](/posts/2018/06/22/css-world-summary.html)
2. [《CSS世界》读书笔记（续）](/posts/2018/06/29/css-world-summary.html)
3. [《CSS世界》读书笔记（续）（续）](/posts/2018/07/16/css-world-summary.html)

### 自定义滚动条样式

需要支持`-webkit-`前缀的浏览器：

    .container::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .container::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, .3);
      border-radius: 6px;
    }

    .container::-webkit-scrollbar-track {
      background-color: #ddd;
      border-radius: 6px;
    }

<p data-height="265" data-theme-id="0" data-slug-hash="ajJWwZ" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="自定义滚动条样式" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/ajJWwZ/">自定义滚动条样式</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 锚点定位实现的选项卡切换效果

利用锚点更改URL地址触发对应卡片元素滚动到视口：

<p data-height="265" data-theme-id="0" data-slug-hash="JBWNMW" data-default-tab="html,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="锚点定位实现的选项卡切换效果" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/JBWNMW/">锚点定位实现的选项卡切换效果</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

不足之处：

1. 容器高度需要固定。
2. 由内而外的锚点定位会触发窗体的重定位，即如果页面也是可以滚动的，点击选项卡按钮后页面会发生跳动。

可以这么优化：

<p data-height="265" data-theme-id="0" data-slug-hash="wxJdXN" data-default-tab="html,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="锚点定位实现的选项卡切换效果（增强）" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/wxJdXN/">锚点定位实现的选项卡切换效果（增强）</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

这个例子使用`focus`触发锚点定位，并使用JavaScript避免点击选项卡页面跳动的问题。

### `clip`

1. `fixed`固定定位剪裁。
2. 最佳可访问性隐藏：`position: absolute; clip: rect(0 0 0 0);`。

### `relative`定位细节

1. 相对定位的`left`、`top`、`right`、`bottom`的百分比值是相对于包含块计算的，而不是自身。
2. 包含块的高度是`auto`的话，`top`和`bottom`的百分比值的计算值为0，即无效。
3. `top`和`bottom`同时使用，`bottom`无效；`left`和`right`同时使用，`right`无效。

### 蒙层弹窗背景锁定

需要借助JavaScript实现：

    $('#showMask').click(function () {
      var widthBar = 17
      root = document.documentElement
      
      if (typeof window.innerWidth === 'number') {
        widthBar = window.innerWidth - root.clientWidth
      }
      
      root.style.overflow = 'hidden'
      root.style.borderRight = widthBar + 'px solid transparent'
      
      $('.mask').show()
    })

    $('.mask').click(function () {
      var root = document.documentElement
      root.style.overflow = ''
      root.style.borderRight = ''
      
      $('.mask').hide()
    })

<p data-height="265" data-theme-id="0" data-slug-hash="jpBwvy" data-default-tab="js,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="蒙层弹窗背景锁定" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/jpBwvy/">蒙层弹窗背景锁定</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 多背景盒子（IE8也适用）

借助`z-index`的负值实现CSS3的多背景特性：

    .box {
      background-image: url(1.png);
      position: relative;
      z-index: 0;
    }
    .box:before,
    .box:after {
      content: '';
      position: absolute;
      z-index: -1;
    }
    .box:before {
      background-image: url(2.png);
    }
    .box:after {
      background-image: url(3.png);
    }

<p data-height="265" data-theme-id="0" data-slug-hash="RBpLvB" data-default-tab="css,result" data-user="dafeizizhu" data-embed-version="2" data-pen-title="多背景盒子" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/RBpLvB/">多背景盒子</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

未完待续。。。

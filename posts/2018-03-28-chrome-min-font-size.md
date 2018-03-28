---
layout: post
title: "关于Chrome浏览器字体最小字号12px的总结"
description: ""
category: 
tags: [css]
---

### 引用

1. [Google Chrome: Minimum font-size Issue | Ian Lai](https://www.fyianlai.com/2012/01/google-chrome-minimum-font-size-issue/)
2. [Chrome font-size 小於 12px @ Vexed's Blog :: 隨意窩 Xuite日誌](http://blog.xuite.net/vexed/tech/59449347-Chrome+font-size+%E5%B0%8F%E6%96%BC+12px)
3. [WebKit 取消桌面浏览器 -webkit-text-size-adjust 支持后，怎么在 Chrome 下设置 12px 以下的字体大小？ - 知乎](https://www.zhihu.com/question/21093147)
4. [原创，谷歌chrome浏览器字号不能小于12的终极解决方案_新闻_蛋蛋赞](http://www.twoeggz.com/news/5053945.html)

### 现象

基于`rem`的设计稿中（750像素宽），只要文字小于`24px`，在`rem`为`37.5px`的设备上，无论是多大的字号，通过Chrome查看该`font-size`属性，都为`12px`。一开始还以为是自己的样式写错了，后面怎么改，`font-size`的显示值是变了，但是计算出来的`font-size`的值还是`12px`。

### 缘由

从某个版本的Chrome开始，无论css中设置什么字号（`font-size`），只要小于`12px`，都会以`12px`的大小显示。可以这么说，Chrome认为字号小于`12px`，会影响到文字的可读性。

### 修复1

早期可以通过一个css的样式去取消这个限制：

    html, body {
      -webkit-text-size-adjust: none;
    }

引入这个样式表之后，页面的中文字就可以小于`12px`了。

### 修复2

修复1已经不能用了，因为`-webkit-text-size-adjust`这个css属性已经被废弃了，无论是Chrome和Safari都不再支持。这样，在Chrome中显示大小小于`12px`的文字全部都会以`12px`的大小显示。这意味着基于`rem`的弹性布局中，某些元素的字号无法正常缩小，导致显示异常。

这时候，只能用`transform: scale()`的方式，以`12px`的`font-size`设置文字，根据比例再进行缩小：

    // 以显示10px的字为例
    .some-small-font {
      display: inline-block;
      font-size: 12.5px;
      transform: scale(.8);
      position: relative;
      left: -12.5%;
      width: 125%;
    }

这样可以勉强解决小字体的问题。唯一一个缺点，就是这个元素的宽度，还依然占据`125%`的宽度……

### 修复3

引入javascript，可以使用通用的方式设置这些“小字体”：

    const isChrome = window.chrome !== undefined

    $(() => {
      if (isChrome) {
        $('.chrome').each((index, el) => {
          let $el = $(el)
          let fs = $el.data('fs')
          $el.css({
            'font-size': '12px',
            '-webkit-transform': 'scale(' + fs / 12 + ')'
          })
        })
      }
    })

缺点同修复2，元素依然占据原来的大小，只是字体变小了……

### 总结

通常来说，设计稿中小于`24px`（宽度750px）的文字基本不是用来阅读的，可能是一个标识或者是什么上标之类的。这时候，为了保证设计图的还原度，一是可以使用修复2的方式对具体的元素进行特殊处理，二是可以把这些小文字切成图作为背景（Orz）处理。

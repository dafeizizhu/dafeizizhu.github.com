---
layout: post
title: "换行还是不换行之white-space"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

今天又给一个换行还是不换行的问题困扰了。决定好好地研究一下块元素中的行内元素是如何控制换行的。主要从几个CSS样式入手，包括`white-space`、`word-break`等，最后会综合讨论块元素的其他CSS是如何影响行内元素的换行控制。

今天先看看`white-space`这个CSS属性。

> The white-space property specifies how white-space inside an element is handled.

`white-space`这个属性是用来声明一个元素内部的空白（包括空格还有换行符等）是如何处理的。可选的取值有以下几个：

1. `normal`，默认值，合并所有空白，当内容接触容器元素边界的时候自动换行。
2. `nowrap`，与`normal`类似，只是不会自动换行**（强制不换行必须配上这个CSS样式）**。
3. `pre`，保留所有空白，也不会自动换行。
4. `pre-wrap`，保留所有空白，会自动换行。
5. `pre-line`，除了换行符之外的空格合并，会自动换行。
6. `inherit`，继承父元素的值。

对于行内元素来说：

1. 当值是`normal`、`nowrap`和`pre-line`的时候，换行符前后的空白会被删除。
2. 当值是`pre`和`pre-wrap`的时候，多个空格组成的序列不会在遇到元素边缘的时候被中断。而`pre-wrap`则会在序列的最后自动换行。
3. 当值是`normal`和`nowrap`的时候，换行符会被转化成一个空格、一个长度为0的字符串或者压根不显示，具体如何转化需要看浏览器的实现算法。
4. 当值是`normal`、`nowrap`和`pre-line`的时候，制表符会被转化成一个空格，多个连续的空格会被归并成一个空格。

在W3上讲了一个比较有意思的例子，就是涉及到文字阅读方向的问题。假如存在下面的一段HTML片段：

    <ltr>A[1]<rtl>[2]B[3]</rtl>[4]C</ltr>

其中1、2、3、4是4个空格，`white-space`是`normal`。理论上1和2会合并，3和4会合并。但是出来的结果确是：

    A[12][34]BC

原因就是文字阅读方向杂糅（虽然这个场景在实际应用之中少之又少）。空格12是左往右读的，空格34是右往左读的，这个顺序跟HTML中的顺序是保持一致的。所以，避免出现上述情况的混淆，W3建议**在一个元素的开始和结尾不要写空白**。

总结一下，单就`white-space`这个CSS样式：

1. 强制换行，需要设置成`normal`。
2. 强制不换行，需要设置成`nowrap`。

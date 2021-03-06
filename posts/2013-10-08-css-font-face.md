---
layout: post
title: "使用fontface"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

以前我们需要引入一些自定义字体的时候，都只能在本地使用Photoshop等绘图软件写好这些字之后，做成图片放到页面上去。现在，有了`@font-face`这个工具，终于可以像本地一样使用自定义的各种各样字体了！

首先看一下`@font-face`的语法：

    @font-face {
      font-family: 'Bigelow Rules';
      font-style: normal;
      font-weight: 400;
      src: local('Bigelow Rules'), 
           local('BigelowRules-Regular'), 
           url(path/to/font.woff) format('woff');
	}

1. `font-family`，声明这个字体的名称。
2. `font-style`，声明这个字体的样式，可以是`normal`、`italic`或者是`oblique`。
3. `font-weight`，声明这个字体的加粗度，可以是`normal`、`bold`、`bolder`、`lighter`或者是100、200到900之间的数字。
4. `font-stretch`，声明这个字体是否横向的拉伸变形。
5. `font-variant`，声明这个字体是否大写，可以是`normal`或者是`small-cap`。
6. `src`，声明这个字体文件的路径，可以是本地路径`local`（字体文件从浏览器所在的机器上），或者是一个网络路径`url`。

其中`src`要注意的是除了路径之外还有一个`format`配置，声明这个字体文件的格式。虽然主流的浏览器都支持`@font-face`，但是支持的字体文件格式是不一样的：

1. `truetype`，后缀是`.ttf`，IE9以上及其他主流浏览器都支持。
2. `embedded-opentype`，后缀是`.oft`，IE不支持。
3. `woff`，后缀是`.woff`，IE9以上即其他主流浏览器都支持。
4. `eot`，后缀是`.eot`，只有IE支持。
5. `svg`，后缀是`.svg`，IE不支持。

所以如果要跨浏览器支持自定义字体，必须要提供几套不同格式的字体文件。有兴趣的童鞋可以[参考这里](http://paulirish.com/2009/bulletproof-font-face-implementation-syntax/)。

引入了`@font-face`之后，在页面中只要为特定的元素使用之前声明的`font-family`即可：

    .dfzz-navbar-brand {
      font-family: "Bigelow Rules";
    }

有几个要注意的地方。第一个是字体也受到跨域的限制，如果那个字体文件所在的域没有开放访问（HTTP头`Access-Control-Allow-Origin`），则不同域上的页面是没有办法引用这个字体的。

在字体没有下载完成之前，浏览器也会使用继承下来的字体去显示文字，当字体下载完成后再更新到制定的自定义字体。

由于中文字体的文件实在太大了，动辄几兆，所以支持中文的字体没有办法使用`url`进行加载，也不能指望用户的机器上就有特定的字体。所以现在`@font-face`只适用于一些英文的logo等纯英文的场景。

虽然有一些限制，但是能使用`@font-face`的地方我们尽量去使用，后续修改英文内容的时候就不需要再打开Photoshop去修片了哦！

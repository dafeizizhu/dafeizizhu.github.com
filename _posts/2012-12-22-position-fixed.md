---
layout: post
title: "Position: fixed 浏览器兼容性分析"
description: ""
category: 
tags: [css]
---
{% include JB/setup %}

写这个是因为现在很多门户网站都采用了顶栏固定的布局，提供导航还有一些工作（例如搜索）。对于现代浏览器来说，可以简单的使用以下这个css样式达到效果：

{% highlight css %}
.fixed {
  positon: fixed;
}
{% endhighlight %}

这个样式在Chrome、FireFox、Safari、Opera、IE7、IE8、IE9都是生效的。**其中需要注意的是，在IE7和IE8下面需要声明文档模式是标准模式才能生效**。

在IE6下需要CSS hack才能达到`position: fixed;`的效果：

{% highlight css %}
html div#fixedbox {
  position: fixed;
}
* html {
  overflow-y: hidden;
}
* html body {
  overflow-y: auto;
  height: 100%;
  padding: 0 1em 0 14em;
  font-size: 100%;
}
* html div#fixedbox {
  position: absolute;  
}
{% endhighlight %}

其中带`*`的样式只会被IE6跟IE7识别。在IE6中，需要把滚动条机制从`html`元素移动到`body`元素上，才能模拟出该效果，[参考这里](http://tagsoup.com/cookbook/css/fixed/)。

> Moving the scroll mechanism from the root element to the document body will cause absolutely positioned descendants of the body element to be fixed in respect to the viewport.

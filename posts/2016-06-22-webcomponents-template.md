---
layout: post
title: "Web Components之一：Templates"
description: ""
category: 
tags: [html5]
---

引用：

1. [HTML's New Template Tag: standardizing client-side templating - HTML5 Rocks](http://www.html5rocks.com/en/tutorials/webcomponents/template/)
2. [document.importNode - Web API 接口 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/importNode)

在后端语言中，模板这个东西已经是十分熟悉了，像PHP的Smarty，已经存在很久了。在前端这边，也有不少模板引擎，例如Handlebars等。这些模板引擎的作用大同小异，都是提供一种通用的方式渲染展现层的页面。

WhatWGi[定义](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)了一个新的HTML元素：`template`标签，在浏览器的层面提供原生的模板支持。首先我们要使用特性检测去看看当前的浏览器是否支持`template`标签：

    function supportsTemplates() {
      return 'content' in document.createElement('template')
    }

然后我们可以声明`template`标签：

    <template id='myTemplate'>
      <img src='' alt='' />
      <div class='comment'></div>
    </template>

`template`标签的内容是一些列可以拷贝的HTML元素。

如果浏览器支持`template`标签，有以下几个点需要注意：

1. `template`标签的内容在被激活时才加载，里面的标签在DOM里面是不可见的，也没有被渲染。
2. `template`标签的内容没有任何副作用：脚本不执行、图片不加载、音频也不播放……直到模板被激活。
3. `template`标签的内容在文档中通过`getElementById()`或者`querySelector()`是不会返回的。
4. `template`标签可以被放置在任何允许放置子元素的标签中，例如`head`、`body`等。

如果浏览器不支持`template`标签，例如IE，会把`template`标签里面的内容全部渲染出来！

想要使用模板，就必须先激活，不然模板的内容永远不会被渲染出来。最简单的办法是使用`document.importNode()`去创建一个`template`标签内容的拷贝：

    var t = querySelector('#myTamplate')
    // 可以修改模板的内容，例如注入数据等
    t.content.querySelector('img').src = 'logo.png'
    var clone = document.importNode(t.content, true)
    document.body.appendChild(clone)

经过这些操作之后，这个模板的内容被“激活”了，模板内部的图片加载了、脚本也执行了。

有几个使用`template`标签的陷阱：

1. 没有办法进行“预加载”，例如图片、脚本等。
2. 注意级联的`template`标签。激活外层`template`标签的时候不会自动激活内部的`template`标签，必须手动一层一层去激活。

激活模板之后的“副作用”（[例子](http://maizhiying.github.io/projects/html5/template-demo/index.html)）：

1. 模板带有的样式会覆盖当前文档的样式。
2. 模板带有的脚本会覆盖当前文档的脚本。

所以直接使用模板要注意其内部的样式、脚本会不会跟外层文档已有的样式、脚本冲突。

### 模板的标准化道路

有两种方式。第一种是使用隐藏的DOM：

    <div id='myTemplate' hidden>
      <img src='logo.png' />
      <div class='comment'></div>
    </div>

这种方式有以下优缺点：

1. 直接使用DOM，我们可以简单克隆来使用。
2. 模板的内容不会被渲染，`hidden`会阻止这个DOM的显示。
3. 不是惰性的。这个模板一旦被声明其中的图片会立刻加载。

第二种方式是使用一个浏览器不认识的脚本标签：

    <script id='myTemplate' type='text/x-handlebars-template'>
      <img src='logo.png' />
      <div class='comment'></div>
    </script>

这种方式也有以下优缺点：

1. 模板的内容不会被渲染，因为`script`标签默认是`display:none`的。
2. 模板是惰性加载的，浏览器不会解析这个`type`不是`text/javascript`的`script`标签的内容。
3. 这种使用方式有安全性的问题。由于`script`标签的内容是纯文本，容易受到XSS攻击。

参考jQuery的CSS选择器，已经通过`querySelector()`和`querySelectorAll()`两个方法变成了标准。希望`template`标签也能发展成HTML的一个标准。在[Can I USE](http://caniuse.com/#feat=template)上面，`template`标签在当前主流浏览器的主流版本上已经全部都支持了（请忽略IE）。同时，`template`标签也是Web Components的其中一个重要组成部分，下一篇将介绍下一个部分，Shadow DOM。

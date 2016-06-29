---
layout: post
title: "Web Components之四：HTML导入"
description: ""
category: 
tags: [html5]
---

### 目录

1. [Template](/posts/2016/06/22/webcomponents-template.html)
2. [Shadow DOM](/posts/2016/06/23/web-components-shadow-dom.html)
3. [Custom Elements](/posts/2016/06/24/web-components-custom-elements.html)

### 引用

1. [HTML Imports: #include for the web - HTML5 Rocks](http://www.html5rocks.com/zh/tutorials/webcomponents/imports/)

HTML导入，是在其他HTML文档中包含其他HTML文档的一种方法。还可以包含CSS、JavaSCript等`.html`文件中能包含的任何内容。

通过声明`<link rel='import'>`来在页面中包含一个导入：

    <link rel='import' href='/path/to/imports/stuff.html' />

导入的URL被称为导入地址，若想跨域导入内容，导入地址必须允许CORS。

### 特性检测与支持

要检测浏览器是否支持导入，可验证`<link>`元素上是否存在`import`：

    function supportsImports() {
      return 'import' in document.createElement('link')
    }

目前只有Chrome和开启特定配置的Firefox才支持HTML导入，详情见[这里](http://caniuse.com/#feat=imports)。

### 打包资源

可以使用导入将HTML/CSS/JavaScript打包成一个单独的可传递文件，例如：

    <link rel='import' href='bootstrap.html' />

我们可以把整个Boostrap都包裹在一个导入的`bootstrap.html`之中：

    <link ref='stylesheet' href='boostrap.css' />
    <link ref='stylesheet' href='fonts.css' />
    <script src='jquery.js'></script>
    <script src='bootstrap.js'></script>
    ...
    <template>...</template>

### Load/Error事件

当导入成功时`<link>`元素会触发`load`事件，加载失败（例如404）则会触发`error`事件：

    <script async>
    function handleLoad(e) {
      console.log('Loaded import: ' + e.target.href)
    }
    function handleError(e) {
      console.log('Error loading import: ' + e.target.href)
    }
    </script>
    <link rel='import' href='file.html' onload='handleLoad(event)' onerror='handleError(event)' />

或者动态创建导入：

    var link = document.createElement('link')
    link.rel = 'import'
    link.href = 'file.html'
    link.onload = function (e) { ... }
    link.onerror = function (e) { ... }
    document.head.appendChild(link)

### 使用内容

在页面中包含导入并不意味着“把那个文档的内容都塞到这”。它表示“解析器，去把这个文档给我取回来好让我使用”。我们可以使用标准的DOM API来操作导入的内容。

首先我们可以使用`<link>`元素的`import`属性：

    var content = document.querySelector('link[rel="import"]').import

在下面几种情况下，`link.import`的值为`null`：

1. 浏览器不支持HTML导入。
2. `<link>`没有`rel='import'`。
3. `<link>`没有被加入到DOM中。
4. `<link>`从DOM中被移除。
5. 资源没有开启CORS。

可以获取导入文档中的一部分并把它们复制到当前页面中：

    var link = doucment.querySelector('link[rel="import"]')
    var content = link.import
    var el = content.querySelector('.warning')
    document.body.appendChild(el.cloneNode(true))

### 在导入中使用脚本

导入能够访问它自己的DOM及其页面中的DOM：

    var importDoc = document.currentScript.owenerDocument
    var mainDoc = document
    var styles = importDoc.querySelector('link[rel="stylesheet"]')
    mainDoc.head.appendChild(styles.cloneNode(true))

导入中的JavaScript规则：

1. 导入中的JavaScript会在包含导入文档的`window`上下文中运行。导入中的脚本会自动运行。
2. 导入不会阻塞主文档的解析，导入中的脚本会按照顺序执行，类似拥有了`defer`的行为。

### 传输Web Components

HTML导入的设计很好的契合了在web上加载重用资源的需求。把HTML模板、自定义元素和Shadow DOM结合在一起，HTML导入就充当了Web Components中的`#include`的角色：

    // component.html
    <template>...</template>
    <script>
    // custom element
    var proto = Object.create(HTMLElement.prototype)
    proto.createdCallback = function () {
      // shadow dom
      var root = this.createShadowRoot()
      root.appendChild(document.currentScript.ownerDocument.querySelector('template').content.cloneNode(true))
    }
    // register
    document.register('shadow-element', { prototype: proto })

然后我们只要在主文档中导入这个文件就可以使用自定义元素了：

    <link rel='import' href='component.html' />
    <shadow-element></shadow-element>

### 依赖管理

将库放进一个HTML导入中，就自动避免了重复加载问题。文档只会被解析一次，脚本也只执行一次。

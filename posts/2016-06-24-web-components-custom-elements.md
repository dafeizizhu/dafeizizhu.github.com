---
layout: post
title: "Web Components之三：自定义元素"
description: ""
category: 
tags: [html5]
---

### 目录

1. [Templates](/posts/2016/06/22/webcomponents-template.html)
2. [Shadow DOM](/posts/2016/06/23/web-components-shadow-dom.html)

### 引用

1. [自定义元素：在 HTML 中定义新元素 - HTML5 Rocks](http://www.html5rocks.com/zh/tutorials/webcomponents/customelements/)

之前做过一个一个网站的重构，里面的内容是由各种`div`堆叠起来的：

    <div class='container'>
      <div class='header'>
        <div class='title'></div>
        <div class='menu'></div>
      </div>
      <div class='content'>
        <div class='thumb'></div>
        <div class='context'></div>
      </div>
    </div>

这种方式做起来最快，但是有一个问题：页面代码严重缺乏表达能力。从维护角度来看，只能看到一堆`div`，不能直观地了解每一个`div`的功能。假如HTML可以这么写：

    <container>
      <header>
        <title></title>
        <menu></menu>
      </header>
      <content>
        <thumb></thumb>
        <context></context>
      </content>
    </container>

那么每个区域都从标签的名字上得到了语义，维护人员一眼就能看到这个区域大概是做什么的。在HTML5中，尽管已经提供了很多诸如`article`、`header`等语义化的标签，但是往往不能完全满足我们的需求，更别说是什么自定义的功能等。

[自定义元素](http://w3c.github.io/webcomponents/spec/custom/)允许开发者定义新的HTML元素类型：

1. 定义新的HTML\DOM元素。
2. 基于其他元素创建扩展元素。
3. 给一个标签绑定一组自定义功能。
4. 扩展已有DOM元素的API。

### 注册新元素

使用`document.registerElement()`可以创建一个自定义元素：

    var XFoo = document.registerElement('x-foo')
    document.body.appendChild(new XFoo())

这个方法接受两个参数。第一个参数是元素的标签名。这个标签名必须包括一个连字符`-`。这个限定使解析器能很容易地区分自定义元素和HTML规范定义的元素，同时确保HTML增加新标签时的向前兼容。

第二个参数是一个（可选的）对象，用于描述该元素的`prototype`。在这里可以为元素添加自定义功能。如果忽略这个参数，默认继承自`HTMLElement`，因此上一个事例等同于：

    var XFoo = document.registerElement('x-foo', {
      prototype: Object.create(HTMLElement.prototype)
    })

### 扩展原生对象

给`document.registerElement()`传入其他`HTMLElement`子类的`prototype`可以扩展原生的DOM元素：

    var MegaButton = document.registerElement('mega-button', {
      prototype: Object.create(HTMLButtonElement.prototype)
    })

### 元素如何提升

非规范定义的元素必须使用`HTMLUnknowElement`接口。所以我们在页面中声明任何一个标签，例如`<randomtag>`，HTML解析器不会报任何错误。

而对自定义元素来说，拥有合法元素名的自定义元素（就是标签名包含一个连字符`-`）会继承自`HTMLElennt`。在没有调用`document.registerElement()`方法注册之前，这个自定义元素被称为unresolve的元素：它们是拥有合法自定义名称的HTML元素，只是还没有成功注册成为自定义元素。通过这个机制，我们可以先在HTML中写下自定义元素的标签，然后再通过脚本调用`document.registerElement()`方法进行注册。

### 实例化元素

有以下几种方式可以实例化自定义元素：

1. HTML声明：`<x-foo></x-foo>`。
2. 在JS中创建：`var xFoo = document.createElement('x-foo')`。
3. 使用`new`操作符：`var xFoo = new XFoo()`。

### 添加JavaScript属性和方法

我们可以在元素定义中加入属性和方法，创建公开API：

    var xFooProto = Object.create(HTMLElement.prototype)
    // 1. 为x-foo创建foo()方法
    xFooProto.foo = function () {
      alert('foo() called')
    }
    // 2. 定义一个只读的bar属性
    Object.defineProperty(XFooProto, 'bar', { value: 5})
    // 3. 注册x-foo的定义
    var XFoo = document.registerElement('x-foo', { prototype: xFooProto })
    // 4. 创建一个x-foo实例
    var xfoo = document.createElement('x-foo')
    // 5. 插入页面
    document.body.appendChild(xfoo)

### 生命周期回调方法

1. `createdCallback`：创建元素实例时调用。
2. `attachedCallback`：向文档插入实例时调用。
3. `detachedCallback`：从文档中移除实例时调用。
4. `attributeChangedCallback(attrName, oldVal, newVal)`：添加、移除或者修改一个属性时调用

所有生命周期回调都是可选的。注意：不要过于依赖这些生命周期方法（比如用户直接关闭浏览器标签），仅将其作为可能的优化点。

通过生命周期回调，我们可以用`createdCallback()`给元素赋予一些默认的HTML：

    var XFooProto = Object.create(HTMLElement.prototype)

    XFooProto.createdCallback = function () {
      this.innerHTML = '<b>I am an x-foo-with-markup!</b>'
    }

    var xFoo = document.registerElement('x-foo-with-markup', { prototype: XFooProto })

### 使用Shadow DOM封装内部实现

上面的例子创建出来的自定义对象内部的DOM结构对外部文档是可见的。我们可以使用Shadow DOM来封装其内部的实现：

    var XFooProto = Object.create(HTMLElement.prototype)

    XFooProto.createdCallback = function () {
      var shadow = this.createShadowRoot()
      shadow.innerHTML = '<b>I am the element Shadow DOM!</b>'
    }

    var XFoo = document.registerElement('x-foo-shadowdom', { prototype: XFooProto })

### 从模板创建元素

结合HTML提供的原生`template`标签的支持，我们可以把自定义元素相关的DOM结构提取到一个`template`标签里面：

    <template id='my-template'>
      <style> p { color: orange; } </style>
      <p>I am in Shadow DOM</p>
    </template>
    <script>
    var proto = Object.create(HTMLElement.prototype, {
      createdCallback: {
        value: function () {
          var t = document.querySelector('#my-template')
          var clone = document.importNode(t.content, true)
          this.createShadowRoot().appendChild(clone)
        }
      }
    })
    document.registerElement('x-foo-from-template', { prototype: proto })

为了缓解无样式内容闪烁的影响，自定义元素规范提出了一个新的CSS伪类`:unresolved`。在浏览器调用`createdCallback()`之前，这个伪类都可以匹配到unresolved元素：

    <style>
    x-foo {
      opacity: 1;
      transition: opacity 300ms;
    }
    x-foo:unresolved {
      opacity: 0;
    }
    </style>

### 特性检测

就是检查`document.registerElement()`是否存在：

    function supportsCustomElements () {
      return 'registerElement' in document
    }

### 浏览器支持

从[Can I Use](http://caniuse.com/#feat=custom-elements)查询得出，Chrome的主流版本（51）已经支持自定义元素，而Firefox需要打开`dom.webcomponents.enabled`这个配置才能支持。其他浏览器未提供原生的支持，不过也有一些兼容方案，最广泛使用的是Google的[Polymer](http://polymer-project.org/)。

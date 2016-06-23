---
layout: post
title: "Web Components四部曲之一：Shadow DOM"
description: ""
category: 
tags: [html5]
---

### 目录

1. [Templates](/posts/2016/06/22/webcomponents-template.html)

### 引用

1. [Shadow DOM 101 - HTML5 Rocks](http://www.html5rocks.com/zh/tutorials/webcomponents/shadowdom/)
2. [Shadow DOM 201: CSS and Styling - HTML5 Rocks](http://www.html5rocks.com/zh/tutorials/webcomponents/shadowdom-201/)
3. [Shadow DOM 301: Advanced Concepts & DOM APIs - HTML5 Rocks](http://www.html5rocks.com/zh/tutorials/webcomponents/shadowdom-301/)

Web Components是一系列前端规范，使用HTML和JavaScript可以制作交互式可视化内容。但是有个根本问题，Web Components中的DOM树并没有封装起来，封装的缺乏意味着文档中的样式表会无意中影响部件中的某些部分，或者文档中的脚本在无意中修改部件中的某些部分，文档中DOM的id也可能会把部件内部的id覆盖。

Shadow DOM解决了DOM树封装的问题。有了Shadow DOM，元素就可以和一个新类型的节点关联。这个新类型的节点称为shadow root。与一个shadow root关联的元素称作一个shadow host。shadow host的内容不会渲染，shadow root的内容会渲染：

    <button>Hellow world!</button>
    <script>
    var host = document.querySelector('button')
    var root = host.createShadowRoot()
    root.textContent = '你好，世界！'
    </script>

[例子](/projects/html5/shadow-dom-demo/index.html#demo1)在这里。如果使用JavaScript去获取`button`的内容，得到的依然是`Hellow world!`，而不是shadow root设置的文本内容，因为shadow root下的DOM子树被封装了起来。

**不应该把内容放到Shadow DOM中**。内容必须放入文档内一边屏幕阅读器，搜索引擎，扩展等类似程序可以访问到。在创建一个可重用部件的时候，那些**无意义**的标记要放进Shadow DOM中，可内容还得留在页面里。

我们可以使用Shadow DOM来将内容从展现中分离，避免外部的样式或者脚本影响到展现的样子。首先，我们要按照我们关心的语义的方式来书写标记：

    <div id='nameTag'>Bob</div>

接下来我们把所有展现相关的演示和标记都放入一个`template`标签内：

    <div id='nameTag'>Bob</div>
    <template id='nameTagTemplate'>...</template>

然后我们使用JavaScript来填充shadow root：

    <script>
    var shadow = document.querySelector('#nameTag').creatShadowRoot()
    var template = document.querySelector('#nameTagTemplate')
    var clone = document.importNode(template, true)
    shadow.appendChild(clone)

这样，我们把展现的细节隐藏在`template`标签中，展现的细节被封装在Shadow DOM中。

最后我们需要把shadow host的内容放入shadow root中。作为组件的作者可以定义一个`content`元素来完成部件的组合工作，这为组件的展现创建了一个插入点，改插入点将挑选shadow host里的内容显示到该点所在的位置上：

    <template id='nameTagTemplate'>
    ...
    <div class='name'>
      <content></content>
    </div>
    ...
    </template>

当组件渲染的时候，shadow host的内容便投影到`content`元素出现的地方。这样，我们便实现了分离内容和展现的目的。我们可以修改`template`的内容修改展现的形式，而不需要改动文档中对应的标签。[例子](/projects/html5/shadow-dom-demo/index.html#demo2)在这里。

shadow root可以使用CSS选择器来选择特定的内容：

    // shadow host
    <div id='nameTag'>
      <div class='first'>Bob</div>
      <div>B. Love</div>
      <div class='email'>bob@</div>
    </div>

    // template
    <div>
      <div style='color: red'>
        <content select='.first'></content>
      </div>
      <div style='color: yellow'>
        <content select='div'></content>
      </div>
      <div style='color: blue'>
        <content select='.email'></content>
      </div>
    </div>

规则：

1. 只能匹配到直接子元素，并不会继续往下匹配。
2. 如果一个子元素被多个规则同时匹配，则以先匹配上的规则为准，不会重复匹配。像上面的例子，`bob@`的颜色是黄色的，而不是蓝色的，[例子](/projects/html5/shadow-dom-demo/index.html#demo3)。

### 样式封装

Shadow DOM的一个核心特色叫作shadow边界，换句话说：Shadow DOM中定义的CSS样式只在Shadow DOM下生效，这意味着样式被封装了起来，例如：

    <style> h3 { color: green }</style>
    <div><h3>Normal DOM</h3></div>
    <div><h3 id='shadow'>Light DOM</h3></div>
    <script>
    var root = document.querySelector('div').createShadowRoot()
    root.innerHTML = '<style>h3 { color: red }</style><h3>Shadow DOM</h3>'
    </script>

运行[例子](/projects/html5/shadow-dom-demo/index.html#demo4)如下。

### 样式化宿主元素

`:host`允许你选择并样式化shadow树所寄宿的元素：

    ...
    root.innerHTML = '<style> :host { text-transform: uppercase; } </style>'
    ...

如上述例子，会吧shadow host的元素都改成大写。要注意的是：

1. 父页面定义的样式规则的特异性要高于元素中定义的`:host`规则，但低于宿主元素上`style`特性定义的规则。
2. `:host`仅在shadow root的范围内生效，无法用它来影响Shadow DOM外的元素。

`:host`还允许继续接其他的伪类，例如`:hover`（注：在Chrome下测试失效，见[这里](/projects/html5/shadow-dom-demo/index.html#demo6)）、`:active`等：

    <style>
    :host {
      opacity: .4;
      transition: opacity 420ms ease-in-out;
    }
    :host:hover {
      opacity: 1;
    }
    </style>

`:host`的另一个使用场景是主体化。`:host(<selector>)`接受一个选择器参数，当宿主元素或它的任意祖先元素和该选择器匹配，那么宿主元素就会匹配，[例如](/projects/html5/shadow-dom-demo/index.html#demo7)：

    :host(.different) { ... } // 仅当宿主元素是`.different`的后代元素时才会被匹配
    :host(.different:host) { ... } // 只有宿主元素本身拥有该类时才会匹配

### 使用多个shadow root

如果我们将多个shadow root托管到同一个宿主元素里会发生什么：

    <div id='example'>Light DOM</div>
    <script>
    var container = document.querySelector('#example')
    var root1 = container.createShadowRoot()
    var root2 = container.createShadowRoot()
    root1.innerHTML = '<div>Root 1 FTW</div>'
    root2.innerHTML = '<div>Root 2 FTW</div>'
    </script>

[例子](/projects/html5/shadow-dom-demo/index.html#demo8)在这，最终显示的内容是`Root 2 FTW`，这是因为最后被加入到宿主元素中的shadow树获胜，就想后进先出的栈一样。

如果我们想使用多个shadow，则需要在shadow root中使用`shadow`插入点，相比`content`插入点，它们算是其他shadow树的宿主。注意，如果一个shadow树中存在多个`shadow`插入点，那么仅第一个被确认，其余的被忽略。

看之前的例子，我们使用一个`shadow`插入点把`root`弄回来：

    <div id='example2'>Light DOM</div>
    <script>
    var container = document.querySelector('#example2')
    var root1 = container.createShadowRoot()
    var root2 = container.createShadowRoot()
    root1 = '<div>Root 1 FTW</div>'
    root2 = '<div>Root 2 FTW</div><shadow></shadow>'
    </script>

[例子](/projects/html5/shadow-dom-demo/index.html#demo9)在这，最终两个shadow root都被显示出来。

我们可以使用`.oldShadowRoot`来获取之前的shadow树：

    root2.olderShadowRoot == root1 // true

### 获取宿主的shadow root

如果一个元素托管着Shadow DOM，可以使用`.shadowRoot`来访问它的shadow root：

    var root = host.createShadowRoot()
    root.shadowRoot == root // true

如果不想别人动你的shadow root，可以将shadowRoot重定义为`null`：

    Object.defineProperty(host, 'shadowRoot', {
      get: function () { return null },
      set: function (value) {}
    })

### 使用插入点

插入点（`content`等）并不会真正移动DOM。宿主元素的节点保持不动，插入点仅仅是把节点从宿主元素重新投射到shadow树中，因此无法遍历`content`中的元素，`content`中的元素也不是Shadow DOM的子节点。

### 事件模型

有些事件会越过shadow边界，有些不会。当事件越过shadow边界时，事件的目标（`target`）会因为维护由shadow root上边界提供的封装而进行调整。也就是事件被重定向，使它看起来是从宿主元素上发出，并非从Shadow DOM的内部元素发出。

以下的事件永远无法越过shadow边界：

1. `abort`
2. `error`
3. `select`
4. `change`
5. `load`
6. `reset`
7. `resize`
8. `scroll`
9. `selectstart`

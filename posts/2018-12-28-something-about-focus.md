---
layout: post
title: "关于focus的一些事"
description: ""
category: 
tags: [JavaScript, ios]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 引用

1. [HTMLElement.focus() | MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)
2. [DocumentOrShadowRoot.activeElement | MDN](https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/activeElement)
3. [HTMLElement.blur() | MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/blur)
4. [javascript - jquery focus command doesn't work from chrome command line - Stack Overflow](https://stackoverflow.com/questions/14783585/jquery-focus-command-doesnt-work-from-chrome-command-line)
5. [iOS下无法触发focus事件的问题 - 祗想安静地的博客 - CSDN博客](https://blog.csdn.net/jingjingshizhu/article/details/83090641)
6. [解决focus事件无效 - 简书](https://www.jianshu.com/p/f233240017a4)

### `HTMLElement.focus()`

> The `HTMLElement.focus()` method sets focus on the specified element, if it can be focused.

`focus()`方法用于将一个焦点设置到一个HTML元素上面，如果该元素是可以获得焦点的。例如：

    document.getElementById('input').focus()

`focus()`方法还可以传入一个参数`options`，其中：

1. `preventScroll`，一个布尔值。如果是`true`的话，在视口外部的元素获得焦点之后不会自动滚动到视口中。如果是`false`，则元素获得焦点后会自动滚动到视口中。

默认情况下，直接调用`focus()`等于`focus({ preventScroll: false })`。

### `document.activeElement`

> The activeElement read-only property of the Document and ShadowRoot interfaces returns the Element within the DOM or shadow DOM tree that currently has focus.

这个属性会返回当前文档获得焦点的元素。如果该元素是`input`或者`textarea`，则会提供以下额外的信息：

1. `selectionStart`，元素选择范围开始的数字索引。
2. `selectionEnd`，元素选择范围结束的数字索引。

使用`document.activeElement`，可以获取文档中获得焦点的元素，还可能可以获取文档中获得焦点的元素被用户选中的部分，例如：

    // 获得焦点的元素
    var selectedTextArea = document.activeElement;
    // 获得焦点的元素的选中的部分
    var selection = selectedTextArea.value.substring(selectedTextArea.selectionStart, selectedTextArea.selectionEnd);

例子：

<p data-height="265" data-theme-id="0" data-slug-hash="WLZeEB" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="获取文档中获得焦点的元素" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/WLZeEB/">获取文档中获得焦点的元素</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### `HTMLElement.blur()`

> The `HTMLElement.blur()` method removes keyboard focus from the current element.

跟`focus()`方法相反，`blur()`方法可以使元素失去焦点：

    document.getElementById('input').blur()

### 一些小坑

有时候为了快速测试代码的正确性，会直接在控制台中输入JavaScript代码看看是否满足预期，例如：

    document.getElementById('input').focus()

在Chrome中，并没有看到元素获得焦点，是为什么呢？一开始的分析是跟`window.open()`的原理类似，如果调用`focus()`方法的动作不是由用户真实的操作（例如鼠标、键盘等）触发的话，会被浏览器拦截。之后使用一个按钮触发之后，元素顺利获得了焦点，似乎印证了这个观点。

后来为了进一步验证是否这个原因导致元素不能获得焦点，在按钮的点击处理方法里面加上异步操作：

    setTimeout(function () {
      document.getElementById('input').focus()
    }, 1000)

发现还是能正确获取到焦点！那在控制台中触发为什么无法获得焦点呢？

原因非常无语：

> You will realize that when clicking on the Chrome console, it will steal focus from any input or textarea control on the current page, and vice versa. That's because the Chrome console actually is implemented using the same HTML controls as any other HTML page, just with special properties which, for instance, prevent Chrome from inspecting the Chrome console recursively.

> When you type a command in the Chrome console, i.e. in the input control that is part of the Chrome console, it will keep the focus. The Chrome engineers might have chosen to implement it differently, but in most cases the user will want to continue typing in the Chrome console after firing a command, so no command will release focus from the console.

原因是控制台锁定了焦点！！！！！！当执行完那条JavaScript代码之后，把控制台关掉，元素获得焦点！

第二个坑就是在iOS上面，上面那个观点是成立的，即只有在用户操作直接触发的JavaScript代码调用的`focus()`才是有效的，具体例子可以参考这个例子：

<p data-height="265" data-theme-id="0" data-slug-hash="Xoerbm" data-default-tab="js,result" data-user="dafeizizhu" data-pen-title="异步获取焦点" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/Xoerbm/">异步获取焦点</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

其中有4个按钮：

1. 同步获得焦点，在iOS上是有效的，正确拉起了键盘。
2. 异步获得焦点，在iOS上是无效的，没有任何反应。
3. 同步失去焦点，在iOS上是有效的，正确隐藏了键盘。
4. 异步失去焦点，在iOS上是有效的，正确隐藏了键盘。

误打误撞地了解到了这个关于`focus()`的冷知识，哈哈。

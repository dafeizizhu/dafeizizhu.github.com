---
layout: post
title: "使用Intersection Observer API实现无限滚动"
description: ""
category: 
tags: [JavaScript]
---

### 引用

1. [使用Intersection Observer API构建无限滚动组件_Vue, Vue组件 教程_w3cplus](https://www.w3cplus.com/vue/build-an-infinite-scroll-component-using-intersection-observer-api.html)
2. [Can I use... Support tables for HTML5, CSS3, etc](https://caniuse.com/#search=Intersection)
3. [Intersection Observer API - Web API 接口 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)
4. [IntersectionObserver/polyfill at master · w3c/IntersectionObserver](https://github.com/w3c/IntersectionObserver/tree/master/polyfill)

### 概述

> Intersection observer API提供了一种方法，可以异步观察目标元素与祖先元素或顶层文件的交集变化。一直以来，检测元素的可视状态或者两个元素的相对可视状态都不是件容易事，毕竟大部分解决办法并非完全可靠，也极易拖慢整个网站的性能。然而，随着网页发展，对上述检测的需求也随之增加了。

需要用到元素交集变化的场景：

1. 懒加载图片或者其他内容。
2. 实现“无限滚动”的功能。
3. 计算元素（广告）曝光率。
4. 根据用户是否已滚动到相应区域来开始执行任务或者动画。

在这个API之前，交集检测需要通过监听类似滚动事件（或者通过定时器定时检测），以及对每个元素执行`Element.getBoundingClientRect()`方法来获取所需的信息。

使用这个API，通过注册一个回调方法，每当期望被监视的元素进入或者退出另一个元素的时候该回调方法就会被执行，或者两个元素的交集部分大小发生变化的时候回调方法也会被执行。

> 这个API覆盖最广的最常用的使用方式是"如果两个元素发生的交集部分在N%左右，我需要做处理一些事情(执行回调)"。

### 创建一个Intersection Observer

    let options = {
      root: document.querySelector('.root'),
      rootMargin: '0px',
      threshold: 1.0
    }
    let callback = (entries, observer) {}
    let oberver = new IntersectionObserver(callback, options)
    observer.observe(document.querySelector('.target'))

其中：

1. `root`和`target`：希望监听的两个元素。默认为浏览器视口。
2. `rootMargin`：`root`元素的外边距。默认为`0`。
3. `threshold`：`target`元素和`root`元素相交程度达到该值的时候回调函数就会被执行，例如可见性超过`50%`可以设置`0.5`；每多`25%`调用一次可以设置一个数组`[0, 0.25, 0.5, 0.75, 1]`。默认为`0`，表示只要一个`target`像素出现在`root`中就会被执行。

最后调用`observer.observe`方法设置`target`元素，就可以开始监听`target`元素和`root`元素交集情况发生变化的事件了。

### 回调函数

回调函数会传入两个参数：

1. `entries`，一个包含多个`IntersectionObserverEntry`实例的数组（通常只用第一个实例即可）。
2. `observer`，监听的`IntersectionObserver`实例。

`IntersectionObserverEntry`实例有如下几个属性，全部是只读属性：

1. `boundingClientRect`，目标元素的边界信息。
2. `intersectionRatio`，两个元素相交占目标元素的比例。
3. `intersectionRect`，两个元素相交的边界信息。
4. `isIntersecting`，两个元素是否相交。
5. `rootBounds`，根元素的边界信息。
6. `target`，目标元素。
6. `time`，开始监听到交叉被触发的时间戳。

### 原理

要使用这个API实现无限滚动，有以下几个步骤：

1. 一个固定高度的容器作为`root`。
2. 一个列表，里面包含所有列表项。这意味着当列表项增加的时候，这个列表的高度会自适应变高。
3. 一个“锚点”，放在列表元素的后面，作为`target`。使用这个API监听这个元素是否和`root`发生交叉，如果有交叉，则说明需要继续加载列表项。

这个“锚点”还可以用作加载中的指示器。

### 例子

HTML：

    <div class='root'>
      <ol class='list'></ol>
      <div class='target'>Loading...</div>
    </div>

CSS：

    .root {
      position: relative;
      height: 200px;
      width: 600px;
      overflow: auto;
    }

    .target {
      text-align: center;
    }

JavaScript：

    // 创建IntersectionObserver实例
    const observer = new IntersectionObserver(function([entry], observer) {
      const isIntersecting = entry.isIntersecting
      console.info("isIntersecting", isIntersecting)
      if (isIntersecting) {
        addListItem()
      }
    }, {
      root: document.querySelector('.root')
    });

    // 模拟增加列表项的API
    function addListItem() {
      setTimeout(function() {
        let listHTML = ""
        for (let i = 0; i < 10; i++) {
          listHTML += "<li>" + new Date().toString() + "</li>"
        }
        document.querySelector(".list").innerHTML += listHTML

        if (document.querySelector(".list").children.length >= 100) {
          // 模拟列表项全部加载完，调用`disconnect()`方法取消监听
          observer.disconnect()
          document.querySelector(".target").innerHTML = "NO MORE"
        }
      }, 1000)
    }
    
    // 监听锚点和`root`元素的交叉变化
    observer.observe(document.querySelector(".target"))

例子：

<p data-height="265" data-theme-id="0" data-slug-hash="yRjgby" data-default-tab="js,result" data-user="dafeizizhu" data-pen-title="Intersection Observer API" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/yRjgby/">Intersection Observer API</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

注意，这里的回调函数在页面加载完毕之后会自动调用一次。这个例子有个小问题，如果第一次加载的列表项个数不够多，`list`元素的高度没有超过`root`元素的高度，则无限滚动就会失效。应该在回调函数中判断`list`元素的高度是否比`root`元素高，如果是，则需要再一次调用增加列表项的API。

### 浏览器兼容性

通过[Caniuse](https://caniuse.com/#search=Intersection)可以看到这个API实时的兼容情况。可惜的是iOS上的Safari到当前版本还没有支持。如果想在iOS中也使用这个API，可以加入官方的polyfill即可：

    <script src="https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver"></script>

有趣的是，这个polyfill的提供者会根据浏览器的UA动态更改返回的内容，例如在当前版本桌面的Chrome访问这个链接，内容是：

    /* Disable minification (remove `.min` from URL path) for more info */

    (function(undefined) {}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

如果用IE11访问这个链接，会返回polyfill的内容。服务器检测浏览器特性，牺牲一丢丢的可靠性换取性能，看情况取舍吧。

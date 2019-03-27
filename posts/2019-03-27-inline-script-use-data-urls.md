---
layout: post
title: "优化内联脚本"
description: ""
category: 
tags: [JavaScript]
---

### 引用

1. [Asynchronous inline scripts via data: URIs / Stoyan's phpied.com](https://www.phpied.com/asynchronous-inline-scripts-via-data-urls/)
2. [彻底搞懂 async & defer · Issue #8 · xiaoyu2er/blog](https://github.com/xiaoyu2er/blog/issues/8)

### `<script>`标签的`async`特性

带有`async`的`<script>`标签有以下特性：

1. 必须带有`src`特性，内联的脚本`async`特性不生效。
1. 支持并行下载。
2. 在下载执行的过程中不阻塞解析HTML文档。
3. 当脚本下载完后立刻执行，多个带`async`特性的`<script>`标签不能保证执行顺序。

对于一些需要在`DOMContentLoaded`之前且对其他脚本无依赖的脚本，增加`async`特性可以进一步提高脚本的优先级，例如为了提高视频秒开率，为加载播放器的脚本添加`async`特性。

### 样式阻塞的场景

例如：

    <link rel='stylesheet' href='css1.css' type='text/css' />
    <script src='js1.js' async></script>
    <link rel='stylesheet' href='css2.css' type='text/css' />
    <script src='js2.js' async></script>

其中：

1. `css1.css`需要1.5秒才能加载完。
2. `css2.css`需要3秒才能加载完。
3. 两个外部脚本需要尽早执行。

记录4个时间点（与`window.performance.timing.navigationStart`的差值）：

1. `DOMContentLoaded`。
2. `load`。
3. `js1.js`的执行时间。
4. `js2.js`的执行时间。

这个场景的执行结果为：

![20190327-001](/images/20190327-001.png)

时间瀑布图为：

![20190327-002](/images/20190327-002.png)

可以看到两个外部脚本很快就执行了，结果符合我们的预期。

### 样式阻塞，且包含内联脚本

现在增加两段内联脚本：

    <link rel='stylesheet' href='css1.css' type='text/css' />
    <script src='js1.js' async></script>
    <script>console.info("inline script 1 " + (new Date().valueOf() - window.performance.timing.navigationStart))</script>
    <link rel='stylesheet' href='css2.css' type='text/css' />
    <script src='js2.js' async></script>
    <script>console.info("inline script 2 " + (new Date().valueOf() - window.performance.timing.navigationStart))</script>

增加两个时间点：

1. 内联脚本1的执行时间。
2. 内联脚本2的执行时间。

这个场景的执行结果为：

![20190327-003](/images/20190327-003.png)

时间瀑布图为：

![20190327-004](/images/20190327-004.png)

通过控制台的输出，很明显可以看到：

1. `DOMContentLoaded`的时间点明显延后到与`load`的时间点。
2. `js2.js`的执行时间明显延后，大概是需要等`css1.css`加载完才能执行。

之所以会有这些不同，是因为内联的脚本是**同步**执行的。内联脚本1需要等待`css1.css`加载并应用之后才能执行，导致整个HTML文档的解析都被阻塞了，`js2.js`也不会执行。

由于一些JavaScript的变量需要由后台直出，提高首屏时间，这种场景还是会有的。

### 尽可能消除样式阻塞

如果可以为内联的脚本增加`async`特性的支持，是不是就可以了呢？我们可以使用`data-uri`，让一个内联脚本变成一个“外部”脚本：

    <script async src='data:text/javascript,console.info(%22inline%20script%202%20%22%20%2B%20(new%20Date().valueOf()%20-%20window.performance.timing.navigationStart))'></script>

甚至可以不使用base64编码，只要`encodeURIComponent()`就可以了。使用`data-uri`之后执行的结果如下：

![20190327-005](/images/20190327-005.png)

可以看到，`DOMContentLoaded`的时间点明显提前了，所有脚本的执行时间也明显提前了很多。

### 需要注意的地方

由上图的执行结果可以看出，各个带`async`特性的脚本的执行时间是不确定的，如果各个脚本之间是有相互依赖的话，比如外部脚本是依赖于内联脚本的，需要在设计上做出一些特殊的处理。

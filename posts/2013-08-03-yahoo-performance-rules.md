---
layout: post
title: "Yahoo!性能优化规则"
description: ""
category: 
tags: [前端]
---
{% include JB/setup %}

最近接二连三地被问到有做过什么性能优化的东西，感觉之前做了很多都没有仔细总结积累下来，到用的时候还得拼命去想这些规则。现在就先看看Yslow里面的性能优化规则吧，以作参考。

###减少HTTP请求

由于请求一个外部的JavaScript或者样式表需要发送一个HTTP请求，而建立HTTP请求、接收响应这个过程会带来一些性能的开销。应该尽量避免发送太多HTTP请求，减少建立请求时造成的不必要的开销。以下是几个减少HTTP请求的方法：

1. 合并JavaScript脚本和样式表。当页面应用的脚本跟样式表的个数比较多的时候会发送等量的HTTP请求或者这些文件的内容。可以在部署的时候静态打包出合并后的release文件，或者运行时状态下动态合并相关的脚本与样式表。
2. CSS Sprites，结合`background-image`和`background-position`这两个CSS样式可以把一系列的小背景图（例如图标）全部合并到一个文件上面，减少不同样式获取背景图片的时候发送的HTTP请求。
3. Image Map，把多个图片合并到一个图片中，使用`coords`属性限制图片的显示区域，与CSS Sprites类似。
4. `data:URL`，把一些小图片的内容直接通过这个属性内联到`img`标签中，这样这个图片就不需要额外发送一个HTTP请求了。

###使用CDN内容分发网络

超过80%的响应时间消耗在等待内容下载的阶段，例如外部JavaScript脚本、CSS样式表等。所以静态资源存放在哪也影响到网站响应的效率。CDN可以帮助用户从最效率的服务器（例如地理位置最近、网络延迟最少等）返回对应的静态资源，保证静态资源的下载效率最高。这个工作在网站上线之后是最容易操作的，但是也比较容易被忽略。

这里吐槽一句，由于在我司做的项目都是基于内网用户的，所以这个没法使用CDN，相信使用了CDN之后还可能造成性能下降（囧）。

###激活缓存机制

通过配置HTTP头`Expires`或者`Cache-Controll`可以激活缓存机制。由于静态资源已经被存放到缓存中，下次请求同样的资源的时候可以直接读取缓存的内容，减少多次重复请求的资源的下载量。

这个工作可以在页面上增加对应的`meta`或者在Web容器中配置对应的HTTP头去控制缓存的机制，包括过期时间等。

###开启GZip

开启GZip后会减少这个请求在网络上传输的内容，减少请求在网络上消耗的时间。通过设置请求头`Accept-Encoding`和对应的相应头`Content-Encoding`开启GZip功能。虽然减少了网络传输的内容，但是由于内容要先经过压缩，接收到还要解压，这务必会产生一些性能的消耗。所以当请求的内容比较复杂（如图片或者pdf文档）就不应该使用GZip压缩的功能。

###把样式表尽量提前

样式表放在前面会提高页面渲染的效率。试想一下当一个HTML文档渲染好后遇到一个样式表，其中的规则务必对已渲染的内容做出改动（例如改变大小、颜色甚至是布局等），这样也会带来一定的性能开销。

把样式表放前面的另外一个优点是当HTML文档渲染好后，页面与我们期待的是一致的，而不会出现一开始什么样式都没有，然后一闪才到我们期待的样式。

###把脚本尽量放后

我们知道，浏览器页面渲染、处理用户交互跟执行代码这三个工作都是发生在一个线程里面。当加载一大段脚本的时候，页面渲染会被迫停止。假如加载的时间很长，页面就会长期保持在一个空白的状态，严重影响用户体验。所以，脚本应该在页面展现之后才加载、执行。这需要把脚本文件尽量放到`body`元素的最后面。

更好的方法是，使用动态脚本的方式加载脚本，而不直接写死在HTML页面上的`<script>`上。这样做的好处是我们可以控制脚本加载的时机，确保不会影响页面的正常展示。

###避免CSS表达式

CSS表达式最大的问题是，当交互频繁的时候（例如不断resize、不断滚动等），CSS表达式执行的次数超乎我们想象。所以尽量不要使用CSS表达式，同样的效果可以通过JavaScript的事件处理程序来实现。

###外部脚本和样式表

外部脚本和样式表不仅可以提高代码的可维护性，也可以提高页面的响应速度。由于页面使用的脚本或者是样式表会在很多页面上面共享，所以这些外部文件非常容易就被缓存起来。下次请求同样的外部脚本跟样式表的时候直接读取缓存的内容，可以提高响应速度。

###减少DNS查询次数

这条规则貌似只适用于大型网站的互相集成。由于每次获取获取域名跟主机名的映射关系也是十分耗时的，所以可以通过减少依赖的外部文件的域名来限制DNS的查询次数。但是减少域名的情况下会导致并行下载的个数也在减少。

这里也分享一个关于DNS的优化手段。如果在页面的生命周期内还要去获取其他域名上的外部文件（例如图片、脚本等），可以通过`rel`为`dns-prefetch`的`link`标签去做DNS预取，提高获取外部文件时的响应速度。

###代码压缩

由于JavaSript、CSS文件都是解析型的，没有通过编译的结果，导致在生产环境中文件的大小跟源码的大小是一致的。其实源码里面很多的空白都是可以省略的，例如注释、空格、换行等。在部署的时候对脚本和样式表进行压缩、扰码是可以大大减少这些文件的大小，也不影响实际功能的运作。内联在HTML中的脚本和样式也可以被压缩的哦。

###慎用重定向

由于HTTP状态码`301`和`302`会导致浏览器重定向，造成额外的开销，最常见的是`/show`到`/show/`的重定向，这种应该要尽量避免。

###删除重复的外部文件引用

###使用ETag

ETag是用于校验请求的资源是否发生变化的一个HTTP头。简单的说ETag的内容就是声明了一个资源的某个版本。当ETag的内容发生变化的时候说明资源发生了变化，缓存失效。配置这个头可以提高校验缓存是否失效的效率，不过会让HTTP请求头稍微大了一些。

###Ajax也可以缓存

以上就是Yahoo YSlow中的性能优化规则。不过这个只是最基本的排查点，还有很多性能优化点例如尽量使用局部变量去访问数据、限制闭包作用域链的深度、限制原型链的深度等，明天会写一篇读书笔记关于访问数据（JavaScript变量）如何提高效率的文章哦。

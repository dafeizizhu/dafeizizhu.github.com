---
layout: post
title: "HTTP客户端缓存机制"
description: ""
category: 
tags: [http, 浏览器]
---

### 引用

1. [HTTP 缓存  |  Web  |  Google Developers](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=zh-cn)
2. [使用 HTTP 缓存：Etag, Last-Modified 与 Cache-Control | Harttle Land](http://harttle.land/2017/04/04/using-http-cache.html)
3. [HTTP缓存控制小结 - 腾讯Web前端 IMWeb 团队社区 | blog | 团队博客](http://imweb.io/topic/5795dcb6fb312541492eda8c)

### 三层机制

![20180410-001](/images/20180410-001.jpg)

1. `200`，完全木有缓存，浏览器直接去服务器下载最新数据。
2. `304`，由`Last-Modified`和`ETag`头控制。
3. `200(from cache)`，由`Expires`和`Cache-Control`头控制。

### `200(from cache)`

这一层由两个头可以控制，第一个是`Expires`。这个头从http1.0就已经支持。它的值对应一个GMT时间，告诉浏览器资源缓存的过期时间，如果还没过该时间点则不发请求。

对应的，还可以通过`Pragma: no-cache`来禁用缓存：

    Expires: Fri, 11 Jun 2021 11:33:01 GMT
    Pragma: no-cache

上述的HTTP头会禁用缓存。

需要注意的是，`Expires`所定义的时间是相对于服务器上的事件而言的。如果客户端上的事件和服务器上的时间不一致，则这个缓存时间可能会异常失效。

为了解决客户端和服务器时间不一致的问题，http1.1新增了`Cache-Control`头来定义缓存的过期时间。这三个头的优先级从高到低分别是：

    Pragma -> Cache-Control -> Expires

`Cache-Control`能分别在请求头和响应头中使用。可选的值为：

1. `no-cache`，不使用缓存，要求向原服务器发起请求。
2. `no-store`，禁止浏览器以及所有中间缓存存储任何版本的返回响应。
3. `public`，即使响应里面有关联的HTTP身份验证，也可以缓存。`publish`不是必须的，明确的缓存信息（例如`max-age`）已表示响应是可以缓存的。
4. `private`，表示响应只为单个用户（UA）缓存。
5. `max-age`，指定从请求的时间开始，允许获取的响应被重用的最长时间，单位是秒。

这些值可以自由组合搭配，例如请求头：

    Cache-Control: max-age=0

表明这个请求希望获取一个存在时间不大于0秒的资源（即不使用缓存）。

响应头：

    Cache-Control: public, max-age=3600

表明这个资源可以从现在开始可以使用3600秒。

如果请求满足以上两个头使用缓存的条件，浏览器是不会向服务器发起请求的，直接从浏览器的缓存中返回响应。由于没有经过网络传输，这种情况速度是最快的。

### `304`

当请求不满足`Expires`或者`Cache-Control`头使用缓存的条件，则会进入第二层缓存机制，使用缓存校验字段校验当前缓存的内容是否失效。

第一个是`Last-Modified`头。这个头会记录这个文件最后被修改的时间（GMT）：

    Last-Modified: Fri, 22 Jul 2016 01:47:00 GMT

当浏览器接收到有这个头的响应的时候，下次再请求这个资源时会带上一个请求头：

    If-Modified-Since: Fri, 22 Jul 2016 01:47:00 GMT

服务器收到这个头后会比较这个时间跟这个资源的最后修改时间是否一致，如果一致，则直接返回`304`，告诉浏览器缓存没有失效，并根据`Cache-Control`头重新刷新本地缓存的有效时间。这个请求只有头信息，内容是空的，减少了网络传输。

这个头有一个缺点，就是当文件内容没发生变化，但是又被修改了之后，明明是有效的缓存，都会强制刷新。为了解决这个问题，http1.1还推出了`Etag`头去校验缓存是否有效。`Etag`的值是服务器根据某种算法（例如md5），为资源计算出一个唯一的标志符，在响应中，会以响应头的形式给出：

    Etag: dc80a3cdfe75d2f52780480d23d82bc9

浏览器会为这个资源保留这个头的值，在下一次请求时，会增加一个响应头：

    If-None-Match: dc80a3cdfe75d2f52780480d23d82bc9

服务器会判断这个头的值和根据这个资源计算出来标识是否一致。如果一致，则直接返回`304`。

### `200`

当请求的资源不满足上述4种情况的时候，服务器会以`200`返回完整的响应内容。

### 浏览器的刷新行为

以Chrome 65.0.3325.181为例：

1. 点击超链接，`200 (from cache)`可以生效，直接从浏览器的缓存加载内容。
2. 输入地址点回车、F5、工具栏刷新、右键重新加载，请求会加上`Cache-Control: max-age=0`禁用本地缓存，`304`可以生效。
3. Ctrl+F5强制刷新，请求会加上`Cache-Control: max-age=0`和`Pragma: no-cache`禁用所有缓存机制，内容一定以`200`返回。

### 废弃和更新缓存

我们应该以提高`200 (from cache)`的命中率，减少`304`和`200`的命中率，提高缓存的利用率，提高网站性能。这时候我们需要：

1. 在资源过期之前，一直使用本地缓存的响应，即保证`Cache-Control`缓存有效。
2. 参考`Etag`的实现方式，把标识直接加到资源的路径当中，强制客户端更新到新版本的响应。

具体实现：

1. 入口html文件不使用本地缓存，即`Cache-Control: no-cache`，或者`Cache-Control: max-age=120`，设置一个有效时间比较短的缓存机制。
2. html文件中的所有资源，例如javascript、css，甚至是图片等，加入一个超长的缓存时间，例如`Cache-Control: max-age=31536000`，保证`200 (from cache)`的命中率达到最高。
3. 当版本更新的时候，在html文件中引入的资源生成“指纹”（例如文件的md5校验码）作为新的文件名，强制客户端获取最新版本的资源。

---
layout: post
title: "前端跨域汇总"
description: ""
category: 
tags: [前端]
---

摘自[http://qiutc.me/post/cross-domain-collections.html](http://qiutc.me/post/cross-domain-collections.html)

### 跨域资源共享CORS

CORS的请求分成两种，第一种是简单请求。只要同时满足以下两大条件，就属于简单请求：

1. 请求方法是以下三种方法中的一个：`HEAD`、`GET`、`POST`
2. HTTP的头信息不超过以下几种字段：`Accept`、`Accept-Language`、`Content-Language`、`Last-Event-ID`、`Content-Type`只限于三个值：`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

简单请求的过程和客户端、服务端的配置可以参考[这里](/posts/2015/08/24/html5-cross-domain.html)。

除了简单请求意外的CORS请求是非简单请求。非简单请求是对服务器有特殊要求的请求，比如请求方法时`PUT`或者`DELETE`，或者`Content-Type`字段的类型是`application/json`。

非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为“预检”请求（preflight）。

预检发送的HTTP请求：

    OPTIONS /cors HTTP/1.1
    Origin: http://api.com
    Access-Control-Request-Method: PUT
    Access-Control-Request-Headers: X-Custom-Header
    Host: api.com
    Accept-Language: en-US
    Connection: keep-alive
    User-Agent: ...

预检请求的头信息包括两个特殊字段：

1. `Accept-Control-Request-Method`：该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法。
2. `Accept-Control-Request-Headers`：该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段。

预检请求的返回：

    HTTP/1.1 200 OK
    Date: Mon, 01 Dec 2008 01:15:39 GMT
    Server: Apache/2.0.61(Unix)
    Access-Control-Allow-Origin: http://api.com
    Access-Control-Allow-Methods: GET, POST, PUT
    Access-Control-Allow-Headers: X-Custom-Header
    Content-Type: text/html; charset=utf-8
    Content-Encoding: gzip
    Content-Length: 0
    Keep-Alive: timeout=2, max=100
    Connection: Keep-Alive

预检请求的响应头信息包括三个特殊字段：

1. `Access-Control-Allow-Methods`：必须，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。
2. `Access-Control-Allow-Headers`：如果请求头包括`Access-Control-Allow-Headers`字段，这个字段是必须的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段。
3. `Access-Control-Max-Age`：该字段可选，用来指定本次预检请求的有效期，单位为秒。在次期间内，不用发出另一条预检请求。

一旦服务器通过了预检请求，以后每次浏览器正常的CORS请求，都跟简单请求一样。参考[《跨域资源共享 CORS 详解》](http://www.ruanyifeng.com/blog/2016/04/cors.html)。

### JSONP

JSONP应该是使用最经常的一种跨域方式了，他不受浏览器兼容性的限制，但是只能发送`GET`请求，需要服务端和前端规定好。它的原理在于浏览器请求脚本资源不受同源策略限制，并且请求到脚本资源后立刻执行。

主要做法：

1. 浏览器端：注册一个回调函数名，例如`resolveJson`。这个函数接受一个参数，参数是期望得到的服务端返回的数据。函数的具体内容就是处理这个数据。然后动态生成一个`script`标签，`src`为请求资源的地址+获取函数的字段名+回调函数名称，如`http://api.com?callbackName=resolveJson`。
2. 服务端：在接收到浏览器端的脚本请求后，从URL的查询参数获取到回调函数的名字，然后动态生成一段JavaScript片段去给这个函数传入参数并执行这个函数，例如`resolveJson({name: 'api'})`。
3. 执行：服务端返回这个脚本之后，浏览器会立即执行这个脚本，这样就能根据之前写好的回调函数处理这些数据了。

### `document.domain`

这个属性用在同一个基础域名，但是在不同子域下的两个`iframe`通讯的场景。假设有以下页面：

    // http://a.api.com/a.html
    <script>
    function onLoad() {
      var iframe = document.getElementById('iframe')
      var iframeWindow = iframe.contentWindow // OK
      var doc = iframeWindow.document // not OK
    }
    </script>
    <iframe src='http://b.api.com/b.html' onload='onLoad()'></iframe>

由于当前页面和`iframe`的URL的基础域名都是api.com，我们只要把这两个页面的`document.domain`设成相同的域名就可以了：

    // http://a.api.com/a.html
    <script>
    document.domain = 'api.com'
    function onLoad() {
      var iframe = document.getElementById('iframe')
      var iframeWindow = iframe.contentWindow // OK
      var doc = iframeWindow.document // OK
    }
    </script>
    <iframe src='http://b.api.com/b.html' onload='onLoad()'></iframe>

    // http://b.api.com/b.html
    <script>
    document.domain = 'api.com'
    </script>

### `window.name`

`window`对象有个`name`属性，这个属性有个特征：即在一个窗口的生命周期内，窗口载入的所有页面都是共享一个`window.name`的，每个页面对`window.name`都有读写的权限，`window.name`是持久存在在一个窗口中的，并不会因新页面的载入而进行重置。

下面是使用`window.name`进行跨域获取数据的过程：

    // http://a.api.com/a.html
    <script>
    function getData() {
      var iframe = document.getElementById('iframe')
      iframe.onload = function () {
        var data = iframe.contentWindow.name // OK
      }
      iframe.src = 'b.html' // a blank page
    }
    </script>
    <iframe src='http://data.com/data.html' style='display: none;' onload='getData()'></iframe>

    // http://data.com/data.html
    <script>
    window.name = {name: 'api.com'}
    </script>

### `window.postMessage`

参考之前[写过的日志](/posts/2013/10/31/window-postmessage.html)。

### CSST(CSS Text Transformation)

参考[CSST (CSS Text Transformation)](https://github.com/zswang/csst)。

### Flash

通过一个Flash Object与容器HTML的脚本交互获取数据，可以用在PC Web端的低级浏览器的降级方案。

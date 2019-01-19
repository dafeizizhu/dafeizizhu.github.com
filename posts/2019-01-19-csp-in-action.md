---
layout: post
title: "了解CSP"
description: ""
category: 
tags: [浏览器, html5]
---

### 引用

1. [内容安全策略( CSP ) | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
2. [Content Security Policy 入门教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2016/09/csp.html)
3. [iframe,我们来谈一谈 - 前端的bigboom - SegmentFault 思否](https://segmentfault.com/a/1190000004502619)
4. [内容安全政策  |  Web  |  Google Developers](https://developers.google.com/web/fundamentals/security/csp/?hl=zh-cn)
5. [javascript - Detect support for HTML5 iframe sandbox attribute - Stack Overflow](https://stackoverflow.com/questions/13399415/detect-support-for-html5-iframe-sandbox-attribute)
6. [Twitch Developers](https://glass.twitch.tv/extensions/sandbox?login=true)

### 概念

> 内容安全策略(CSP)是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本(XSS)和数据注入攻击等。无论是数据盗取、网站内容污染还是散发恶意软件，这些攻击都是主要的手段。

### 目标

当页面需要引入第三方的脚本、样式或者`<iframe>`作为扩展，就免不了面对以下两个威胁：

1. XSS攻击：XSS 攻击利用了浏览器对于从服务器所获取的内容的信任。恶意脚本在受害者的浏览器中得以运行，因为浏览器信任其内容来源，即使有的时候这些脚本并非来自于它本该来的地方。这时候，需要制定脚本所来自的域名，确定该脚本是可信任的。
2. 数据包嗅探攻击：有一些攻击会利用浏览器加载不同的协议来制造攻击所用的数据包。这时候，除了限制脚本的域名之外，还需要对脚本的协议进行限制，例如只允许使用https协议等。

### 使用方法

可以在容器里面使用`Content-Security-Policy`HTTP头部来指定策略，以nginx为例：

    server {
      location / {
        add_header Content-Security-Policy <policy>;
      }
    } 

其中`policy`参数是一个包含了各种描述你的CSP策略指令的字符串。字符串是由一个或者多个部分组成，用分号分隔，每一个部分分成两项：

    <resource_1> <value>; <resource_2> <value>;

第一项是加载的资源，可以有：

1. `script-src`：脚本
2. `style-src`：样式表
3. `img-src`：图像
4. `media-src`：媒体文件（音频和视频）
5. `font-src`：字体文件
6. `object-src`：插件（例如Flash）
7. `child-src`：框架
8. `frame-ancestors`：嵌入的外部资源（例如`<iframe>`、`<frame>`、`<embed>`等）
9. `connect-src`：HTTP连接（比如`XMLHTTPRequest`、`WebSocket`、`EventSource`等）
10. `worker-src`：worker脚本
11. `mainfest-src`：manifest文件

其中有一个特殊的值：`default-src`，可以设置以上各个选项的默认值。如果设置了单个选项的限制，可以覆盖掉`default-src`上面的限制。

还可以限制与其他URL的联系：

1. `base-uri`：限制`<base#href>`
2. `form-action`：限制`<form#action>`

还有一些其他安全相关的限制：

1. `block-all-mixed-content`：HTTPS网页不得加载HTTP资源（浏览器已经默认开启）
2. `upgrade-insecure-requests`：自动将网页上所有加载外部资源的HTTP链接换成HTTPS协议
3. `plugin-types`：限制可以使用的插件格式
4. `sandbox`：浏览器行为的限制，比如不能有弹出窗口等

最后一个特殊的值就是`report-uri`，这个值可以在页面有违反CSP策略的时候把这个行为报告给一个URL。浏览器会使用`POST`方法发送一个JSON对象，例如：

    {
      "csp-report": {
        "document-uri": "https://localhost.maizhiying.me/",
        "referrer": "",
        "violated-directive": "script-src-elem",
        "effective-directive": "script-src-elem",
        "original-policy": "default-src 'self'; style-src 'nonce-EDNnf03nceIOfn39fn3e9h3sdfa'; report-uri /my-report;",
        "disposition": "enforce",
        "blocked-uri": "https://white.maizhiying.me/script.js",
        "status-code": 0,
        "script-sample": ""
      }
    }

第二项是加载这种资源的限制，可以由以下一个或者多个值组成（空格分隔），例如：

1. 主机名：`example.org https://example.org:443`
2. 路径名：`example.org/path/to/script/`
3. 通配符：`*.example.org *://example.org:*`，其中`*`可以匹配任何协议、任意子域名、任意端口
4. 协议名：`https: data:`
5. 关键字`'self'`：当前域名，需要加引号
6. 关键字`'none'`：禁止加载任何资源，需要加引号

其中，`script-src`和`style-src`还可以设置一些特殊的值：

1. `'unsafe-inline'`：允许内嵌的脚本和样式表
2. `'unsafe-eval'`：允许将字符串当作代码执行，例如使用`eval`、`setTimeout`、`setInterval`和`Function`等函数
3. nonce值：每次HTTP回应给出一个授权token，页面内嵌脚本或者样式表必须有这个token，才会执行
4. hash值：列出允许执行的脚本代码或者样式表的Hash值，页面内嵌脚本或者样式表的哈希值只有吻合的情况下，才能执行

nonce值的例子：

    #CSP
    add_header Content-Security-Policy "script-src 'nonce-abcd';";

    <!-- html -->
    <script nonce='abcd'></script>

hash值的例子：

    #CSP
    add_header Content-Security-Policy "script-src 'sha256-qznLcsROx4GACP2dm0UCKCzCG-HiZ1guq6ZZDob_Tng=';";

    <!-- html -->
    <script>alert('Hello, world.');</script>

注意，计算hash值的时候，`<script>`标签不算在内。

### `<iframe>`的`sandbox`特性

这里顺便带过`<iframe>`的`sandbox`特性。在页面不得不引入第三方页面作为`<iframe>`引入的时候，需要特别注意限制该页面的行为，例如：

1. 执行恶意脚本攻击其他网站
2. 随意向任意服务器发出请求，恶意占用客户端带宽
3. 不断创建新的弹窗
4. 模拟宿主页面发送表单到盗取用户信息
5. 加载额外恶意插件（例如Flash）

为了限制`<iframe>`内部页面的行为，可以在宿主页面的`<iframe>`元素上设置`sandbox`特性：

    <iframe src='//3rd.com/frame.html' sandbox></iframe>

默认的`sandbox`特性为`<iframe>`内部的页面做了以下限制：

1. 脚本不能执行
2. 不能通过`XMLHTTPRequest`发送请求
3. 不能使用本地存储
4. 不能创建新的弹窗
5. 不能发送表单
6. 不能加载额外插件

`sandbox`特性可以设置一些值（空格分隔），放宽一点限制：

1. `allow-forms`：允许提交表单
2. `allow-scripts`：允许执行脚本
3. `allow-same-origin`：允许同域请求
4. `allow-top-navigation`：允许主导`window.top`进行页面跳转
5. `allow-popup`：允许弹窗
6. `allow-pointer-lock`：允许锁定鼠标

通常的设置：

    <iframe src='//3rd.com/frame.html' sandbox='allow-forms allow-scripts allow-same-origin'></iframe>

[Caniuse](https://caniuse.com/#feat=iframe-sandbox)列出了这个特性的兼容性，在IE10及其他高级浏览器都支持。使用以下代码可以检测浏览器是否支持这个特性：

    var sandboxSupported = 'sandbox' in document.createElement('iframe')

### CSP实践

参考[Twitch Extension](https://glass.twitch.tv/extensions/sandbox)，使用`<iframe>`作为扩展的载体，其中有两层结构。

第一层是`<iframe>`的地址是`https://supervisor.ext-twitch.tv/supervisor/v1/index.html`，其中的CSP策略是：

    frame-ancestors https://*.twitch.tv https://*.twitch.tech https://localhost.twitch.tv:* https://localhost.twitch.tech:* http://localhost.rig.twitch.tv:*;

表示这个地址只能在以上域名的页面上，才能作为`<iframe>`的`src`。这样保护了这个页面不会被其他第三方窃取。这个页面还加入了一个`<meta>`元素：

    <meta http-equiv="Content-Security-Policy" content="frame-src 'self' https://naty2zwfp7vecaivuve8ef1hohh6bo.ext-twitch.tv">

我想是因为这个页面需要动态引入不同的第三方页面作为扩展的内容，所以在页面上输出CSP的策略会比较方便。这个CSP策略指定了该页面的`<iframe>`的`src`特性只能是当前域名或者后面设置的那个域名，该域名就是扩展内容所在的页面的域名。

第一层的页面内容只有一个`<iframe>`，其`src`特性就是扩展的内容所在的页面`https://naty2zwfp7vecaivuve8ef1hohh6bo.ext-twitch.tv/naty2zwfp7vecaivuve8ef1hohh6bo/1.0.9/f5db2a427e956916a1f78882a8777509/viewer.html?anchor=panel&language=zh-cn&locale=zh-CN&mode=viewer&state=released&platform=web
`。这一层的CSP策略比较复杂：

1. `connect-src https: wss:;`：限制只能使用`https`和`wss`连接
2. `default-src 'self' https://naty2zwfp7vecaivuve8ef1hohh6bo.ext-twitch.tv;`：默认设置，只能访问当前域名的资源
3. `block-all-mixed-content;`：不允许混合加载资源
4. `img-src * data: blob:;`：允许加载任何图片
5. `media-src * data: blob:;`：允许加载任何媒体（音频和视频）
6. `frame-ancestors https://supervisor.ext-twitch.tv https://extension-files.twitch.tv https://*.twitch.tv https://*.twitch.tech https://localhost.twitch.tv:* https://localhost.twitch.tech:* http://localhost.rig.twitch.tv:*;`：只允许被以上域名的页面作为`<iframe>`元素引入
7. `font-src https://naty2zwfp7vecaivuve8ef1hohh6bo.ext-twitch.tv https://fonts.googleapis.com https://fonts.gstatic.com;`：只允许字体从指定域名加载
8. `style-src 'self' 'unsafe-inline' https://naty2zwfp7vecaivuve8ef1hohh6bo.ext-twitch.tv https://fonts.googleapis.com;`：只允许样式表从当前域和指定域名加载
9. `script-src 'self' https://naty2zwfp7vecaivuve8ef1hohh6bo.ext-twitch.tv https://extension-files.twitch.tv;`：只允许脚本从当前域和指定域名加载

其中每个`<iframe>`元素都设置了`sandbox`特性：

    sandbox="allow-forms allow-scripts allow-same-origin"

即允许发送表单，允许执行脚本，允许发送同域的请求。

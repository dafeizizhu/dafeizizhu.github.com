---
layout: post
title: "使用Workbox体验Service worker - 入门篇"
description: ""
category: 
tags: [workbox, service worker]
---

### 引用

1. [Generate a Complete Service Worker  |  Workbox  |  Google Developers](https://developers.google.com/web/tools/workbox/guides/generate-service-worker/)
2. [Workbox 3：Service Worker 可以如此简单 | Taobao FED | 淘宝前端团队](http://taobaofed.org/blog/2018/08/08/workbox3/)
3. [Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)

### 概述

> Service workers 本质上充当Web应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。它们旨在（除其他之外）使得能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。他们还允许访问推送通知和后台同步API。

当前浏览器支持程度如[Caniuse](https://caniuse.com/#search=service%20worker)所示：

![20180822-001](/images/20180822-001.png)

有超过80%的浏览器现在都已经支持Service worker了。由于Service worker关于缓存的优先级比HTTP协议相关的缓存策略要高，我们可以用Service worker做出一套比HTTP协议更“可靠”的缓存系统。

### 使用Service worker进行缓存

1. 在页面上编写入口，加载Service worker所在的脚本。
2. 在Service worker中监听`install`事件，初始化缓存。
3. 在Service worker中监听`activate`事件，做一些例如资源过期释放的工作。
4. 在Service worker中监听`fetch`事件，拦截浏览器发出的请求，编写对应的缓存策略。

具体的例子可以参考[这里](http://taobaofed.org/blog/2018/08/08/workbox3/#%E4%B8%80%E4%B8%AA%E8%BF%98%E7%AE%97%E5%AE%8C%E6%95%B4%E7%9A%84-Service-Worker-%E7%A4%BA%E4%BE%8B)。

### 引入workbox

手写的Service worker脚本，要小心编写`fetch`的事件处理程序，通常会导致代码相当长而且相当复杂。为了解决这个问题，Google推出了Workbox：

> 可以把 Workbox 理解为 Google 官方的 PWA 框架，它解决的就是用底层 API 写 PWA 太过复杂的问题。这里说的底层 API，指的就是去监听 SW 的 install、active、 fetch 事件做相应逻辑处理等。

我们可以根据自己的需求配置Workbox，使用路由和策略来替代`fetch`中复杂的代码，既提高了可靠性，也降低了使用Service worker的门槛。具体的例子参考[这里](http://taobaofed.org/blog/2018/08/08/workbox3/#Workbox-3)。

### 使用workbox-build

以上的例子比较适合比较复杂的网站，可以根据路径动态配置缓存。作为入门，这里先引入`workbox.precaching.precacheAndRoute`来为这个博客网站使用Service worker进行缓存。使用Workbox缓存文件可以这样：

    workbox.precaching.precacheAndRoute([
      '/styles/index.0c9a31.css',
      '/scripts/main.0d5770.js',
      { url: '/index.html', revision: '383676' },
    ]);

参数是一个数组，数组的值可以是一个字符串，表示文件的URL；也可以是一个对象，其中`url`表示文件的URL，`revision`表示文件的版本。

这个博客是使用gulp构建的，我们可以在构建的流程的最后加入一个任务，扫描构建出来的文件夹，根据自己的需要缓存对应的文件。Workbox提供了`workbox-build`这个包来达到以上的目的。

首先安装`workbox-build`：

    npm install workbox-build --save-dev

然后我们在`gulpfile.js`里面加入一个任务：

    gulp.task('build-sw', function (cb) {
      return workboxBuild.generateSW({  
        globDirectory: 'site', 
        globPatterns: [        
          '**/*.{js,css,png,jpg}'
        ],
        swDest: 'site/sw.js'   
      })
    })

其中声明了需要扫描的目录、对应的Glob表达式匹配文件路径以及生成的Service worker脚本的路径。

执行`gulp build-sw`，我们可以在对应路径中找到Service worker的脚本，大概长这样：

    /* ... */

    importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

    /* ... */

    self.__precacheManifest = [
      {
        "url": "common/bootstrap/css/bootstrap-theme.min.css",
        "revision": "bf3499da1c31113720e9e395691730ba"
      },
      ...
    ].concat(self.__precacheManifest || []);
    workbox.precaching.suppressWarnings();
    workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

其中`self.__precacheManifest`就是需要缓存的文件列表，包含其路径（相对于`sw.js`）和对应文件内容的MD5戳。

最后，我们在页面的入口引入这个脚本，启动Service worker：

    // Check that service workers are registered
    if ('serviceWorker' in navigator) {
      // Use the window load event to keep the page load performant
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.info('sw registered', reg))                                                                                                                                                         
          .catch(err => console.warn('sw register failed', err))
      });
    }

**注意：只有在host是`localhost`或者是`https`协议之下才能成功安装启动Service worker。**

部署到服务器环境上，打开开发工具，可以看到：

![20180822-002](/images/20180822-002.png)

打开网络标签，可以看到：

![20180822-003](/images/20180822-003.png)

大功告成！

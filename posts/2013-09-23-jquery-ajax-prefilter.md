---
layout: post
title: "jQuery扫盲之jQuery.ajaxPrefilter"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

除了`jQuery.ajax`这个比较底层的接口之外，jQuery还提供了其他的接口供我们去控制Ajax的行为。今天就先讨论一下`jQuery.ajaxPrefilter`。

> Handle custom Ajax options or modify existing options before each request is sent and before they are processed by $.ajax().

在请求被`jQuery.ajax`处理之前，可以通过这个接口去干涉每一个请求的配置。这个方法接受两个参数：

1. `dataType`，可选的，如果提供则需要请求配置中的`dataType`是否匹配这个参数指定的值。
2. `handler`，在`jQuery.ajax`处理之前经过的过滤器，接受三个参数：
    1. `options`，Ajax请求的配置。
    2. `originalOptions`，调用`jQuery.ajax`时传入的配置。这个配置是没有`ajaxSetting`中的默认配置的。
    3. `jqXHR`，这个请求的jqXHR对象。

通过这个方法，可以做一些有趣的东西，例如jQuery文档中的这个例子：

    var currentRequests = {};
 
    $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
      if ( options.abortOnRetry ) {
        if ( currentRequests[ options.url ] ) {
          currentRequests[ options.url ].abort();
        }
        currentRequests[ options.url ] = jqXHR;
      }
    });

例子取消了重复发送的Ajax请求，这个在我们日常测试场景中也非常常见，例如疯狂点击会发送请求的按钮。

修改过滤器传入的第一个参数后，`jQuery.ajax`处理的就是我们修改过之后的参数了。以下是一个简单的URL重定向功能：

    $.ajaxPrefilter(function( options ) {
      if ( options.crossDomain ) {
        options.url = "http://mydomain.net/proxy/" + encodeURIComponent( options.url );
        options.crossDomain = false;
      }
    });

当传入第一个参数的时候，对应的过滤器只会在特定的数据类型中触发。可以传入多个数据类型，中间用空格隔开。

过滤器返回的值可以修改请求的数据类型，例如：

    $.ajaxPrefilter(function( options ) {
      if ( isActuallyScript( options.url ) ) {
        return "script";
      }
    });

当`isActuallyScript`返回`true`的时候，这个请求返回的数据类型就是`script`。这样可以保证符合规则的请求都会被当成脚本处理哦！

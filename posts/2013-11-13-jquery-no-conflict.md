---
layout: post
title: "jQuery扫盲之jQuery.noConflict"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

这个方法通常在`$`这个变量已经被占用的情况下调用，例如我们的页面已经引用了Prototype等类库（Prototype使用`$`作为`document.getElementById`的快捷方式）：

> Relinquish jQuery's control of the $ variable.

这个方法接受一个参数`removeAll`，默认是`false`，表示只释放`$`这个全局变量。如果这个参数是`true`，则表示释放所有全局变量，包括`jQuery`：

    $.noConflict();
    alert($); // undefined
    jQuery.noConflict(true);
    alert(jQuery); // undefined

这样就可以释放jQuery占用的所有全局变量了。那么要怎么用jQuery的方法呢？调用这个方法会返回一个函数，其实就是jQuery本身：

    var myJQ = $.noConflict(true);
    alert(myJQ("body").length);

还有一个方法获取jQuery的引用，就是在`jQuery.ready`的回调里面的参数：

    $.noConflict();
    jQuery( document ).ready(function( $ ) {
      // Code that uses jQuery's $ can follow here.
    });
    // Code that uses other library's $ can follow here.

回调的第一个参数就是jQuery的引用，所以在`jQuery.ready`里面就可以用这个参数使用jQuery，在外面`$`就可以表示其他的东西。

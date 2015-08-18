---
layout: post
title: "HTML5 history API"
description: ""
category: 
tags: [html5, JavaScript]
---
{% include JB/setup %}

今天偶然发现有一个需求，单击某个链接的时候，浏览器显示的URL要变化，而页面又不要跳转。这个时候可以使用HTML5的history API。

###老的HTML history API
____

在HTML4中，浏览器已经提供了一些关于历史记录的API，都在`window.history`里面：

1. `back`，相当于单击浏览器的后退按钮。
2. `forward`，相当于单击浏览器的前进按钮。
3. `go`，前进或者后退若干个历史记录。接受一个整数作为参数，正数为前进，负数为后退，`0`为刷新本页面。

###新的HTML hisotry API
____

HTML5提供了新的两个API，为了使一些SPA应用也能使用前进后退的功能。

第一个是`window.history.pushState`，往历史记录栈中压入一个记录。第二个是`window.history.replaceState`，替换掉历史记录栈中的栈顶的记录。这两个方法都接受三个参数：

1. `stateObject`，关于这个历史记录的数据。当`popstate`触发的时候，对应记录的这个数据会作为事件对象的`state`属性回传给事件处理程序。**注意，这个对象有大小限制，当对象序列化后的大小超过这个限制的时候某些浏览器会抛出异常。**
2. `title`，理论上应该是对应历史记录中浏览器应该显示的标题，但是绝大部分浏览器没有实现这个功能，而这个参数也会被忽略。
3. `URL`，浏览器显示的地址。虽然不会跳转到该地址上面，但是应该保证这个地址是可以访问的，因为当用户刷新这个页面的时候应该能正常到达当前这个状态。

对比修改`window.location.search`去更改浏览器的地址，`pushState`有以下几个优点：

1. 不仅仅可以修改`search`，`URL`还可以指定为同域中任何一个地址。
2. 不一定要去修改浏览器的地址，可以仅仅创建一个历史记录。
3. 附加数据更加简单，不需要显式写到浏览器的地址中。

`replaceState`与`pushState`的功能类似，只是不是增加，而是修改栈顶的历史记录。

###新的HTML history事件
____

在用户单击前进后退按钮时，`popState`事件会在`window`上触发。我们可以绑定这个事件，监听历史记录的变化，根据事件对象的`state`属性判断用户现在跳转到哪个历史记录，使用相关的数据去更改我们的页面。

###兼容性
____

虽然这个是HTML5的API，但是现在已经有很多库实现了跨浏览器的HTML5 history API。例如在支持HTML5的浏览器中，URL看上去是这样的：

    http://host/a.html
    http://host/b.html

在不支持HTML5的浏览器中，对应的URL可能是这样的：

    http://host/#/a.html
    http://host/#/b.html

这里是使用了老技术，更改`search`去做到更改URL而不刷新页面的功能。[这里](https://github.com/browserstate/history.js/)是其中一个history API库。使用这些库可以大大方便单页面应用的路由功能的实现难度哦亲！

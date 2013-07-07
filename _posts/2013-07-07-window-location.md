---
layout: post
title: "window.location 浅析"
description: ""
category: 
tags: [JavaScript]
---

国际惯例，先看看`window.location`在w3schools的简单描述：

> The window.location object can be used to get the current page address (URL) and to redirect the browser to a new page.

简单地说，这个对象就是用来获取页面的URL，控制页面跳转等功能。

###属性

可以通过以下属性获取关于当前页面路径的信息，也可以设置某些属性跳转到新的url上面。

1. `hash`，url中跟着`#`的内容，包含`#`。注意，**如果`#`后面没用东西或者没有`#`，则这个属性的值是空字符串**。还可以绑定`hashchange`事件监听`hash`变化。
2. `host`，由url的主机名称`hostname`跟端口`port`组成的字符串。
3. `hostname`，url的主机名称。注意，**在Chrome跟Safari是包括括号的（IPv6的情况），而IE跟FireFox则不包括括号**。
4. `href`，完整的url。
5. `pathname`，相对于主机名的路径。
6. `port`，url的端口号。如果使用的是默认端口（80），则这个属性的值是空字符串。
7. `protocol`，url的协议。
8. `search`，url中跟着`?`的内容，包含`?`。
9. `orign`，由url的协议、主机名跟端口组成的字符串。目前只有Chrome跟FireFox 21支持这个属性。

###方法

1. `assign(url)`，将当前页面跳转到指定的url。
2. `reload(forceget)`，重新加载当前页面。如果`forceget`跟true，则会强制从服务器刷新，否则浏览器可能会读取缓存。
3. `replace(url)`，与`assign`方法类似，唯一不同的是`replace`不会留下历史记录，意味着跳转后不能使用浏览器的后退功能返回前一个页面。
4. `toString`，返回完整的url（`href`）。

[参考这里](https://developer.mozilla.org/en-US/docs/Web/API/window.location#Properties)。

说到`window.location`的作用，不得不提到Ajax。在Ajax泛滥的今天，影响最大之一的就是收藏夹。传统HTML页面，一个URL会对应一个页面，页面的内容是固定的。Ajax应用中，一个页面，可能会根据用户的行为而产生不同的内容（无论是形式上还是传统的内容上）。如何去收藏经过用户操作之后的Ajax应用页面呢？其中一个比较好的办法就是使用`window.location.hash`这个属性，记录用户的简单操作。当用户操作时，记录一个简单的hash。当页面初始化时，根据hash判断Ajax应用的状态，可以基本实现收藏夹的功能，下面举个例子（完整代码[参考这里](http://jsfiddle.net/GeYw8/1/show/)）：

    <a id="a1" href="#">Click A1</a>
    <a id="a2" href="#">Click A2</a>
    <div id="content"></div>
    


    var hash = window.location.hash || "#status1";
    var text = "";
        
    switch (hash) {
        case "#status1":
            text = "This is Status1";
            break;
        case "#status2":
            text = "This is Status2";
            break;
    }
    
    $("#content").html(text);
    
    $("#a1").click(function (evt) {
        window.location.hash = "#status1";
        $("#content").html("This is Status1");
        evt.preventDefault();
    });
    
    $("#a2").click(function (evt) {
        window.location.hash = "#status2";
        $("#content").html("This is Status2");
        evt.preventDefault();
    });

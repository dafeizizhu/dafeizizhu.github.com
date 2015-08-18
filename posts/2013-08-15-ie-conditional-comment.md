---
layout: post
title: "IE条件注释"
description: ""
category: 
tags: [html]
---
{% include JB/setup %}

IE条件注释提供了一个浏览器端的手段，去做浏览器检测。这个手段不需要去判断`window.navigator`，所以不用担心各种`navigator`的篡改。但是这个手段目前只能用在IE上，但是，这不就已经够了吗？

**注意，IE10已经不支持条件注释了**。但是貌似IE10已经向W3的规范靠拢了，影响应该不大。

IE的条件注释原来有两种：

1. 不支持条件注释的浏览器不显示：`<!--[if IE 8]>...<![endif]-->`
2. 不支持条件注释的浏览器显示：`<![if IE 8]>...<![endif]>`

原理很简单，由于前者跟HTML的注释要求的格式是一样的，所以在不支持条件注释的浏览器会认为这个是一个HTML的注释，不会解析里面的HTML片段。而后者则是被认为是一个HTML标签（虽然明显不符合XML的规范……），就会解析里面的HTML片段。

前者可以为判断IE的版本决定是否需要加入额外的HTML、CSS、JavaScript来提供完整的功能，如在IE9以下的版本使用`canvas`，增加`exCanvas`的引用：

    <!--[if lt IE 9]><script language="javascript" type="text/javascript" src="excanvas.js"></script><![endif]-->

后者可以提示一些非特定版本IE的用户使用特定版本IE，如：

    <![if lt IE 8]>
    <p>Please upgrade to Internet Explorer version 8.</p>
    <![endif]>

再来看看条件注释里面的表达式，由`if`以及后面的条件表达式组成。条件表达式有三种：

1. `IE`，判断IE的版本，主版本使用整数表示，如果包含小版本则使用浮点数表示，如：`IE 5.5000`表示IE 5.5。
2. `WindowsEdition`，判断浏览器运行的Windows的版本。对应的值<a href="http://msdn.microsoft.com/en-us/library/ms724358(v=vs.85).aspx">参考这里</a>。
3. 布尔值，`true`或者`false`。

判断版本的时候可以使用以下几个操作符：

1. `lt`或者`lte`，判断是否小于或者小于等于特定版本。
2. `gt`或者`gte`，判断是否大于或者大于等于特定版本。
3. 条件以及条件之间可以通过运算符`!`、`|`、`&`进行逻辑运算。

还有一个比较有趣的就是可以在IE的插件里面判断当前插件的版本！在安装插件的时候为注册表增加以下的键值：

    HKEY_LOCAL_MACHINE
      Software
        Microsoft
          Internet Explorer
            Version Vector
              Contoso = 0.9

在插件里面可以通过以下条件注释来判断当前插件的版本：

    <!--[if lt Contoso 2]>
    <p>Your version of the Contoso control is out of date; Please update to the latest.</p>
    <![endif]-->

严格来说，使用IE条件注释也算是CSS hack的一种。相对于其他CSS hack是使用浏览器的bug实现的，这个方式算是比较靠谱的一个方式，毕竟这个不是浏览器的bug，而是浏览器提供的一种做浏览器检测的手段。如果涉及的兼容性问题只出现在各种不同版本的IE里面，为了提高代码的可读性，可以把各种fixed的代码抽取到一个外部样式表中，再使用条件注释，指示特定版本的IE加载该外部样式表。如果涉及的问题还出现在FireFox、Chrome、Safari等浏览器中，那还得考虑除了条件注释之外的css hack。

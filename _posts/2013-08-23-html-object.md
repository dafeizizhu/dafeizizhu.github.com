---
layout: post
title: "HTML Object标签"
description: ""
category: 
tags: [html]
---
{% include JB/setup %}

今天看一下`object`这个标签。

> The HTML object Element (or HTML Embedded Object Element) represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.

`object`标签用来引用一个外部资源，该资源可以是一个图片、一个被插件使用的资源。最常见的用法是用它来引入一个flash影片，如：

    <object data="move.swf" type="application/x-shockwave-flash"></object>

###HTML4

以下几个特性只能在HTML4中使用了：

1. `archive`，由空格分隔的指向档案文件的 URL 列表。这些档案文件包含了与对象相关的资源。
2. `classid`，定义嵌入 Windows Registry 中或某个 URL 中的类的 ID 值，此属性可用来指定浏览器中包含的对象的位置。
3. `codebase`，定义在何处可找到对象所需的代码，提供一个基准 URL。
4. `codetype`，通过 classid 属性所引用的代码的 MIME 类型。
5. `declare`，可定义此对象仅可被声明，但不能被创建或例示，直到此对象得到应用为止。
6. `standby`，定义当对象正在加载时所显示的文本。
7. `tabindex`，定义在文档中的`tab`键顺序。

在HTML4里面，这样引用一个flash影片可能更常见：

    <object width="400" height="40"
      classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
      codebase="http://fpdownload.macromedia.com/
      pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0">
      <param name="SRC" value="bookmark.swf">
      <embed src="bookmark.swf" width="400" height="40">
      </embed>
    </object>

###标准

1. `data`，定义引用对象数据的URL，例如flash影片的URL。
2. `height`，定义高度，单位是像素。
3. `name`，为对象定义唯一的名称（以便在脚本中使用）。
4. `type`，定义被规定在 data 属性中指定的文件中出现的数据的 MIME 类型，例如flash影片`type`就是`application/x-shockwave-flash`。
5. `usemap`，定义该文档中对应`map`元素的`name`属性（需要增加一个`#`）。
6. `width`，定义宽度，单位是像素。

###HTML5

在HTML5中`object`还有一个`from`属性，该属性的值表示与该`object`有关联的表单的id。

###param

在`object`里面还可以嵌入多个`param`对象，表示这个`object`的参数，例如：

    <object data="move.swf" type="application/x-shockwave-flash">
      <param name="foo" value="bar">
    </object>

每一个`param`就是一个键值对。特定`type`的`object`会有与之对应的`param`。

例如`object`可以在页面中嵌入图片（请务必使用`img`！）、视频、声音、flash等。还可以以插件的形式与浏览器交互，获取浏览器所在环境的一些信息。通过插件的回调机制可以把插件获取的信息返回到该页面上面，实现一些需要系统环境才能实现的功能。

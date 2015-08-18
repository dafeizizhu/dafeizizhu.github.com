---
layout: post
title: "jQuery源码解析之jQuery.fn.html"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

今天来看看`jQuery.fn.html`的源码。jQuery通过一个`access`方法封装了jQuery风格的`getter`和`setter`。今天先不关注`access`是怎么实现的，具体来看看`html`内部的代码逻辑。

首先来看一下这几个正则：

    var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
      rtagName = /<([\w:]+)/,
      rhtml = /<|&#?\w+;/,
      rnoInnerhtml = /<(?:script|style|link)/i,

1. 第一个正则是匹配一些自关闭的HTML标签。
2. 第二个正则匹配字符串中第一个标签的`tagName`。
3. 第三个正则匹配这个字符串是否HTML字符串。
4. 第四个正则匹配这个字符串里面有没有包含样式或者是脚本。

先来看`getter`，这个逻辑非常简单：

    if ( value === undefined && elem.nodeType === 1 ) {
      return elem.innerHTML;
    }

`elem`是jQuery对象的第一个元素，如果没有传入任何参数并且jQuery对象的一个元素是HTML元素，则直接返回其`innerHTML`属性。

再来看`setter`，这里有两个分支。要进入第一个分支，需要满足以下几个条件：

1. 传入的参数是一个字符串。
2. 字符串里面没有样式或者脚本，使用第四个正则表达式去匹配。
3. `wrapMap`里面没有`key`是使用第二个正则表达式匹配出来的第一个标签的`tagName`。

满足这三个条件之后，jQuery会使用第一个正则表达式匹配不应该自关闭的标签，例如`div`。如果找到这些不应该自关闭的标签，会使用以下这句代码自动替换成一个关闭的空标签：

    value = value.replace( rxhtmlTag, "<$1></$2>" );

替换完成之后，会遍历jQuery对象里面所有的元素，先使用`cleanData`去掉内部元素的所有数据和事件处理程序：

    jQuery.cleanData( getAll( elem, false ) );

并直接把元素的`innerHTML`属性设置成`value`。全部元素都处理完之后，会把`elem`的值置成`0`，这样第二个分支就不会执行了。注意，在对`innerHTML`赋值的时候可能会抛出异常。抛出异常后`elem`的值是非0的，这个情况下都会进入第二个分支。

第二个分之就是调用`empty`之后再调用`append`来获得跟直接设置`innerHTML`一样的效果：

    this.empty().append( value );

以上就是`html`的主要逻辑。`getter`很简单，就是返回`innerHTML`。而`setter`就比较复杂，如果要单纯使用`innerHTML`这个属性，要判断参数是否适合直接使用`innerHTML`，例如参数里面有脚本或者样式，则需要进入第二个分之，交给`append`去处理。

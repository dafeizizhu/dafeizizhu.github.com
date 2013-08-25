---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 with语句的应用场景"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

昨天介绍了`with`简单的用法，也大概说明了一下为什么N多书都说不要用`with`的主要原因。排除这些原因，在真实的应用场景中，有没有适合`with`使用的场景呢？

###使用有命名空间的代码

通常为了解决命名冲突问题，我们会使用命名空间，例如：

    var obj = ns1.ns2.ns3.foo(ns1.ns2.ns3.bar);

当命名空间很长的时候，编写类似的代码会非常疲惫。使用`with`可以使敲入的代码急剧减少：

    with(ns1.ns2.ns3) { var obj = foo(bar); }

是不是比第一段代码要清晰和简单很多？这是最普遍使用`with`的场景。

###测试

测试的时候我们需要把各种断言跟测试套件关联起来。如果在同步测试的场景这是非常简单的事情，在异步测试中可能会有一些问题，如果不额外增加一些信息，断言跟测试套件是不能关联起来的。

解决这个问题的其中一个办法是创建一个测试套件对象，然后在对象中进行异步测试，并且在对象中加入测试套件的信息。这样就可以通过闭包在异步断言内部获取到测试套件的信息，把两者关联起来。如以下代码：

    new Test.Unit.Runner({
      testSliderBasics: function(){with(this){
        var slider = new Control.Slider('handle1', 'track1');
        assertInstanceOf(Control.Slider, slider);
        assertEqual('horizontal', slider.axis);
        assertEqual(false, slider.disabled);
        assertEqual(0, slider.value);
        slider.dispose();
      }},
    // ...
    });

注意其中的`with(this)`的用法。这个`this`包含了所有测试需要的工具方法，例如`assertEqual`等断言方法。这样可以简化测试用例中的代码。

###模板

最后，也是最有用的一个场景，就是HTML模板。HTML模板有三个需求：

1. 可以执行内嵌在HTML模板中的代码。
2. 可以缓存整个模板方法。
3. 需要方便地读取对象中的属性。

其中第三点就可以使用`with`来方便地获取对象中的属性。通常一个HTML模板的使用方法：

    var template = Handlebars.complie("<p><%=world%></p>");

模板字符串中的占位符是需要被参数中对应的属性替换的。在模板内部的逻辑中，使用`with`之后可以直接通过该占位符引用对象中的同名属性，可以简化其替换的逻辑。

与`eval`一样，`with`本身并不可怕，可怕的是对`with`的滥用和误用。在了解`with`的具体用法以及陷阱之后，利用好`with`也可以写出清晰、精干的代码。

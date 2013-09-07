---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 跨浏览器编程策略"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

今天继续分享跨浏览器编码要注意的问题。经过昨天对跨浏览器编程的一些问题的分析，现在投入实战！

###安全修复
____

最安全的跨浏览器代码有以下两个条件：

1. a不能在其他浏览器中引入问题。
2. a不使用浏览器检测或者特性检测。

达到以上条件的最简单的方法就是统一这个API在所有浏览器中的表现。例如IE不支持事件捕获，那jQuery就只支持事件冒泡，而不支持事件捕获，即使在支持事件捕获的浏览器中也是如此表现。但是这样做的其中一个缺点，就是限制了在高级浏览器中对应的功能，如上例中的事件捕获。如何平衡这个问题，取决于代码的下游用户，看他们是否需要这些额外的功能。

###对象检测
____

通常最安全的场景是很少的，有比较多的时候我们需要对浏览器的某种对象或者特性作检测，以决定应该如何执行我们的代码。最常见的例子就是事件绑定：

    function bindEvent(element, type, handle) {
      if (element.addEventListener) {
        element.addEventListener(type, handle, false); }
      else if (element.attachEvent) {
        element.attachEvent("on" + type, handle); }
    }

在这种场景下，我们需要把标准的实现，如上例中的`addEventListener`放到检测的最前面，以保证我们的代码不会过时，而且效率较高（我们假设大多数浏览器厂商都是遵循规范行事）。

我们可以根据检测的结果决定使用哪种表现形式。如果检测的结果不尽人意，那么就需要使用一个退化的效果，例如：

1. a去除某些不影响功能的效果。
2. a使用纯HTML提供完整的功能。
3. a重定向到一个更加朴素、更加简单的页面，Gmail是这么玩的。

由于对象检测只有非常小的性能开销，而且也不会造成不好的副作用，通常会被用作保护跨浏览器代码的第一道屏障。

###特性模拟
____

但是有时候我们不仅需要检测浏览器是否支持某个对象或者某个特性，我们必须使用这些特性才能完成特定的功能。在这种场景下，我们需要为特定的浏览器提供对应特性的模拟实现。

在做特性模拟之前，需要：

1. a使用对象检测判断该特性是否存在。
2. a使用特殊的测试用例判断该特性的表现是否如我们期待。

假如表现跟我们期待的不一致，则需要使用一些额外的代码修正这个特性的表现，保持所有浏览器的行为一致。

###“不能测试”的浏览器bug
____

很不幸，有一些浏览器的bug是不能通过以上任何一个手段检测出来，例如：

1. a不能通过脚本判断事件绑定程序是否真的已经绑定到特定的DOM的特定事件上。
2. a不能判断浏览器的事件是否正确被触发。
3. a只能通过视觉判断是否正确的CSS样式无法通过代码判断是否表现正确，例如颜色、透明度等。
4. a浏览器崩溃（我也崩溃……）。
5. a不一致的API，例如表单控件的`type`，是否可以通过`attr`去设置等。
6. a各种API的性能问题。
7. aAjax问题，例如IE7不能通过Ajax获取本地文件等。

虽然以上的问题不能通过常规的手段去解决，但是我们可以通过统一API行为，或者可以通过一些编码规范来尝试减轻这些问题带来的影响。为了可维护、可扩展、可重用而奋斗终身！
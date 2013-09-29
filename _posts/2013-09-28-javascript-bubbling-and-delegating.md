---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 冒泡与代理"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

通过事件冒泡机制，我们可以把特定元素上的事件处理程序代理到其祖先元素上面。这样不仅可以统一在祖先元素上处理事件绑定，还能实现动态插入的元素的“自动绑定事件”，例如`jQuery.fn.on`等。

###把事件代理到祖先元素
____

事件代理的其中一个比较有用的场景就是绑定子孙元素的事件处理程序。如果子孙元素的个数非常多，在每一个子孙元素上绑定会生成很多个一模一样的事件处理程序，浪费内存。如果把事件绑定到祖先元素上，根据`event.target`来判断是哪个子孙元素触发了这个事件，则只绑定了一个事件处理程序而逻辑也能保持一致，例如：

    var table = document.getElementById("someTable");
    addEvent(table, "click", function (event) {
      if (event.target.tagName.toLowerCase() == 'td') {
        event.target.style.backgroundColor = 'yellow';
    });

浏览器的事件冒泡机制保证了以上的代码是可行的。所以要注意，代理只能代理到元素的祖先元素上，而且要保证事件能够顺利冒泡到该祖先元素。

###处理浏览器差异
____

有四个特殊的事件，`submit`、`change`、`focus`、`blur`，它们的事件冒的实现在不同的浏览器中有一些差异。简单来说，在W3规范中，`submit`和`change`是可以冒泡的，但是低版本的IE浏览器这两个事件是不能冒泡的；而`focus`和`blur`则都不支持冒泡，但是为了能实现事件代理，我们又需要它们能冒泡。

**检测是否支持特定事件冒泡**

这里有一段检测是否支持特定时间冒泡的代码：

    function isEventSupported(eventName) {
      var element = document.createElement("div");
          isSupported;
      eventName = 'on' + eventName;
      isSupported = (eventName in element);
      if (!isSupported) {
        element.setAttribute(eventName, 'return;');
        isSupported = typeof element[eventName] == 'function';
      }
      element = null;
      return isSupported;
    }

**处理submit**

`submit`事件可以通过以下两个场景触发：

1. 通过单击一个`type`是`submit`的`input`或者是`button`触发。
2. 通过单击一个`type`是`image`的`input`触发。
3. 通过在一个`type`是`text`或者是`password`的`input`按下回车触发。

以上的单击或者是按下回车的事件都是可以冒泡的，所以只要把`submit`的事件处理程序绑定到`click`和`keypress`下就可以让本来不支持`submit`冒泡的浏览器支持其冒泡。

**处理change**

实现`change`的冒泡要比`submit`难，需要绑定一堆事件处理程序：

1. 绑定`focusout`，检查`value`是否发生变化。
2. 绑定`click`和`keydown`，检查`type="radio"`等表单域的值是否发生变化。
3. 绑定`beforeactive`，获取表单域的初始值。

**实现focus和blur的冒泡**

虽然标准上`focus`和`blur`都不支持事件冒泡，但是为了能完整实现整一套事件代理机制，需要它们也能支持冒泡。在IE上提供了它自己的实现，就是`focusin`和`focusout`事件，这两个事件是可以冒泡的。我们需要做的就是在标准浏览器中模拟`focusin`和`focusout`的实现。

最简单的实现就是在执行具体绑定事件处理程序的代码（例如`addEventListener`）中加入对`focusin`和`focusout`的支持：

    elem.addEventListener(
      type === "focusin" ? "focus" : 
        type === "focusout" ? "blur" :
        type,
      data.handler,
      type === "focusin" || type === "focusout");

这个代码通过把`focusin`和`focusout`绑定到对应的`focus`和`blur`事件，针对这两个事件使用事件捕获（祖先元素先触发）的机制进行处理。这样就可以在标准实现的浏览器中模拟`focusin`和`focusout`的效果。

**实现mouseenter和mouseleave**

这两个非标准事件是IE引入的，以简化判断鼠标是否在某个元素上面。首先要了解这两个事件跟标准中的`mouseover`和`mouseout`有什么区别。以`mouseover`为例，当鼠标移动到元素上面的时候会触发这个事件。但是有一个场景，就是鼠标从该元素的子元素移动到该元素上，这个事件也会触发。这个行为有时候是不需要的，甚至是多余的。而`mouseenter`在第二种场景下面是不会被触发的。所以这是我们实现这两个非标准时间的原因。

跟`focusin`和`focusout`的处理方式一致，我们需要在其他浏览器上模拟这两个事件。实现十分简单，就是绑定在标准的`mouseover`和`mouseout`事件上，然后判断`event.relateTarget`，判断元素是否其祖先元素即可：

    function widthinElement(elem, event, type, handle) {
      var parent = event.relatedTarget;
      while (parent && parent != elem) {
        try {
          parent = parent.parentNode;
        } catch (e) {
          break;
        }
		if (parent != elem) {
          handle.call(elem, type);
        }
      }
    }
    addEvent(elem, "mouseover", function (e) {
      widhinElement(elem, e, "mouseleave", fn);
    });

---
layout: post
title: "beforeunload事件"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

去jsFiddle写代码片段的时候，如果没保存又去关闭浏览器的话，会弹出一个浏览器自带的消息框，提示是否要离开这个编辑中的页面。这种类似的功能使用的就是`beforeunload`这个事件。

> The beforeunload event is fired when the window, the document and its resources are about to be unloaded.

这个事件在页面即将被unload的时候触发，并可以通过返回值告诉浏览器是否要弹出消息框。如果返回非空字符串，则浏览器会弹出消息框，并显示返回的字符串；否则这个事件的处理程序会静默地执行。

注意，这个事件不能让浏览器跳转到某个URL，例如以下的代码是无效的，例子[参考这里](http://jsfiddle.net/wpMpa/5/show/)：

    $(window).on("beforeunload", function () {
      window.location.href = "http://some.other.site"; // 这句代码没有任何作用
      return "Are you sure to leave?";
    });

还有一个值得注意的地方是，FireFox、IE跟Safari、Chrome对显示信息的处理方式也不一样。前者是通过事件对象的`returnValue`属性去控制显示信息，而后者则是通过`return`返回的字符串控制显示信息。以下是一个兼容多个浏览器的写法：

    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
      (e || window.event).returnValue = confirmationMessage;     //Gecko + IE
      return confirmationMessage;                                //Webkit, Safari, Chrome etc.
    });

这个事件的效果不能通过弹出自定义的对话框（例如jQuery UI中的dialog）来模拟同样的效果哦。如果不需要弹出确认框，又需要在页面卸载的时候处理一些逻辑，例如垃圾回收之类的操作，那最好还是绑定`unload`事件。以后也会继续讨论`unload`事件的用法。

坚持自己的步伐，不回头，默默地前进，共勉之。

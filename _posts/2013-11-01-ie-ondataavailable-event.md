---
layout: post
title: "IE的dataavailable事件"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

虽然`postMessage`已经是跨`iframe`通讯的一个比较完善的解决方案了，但是，如果，要IE8及以上的版本才支持这个方法。如果这两个`iframe`是同域的话，其实是可以直接通过脚本操作两个`window`，直接调用其内部方法就行通讯：

    // outer
    var innerWin = document.getElemenetById("iframe").contentWindow;
    innerWin.doSomething();
    // inner
    function doSomething() {
      alert("outer message!");
    }

其实还有一个方法，就是`dataavailable`事件。这个事件是IE特有的事件，当数据源对象的数据准备好之后，可以触发这个事件来通知其他对象。

这个事件像其他标准事件一样，可以使用以下几个方式来绑定：

1. 在HTML里面：`<element ondataavailable="handler"></element>`。
2. 作为属性：`object.ondataavailable = handler;`。
3. 使用`attachEvent`：`object.attachEvent("ondataavailible", handler);`。
4. 在IE9还可以使用`addEventListener`：`object.addEventListener("dataavailible", handler, useCapture);`。

由于这个事件不是用户触发的，我们需要使用脚本在特定的对象上触发这个事件：

    var event = document.createEventObject();
    object.fireEvent("ondataavailable", event);

值得开心的是，连IE6都支持这个事件。通过这个事件，我们可以做一个跨`iframe`通讯的函数：

    var Messenger = function (targetWin) {
      var me = this;
      document.attachEvent("ondataavailable", function (event) {
        if (!event.eventType ||
            event.eventType !== "message" ||
            event.eventSource != targetWin)
          return;
        $(me).trigger("onmessage", event.eventData);
      };
      this.send = function (msg) {
        var event = targetWin.document.createEventObject();
        event.eventType = "message";
        event.eventSource = window;
        event.eventData = msg;
        targetWind.document.fireEvent("ondataavailible", event);
      }
    };

以上代码构造了一个双向通讯的一对一的管道，我们可以透过这个管道在两个`iframe`之间交换信息。

既然是同域的，为什么不直接互相调用两个`window`里面的方法，而要使用这个事件呢？我自己觉得最主要的一点是不需要在两个`window`附加额外的全局函数（例如最上面的`doSomething`）。而且IE6都支持，何乐而不为呢？

如果跨域`iframe`之间的通讯，就不能用这个事件了，因为`targetWin.document`是不让访问的，这时候就要求助于`window.name`了。

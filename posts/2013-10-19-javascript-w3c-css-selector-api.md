---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 W3C CSS选择器API"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

由于jQuery的风靡，W3C在规范中加入了浏览器内置的CSS选择器引擎，来减少我们去实现一个纯JavaScript的CSS选择器引擎所导致的额外工作量。所有现代浏览器都已经实现了对应的API，并且如果该浏览器完全支持CSS3的话，所有CSS选择器都是可用的。

浏览器提供了以下两个API供我们使用CSS选择器去选择我们要操作的DOM：

1. `querySelector`，该方法接受一个CSS选择器，并返回匹配的**第一个**DOM元素。
2. `querySelectorAll`，该方法接受一个CSS选择器，返回一个包含所有匹配的DOM元素的一个`NodeList`。

这两个方法在所有`document`、`documentFragment`和DOM元素上都有。在哪个对象上调用这些API即视该DOM为根元素，会在该对象的子孙寻找匹配的元素。

恐怕这些API最大的局限性就是浏览器对CSS选择器的支持程度，而纯JavaScript实现的CSS选择器则不会受到浏览器默认实现的影响。而且还有一个可能看起来比较别扭的使用场景：

    <div id="test">
      <b>Hello</b>, I'm a ninja!
    </div>
    <script type="text/javascript">
      window.onload = function () {
      var b = document.getElementById("test").querySelector("div b");
      assert(b, "Only the last part of the selector matters.");
    };
    </script>

在这个例子里面，选择器的愿意是寻找`div`子孙中的`b`。但是由于`querySelector`是在`div`上调用的，而这个元素是不计入选择器的匹配范围的，即上面的代码是找`div`下面的`div`下面的`b`，所以自然就匹配不上了。

为了能让选择器能从根元素上开始匹配，我们需要编写另外一个API去实现这个功能：

    (function() {                       
      var count = 1;
      this.rootedQuerySelectorAll = function (elem, query) { 
        var oldID = elem.id;                                 
        elem.id = "rooted" + (count++);          
        try {
          return elem.querySelectorAll("#" + elem.id + " " + query);
        }
        catch (e) {
          throw e;
        }
        finally {
          elem.id = oldID;             
        }
      };
    });

通过加入一个`id`选择器（该`id`就是根元素的`id`，是我们临时设置的）去实现从根上进行匹配的API。

使用浏览器提供的API，可以让现在的JavaScript库中关于DOM选择的一大段代码变成一行代码。随着浏览器对CSS支持的完善，还有旧浏览器的退出市场，浏览器提供的CSS选择器的用武之地必然会大大提高！

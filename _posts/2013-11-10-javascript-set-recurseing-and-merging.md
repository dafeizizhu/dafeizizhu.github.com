---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 递归与合并"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

CSS选择器引擎需要递归访问元素及其子孙元素，然后合并多个匹配的结果，返回完整的结果。但是我们需要保证这个结果的结合里面没有重复的元素。由于调用类似`getElementsByTagName`这样的API，如果在子孙元素上调用的时候会返回相同的结果，例如：

    <div id="outer">Outer
      <div id="middle">Middle
        <div id="inner">Inner</div>
      </div>
    </div>

如果这么调用：

    document.getElementById("outer").getElementsByTagName("div"); // middle and inner
    document.getElementById("middle").getElementsByTagName("div"); // inner

可以看到两个都返回了`inner`，这样的重复明显是不必要的，所以我们需要一些额外的机制去判断这个元素是否已经存在在集合当中了：

    this.unique = function(array) {
      var ret = [];
      run++;
      for (var i = 0, length = array.length; i < length; i++) {
        var elem = array[i];
        if (elem.uniqueID !== run) {
          elem.uniqueID = run;
          ret.push(array[i]);
        }
      }
      return ret;
    }

其中`run`是一个计数器，生成全局唯一的标识。使用这个方法可以从集合中过滤出重复的元素，返回的集合里面就没有重复的元素了。

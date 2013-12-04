---
layout: post
title: "使用flashvars传递参数"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

我们可以使用可选的`name`为`flashvars`的参数传递参数到Flash影片中。这些参数在Flash影片播放第一帧之前传递到Flash影片之中。

这个参数是一个字符串，只有一个长度限制，就是最多只能传64KB的数据。

格式跟URL的查询串十分类似，也是`key=value&key=value`这样的格式，也可以使用`encodeURIComponent`和`decodeURIComponent`对里面的值进行编码和解码。

在`object`标签里面是这么使用：

    <object>
      <param name=FlashVars value="myVariable=Hello%20World&mySecondVariable=Goodbye" />
    </object>

在`embed`标签里面是这么使用：

    <embed FlashVars="myVariable=Hello%20World&mySecondVariable=Goodbye" />

然后我们就可以在AS里面获取这些参数了。在AS3中，可以通过`this.loaderInfo.parameters`获取这些参数：

    var params:Object = this.loaderInfo.parameters;
    trace(params.myVariable); // Hello World
    trace(params.mySecondVariable); // Goodbye

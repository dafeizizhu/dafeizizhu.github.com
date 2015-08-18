---
layout: post
title: "使用ShareObject中的data"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

昨天讨论了Flash中的“cookie”，`ShareObject`的简单使用方式，今天来讨论一下如何读写这个“cookie“中的数据。

通常，我们会使用`ShareObject`的静态方法`getLocal`获取一个本地的共享对象：

    var test:SharedObject = SharedObject.getLocal("test");

然后我们可以访问`test`的`data`属性，对这个共享对象的数据进行读写操作。注意，这个`data`本身是只读的，所以以下的代码是无效的：

    test.data = "someValue";

我们可以直接在`data`上存储一些数据，可以是任何ActionScript或者JavaScript类型的对象（数组、数字、布尔值、对象等）：

    test.data.number = 1;
    test.data.string = "String";
    test.data.obj = {"a": 1, "b": "string"};
    test.data.arr = [2, "a"];
    test.data.sprite = new Sprite();

当程序关闭的时候，这些数据会保存到本地文件中，下次只要使用同样名称的共享对象就可以把这些数据读取回来。

要删除共享对象的数据，要使用`delete`运算符来删除：

    delete test.data.number;

而不能把这个值设置成`null`或者`undefined`，设置成这两个值不会删除这个属性。

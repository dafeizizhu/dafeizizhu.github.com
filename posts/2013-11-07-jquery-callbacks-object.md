---
layout: post
title: "jQuery扫盲之callbacks对象"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

callbacks对象是使用`jQuery.Callbacks`返回的对象，可以使用这个对象去管理回调函数列表。

###增加

调用`callbacks.add`就可以往列表里面增加一个或者多个回调函数：

    callbacks.add(function () {...});

###删除

调用`callbacks.remove`可以在列表中删除一个或者多个回调函数：

    callbacks.remove(foo);

也可以使用`callbacks.empty`清空整个回调函数列表：

    callbacks.empty();

###查询

调用`callbacks.has`可以判断一个回调函数是否在列表里面：

    callbacks.add(foo);
    alert(callbacks.has(foo)); // true

###触发

调用`callbacks.fire`可以把回调函数列表中的函数都执行。这个方法接受可变参数列表，这些参数都会传递到每一个回调函数中：

	callbacks.add(function (a) {
      alert(a);
    });
    callbacks.fire("abc"); // alert("abc");

还可以使用`callbacks.fireWith`制定一个回调函数的执行上下文：

    callbacks.fireWidth(contenxt, args);

调用`callbacks.fired`判断当前这个回调函数列表有没有至少被触发一次：

    callbacks.fire();
    alert(callbacks.fired()); // true

###禁用

调用`callbacks.disable`可以禁用这个回调函数列表，即使调用了`callbacks.fire`回调函数都不会触发：

    callbacks.disable();

可以调用`callbacks.disabled`判断当前这个回调函数列表是否被禁用了：

    callbacks.disable();
	alert(callbacks.disabled()); // true

###锁定

调用`callbacks.lock`可以锁定这个回调函数列表，在锁定之前加入的回调函数不会再被触发。当调用`jQuery.Callbacks`时传入了`memory`这个标志位，新加入的函数仍然可以被触发，只是参数被锁定在锁定之前最后一次`fire`时所提供的参数：

    callbacks.add(function (a) { alert(a); });
    callbacks.fire("first");
    callbacks.lock();
	callbacks.add(function (a) { alert("again " + a); });
    callbacks.fire("second"); // again first

同样地可以调用`callbacks.locked`判断当前这个回调函数列表是否被锁定了：

    callbacks.lock();
    alert(callbacks.locked()); // true

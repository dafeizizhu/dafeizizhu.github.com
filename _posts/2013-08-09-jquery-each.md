---
layout: post
title: "jQuery源码解析之jQuery.each"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

昨天讨论了`for...in`的用法，今天来看一个可能我们日常使用频率更高另外一个遍历的方法：`jQuery.each`。先来看看jQuery对`each`的描述：

> A generic iterator function, which can be used to seamlessly iterate over both objects and arrays. Arrays and array-like objects with a length property (such as a function's arguments object) are iterated by numeric index, from 0 to length-1. Other objects are iterated via their named properties.

从描述中可以看出来，`jQuery.each`即可以遍历数组（包括`arguments`对象），也可以遍历一个对象上的属性。该方法接受两个参数：

1. `collection`，需要遍历的数组或者对象。
2. `callback`，遍历时的回调函数，该函数接受两个参数，一个是这次遍历的下标（数组）或者键值（对象），另一个是这次遍历的迭代子的值。

执行这个方法返回的是被遍历的对象，便于写出链式写法的代码。

在每次遍历的回调中，我们可以通过`return false`来实现`for`循环中的`break`功能，通过返回非`false`的值来实现`continue`的功能。如以下代码：

    $.each([1, 2, 3, 4], function(i, v) {
      if (v === 1) {
        return true;
      }
      if (v === 3) {
        return false;
      }
      console.log(v);
    });

执行结果[参考这里](http://jsfiddle.net/HWh6Y/show)。

再来看看最新的jQuery的`each`的源码。

    // args is for internal usage only
    each: function( obj, callback, args ) {

首先可以看到原来`each`是接受三个参数的，第三个参数只能内部使用。首先使用`isArraylike`来判断`obj`是否一个类似数组的东西（如有`length`属性，并可以通过下标访问等）。如果是，则用普通的`for`循环来遍历这个数组；如果不是，则使用`for...in`来遍历这个对象。这里分享一个小插曲，在`isArraylike`函数里面有这么一句代码：

    return type === "array" || type !== "function" &&
        ( length === 0 ||
        typeof length === "number" && length > 0 && ( length - 1 ) in obj );

最后那个`(length - 1) in obj`是什么意思呢，为啥这样可以说明这个`obj`是一个类似数组的东西？原来`[1, 2]`的内部结构可以这么表述：

    {"0": 1, "1": 2}

所以`length - 1`这个键在类似数组的对象中是存在的，而其他对象如果键值没有显式声明成`1`的话是不会符合这个规则的。所以这个也被用作是判断一个对象是否是一个类数组的条件之一。使用这个条件可以弥补只判断`length`属性是否是数字的不足。

当提供了第三个`args`参数时，在调用回调的时候会使用`apply`把`args`当作参数传到回调中，否则会使用`call`把下标或者键值、对应的值当作参数传到回调之中，后者也是我们日常使用的场景。回调函数执行的上下文`this`都是当前遍历的值，也就是日常使用场景中的第二个参数。

如果回调返回了`false`则停止遍历。要注意，如果要使用`break`的功能，一定要`return false`，不能返回强制转换后是`false`的值，例如`0`或者空字符串等等。因为这里使用的是`===`来判断：

    value = callback.call( obj[ i ], i, obj[ i ] );
    if ( value === false ) {
      break;
    }

遍历对象的时候是使用了普通的`for...in`循环，并没有像昨天讨论的加上`hasOwnProperty`的保护，所以使用`jQuery.each`会遍历所有能被遍历的属性，包括原型链上的属性哦。

最后就是一些小细节了，例如无论是下标或者键值都用同一个变量`i`作为迭代计数、`for`循环中连迭代计数的初始化`i = 0`都省略了等。前者可以减少局部变量的数目，后者可以使代码压缩后体积更小（虽然效果有限……）。

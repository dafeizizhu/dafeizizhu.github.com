---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 面向对象陷阱"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

又到了周末读书的时间了。今天跟大家分享一下书中关于原型、实例化和继承的一些陷阱。

###扩展`Object`

先来看看扩展`Object.prototype`可能会发生什么潜在的问题。假如我们为`Object`的原型增加一个获取对象上键值的个数，可能会这么写：

    Object.prototype.keys = function() {      
      var keys = [];
      for (var p in this) keys.push(p);
      return keys;
    };
    var obj = { a: 1, b: 2, c: 3 };              
    alert(obj.keys());

结果返回了`[a, b, c, keys]`。这种遍历方式甚至把我们刚才扩展`Object.prototype`的那个`keys`方法都遍历出来了！一般情况下，我们对一个对象进行遍历，是不需要把对象上的方法遍历出来的。解决上面的问题，一种方案是判断遍历的值是否是方法，另一种方案就是使用`hasOwnProperty`来判断对象是否拥有这个属性，过滤掉原型链中的其他属性。

###扩展`Number`

为`Number.prototype`做扩展要注意的是，在其文档中要说明如何使用这个扩展。假设我们为`Number.prototype`增加了一个`add`方法，那只能按以下的方式调用：

    var n = 5;
    n.add(2);

或者

    (5).add(2);

而不能

    5.add(2);

最后一行代码有语法错误，会导致JavaScript脚本无法顺利执行。所以最好的解决方案是**不要对`Number.prototype`进行扩展**。

###派生内置“类”

假如我们需要数组的功能，例如`push`、`pop`等，又想在不增加原来`Array`的功能，那我们可以使用以下的代码，继承`Array`，派生一个自定义的“类”：

    function MyArray() {}
    MyArray.prototype = new Array();

这段代码在FireFox和Chrome上都是好使的，但在IE下就会有问题，因为IE对数组的`length`的处理是不同的。这种场景对应的解决方案是使用拷贝数组中有用的功能，重新构造一个“类”。

*注：测试发现IE7、8、9中以上的代码都是没问题的，不知道问题是否只存在于IE6……例子可以[参考这里](http://jsfiddle.net/ERcFg/3/)。*

###实例化

假如有以下一个函数：

    function User(first, last){
      this.name = first + " " + last;
    }

这个明显是一个构造函数，正确的调用方法应该是这样：

    var user = new User("Ichigo", "Kurosaki");

但是值得注意的是这个函数也可以像普通函数那样直接执行（即省略`new`）。当省略`new`之后，不仅`user`会是`undefined`，更严重的影响可能是在全局作用域中增加了一个`name`属性（`this` === `window`）。虽然这种调用我们可以通过文档来说明调用的方式，但是还有更健壮的实现：

    function User(first, last) {
      if (!(this instanceof arguments.callee)) { 
        return new User(first,last);                  
      }                                                
      this.name = first + " " + last;
    }

这里先使用`instanceof`来判断`this`是否这个“类”的实例，如果不是则自动以构造函数的方式再调用一次。这种实现的好处无疑是增加了健壮性，无论用户如何调用这个方法，都会返回一个`User`的实例。但是使用这个实现的时候还需要考虑以下几点：

1. `arguments.callee`在往后的JavaScript标准中已经被废弃了，而且在严格模式下使用这个属性是会报错的。可以硬编码成`User`，牺牲少许灵活性。
2. 这样做导致一个功能有两种调用形式，这对API的一致性是不利的。
3. a这样做也限制了用户把这个函数当成普通函数执行的权力。

关于JavaScript OO的各种陷阱还有很多，日常编码的时候一定要注意多在不同的设备、不同的平台、不同的浏览器进行测试。在考虑实现的时候也要想想这个功能是否真需要用OO来实现，毕竟JavaScript只是一个基于对象的语言，而不是一个完整的面向对象的语言。

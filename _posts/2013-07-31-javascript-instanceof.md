---
layout: post
title: "JavaScript instanceof操作符"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

JavaScript中的`instanceof`操作符通常是用来判断一个对象是否具体“类型”的“实例”，比较常见的用法是：

    if (obj instanceof Array) { ... }

大家有没有想过这个`instanceof`操作符是怎么判断一个对象是否一个“类型”的实例呢？

> instanceof运算符可以用来判断某个构造函数的prototype属性是否存在另外一个要检测对象的原型链上。

通常来说，一个`obj instanceof c`中，会比较`obj`的`__proto__`是否存在于`c`的原型链上。在[JavaScript instanceof 运算符深入剖析](http://www.ibm.com/developerworks/cn/web/1306_jiangjj_jsinstanceof/)中有一段JavaScript代码模拟了`instanceof`的执行过程：
    				
    function instance_of(L, R) {//L 表示左表达式，R 表示右表达式
      var O = R.prototype;// 取 R 的显示原型
      L = L.__proto__;// 取 L 的隐式原型
      while (true) { 
        if (L === null) 
          return false; 
        if (O === L)// 这里重点：当 O 严格等于 L 时，返回 true 
          return true; 
        L = L.__proto__; 
      } 
    } 

注意哦，同一个对象对同一个构造函数作`instanceof`运算的结果不是一成不变的。构造函数的原型链是可以发生改变的，例如：

    function A () {}
    function B () {}
    function C () {}
    B.prototype = new A();
    var b = new B();
    alert(b instanceof B); // true
    B.prototype = new C();
    alert(b instanceof B); // false
    alert(b instanceof A); // true!

例子[参考这里](http://jsfiddle.net/Lzsba/3/)。由于`B`的原型链发生变化，令后一个`instanceof`的结果发生变化。奇怪的是为什么最后一个`instanceof`还是返回的`true`？原因是在实例化的时候，`b`的原型链指向的是一个`A`的实例，即使后面`B`的原型指向另一个对象，也不影响已经实例化的`b`原型链上的对象，所以沿着`b`的原型链还是可以找到`A`。而改变原型链可以影响到已经实例化的对象的前提是**往原型对象上附加属性或者更改已有的属性，而不能把原型对象的引用指向一个新的对象**。

即使修改`b`的`constructor`属性，也不能改变`instanceof`的结果，如以下代码：

    b.constructor = C;
    alert(b instanceof C); // still false

这应该说明了在进行`instanceof`计算的时候，即使手工改变一个对象上的`constructor`或者`__proto__`不会影响`instanceof`的结果。详细的例子[参考这里](http://jsfiddle.net/vkk8L/)。

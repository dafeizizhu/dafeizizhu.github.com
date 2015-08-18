---
layout: post
title: "在JavaScript中遍历一个对象的所有属性"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

在JavaScript中遍历一个对象的所有属性，相信这个一个前端开发人员几乎每天都要面对的事情。最简单的莫过于`for...in`循环：

    for (variable in object) {
      ...
    }

其中：

1. `variable`是这个对象里面的键值。
2. `object`是要遍历的对象。

注意：这个循环是不会去遍历那些被声明为不可遍历的属性（例如`Object.prototype`或者`String.prototype`上面的属性）。执行`for...in`循环时，不仅会遍历这个对象上的所有属性，也会沿着这个对象的原型链遍历所有原型链上的属性，例如：

    function A () {
      this.b = "b";
      this.a = "a";
    }

    A.prototype.a = "prototype a";
    A.prototype.c = "prototype c";

    var a = new A();

    for (var k in a) {
      console.log(k + ": " + a[k]);
    }

执行结果[参考这里](http://jsfiddle.net/ej9Mm/1/)。值得注意的是：

1. 遍历了原型上的属性`c`。
2. 原型上的`a`属性被对象上的`a`属性覆盖了，导致原型上的`a`没有被遍历出来。
3. `Object`的原型链上的属性没有被遍历出来，其属性被声明为不可遍历。

虽然在IE6+、Firfox 22、Chrome 27上验证的结果，遍历的顺序跟对象上的属性声明的顺序一致，但是**原则上这种遍历是无序的，程序的逻辑不要依赖于这种遍历的顺序**。由于遍历的无序性，也不要使用`for...in`去遍历一个数组。

另外，最佳实践是，**不要在遍历的过程中在遍历的对象上增加或者删除属性，也尽量不要修改不是这次遍历的属性，可能会造成不可预知的结果**，例如：

    for (var k in a) {
      console.log(k + ": " + a[k]);
      a.d = "d";
    }

以上代码在IE9、Firefox 22、Chrome上都没有把`d`遍历出来，说明标准的实现应该是忽略遍历过程中增加的属性。但是IE7和IE8就把`d`遍历出来了。运行结果[参考这里](http://jsfiddle.net/gaGq4/2/show/)。

根据遍历的需要，可以控制遍历时是否需要遍历原型链上的属性。可以通过以下几个方式，仅遍历这个对象拥有的属性：

    for (var k in a) {
      if (a.hasOwnProperty(k)) {
        log(k + ": " + a[k]);
      }
    }

或者

    var names = Object.getOwnPropertyNames(a);

    for (var i = 0; i < names.length; i++) {
      console.log(names[i] + ": " + a[names[i]]);
    }

前者使用了`hasOwnProperty`方法判断对象是否拥有这个属性，如果属性是存在于原型链中，该方法会返回`false`。后者使用一个`Object`的方法`getOwnPropertyNames`取出这个对象拥有属性的键值，然后再根据返回的键值进行遍历。看代码的话感觉后者比较优雅，但是可惜至少在IE7、IE8上不支持，而前者则是所有浏览器都支持。这也是jslint要求使用`for...in`循环的时候加上`hasOwnProperty`这个方法的调用，以防遍历出一些我们不希望遍历的属性（例如原型链上的方法等）。

明天又到了jQuery的源码分享的时间了，将会带来`$.each`的相关代码简析，敬请期待！

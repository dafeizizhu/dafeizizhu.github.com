---
layout: post
title: "High Performance JavaScript 读书笔记之 数据存取"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

今天再来一篇有关提高性能的读书笔记。标题中的数据存储，说白了就是JavaScript中获取与设置数据的方式，例如局部变量、全局变量、对象属性、数组等。大家有没有想过函数或者方法中使用以上的不同方式存取数据对性能造成的影响也是不一样的呢？

###变量

当数据存储在局部变量中，读取与写入的方式都是最快的。这是由于局部变量存放在作用域链的最顶层。当变量出现在特定的作用域链中，对作用域链的遍历就可以停止了，减少遍历作用域链的性能开销。与之相反的就是全局变量。全局变量放置在全局作用域中，这个作用域处于作用域链的最底层。当反复引用全局变量的时候，每次引用都要完整遍历整个作用域链（当然，某些现代浏览器会对代码进行解析型的编译优化如此问题，但是我们还是要兼容那些古老的浏览器，难道不是吗？），这样会造成额外的开销。

还有一些语句会对作用域链做动态的修改。例如`with`，会在作用域链的顶端加入一个临时的作用域，包含`with`参数中的对象的所有属性。又如`try-catch`中`catch`字句，会在作用域链的顶端加入一个临时作用域，加入错误对象。这些语句都会造成作用域链的长度增加，也增加了遍历作用域链的性能开销。

闭包也会对变量的读取和写入造成性能影响。当闭包的内部函数被执行的时候，它的作用域链是由内部函数的活动对象加上外部函数的作用域链合并而成。当闭包的嵌套层数很深，查找一个变量也会去遍历这个很深的作用域链，造成性能消耗。

对于`with`，尽量不使用。对于`try-catch`，不要把它作为JavaScript的异常处理机制。更合理的做法是在代码中尽量避免抛出异常，手工处理异常分支，只把`try-catch`当作最后的安全手段。

对于访问和修改全局变量或者是闭包变量，所做的优化就是使用一个局部变量把相关的全局变量和闭包变量引入到函数的内部，当需要使用这些变量的时候使用局部变量的引用，减少遍历作用域链的次数。

虽然以上的优化效果有限，但是当函数被频繁执行的时候效果就会很明显了。当然，这些优化可以交给以后的编译器或者部署工具（JavaScript压缩工具等），但是在没有这些工具、没有浏览器JavaScript引擎优化的情况下，在性能需求非常高的场景，我们也要注意这些细节。

###属性

数据也可以作为一个对象的属性进行访问或者写入。我们知道，JavaScript中的对象是通过原型的方式来模拟OO中的继承关系。在一个对象中访问某个属性，需要遍历原型链去查找某个属性是否存在。这样意味着一个没有`toString`方法的对象调用像`Object`的`toString`方法，需要遍历整个原型链才能找到这个方法，然后才能执行。当原型链很深的时候，调用原型上的方法需要更多次数的遍历，也会造成额外的性能开销。

对于属性上的优化，思想跟变量是一致的：使用一个局部变量“缓存”这些方法的属性。这样能把相关属性提高到作用域链的最顶端，当访问的时候直接访问局部变量，就不需要再去原型链中查找了。**注意，对象上的方法最好不要使用这中方式缓存，可能会造成执行上下文的改变，需要使用`call`或者`apply`去手工控制方法的执行上下文才能保证逻辑的正确性。**

以上是书中的内容。其实我个人认为，包括之前写的Yahoo!的性能优化规则，不能为了遵守规则而遵守规则，更多需要考虑的是为什么要遵守这些规则，遵守了之后有是很么好处。而更理智的应该是使用数据说话，对比遵守前跟遵守后的性能数据，还有衡量遵守这些规则的代价（例如时间、维护性等），性价比高的规则才考虑落入，这样是比较理智的做法。
---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 执行字符串形式的表达式"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

周末还是继续读书笔记。今天讨论的是JavaScript中执行字符串形式的表达式的几种方式。

###eval

这个应该是最简单的执行字符串表达式的方法了。`eval`接受一个参数，就是字符串形式的表达式，并返回最后一条语句的返回结果。比较常见的用法就是把JSON格式的字符串转换成JavaScript的对象：

    var o = eval('({ninja: 1})');

如果把圆括号省略，`o`的值是`undefined`，因为参数语句执行时没有返回任何东西。加上圆括号之后，执行该语句会返回这个对象的值，`o`才能正确赋值。

还有一点需要注意的是`eval`中的语句执行的作用域与上下文与调用`eval`所在的作用域和上下文一致。

###Function构造器

Function构造器的参数列表是可变的。其中最后一个参数是字符串形式的函数逻辑，前面所有参数声明了构造的函数接受哪些参数，如：

    var add = new Function("a", "b", "return a + b;");

与`eval`不一样的是，使用Function构造器创建的函数**不会产生闭包**，即不能访问外部函数的变量，如：

    (function () {
      var a = "outter";
      var test = new Function("alert(a);");
      test();
    })();

运行结果[参考这里](http://jsfiddle.net/hdLmt/show/)。运行的时候抛出异常`a is not defined`，因为没有创建闭包，导致`test`内部无法访问外部函数的变量`a`。

###Timer

`setTimeout`和`setInterval`的第一个参数除了可以是函数（无论是函数的引用或者是匿名函数），也可以是一个字符串，表示timer触发时执行的逻辑，如：

    var tick = window.setTimeout('alert("Hi!")',100);

除了十分特殊的需求，一般都不需要这么使用timer。就算是需要运行时动态执行的逻辑，也可以通过以上两种方式创建函数的引用，在把它传入到`setTimeout`或者`setInterval`中。

###在全局作用域中执行

`eval`执行的代码跟执行`eval`所在的作用域是一致的。而有一些时候需要`eval`在全局作用域中执行。使用动态script标签可以解决以上的问题：

    var head = document.getElementsByTagName("head")[0] ||
                 document.documentElement,
        script = document.createElement("script"); 
    script.type = "text/javascript";
    script.text = data;
    head.appendChild(script);               
    head.removeChild(script); 

在`head`中插入一个`script`元素，设置`type`为JavaScript脚本，把`text`设置成需要执行的字符串形式的代码，然后插入到`head`中，再把它删除。这样，`text`中的代码就会放到全局作用域中执行。

###安全执行

在运行时环境中执行字符串形式的代码通常都会带来安全性的问题。代码的来源是我们最关心的问题，它是否可信？它是否包含高危的代码，把整个页面弄挂，甚至对后台服务器发起攻击？我们需要一种机制去过滤动态执行的代码，Google的Caja是其中一个方式，让代码安全的执行。其思路大概就是把一段动态的代码编译成另外一段更复杂，更难看的代码，实现相同的功能，又能防止该代码执行一些对页面可能有危害的行为。关于Caja，后面会专门写一篇讲述其原理及其使用方法。

在日常工作中，需要使用动态执行字符串形式的代码场景有限（想必应该是十分高雅的实现……）。但是一旦要使用，记得注意采用哪种方式去执行动态代码，注意作用域以及上下文等细节问题哦亲。

---
layout: post
title: "再谈for-in循环的顺序"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

今天终于重现了两年前出现过的`for...in`循环的顺序问题，多谢永胜哥给出的例子。原来是当键值是整数的时候，使用`for...in`循环去遍历一个对象，不同浏览器的顺序是不一样的。

ECMA-262标准中有这么一句说明：

> The mechanics and order of enumerating the properties (step 6.a in the first algorithm, step 7.a in the second) is not specified.

关于`for...in`的具体顺序在最新的标准中是没有说明的。这也意味着每一个浏览器都可以有其特定的实现。之前的文章也强调过，**不要依赖`for...in`遍历一个对象的顺序**。为了彻底搞清楚不同浏览器的实现，蛋疼的我写了个测试，代码[参考这里](http://jsfiddle.net/k5DBh/18/)。

比较有规律的IE6的实现，全部都跟定义时的顺序一致。IE7、8、9跟Chrome的最新版本的实现是一样的：

1. a把key中是整数的先抽取出来。注意一定要是整数，像`3a`、`1.1`等不在范围之内哦。
2. a抽取出来的按数字大小正序排列，放到最前面。
3. a其他key则按照定义的顺序放到整数key的后面。

有趣的是最新版本的FireFox。当数字比较小的时候，跟Chrome的实现是一致的。当数字比较大的时候，跟IE6的表现是一致的。为了揭示问题的真相，我又蛋疼地写了一段代码，去测试FireFox的边界值，[参考这里](http://jsfiddle.net/9pYL4/4/)。

得出的结论是FireFox把超过1000的数字排除在优先范围之外。所以当key值小于1000的时候是跟Chrome的行为一致，大于的时候跟IE6的行为一致。

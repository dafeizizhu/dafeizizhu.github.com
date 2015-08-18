---
layout: post
title: "一个断言：expect.js"
description: ""
category: 
tags: [前端, JavaScript]
---
{% include JB/setup %}

讲了测试驱动和测试框架，最后再来讲一下断言。断言的风格其实有很多，而Mocha这个测试框架则允许我们使用自己喜欢的断言来写测试代码。今天简单了解一下其中一个断言：expect.js（我不会告诉你为什么选择这个断言是因为Arale也用了这个）。

expect.js是基于`should.js`的一个断言工具，比`should`要清爽一些。支持所有主流的浏览器和测试框架，并兼容Node的模块格式，所以在Node中可以这样使用expect.js：

    require("path/to/expect.js");

为了在浏览器也使用这个断言，SPM封装了其CMD的模块，使用以下命令就可以安装了：

    spm install gallery/expect -d path/to/seajs-base-path

因为昨天编写的测试用例也是一个CMD模块，所以在浏览器也可以使用expect.js来断言啦！

也可以通过`script`标签直接引入脚本文件来使用，不过这个时候`expect`就是一个全局变量了：

    <script src="expect.js"></script>

它的断言很有意思，符合英文语法，例如：

    expect(1).to.be.ok();

这个断言判断`expect`中的参数是否一个在JavaScript中代表`true`的变量，例如非0数字和非空字符串等。是不是跟写英文句子有点像？

除了这个最基本的断言，还提供了一些快捷方式，例如：

1. `.to.be.a`，判断参数是否某个“类”的实例，例如`expect(5).to.be.a("number")`或者`expect(5).to.be.a(Number)`。
2. `.to.match`，判断参数是否匹配某个正则表达式。
3. `.to.contain`，判断参数是否包含某个项，调用的是`indexOf`方法。
4. `.to.have.length`，判断数组的长度是否某个特定的值。
5. `.to.be.empty`，判断数组是否为空。
6. `.to.have.property`，判断一个对象是否含有特定的属性。
7. `.to.have.key`，判断一个对象是否含有特定的键。
8. `.to.throwException`，判断执行一个方法是否抛出异常。
9. `.to.be.within`，判断一个数值是否在给定范围之内，例如`expect(1).to.be.within(0, Infinity);`。
10. `.to.be.greaterThan`和`.to.be.lessThan`，判断大小关系。

详细的信息可以[参考这里](https://github.com/LearnBoost/expect.js)。最后，文档提到了跟`should.js`的区别。由于没有用过`should.js`，所以纯翻译：

1. 不需要使用静态方法，例如`should.strictEqual`，所有断言都是`expect(val).`开头的。
2. API更简洁。
3. 修改某些API中关于浏览器兼容的内容。

我个人感觉这个断言最厉害的地方是语法跟英文的语法非常接近，一眼看上去就能够知道这个断言大概的意思，可读性比较强。

一连3天从测试驱动、测试框架到测试断言都过了一遍，做了这么久的前端终于第一次从头到尾地体验了一套完整的单元测试解决方案，爽！如果能集成到Travis就完美了！

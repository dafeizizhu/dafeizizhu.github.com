---
layout: post
title: "使用Mocha测试SeaJs模块"
description: ""
category: 
tags: [前端, JavaScript]
---
{% include JB/setup %}

昨天介绍了测试驱动，Karma的作用只是拉起浏览器，加载需要的脚本，例如测试框架、源码还有测试代码，执行加载的代码。测试代码怎么写，用什么测试框架，它是不关心的。今天继续昨天的单元测试问题，讨论的是使用Mocha这个单元测试框架去编写我们的测试用例。

由于是使用Karma拉起的，所以只使用Karma里面的Mocha适配器即可，即在Karma配置文件中配置`framework`：

    `framework`: ["mocha"],

然后参考昨天讨论过的结果，在测试入口文件调用：

    mocha.run();

即可拉起之前通过`seajs.use`加载的测试代码。

我们的测试代码也是以一个CMD模块加载进来的，所以测试代码看上去应该是这样的：

    define(function (require) {
      var expect = require("path/to/expect.js");
      describe("Some subject", function () {
        it("Some case", function () {
          expect(true).to.be(true);
        });
      });
    });

其中第一行就是要使用的断言风格。这里以`expect.js`为例，由于我们的代码是在CMD模块里面，所以可以使用SPM去下载对应`expect.js`的CMD版本：

    spm install gallery/expect -d path/to/seajs-base-path

也可以使用其他风格的断言，只需要去SPM上下载对应的CMD版本或者自行封装也可以。

里面的`describe`和`it`就不说明了，`describe`还可以重复嵌套，例如：

    describe("Some subject", function () {
      describe("Child subject", function () { ... });
    });

最后测试用例的名字会把所有上层的`describe`的名字拼接起来，十分方便，层次也比较清晰。

Mocha比Jasmine要好的地方是，我在Jasmine的官网上看的例子，异步测试是使用`waitFor`，等待一个时间之后再进行断言，这太不科学了！而Mocha使用的是回调的机制，只要在`it`的第二个参数，声明一个`done`参数，这个测试就变成支持异步的了：

    it("Some async test", function (done) {
      setTimeout(function () {
        expect(true).to.be(true);
        done();
      }, 1000);
    });

单元测试框架必不可少的`setUp`和`tearDown`在Mocha中是`before`、`after`、`beforeEach`和`afterEach`。其中前两个适用于`describe`，而后两个则使用于`it`，即每个测试用例之前和之后都要执行。

Mocha还有一个非常人性化的地方，就是可以只执行或者排除执行某些用例。想象一下两个场景：

第一个场景就是有100个用例，只有一个用例执行失败了，所以需要调试一下为什么失败。这时，如果还是100个用例跑的话，一是时间可能非常长，二是其他用例也有可能被断点。难道要注释掉其他用例么？不用！这时候可以`it`后面加上一个小东西：

    it.only("Some case", function () { ... });

这样，下次执行测试用例的时候就只执行这个用例了，太方便了！同样适用于`describe`。

第二个场景也有100个用例，其中有一个不是非常重要的用例失败了，但是其执行的时间非常长，导致影响了其他用例的执行。难道又要把它注释了么？不用！这时候可以在`it`后面加上另外一个小东西：

    it.skip("Some case", function () { ... });

这样，下次执行测试用例的时候就不会执行这个用例了，太方便了！也同样适用于`describe`。

Mocha - the fun, simple, flexible JavaScript test framework，一点都木有错！

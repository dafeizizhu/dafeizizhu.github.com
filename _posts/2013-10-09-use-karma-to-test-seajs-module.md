---
layout: post
title: "使用Karma测试Seajs模块"
description: ""
category: 
tags: [JavaScript, node, 前端]
---
{% include JB/setup %}

[Karma](http://karma-runner.github.io/0.10/index.html)是一个使用Node作为平台的单元测试驱动。通过Karma，可以实现基于命令行的自动化测试，十分方便。而且Karma只是一个底层的测试驱动，帮助我们去启动浏览器、编写测试页面、加载源码以及测试套件等功能。在Karma之上，可以使用现在各种各样流行的单元测试框架，例如Jasmine、Mocha、QUnit等，在编写测试用例的时候可以根据自己的习惯灵活地选择需要的单元测试框架，赞！

首先需要安装Node。然后就可以通过npm安装Karma了：

    npm install -g karma

关键的是Karma的配置文件，可以通过以下命令，用交互式的方法生成一个Karma的配置文件：

    karma init karma.conf.js

只需要回答问题就可以生成配置了，主要是关于使用的测试框架、是否需要RequireJs的支持、需要启动哪些浏览器、引入或者排除的文件、是否需要监视文件变化进行自动测试等。

生成的配置文件有以下几个比较重要的配置：

1. `basePath`，所有文件路径都以这个路径为根路径。
2. `frameworks`，使用的测试框架，可以是多个，例如`["mocha", "jasmine"]`。
3. `files`，需要引入的文件数组，数组的元素可以是字符串，声明直接引入到runner.html里面；也可以是一个对象，其中`pattern`是文件路径，`included`声明是否需要引入到runner.html里面。
4. `exclude`，需要排除的文件数组，内容格式跟`file`一致。
5. `port`，测试服务器的端口号。
6. `autoWatch`，是否自动监听文件变化进行测试。
7. `browser`，需要启动的浏览器。

详细的配置可以[参考这里](http://karma-runner.github.io/0.10/intro/configuration.html)。

修改好配置之后我们可以通过以下的命令手动启动测试：

    karma run

到这里简单的安装部署流程已经结束了，可以试着使用自己喜欢的测试框架去编写测试用例啦！但是，要测试SeaJs的模块，要怎么办呢？要知道，SeaJs是使用其自己的机制去加载脚本的，如果要在Karma中配置要加载的文件，只能全部都加进去！

其实可以这样：

1. 先加载一个SeaJs，为runner.html提供动态加载SeaJs模块的功能。
2. 再加载一个测试的入口，设置SeaJs的配置以及测试套件的入口。

第一步需要修改`karma.conf.js`里面的`files`，载入SeaJs和入口文件：

    files: ["path/to/sea.js", "path/to/entry.js"],

第二步需要在入口文件中调用`seajs.config`设置对应的别名等配置，以及调用入口的测试套件（感谢Github上面的[这篇文章](https://github.com/aralejs/aralejs.org/issues/291)）：

    seajs.config({ ... });
    window.__karma__.start = function() {
      seajs.use(["./base/tests/base-spec.js"], function() {
        mocha.run()
      })
    }

在`testsuit`中编写单元测试用例：

    define(function (require) {
      describe("A test suit", function () {
        it("A test case", function () {
          expect(true).to.be(true);
        });
      });
    });

注意的是：

1. 测试用例也要是一个CMD模块。
2. 使用的测试框架是Mocha。
3. 使用的是`expect.js`的断言，也可以使用其他断言形式，例如`should.js`、`chai`等。

编写完用例之后执行`karma run`，去控制台上看看效果吧！

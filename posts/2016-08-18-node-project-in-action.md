---
layout: post
title: "我的Node项目实践 - 项目篇"
description: ""
category: 
tags: [node]
---

最近做了一个部署到多台机器上的Node服务，总结一下这次实践的经验，项目地址在[这里](https://github.com/dafeizizhu/live-grab)。

### 目录结构

    |--bin    // 存放可执行的node程序，用命令行传递参数
    |--lib    // 存放源文件
    |--logs   // 存放日志
    |--test   // 存放单元测试

### bin

这个目录存放了项目可以执行的3个Node程序：

1. `grab.js`：抓取程序，需要传入要抓取的URL、存放的文件目录等参数。
2. `master.js`：主控节点程序，负责拉取抓取任务，分发到不同的slave节点进行处理。
3. `slave.js`：负责接收抓取任务，创建新的抓取进程，并监控抓取进程的状态反馈给主控节点。

### 日志

服务端的程序需要大量的日志分析线上出现的问题。在这个项目中使用了[log4js](https://github.com/nomiddlename/log4js-node)来进行日志的收集和记录。关于日志的配置抽取出一个工具方法进行处理：

    var log4js = require('log4js')

    module.exports = options => {
      log4js.configure({
        appenders: [{
          type: 'console'
        }, Object.assign({}, {
          type: 'dateFile',
          filename: 'unknown_' + new Date().valueOf() + '.log',
          pattern: '.yyyy-MM-dd',
          alwaysIncludePattern: true
        }, options)]
      })
    }

其中`appenders`中的每一项都是一项独立的日志配置，声明了日志应该用什么方式显示或者存放，[这里](https://github.com/nomiddlename/log4js-node/wiki/Appenders)有log4js支持的所有appenders。第一个是`console`，就是控制台输出。第二个是文件输出，具体配置：

1. `type`：类型。这里是`dateFile`，就是按照`pattern`声明的方式按时间分割日志文件。
2. `filename`：日志的文件名，可以通过参数传入，最后生成文件的文件名会在最后加上`pattern`格式化后的日期字符串。
3. `pattern`：声明分割方式，例如上述的`.yyyy-MM-dd`就是按日分割日志文件，分割后的文件会在原来的文件名后面加上对应的日期字符串。
4. `alwaysIncludePattern`：默认情况下当前的日志文件是不带`pattern`对应后缀的，如果这个选项为`true`，则为当前的日志文件也加上这个后缀。

### 测试

1. 框架：[Mocha](https://mochajs.org/)
2. 断言：[Chai](http://chaijs.com/)
3. Mock：[Sinon](http://sinonjs.org/)

其中Sinon可以为Node里面的任意对象进行打桩，例如：

    var sinon = require('sinon')
    var http = require('http')

    var createServer = sinon.stub()
    createServer.returns({
      listen: sinon.stub()
    })
    sinon.stub(http, 'createServer', createServer)

这样就可以为Node原生提供的库或者第三方的库（例如[request](https://github.com/request/request)等）进行打桩测试。其中最大的问题是像[socket.io](http://socket.io/)这样的库，提供的API就是直接导出的，并没有依附在一个对象上，这样就不能使用上述的方式来打桩。到现在还没有找到有效的办法，只能引入一个工具方法来对这个API进行二次封装：

    exports.init = app => require('socket.io')(app)
    exports.connect = target => require('socket.io-client')(target)

这样我们打桩的时候只需要对这个工具方法导出的对象进行打桩即可。

### 持续集成

代码上了github，可以使用免费的[Travis CI](https://travis-ci.org/)来进行持续集成。这里由于不涉及构建和部署，持续集成只需要执行单元测试即可。

使用github的账号在Travis CI上登陆之后，激活需要进行持续集成的项目，然后在项目中加入`.travis.yml`文件：

    language: node_js
    node_js:
      - '6'
      - '4.4.7'
    before_script:
      - npm install -g istanbul
      - npm install -g mocha
    after_success:
      - 'cat ./coverage/lcov.info | ./node_modules/.bin/coveralls'

详细的配置可以参考[这里](https://docs.travis-ci.com/user/getting-started/)，这里简单说一下上面的配置：

1. `language`：开发语言，这里是`node_js`。
2. `node_js`：声明使用的Node的版本，可以配置多个。这里配置了最新的6和当前稳定版本4.4.7。
3. `before_script`：在执行集成之前需要运行的脚本。这里安装了单元测试框架Mocha和生成测试覆盖率的工具[istanbul](https://github.com/gotwarlost/istanbul)。
4. `after_success`：持续集成成功之后执行的脚本。这里是把覆盖率的结果报告上传到[https://coveralls.io](https://coveralls.io)，方便查看。

### 总结

到这里，项目的目录结构、日志、单元测试、持续集成等开发环节都介绍完了。后面还有这个项目的部署、上线之后的填坑经验总结，有时间在写吧。

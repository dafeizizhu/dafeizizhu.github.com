---
layout: post
title: "Taf nodejs重构（3） - RPC服务端"
description: ""
category: 
tags: [node, taf]
---

### 引用

1. [Tencent/Tars: Tars is a highly performance rpc framework based on naming service using tars protocol and provides a semi-automatic operation platform.](https://github.com/Tencent/Tars)

### 结构

参考Tars的代码进行重构。在Tars中，RPC服务端主要由这几个文件组成：

1. Transceiver.js，负责底层tcp或者udp的数据传输。
2. NetThread.js，负责监听端口，建立tcp或者udp连接。
3. BindAdapter.js，负责解析Endpoint，初始化对应的`NetThread`对象，提供分发RPC消息的接口。
4. HeroServer.js，负责解析Taf的配置文件，初始化对应的`BindAdapter`对象，提供设置Taf Servant的方法。

如果是Tars协议，需要使用`tars2node`工具生成对应的servant，并提供实现：

    var Tars   = require("../../../../protal.js");
    var TarsDemo  = require("./NodeTarsImp.js").tars;

    var svr = new Tars.server();
    svr.initialize(process.env.TARS_CONFIG || "./TARS.NodeTarsServer.config.conf", function (server){
          server.addServant(TarsDemo.NodeTarsImp, server.Application + "." + server.ServerName + ".NodeTarsObj");
              console.log("tars server started");
    });

    svr.start();

### 编解码

结合[上次的文章](/posts/2018/01/12/my-taf-nodejs-refactor-rpc-client.html)，把网络数据的编解码抽象成一系列对象：

1. `protocols/<protocolName>/client`，负责客户端的编解码。
2. `protocols/<protocolName>/server`，负责服务端的编解码。

数据对象：

1. `RequestMessage`，RPC请求，包括`requestId`、`servantName`、`funcName`、`appBuffer`等信息。
2. `ResponseMessage`，RPC响应，包括`requestId`、`code`、`message`，还有一个`responsePacket`对象，包含协议特定的返回对象，例如Taf协议返回的是Taf指定的`ResponsePacket`对象，或者自定义JSON协议中，返回一个普通的对象也是可以的。

客户端的接口：

1. `compose`，负责把`RequestMessage`对象编码成二进制数据。
2. `feed`，负责分包，把二进制数据转成`ResponseMessage`对象。

服务端的接口：

1. `compose`，负责把`ResponseMessage`对象编码成二进制数据。
2. `composeError`，负责把servant抛出的异常编码成二进制数据。
3. `feed`，负责分包，把二进制数据转成`RequestMessage`对象。

### 结构

跟[上次的文章](/posts/2018/01/12/my-taf-nodejs-refactor-rpc-client.html)的思路一样，根据解耦的想法重新设计代码结构：

1. listeners，负责监听端口，目录里面不同的文件对应不同的网络协议，例如tcp-listener.js或者udp-listener.js等。
2. transceivers，负责数据传输，目录里面不同的文件对应不同的网络协议，例如tcp-transceiver.js或者udp-listener.js等。
3. data-adapter.js，负责初始化transceiver，接收到数据之后使用对应的`ProtocolClient`对象解码数据，触发`message`事件。
4. bind-adapter.js，负责初始化listener，当有客户端连接的时候为其初始化一个`DataAdapter`对象，监听其`message`事件，使用servant的`doRequest()`方法处理请求后，使用对应的`DataAdapter`对象的`doResponse()`方法或者`doError()`方法发送RPC响应。
5. t-server.js，负责解析配置文件，为每一个endpoint初始化`BindAdapter`对象，并设置对应的servant对象。

### 代码生成

使用自己做的工具[t-code-generator](https://www.npmjs.com/package/t-code-generator)，生成一份代码，里面包括：

1. `XXXProxy`，供`TClient`的`stringToProxy()`方法使用，负责客户端的编解码。
2. `XXXServant`，提供`TServer`需要的servant的一个基础原型，负责服务端的编解码，提供Taf协议中指定方法的一个事例。

服务端使用`XXXServant`的时候需要实现一个子类，例如`DemoFServant`：

    class DemoFServant {
    ...
      echo (str) {
        let ret = {}
        ret.return = ''
        return Promise.resolve(ret)
      }
    ...
    }

实现一个子类`DemoFServantImp`：

    class DemoFServantImp extends DemoFServant {
      echo (str) {
        let ret = {}
        ret.return = 'echo at @taf2/rpc: ' + str
        return Promise.resolve(ret)
      }
    }

使用方法：

    let tServer = new TServer(TConfig.parseFile('/path/to/taf.conf'))
    tServer.addServant(new DemoFServantImp(), 'Nodejs.DemoServer.DemoObj')
    tServer.start()

### 精简

跟[上次的文章](/posts/2018/01/12/my-taf-nodejs-refactor-rpc-client.                                             html)类似，移除代码中monitor模块的引用，在`BindAdpater`对象的内部对`DataAdapter`的`message`事件处理程序中，增加`response`事件：

    try {
      this._servant.doRequest(requestMessage).then(({ responseMessage }) => {
        dataAdapter.doResponse(responseMessage)
        this.emit('response', { requestMessage, responseMessage })
      }).catch(error => {
        dataAdapter.doError(error)
        this.emit('response', { requestMessage, error })
      })
    } catch (error) {
      dataAdapter.doError(error)
      this.emit('response', { requestMessage, error })
    }

事件一直冒泡到`TServer`对象，可以通过处理`TServer`对象的`response`事件，为单向接口接入tafstat的统计功能：

    let monitor
    let rpcClient
    let rpcServer

    exports.initialize = (tafConfig) => {
      rpcClient = new TClient(tafConfig)
      rpcServer = new Tserver(tafConfig)
      monitor = new TMonitor(rpcClient, tafConfig)
      rpcServer.on('response', ({ requestMessage, responseMessage }) => {
        if (requestMessage.packetType === 1) {
          monitor.stat.report({ requestMessage, responseMessage })
        }
      })
    }

    exports.rpcServer = rpcServer

---
layout: post
title: "Taf nodejs重构（2） - RPC客户端"
description: ""
category: 
tags: [node, taf]
---

### 引用

1. [Tencent/Tars: Tars is a highly performance rpc framework based on naming service using tars protocol and provides a semi-automatic operation platform.](https://github.com/Tencent/Tars)

### 结构

参考Tars的代码进行重构。在Tars中，RPC客户端主要由这几个文件组成：

1. Transceiver.js：负责底层tcp或者udp的数据传输。
2. AdapterProxy.js：使用特定的协议（tars或者自定义的协议，例如json等）处理Transceiver获得的数据；同时使用该协议把上层业务的消息转成二进制数据供Transceiver发送。
3. EndpointManager.js：负责多个AdapterProxy的负载均衡。如果该客户端没有指定Endpoint，EndpointManager还会定时去tarsregistry服务同步该客户端可用的Endpoint信息。
4. ObjectProxy.js：客户端实例。
5. Communicator.js：客户端代理构造器，里面的`stringToProxy`方法可以构建一个特定服务的代理，包含该服务的所有方法。

如果是Tars协议，则需要使用`tars2node`工具生成对应的proxy，再使用Communicator的`stringToProxy`方法生成代理调用服务：

    // NodeTarsProxy.js是通过tars2node生成的代理文件
    // TarsClient是Communicator的一个实例
    let TarsProxy = require('./NodeTarsProxy').tars
    let prx = TarsClient.stringToProxy(TarsProxy.NodeTarsProxy, 'TARS.NodeTarsServer.NodeTarsObj@tcp -h 127.0.0.1   -p 14002 -t 10000'
    prx.getUsrName('foo').then(console.info).catch(console.error)

### 解耦

通读代码后，个人感觉负责编写Tars Nodejs代码的童鞋应该不是专门写nodejs的。上面多个类之间的交互都是通过保持对方的引用进行交互，例如：

    var AdapterProxy = function () {
      this._worker    = undefined;  //所属的ObjectProxy
      this._endpoint  = undefined;  //服务端的IP地址以及端口
      this._pTrans    = undefined;  //连接服务端的套接口
      ...
    }

看代码的时候，当下层模块通过这些引用调用上层模块的方法时，还需要查阅这个引用对应的上层模块是啥，而且这样下层模块还包含了一些与自己无关的代码，职责不够统一，下层模块跟上层模块也耦合在一起。在重构中，使用了观察者模式进行解耦：

1. transceivers：对应Transceiver.js，这个文件夹按照协议把多个Transceiver的定义分开到不同的文件中，例如tcp-transceiver.js、udp-transceiver.js。
2. adapter-proxy.js：对应AdapterProxy.js。
3. endpoint-manger.js：对应EndpoingManager.js。
4. object-proxy.js：对应ObjectProxy.js。
5. t-client.js：对应Communicator.js。

其中下层模块都不包含其上层模块的引用，它们之间通过观察者模式进行交互，例如Transceiver：

    this._socket.on('data', data => this.emit('data', { data }))

AdapterProxy：

    this._transceiver.on('data', ({ data }) => this._protocol.feed(data))
    this._protocol.on('message', ({ requestMessage }) => this.emit('message', { requestMessage }))

这样下层模块通过触发事件，保证自己的职责单一，也跟上层模块解耦。

### 精简

查看该模块的package.json文件，@tars/rpc模块依赖：

1. @tars/monitor
2. @tars/registry

在看看@tars/monitor和@tars/registry的package.json，会发现这两个模块都依赖于@tars/rpc。这样导致了在@tars/registry的代码中，并不能在模块外层代码`require(@tars/rpc)`，因为在这个代码执行的时候@tars/rpc的代码并没有完全执行，导致其暴露的静态实例也没有生成。在@tars/registry中，只能通过这种方式规避：

    // 重新设置locator，需要重新初始化
    client.prototype.resetLocator = function(sLocator) {
      this._locator = sLocator;

      if (!tarsRpc) {
        tarsRpc = require("@tars/rpc");
        registryTars = require("./QueryFProxy.js").tars;
        EndpointTars = require('./EndpointFTars.js').tars;
      }

      TarsClient = tarsRpc.Communicator.New();
      this._proxy = undefined;
    };

    client.prototype.initialize = function() {
      if (!tarsRpc) {
        tarsRpc = require("@tars/rpc");
        registryTars = require("./QueryFProxy.js").tars;
        EndpointTars = require('./EndpointFTars.js').tars;
      }

      TarsClient = tarsRpc.Communicator.New();
      this._proxy = TarsClient.stringToProxy(registryTars.QueryFProxy, this._locator);
    };

是不是很蛋疼，同一个东西需要`require`两次。重构的时候考虑到registry模块的主要功能还是供rpc模块使用，把整个registry模块都搬到rpc里面，直接初始化一个AdapterProxy供其使用。这样可以规避rpc和registry的循环依赖。

至于monitor的依赖，直接从rpc的代码中移除monitor的调用。为了保持monitor的功能，rpc客户端的每个调用都会在调用结束后触发一个`response`事件，里面的参数包含了这次调用的请求和响应信息。

最后在创建一个模块，里面会包含初始化rpc客户端，监听这个客户端每个请求的`response`事件，再调用monitor的方法进行数据上报：

    let monitor
    let rpcClient

    exports.initialize = (tafConfig) => {
      rpcClient = new TClient(tafConfig)
      monitor = new TMonitor(rpcClient, tafConfig)
      rpcClient.on('response', ({ requestMessage, responseMessage }) => {
        monitor.stat.report({ requestMessage, responseMessage })
      })
    }
    // 供外部使用的客户端实例
    exports.rpcClient = rpcClient

这样可以让rpc模块不依赖于monitor模块，规避它们之间的循环依赖。

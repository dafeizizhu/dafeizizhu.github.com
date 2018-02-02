---
layout: post
title: "Node Cluster"
description: ""
category: 
tags: [node]
---

### 引用

1. [Cluster | Node.js v9.5.0 Documentation](https://nodejs.org/api/cluster.html)
2. [当我们谈论 cluster 时我们在谈论什么(上) | Taobao FED | 淘宝前端团队](http://taobaofed.org/blog/2015/11/03/nodejs-cluster/)
3. [当我们谈论 cluster 时我们在谈论什么（下） | Taobao FED | 淘宝前端团队](http://taobaofed.org/blog/2015/11/10/nodejs-cluster-2/)

### 目的

一个Node实例是以单进程的模式运行的，为了能使用多核cPU的计算能力，可以使用cluster模式启动Node实例，让多个进程同时工作，“共享”一个端口：

    const cluster = require('cluster')
    const http = require('http')
    const numCPUs = require('os').cpus().length

    if (cluster.isMaster) {
      for (let i = 0; i < numCPUs; i++) cluster.fork()
      cluster.on('exit', (worker, code, signal) => {
        console.info(`worker ${worker.process.pid} died`)
      })
    } else {
      http.createServer((req, res) => {
        res.writeHead(200)
        res.end('hello world\n')
      }).listen(8000)
      console.info(`worker ${process.pid} started`)
    }
    
### 运作

worker进程是通过`child_process.fork()`生成的，它们和master之间通过IPC通道进行沟通。worker之间的负载均衡有两种策略：

1. round-robin。master进程监听端口，接收新的请求，并根据round-robin的方式分发到worker进程中，避免某个worker负载过高。除了Windows平台，这个是默认策略。
2. 共享socket。master创建监听的socket，并直接把socket分发到worker进程中。由操作系统负责分发请求到每个worker中。

理论上，第二种策略可以获得更高的性能。缺点就是超过70%的请求都会集中到其中一两个worker中，可能会导致某几个worker负载过高。**注意，Node没有提供路由的逻辑，所以worker实现的逻辑最好是无状态的，不依赖于任何以内存形式存储的数据。**

由于worker是以进程的方式启动的，一个worker报错、死掉、僵死都不会影响到其他worker。只要有worker能正常工作，就能正常监听端口并提供服务。如果没有可用的worker，会抛弃掉现有的所有请求，并拒绝任何新来的请求。Node并不会自动管理可用worker的数量，需要使用者监听worker的一些事件，如`error`、`disconnect`、`exit`等，当worker退出的时候，重新调用`cluster.fork()`生成新的worker，保证可用worker的数量。

### cluster事件

**`Event:'disconnect'`**

当master和worker的IPC通道断开后触发。跟`'exit'`事件合起来使用可以判断一个worker是否已经完全退出：

    cluster.on('disconnect', worker => {
      console.info(`The worker ${worker.id} has disconnected`)
    })

**`Event:'exit'`**

* 参数：`worker`，Worker实例
* 参数：`code`，worker进程退出时返回的值
* 参数：`signal`，worker进程退出时接受到的信号

当任何一个worker退出的时候会触发这个事件。可以在这个事件处理程序中重新生成新的worker来保证可用worker的数量：

    cluster.on('exit', (worker, code, signal) => {
      console.info('worker %d died %s, restarting...', worker.process.pid, signal || code)
      cluster.fork()
    })

**`Event:'fork'`**

* 参数：`worker`，Worker实例

当worker被fork出来之后触发这个事件。

`Event:'listening'`

* 参数：`worker`，Worker实例
* 参数：`address`，对象，包括`listen()`的参数，包括`.address`和`.addressType`

当worker调用任何`listen()`方法的时候触发这个事件。通过监听`'fork'`事件和`'listen'`事件，可以得知worker生成到可以工作的大概时间：

    const timeouts = []
    cluster.on('fork', worker => timeouts[worker.id] = setTimeout(() => {
      console.error('something wrong with the connectiong')
    }, 2000))
    cluster.on('listening', (worker, address) => clearTimeout(timeouts[worker.id]))
    cluster.on('exit', (worker, code, signal) => clearTimeout(timeouts[worker.id]))

**`Event:'message'`**

* 参数：`worker`，Worker实例
* 参数：`message`，对象，要发送的信息
* 参数：`handle`，对象，可选的Handle

参考[child_process event:'message'](https://nodejs.org/api/child_process.html#child_process_event_message)。

**`Event:'online'`**

* 参数：`worker`，Worker实例

与`'fork'`类似，不同的是`'fork'`当worker创建的时候就触发，`'online'`要worker运行起来才触发。

### cluster成员

**`cluster.disconnect([callback])`**

* 参数：`callback`，可选的回调函数，当所有worker都断开之后调用

调用这个方法之后，会调用在`cluster.workers`里面所有worker的`.disconnect()`方法。只能在master进程上调用。

**`cluster.fork([env])`**

* 参数：`env`，对象，配置给worker进程的环境变量

派生一个worker。只能在master进程上调用。

`cluster.isMaster`

布尔值，如果当前进程是master进程则返回`true`，否则返回`false`。通过进程的`NODE_UNIQUE_ID`环境变量判断，如果没有这个环境变量，则`cluster.isMaster`为`true`。

**`cluster.schedulingPolicy`**

枚举值：

1. `cluster.SCHED_RR`，使用round-robin策略分发请求。
2. `cluster.SCHED_NONE`，由操作系统决定分发策略。

当第一次调用`cluster.fork()`或者`cluster.setupMaster()`后，这个属性就没法被修改了。还可以通过环境变量`NODE_CLUSTER_SCHED_POLICY`控制策略，对应的字符值是`'rr'`和`'none'`。

**`cluster.settings`**

对象，包含cluster的配置：

1. `execArgv`，传递给Node.js的参数，默认是`process.execArgv`。
2. `exec`，worker进程的入口，默认是`process.argv[1]`。
3. `args`，传递给worker进程的参数，默认是`process.argv.slice[2]`。
3. `cwd`，worker进程运行的目录，默认是`undefined`，即父进程的`cwd`。
4. `silent`，是否发送标准输入输出到父进程的标准输入输出，默认是`false`。
5. `stdio`，配置worker进程的标准输入输出。
6. `uid`，配置worker进程的用户标识。
7. `gid`，配置worker进程的组标识。
8. `inspectPort`，配置worker进程的调试端口。

**`cluster.setupMaster([settings])`**

* 参数：`settings`，对象，cluster配置

调用这个方法可以更改`cluster.fork()`的行为，新的`settings`会反映到`cluster.settings`属性上。

注意：

1. 当调用`setupMaster()`传入新的`settings`时，不会影响到已存在的worker。
2. 调用`cluster.fork()`时传入`env`并不会因为`settings`的更改而更改。

只能在master进程中调用。

**`cluster.worker`**

对象，返回当前worker的引用。在master进程中无效。

**`cluster.workers`**

对象，包含所有worker对象，以`worker.id`为键存储。当一个worker触发`'disconnect'`或者`'exit'`后，就会从这个对象上删除。

### Worker

调用`cluster.fork()`返回的对象是Worker类的实例。

### Worker事件

**`Event:'disconnect'`**

与`cluster.on('disconncet')`类似，针对worker：

    cluster.fork().on('disconnect', () => {
      // worker has disconnect
    })

**`Event:'error'`**

与`process.on('error')`一致，原因有：

1. 没法派生子进程。
2. 子进程没法被杀掉。
3. 给子进程发送消息失败。

**`Event:'exit'`**

与`cluster.on('exit')`类似，针对worker：

    let worker = cluster.fork()
    worker.on('exit', (code, signal) => {
      if (signal) {
        console.info(`worker was killed by signal: ${signal}`)
      } else if (code !== 0) {
        console.info(`worker exited with error code: ${code}`)
      } else {
        console.info('worker exited without error')
      }
    })

**`Event:'listening'`**

与`cluster.on('listening')`类似，针对worker（在worker中不会触发）：

    cluster.fork().on('listening', () => {
      // worker is listening
    })

**`Event:'message'`**

与`cluster.on('message')`类似，针对worker。在worker中，使用`process.on('message')`去获取master发送的消息，使用`process.send()`去给master发送消息：

    if (cluster.isMaster) {
      for (let i = 0; i < 10; i++) {
        cluster.fork()
      }
      for (const id in cluster.workers) {
        cluster.workers[id].on('message', msg => {
          console.info('get message', message, 'from worker', id)
        })
      }
    } else {
      http.Server((req, res) => {
        res.writeHead(200)
        res.end('hello world\n')
        process.send({ cmd: 'notifyRequest' })
      }).listen(8000)
    }

**`Event:'online'`**

与`cluster.on('online')`类似，针对worker（在worker中不会触发）：

    cluster.fork().on('online', () => {
      // worker is online
    })

### Worker成员

**`worker.disconnect()`**

* 参数：无。
* 返回：worker的引用。

调用后：

1. worker会关闭所有监听服务，并等待服务触发`close`事件，之后断开IPC通道的连接。
2. master会发送一个内部事件，让worker自行调用`.disconnect()`方法。

调用这个方法会设置`worker.exitedAfterDisconnect`标志。在worker中调用`process.disconnect()`等效于`.disconnect()`。最佳事件是先给worker发送一个消息，通知它即将要停止，同时设置一个超时时间，让worker在这个时间内处理完当前正在处理的请求：

    if (cluster.isMaster) {
      const worker = cluster.fork()

      let timeout

      worker.on('listening', address => {
        worker.send('shutdown')
        worker.disconnect()
        timeout = setTimeout(() => worker.kill(), 2000)
      })
      worker.on('disconnect', () => {
        clearTimeout(timeout)
      })
    } else {
      const net = require('net')
      const server = net.createServer(socket => {})
      server.listen(8000)
    }

**`worker.exitedAfterDisconnect`**

布尔值，在调用`worker.kill()`或者`worker.disconnect()`之后设置成`true`。如果没调用过，这个值是`undefined`。

这个属性用来判断worker是自行了断的还是由于未知原因断开的：

    cluster.on('exit', (worker, code, signal) => {
      if (worker.exitedAfterDisconnect) {
        console.info('vluntary disconnect')
      }
    })
    worker.kill()

**`worker.id`**

数值，worker的唯一标识，作为`cluster.workers`里面的键值。

**`worker.isConnected()`**

* 参数：无
* 返回：布尔值

如果worker是通过IPC通道连接到master上，返回`true`，否则返回`false`。一个worker在它被创建的时候就和master连接在一起，在worker的`'disconnect'`事件触发之后断开连接。

**`worker.isDead()`**

* 参数：无
* 返回：布尔值

如果worker进程退出了，返回`true`，否则返回`false`。

**`worker.kill([signal='SIGTERM'])`**

* 参数：`signal`，信号
* 返回：无

1. 在master中，调用这个方法之后断开worker与master的连接，当连接断开之后，以`signal`信号kill掉worker进程。
2. 在worker中，调用这个方法之后断开IPC通道，然后退出，返回值为`0`。

调用这个方法之后，`worker.exitdAfterDisconnect`会被设置为`true`。worker进程可以通过`process.kill()`来达到相同的目的。

**`worker.process`**

`ChildProcess`的实例，所有worker都是通过`child_process.fork()`派生的，调用这个方法返回的对象存储在这个属性中。**注意，当`'disconnect'`事件触发，并且`.exitedAfterDisconnect`不是`true`，worker会调用`process.exit(0)`。**

**`worker.send(message[, sendHandle][, callback])`**

* 参数：`message`，对象，要发送的消息
* 参数：`sendHandle`，可选的Handle对象
* 参数：`callback`，可选的回调函数
* 返回：布尔值

同`process.send()`，参考[这里](https://nodejs.org/api/child_process.html#child_process_subprocess_send_message_sendhandle_options_callback)。

### Node多进程实现 - Nginx反向代理

可以启动多个独立的Node进程，监听不同的端口，由nginx接收请求然后进行分配：

    http {
      upstream cluster {
        server 127.0.0.1:3000;
        server 127.0.0.1:3001;
        server 127.0.0.1:3002;
        server 127.0.0.1:3003;
      }
      server {
        listen 80;
        sever_name www.domain.com;
        location / {
          proxy_pass http://cluster;
        }
      }
    }

* 优点：使用擅长反向代理的nginx，稳定性高。
* 缺点：增加或减少一个实例需要更改nginx的配置文件。

### Node多进程实现 - 早期cluster

早期的cluster使用共享handle的方式，当请求过来的时候，worker通过竞争取得请求的处理权，如master的代码：

    const net = require('net')
    const fork = require('child_process').fork
    let handle = net._createServerHandle('0.0.0.0', 3000)
    for (let i = 0; i < 4; i++) {
      fork('./worker').send({}, handle)
    }

worker：

    const net = require('net')
    process.on('message', (m, handle) => start(handle))
    let buf = 'hello nodejs'
    let res = ['HTTP/1.1 200 OK', 'content-length:' + buf.length].join('\r\n') +'\r\n\r\n' + buf
    function start (server) {
      server.listen()
      server.onconnection = (err, handle) => {
        let socket = new net.Socket({ handle })
        socket.readable = socket.writable = true
        socket.end(res)
      }
    }

这个过程中并没有负载均衡，所有进程都在等待请求，当请求过来的时候同时去响应，只有一个进程能响应成功，其他响应失败重新等待请求过来。这样很多进程的处理时间就会浪费在争抢的过程中，造成性能浪费。

### Node多进程实现 - round-robin

为了解决上述的性能浪费问题，Node使用了基于round-robin算法的另一种模型：

> 主要思路是 master 进程创建 socket，绑定地址以及端口后再进行监听。该 socket 的 fd 不传递到各个 worker 进程。当 master 进程获取到新的连接时，再决定将 accept 到的客户端连接分发给指定的 worker 处理。这里使用了指定, 所以如何传递以及传递给哪个 worker 完全是可控的。

对应的master：

    let handle = net._createServerHandle('0.0.0.0', 3000)
    handle.listen()
    handle.onconnection = (err, handle) => {
      let worker = workers.pop()
      worker.send({}, handle)
      workers.unshift(worker)
    }

worker：

    function start (handle) {
      let socket = new net.Socket({ handle })
      socket.readable = socket.writable = true
      socket.end(res)
    }

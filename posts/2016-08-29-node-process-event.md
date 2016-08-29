---
layout: post
title: "Node Process会触发什么事件"
description: ""
category: 
tags: [node]
---

### 引用

1. [process | Node.js v6.4.0 Documentation](https://nodejs.org/api/process.html#process_process_events)
2. [Promise Rejection Events Sample](https://googlechrome.github.io/samples/promise-rejection-events/)

在Node中，`process`对象包含了当前进程的信息以及对该进程的控制方法。这个对象是一个全局对象，不需要用`require()`引入。今天先看看这个对象能触发什么事件，我们可以通过这些事件在Node进程生命周期的不同时刻进行监控，当进程状态异常的时候我们可以在这些事件处理程序中加入自定义的备份操作，防止数据丢失。

### `beforeExit`

当进程的事件队列为空的时候，Node进程会自动退出。当进程退出之前会触发`beforeExit`事件。这个事件的处理程序中，可以使用一些异步的调用，让Node进程继续执行：

    process.on('beforeExit', () => {
      fs.writeFile('/path/to/backup', 'back up data', () => {
        console.log('backup data written')
        // 需要显式调用process.exit(), 或者手动解除事件处理程序
        process.exit()
      })
    })

事件处理程序接收一个参数，就是`process.exitCode`。如果显式调用`process.exit()`方法或者抛出没有捕获的异常时，`beforeExit`事件不会触发。

### `disconnect`

如果Node进程是通过一个IPC通道启动的（如`child_process.fork()`或者使用Cluster），当IPC通道关闭的时候（例如调用了子进程的`disconnect()`方法），则会触发这个事件。

### `exit`

两种情况会触发`exit`事件：

1. 显式调用`process.exit()`。
2. Node清空Event Loop后没有任何待处理的任务。

与`beforeExit`不同，在`exit`事件触发以后不能阻止Node进程退出，当`exit`事件处理程序跑完之后Node进行就会退出。

注：`exit`事件处理程序只能处理**同步**任务。如果在`exit`事件处理程序中添加异步任务，这个任务依然会进入Event Loop中，不过会被抛弃：

    process.on('exit', code => {
      setTimeout(() => {
        console.log('This will not run')
      }, 0)
    })

### `message`

如果Node进程是通过一个IPC通道启动的，进程间可以使用`childprocess.send()`进行通信。当子进程调用`process.send()`方法后，父进程就会触发`message`事件。

这个事件的事件处理程序接受两个参数：

1. `message`，子进程传过来的消息，可以是一个`Object`的实例或者任意基础类型的值。
2. `sendHandler`，一个`net.Socket`实例或者一个`net.Server`实例或者`undefined`。

### `rejectionHandled`

当一个`Promise`实例被拒绝（reject），一个Event Loop之后一个reject的handler使用例如`promise.catch()`等方法绑定到那个实例上之后，就会触发`rejectionHandled`。就是说，`Promise`实例的reject handler是在一个异步过程之后加上的，这时候会触发`rejectionHandled`:

    var rejectPromise = Promise.reject(new Error('test'))
    setTimeout(() => {
      // trigger rejectionHandled first
      rejectPromise.catch(() => console.log('handled'))
    }, 1)

事件处理程序接收一个参数，就是那个`Promise`对象。这个对象之前会在另一个事件，`unhandledRejection`的事件处理程序中作为参数传入。这两个事件配合起来我们可以实现一个机制，监控进程中所有被“拒绝”，而且没有对应处理的`Promise`对象：

    var unhandledRejections = new Map()
    process.on('unhandledRejection', (reason, p) => {
      console.log('unhandleRejection', reason, p)
      unhandledRejections.set(p, reason)
    })

    process.on('rejectionHandled', p => {
      console.log('rejectionHandled', p)
      unhandledRejections.delete(p)
    })

这样我们就可以在程序运行途中对没有处理的被拒绝的`Promise`进行监控，可以周期处理那些超时也没有处理的情况，例如记录日志、写入数据库等等。

### `uncaughtException`

当程序抛出了异常但是没有进行`try...catch`的时候，就会触发这个事件。触发这个事件后，Node默认的做法就是打印这个错误的堆栈到`stderr`，然后整个进程退出！我们可以增加这个事件的处理程序去更改这个默认行为：

    process.on('uncaughtException', err => {
      fs.writeSync(1, `caught exception: ${err}`)
    })

注意：不要把这个事件当作正常的处理程序！这个事件处理程序应该是最后的保护手段。当这个事件触发的时候，说明整个程序的状态是不稳定的。这时候应该保存进程运行的状态，使用这个备份的状态重启进程。

正确的做法是在这个事件处理程序中进行一些**同步**的清理、备份工作，防止进程意外退出留下垃圾和丢失数据。在这个事件触发之后，应该记录日志，看看代码中哪个异常没有被捕获，是否能增加额外的代码防止异常的触发或者直接捕获对应的异常。

### `unhandledRejection`

当一个`Promise`被拒绝，但是没有对应的处理程序时触发这个事件。这个事件对于检测程序运行中有哪些被拒绝的`Promise`没有处理非常有用。和`rejectionHandled`配合起来使用效果更佳。

### `warning`

Node程序运行时会抛出一些警告。这些警告跟异常相似，但是不会像异常那样，如果不捕获就会导致程序退出。当Node检测到一些异常代码可能会影响程序的性能，或者导致程序有不可预知的bug，就会抛出警告。
默认情况下，Node会把这些警告打印到`stderr`中：

    var events = require('events')
    events.defaultMaxListeners = 1
    process.on('foo', () => {})
    process.on('foo', () => {})
    
控制台输出：

    (node) warning: possible EventEmitter memory leak detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit.
    Trace
      at process.addListener (events.js:252:17)
      at Object.<anonymous> (process-warning.js:6:9)
      at Module._compile (module.js:413:34)
      at Object.Module._extensions..js (module.js:422:10)
      at Module.load (module.js:357:32)
      at Function.Module._load (module.js:314:12)
      at Function.Module.runMain (module.js:447:10)
      at startup (node.js:148:18)
      at node.js:405:3

Node 6后增加了`warning`事件，当程序抛出警告后会触发这个事件。这个事件的事件处理程序接受一个`warning`对象作为参数，这个对象有以下几个字段：

1. `name`，这个警告的名字，默认是`Warning`。
2. `message`，这个警告的描述信息。
3. `stack`，抛出警告所在代码的堆栈信息。

然后我们就可以根据这些警告的信息作出对应的处理。

### Signal事件

当Node进程接收到信号的时候触发这些事件：

    process.on('SIGINT', () => {
      console.log('Recieve SIGINT, Press Control-D to exit')
    })

在使用Signal事件的时候有几个注意事项：

1. `SIGUSR1`这个信号用来通知Node启动调试器。可以监听这个事件但是并不会阻止调试器启动。
2. `SIGTERM`和`SIGINT`在非Windows平台有默认行为。如果监听了这些事件这些默认行为就会被移除，即Ctrl+C发送SIGINT并不会使以上的Node程序退出。
3. `SIGPIPE`默认会被忽略。
4. `SIGHUP`，在非Windows平台，这个信号的默认行为就是终止Node程序。
5. `SIGTERM`不支持Windows平台。
6. `SIGINT`信号从终端发送，支持所有平台，一般是按CTRL+C发送。
7. `SIGBREAK`信号只支持Windows平台，按CTRL+BREAK发送。
8. `SIGKILL`信号不能被监听，当接收到这个信号的时候不管任何情况都会终止Node程序。
9. `SIGSTOP`信号不能被监听。

在Linux上所有可能会发送的信号在[这里](http://man7.org/linux/man-pages/man7/signal.7.html)。

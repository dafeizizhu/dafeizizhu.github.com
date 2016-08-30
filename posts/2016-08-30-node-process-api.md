---
layout: post
title: "Node process有什么属性方法（一）"
description: ""
category: 
tags: [node]
---

### 引用

1. [process | Node.js v6.5.0 Documentation](https://nodejs.org/api/process.html#process_process_abort)
2. [Linux Core Dump - hazir - 博客园](http://www.cnblogs.com/hazir/p/linxu_core_dump.html)

### `process.abort()`

调用这个方法之后会立刻终止Node进程，并生成一个core dump。有关core dump可以参考引用2。

### `process.arch`

这个属性返回CPU的架构，可以是`arm`、`ia32`或者`x64`。

### `process.argv`

这个属性返回一个包含所有传递给Node命令行参数的数组。数组的第一个元素是`process.execPath`；数组的第二个元素是Node执行的JavaScript文件的路径。数组的其他元素就是传递到命令行的参数：

    node process.js one two three
    
像上面这样调用，`process.argv`返回的数组如下：

    [
      '/path/to/node',
      '/path/to/process.js',
      'one',
      'two',
      'three'
    ]

### `process.chdir(directory)`

这个方法可以改变当前Node进行的工作目录或者抛出一个异常（例如指定的目录并不存在等）：

    console.log(process.cwd())
    try {
      process.chdir('/tmp')
      console.log(process.cwd())
    } catch (e) {
      console.log(e)
    }

### `process.config`

这个属性返回当前Node编译时的配置，跟执行`./configure`脚本时生成的`config.gypi`文件一致。

### `process.connected`

当这个进程是通过IPC通道启动的，这个属性在IPC通道联通的时候返回`true`，在调用`process.disconnect()`之后返回`false`。

只要这个属性的值是`flase`，这个进程就不能通过`process.send()`去发送消息。

### `process.cwd()`

这个方法返回当前进程的工作目录。

### `process.disconnect()`

如果这个进程是通过一个IPC通道激活的，调用这个方法会关闭这个通道。如果父进程调用`childProces.disconnect()`也可以达到一样的效果。

如果这个进程不是通过IPC通道激活的，那么`process.disconnect()`的值是`undefined`。

### `process.env`

这个属性包含了当前用户的环境变量。这个属性不是只读的，可以通过修改：

    process.env.foo = 'bar'
    console.log(process.env.foo) // bar

这样修改只会影响进程内部，影响不了进程外部：

    $ node -e 'process.env.foo = "bar"' && echo $foo // nothing

使用`delete`操作符可以删除某个环境变量：

    process.env.TEST = 1
    delete process.env.TEST
    console.log(process.env.TEST) // undefined

### `process.execArgv`

这个属性包含了在Node和执行脚本名称中间的一些命令行参数（例如`--harmony`），这些参数不会出现在`process.argv`中，也不包括Node路径、JavaScript脚本路径和在JavaScript脚本路径后面的所有参数。这个属性是为了在激活子进程的时候使用相同的执行环境。

### `process.execPath`

这个属性返回Node的绝对地址。

### `process.exit([code])`

调用这个方法可以主动终止当前的进程。这个方法接受一个参数`code`，指定进程的返回值。如果不给这个参数，默认返回成功`0`或者`process.exitCode`（如果有声明的话），例如：

    process.exit(1) // 'failure code'

调用了这个方法之后，就算Event Loop里面还有没完成的任务（例如I/O操作等异步任务），都会终止这个进程。

通常没有必要显式调用`process.exit()`方法，Node进程会在Event Loop清空的状态下自动终止。可以通过设置`process.exitCode`改变进程结束的返回值。

最佳实践：如果有必要提前终止程序，可以抛出一个异常而不捕获它，这样比调用`process.exit()`要好一点。

### `process.exitCode`

通过设置这个属性可以改变进程终止时的返回值。这个值会被`process.exit(code)`中的参数所覆盖。

### `process.hrtime([time])`

这个方法返回一个`[seconds, nanoseconds]`的时间值。可以传入一个参数`time`，这个参数必须是`process.hrtime()`返回的结果，返回的是当前时间和这个时间之间的差值：

    var time = process.hrtime()

    setTimeout(() => {
      var diff = process.hrtime(time)
      console.log(`diff ${diff[0] * 1e9 + diff[1]} nanoseconds`)
    }, 1000)

这个方法最大的用处就是测量代码的时间性能。

### `process.kill(pid[, signal])`

这个方法发送指定的信号到指定的进程，其中：

1. `pid`，指定的进程id。
2. `signal`，指定的信号，默认为`SIGTERM`。

当找不到这个进程id对应的进程时这个方法会抛出异常。可以发送一个为`0`的信号测试一下指定的进程是否存在。所以，虽然这个方法的名称为`kill`，但是调用它并不一定会终止这个进程，它其实只是一个信号发送器：

    process.on('SIGHUP', () => {
      console.log('Got SIGHUP signal')
    })
    process.kill(process.pid, 'SIGHUP')

### `process.memoryUsage()`

这个方法返回当前进程使用的内存总量，单位是`byte`：

    console.log(process.memoryUsage()) // => { rss: 14454784, heapTotal: 6981296, heapUsed: 3668152 }

其中`heapTotal`和`heapUsaged`是V8引擎的内存用量。

### `process.nextTick(callback[, arg][,...])`

这个方法会在当前的Event Loop结束之后立刻执行`callback`的回调函数。看起来很像`setTimeout(callback, 0)`，但是这个方法效率更高。调用这个方法后，回调的执行要比其他I/O操作、timer要来得更早：

    setTimeout(() => { console.log('timeout') }, 0)
    process.nextTick(() => console.log('next tick'))

    // => next tick
    // => timeout

这个方法最大的作用是保持一个函数/方法在运行的过程中始终是异步的，我们考虑一种情况：

    function maybeSync(arg, cb) {
      if (arg) cb()
      else fs.state('file', cb)
    }

这时候这么调用这个方法：

    maybeSync(someCondition, () => foo())
    bar()

这样在程序的运行过程中就不能保证`foo()`和`bar()`的执行顺序，这样是十分危险的，应该改成这样：

    function definitelyAsync(arg, cb) {
      if (arg) process.nextTick(cb)
      else fs.state('file', cb)
    }

这样改之后`bar()`永远比`foo()`要先执行。

（太多了，未完待续……）

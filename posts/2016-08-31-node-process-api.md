---
layout: post
title: "Node process有什么属性方法（二）"
description: ""
category: 
tags: [node]
---

### 目录

1. [Node process有什么属性方法（一）](/posts/2016/08/30/node-process-api.html)

### 引用

1. [process | Node.js v6.5.0 Documentation](https://nodejs.org/api/process.html#process_process_pid)

### `process.pid`

返回当前进程的PID。

### `process.platform`

返回当前进程的操作系统平台，例如`darwin`、`freebsd`、`linux`、`sunos`或者`win32`。

### `process.release`

返回当前Node Release的一些信息，例如：

1. `name`，一般是`node`，早期的io.js版本是`io.js`。
2. `sourceUrl`，当前版本的源码地址。
3. `headersUrl`，当前版本的头文件地址。
4. `libUrl`，仅在Windows平台有，表示用来编译Node.js原生插件所使用库的地址。
5. `lts`，如果当前的Node.js不是LTS版本，为`undefined`。

注：如果是自定义编译出来的Node.js，`process.release`只有`name`一个属性，其他的属性都为`undefined`。

### `process.send(message[, sendHandle[, options]][, callback])`

如果当前进程是通过IPC通道激活的，这个方法可以给父进程发送消息来与父进程通信。消息会通过触发子进程对象的`message`事件通知父进程：

    // parent
    var fork = require('child_process').fork
    var childProcess = fork('./process-send-child.js')
    childProcess.on('message', message => {
      console.log('recieve a message from childProcess', message)
    })
    // child
    if (process.send) {
      process.send({ text: 'Hello World' })
    }

如果进程不是通过IPC通道激活的，`process.send`为`undefined`。

注：其中的`message`是通过`JSON.stringfiy()`来序列化的。

### `process.setuid(id)`

这个方法可以设置运行当前Node.js程序的uid。其中的参数`id`可以是一个数字ID或者是一个用户名字符串。如果是传入字符串，这个方法会在查找这个字符串对应的数字ID的过程中会被阻塞，找不到对应的数字ID会抛出一个异常：

    if (process.getuid && process.setuid) {
      console.log(`Current uid: ${process.getuid()}`)
      try {
        process.setuid(501)
        conosle.log(`New uid: ${process.getuid()}`)
      } catch (err) {
        console.log(`Failed to set uid: ${err}`)
      }
    }

其中`process.getuid()`和`process.setuid()`只在POSIX平台上有效，在Windows平台是没有的。

### `process.stderr`和`process.stdout`

这两个属性返回一个写入流，分别对应`stderr`和`stdout`。这两个流跟普通的Node.js流有以下几个区别：

1. 它们不能被关闭，调用它们的`end()`方法会抛出异常。
2. 它们永远不会触发`finish`事件。
3. 如果流被定向到文件输出，可能会阻塞。
4. 在UNIX上如果被定向到终端，则会阻塞。

我们可以调用`process.stderr`和`process.stdout`上的`isTTY`属性判断当前进程是否运行在终端环境下。

### `process.stdin`

这个属性返回一个读取流，对应`stdin`。例如我们可以编写一段程序读取标准输入流所输入的内容：

    process.stdin.setEncoding('utf8')

    process.stdin.on('readable', () => {
      var chunk = process.stdin.read()
      if (chunk != null) {
        process.stdout.write(`data: ${chunk}`)
      }
    })

    process.stdin.on('end', () => {
      process.stdout.write('end')
    })

在终端运行这个程序，按下回车键时就会触发`readable`事件，回显输入的内容。

### `process.title`

这个属性返回当前进程在`ps`中显示的标题。我们可以给这个属性赋值，在`ps`的返回内容里面这个进程的标题就是我们自定义的赋值。

注：不同的平台对这个属性的最大长度有不同的限制。

### `process.umask([mask])`

这个方法可以设置或者返回当前执行脚本的权限码。子进程会继承这个码。如果传递了`mask`参数，则会返回老的权限码；如果没有，则返回当前的权限码。

### `process.uptime()`

返回当前进程运行的时间，单位是秒。

### `process.version`

返回当前Node.js的版本。

### `process.versions`

返回当前Node.js及其依赖的版本。

### 返回值

Node.js在没有异步任务的时候会自动结束，一般以`0`为返回值。下面是其他异常情况的一些返回值：

1. `1`，抛出了没有捕获的异常，通常是因为异常没有被`domain`对象或者`uncaughtException`事件处理程序捕获。
2. `2`，暂时没用到。
3. `3`，Node.js内部JavaScript解析错误，在发行版本中非常罕见。
4. `4`，Node.js内部JavaScript执行错误，在发行版本中非常罕见。
5. `5`，V8内部的致命错误。
6. `6`，内部错误处理程序没有捕获到的异常。
7. `7`，内部错误处理程序试图捕获错误的过程中抛出异常，例如`uncaughtException`事件处理程序中抛出异常。
8. `8`，没有用到，早期版本表示抛出了没有捕获的异常。
9. `9`，非法参数。
10. `10`，Nodejs内部JavaScript执行错误，在发行版本在非常罕见。
12. `12`，非法的debug参数。
13. `>128`，接收到`SIGKILL`或者`SIGHUP`信号退出，这个时候的返回值是128加上对应信号的数字值。

（完）

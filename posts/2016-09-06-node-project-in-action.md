---
layout: post
title: "我的Node项目实践 - 踩坑篇"
description: ""
category: 
tags: [node]
---

### 目录

1. [我的Node项目实践 - 实践篇](/posts/2016/08/18/node-project-in-action.html)
2. [我的Node项目实践 - 部署篇](/posts/2016/08/25/node-project-in-action.html)

### `uncaughtException`

由于Node在执行中会抛出各种异常，例如这边部署的时候会抛出一个`connect ETIMEDOUT`异常，初步定位是当前服务器跟前端机连接闪断之后抛出的。这种情况在代码中也没有地方可以保护，所以一定要在程序中加入`uncaughtException`事件处理程序，当抛出类似的异常时，可以在这个事件处理程序中捕获住，进行一些同步的备份工作，然后退出进程：

    process.on('uncaughtException', err => {
      try {
        doSomethingSync()
      } catch (err) {}
      process.exit(0)
    })

调用`process.exit()`方法之后，进程退出，让PM2重启该进程。在进程初始化的地方加入恢复状态的代码即可。

### PM2 Graceful Restart

另外一个会导致进程重启的场景是要更新代码，必须重启进程使代码生效：

    pm2 stop live-grab-slave
    pm2 start /path/to/live-grab-slave/bin/slave.js -- name live-grab-slave

调用`pm2 stop`之后，当前进程会收到一个信号`SIGINT`，我们也需要在这个信号的处理程序中加入跟`uncaughtException`类似的处理方式：

    process.on('SIGINT', () => {
      // same as above
    })

这样就可以优雅地重启了。

### `fs.stat()`奇葩异常

在系统运行过程中，突然有一天出现ffmpeg反复启动的情况，系统中已经启动了超过100个ffmpeg进程。经过观察日志看出，`fs.stat()`的回调没有被执行Orz。由于系统是通过`fs.stat()`获取抓取文件的状态来判断当前抓取的URL是否没有数据来了，当该回调没触发的时候这个机制出现了异常，导致频繁启动ffmpeg进行转码。

为了解决这个问题，我在`fs.stat()`中加入了超时机制：

    function fsStatWithTimeout(filePath, cb) {
      var timeout = false
      var tId = setTimeout(() => {
        timeout = true
        cb(new Error('fs.stat timeout'))
      }, 1000)
      fs.stat(filePath, (err, stat) => {
        clearTimeout(tId)
        if (timeout) return
        cb(null, stat)
      })
    }

这个其实是挺奇葩的，不知道是否是服务器上的Node.js有问题还是其他什么环境问题触发的。理论上涉及外部系统的一些接口，例如其他系统的http接口等，都需要加入超时机制，防止回调没有执行导致系统状态异常。

### ffmpeg又来了

为了防止系统的ffmpeg进程在同一时间启动太多，刚开始的方式是：

1. 任务结束的时候自动启动ffmpeg进行转码。
2. 设置一个定时器，启动ffmpeg对备份文件所指定的文件进行转码。这些备份文件是在系统重启的时候生成的，在完成转码之后删除该备份文件。

这个机制刚开始的时候还是运行得比较好的。又是突然有一天，运维反馈机器上正在不断地启动ffmpeg进程，速率刚好是我设置的定时器的间隔，大概5分钟左右。通过观察日志，原来其中一个通过备份文件启动的ffmpeg进程，在5分钟之内还没有转码完成！导致备份文件一直都没被删除，在定时器触发的时候继续启动同样的ffmpeg任务进行转码！

这个简单的机制已经不适用于当前系统的执行环境了，需要进行更通用的改动：

1. 任务结束的时候统一写入一个备份文件。
2. 转码任务统一通过一个定时器触发。
3. 定时读取文件夹中的备份文件，当获取到备份文件之后取第一个进行转码。
4. 定时器触发的时候，如果系统中已经在转码的话，跳过。
5. 转码完成之后立即读取文件夹中的备份文件，继续取第一个进行转码。

这样的机制，可以保证系统在备份文件存在的时候不断地进行转码任务，而且每一次只运行一个转码任务，保证系统资源不被转码任务吃光。在备份文件被吃光，又有备份文件生成的情况下，通过定时器也可以触发转码任务：

    function processOne(cb) {
      doSomething(cb)
    }

    function init() {
      var processing = false
      var processOneCallback = err => {
        if (err) {
          processsing = false
        } else {
          processOne(processOneCallback)
        }
      }
      var intervalCallback = () => {
        if (processing) return
        processing = true
        processOne(processOneCallback)
      }
      processOne(processOneCallback)
      setInterval(intervalCallback, 60 * 1000)
    }

### 总结

在系统运行的过程中还有更多诡异的情况，例如莫名其妙地重启啊、备份数据写入失败啊、备份数据写入不完全啊等等。切记切记要加茫茫多的日志，保证进程在执行时任何异常的情况都被记录下来哦，么么哒。

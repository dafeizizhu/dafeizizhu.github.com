---
layout: post
title: "Node中spawn和exec的区别"
description: ""
category: 
tags: [node]
---
{% include JB/setup %}

今天试着结合SPM和Grunt来做项目的构建，在Node中使用子进程调用SPM命令的时候，看文档先用了`spawn`，发现老是抛出一个错误。后来使用`exec`就没有什么问题。这两个方法都可以在Node中创建一个子进程执行一些操作系统的命令（bat或者shell脚本），究竟这两者有什么不一样呢？

###child_process.spawn
____

`spawn`应该是创建子进程的一个基本的方法。该方法接受三个参数：

1. `command`，表示要执行命令的字符串。
2. `args`，表示执行命令的命令行参数，如果不提供默认值是一个空数组。
3. `options`，可选配置。

其中`options`可以配置的属性有：

1. `cwd`，配置该命令执行的目录。
2. `stdio`，配置子进程跟父进程直接的输入输出方式。
3. `env`，配额子进程中的环境变量。
4. `detached`，配置子进程是否独立的。默认情况下父进程是需要等待子进程结束才能结束，当这个配置为`true`时，父进程不需要等待子进程结束，子进程会在后台继续执行。（子进程使用了父进程的io则这个配置始终都是默认情况。）
5. `uid`，配置执行子进程的用户id。
6. `gid`，配置执行子进程的用户组id。

`options`的默认值为：

    {
      cwd: undefined,
      env: process.env
    }

执行该方法后会返回一个`ChildProcess`实例。

###ChildProcess
____

这个类的实例有以下几个事件：

1. `error`，不能派生子进程、不能杀死子进程或者`sendMessage`失败等。
2. `exit`，子进程正常退出或者父进程发送消息主动结束子进程。
3. `close`，同`exit`，不一样的是`close`会等待使用的`stdio`全部结束后才会触发（多个子进程可能共享`stdio`）。
4. `disconnect`，再调用`disconnect`方法之后触发，触发之后不能再发送消息。
5. `message`，接收到消息的时候触发。

这个对象还有几个关于标准输入输出的流：`stdin`、`stdout`、`stderr`，分别对应输入、输出和错误流，可以监听这些流的`data`事件捕获子进程的标准输入输出（一般是控制台的输入输出流），如：

    var spawn = require('child_process').spawn,
    ls = spawn('ls', ['-lh', '/usr']);

    ls.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

###child_process.exec
____

看Node上面的文档，容易看出来`exec`是`spawn`的简化版本。该方法也接受三个参数：

1. `command`，要执行的命令的字符串。
2. `options`，可选的配置。
3. `callback`，一个回调函数。当子进程结束的时候会被调用。

其中回调函数有三个输入参数：`error`、`stdout`和`error`，分别对应错误流、输出流和执行的错误对象。由于这个回调函数封装了两个输出流和错误对象，有大部分的场景都可以不去使用返回的`ChildProcess`对象，直接使用这个回调函数即可。

###陷阱
____

查看了一些资料，发现这两者之间还有一些区别。

> 大家都知道在linux下, ls命令对应的是一个文件, 而在windows下是做为cmd的内置命令的. 所以像我那样写是会报错.

> 所以想使用内置命令可以直接使用exec或者把spawn改成spawn("cmd.exe",["\s", "\c", "dir"]);

> 总结起来就是spawn是调用一个文件! 不要被docs上的child_process.spawn(command, [args], [options])中的command给骗了 

总结，在windows下面就是坑！

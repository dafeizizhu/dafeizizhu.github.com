---
layout: post
title: "child_process Exec Vs Spawn"
description: ""
category: 
tags: [node]
---

### 引用

1. [Node.js进程通信模块child_process | 粉丝日志](http://blog.fens.me/nodejs-child-process/)
2. [exec与spawn方法的区别与陷阱 - dead_horse](http://deadhorse.me/nodejs/2011/12/18/nodejs%E4%B8%ADchild_process%E6%A8%A1%E5%9D%97%E7%9A%84exec%E6%96%B9%E6%B3%95%E5%92%8Cspawn%E6%96%B9%E6%B3%95.html)
3. [Child Process | Node.js v7.2.1 Documentation](https://nodejs.org/api/child_process.html)

在Node应用中我们也会调用系统命令或者其他命令行工具（例如ffmpeg），这时候会使用`child_process`这个库中的`exec()`或者`spawn()`方法，派生新的进程去调用这些命令或者工具。

### `child_process.exec()`

这个方法接受3个参数：

1. `command`，要执行的命令行。这个字符串可以跟空格隔开的参数列表，在Linux中会对其作bash解析，可以使用复杂的命令行，例如管道。
2. `options`，可选的选项，其中包括：
  1. `cwd`，设置子进程的工作目录。
  2. `env`，设置子进程的环境变量。
  3. `encoding`，设置第三个参数的回调方法的参数`stdout`和`stderr`的字符编码，默认是`utf8`。如果这个值是`buffer`，则`stdout`和`stderr`为`Buffer`的实例。
  4. `timeout`，设置子进程执行的超时时间，默认是0，表示没有超时时间。当子进程执行的时间超过`timeout`设置的时间，则会向子进程发送`killSignal`结束该进程。
  5. `maxBuffer`，设置第三个参数的回调方法的参数`stdout`和`stderr`的最大长度，单位是Byte，默认是200KB。
  6. `killSignal`，设置结束子进程时发送的信号，默认是`SIGTERM`。
  7. `uid`，设置执行子进程的用户id。
  8. `gid`，设置执行子进程的用户组id。
3. `callback`，当子进程结束时的回调函数，接受3个参数：
  1. `error`，子进程执行的错误对象，如果子进程执行成功，返回值为0，则`error`为`null`；反之，`error`包含了子进程执行失败的信息，其中`error.code`是子进程的exit code（应该是非0值），`error.signal`为结束子进程时发送的信号。当子进程的exit code不为0的情况下都认为子进程执行失败。
  2. `stdout`，子进程执行完毕之后标准输出的内容。
  3. `stderr`，子进程执行完毕之后错误输出的内容。

`exec()`默认的参数为：

    {
      encoding: 'utf8',
      timeout: 0,
      maxBuffer: 200 * 1024,
      killSignal: 'SIGTERM',
      cwd: null,
      env: null
    }

直接使用`exec()`最大的好处就是非常方便，直接把命令行作为第一个参数传入就可以在回调函数中获取进程执行后标准输出的内容：

    const exec = require('child_process').exec;
    exec('cat *.js bad_file | wc -l', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });

但是`exec()`有几个缺点。第一个就是当命令行执行时标准输出的内容非常多的时候，超过选项中设置的`maxBuffer`的大小，则会中断子进程的执行并认为子进程执行失败。当然，可以通过设置足够大的`maxBuffer`去避免这个问题，但是线上的情况我们很难去给出一个合理的`maxBuffer`大小。

第二个就是`exec()`的第一个参数是会进行bash解析的，这就意味着，如果这个参数的内容包含用户的输入，则有可能发生命令注入的情况：

    var cmd = 'ls -l .;pwd'
    var ls = childProcess.exec(cmd, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
      }
      console.log('Child Process STDOUT: '+stdout);
    });

在显示`ls`结果的同时把`pwd`命令的输出也一并显示了。如果`ls`的参数是用户输入的，则代表这个用户可以输入任意的命令在这台服务器上执行！

幸好，以上两个问题通过使用`child_process.spawn()`都能解决。

### `child_process.spawn()`

其实`exec()`是`spawn()`的一个封装。`spawn()`接受3个参数：

1. `command`，要执行的命令。注意，这里的命令不会执行bash解析，所以必须是一个可以执行的命令。
2. `args`，给命令的参数，以数组的形式给出。
3. `options`，选项，其中：
  1. `cwd`，同`exec()`。
  2. `env`，同`exec()`。
  3. `argv0`，显式设置子进程中`argv[0]`的值，如果没有声明则为`command`的值。
  4. `stdio`，设置子进程中的标准输入输出，可以通过这个选项重定向子进程的标准输入输出。
  5. `detached`，让子进程独立于父进程执行。
  6. `uid`，同`exec()`。
  7. `gid`，同`exec()`。
  8. `shell`，如果设置成`true`，则使用shell执行`command`，这时候`command`的内容就会被bash解析，意味着也能使用复杂的命令行。在UNIX上可以设置成`/bin/sh`，在Windows上可以设置成`cmd.exe`。这个shell必须能解析UNIX中的`-c`跳转和Windows中的`/d /s /c`。默认是`false`。

`spawn()`默认的参数为：

    {
      cwd: undefined,
      env: process.env
    }

可以看到`spawn()`并没有像`exec()`那样提供一个子进程结束时的回调。需要通过事件的方式获取标准输入中的内容和通知子进程执行结束：

    const spawn = require('child_process').spawn;
    const ls = spawn('ls', ['-lh', '/usr']);

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

其中有两个选项值得注意，第一个是`detached`。在Windows上，当设置为`true`时，子进程会有自己独立的控制台窗口，当父进程执行完毕时子进程仍能继续执行。在非Windows平台，当设置为`true`时，子进程会生成一个新的进程组并拥有自己的会话。在非Windows平台时，无论`detached`设置成`true`或者`false`，子进程都有可能在父进程结束后仍然继续执行。

默认情况下，父进程会等待子进程执行完毕之后再退出。可以调用`spawn()`返回的子进程对象`child`的`unref()`方法，让父进程的事件循环忽略这个子进程的引用计数，允许父进程独立地退出，即使父进程与这个子进程仍然有IPC通道。

如果要执行一个类似背景程序的应用，但是设置`detached`是不够的。还需要为子进程设置`stdio`来保证父进程和子进程之间完全没有联系：

    const spawn = require('child_process').spawn;

    const child = spawn(process.argv[0], ['child_program.js'], {
      detached: true,
      stdio: 'ignore'
    });

    child.unref();

这时候就涉及第二个选项，`stdio`。这个选项用于配置父进程与子进程之间的标准输入输出管道。默认情况下，子进程的`stdin`、`stdout`和`stderr`会被定向到`child.stdin`、`child.stdout`和`child.stderr`。

`stdio`这个选项接受一个数组，数组中每一个项都与子进程的一个fd相关联，其中第0、1、2个fd会指向`stdin`、`stdout`和`stderr`。还能传入更多的值，为父进程和子进程间建立更多的管道。其中每一个项必须为以下几种情况：

1. `pipe`，创建一个管道。为fd0-2创建的管道分别对应`stdin`、`stdout`和`stderr`。
2. `ipc`，创建一个IPC管道。提供这个设置之后会在父进程中启用`child.send()`方法和`child.on('message')`。如果子进程时一个Node进程，这个IPC管道还能启用子进程中的`process.send()`，`process.disconnect()`、`process.on('disconnect')`和`process.send()`方法。
3. `ignore`，忽略子进程中的fds，会导致Node.js打开`/dev/null`并附加到子进程中。
4. `<Stream>Object`，共享一个可读或者可写的流，例如一个终端、文件、socket或者另一个管道给子进程。
5. 非负整数，对应当前进程打开的fd，这个fd会被子进程共享。
6. `null`、`undefined`，使用默认值，即为0、1、2创建一个管道（pipe），其余的都忽略（ignore）。

例如：

    const fs = require('fs');
    const spawn = require('child_process').spawn;
    const out = fs.openSync('./out.log', 'a');
    const err = fs.openSync('./out.log', 'a');

    const child = spawn('prg', [], {
      detached: true,
      stdio: [ 'ignore', out, err ]
    });

    child.unref();

这样就把子进程的标准输出和错误输出都定位到了一个文件上面。

### 总结

1. 当命令是安全的，并且标准输出的内容可控且不多，可以直接使用`exec()`执行。
2. 当标准输出的内容非常多或者不可控，命令还是安全的情况下，可以使用`spawn()`并把`shell`设置为`true`。
3. 当命令不安全的时候，需要使用`spanw()`并把该命令的参数通过`spawn()`的第二个参数传入才行。

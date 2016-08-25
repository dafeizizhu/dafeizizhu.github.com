---
layout: post
title: "我的Node项目实践 - 部署篇"
description: ""
category: 
tags: [node]
---

### 目录

1. [我的Node项目实践 - 项目篇](/posts/2016/08/18/node-project-in-action.html)

### 更改执行程序的用户

在部署到线上之前，需要限制程序运行的权限，避免程序被黑之后影响整个服务器。在Node中，一般使用`process.setuid()`方法来设置当前进程使用哪个用户来执行：

    if (process.env.NODE_USER) {
      console.log("run as "+process.env.NODE_USER)
      process.setuid(process.env.NODE_USER)
    }

这样需要在执行程序之前配置一个环境变量`NODE_USER`。

### 使用PM2管理

使用PM2的原因可以参考[这里](/posts/2016/07/16/node-pm2.html)。在启动脚本中使用PM2来执行程序：

    # restart.sh
    # stop
    pm2 stop live-grab-slave
    # start
    pm2 start /path/to/bin/slave.js -- name live-grab-slave -- --port 18082

启动进程时记得加上`-- name`这个参数，在停止的时候就可以用这个参数的值去找到对应的进程。

### 启动脚本

当程序的代码发生改动的时候，需要执行一个重启脚本来应用更改的内容，包括：

1. 配置相关的环境变量
2. 停止程序
3. 启动程序

例如：

    #!bin/bash
    source /path/to/some/server/env
    export NODE_USER=www
    # restart.sh see above

这里设置的`NODE_USER`就是声明这个Node程序是使用`www`这个用户的权限来执行的，防止程序被黑之后服务器遭到意外的破坏。

### 部署流程

1. 部署机器通过内网svn/git拉取程序代码
2. 部署机器通过某个协议把代码上传到线上的服务器
3. 执行对应的重启脚本启动程序

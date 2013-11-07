---
layout: post
title: "在Node上使用Redis"
description: ""
category: 
tags: [node]
---
{% include JB/setup %}

Redis是一个开源的，基于`key-value`的内存数据库，可以作为一个能够存储字符串、哈希表、列表、集合等数据结构的数据服务器。

首先是要安装一个Redis。在Unix/Linux下需要下载源码编译安装，今天就来简单看看Windows下如何安装吧。打开Redis的Windows版本的[下载页面](https://github.com/rgl/redis/downloads)，选择对应Windows版本的包下载即可。

下载完解压到一个地方就可以使用了。首先启动Redis服务，双击`redis-server.exe`即可：

    [9612] 07 Nov 18:01:28 # Warning: no config file specified, using the default config. In order to specify a config file use 'redis-server /path/to/redis.conf'
    [9612] 07 Nov 18:01:28 * Server started, Redis version 2.4.5
    [9612] 07 Nov 18:01:28 * DB loaded from disk: 0 seconds
    [9612] 07 Nov 18:01:28 * The server is now ready to accept connections on port 6379
    [9612] 07 Nov 18:01:29 - DB 0: 8 keys (0 volatile) in 12 slots HT.
    [9612] 07 Nov 18:01:29 - 0 clients connected (0 slaves), 1182568 bytes in use

启动后可以看到当前的端口、使用了多少个`key`还有多少个客户端链接进来等信息。注意哦，这些信息现在都是默认的配置，修改配置文件`redis.conf`可以修改这些信息，详细的配置文档[参考这里](http://redis.io/topics/config)。然后就可以启动`redis-cli.exe`来使用Redis了：

    redis 127.0.0.1:6379> set foo bar
    OK
    redis 127.0.0.1:6379> get foo
    "bar"

今天主要是关注Node下面怎么使用Redis。[这里](https://github.com/mranney/node_redis)有封装了一套API，让我们很方便地在Node里面使用Redis。API跟Redis的命令的名称基本上是一致的，例如`get`、`set`，还有最常用的哈希表操作`hgetAll`、`hmset`等。

首先是要在工作目录下载这个包：

    npm install redis

然后就可以使用了！我们用Node的命令行来演示一下：

    var client = require("redis").createClient();
	client.set("foo", "bar");
	client.get("foo", function (err, reply) {
      console.log(reply);
    });

跟上面的命令行的命令保持一致，很方便。这个包还支持一些事件，例如`ready`、`connect`等，也提供了一些方便的工具函数，例如`redis.print`，方便我们用Redis的方式输出内容等，有兴趣的童鞋可以查看github上的文档哦。

---
layout: post
title: "使用winston记录日志"
description: ""
category: 
tags: [node]
---

### 引用

1. [winstonjs/winston at 2.x](https://github.com/winstonjs/winston/tree/2.x)
2. [winston/transports.md at master · winstonjs/winston](https://github.com/winstonjs/winston/blob/master/docs/transports.md)

### winston

winston是一个支持多个日志输出目标的Node日志库。使用winston可以将日志输出到控制台、文件或许是自定义的目标（例如专用的日志服务器等等）。winston将记录日志和保存日志两个操作进行解耦。

**注：由于winston-daily-rotate-file库只支持到2.x，so此文仅针对winston 2.x。**

### Transport

winston将输出的目标抽象成`Transport`对象。winston提供了三种基础的`Transport`：

**`winston.transports.Console(options)`**

输出到控制台，其中`options`：

1. `level`，日志级别，默认`'info'`。
2. `timestamp`，布尔值，`true`则自动加入时间戳；函数，返回的值作为`timestamp`加入到`formatter`的`options`中，默认值是`false`。
3. `json`，布尔值，是否以JSON格式输出，默认是`false`。
4. `stringify`，布尔值，是否调用`JSON.stringify()`输出，默认是`false`。
5. `prettyPrint`，布尔值，是否格式化输出，默认是`false`。
6. `depth`，数值，对象显示的深度，默认是`null`，即不限制。
7. `formatter`，格式化函数，用这个函数的返回值代替输出，默认是`undefined`。

**`winston.transports.File(options)`**

输出到文件，其中`options`：

1. `level`，同`Console`。
2. `name`，字符串，这个`Transport`对象的标识。
3. `timestamp`，同`Console`，默认值是`true`。
4. `filename`，字符串，输出的文件路径。
5. `maxsize`，数值，当文件大小超过这个数值则会回滚。
6. `maxFiles`，数值，最大的文件个数。
7. `stream`，`WriteableStream`对象，输出到写入流。
8. `json`，同`Console`，默认值是`true`。
9. `zippedArchive`，布尔值，是否压缩回滚的日志文件。

**`winston.transports.Http(options)`**

输出到Http服务，其中`options`：

1. `host`，字符串，服务的主机名，默认是`'localhost'`。
2. `port`，数值，服务的端口号，默认是`80`或者`443`（使用ssl）。
3. `path`，字符串，服务的路径，默认是`'/'`。
4. `auth`，对象，提供`username`和`password`进行HTTP鉴权，默认是`undefined`。
5. `ssl`，布尔值，是否使用HTTPS，默认是`false`。

winston还提供了一个根据日期回滚的`Transport`，以另一个npm库winston-daily-rotate-file提供：

**`DailyRotateFile(options)`**

基本功能同`File`，其中：

1. `datePattern`，字符串，日期格式，默认是`'yyyy-MM-dd'`。
2. `prepend`，布尔值，文件名是否以日期开始，默认是`false`。
3. `localTime`，布尔值，是否使用本地时间，默认是`false`，即使用UTC时间。
4. `maxDays`，数值，日志最多保存天数，默认是`0`，即不删除任何日志。
5. `createTree`，布尔值，是否使用文件夹存储日志。

### 使用

结合实际的项目，给个例子参考：

    const winston = require('winston')
    const DailyRotateFile = require('winston-daily-rotate-file')
    const strftime = require('strftime')
    const fs = require('fs')
    const path = require('path')

    let logger

    const LOG_PATH = '/path/to/logs'
    // logs for elk
    const ELK_PATH = '/path/to/elk/logs'

    const timestamp = () => strftime('%D %T')

    exports.getLogger = () => {
      if (!logger) {
        let transports = [
          // for error
          new winston.transports.File({
            filename: path.join(LOG_PATH, 'error.log'),
            level: 'error',
            timestamp
          }),
          // for normal
          new DailyRotateFile({
            filename: path.join(LOG_PATH, 'main.log'),
            datePattern: 'yyyy-MM-dd.',
            localTime: true,
            prepend: true,
            timestamp
          })
        ]
        if (fs.existsSync(ELK_PATH)) {
          // for elk
          transports.push(new winston.transports.File({
            name: 'elk',  // must provide a name
            filename: path.join(ELK_PATH, 'elk.log'),
            json: false,  // activate formatter option
            formatter: options => {
              let { level, message, meta } = options
              let { param1, param2 } = meta
              return JSON.stringify({ level, message, meta, param1, param2 })
            }
          }))
        }
        if (process.env.NODE_ENV === 'dev') {
          // for development
          transports.push(new winston.transports.Console({
            json: true,
            timestamp
          })
        }
        logger = new (winston.Logger)({ transports })
      }
      return logger
    }

---
layout: post
title: "简述YAML"
description: ""
category: 
tags: [前端]
---
{% include JB/setup %}

这个博客是使用Jekyll在Github上搭建的。而Jekyll使用了YAML作为其配置文件的格式。什么是YAML？它跟XML和JSON有什么不同？今天来简单介绍一下。

YAML，有一个有意思的递归命名：

    YAML isn't A Markup Language.

这句话的意思是，YAML不是一个标记语言，它着重于数据而不是存储数据的格式。以下是Jekyll配置文件`_config.yml`的一个例子：

    permalink: /:categories/:year/:month/:day/:title 
    exclude: [".rvmrc", ".rbenv-version", "README.md", "Rakefile", "changelog.md"]
    pygments: true
    baseurl: 

是不是非常简单，而且可读性非常强。跟XML和JSON一样，YAML也需要表示数组（Array）和对象（Object）两种形式。在YAML中的语法大概是这样的：

数组使用`-`去标识每一个元素，例如：

    - Mark McGwire
    - Sammy Sosa
    - Ken Griffey

对象使用`:`去划分键和值，例如：

    hr:  65    # Home runs
    avg: 0.278 # Batting average
    rbi: 147   # Runs Batted In

通过缩进来区分上下级关系：

    american:
      - Boston Red Sox
      - Detroit Tigers
      - New York Yankees
    national:
      - New York Mets
      - Chicago Cubs
      - Atlanta Braves

有趣的是，YAML也支持类似于JSON的写法，例如：

    Mark McGwire: {hr: 65, avg: 0.278}
    Sammy Sosa: {
      hr: 63,
      avg: 0.288
    }

最后看看YAML支持的数据类型：

1. `Integer`，整型，例如`12345`、`0x10`等。
2. `Float`，浮点型，例如`1.2345`、`123.1e1`等。
3. `Miscellaneous`，例如`null`、`true`、`false`还有各种字符串。
4. `Timestamps`、时间日期，可以有多种格式，例如`2001-12-15T02:59:43.1Z`和`2001-12-14t21:59:43.10-05:00`。

YAML有什么好处？首先是简单，嵌套不深的YAML文件对人十分友好。其次是由于结构的简单，程序实现起来也十分简单。所以YAML十分适合作为配置文件的格式，可读性十分好，而且对于JavaScript来说，由于JSON是使用JavaScript解析器去解析的，使用JSON作为配置文件有可能执行配置文件中的一些恶意代码（所以需要浏览器提供`JSON.parse`或者使用JSON2库，千万别直接`eval`）。而YAML则不含有任何可以执行代码的机会，在这方面YAML的安全性是比JSON要强一些的。

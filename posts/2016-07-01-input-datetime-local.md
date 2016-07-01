---
layout: post
title: "input[type='datetime-local']"
description: ""
category: 
tags: [html5]
---

### 引用

1. [input  type=datetime-local &#8211; local date-and-time input control (NEW) - HTML5](https://www.w3.org/TR/html-markup/input.datetime-local.html)

`input[type='datetime-local']`提供了一个日期时间选择器，其中的时间是本地时间，不带时区信息的：

    <input type='datetime-local' name='datetime' id='datetime' value='2016-07-01T16:41:00.123' />

其中`value`的格式最为严格，必须由以下三个部分（严格按照顺序）组成：

1. 一个日期：`YYYY-MM-DD`。
2. 一个字符：`T`。
3. 一个时间：`HH:mm:ss`或者`HH:mm:ss.ms`。

如果给这个`<input>`设置格式不对的值，是设不进去的，既日期时间选择器上面无法显示正确的时间，而且通过DOM去获取`<input>`的值也只能得到一个空字符串：

    function log(msg) {
      var p = document.createElement('p')
      p.innerHTML = msg
      document.body.appendChild(p)
    }

    function test(value) {
      var input = document.createElement('input')
      input.setAttribute('type', 'datetime-local')
      document.body.appendChild(input)
      input.value = value
      log(input.value.length ? input.value : 'Empty String')
    }

    test('2016-01-01T00:00:00') // 显示正确，并能正确获取到input的值
    test('not valid')           // 日期无法显示，input的值为空字符串
    test('2016/01/01T00:00:00') // 日期无法显示，input的值为空字符串
    test(new Date().toString()) // 日期无法显示，input的值为空字符串

还能设置：

1. `min`：日期时间的最小值，跟`value`一样格式的日期时间。
2. `max`：日期时间的最大值，跟`value`一样格式的日期时间。
3. `step`：日期时间调整的最小单位，单位为秒。

要注意的是，这个`<input>`的值始终是一个字符串，当我们需要获取时间戳的时候还需要自行转换成`Date`对象，以`moment`为例：

    var date = moment(input.value).toDate()

### 浏览器支持

通过[Can I Use](http://caniuse.com/#feat=input-datetime)中可以看到，当前主流版本的桌面浏览器只有Edge和Chrome才支持。幸运的是移动平台的Safari、Android Browser和Chrome都是支持的（除了Safari不支持`min`、`max`和`step`）。

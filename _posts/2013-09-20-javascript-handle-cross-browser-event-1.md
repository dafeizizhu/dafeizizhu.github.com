---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 跨浏览器处理事件（一）"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

处理事件是JavaScript最最最最最最重要的一部分，负责用户与页面的交互逻辑。由于种种历史遗留问题，从绑定事件，到事件对象、处理程序的上下文等，IE跟标准的浏览器不太一样，这需要我们抽象出绑定事件的一般接口，根据不同的浏览器给出不同的实现。

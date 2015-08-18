---
layout: post
title: "经典三列布局之如何让中间的列先显示出来"
description: ""
category: 
tags: [html, css]
---
{% include JB/setup %}

在某些并发访问非常高的页面，由于服务器压力过大，导致页面的内容要很久才能加载完。这个时候，我们应该尽可能把用户觉得重要的信息（大多数情况放在中栏）先显示出来。

首先是原始的HTML：

    <div id="container">
        <div id="left">This is left!</div>
        <div id="middle">This is middle!</div>
        <div id="right">This is right!</div>
    </div>
    
按照HTML解析顺序，上面的HTML片段应该是先显示left，再显示middle，最后显示right。

###第一步

先调整HTML的顺序，让middle先行。

    <div id="container">
        <div id="middle">This is middle!</div>
        <div id="left">This is left!</div>
        <div id="right">This is right!</div>
    </div>
    
###第二步

为`div`加上底色，比较好看（(╯‵□′)╯︵┻━┻）。然后设置每个栏的宽度，中间的自适应。

    #left { width: 100px; background: red;}
    #right { width: 100px; background: blue;}
    #middle { width: 100%; background: green;}
    
运行结果[参考这里](http://jsfiddle.net/zBXbp/5/)。

###第三步

让左栏弄到middle左边去。

    #container { 
        position: relative;
        padding: 0 100px;
        overflow: hidden;
        margin: 0 auto;
    }
    
    #middle {
        float: left;
    }
    
    #left {
        position: relative;
        left: -100px;
        float: left;
        margin-left: -100%;   
    }
    
运行结果[参考这里](http://jsfiddle.net/zBXbp/6/)。

###第四步

让右栏弄到middle右边去。

    #right {
        float: left;
        margin-right: -100%;
    }
    
运行结果[参考这里](http://jsfiddle.net/zBXbp/7/)。

由于时间的问题，这个问题的解决方案到这里就先暂告一段落（还有IE hack、header、footer、三栏高度统一等问题）。这里简单地描述了解决这个问题的思路，这个方案使用了HTML的负边距，在以后的博文里面会重点对负边距进行解析。

题外话：今天在我司跟了1年半的老大要惯例了，有点唏嘘，祝一路走好，前程似锦！

---
layout: post
title: "HTML META 标签入门"
description: ""
category: 
tags: [html]
---
{% include JB/setup %}

今天被妹纸狠狠地鄙视了我的博客样子太丑(/＞皿<)/ ～ ┴┴。闲逛看看有没有好看的博客设计。偷看他们源代码，发现有好多`meta`标签都不认识，所以写一篇东西好好学习一下`html`中的`meta`标签究竟怎么用。

###定义

又看看w3schools对`meta`标签的定义：

> The meta tag provides metadata about the HTML document. Metadata will not be displayed on the page, but will be machine parsable.

再看看wikipedia的解释：

> Meta elements can specify HTTP headers which should be sent **before** the actual content when the HTML page is served from Web server to client.

`meta`标签不会显示在页面中。使用`meta`可以声明这个页面的描述、作者、关键字、最后修改日期等信息，可以供浏览器、搜索引擎和一些Web服务使用。

###注意

以下是几点注意事项：
1. `meta`标签总是定义在`head`标签之类。
2. `meta`标签总是以键值对（`name`和`content`）传递信息。
3. 在定义`name`或者`http-equiv`属性之后才能定义`content`属性。

###NAME

`meta`标签的`name`属性就说说明当前的`meta`标签是什么类型，以便于搜索引擎抓取，索引网页。相应的`content`就是告诉搜索引擎相关的信息。对应的取值大概有（继续补充）：

1. `keyword`，关键字，如：

{% highlight html %}
<meta name="keyword" content="key1,key2,key3" />
{% endhighlight %}

多个关键字用`,`隔开，还可以设置`lang`属性指定语言。

2. `description`，描述，如：

{% highlight html %}
<meta name="description" content="something about this page." />
{% endhighlight %}

3. `robots`，给搜索引擎，声明该页面的访问规则，如

{% highlight html %}
<meta name="robots" content="all" />
{% endhighlight %}

可选的取值有`all`、`index`、`follow`、`noindex`、`nofollow`、`none`。

4. `author`，作者，如：

{% highlight html %}
<meta name="author" content="Zhiying Mai" />
{% endhighlight %}

5. `copyright`，版权信息，如：

{% highlight html %}
<meta name="copyright" content="Power by Zhiying Mai." />
{% endhighlight %}

6. `generator`，页面制作工具（吐槽一个，浏览器连这个都管o(╯□╰)o）。如：

{% highlight html %}
<meta name="copyright" content="Front-page" />
{% endhighlight %}

7. `revisit-after`，告诉搜索引擎什么时候重新抓取，如：

{% highlight html %}
<meta name="revisit-after" content="2 days">
{% endhighlight %}

###HTTP-EQUIV

`meta`的`http-equiv`属性,其作用类似于HTTP头协议,它会告诉浏览器一些关于字符设定，页面刷新，cookie，和缓存等等相关信息。对应的取值大概有（继续补充）：

1. `content-type`，页面属性类型，如：

{% highlight html %}
<meta http-equiv="content-type" content="text/html; charset=utf-8">
{% endhighlight %}

在HTML5中已经使用独立的`meta`标签来声明字符集。

2. `refresh`，刷新时间，如：

{% highlight html %}
<meta http-equiv="refresh" content="60">
{% endhighlight %}

表示页面60秒后会自动刷新。还可以配置`url`属性让页面在设置的刷新时间跳转到特定的url。

3. `expires`，页面的过期时间，当页面过期后，必须重新从服务器请求该页面，如：

{% highlight html %}
<meta http-equiv="expires" content="Fri, 5 Jul 2013 01:13:13 GMT">
{% endhighlight %}

当`content`是0时表示页面**永不过期**。

4. `pragma`，禁止浏览器缓存页面，如：

{% highlight html %}
<meta http-equiv="pragma" content="no-cach">
{% endhighlight %}


5. `set-cookie`，设置cookie的过期时间，如：

{% highlight html %}
<meta http-equiv="expires" content="cookievalue=xxx; expires=Fri, 5 Jul 2013 01:13:13 GMT">
{% endhighlight %}

6. `window-target`，强制页面在特定的框架中（特别是在`iframe`中）显示，如：

{% highlight html %}
<meta http-equiv="widow-target" content="_top">
{% endhighlight %}

可选的取值为`_blank`、`_top`、`_self`、`_parent`。

7. `X-UA-Compatible`，指定IE的文档兼容模式（这个太有用了），如：

{% highlight html %}
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
{% endhighlight %}

表示IE以最高版本的标准模式运行，如果有Google Chrome Frame则使用其渲染该页面。

###HTML5

最后讲一个只有HTML5才有的`meta`：

{% highlight html %}
<meta charset="utf-8" />
{% endhighlight %}

###总结

`meta`标签由于SEO而被重视，但是其作用不仅仅是用作SEO，还能制造出类似HTTP协议头的效果。当需要IE浏览器处于某种特定的文档模式，也要注意使用`meta`哦亲！

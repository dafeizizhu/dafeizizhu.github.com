---
layout: post
title: "crossdomain.xml"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

`crossdomain.xml`是Flash授权一个客户端（Flash Player等）跨域访问数据的一个策略文件。当一个客户端请求不属于其所在域的资源时，远程服务器需要有一个`crossdomain.xml`文件去判断这个客户端所在的域是否有权限去访问这个资源。

一个简单的`crossdomain.xml`的例子如下：

    <?xml version="1.0"?>	
    <!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
    <cross-domain-policy>
      <site-control permitted-cross-domain-policies="master-only"/>
      <allow-access-from domain="*.example.com"/>
      <allow-access-from domain="www.example.com"/>
      <allow-http-request-headers-from domain="*.adobe.com" headers="SOAPAction"/>
    </cross-domain-policy>

其根元素是`cross-domain-policy`，它可以包含以下几个子元素：

1. `site-control`，声明该域接受哪些策略文件。该元素只有一个特性，就是`permitted-cross-domain-policies`，它可以接受以下几个取值：
    1. `none`，不接受任何策略文件，包括自己。
    2. `master-only`，只接受主策略文件，即定位在`http://your.domain/`的根下面的`crossdomain.xml`。
    3. `by-content-type`，所有`Content-Type`为`text/x-cross-domain-policy`都视为可接受的策略文件。
    4. `by-ftp-filename`，所有文件名为`crossdomain.xml`的都视为可接受的策略文件。
    5. `all`，所有策略文件都可以被接受。
2. `allow-access-from`，声明这个域能被访问的策略。这个元素有以下几个特性：
    1. `domain`，声明能访问这个域的域，例如上例的`*.example.com`。这个特性支持使用`*`作为通配符，例如`*`就代表所有域都可以访问这个域的资源。
    2. `to-ports`，只适用于Socket，表示允许从哪些端口访问，例如`10001,10002`。
    3. `secure`，只适用于HTTP，当这个特性的值为`true`的时候表示只允许使用HTTPS来访问这个域的资源。
3. `allow-http-request-headers-from`，声明这个域能发送请求到哪些域，跟`allow-access-from`是相反的。这个元素有以下几个特性：
    1. `domain`，声明能发送请求的目标域，与`allow-access-from`的`domain`特性类似。
    2. `headers`，声明能发送请求的头，如上例的`SOAPAction`。
    3. `secure`，与`allow-access-from`的`secure`特性类似。

最常用的用法就是在容器的根目录下面放置一个`crossdomain.xml`，根据我们的需要配置允许访问和允许发送请求的域。下面是两个极端的例子，第一个是最松散的策略：

    <?xml version="1.0"?>
    <!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
    <cross-domain-policy>
      <site-control permitted-cross-domain-policies="all"/>
      <allow-access-from domain="*" secure="false"/>
      <allow-http-request-headers-from domain="*" headers="*" secure="false"/>
    </cross-domain-policy>

接受所有策略文件、允许所有域的访问、允许向所有域发送请求。第二个是最严格的策略：

    <?xml version="1.0"?>
    <!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
    <cross-domain-policy>
      <site-control permitted-cross-domain-policies="none"/>
    </cross-domain-policy>

所有策略文件都失效，包括自己。这种配置完了之后，就不能跨域访问这个域的资源了。

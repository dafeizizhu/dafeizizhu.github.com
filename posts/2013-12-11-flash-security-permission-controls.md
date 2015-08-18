---
layout: post
title: "Flash安全性之权限控制"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

Flash对控制严格采用一种权力层次，依次是管理员设置、用户设置、网站设置和作者设置。前者拥有比后者更高的优先级，后者不能覆盖前者的限制。

###管理员控制

这里的管理员指的是计算机的管理用户。管理员控制有两种形式。第一种是`mms.cfg`文件。该文件包含管理员用于管理隐私控制、本地文件安全性、套接字连接等功能。该文件的大部分功能不能被ActionScript访问，并且只能由计算机管理员进行修改。该文件的路径是：

    Windows：system\Macromed\Flash\mms.cfg
    Mac：app support/Macromedia/mms.cfg

第二种形式是全局 Flash Player 信任目录。这个目录中指定的`swf`文件分配到受信任的沙箱，不仅可以访问本地文件，也可以使用网络。该目录通常的位置是：

    Windows：system\Macromed\Flash\FlashPlayerTrust
    app support/Macromedia/FlashPlayerTrust

这个目录可以存放若干个文本文件，标识出哪些路径下面的文件视为受信任的文件，例如：

    # Trust files in the following directories: 
    C:\Documents and Settings\All Users\Documents\SampleApp

###用户控制

用户控制可以从这几个方面指定。第一个是设置UI和设置管理器，就是上下文菜单中的Flash设置。里面可以设置包括摄像头、麦克风、本地存储等设置。在`mms.cfg`文件中的设置在这里并不可见。

第二个是用户Flash Player信任目录。跟管理员上面的信任目录的设置类似，只是这些设置只对当前用户生效。该目录通常的位置是：

    Windows：app data\Macromedia\Flash Player\#Security\FlashPlayerTrust
    Mac：app data/Macromedia/Flash Player/#Security/FlashPlayerTrust

###网站控制

网站控制就是之前讨论过的策略文件。策略文件可以影响包括位图、声音、视频、XML、文本、`swf`影片甚至是套接字的访问。默认情况下，`swf`只能请求与该文件在同一个域中的资源，如果要想访问其他域的资源，需要在远程服务器上面配置一个策略文件，也就是`crossdomain.xml`。

首先会查找服务器上面的主策略文件，就是`http://my.domain/crossdomain.xml`这个文件。SWF 文件可以通过调用`Security.loadPolicyFile`方法检索其他策略文件名或其他目录位置，前提是主策略文件没有配置成`master-only`或者`none`。在检索主策略文件时，Flash Player 会用三秒钟等待服务器响应。如果未接收到响应，Flash Player 则假定主策略文件不存在。但是，对`loadPolicyFile`的调用没有默认超时值；Flash Player 假定调用的文件存在，在加载文件之前会一直等待。因此，如果要确保加载主策略文件，请使用`loadPolicyFile`来明确调用主策略文件。

当主策略文件的配置是允许加载其他策略文件的前提下，我们可以通过以下几个手段去预加载我们的策略文件：

1. 使用`Loader.load`方法时，设置`context`参数的`checkPolicyFile`属性，该参数是一个`LoaderContext`对象。
2. 使用`img`标签在文本字段中嵌入图像时，将`img`标签的`checkPolicyFile`属性设置为`true`，如`<img checkPolicyFile = "true" src = "example.jpg">`。
3. 使用`Sound.load`方法时，设置`context`参数的`checkPolicyFile`属性，该参数是一个`SoundLoaderContext`对象。
4. 使用`NetStream`类时，设置`NetStream`对象的`checkPolicyFile`属性。

###作者控制

作者控制也就是开发人员的控制。开发人员可以通过以下的代码控制权限：

    Security.allowDomain("www.example.com")

该代码可一控制的权限包括：

1. `swf`文件之间的跨脚本访问。
2. 显示列表访问。
3. 事件检测。
4. 对`stage`对象的属性和方法的完全访问。

可以将通配符`*`传递给`Security.allowDomain()`方法以允许从所有域进行访问。

还有一个是供`HTTPS`情况下用的，就是`Security.allowInsecureDomain`，与上面的例子类似，只是适用于`HTTPS`。

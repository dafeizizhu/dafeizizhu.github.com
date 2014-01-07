---
layout: post
title: "AS3 LoaderContext"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

`LoaderContext`作为`Loader`类的`load`方法的第二个参数，声明加载媒体的上下文选项。使用`load`方法加载媒体（例如`swf`文件），需要作出两个决定：

1. 将`swf`文件放置到哪个安全域中。
2. 将`swf`文件放置到该安全域的哪个应用程序域中。

这两个决定对应于`LoaderContext`里面的两个属性：`securityDomain`和`applicationDomain`。除了这两个属性之外，`LoaderContext`还指定了一些其他属性，声明这个媒体相关的上下文。

第一个属性是`allowCodeImport`，指定是否可以使用`Loader`对象包含的内容（例如`swf`文件）导入到调用方的安全沙箱。当设置成`false`之后，加载的文件会被限制只能执行安全操作，例如加载图像。这个属性可以防止加载的文件执行不安全的操作。

第二个属性是`checkPolicyFile`，指定在开始加载之前，是否尝试从目标服务器下载URL策略文件。如果不需要对正在加载的图像进行像素级的访问，或者加载的内容是`swf`文件，建议把这个属性设置成`false`。

第三个属性是`parameters`，指定要传递到内容的`LoaderInfo`对象的参数。通常是通过分析请求URL来获得参数的值，如果设置了这个属性，就会使用这个值而忽略URL上面的参数。这个属性在调用`loadBytes`方法特别有效，因为`loadBytes`是没有所谓的URL的。

第四个属性是`requestedContentParent`，指定内容的父对象。通常内容的父对象为`Loader`对象，设置了这个属性之后则会使用这个属性指定的对象作为父对象，除非发生运行时错误，例如触发`SecurityErrorEvent`。

最后介绍一下构造方法，接受三个参数：

1. `checkPolicyFile`。
2. `applicationDomain`。
3. `securityDomain`。

分别对应于三个属性，设置初始值。最后来个例子，从另一个域加载`swf`文件并检查策略文件，还将加载的`swf`文件添加到与`Loader`对象的类相同的应用程序域中：

    var context:LoaderContext = new LoaderContext(); 
    context.securityDomain = SecurityDomain.currentDomain; 
    context.applicationDomain = ApplicationDomain.currentDomain; 
    var urlReq:URLRequest = new URLRequest("http://www.[your_domain_here].com/library.swf"); 
    var ldr:Loader = new Loader(); 
    ldr.load(urlReq, context);

---
layout: post
title: "使用应用程序域"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

应用程序域`ApplicationDomain`的用途是存储ActionScript 3.0的定义表。`swf`文件中的所有代码都被定义在应用程序域中。通过不同的应用程序域，可以允许同一个类有多个定义，并且还允许子级重用父级定义。

在使用`Loader`的`load`方法的时候，通过`context`这个参数可以指定加载内容的应用程序域，例如：

    ldr = new Loader(); 
    var req:URLRequest = new URLRequest("Greeter.swf"); 
    var ldrContext:LoaderContext = new LoaderContext(false, ApplicationDomain.currentDomain); 
    ldr.contentLoaderInfo.addEventListener(Event.COMPLETE, completeHandler); 
    ldr.load(req, ldrContext);

以上的代码把加载的`swf`文件放入到当前`swf`文件的应用程序域中。在使用应用程序域时，要记住以下几点：

1. `swf`文件中的所有代码都会被定义在该应用程序域中。
2. 已加载的类尽在其父级中没有相关定义时才进行定义，不能用较新的定义覆盖已加载类的定义。

在加载其他`swf`文件的时候，我们可以通过创建系统域的子与划分子级`swf`文件：

    var appDomainA:ApplicationDomain = new ApplicationDomain(); 
    var contextA:LoaderContext = new LoaderContext(false, appDomainA); 
    var loaderA:Loader = new Loader(); 
    loaderA.load(new URLRequest("application2.swf"), contextA);

也可以使用`Application.currentDomain`，这样可以将新的类定义添加到应用程序当前的一组类定义中，这样加载的`swf`被视为运行时共享库：

    var appDomainB:ApplicationDomain = ApplicationDomain.currentDomain; 
    var contextB:LoaderContext = new LoaderContext(false, appDomainB); 
    var loaderB:Loader = new Loader(); 
    loaderB.load(new URLRequest("module1.swf"), contextB);

最后一种方式是通过创建当前域的新子域，使用父级的类定义：

    var appDomainC:ApplicationDomain = new ApplicationDomain(ApplicationDomain.currentDomain);  
    var contextC:LoaderContext = new LoaderContext(false, appDomainC); 
    var loaderC:Loader = new Loader(); 
    loaderC.load(new URLRequest("module3.swf"), contextC);

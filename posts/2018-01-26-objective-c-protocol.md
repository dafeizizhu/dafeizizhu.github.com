---
layout: post
title: "Objective-C入门系列 - @protocol"
description: ""
category: 
tags: [objective-c]
---

### 引用

1. [iOS 之 Protocol 详解 - 简书](https://www.jianshu.com/p/f93147740bf2)
2. [Protocol](https://developer.apple.com/library/content/documentation/General/Conceptual/DevPedia-CocoaCore/Protocol.html)
3. [Working with Protocols](https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithProtocols/WorkingwithProtocols.html)

### 定义

> 协议声明了任何类都能够选择实现的程序接口。协议能够使两个不同继承树上的类相互交流并完成特定的目的，因此它提供了除继承外的另一种选择。任何能够为其他类提供有用行为的类都能够声明接口来匿名的传达这个行为。任何其他类都能够选择遵守这个协议并实现其中的一个或多个方法，从而利用这个行为。如果协议遵守者实现了协议中的方法，那么声明协议的类就能够通过遵守者调用协议中的方法。

协议有两种：

1. 正式协议，声明需要遵守协议者需要实现的方法。
2. 非正式协议，定义为`NSObject`的类别。

### 声明

    @protoco ProtocolName
    @property (strong, nonatomic) p;
    - (void)requiredMethod;
    @optional
    - (void)optionalMethod;
    @required
    - (void)requiredMethod2;
    @end

方法的声明可以加上`@required`和`@optional`，表示实现者是否必须实现这个方法，默认是`@required`。如果一个方法是可选的实现，在执行的时候需要使用`respondsToSelector:`方法检查是否包含这个方法的实现：

    if ([self.dataSource respondsToSelector:@selector(optionalMethod)]) {
      [self.dataSource optionalMethod];
    }

### 继承

协议同样可以像类一样继承：

    @protocol MyProtocol <NSObject>
    @end

**自定义的协议最好都继承自`NSObject`协议。**当一个协议继承自另一个或多个协议，则表示实现该协议的对象需要同时实现所有父协议。上面例子中的`MyProtocol`协议的实现者必须实现所有`NSObject`协议声明的方法。多个实现使用逗号隔开。

### 使用

    @interface MyClass : NSObject <MyProtocol>
    @end

上面的代码定义了类`MyClass`，这个类实现了`MyProtocol`协议。如果实现多个协议，使用逗号隔开。**编译器不会自动同步协议中定义的属性。**

### 用法

协议是为了隐藏接口的实现。定义了协议之后，只要是实现了这个协议的类，不管是什么类，都包含协议声明的方法。例如，使用`NSFetchedResultsController`获取一个`UITableView`的数据源。获取到数据之后，返回的是一个匿名对象，实现`NSFetchedResultsSectionInfo`接口。这样，调用者就不用知道这个对象的类是什么，也能调用对应的方法获取数据：

    NSInteger sectionNumber = ...
    id <NSFetchedResultsSectionInfo> sectionInfo = [self.fetchedResultsController.sections objectAtIndex:sectionNumber];
    NSInteger numberOfRowsInSection = [sectionInfo numberOfObjects];

所以，协议经常被用于委托设计模式。通过声明一个委托协议，调用委托者的方法，或者把委托者的数据回传到对象中。

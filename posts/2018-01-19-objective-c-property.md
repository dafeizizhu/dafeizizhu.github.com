---
layout: post
title: "Objective-C入门系列 - @property"
description: ""
category: 
tags: [objective-c]
---

### 引用

1. [Objective-C中的@property | 程序员说](http://www.devtalking.com/articles/you-should-to-know-property/)
2. [Objective-c的@property 详解 - 子龙山人 - 博客园](http://www.cnblogs.com/andyque/archive/2011/08/03/2125728.html)
3. [Declared property](https://developer.apple.com/library/content/documentation/General/Conceptual/DevPedia-CocoaCore/DeclaredProperty.html)

### 存取器

`@property`是声明属性的语法，它可以快速方便的为实例变量创建存取器，并允许通过点语法使用存取器。可以在任意一个类、协议和类别里面声明属性。

### 语法

    @property (<#attributes#>) <#type#> <#name#>;

其中：

1. `attributes`，表示这个属性的一些特性，例如内存管理和可访问性等。
2. `type`，表示这个属性的类型。
3. `name`，表示这个属性的名字。

例子：

    @property(copy) NSString *title;

等同于：

    - (NSString *)title;
    - (void)setTitle:(NSString *)newTitle;

可以使用`@synthesize`指令，在类的`@implementation`块中创建该属性的存取器的实现：

    @implementation MyClass
    @synthesize title;
    @end

或者使用`@dynamic`指令，告诉编译器，当没找到这个存取器的实现时不要发出警告，这些实现会在运行的时候提供：

    @implementation MyClass
    @dynamic title;
    @end

### 特性

可以把属性的特性值分成三类：原子性、存取器控制和内存管理。

原子性：

1. `atomic`，默认值，表示属性的操作是原子的，意味着只有一个线程能访问实例变量。声明了`atomic`之后，至少属性在当前的存取器上是线程安全的。真正的线程安全还需要同步互斥机制去保障。
2. `nonatomic`，表示属性的操作是非原子性的，可以被多个线程访问。它的效率比`atomic`快，在单线程或者明确只有一个线程访问的情况下广泛使用。

存取器控制：

1. `readwrite`，默认值，表示该属性同时拥有`getter`和`setter`。
2. `readonly`，表示该属性只有`getter`没有`setter`。

内存管理：

1. `assign`，默认值，应用于值类型，表示单纯的复制。还包括不存在所有权关系的对象，例如delegate。
2. `retain`，需要对传入的对象进行引用计数加一（`retain`）操作，对传入的对象拥有所有权。
3. `strong`，IOS引入ARC之后的关键字，是`retain`的一个可选的替代。
4. `weak`，类似于`assign`，在该对象被释放后，该属性声明的实例变量会指向`nil`。`weak`是IOS5引入的，在IOS5之前不能使用，delegate和outlet一般使用`weak`来声明。
5. `copy`，与`strong`类型，赋值的时候会对传入对象的副本拥有所有权，而不是对象本身。

内存管理的特性值会影响到`setter`方法的实现，例如`assign`就是简单的赋值：

    - (void)setRunning:(int)newRunning{  
      _running = newRunning;  
    } 

`retain`则需要进行引用计数加一的操作：

    - (void)setName:(NSString *)name {
      if (_name != name) {
        [_name release];
        _name = [name retain];
      }
    }

`copy`则需要发送`copy`消息给对象，返回一个该对象的复制：

    
    - (void)setName:(NSString *)name {
      if (_name != name) {
        [_name release];
        _name = [name copy];
      }
    }

推荐做法：

1. `NSString`用`copy`。
2. 非对象的数据类型（如`int`、`float`等）用`assign`。
3. 对象类型（如`NSArray`、`NSData`等）用`reatin`。
4. delegate和outlet使用`weak`。

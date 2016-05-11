---
layout: post
title: "《JavaScript设计模式与开发实践》读书笔记"
description: ""
category: 
tags: [JavaScript, 读书笔记]
---

### 第9章 命令模式

命令模式是最简单和优雅的模式之一，命令模式中的命令指的是一个执行某些特定事件的指令。使用命令模式使得请求发送者和请求接受者能够消除彼此之间的耦合关系。

另外，相对于过程化的请求调用，命令对象拥有更长的生命周期。对象的生命周期是跟初始请求没关的，因为这个请求已经被封装在了命令对象的方法中，成为了这个对象的行为。

命令模式的由来，其实是回调函数的一个面向对象的替代品。JavaScript作为将函数作为一等对象的语言，跟策略模式一样，命令模式也早已融入到了JavaScript语言之中。运算块不一定要封装在`command.execute`方法中，也可以封装在普通函数中。

在使用闭包的命令模式中，接受者被封闭在闭包产生的环境中，执行命令的操作可以更加简单，仅仅执行回调函数即可：

    var setCommand = function (button, command) {
      button.onClick = function () {
        command.execute()
      }
    }

    var MenuBar = {
      refresh: function () {
        console.log('Menu refresh')
      }
    }

    var RefreshMenuBarCommand = function (reciever) {
      return {
        execute: function () {
          reciever.refresh()
        }
      }
    }

    var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar)
    
    setCommand(button, refreshMenuBarCommand)

通过命令对象，还能记录命令发生前接收对象的状态，可以轻松地实现撤销功能。还可以使用一个队列或者栈存放命令对象，实现撤销、重做等功能。

命令对象的声明周期跟初始请求发生的事件无关，`command`对象的`execute`方法可以在程序运行的任何时刻执行，即使请求早已发生，命令对象仍然是有声明的。

一般来说，命令模式都会在`command`对象中保存一个接受者来负责真正执行客户的请求，这种情况下命令对象是“傻瓜式”的，它只负责把客户的请求转交给执行者来执行，这种模式的好处是请求发起者和请求接受者之间尽可能地得到了解耦。

“聪明”的命令对象可以直接实现请求，这样一来就不再需要接收者的存在，这种“聪明”的命令对象也叫作智能命令。没有接收者的只能命令，退化到和策略模式非常相近，从代码结构上已经无法分辨它们，能分辨的只有它们意图的不同。策略模式指向的问题域更小，所有策略对象的目标总是一直的，它们只能达到这个目标的不同手段，它们的内部实现是针对“算法”而言的。而智能命令模式指向的问题域更广，`command`对象解决的目标更具发散性。命令模式还可以完成撤销、排队等功能。

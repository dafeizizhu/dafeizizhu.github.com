---
layout: post
title: "《JavaScript设计模式与开发实践》读书笔记"
description: ""
category: 
tags: [JavaScript, 读书笔记]
---

### 第16章 状态模式

状态模式的关键是区分事物内部的状态，事物内部状态的改变往往会带来事物的行为改变。

状态模式的关键是把事物的每种状态都封装成单独的类，跟此类有关的行为都被封装在这个类的内部。当事物接收请求的时候，只需要把这个请求委托给当前的状态对象即可，改状态对象会负责渲染它自身的行为。

状态模式的好处很明显，它可以使每一种状态和它对应的行为之间的关系局部化，这些行为被分散和封装在各自对应的状态类之中，便于阅读和管理代码。另外，状态之间的切换都被分布在状态类内部，这使得我们无需编写过多的`if`、`else`条件分支语句来控制状态之间的转换。

状态模式的定义：允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。

1. 将状态封装成独立的类，并将请求委托给当前的状态对象，当对象的内部状态改变时，会带来不同的行为变化。
2. 我们使用的对象，在不同的状态下具有截然不同的行为，这个对象看起来是从不同的类中实例化而来的，实际上这是使用了委托的效果。

在状态模式中，上下文（Context）将持有这些状态对象的引用，以便把请求委托给状态对象。然后，我们要编写各种状态类，状态类持有上下文的引用，以便调用上下文的方法或者直接操作上下文对象。

在Java中，所有状态类必须继承自一个`State`的抽象父类或者接口。在JavaScript中，我们可以让“抽象父类”的“抽象方法”抛出异常，防止状态子类没有实现“抽象方法”：

    var State = function () {}

    State.prototype.buttonWasPressed = function () {
      throw new Error('must be override')
    }

状态模式的优点：

1. 状态模式定义了状态与行为之间的关系，并将它们封装在一个类里。通过增加新的状态类，很容易增加新的状态和装换。
2. 避免上下文的无线膨胀，状态切换的逻辑被分布在状态类中，也去掉了上下文中原本过多的条件分支。
3. 用对象代替字符串来记录当前状态，使得状态的切换更加一目了然。
4. 上下文中的请求动作和状态类中封装的行为可以非常容易地独立变化而互不影响。

状态模式的缺点是会在系统中定义许多状态类，系统中会因此而增加不少对象。由于逻辑分散在状态类中，造成了逻辑分散的问题，我们无法在一个地方就看出整个状态机的逻辑。

状态模式中的性能优化点：

1. 如果状态对象比较庞大，那么仅当状态对象被需要时才创建并随后销毁；如果状态的改变很频繁，最好一开始就把这些状态对象创建出来，没有必要销毁它们。
2. 各上下文对象可以共享一个状态对象，这也是享元模式的应用场景之一。

状态模式和策略模式的异同：

1. 它们都有一个上下文、一些策略或者状态类，上下文把请求委托给这些类来执行。
2. 策略模式中的各个策略类是平等又平行的，它们之间没有任何联系；而在状态模式中，状态和状态对应的行为是早已被封装好的，状态之间的切换也早被规定完成的，“改变行为”这件事情发生在状态模式内部。

JavaScript中的状态模式可以通过`Function.prototype.call`方法直接把请求委托给某个字面量对象来执行：

    var Light = function () {
      this.currState = FSM.off
    }
    
    Light.prototype.buttonWasPressed = function () {
      this.currState.buttonWasPressed.call(this)
    }

    var FSM = {
      off: {
        buttonWasPressed: function () {
          // this -> Light instance
          this.currState = FSM.on
        }
      },
      on: {
        buttonWasPressed: function () {
          // this -> Lignt instance
          this.currState = FSM.off
        }
      }
    }

也可以用委托实现：

    var delegate = function (client, deligation) {
      return {
        buttonWasPressed: function () {
          deligation.buttonWasPressed.apply(client, arguments)
        }
      }
    }

    var FSM = {
      off: {
        buttonWasPressed: function () {
          this.currState = this.onState
        }
      },
      on: {
        buttonWasPressed: function () {
          this.currState = this.offState
        }
      }
    }

    var Light = function () {
      this.offState = delegate(this, FSM.off)
      this.onState = delegate(this, FSM.on)
      this.currState = this.offState
    }

    Light.prototype.buttonWasPressed = function () {
      this.currState.buttonWasPressed()
    }

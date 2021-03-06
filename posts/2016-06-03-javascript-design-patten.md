---
layout: post
title: "《JavaScript设计模式与开发实践》读书笔记"
description: ""
category: 
tags: [JavaScript, 读书笔记]
---

### 第11章 模板方法模式

模板方法模式是一种只需使用集成就可以实现的非常简单的模式。

模板方法模式由两部分组成，第一部分是抽象父类，第二部分是具体的实现子类。具体实现子类的相同行为可以被搬到另外一个单一的地方，模板方法模式就是为了解决这个问题而生的。在模板方法模式中，子类实现中相同的部分被上移到父类中，而将不同的部分留待子类来实现，这也很好地体现了泛化的思想。

抽象父类中有模板方法，该方法中封装了子类的算法框架，它作为一个算法的模板，指导子类以何种顺序去执行哪些方法。

模板方法模式是一种严重依赖抽象类的设计模式。抽象类的主要作用就是为它的子类定义公共接口，所以不能直接实例化抽象类。

抽象方法被声明在抽象类中，抽象方法并没有具体的实现过程，是一些“哑”方法。当子类继承了这个抽象类时，必须重写父类的抽象方法。如果每个子类中都有一些同样的具体实现方法，那这些方法也可以选择放在抽象类中，这可以节省代码以达到复用的效果，这些方法叫作具体方法。

JavaScript是一门“类型模糊”的语言，所以隐藏对象的类型在JavaScript中并不重要。在JavaScript中使用原型继承来模拟传统的类式继承时，并没有编译器帮助我们进行任何形式的检查，我们也没有办法保证子类会重写父类中的抽象方法。

我们在编写代码的时候得不到任何形式的警告，完全寄托于程序猿的记忆力和自觉性是非常危险的，特别是当我们使用模板方法模式这种完全依赖继承而实现的设计模式时。

下面提供两种变通的解决方案：

1. 用鸭子类型来模拟接口检查，以便确保子类中确实重写了父类的方法，但是这就要求我们在业务代码中添加一些跟业务逻辑无关的代码。
2. 让父类的“抽象方法”直接抛出异常。这样实现起来简单，付出的额外代价很少，缺点就是在程序运行的过程中我们才知道错误。

当我们需要为特定子类突破父类模板方法的约束时，可以放置钩子。放置钩子是隔离变化的一种常见手段，钩子可以有一个默认实现，究竟要不要“挂钩”，这由子类自行决定。钩子方法返回的结果决定了模板方法后面部分的执行步骤，也就是程序接下来的走向：

    // 模板方法
    Beverage.prototype.init = function () {
      this.boilWater()
      this.brew()
      this.pourInCup()
      // 钩子
      if (this.customerWantsCondiments()) {
        this.addCondiments()
      }
    }
    // 钩子的默认实现
    Beverage.prototype.customerWantsCondiments = function () {
      return true
    }

好莱坞原则：我们允许底层组件将自己挂钩到高层组件中，而高层组件会决定什么时候，以何种方式去使用这些底层组件，高层组件对待底层组件的方式，就是“别调用我们，我们会调用你”。

当我们用模板方法模式编写一个程序时，意味着子类放弃了对自己的控制权，而是改为父类通知子类，哪些方法应该在什么时候被调用。作为子类，只负责提供一些设计上的细节。

好莱坞原则的应用场景：

1. 发布-订阅模式：发布者会把消息推送给订阅者，这取代了原先不断去fetch消息的形式。
2. 回调函数：把需要执行的操作封装在回调函数里，然后主动权交给另外一个函数，至于回调函数什么时候被执行，则是另外一个函数控制的。

实现模板方法模式，其实不一定需要继承。我们可以使用由一组同样“接口”方法组成的对象，以参数的形式传递到模板方法中：

    var Template = function (param) {
      var foo = param.foo || function () {
        console.log('default foo')
      }
      var bar = param.bar || function () {
        console.log('default bar')
      }
      var F = function () {}
      F.prototype.init = function () {
        foo()
        bar()
      }
      return F
    }

    var Sub = Template({
      foo: function () {
        console.log('sub foo')
      }
    })

    var sub = new Sub()
    sub.init() // output: sub foo default bar

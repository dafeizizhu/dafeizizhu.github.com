---
layout: post
title: "React, Backbone, Angular, Ember的简单比较"
description: ""
category: 
tags: [JavaScript]
---

英文原文：[http://whiteprompt.com/react/react-vs-angular-vs-backbone-vs-ember-a-small-guide/](http://whiteprompt.com/react/react-vs-angular-vs-backbone-vs-ember-a-small-guide/)

### 什么是MVC

MVC是一个软件架构，它把用户界面分离成域、应用和业务逻辑。它将应用分成三个部分：模型（Model）、视图（View）、控制器（Controller）。我们选择MVC是因为这能使代码结构变得比较清晰，我们也比较熟悉这个架构。

1. 模型：提供数据，可以是一个API或者一个JavaScript对象。它是应用的状态和一切数据。
2. 控制器：负责处理用户输入、获取数据、处理数据等。
3. 视图：应用的用户接口（UI）层，决定了应用长啥样子。

### Angular

Angular是一个用于设计动态Web App的框架。它允许你扩展HTML的标签实现自定义组件。数据绑定和依赖注入使你的代码更加紧凑。

优点：

1. 创建自定义的标签，例如`<slider start=-5 end=-5 />`。
2. 没有双向绑定（Angular2）。
3. 良好的基本架构：
  1. `Views`构建UI层。
  2. `Controller`处理UI背后的逻辑。
  3. `Service`负责与后端的通讯。
  4. `Directive`帮助创建可重用的组件和扩展HTML标签。

缺点：

1. 对TypeScript有强烈的依赖（？）
2. 初始的设计很慢，不得不把舍弃了数据的双向绑定。同样慢的还有`Scope`。
3. 当涉及很多个DOM操作时可能有性能问题。
4. Angular2和Angular1差别太大，几乎是两个框架，转换的时候比较困难。

### Ember

Ember是另一个MVC框架，它帮助我们创建可扩展的SPA。

优点：

1. 专注于性能。
2. 使用handlebars作为模版引擎。
3. 导航和数据层。
4. 纯JavaScript实现，利于服务器直出HTML。
5. 框架已经趋于稳定。
6. 文档和API比Angular要友善得多。

缺点：

1. 数据的双向绑定。（译注：作者貌似很讨厌双向绑定啊，2333）
2. 相对于最初的实现，API改变了很多。
3. 学习曲线比较陡，但是值得参考。

### Backbone

Backbone帮助我们结构化应用的代码。它提供键值对形式的事件绑定、自定义事件、集合等功能。它还提供了很多关于视图的API，提供描述式的事件处理程序。

优点：

1. 轻、快。
2. 清晰的结构和概念：
  1. `Model`：储存数据的对象。
  2. `Template`：模版，通常跟一个`Model`对象相关。其数据来自模型对象或者是控制器。
  3. `Router`：导航功能，处理SPA应用的导航，并把其转化成模版。导航定义了应该显示哪个模版，并为这个导航生成一个对应的控制器对象。
  4. `View`：视图，处理浏览器事件，把事件处理的结果发送给控制器对象。
  5. `Controller`：控制器，为模版提供数据。
  6. `Component`：可重用的UI组件。
3. 第三方的模版引擎：underscore。
4. 没有双向绑定，数据必须显示修改。

缺点：

1. 需要使用其他第三方框架去优化应用，例如marionette。不然代码可能会比较难维护。
2. 视图直接操作DOM，难以编写测试代码。

### React

React是一个把数据渲染成HTML的框架。React的视图可以组合使用，这样就像自定义了多个HTML标签。在React里面，不能直接操作子组件。组件的更新需要通过更改数据模型，这样能使组件之间更加独立。

优点：

1. 基于组件的架构。
2. 数据单向绑定，更改数据自动更改视图，更改视图不自动更改数据。
3. 虚拟DOM：视图的更改先更新虚拟DOM，再通过对比现在的视图和修改数据之后虚拟DOM的视图，找出其中的区别，最后只更新它们之间区别的部分，就是说“只更新需要更新的部分”。这样会比其他框架更新视图来的更加更加快。
4. 视图的所有逻辑、行为，甚至是样式都内聚在组件内部的代码。对于这种行为业界还是褒贬不一。（译注：我个人认为这样是有助于组件化的编程，这样能写出高内聚的组件，也不用担心样式冲突）

缺点：

1. 对于一个视图层来说，太复杂了。需要第三方的插件才能实现导航（Route）功能。
2. 当应用规模增大的时候，需要使用flux来管理数据和状态，不然应用的状态将变得不可控制。

### 总结

萝卜青菜各有所爱，我建议使用React，结合`react-route`和`redux`能写出清晰的、优雅的代码，易于维护。

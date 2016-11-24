---
layout: post
title: "React Virtual DOM小结"
description: ""
category: 
tags: [JavaScript, React]
---

### 引用

1. [React Demystified](http://blog.reverberate.org/2014/02/react-demystified.html)
1. [深度剖析：如何实现一个 Virtual DOM 算法](https://github.com/livoras/blog/issues/13)
1. [Reconciliation - React](https://facebook.github.io/react/docs/reconciliation.html)
1. [Performance Calendar » React’s diff algorithm](http://calendar.perfplanet.com/2013/diff/)

### 动机

在浏览器中，真实的DOM是非常庞大的。而在前端逻辑中，操作DOM又是必不可少的。为了解决频繁操作DOM导致Web应用效率下降的问题，React提出了“虚拟DOM”（virtual DOM）的概念。

### 入门

Virtual DOM是使用JavaScript对象模拟DOM的一种对象结构。DOM树中所有的信息都可以用JavaScript表述出来，例如：

    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>

可以用以下JavaScript对象来表示：

    {
      tag: 'ul',
      children: [{
        tag: 'li', children: ['Item 1'],
        tag: 'li', children: ['Item 2'],
        tag: 'li', children: ['Item 3']
      }]
    }

在使用JavaScript对象表示DOM树之后，我们可以把对DOM的操作先应用到这个JavaScript对象中。这时候，无论做什么操作，做多少操作，对真实的DOM都是没有影响的。而且，所有的操作都发生在JavaScript中，速度非常快。

在应用完所有操作之后（通常以一个event loop为界），我们可以比较对象的初始状态和应用操作后的最终状态，把它们的差异记录起来，然后就可以把这些差异应用到真实的DOM中，达到更新视图的目的。

我们可以把JavaScript理解成CPU、DOM理解成硬盘。硬盘的操作是非常慢的，如果CPU直接操作硬盘那会严重降低系统的性能。这时，我们可以加入Virtual DOM作为其中的一层缓存，计算出最优的操作硬盘的方式，再应用到硬盘上。

### 好处

使用Virtual DOM的好处不仅仅是可以提高操作DOM的效率，还能：

1. 由于Virtual DOM是纯JavaScript对象，可以携带一些应用相关的数据，同时不影响真实的DOM对象。
2. 在JSX中的`<li>`、`<p>`等标签并不会真实生成一个DOM对象，这些标签会映射到React内建的Virtual DOM的实例。
3. 更方便地实现事件代理，只需要把事件处理程序跟Virtual DOM关联起来就可以了。

### 算法

关于Virtual DOM，生成Virtual DOM对象、渲染真实的DOM对象、应用差异到真实的DOM对象这3个步骤都比较直白，Virtual DOM中真正的精髓在于取出两棵树的差异。使用通用的算法比较两棵树，复杂度达到O(n3)，在节点个数越来越多的场景下，这种复杂度是没有办法接受的。React结合Web应用对这个算法进行了修改，达到O(n)的复杂度，远远提高了执行效率。

首先，使用这个优化后的算法必须满足这些假设：

1. 如果两个元素的`type`不一致（例如一个是`<li>`，一个是`<a>`，或者是两个不一样的React Component Class），则这两个元素连通其Children都是不一致的。
2. 只比较同级的元素，鉴于Web应用中很少直接将一个已有的元素`appendChild()`到另一个元素中的操作。
3. 可以借助元素中的`key`属性，帮助React判断列表元素是原来有的还是新增的。

满足这几个假设之后，只需要对树做一个深度优先的遍历，就可以把两棵树的差异找出来。

### 更新

找出两棵树的差异之后，需要把这些差异应用到真实的DOM树中。差异类型可以有：

1. `REPLACE`：当两个节点的`type`不一样的时候，直接使用新的节点替换。
2. `REORDER`：对列表进行重新排序。
3. `PROPS`：使用新节点上的属性值替代原来的属性值。
4. `TEXT`：使用新节点上的文本替代原来的文本。

把这些差异应用到DOM上，视图就更新了。

### 渲染

这里总结一下React Component中的`render()`方法和`setState()`之间的关系。当调用Component中的`setState()`方法时，React会把这个Component标记成“脏”状态，在下一个event loop结束的时候，React会收集所有“脏”组件，并重新渲染它们。

当组件的`setState()`方法被调用时，组件会重新构建其Virtual DOM对象，即会调用所有子组件的`render()`方法获取新的Virtual DOM对象。这就是说，如果调用了顶层组件的`setState()`方法，整个Web应用的所有组件的`render()`方法都会被调用一遍！

听起来很恐怖，但是React就是这么做的。其实实现起来还好，因为所有的`render()`都只会发生在JavaScript中，然而JavaScript执行这些`render()`方法是足够快的。

除了`setState()`外，当父元素的`render()`方法被执行时，可能会使用新的`props`去构建子组件，这时候，子组件的`render()`方法也会被调用。

假设我们有一个组件，它是“只读”的，即生成了之后就不会改变。在React中，引用了这个组件的父组件发生变化，其`render()`方法也是会被调用的。React提供了一个方法`shouldComponentUpdate()`，去让开发者控制当新状态或者新属性被设置的时候组件是否应该重新渲染。这个方法接受两个参数：

1. `nextProps`，新的属性值。
2. `nextState`，新的状态值。

这个方法默认是返回`true`的，即接受到任何新属性或者新状态的时候，组件都必须重新渲染。我们只需要覆盖默认的实现：

    class A extends Component {
      ...
      shouldComponentUpdate() {
        return false
      }
      ...
    }

这样，当这个组件mount到DOM节点上面之后，无论父元素怎么调用`setState()`，这个组件的`render()`方法都不会被调用。唯一要注意的地方就是，这个方法可能会被调用很多很多次，要注意其自身的性能。

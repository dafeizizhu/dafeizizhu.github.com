---
layout: post
title: "简析jQuery几个绑定事件方法的优劣异同"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

今天被问到jQuery中绑定事件的方式，回答了`bind`、`live`、`on`三种。继续被问到哪种方式比较好。当时我毫不犹豫地说是`on`。继续被追问说除了`on`还知不知道有什么更好的方式绑定事件。当时哥就蒙了，还有更好的绑定事件的方式吗？决定写一下jQuery中绑定事件有哪些方式，各种方式之间的区别又是啥。

###.bind

先看看jQuery官方是怎么描述`bind`的：

> Attach a handler to an event for the elements.

简单地说就是往元素上绑定事件处理程序。该方法接受三个参数：

1. `eventType`，绑定事件的名称。名称可以是任意的，接受自定义事件（只能通过`trigger`触发）。
2. `eventData`，可选，绑定事件附加的数据，这个数据会附在事件对象的`data`属性里面。
3. `handler`，事件处理程序，每次触发事件都会执行这个事件处理程序。

**必须在一个已存在的元素上才能使用`bind`。**`bind`只能把事件处理程序绑定到指定的DOM元素上面。注意的是，如果为该对象的同一个事件绑定多个事件处理程序，则其执行的顺序是按照其绑定的先后顺序决定的。

假如绑定的对象只是一个DOM元素（例如通过id选择器选择），那么用`bind`是可以的，不会带来太多额外的开销。但是当选择器选择的DOM对象个数非常多，由于要在每一个元素上都绑定同一个事件处理程序，会带来额外的开销，包括获取DOM元素、遍历所有DOM元素绑定事件处理程序等。而且由于`bind`绑定时机的局限性，一般在频繁动态创建和删除DOM的场景下都不会使用`bind`。

###.live

又看看jQuery官方是怎么描述`live`的：

> Attach an event handler for all elements which match the current selector, now and in the future.

可以为所有匹配该选择器的元素（无论存在与否）绑定事件处理程序。该方法接受的参数跟`bind`是一致的。

这个方法把事件处理程序绑定到`document`上，根据触发事件的DOM对象是否满足选择器而决定是否执行事件处理程序。由于事件处理程序是绑定在`document`上的，所有无论在绑定事件的时候选择器对应的元素是否存在，都能在事件触发之后正确执行相关的事件处理程序。

根据官方的说法，`live`有以下几个缺点：

1. jQuery按照选择器先获取所有匹配的DOM对象，这个开销是不必要的。
2. 不支持链式的写法。
3. 因为所有的事件处理程序都是绑定在`document`元素，如果目标元素所在的DOM树节点比较深，会有一个比较长的冒泡路径。
4. 在iPad、iTouch和iPhone上，`click`事件不会冒泡到`document`上（囧）。
5. `event.stopPropagation`不能阻止事件冒泡，因为事件已经冒泡到`document`上面了（囧）。
6. 与别的事件绑定方法共用会有意想不到的结果。例如`$(document).off("click")`。

鉴于以上种种缺点，**这个方法在1.7已经被声明是废弃的了。**1.7之后的版本应该是用`on`来替代，1.7之前的版本应该用`delegate`来替代。

###.delegate

再看看jQuery官方是怎么描述`delegate`的：

> Attach a handler to one or more events for all elements that match the selector, now or in the future, based on a specific set of root elements.

跟`live`不一样，`delegate`可以把事件处理程序委托到一个指定的“根”元素上面（而`live`一定是`document`）。这个方法接受四个参数：

1. `selector`，选择器，当触发事件的DOM元素匹配这个选择器时触发事件处理程序。
2. `eventType`，同`bind`。
3. `eventData`，同`bind`。
4. `handler`，同`bind`。

从参数上看，由于`delegate`可以指定一个元素作为“根”，则没有`live`的缺点1、缺点2和缺点3。跟`live`类似，`event.stopPropagation`在代理的事件处理程序中也是无效的，更有甚者，假如在“根”元素的DOM树下，其中一个元素的这个事件处理程序阻止了事件冒泡，那么代理的事件处理程序将被阻止执行。在1.7之前，`delegate`是最效率的事件绑定方式。在1.7，`delegate`已经被`on`代替了。

###.on

最后看看jQuery官方是怎么描述`on`的：

> Attach an event handler function for one or more events to the selected elements.

有点返璞归真的感觉，就是往选中的元素绑定某个事件处理程序。在1.7里，`on`提供了所有有关于事件绑定的功能，这个方法接受四个参数：

1. `events`，要绑定的事件，可以多个，用空格隔开。
2. `selector`，可选，过滤选择器，只有匹配这个选择器的元素才执行事件处理程序。如果没有提供则认为是绑定在选中的元素上。
3. `data`，可选，同`bind`的`eventData`。
4. `handler`，同`bind`。

`on`比较有趣的是`selector`这个参数。如果没有，则跟`bind`一样是绑定在某个特定的元素上。如果有，则跟`delegate`类似，是一个事件代理，把`selector`匹配的元素的事件处理程序代理到选中的元素上。

*小细节：`load`、`scroll`、`error`不支持事件委托哦亲！*

从jQuery的官方文档看出来，jQuery强烈建议后来写的代码都用`on`作为事件绑定的方式。所有关于事件绑定的内容，如事件名称及其命名空间、直接绑定和事件委托、事件处理程序及其运行上下文（`this`）、附加数据还有事件性能等说明，都写在`on`的那一页。从代码上看，之前的`bind`、`live`、`delegate`在1.7里面的实现都变成是`on`了。从接口上看`on`也统一了绑定事件处理程序的各种接口。就让`on`来得更猛烈一些吧！

由于时间关系，对于`on`的研究还要继续，需要解决的问题有：

1. 究竟`on`能否解决在事件委托的情况下不能使用`event.stopPropagation`的问题？
2. 假如在委托模式下，选择元素的其中一个子元素阻止事件冒泡，`on`委托的事件处理程序还能否顺利执行？

明天继续探讨。

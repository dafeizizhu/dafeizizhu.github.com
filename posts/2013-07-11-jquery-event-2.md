---
layout: post
title: "jQuery事件绑定研究续"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

昨天留下了两个问题：

1. 究竟`on`能否解决在事件委托的情况下不能使用`event.stopPropagation`的问题？
2. 假如在委托模式下，选择元素的其中一个子元素阻止事件冒泡，`on`委托的事件处理程序还能否顺利执行？

针对问题1，先做一个实验，[参考这里](http://jsfiddle.net/Ask5n/2/)：

HTML：

    <div id="root">
        <div id="outer">
            Outer
            <div id="inner">Inner</div>
        </div>
    </div>

JavaScript：
    
    $("#root").on("click", function (evt) {
        alert("click on root");
    });

    $("#root").on("click", "#outer", function (evt) {
        alert("click on outer delegate");
    });

    $("#root").on("click", "#inner", function (evt) {
        alert("click on inner delegate, and i stop propagation!");
        evt.stopPropagation();
    });

单击`#inner`，成功的阻止了`#outer`和`#root`上面的单击事件，说明在全部都用`on`的情况下是可以实现阻止冒泡的功能。这个貌似跟事件委托的原理有点违背的感觉。看看jQuery的源码是怎么实现的。

观察1.7的源码发现，`on`对于选中的元素进行事件绑定的数据是用内部的`_data`方法存在DOM里面的。所有事件都会绑定到内部的`dispatch`方法，由这个方法分发具体的事件，进而触发具体的事件处理程序。其中有这么一段代码：

    if ( selector ) {
        handlers.splice( handlers.delegateCount++, 0, handleObj );
    } else {
        handlers.push( handleObj );
    }

如果是事件委托，会放到处理程序队列的前端（但是还是按照委托的顺序进行存放），而事件绑定则是放到队列的最后。这样导致事件委托的处理程序会优先于事件绑定的处理程序执行。现在再来看看事件触发的时候jQuery是怎么处理的。

触发事件时，先拿到当前事件处理程序的`elem`属性（即做事件委托时选中的“根”元素），然后以这个元素为事件处理程序的执行上下文（使用`apply`把`dispatch`方法里面的`this`变成该元素），并传入事件对象。`dispatch`方法先把事件对象封装一下，屏蔽浏览器差异（万恶的IE），然后从触发事件的`target`出发，遍历其父元素一直到“根”元素。在每一次循环里面，再遍历“根”元素这个事件上的`handler`队列（就是上文的`handlers`）中的事件委托部分，如果该事件委托的`selector`与当前这个元素匹配，则把该事件处理程序及其对应的元素放入最终的事件处理程序队列。事件委托遍历完成后，把剩余的事件绑定的处理程序及“根”元素一并放入最终队列中。到这个时候，就可以看出前面那个实验的结果是理所当然的。**当为一个“根”元素中若干个子元素进行事件委托，`event.stopPropagation`是有效的。**

经过以上的分析，问题2的答案也出来了。当全部都是使用`on`的事件委托模式去处理事件，是不会出现问题的。但是假如其中一个元素使用的是事件绑定的方式，则有可能会阻止事件委托的处理程序的执行，[参考这里](http://jsfiddle.net/rp3Wp/)：

    $("#root").on("click", function (evt) {
        alert("click on root");
    });

    $("#outer").on("click", function (evt) {
        alert("click on outer delegate, and i stop propagation!");
        evt.stopPropagation();
    });

    $("#root").on("click", "#inner", function (evt) {
        alert("click on inner");
    });

单击`#inner`，有趣的事情发生了，`#outer`的事件处理程序执行，并阻止了事件冒泡，导致`#inner`的事件处理程序没有被执行，坑爹啊！

血淋淋的事实告诉我们，要把`on`的事件委托进行到底到底到底到底……

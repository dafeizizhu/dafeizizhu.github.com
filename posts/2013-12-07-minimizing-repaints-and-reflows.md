---
layout: post
title: "High Performance JavaScript 读书笔记之 减少Repaint和Reflow的次数"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

之前已经讨论过Repaint和Reflow会对性能造成一定的影响，所以我们在进行DOM操作的时候，需要注意的是要把这些操作“集中”到一个地方，然后一次性地应用到页面上面。例如以下的代码：

    var el = document.getElementById('mydiv');
    el.style.borderLeft = '1px';
    el.style.borderRight = '2px';
    el.style.padding = '5px';

这里用了3行代码设置DOM的样式。虽然浏览器会对这些操作进行优化，但是最坏的情况下会进行3次Reflow。为了减少Reflow可能发生的次数，这样修改可能比较合适：

    var el = document.getElementById('mydiv');
    el.style.cssText = 'border-left: 1px; border-right: 2px; padding: 5px;';

虽然这样可以减少Reflow可能发生的次数，但是造成代码的可读性变差。最佳实践是使用`class`：

    var el = document.getElementById('mydiv');
    el.className = 'active';

当对样式的修改不依赖于运行时的时候，修改`class`这种方式最优。

进行影响几何属性的DOM操作的时候，可以依照下面的步骤去进行，最小化Reflow或者Repaint的次数：

1. 把DOM从展现树中暂时“抽出去”。
2. 操作这个DOM。
3. 把DOM插入到原来它在展现树的位置，完成这些DOM操作。

我们可以使用以下几个方法把DOM从展现树中暂时抽出去：

1. 把这个DOM弄成不可见的（`display: none`等）。
2. 使用`documentFregment`（推荐使用这个）。
3. 复制一个DOM，然后擦作这个复制出来的DOM，最后把它替换原DOM。

抽出去之后就可以随意地进行DOM操作了，无论如何修改其几何属性，都不会对原来的页面造成影响。在完成这些DOM操作之后，把DOM显示出来，或者用把DOM替换回去就可以应用这些修改了，而这样最多就只会触发一次Reflow或者Repaint哦。

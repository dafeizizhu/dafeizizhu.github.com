---
layout: post
title: "《SVG精髓》读书笔记（续4）"
description: ""
category: 
tags: [svg, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 书接上回

1. [《SVG精髓》读书笔记](/posts/2018/08/29/svg-essentials-summary.html)
2. [《SVG精髓》读书笔记（续1）](/posts/2018/09/07/svg-essentials-summary.html)
3. [《SVG精髓》读书笔记（续2）](/posts/2018/09/21/svg-essentials-summary.html)
4. [《SVG精髓》读书笔记（续3）](/posts/2018/09/30/svg-essentials-summary.html)

### 线性路径动画

使用`<animateMotion>`元素能让对象沿着任意路径运动，例如：

    <animateMotion from='0,0' to='60,30' dur='4s' fill='freeze' />

这个例子能让元素从`from`指定的起点运动到`to`指定的终点。其中`fill='freeze'`可以让动画结束后保持位置，如果不设置的话默认回到初始位置。

<p data-height="265" data-theme-id="0" data-slug-hash="oaKBBj" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="线性路径动画（直线）" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/oaKBBj/">线性路径动画（直线）</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

也可以使用`path`属性指定更复杂的路径，格式跟`<path>`元素的`d`属性是一致的，例如：

    <animateMotion path='M50 125C100 25 150 225 200 125' dur='6s' fill='freeze' />

效果如下：

<p data-height="265" data-theme-id="0" data-slug-hash="VEopLz" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="线性路径动画（任意路径）" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/VEopLz/">线性路径动画（任意路径）</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

当运动过程中三角形始终是垂直的，如果希望三角形倾斜使其x轴始终平行于路径的方向，只需要在`<animateMotion>`元素增加一个`roate='auto'`即可，例如：

<p data-height="265" data-theme-id="0" data-slug-hash="bmXqEO" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="线性路径动画（平行于任意路径）" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/bmXqEO/">线性路径动画（平行于任意路径）</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

这个`path`属性也可以使用现有的路径，在`<animateMotion>`元素里面添加一个`<mpath>`子元素即可：

    <animateMotion>
      <mpath xlink:href='#curve' />
    </animateMotion>

### 为运动指定关键点和时间

为`<animateMotion>`添加`keyTimes`属性来控制动画在不同值之间过渡的速度，添加`keyPoints`属性指定关键点。每个关键点表示对象应该按照`keyTimes`列表中响应的时间点沿着路径移动多远，其中：

1. `keyTimes`的范围从`0`（动画开始）到`1`（动画结束）。
2. `keyPoints`的范围从`0`（路径开始）到`1`（路径结束）。
3. `keyTimes`和`keyPoints`的长度必须相同。

效果如下：

<p data-height="265" data-theme-id="0" data-slug-hash="MPNvWN" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="为运动指定关键点和时间" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/MPNvWN/">为运动指定关键点和时间</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 使用脚本控制SVG

使用ECMAScript与SVG图形进行交互，其中：

1. `document.getElementById(idString)`，获取DOM中对应节点的引用。
2. `document.getElementsByTagName(name)`，获取文档中标记名为某个名字的所有元素。
3. `element.getAttribute(attributeName)`，读取节点属性。
4. `element.setAttribute(name, newValue)`，设置节点属性。
5. `element.removeAttribute(name)`，删除节点属性。
6. `element.style.getPropertyValue(propertyName)`，获取节点上指定的样式。
7. `element.style.setProperty(propertyName, newValue, priority)`，设置节点上指定的样式。
8. `element.style.removeProperty(propertyName)`，删除节点上指定的样式。
9. `element.style.cssText`，获取或者设置节点上的样式（以字符串的形式）。
10. `element.textContent`，获取或者设置节点的文本内容。

例子：

<p data-height="265" data-theme-id="0" data-slug-hash="wYVqxb" data-default-tab="js,result" data-user="dafeizizhu" data-pen-title="使用脚本控制SVG（1）" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/wYVqxb/">使用脚本控制SVG（1）</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

图形对象还能响应事件，其中：

1. 用户接口事件，如`focusIn`，`focusOut`。
2. 鼠标事件，如`mousedown`，`mouseup`，`click`，`mouseover`，`mousemove`，`mouseout`。
3. DOM变化事件，如`DOMNodeInserted`，`DOMAttrModified`。
4. 文档事件，如`SVGLoad`，`SVGUnload`，`SVGAbort`，`SVGError`，`SVGResize`，`SVGScroll`，`SVGZoom`。
5. 动画事件，如`beginEvent`，`endEvent`，`repeatEvent`。
6. 键盘事件，如`keydown`，`keyup`，这些事件不是SVG的标准事件。

使用`elment.addEventListener()`来监听事件，它接受两个参数：

1. 表示要监听的事件类型的字符串。
2. 处理事件的函数。
3. 可选的第三个参数，表示是否响应“事件捕获”阶段的事件。

事件处理函数接受一个包含了触发函数调用的事件的相关信息的事件对象作为参数，其`target`属性表示事件产生的元素。

例子：

<p data-height="265" data-theme-id="0" data-slug-hash="VEozJG" data-default-tab="js,result" data-user="dafeizizhu" data-pen-title="使用脚本控制SVG（2）" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/VEozJG/">使用脚本控制SVG（2）</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

一个比较复杂的例子，包含元素的拖拽：

<p data-height="265" data-theme-id="0" data-slug-hash="ZqgXWy" data-default-tab="js,result" data-user="dafeizizhu" data-pen-title="使用脚本控制SVG（3）" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/ZqgXWy/">使用脚本控制SVG（3）</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

最后一个例子是一个模拟时钟：

<p data-height="265" data-theme-id="0" data-slug-hash="jegawK" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="模拟时钟" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/jegawK/">模拟时钟</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

完结撒花！

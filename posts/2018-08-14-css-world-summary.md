---
layout: post
title: "《CSS世界》读书笔记（续6）"
description: ""
category: 
tags: [css, 读书笔记]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 书接上回

1. [《CSS世界》读书笔记](/posts/2018/06/22/css-world-summary.html)
2. [《CSS世界》读书笔记（续）](/posts/2018/06/29/css-world-summary.html)
3. [《CSS世界》读书笔记（续）（续）](/posts/2018/07/16/css-world-summary.html)
4. [《CSS世界》读书笔记（续）（续）（续）](/posts/2018/07/23/css-world-summary.html)
5. [《CSS世界》读书笔记（续4）](/posts/2018/07/30/css-world-summary.html)
6. [《CSS世界》读书笔记（续5）](/posts/2018/08/07/css-world-summary.html)

### hover悬浮显示列表效果

在显示的时候增加一定的延时，可以避免不经意触碰导致覆盖目标元素的问题：

    <td>
      <a href='javascript:;'>操作</a>
      <div class='list'>
        <a href='javascript:;'>编辑</a>
        <a href='javascript:;'>删除</a>
      </div>
    </td>
    <style>
    .list {
      position: absolute;
      visibility: hidden;
    }
    td:hover .list {
      visibility: visible;
      transition: visibility 0s .2s;
    }
    </style>

<p data-height="265" data-theme-id="0" data-slug-hash="djLNjr" data-default-tab="html,result" data-user="dafeizizhu" data-pen-title="hover悬浮显示列表效果" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/djLNjr/">hover悬浮显示列表效果</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 底部占满屏幕

使用`outline`实现底部背景色正好填满剩余屏幕区域：

    .footer {
      height: 50px;
    }
    .footer > p {
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      padding: 15px 0;
      background-color: #a0b3d6;
      outline: 9999px solid #a0b3d6;
      clip: rect(0 9999px 9999px 0);
    }

<p data-height="265" data-theme-id="0" data-slug-hash="VBNPNo" data-default-tab="css,result" data-user="dafeizizhu" data-pen-title="底部占满屏幕" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/VBNPNo/">底部占满屏幕</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### `cursor`属性值

`cursor`属性值分成以下几类：

第一类是常规属性，包括：

1. `auto`，这个是`cursor`的默认值，表示光标形状根据内容类别浏览器自动进行处理，例如输入框是`text`，带`href`属性的链接是`pointer`，原生的`<button>`为`default`等。
2. `default`，系统默认光标形状，一个空心箭头。
3. `none`，让光标隐藏不见，适用于全屏看视频的时候。

第二类是链接和状态，包括：

1. `pointer`，光标表现为一只伸出食指的手型。
2. `help`，光标头上带一个问号。
3. `progress`，表示进行中的意思，在Windows 7系统下会有一个不断旋转的圆圈。使用场景：在页面的css中加入`cursor: progress`，待JavaScript加载完毕后执行`document.body.style.cursor = 'auto'`表示页面已经完全可用。
4. `wait`，和电脑死机时候的光标一样，请不要在Web开发的时候使用。
5. `context-menu`，上下文菜单，只有在Mac OS和Linux系统下的Chrome和FireFox才支持。可以容用户更容易意识到这里有自定义的上下文菜单功能。

第三类是选择，包括：

1. `text`，表示文字可以被选中。
2. `vertical-text`，表示文字可以垂直选中。
3. `crosshair`，十字光标，通常用在像素级的框选和点选，例如自定义的取色工具。
4. `cell`，表示单元格是可以框选的，Excel的御用光标。

第四类是拖拽，包括：

1. `move`，表示当前元素可以移动。
2. `copy`，表示当前元素可以被复制。
3. `alias`，表示当前元素可以创建别名或者快捷方式。
4. `no-drop`，表示当前元素放开到当前位置是不允许的，跟`not-allowed`表现一致。
5. `not-allowed`，表示当前行为是禁止的，仅限于表现与拖拽相关的功能。

第五类是滚动和拉伸，包括：

1. `all-scroll`，表示上下左右都可以滚动，在Windows系统下跟`move`的表现一致。
2. `col-resize`，适用于垂直参考线。
3. `row-resize`，适用于水平参考线。
4. `n-resize`，朝上拉伸。
5. `e-resize`，朝右拉伸。
6. `s-resize`，朝下拉伸。
7. `w-resize`，朝左拉伸。
8. `ne-resize`，朝右上拉伸。
9. `nw-resize`，朝左上拉伸。
10. `se-resize`，朝右下拉伸。
11. `sw-resize`，朝左下拉伸。
12. `ew-resize`，朝左右双向拉伸。
13. `ns-resize`，朝上下双向拉伸。
14. `nesw-resize`，朝左下右上双向拉伸。
15. `nwse-resize`，朝左上右下双向拉伸。

第六类是缩放和抓取，包括：

1. `zoom-in`，放大。
2. `zoom-out`，缩小。
3. `grab`，五指伸开的手型。
4. `grabbing`，五指收起的手型。

以上属性可以放心使用的有：`auto`，`crosshair`，`default`，`move`，`text`，`wait`，`help`，`n-resize`，`e-resize`，`e-resize`，`w-resize`，`ne-resize`，`nw-resize`，`se-resize`，`sw-resize`，`pointer`，`progress`，`not-allowed`，`no-drop`，`vertical-text`，`all-scroll`，`col-resize`和`row-resize`。

从IE9才开始支持的有：`none`，`alias`，`cell`，`copy`，`ew-resize`，`ns-resize`，`nesw-resize`，`nwse-resize`和`context-menu`。

`zoom-in`和`zoom-out`需要Edge12才支持。

`grab`和`grabbing`需要Edge14才支持。

### 单个文字按钮单击下沉效果

利用垂直布局的文字的`text-indent`实现：

    <a href='javascript:;' class='btn verticle-mode'>嗷</a>
    <style>
    .btn:active {
      text-indent: 5px;
    }
    .verticle-mode {
      writing-mode: tb-rl;
      writing-mode: vertical-rl;
    }
    </style>

<p data-height="265" data-theme-id="0" data-slug-hash="jpRBQv" data-default-tab="css,result" data-user="dafeizizhu" data-pen-title="单个文字按钮单击下沉效果" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/jpRBQv/">单个文字按钮单击下沉效果</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

完结撒花！！！！！！！！！！！！！！！

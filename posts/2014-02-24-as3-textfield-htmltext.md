---
layout: post
title: "在AS3中用TextField显示HTML"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

在Flash中，难免有些时候想使用HTML的某些标签和特性，例如使用`a`标签去提供链接功能，可以省去一些绑定鼠标单击事件的代码。AS3的`TextField`类提供了一个属性`htmlText`来实现这类功能。这个属性包含了文本字段内容的HTML表示形式。

然而这个属性并不是支持所有HTML标签。Flash Player支持以下的HTML标签及其属性：

1. `<a>`标签创建超文本连接，支持`target`和`href`属性。
2. `<b>`标签以提供粗体形式呈现文本。
3. `<br>`标签将在文本字段中创建一个换行符。
4. `<font>`标签指定一种字体或一个字体列表来显示文本，支持`color`、`face`和`size`属性。
5. `<img>`标签可将外部图像文件（`JPEG`、`GIT`、`PNG`）、`SWF`文件和影片剪辑嵌入到文本字段中，支持`src`、`width`、`height`、`align`等属性。
6. `<i>`标签以斜体形式显示标签中的文本。
7. `<li>`标签在所包含的文本前放置项目符号。**Flash Player和AIR无法识别有序和无序列表标签，所有列表都是无序的。**
8. `<p>`标签创建一个新段落，支持`align`和`class`属性。
9. `<span>`标签只可用于CSS文本样式，支持`class`属性。
10. `<textformat>`标签可在文本字段中使用`TextFormat`类的段落格式设置属性子集，包括：
  1. `blockindent`，指定块缩进（以点为单位）。
  2. `indent`，指定从左边距到段落中第一个字符的缩进。
  3. `leading`，指定行与行中间的前导量（垂直间距）。
  4. `leftmargin`，指定段落的左边距（以点为单位）。
  5. `rightmargin`，指定段落的右边距（以点为单位）。
  6. `tabstops`，将自定义Tab停靠位指定为一个非负整数的数组。
11. `<u>`标签为标签文本添加下划线。

**要使用`<br>`和`<p>`标签的时候要开启`TextField`的多行模式：**

    textField.multiline = true

我们还可以为这个`TextField`实例指定样式，例如：

    var style:StyleSheet = new StyleSheet(); 
     
    var styleObj:Object = new Object(); 
    styleObj.fontSize = "bold"; 
    styleObj.color = "#FF0000"; 
    style.setStyle(".darkRed", styleObj); 
      
    var tf:TextField = new TextField(); 
    tf.styleSheet = style; 
    tf.htmlText = "<span class = 'darkRed'>Red</span> apple"; 
       
    addChild(tf);

使用这个属性我们可以方便地把一些带格式的文本添加到一个`TextField`实例中，免去编写一大堆AS3代码的麻烦。使用这个属性的缺点也比较明显，当你单纯想使用这个属性做出一些复杂的效果，编写HTML代码和CSS代码的时间或许比编写AS3代码的时间更长。这个属性还是比较适合在一些简单的场景下使用，例如显示一个链接列表之类的。

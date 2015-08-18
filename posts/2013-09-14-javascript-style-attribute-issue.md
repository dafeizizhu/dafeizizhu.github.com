---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 style的那些事"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

`style`算是一个比较麻烦的东西，因为使用`getAttribute("style")`和`elem.style`这两个返回的结果是不一样的。通常的用法是使用后者，返回一个`style`对象，通过这个对象操作DOM的各种CSS样式。而通过这个对象访问DOM上的CSS样式，**只能访问到内联的CSS样式**，而通过样式表（`style`标签、外部CSS样式表）叠加的CSS样式则不能通过这个对象访问。不过还是可以通过一些方式得到“层叠后”的CSS样式。

###style属性的命名
____

很多CSS样式都是使用`-`来连接多个单词，例如`border-width`、`margin-left`等。要访问这些`style`对象的属性，需要通过以下的代码访问：

    elem.style['border-width'];

如果使用`.`来访问属性，例如`elem.style.border-width`，中间的`-`会被解析成减号，导致逻辑错误或者是语法错误。需要使用`.`访问这些CSS样式，需要把这些样式名改成驼峰大小写的形式，例如：

    elem.style.borderWidth;

可以简单使用以下代码去进行转换：

    name = name.replace(/-([a-z])/ig,                   
      function(all,letter){
        return letter.toUpperCase();
      });

###float
____

由于`float`是一个JavaScript保留字，所以不能使用`elem.style.float`来访问`float`的值。被催的是，遵循标准实现的浏览器使用的是`cssFloat`，而IE则是使用`styleFloat`。这需要在命名转换的函数中加入特殊判断，当属性是`float`的时候分别尝试`cssFloat`或者`styleFloat`的值。

###像素值
____

一些声明大小的CSS样式，例如`width`或者`hight`等，其实是需要指定单位的。而老的代码通常会在HTML元素中加入`width`和`height`特性来指定元素的大小。在这些特性的值里面是不需要填写单位的，浏览器会默认添加`px`作为单位。但是在CSS样式中，需要指定单位才能使这个样式生效，例如：

    element.style.height = "10px";

遗憾的是，不是所有值是数字的CSS样式都是有单位的，例如`z-index`。除了这些没有单位的CSS样式，其他值是数字的CSS样式都可以为它们添加默认的单位。

###计算元素的大小
____

通过`elem.style.width`只能够获取到显式设置了`width`样式的元素的宽度。而元素的默认样式是`width: auto`，表示宽度是自动的（根据是块元素还是行内元素`auto`的行为是不同的）。这个时候通过以上的代码不能获取到元素的宽度。

浏览器在每个DOM元素上都附加了两个属性`offsetWidth`和`offsetHeight`，让我们能方便地获取元素的大小。这两个属性的值包含了元素的`padding`大小哦！

注意，当元素的`display`为`none`的时候，这两个属性的值都是`0`。

###opacity
____

这个属性声明元素的透明度，遗憾的是IE9之前的IE浏览器需要使用`filter`才能实现同样的效果，例如：

    opacity: 0.5;
    filter: alpha(opacity=50);

需要正确获取元素的透明度，首先需要判断元素是否支持`opacity`，书中通过这段代码去判断：

    div.setAttribute('style','opacity:.5');
    var OPACITY_SUPPORTED = div.style.opacity === "0.5";

这里使用了一个特性，就是当`opacity`的值是以小数点开头的时候，在`style`对象的`opacity`属性会自动转成对应的小数，以数字`0`开头。如果有这个特性，说明浏览器原生支持`opacity`，否则则不支持`opacity`，忽略掉`style.opacity`的值，转去获取对应`filter`的值。

###颜色
____

在CSS中，颜色有好几种表示方式：

1. 关键字，例如`red`、`white`等。
2. `#rgb`，使用一位十六进制数表示红绿蓝的值，范围是从`0`到`f`，`#123`等效于`#112233`。
3. `#rrggbb`，使用两位十六进制数表示红绿蓝的值，范围从`00`到`ff`。
4. `rgb(r, g, b)`，括号中的值代表红绿蓝的值，范围从`0`到`256`。
5. `rgba(r, g, b, a)`，与`rgb`类似，只是多了第四个值，表示`alpha`通道，表示颜色的透明度。
6. `hsl(h, s, l)`，使用亮度、色相和饱和度表示颜色。
7. `hsla(h, s, l, a)`，与`hsl`类似，增加了`alpha`通道，表示颜色的透明度。

当使用不同的颜色表达式去设置元素的颜色相关的CSS样式，再通过`style`去访问这些样式的值，不同浏览器有不同的表现：

1. Chrome等webkit的浏览器会统一转成`rgb`或者`rgba`的形式。
2. FireFox会保留关键字，其他统一转成`rgb`或者`rgba`的形式。
3. IE8会保留原始设置的颜色表达式（只是不支持`alpha`通道，通过`rgba`或者`hsla`设置的颜色不生效，返回的是空字符串）。
4. IE9会保留全部原始设置的颜色表达式。

---
layout: post
title: "在canvas中使用图片"
description: ""
category: 
tags: [JavaScript, html5]
---
{% include JB/setup %}

在canvas中可以使用浏览器支持的所有图片格式，甚至是另一个canvas上面的图像。要在canvas上使用图片，可以分成两个步骤：

1. 获取图像的引用。
2. 使用`drawImage`在canvas上画出对应的图像。

图像的引用可以通过以下几种方式获取：

1. `Image`对象，例如`var img = new Image()`或者`document.getElementById("img")`。
2. `Video`对象，canvas可以把这个视频对象当成图片使用。
3. 另外一个canvas。

如果图像跟canvas在同一个文档，就可以使用各种DOM API直接获取图像的引用，例如`getElementById`、`getElementsByTagName`等。值得注意是，使用`Image`等构造函数动态创建的图像，需要等该图像完全加载完毕之后才能使用，不然画出来的图像就有可能不正确：

    var img = new Image();   // Create new img element
    img.addEventListener("load", function() {
      // execute drawImage statements here
    }, false);
    img.src = 'myImage.png'; // Set source path

获取到图像的引用之后就可以使用`drawImage`在canvas上画图了。该方法是在canvas的上下文中：

    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
      var context = canvas.getContext("2d");
    }

该方法支持多种形式传入参数。第一种接受三个参数：

    context.drawImage(img, x, y);

其中`img`就是上面获取到的图像的引用，`x`和`y`表示图像在canvas中的坐标，会按照图像的原始大小在指定的坐标上绘制图像。

第二种接受五个参数：

    context.drawImage(img, x, y, width, height);

前三个参数跟上面是一样的，只是增加了两个参数可以指定图像的大小，会按比例缩放图像。

最后一种接受九个参数：

    context.drawImage(img, sx, sy, swidth, sheight, dx, dy, dwidth, dheight);

逆天了！第一个参数就是图像的引用，第二至第五个参数表示原图像中，这次要绘制的坐标以及大小，后四个参数表示在目标canvas中绘制的坐标以及大小。使用这个方式可以对图片做出一些简单的[裁剪](http://mdn.mozillademos.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial/Using_images$samples/Art_gallery_example?revision=467551)效果哦。

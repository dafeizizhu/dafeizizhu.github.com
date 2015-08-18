---
layout: post
title: "判断一个元素是否在视口之中"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

之前讨论过如何获取视口大小，用jQuery就最简单了：

    $(window).width();
    $(window).height();

今天来讨论一下如何判断一个元素是否在视口之中。首先来介绍一下`elem.getBoundingClientRect`方法。这个方法可以获取到一个元素在文档中的位置，例如：

    document.getElementById("id").getBoundingClientRect();

返回的对象有六个属性，包括`width`、`height`、`top`、`left`、`bottom`、`right`。通过这个对象我们就可以得到一个元素在文档中的位置。只需要减去`scrollY`和`scrollX`就可以得到相对于视口的位置：

    top = rect.top - window.scrollY;
    left = rect.left - window.scrollX;

根据这些信息，以及视口的大小就可以判断元素是否在视口中了。以下是一个使用jQuery的判断方法，记在这里以便不时之需，嘿嘿：

    $.fn.isOnScreen = function(){     
      var win = $(window);   
      var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
      };
      viewport.right = viewport.left + win.width();
      viewport.bottom = viewport.top + win.height();
     
      var bounds = this.offset();
      bounds.right = bounds.left + this.outerWidth();
      bounds.bottom = bounds.top + this.outerHeight();
     
      return (!(viewport.right < bounds.left ||
        viewport.left > bounds.right || 
        viewport.bottom < bounds.top || 
        viewport.top > bounds.bottom));
     
    };

---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 删除DOM"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

要讨论的最后的操作就是删除了。DOM对象已经提供了`removeChild`，让我们能方便地删除元素。但是，在删除元素之前，还要做一些清理工作。通常分成两个步骤。

第一个步骤就是把该元素上绑定的事件处理程序都删除掉。这个步骤十分重要，因为在老的IE上如果只把DOM对象删除，而事件处理程序没有被正确删除，会发生循环引用，导致内存不能正确回收。所以jQuery才不直接把事件处理程序绑定到元素上，而是使用一个唯一的key关联DOM对象及其事件处理程序等附加数据。所以，使用jQuery绑定的事件处理程序的删除非常方便，只需要把对应key的所有事件处理程序一并删除即可。

第二个步骤就是把我们自定义在DOM上的特性删除掉。同上，在jQuery中，只要把该元素对应key值的所有数据都删除即可。

还需要注意的是，这两个步骤必须在该元素的所有子元素上都执行一遍才行。以下是jQuery的一段代码示例：

    function remove() {
      jQuery("*", this).add([this]).each(function () {  
        jQuery.event.remove(this);                   
        jQuery.removeData(this);                 
      });
      if (this.parentNode)               
        this.parentNode.removeChild(this);
    }

先取出元素中的所有子孙元素，然后加上该元素本身，执行以上两个步骤。最后调用`removeChild`去删除DOM对象。

在IE中，除非页面跳转或者刷新，单纯删除一个DOM对象，内存可能不会回收。这意味这那些单页面应用（通常在一个页面会停留很久），随着使用时间的增大，在IE中消耗的内存会比较多。

针对IE的内存占用，有一个解决方案，就是把`outerHTML`属性置成空字符串。这会触发IE进行垃圾回收，虽然内存也不会被完全回收，但是比单纯调用`removeChild`的效果要好：

    if (this.parentNode)                       
      this.parentNode.removeChild(this);
    if (typeof this.outerHTML !== "undefined")
      this.outerHTML = "";

要记得在删除一个DOM对象之前，把所有跟这个DOM对象有关的东西，例如事件处理程序、自定义特性等都删除干净，这样可以避免大部分内存的问题哦。

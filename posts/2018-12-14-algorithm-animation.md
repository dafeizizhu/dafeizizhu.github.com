---
layout: post
title: "算法动画图解 - 选择排序"
description: ""
category: 
tags: [算法, JavaScript]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 引用

1. [稳定排序和不稳定排序 - 紫红的泪 - 博客园](https://www.cnblogs.com/codingmylife/archive/2012/10/21/2732980.html)
2. [各种排序算法比较(2):时间复杂度,空间复杂度 - weiwenhp - CSDN博客"](https://blog.csdn.net/weiwenhp/article/details/8622728)
3. [选择排序与冒泡排序区别与比较 - 圈圈的博客 - CSDN博客](https://blog.csdn.net/weixin_38277423/article/details/70304120)
4. [排序算法之 选择排序 及其时间复杂度和空间复杂度 - YuZhiHui_No1的专栏 - CSDN博客](https://blog.csdn.net/YuZhiHui_No1/article/details/44339673)

### 定义

> 每一趟从待排序的数据元素中选出最小（或最大）的一个元素，顺序放在已排好序的数列的最后，直到全部待排序的数据元素排完。 选择排序是不稳定的排序方法。

### 图解过程

![001](/images/20181214-001.jpg)

"选择排序“是数列排序算法之一。使用线性搜索数列并找出最小值：

![002](/images/20181214-002.jpg)

将最小值替换为数列中最左端的数字并进行排序：

![003](/images/20181214-003.jpg)

如果最小值已经在左端，则不执行任何操作。重复相同的操作，找出数列中剩余的最小值：

![004](/images/20181214-004.jpg)

继续重复操作，直到所有数字都被排序：

![005](/images/20181214-005.jpg)

### JavaScript实现

    function selectSort(arr) {
      var len = arr.length;
      // 外循环，从上次排序完结的下标开始
      for (var i = 0; i < len; i++) {
        var min = i;
        // 找出数列中剩下的最小值
        for (var j = i; j < len; j++) {
          if (arr[j] < arr[min]) {
            min = j;
          }
        }
        // 交换数列中剩下的第一个元素和最小的元素
        if (i !== min) {
          var t = arr[min];
          arr[min] = arr[i];
          arr[i] = t;
        }
      }
    }

例子如下：

<p data-height="265" data-theme-id="0" data-slug-hash="wRMxEo" data-default-tab="js,result" data-user="dafeizizhu" data-pen-title="算法动画详解 - 选择排序" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/wRMxEo/">算法动画详解 - 选择排序</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 性能分析：时间复杂度

选择排序的时间复杂度就是两个循环消耗的时间，其中比较时间：

    T = (n - 1) + (n - 2) + (n - 3) + ... + 1 = [n * (n - 1)] / 2

交换时间：最好的情况全部元素已经有序，则交换次数为`0`；最差的情况，全部元素逆序，则要交换`n - 1`次。

所以最优的时间复杂度、最差的时间复杂度和平均时间复杂度都为`O(n ^ 2)`。

### 性能分析：空间复杂度

与冒泡排序相同，需要一个临时变量来交换元素位置，所以空间复杂度为`O(1)`。

### 性能分析：稳定性

选择排序是给每个位置选择当前元素最小的，所以在一趟排序中，如果当前元素比一个元素小，而更小的元素又出现在一个和当前元素相等的元素后面，那么交换后稳定性就被破坏了。举个例子，序列：

    5 8 5 2 9

第一遍选择第一个元素`5`和`2`交换，那么原序列中的两个`5`的相对前后顺序就被破坏了。所以选择排序不是一个稳定的排序算法。

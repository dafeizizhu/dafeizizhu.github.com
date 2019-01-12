---
layout: post
title: "算法动画图解 - 插入排序"
description: ""
category: 
tags: [算法, JavaScript]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 引用

1. [App Store 上的“算法动画图解”](https://itunes.apple.com/cn/app/%E7%AE%97%E6%B3%95%E5%8A%A8%E7%94%BB%E5%9B%BE%E8%A7%A3/id1047532631?mt=8)
2. [插入排序 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E6%8F%92%E5%85%A5%E6%8E%92%E5%BA%8F)
3. [插入排序及其复杂度分析 - JollyWing - 博客园](https://www.cnblogs.com/jiqingwu/p/insertion_sort_algorithm.html)
4. [冒泡排序和插入排序 | Harttle Land](https://harttle.land/2015/09/28/insertion-bubble-sort.html)
5. [常见排序算法的稳定性分析和结论 - 阳光岛主 - CSDN博客](https://blog.csdn.net/ithomer/article/details/5636226)

### 定义

> 插入排序（英语：Insertion Sort）是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

### 图解过程

![20190112-001](/images/20190112-001.jpg)

插入排序是数列排序的算法之一。首先，左端的数字已完成排序。然后，去除那些尚未操作的左端的数字：

![20190112-002](/images/20190112-002.jpg)

将其与已经操作的左侧的数字进行比较。如果左边的数字较大，交换两个数字。再上面的例子中，`5`大于`3`，所以`3`和`5`进行交换：

![20190112-003](/images/20190112-003.jpg)

这时候`3`已经到最左侧了，所以停止数字的移动，并且最左侧的两个数字都已经排序完成了。对右侧的数字继续以上的几个步骤。下一个要排序的数字是`4`：

![20190112-004](/images/20190112-004.jpg)

`4`比`5`小，`4`和`5`交换，`4`比`3`小，停止移动：

![20190112-005](/images/20190112-005.jpg)

这时候最左侧的三个数字都已经完成排序了。最右侧的数字继续以上步骤，直到所有的数字完成排序：

![20190112-006](/images/20190112-006.jpg)

所有的数字都完成排序，所以排序完成了。

### JavaScript实现

    function insertSort(arr) {
      // 从数组的最左侧开始
      var i = 1
      
      // 重复操作直到所有数字排序完成
      while (i < arr.length) {
        var j = i
        // 把未排序的第一个数字与已排序的每个数字做对比
        for (var k = i - 1; k >= 0; k--) {
          if (arr[k] > arr[j]) {
            // 假如未排序的第一个数字小于已排序的数字，则交换
            var tmp = arr[j]
            arr[j] = arr[k]
            arr[k] = tmp
            j--
          } else {
            // 假如未排序的第一个数字已经大于已排序的数字，则这轮排序完成
            break
          }
        }
        // 已排序的数字增加一个
        i++
      }
    }

例子如下：

<p data-height="265" data-theme-id="0" data-slug-hash="oJQGJe" data-default-tab="js,result" data-user="dafeizizhu" data-pen-title="算法动画详解 - 插入排序" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/oJQGJe/">算法动画详解 - 插入排序</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 时间复杂度

1. 最好的情况：当序列本来就是有序的，只需要`n - 1`次比较即可，没有任何元素的移动，这时候的时间复杂度是`O(n)`。
2. 最坏的情况：当序列本来就是逆序的，每个元素都要一步一步地挪动到序列首部，这时候的时间复杂度是`1 + 2 + 3 + ... + (n - 1)`，等差数列求和为`n ^ 2 / 2`，这时候的时间复杂度是`O(n^2)`。
3. 平均的情况：`O(n^2)`。

### 空间复杂度

与冒泡排序类似，只使用了一个临时的变量进行交换操作，所以插入排序的空间复杂度是`O(1)`。

### 稳定性

在插入排序的过程中，相等元素的前后顺序没有改变，从原来无序序列出去的顺序就是排好序后的顺序，所以插入排序是稳定的。

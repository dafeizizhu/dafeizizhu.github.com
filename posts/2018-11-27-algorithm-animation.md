---
layout: post
title: "算法动画图解 - 冒泡排序"
description: ""
category: 
tags: [算法, JavaScript]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 引用

1. [App Store 上的“算法动画图解”](https://itunes.apple.com/cn/app/%E7%AE%97%E6%B3%95%E5%8A%A8%E7%94%BB%E5%9B%BE%E8%A7%A3/id1047532631?mt=8)
1. [冒泡排序 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E5%86%92%E6%B3%A1%E6%8E%92%E5%BA%8F)
2. [经典排序算法（1）——冒泡排序算法详解 - 渴望，就奋力追寻... - CSDN博客](https://blog.csdn.net/guoweimelon/article/details/50902597)

### 定义

> 冒泡排序（英语：Bubble Sort）是一种简单的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。

### 图解过程

![001](/images/20181127-001.png)

“冒泡排序”是数列排序的算法之一。 将天平放在序列的右端，并比较天平左右的数字。在这种情况下，我们将比较“7”和“6”。比较后如果右边的数字较小，则被交换。

![002](/images/20181127-002.png)

比较完成之后，逐一移动天平。

![003](/images/20181127-003.png)

同样比较数字，这次是“6”大于“4”，所以数字不用交换。将天平向左移动一个位置。

![004](/images/20181127-004.png)

重复同样的操作，直到天平移动到左端。

![005](/images/20181127-005.png)

天平移动到左端。在这一系列的操作中，数列中最小的数字已经移动到左端。固定最左端的数字排序。

![006](/images/20181127-006.png)

将天平返回右端。

![007](/images/20181127-007.png)

重复相同的操作，直到所有数字都被排序。

![008](/images/20181127-008.png)

排序完成。

### JavaScript实现

    function bubbleSort (arr) {
      var cursor = arr.length - 1
      
      while (cursor > 0) {
        // 天平放在序列的右端
        for (var i = 0; i < cursor; i++) {
          // 比较天平左右的数字
          if (arr[i] > arr[i + 1]) {
            // 数字较小则被交换
            var temp = arr[i]
            arr[i] = arr[i + 1]
            arr[i + 1] = temp
          }
        }
        // 逐一移动天平，直到天平移动到左侧
        cursor -= 1
      }
    }

例子如下：

<p data-height="300" data-theme-id="0" data-slug-hash="OawEPj" data-default-tab="js,result" data-user="dafeizizhu" data-pen-title="算法动画详解 - 冒泡排序" class="codepen">See the Pen <a href="https://codepen.io/dafeizizhu/pen/OawEPj/">算法动画详解 - 冒泡排序</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### 性能分析

1. 时间复杂度：当原始序列“正序”时，冒泡排序总的比较次数为`n - 1`，移动次数为`0`，也就是说冒泡排序在最好情况下的时间复杂度为`O(n)`。当原始序列“逆序”时，冒泡排序总的比较次数为`n * (n - 1) / 2`，移动次数为`3 * n * (n - 1) / 2`次，也就是说冒泡排序在最坏情况下的时间复杂度为`O(n ^ 2)`。总的来说，冒泡排序的平均时间复杂度为`O(n ^ 2)`。

2. 空间复杂度：冒泡排序中需要一个临时变量进行两两交换，所需要的额外空间为`1`，因此空间复杂度为`O(1)`。

3. 稳定性：冒泡排序在排序过程中，相同元素的前后顺序没有改变，所以冒泡排序是一种稳定排序算法。

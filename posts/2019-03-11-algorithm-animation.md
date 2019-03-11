---
layout: post
title: "算法动画图解 - 堆排序"
description: ""
category: 
tags: [算法, JavaScript]
---

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 引用

1. [App Store 上的“算法动画图解”](https://itunes.apple.com/cn/app/%E7%AE%97%E6%B3%95%E5%8A%A8%E7%94%BB%E5%9B%BE%E8%A7%A3/id1047532631?mt=8)
2. [归并排序 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E5%BD%92%E5%B9%B6%E6%8E%92%E5%BA%8F#Javascript)
3. [“深入理解”—归并排序算法 - 冷血之心的博客 - CSDN博客](https://blog.csdn.net/qq_25827845/article/details/70994874)
4. [归并排序详解（MergeSort）递归和非递归实现 - 世上只有一种英雄主义 - CSDN博客](https://blog.csdn.net/lpjishu/article/details/51290930)
5. [图解排序算法(四)之归并排序 - dreamcatcher-cx - 博客园](https://www.cnblogs.com/chengxiao/p/6194356.html)

### 定义

> 归并排序（英语：Merge sort，或mergesort），是创建在归并操作上的一种有效的排序算法，效率为`O(nlogn)`。1945年由约翰·冯·诺伊曼首次提出。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用，且各层分治递归可以同时进行。

### 图解过程

![20190311-001](/images/20190311-001.jpg)

归并排序是数列排序的算法之一。首先，我们将数字分成两半：

![20190311-002](/images/20190311-002.jpg)

继续分成两半：

![20190311-003](/images/20190311-003.jpg)

接下来，我们将结合我们分割的每个组。合并时，按照数字的升序移动，使得合并后的数字在组内按升序排列：

![20190311-004](/images/20190311-004.jpg)

在图中，我们比较`4`和`3`：

![20190311-005](/images/20190311-005.jpg)

`4`大于`3`，所以移动`3`：

![20190311-006](/images/20190311-006.jpg)

如此类推，移动组内剩下的数字，完成两个组的合并：

![20190311-007](/images/20190311-007.jpg)

递归地重复组的合并操作，直到所有的数字都在一个组中：

![20190311-008](/images/20190311-008.jpg)

归并排序完成。

### JavaScript实现

递归法：

    function merge(left, right){
      var result = [];
      // 由于两个数组都是有序的，所以显著减少数字比较的次数
      while(left.length > 0 && right.length > 0){
        if(left[0] < right[0]){
          result.push(left.shift());
        }else{
          result.push(right.shift());
        }
      }
      return result.concat(left, right);
    }

    function mergeSort(arr){
      // 单个数字不能再分割
      if(arr.length <=1) return arr;
      // 从中间分割数组
      var middle = Math.floor(arr.length / 2);
      var left = arr.slice(0, middle);
      var right = arr.slice(middle);
      // 合并数组
      return merge(mergeSort(left), mergeSort(right));
    }

例子：

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="dafeizizhu" data-slug-hash="zbdWgR" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="算法动画详解 - 归并排序">
  <span>See the Pen <a href="https://codepen.io/dafeizizhu/pen/zbdWgR/">
  算法动画详解 - 归并排序</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

非递归法：

    // merge是一致的

    function mergeSort (arr){
			var n = arr.length
      // 步长 
			var s = 2
			var i
			var result = arr
			while (s <= n) {
				var temp = []
				i = 0
        // 按照步长分割数组，然后合并
				while (i + s <= n) {
					temp = temp.concat(merge(result.slice(i, i + s / 2), result.slice(i + s / 2, i + s)))
					i += s
				}
        // 合并余下的部分
				temp = temp.concat(result.slice(i, i + s / 2), result.slice(i + s / 2, n))
        // 步长加倍
				s *= 2
				result = temp
			}
      // 整个数组再合并一遍
			return merge(result.slice(0, s / 2), result.slice(s / 2, n))
		}

例子：

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="dafeizizhu" data-slug-hash="YgxLyb" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="算法动画详解 - 归并排序(非递归)">
  <span>See the Pen <a href="https://codepen.io/dafeizizhu/pen/YgxLyb/">
  算法动画详解 - 归并排序(非递归)</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

### 时间复杂度

时间复杂度分成两块：

1. 分割数组：跟节点数为数组长度的完全二叉树的深度相当，为`O(nlogn)`。
2. 合并数组：由于两个数组都是有序的，所以合并数组的时间复杂度跟数组长度相关，为`O(n)`。

所以归并排序的时间复杂度为`O(nlogn)`。

### 空间复杂度

合并数组需要一个跟数组长度等长的辅助空间，所以空间复杂度为`O(n)`。

### 稳定性

由于分割和合并的过程中没有改变等值元素之间的相对位置，所以归并排序是稳定的。

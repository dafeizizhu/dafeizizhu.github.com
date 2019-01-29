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
2. [堆排序 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E5%A0%86%E6%8E%92%E5%BA%8F)
3. [Max Heap implementation.](https://gist.github.com/primaryobjects/5b5ffd8dfcf658e04e7401d75199994b)
4. [堆排序的时间复杂度 | 天明](https://chihminh.github.io/2016/08/08/heap-sort/)
5. [排序算法的稳定性分析 - 简书](https://www.jianshu.com/p/9e855ba2b079)
6. [排序算法之 堆排序 及其时间复杂度和空间复杂度 - YuZhiHui_No1的专栏 - CSDN博客](https://blog.csdn.net/YuZhiHui_No1/article/details/44258297)

### 定义

> 堆排序（英语：Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆是一个近似完全二叉树的结构，并同时满足堆积的性质：即子节点的键值或索引总是小于（或者大于）它的父节点。

### 图解过程

![20190129-001](/images/20190129-001.jpg)

堆排序是数列排序的算法之一，其特点是利用堆的数据结构。首先，将所有的数字存储在堆中。按讲叙构建堆：

![20190129-002](/images/20190129-002.jpg)

所有的数字已存储在堆中。接下来，逐个取出存储在堆中的数字。降堆的一个特性是数据将被从大到小取出，将取出的数字按相反的顺序排列，数字将完成排序：

![20190129-003](/images/20190129-003.jpg)

直到将所有的数字取出：

![20190129-004](/images/20190129-004.jpg)

排序完成。

### 堆

上面使用了一个叫**堆**的数据结构。堆是一种树形结构，并在实现“优先队列”的时候使用。优先队列是一种数据结构，数据可以按任意顺序添加，相反，在取出数据时，首先选择最小值。

作为堆的一个规则，子类数字总是大于父类数字：

![20190129-005](/images/20190129-005.jpg)

我们尝试添加一个数字`5`到堆中：

![20190129-006](/images/20190129-006.jpg)

添加的数字将首先放在末尾：

![20190129-007](/images/20190129-007.jpg)

如果父类数字比较大，则子类和父类交换：

![20190129-008](/images/20190129-008.jpg)

重复此操作，直到不发生交换。而从堆中取出数字时，从最上面的数字取出：

![20190129-009](/images/20190129-009.jpg)

由于在顶部的数字被取出，我们需要重新组织堆的结构。将结尾的数字移动到顶部：

![20190129-010](/images/20190129-010.jpg)

当子类数字小于父类数字时，相邻子类数字中比较小的数字与父类数字交换：

![20190129-011](/images/20190129-011.jpg)

重复此操作，直到不发生替换：

![20190129-012](/images/20190129-012.jpg)

完成从堆中取出数字。

一个简单的堆的JavaScript实现：

    function Heap () {
      this._root = null
      this.push = function (v) {
        if (!this._root) {
          this._root = {
            val: v
          }
        } else {
          var current = this._root
          var fringe = []
          while (current) {
            if (!current.left || !current.right) {
              // 找到挂载的目标节点
              if (!current.left) {
                current.left = {
                  val: v,
                  parent: current
                }
              } else if (!current.right) {
                current.right = {
                  val: v,
                  parent: current
                }
              }
              
              // 插入的关键点，需要往上遍历整个堆，如果当前值比父值要大，则交换 
              while (current && ((current.left && current.val > current.left.val) || (current.right && current.val > current.right.val))) {
                var temp
                
                if (current.val > current.left.val) {
                  temp = current.left.val
                  current.left.val = current.val
                } else {
                  temp = current.right.val
                  current.right.val = current.val
                }
                current.val = temp
                current = current.parent
              }
              break
            } else {
              // 继续寻找挂载的目标节点
              fringe.push(current.left)
              fringe.push(current.right)
            }
            current = fringe.shift()
          }
        }
      }
      this.pop = function () {
        var last = this._root
        
        while (last.left || last.right) {
          if (last.right) {
            last = last.right
          } else {
            last = last.left
          }
        }
        
        // 取出当前根节点的值
        var val = this._root.val
        var lastVal = last.val
        
        if (last.parent) {
          if (last.parent.left === last) {
            delete last.parent.left
          } else if (last.parent.right === last) {
            delete last.parent.right
          }
        }
        
        // 用最后一个节点的值替换根节点的值
        this._root.val = lastVal
        
        var current = this._root
        
        // 取值的关键点，需要往下遍历整个堆，如果当前值比子节点的值要小，则交换
        while (current && ((current.left && current.val > current.left.val) || (current.right && current.val > current.right.val))) {
          var temp
          var min = Math.min(current.val, current.left ? current.left.val : current.right.val)
          if (min === current.left.val) {
            temp = current.left.val
            current.left.val = current.val
            current.val = temp
            current = current.left
          } else {
            temp = current.right.val
            current.right.val = current.val
            current.val = temp
            current = current.right
          }
        }
        
        return val
      }
    }

### JavaScript实现

在实现了堆这个数据结构之后，堆排序就很简单了，就是模拟一个过程：数字一个一个插入堆中，再一个一个取出，按照取出的顺序就能得到有序的数列：

    function heapSort(arr) {
      var heap = new Heap()
      for (var i = 0; i < arr.length; i++) {
        heap.push(arr[i])
      }
      for (var i = 0; i < arr.length; i++) {
        arr[i] = heap.pop()
      }
    } 

例子如下：

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="dafeizizhu" data-slug-hash="exdNyv" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="算法动画详解 - 堆排序">
  <span>See the Pen <a href="https://codepen.io/dafeizizhu/pen/exdNyv/">
  算法动画详解 - 堆排序</a> by MaiZhiying (<a href="https://codepen.io/dafeizizhu">@dafeizizhu</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

### 时间复杂度

堆排序主要由两个部分组成：

1. 建立堆
2. 取出根节点之后的堆调整

其中建立堆的时间复杂度是：`n`个节点的堆，树的高度`h=floor(log n)`。对于深度为`h - 1`层的节点，比较两次，交换一次，这一层最多有`2 ^ (h - 1)`个节点，总共操作次数为`3 * (12 ^ (h - 1))`；对于深度为`h - 2`层的节点，总共有`2 ^ (h - 2)`个节点，每个节点最多比较四次，交换两次，总共操作次数为`3 * (22 ^ (h - 2))`...如此类推，从最后一个节点到根节点进行调整的总共操作次数为：

    s = 3 * [2 ^ (h - 1) + 2 * 2 ^ (h - 2) + 3 * 2 ^ (h - 3) + … + h * 2 ^ 0]       // a
    2s = 3 * [2 ^ h + 2 * 2 ^ (h - 1) + 3 * 2 ^ (h - 2) + … + h * 2 ^ 1]           b
    // b-a，得到一个等比数列，根据等比数列求和公式
    s = 2s - s = 3 * [2 ^ h + 2 ^ (h - 1) + 2 ^ (h - 2) + … + 2 - h] = 3 * [2 ^ (h + 1) -  2 - h] ≈ 3*n

所以建立堆的时间复杂度是`O(n)`。

而堆调整的时间复杂度是：从堆调整的代码可以看作是当前节点与其子节点比较两次，交换一次。父节点与哪一个子节点进行交换，就对该子节点递归进行操作：

    T(k) = T(k - 1) + 3, k ∈ [2, h]
    T(1) = 3
    // 迭代法计算结果为
    T(h) = 3h = 3floor(log n)

所以调整堆的时间复杂度是`O(log n)`。`n`个节点需要调整`n`次，所以总的调整堆的时间复杂度是`O(nlog n)`。

综上所述，堆排序的时间复杂度是`O(nlog n + n) = O(nlog n)`。

### 空间复杂度

因为以数组形式实现的堆是原地排序，只需要一个变量进行交换操作，所以堆排序的空间复杂度为`O(1)`。

### 稳定性

堆排序的过程是从第`n / 2`开始和其子节点共3个值选择最大(大顶堆)或者最小(小顶堆),这3个元素之间的选择当然不会破坏稳定性。但当为`n / 2 - 1`, `n / 2 - 2`, ...这些父节点选择元素时，有可能第`n / 2`个父节点交换把后面一个元素交换过去了，而第`n / 2 - 1`个父节点把后面一个相同的元素没有交换，所以堆排序并不稳定。

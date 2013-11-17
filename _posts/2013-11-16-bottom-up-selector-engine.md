---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 从下到上的CSS选择器引擎"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

如果不想做之前的唯一性的过滤，那么从下到上的CSS选择器实现应该是一个比较好的替换方式。这种实现跟之前的实现最大的不同就是它是从最右边开始解析CSS选择器。举个例子，假如有这么一个CSS选择器`div span`，从下到上的实现会先查找出文档中所有的`span`，然后在这些`span`中过滤出祖先节点有`div`的一个集合，就是最后的结果。

这种先查出一个大集合再过滤的方式，优点就是代码实现起来比较简单，最明显的就是不用之前的唯一性判断。但是，代码简单带来的缺点就是扩展性比较差，而且当选择器比较复杂的时候局限性比较大。

这个实现首先根据选择器的最右的部分查出所有元素。然后的操作就是从右到左，根据每一个选择器在这个集合中过滤掉合适的部分即可：

    function find(selector, root){
      root = root || document;
      var parts = selector.split(" "),
      query = parts[parts.length - 1],
      rest = parts.slice(0,-1).join(""),
      elems = root.getElementsByTagName(query),
      results = [];
      for (var i = 0; i < elems.length; i++) {
        if (rest) {
          var parent = elems[i].parentNode;
          while (parent && parent.nodeName != rest) {
            parent = parent.parentNode;
          }
          if (parent) {
            results.push(elems[i]);
          }
        } else {
          results.push(elems[i]);
        }
      }
      return results;
    };

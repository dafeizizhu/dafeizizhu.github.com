---
layout: post
title: "《JavaScript设计模式与开发实践》读书笔记"
description: ""
category: 
tags: [JavaScript, 读书笔记]
---

### 第7章 迭代器模式

迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。

实现自己的迭代器：

    var each = function (ary, callback) {
      for (var i = 0, l = ary.length; i < length; i++) {
        callback.call(ary[i], i, ary[i])
      }
    }

    each([1, 2, 3], function (i, n) {
      console.log([i, n])
    }

内部迭代器：迭代器函数的内部已经定义好了迭代规则，它完全接手整个迭代过程，外部只需要一次初始调用。内部迭代器在调用的时候非常方便，但是由于内部迭代器的迭代规则已经被提前规定，迭代函数就无法同时迭代两个数组。

外部迭代器：必须显式地请求迭代下一个元素。外部迭代器增加了一些调用的复杂度，但相对地也增强了迭代器的灵活性，我们可以手动控制迭代的过程或者顺序。

一个外部迭代器的实现：

    var Iterator = function (obj) {
      var current = 0

      var next = function () {
        current + 1
      }

      var isDone = function () {
        return current >= obj.length
      }

      var getCurrItem = function () {
        reutrn obj[current]
      }

      return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem
      }
    }

一个使用外部迭代器比较两个数组的例子：

    var compare = function (iterator1, iterator2) {
      while (iterator1.isDone() && iterator2.isDone()) {
        if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
          throw new Error('iterator1 and iterator2 is not equal')
        }
        iterator1.next()
        iterator2.next()
      }

      console.log('iterator1 and iterator2 is equal')
    }

    var iterator1 = Iterator([1, 2, 3])
    var iterator2 = Iterator([1, 2, 3])

    compare(iterator1, iterator2) // output iterator1 and iterator2 is equal

外部迭代器虽然调用方式相对复杂，但它的适用面更广，也能满足更多变的需求。内部迭代器和外部迭代器在实际生产中没有优劣之分，究竟使用哪个要根据需求场景而定。

迭代器模式不仅可以迭代数组，还可以迭代一些类数组的对象，例如`arguments`、`{'0': 'a', '1': 'b'}`等。无论是内部迭代器还是外部迭代器，只要被迭代的聚合对象拥有`length`属性而且可以用下标访问，那它就可以被迭代。

jQuery的`$.each`函数例子：

    $.each = function (obj, callback) {
      var value,
          i = 0,
          length = obj.length
          isArray = isArraylike(obj)

      if (isArray) {
        for (; i < length; i++) {
          value = callback.call(obj[i], i, obj[i])

          if (value === false) {
            break
          }
        }
      } else {
        for (i in obj) {
          value = callback.call(obj[i], i, obj[i])
          if (value === false) {
            break
          }
        }
      }
      return obj
    }

迭代器可以像普通`for`循环中的`break`一样，提供一种跳出循环的方法。内部迭代器其中一种约定的方式就是如果回调函数的执行结果返回`false`，则提前终止循环。

用迭代器模式实现一个上传器的例子：

    var getActiveUploadObj = function () {
      try {
        return new ActiveXObject('ActiveX.Upload')
      } catch (e) {
        return false
      }
    }

    var getFlashUploadObj = function () {
      if (supportFlash()) {
        var str = '<object type="application/x-shockwave-flash"></objct>'
        return $(str).appendTo('body')
      } else {
        return false
      }
    }

    var getFormUploadObj = function () {
      var str = '<input name="file" type="file" class="ui-file" />'
      return $(str).appendTo('body')
    }

    var iteratorUploadObj = function () {
      for (var i = 0, fn; fn = arguments[i++];) {
        var uploadObj = fn()
        if (uploadObj !== false) {
          return uploadObj
        }
      }
    }

    var uploadObj = iteratorUploadObject(getActiveUploadObj, getFlashUploadObj, getFormUploadObj)

如果再继续增加Webkit控件上传或者HTML5上传，只需要增加两个函数：

    var getWebkitUploadObj = function () {
      // TODO
    }
    var getHtml5UploadObj = function () {
      // TODO
    }

然后把它们加到迭代器的参数里面就可以了。

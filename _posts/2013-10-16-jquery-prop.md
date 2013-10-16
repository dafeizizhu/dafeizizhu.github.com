---
layout: post
title: "jQuery扫盲之prop"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

与昨天介绍的`attr`一样，`prop`也是个getter、setter一体的方法。

###getter
____

> Get the value of a property for the first element in the set of matched elements.

作为getter的`prop`方法接受一个参数`propertyName`，就是要获取的属性名字。和`attr`一样，它也只会获取jQuery对象中第一个元素的属性值。

那`prop`跟`attr`有什么区别呢？在jQuery 1.6之前，`attr`有时候会获取到属性值而不是特性值，这样会导致一些不一致的场景。例如：

    $(elem).attr("checked"); // 1.6 return true or false

所以，在1.6之后，`prop`返回的是属性值，`attr`返回的是特性值：

    $(elem).attr("checked"); // as of 1.6 return "checked" or null

其中，`selectedIndex`、`tagName`、`nodeName`、`nodeType`、`ownerDocument`、`defaultChecked`和`defaultSelected`应该使用`prop`去获取它们的值，因为它们是DOM的属性，在DOM上也没有对应的特性。

而有相同名称的特性的属性，使用这两个方法获取有什么区别呢？下面以`checked`这个特性为例：

    elem.checked; // true or false
    $(elem).prop("checked"); // true or false
    elem.getAttribute("checked"); // "checked" or null
	$(elem).attr("checked"); // "checked" or null

为什么这两个方法获取的值会不一样，就是因为`checked`特性跟`checked`属性的值是没有关联在一起的。`checked`特性不会随着`input`的状态而更改，它表示的是`input`标签上的`checked=“checked”`的值。所以，判断一个`input`是否被选中，不能通过`attr`去判断，而应该要用`prop`。

<iframe width="100%" height="300" src="http://jsfiddle.net/q4ehm/2/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

同样也适用于`selected`或者`value`等。

###setter
____

> Set one or more properties for the set of matched elements.

使用方法跟`attr`完全一致，只是`prop`是设置属性值而已。上述需要用`prop`获取的属性在1.6之后也只能用`prop`去设置其值。

修改属性可以影响DOM的表现行为，而对应名字的特性则不会发生改变。所以，我们在设置一个checkbox被选中，或者禁用一个input的时候应该这么写：

    $( "input" ).prop( "disabled", false );
    $( "input" ).prop( "checked", true );

###removeProp()
____

> Remove a property for the set of matched elements.

像`attr`一样，我们也可以调用`removeProp`去删除一个属性。该方法接受一个参数，就是要删除的属性的名字。

当我们尝试去删除某些浏览器内建的属性，某些浏览器可以会抛出异常。jQuery会先把这先属性的值设为`undefined`，而且忽略所有错误。其实，这个方法只是用来删除自定义的属性，浏览器内建的属性是没必要去删除的。

还有一个比较坑的，就是**不要删除类似`checked`、`disabled`或者`selected`的属性**。一旦删除，则不能再重新加上了，也意味着之后的代码无法再根据其属性判断DOM的状态：

<iframe width="100%" height="300" src="http://jsfiddle.net/KDEmb/1/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

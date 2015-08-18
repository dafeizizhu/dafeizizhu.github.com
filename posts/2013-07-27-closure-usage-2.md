---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 闭包（二）"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

今天接着分享JavaScript闭包的作用。

###Memorize

在一些需要频繁调用执行效率又比较低的方法可以使用Memorize这个方法，记录每次调用后的结果，下次传入相同的参数就可以直接返回缓存的结果，不需要重新再次执行其逻辑，提高执行效率。书中实现这个Memorize的代码如下：

    Function.prototype.memoized = function(key){
      this._values = this._values || {};
      return this._values[key] !== undefined ?
        this._values[key] :
        this._values[key] = this.apply(this, arguments);
      };
    Function.prototype.memoize = function(){
      var fn = this;                        
      return function(){                           
        return fn.memoized.apply( fn, arguments );
      };
    };

在`memoize`这个方法里面，使用闭包记录原始方法，在返回的新方法中让原来的方法附加上Memorize的特性。这样封装了Memorize的具体实现，而且使用起来非常方便，甚至可以为一个匿名方法添加Memorize的功能，如：

    var func = (function (n) { ... }).memoize();

上述的例子`func`就有了Memorize的功能。

###Function Wrapping

在写与跨浏览器相关代码的时候，由于不同的浏览器对于特定功能也有不同的实现，经常会写出下面的这种daima :

    function func () {
      if (/** is ie  **/) {
        /** do something only in IE **/
      }
      
      if (/** is Opera **/) {
        /** do something only in Opera **/
      }
    }

无疑太丑陋了！这时可以使用Function Wrapping来为某种浏览器来做特殊处理。书中的代码如下：

    function wrap(object, method, wrapper) {  
      var fn = object[method];              
      return object[method] = function() {         
        return wrapper.apply(this, [fn.bind(this)].concat(
          Array.prototype.slice.call(arguments)));
      };
    }

这里闭包的作用也是记录原始的方法，然后重新为对象上的方法赋值，第一个参数传入原始的参数，以便在重写的方法里面可以调用原始方法的逻辑，有点像装饰模式。通过这中方式把屏蔽浏览器差异相关的代码提取出来，提高代码的可维护性。

要跟妹纸看电影啦！明天继续！



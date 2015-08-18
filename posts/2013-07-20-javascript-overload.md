---
layout: post
title: "Secrets of the JavaScript Ninja 读书笔记之 JavaScript重载"
description: ""
category: 
tags: [JavaScript]
---
{% include JB/setup %}

今天来点轻松的，分享一个之前的读书笔记。我们知道，JavaScript是不支持重载的。后面定义的重名函数，无论参数的个数是否一样，都会把前面已经定义的重名函数给覆盖掉。要想实现类似Java中的重载机制，一般只能把所有的逻辑都写在同一个函数里，类似这样：

    var ninja = {
        whatever: function() {
            switch (arguments.length) {
            case 0:
                /* do something */
                break;
            case 1:
                /* do something else */
                break;
            case 2:
                /* do yet something else */
                break;
            //and so on ...
            }
        }
    }

根据`arguments.length`这个属性，可以判断当前调用这个函数的时候传入了多少个参数，根据参数的个数判断应该执行什么逻辑。这种方式虽然简单，但是如果以后扩展的时候需要再增加一个重载的逻辑，就需要增加一个`case`分支，这样是违背了开放封闭原则的，提高了维护的成本（估计大家也不想看到铺天盖地的`case`）。

为了解决这个问题，我们尝试使用一种新的思路去分析。首先，需要提供自定义的重载机制，例如：

    var ninja = {};
    addMethod(ninja,'whatever',function(){ /* do something */ });
    addMethod(ninja,'whatever',function(a){ /* do something else */ });
    addMethod(ninja,'whatever',function(a,b){ /* yet something else */ });

其中`addMethod`接受三个参数：

1. 一个对象，对象上有需要重载的方法。

2. 这个对象上需要重载的方法名。

3. 重载方法。**注意，这里的重载方法声明时的参数个数必须与之前定义过的重载方法的参数个数不一样。**

调用的时候，我们可以通过传入的参数个数不同而调用不同的重载方法。实现上面的机制使用了一个非常巧妙的方式：

    function addMethod(object, name, fn) {
        var old = object[name];                  
        object[name] = function(){              
            if (fn.length == arguments.length)       
                return fn.apply(this, arguments)       
            else if (typeof old == 'function')      
                return old.apply(this, arguments);    
        };
    }

上面的实现使用了`fn.length`这个属性。这个属性表示的是方法定义的形参的个数。通过判断形参的个数来决定调用哪个重载的方法。其中最巧妙的地方就是使用了一个闭包，把上一个重载方法记录下来。如果这次调用时传入的参数的个数刚好等于最后一个定义的重载方法的形参个数，就直接调用这个重载方法，否则就调用上一个重载方法。这样，每加入一个重载方法，都会按照同样的逻辑进行调用，当参数个数匹配的时候就会调用相应的重载方法。实在是太妙了！

下面是书中的例子，我把它放到JSFiddle里面，可以[参考这里](http://jsfiddle.net/d5yRU/)。

虽然这种重载只能根据参数的个数进行重载，不能完全实现像Java一样的可以根据参数类型进行重载的机制，但是也是JavaScript向着完整面向对象程序设计伟大的一步。这种机制提供了一个强大的工具让我们继续重构、继续优化现有的代码。

这种重载方式会带来额外的性能开销，如果对性能的要求非常高的场景还是慎用。但是，这种重载方式提高了代码的可维护性，在可以使用的地方就尽管大胆的用吧！

看完了这个JavaScript重载，深深感觉到JavaScript中的闭包、函数是多么的灵活，也感叹于作者对于JavaScript这些特性的深入理解。最后再次强烈推荐这本jQuery之父，Jhon Resig编写的《Secrets of the JavaScript Ninja》。

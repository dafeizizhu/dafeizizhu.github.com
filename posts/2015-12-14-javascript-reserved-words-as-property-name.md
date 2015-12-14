---
layout: post
title: "JavaScript保留字作为属性名可以么"
description: ""
category: 
tags: [JavaScript]
---

最近几天受了fis的影响在折腾自己的解决方案，使用browserify作为模块化框架。一开始挺开心的，模块间依赖、构建、监视文件变化自动构建等等基础功能都打通了，还做了几个demo玩玩，挺好。心血来潮把这些demo放到IE7、IE8来运行，结果好几个地方报了错：

    Expected identifier

貌似是语法问题啊，不会吧，browserify首页明明声称自己是支持IE7以上的呀！打开开发者工具，单击报错的js行，也没看出来有什么问题啊！在Chrome和IE9上明明是好的啊！跟代码应该没关系吧o(╯□╰)o。

不管三七二十一，把demo页面的代码都删掉，只包含browserify打包出来的`bundle.js`，发现还是报错，只是报错的地方少了一个！证明源码跟demo代码里面有一个共同的错误！看着Sublime上面的一个方法名`do`有语法高亮耶，默默地把它改成`doFunc`，构建，竟然不报错了！

赶紧Google了一下，果然，在IE7、IE8上是不支持用保留字作为对象的属性名的：[http://kangax.github.io/compat-table/es5/](http://kangax.github.io/compat-table/es5/)。

记得在Flash里面也有类似的约束，例如`stop`不能作为暴露给js的接口名等等。在这里列一下JavaScript的关键字和保留字吧，记得不要再用它们作为对象的属性名了哦。

关键字有：

1. `break`
2. `do`
3. `instanceof`
4. `typeof`
5. `case`
6. `else`
7. `new`
8. `var`
9. `catch`
10. `finally`
11. `return`
12. `void`
13. `continue`
14. `for`
15. `switch`
16. `while`
17. `debugger`
18. `if`
19. `throw`
20. `delete`
21. `in`
22. `try`

保留字有：

1. `class`
2. `enum`
3. `extends`
4. `super`
5. `const`
6. `export`
7. `import`

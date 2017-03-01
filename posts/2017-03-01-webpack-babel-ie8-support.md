---
layout: post
title: "让Webpack+Babel支持IE8"
description: ""
category: 
tags: [前端]
---

### 引用

1. [命名函数表达式探秘](http://www.jb51.net/onlineread/named-function-expressions-demystified/#jscript-bugs)
2. [babel-plugin-transform-es2015-ie8-classes](https://www.npmjs.com/package/babel-plugin-transform-es2015-ie8-classes)
3. [阿里巴巴国际UED团队 react 项目的一个ie8兼容性问题](http://www.aliued.com/?p=3240)
4. [sorrycc/es3ify-loader: ES3ify loader for webpack.](https://github.com/sorrycc/es3ify-loader)
5. [cli](http://webpack.github.io/docs/cli.html#production-shortcut-p)
6. [optimization · webpack/docs Wiki](https://github.com/webpack/docs/wiki/optimization)
7. [list of plugins](http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin)

最近又在折腾开发环境，想用Babel来写ES6的代码，配合Webpack达到代码复用、模块化开发的效果。思路是在开发环境的最外层写一个基础的webpack.base.config.js，来规定构建的一些基础参数，例如：

    module.exports = {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015-loose']
        }
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192'
      }]
    }

**注：Webpack2是不支持IE8的，so……**

在子项目中，编写独立的webpack.config.js，使用`webpack-merge`来实现合并配置：

    var merge = require('webpack-merge')
    var webpackBaseConfig = require('path/to/webpack.base.config')
    module.exports = merge(webpackBaseConfig, {
      // 子项目中的独立配置，例如自己的entry、output、plgusins等
    }

在最外层编写构建脚本：

    $ webpack --config path/to/child-app/webpack.config.js

这样就可以独立构建一个子项目。还可以编写一个构建脚本，使用webpack的node api进行构建，实现批量构建等功能。

思路大概是这样，基于现有产品的要求，需要支持到IE8即可。本来想IE8应该问题不大，但是Orz……

### 坑1

在开发过程中，理所当然的使用`webpack -d`来构建开发版本。理所当然的报错：

    SCRIPT1028: 缺少标识符、字符串或数字

点击对应的脚本文件的地址，报错的代码如下：

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

这是由于`default`在IE8（ES3）中是保留字，不能直接出现在代码中。像上面这种代码，应该这么写才能在IE8上正确运行：

    return obj && obj.__esModule ? obj : { 'default': obj };

幸好这个工作已经有一个webpack-loader实现了，就是[es3ify-loader](https://www.npmjs.com/package/es3ify-loader)：

    // webpack.base.config.js
    module.exports = {
      loaders: [{
        test: /\.js$/,
        loader: 'es3ify-loader'
      }, {
        ...
      }
    }

这个loader会帮我们把代码里面ES3的保留字、关键字使用字符串的形式引用，这样在IE8上面就不会报错了。构建后在IE8上运行正常。

### 坑2

开心，开发环境的构建解决了之后，构建一个正式环境的版本试试看。满心欢喜使用`webpack -p`构建了之后，妈个鸡IE8又特么报错了：

    SCRIPT1028: 缺少标识符、字符串或数字

妈呀，怎么又来了！来来来，看看构建后的代码，这胡汉三怎么又变回来了：

    ...;function r(e){return e&&e.__esModule?e:{default:e}};...

为啥default的括号又不见了？？？？？？？？？？

肯定是`-p`搞的鬼，只能上Webpack的文档看看`-p`是搞得啥：

> Equals to --optimize-minimize --optimize-occurrence-order

后面是选项是优化模块的Id，减小文件体积，跟我们的问题关系不大。主要是第一个选项：

> --optimize-minimize resp. new webpack.optimize.UglifyJsPlugin()

这个选项相当于使用了UglifyJs来压缩源码。使用`-p`，意味着使用默认的参数来进行压缩、混淆。默认选项中：

    output: {
      keep_quoted_props: false, // 是否保留对象字面量中的引号。
    }

这个选项是`false`，所以`default`的引号自然就被去掉了。因此，如果我们需要保留这个引号，需要自己编写webpack.config.js中的plugins配置，不能使用`-p`来构建：

    // webpack.base.config.js
    module.exports = {
      ...
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          output: {
            keep_quited_props: true
          }
        })
      ]
    }

这样构建出来的代码，对象字面量的引号就不会被省略了。

### 坑3

直接使用`webpack --config /path/to/child-app/webpack.config.js`来构建，再运行，特喵的还是报错：

    SCRIPT1010: 缺少标识符

再不厌其烦地点进去看看：

    ...;function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}var a=n(1),i=r(a);new i.default};...

看到对象字面量的引号是在了，但是原来`new i["default"]`变成了`new i.default`……妈呀，这还是使用了`default`这个关键字呀！还得看看UglifyJs的文档：

    compress: {
      properties: true,       // 是否将常量属性名转为调用表达式。如 a["foo"] → a.foo。
    }

默认是`true`……在UglifyJs插件中把它改成`false`：

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        properties: false
      }
      ...
    })

这样构建出来的代码就不会把常量属性名转成调用表达式了。

### 坑4

再构建呗，果然还是报错了：

    SCRIPT5007: 无法设置未定义或 null 引用的属性“Symbol(Symbol.hasInstance)_7.gp8rp7en44w”

啥玩意？？？？？？

这次学乖了，在output的配置加上：

    output: {
      beautify: true,
      comments: true,
      ...
    }

这样构建出来的代码就会有正常的空格和断句，注释也会保留，方便我们查看出问题的地方是webpack的哪个模块。

再次构建，报错，点过去看看，还是看不懂……我们需要把变量名的混淆关掉：

    new webpack.optimize.UglifyJsPlugin({
      ...
      mangle: false,
      ...
    })

这样构建出来的代码，变量、方法、函数的名字就不会被混淆了。

再次构建，我的天，竟然不报错了！啥玩意？？？？问题肯定是出在`mangle`上了。看看`mangle`的[默认选项](https://github.com/mishoo/UglifyJS2/blob/master/lib/scope.js#L366)：

    AST_Toplevel.DEFMETHOD("_default_mangler_options", function(options){
      return defaults(options, {
        except      : [],
        eval        : false,
        sort        : false, // Ignored. Flag retained for backwards compatibility.
        toplevel    : false,
        screw_ie8   : true,
        keep_fnames : false
      });
    });

其中有个`screw_ie8`的选项，默认为`true`。是啥意思呢？把支持IE8的代码删掉！删掉！删掉！默默地把它改成`false`……

### 坑5

再次构建，没用！你敢信。还是老老实实对比`mangle: false`的代码看看问题在哪吧。报错的那段代码在没混淆的版本中大概是这样的：

    ...
    }, $defineProperty = function(it, key, D) {
      return it === ObjectProto && $defineProperty(OPSymbols, key, D), anObject(it), key = toPrimitive(key, !0), 
      anObject(D), has(AllSymbols, key) ? (D.enumerable ? (has(it, HIDDEN) && it[HIDDEN][key] && (it[HIDDEN][key] = !1), 
      D = _create(D, {
        enumerable: createDesc(0, !1)
      })) : (has(it, HIDDEN) || dP(it, HIDDEN, createDesc(1, {})), it[HIDDEN][key] = !0), 
      setSymbolDesc(it, key, D)) : dP(it, key, D);
    }, $defineProperties = function(it, P) {
    ...

貌似跟Babel Polyfill的`Object.defineProperty`有关。在IE8上面，`Object.defineProperty`只能应用在DOM对象上面。在Polyfill中的实现我们可以找到这样的代码：

    /* 12 */
    /***/
    function(module, exports, __webpack_require__) {
      var anObject = __webpack_require__(13), IE8_DOM_DEFINE = __webpack_require__(15), toPrimitive = __webpack_require__(17), dP = Object.defineProperty;
      exports.f = __webpack_require__(7) ? Object.defineProperty : function(O, P, Attributes) {
        if (anObject(O), P = toPrimitive(P, !0), anObject(Attributes), IE8_DOM_DEFINE) try {
          return dP(O, P, Attributes);
        } catch (e) {}
        if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported!");
        return "value" in Attributes && (O[P] = Attributes.value), O;
      };
    }

在IE8中，起作用的是最后一行代码：

    return "value" in Attributes && (O[P] = Attributes.value), O;

直接给对象的一个属性赋值的方式模拟`Object.defineProperty`。这时候再根据模块的ID（12）找到对应混淆版本的代码：

    /* 12 */
    /***/
    function(e, t, n) {
      var r = n(13), a = n(15), i = n(17), s = Object.defineProperty;
      t.f = n(7) ? Object.defineProperty : function(e, t, n) {
        if (r(e), t = i(t, !0), r(n), a) try {
          return s(e, t, n);
        } catch (e) {}
        if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");
        return "value" in n && (e[t] = n.value), e;
      };
    }

注意到混淆后的代码用了两次`e`，第一次是代替了`module`，第二次是`catch`中的`e`。在IE8中，在普通对象上调用`Object.defineProperty`是会报错的，所以代码会进入`catch`中。这时候，`e`就会变成错误对象，而不是原来的`module`，导致后面判断`it[HIDDEN][key]`的时候报错，`it[HIDDEN]`是`null`。

`mangle`里面还有个选项，可以对某些变量不进行混淆，果断加上`e`：

    mangle: {
      screw_ie8: false,
      except: ['e']
    }

### 坑6

再次构建，运行，报错：

    SCRIPT5022: 引发了异常但未捕获

好消息是终于不是那个错误了。日常点进去源码里面看看：

    if (!(t instanceof n)) throw new TypeError("Cannot call a class as a function");

打断点调试，最蹊跷的东西发生了。`t`是`[object(d)]`，`n`是`function d() {...}`，`t.constructor`是`function d() {...}`，打印出来的东西跟`n`一模一样，但是！`t.constructor == n`竟然是`false`！导致`t instanceof n`也是`false`……

在没有混淆的版本上打断点调试：

    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");

妈个鸡这里竟然是`true`！

为啥呢？只能比较一下上一层堆栈的代码：

    // mangle
    t.__esModule = !0, n(2);
    var i = n(299), s = r(i), o = function u() {
      a(this, u), console.log("initialize an Mp4Playback instance, new"), console.log("now is", (0, 
      s["default"])());
    };
    t["default"] = o;

    // no-mangle
    exports.__esModule = !0, __webpack_require__(2);
    var _moment = __webpack_require__(299), _moment2 = _interopRequireDefault(_moment), Mp4Playback = function Mp4Playback() {
      _classCallCheck(this, Mp4Playback), console.log("initialize an Mp4Playback instance, new"), 
      console.log("now is", (0, _moment2["default"])());
    };
    exports["default"] = Mp4Playback;

注意到有一个函数表达式：

    // mangle
    var o = function u() {}
    // no-mangle
    var Mp4Playback = function Mp4Playback() {}

这里函数表达式和函数声明混用了。问题是，混淆的版本表达式的变量名和声明的函数名不一样！以下实验代码：

    var A = function B(){
      alert(this instanceof B);
    };
    var a = new A();

在IE8+以及Chrome等现代浏览器，结果都是`true`。但是在IE8下面，就是`false`，因为IE8 中对命名函数表达式的实现不标准，函数内部不能访问命名函数的名称，导致`instanceof`失效抛出异常。而没混淆的版本保留了一致的名称，`instanceof`的结果为`true`。

这怎么解决呢？应该编写一个webpack的插件，判断是否出现这种情况，如果出现了使用一个一致的名称来替代这个函数表达式和函数声明。幸运的是，只要在`class`中编写一个方法：

    class A {
      constructor() {}
      foo() {}
    }

出来的代码就会变成（混淆后）：

    var u = function() {
      function t() {
        i(this, t), console.log("initialize an Mp4Playback instance, new"), console.log("now is", (0, 
        o["default"])());
      }
      return t.prototype.foo = function() {
        console.log("foo");
      }, t;
    }()

经过Babel出来的代码没有使用函数表达式和函数声明的混合写法，只使用了函数声明，顺利通过`instanceof`检测。把`beautify`和`comments`去掉，最后构建一把，呀，终于成功了！

### 总结

虽然Webpack2已经不支持IE8，说明需要支持IE8的时代也差不多要过去了。通过这次兼容性的研究，也了解了很多关于Babel构建后的代码，例如`class`，Babel Polyfill的代码，例如`Object.defineProperty`的模拟等等，最后也成功在IE8上面把Demo跑起来了，不错！

附上对应的依赖版本信息：

    "devDependencies": {
      "babel-core": "^6.21.0",
      "babel-loader": "^6.2.10",
      "babel-polyfill": "^6.20.0",
      "babel-preset-es2015": "^6.18.0",
      "babel-preset-es2015-loose": "^8.0.0",
      "css-loader": "^0.26.1",
      "es3ify-loader": "^0.2.0",
      "html-webpack-plugin": "^2.26.0",
      "style-loader": "^0.13.1",
      "url-loader": "^0.5.7",
      "webpack": "^1.14.0",
      "webpack-merge": "^2.4.0"
    }

---
layout: post
title: "Taf nodejs重构（1） - stream"
description: ""
category: 
tags: [node, taf]
---

### 引用

1. [Tencent/Tars: Tars is a highly performance rpc framework based on naming service using tars protocol and provides a semi-automatic operation platform.](https://github.com/Tencent/Tars)

### 类型

参考Tars的代码进行重构。在Tars中，数据类型大致可以分成两类：

1. 基础类型，例如`Int32`、`String`等。这些类型在Tars中没有对应的包装类，只是包装了具体的读写方法。
2. 复杂类型，例如`Map`、`List`、`Struct`等。这些类型具有对应的包装类，使用包装类的方法从流中读入实例或者写入流中。

考虑到API的统一问题，重构统一把所有数据类型都使用包装类进行封装：

1. `TBase`, 基础包装类，所有包装类都继承这个类。
1. `TZero`，零包装类。
1. `TInt8`，8位整数包装类，对应`byte`或者`char`。
1. `TInt16`，16位整数包装类，对应`short`。
1. `TInt32`，32位整数包装类，对应`int`。
1. `TInt64`，64位整数包装类，对应`long`或者`long long`。
1. `TUInt8`，8位无符号整数包装类，对应`unsigned byte`或者`unsigned char`。
1. `TUInt16，16位无符号整数包装类，对应`unsigned short`。
1. `TUInt32`，32位无符号整数包装类，对应`unsigned int`。
1. `TFloat`，浮点数包装类，对应`float`。
1. `TDouble`，双精度浮点数包装类，对应`double`。
1. `TString`，字符串包装类，对应`string`。
1. `TBool`，布尔值包装类。
1. `TList`，列表包装类。
1. `TMap`，键值对包装类。
1. `TStruct`，结构包装类。在taf文件中定义的结构都继承这个类。
1. `TBytes`，二进制数据包装类，对应`vector<byte>`或者`vector<char>`。

这样重构后，流需要提供的接口就可以精简为：

    // TInputStream.js
    class TInputStream {
      // 跳到对应的tag，参考tars的实现
      skipToTag (tag, isRequire) {}
      // 跳到结构尾，提供给TStruct使用
      skipToStructEnd () {}
      // 读取当前的头信息，包括typeId和tag，提供给TBase及其子类使用
      readHead () {}
      // 读取一个TBase子类（T）
      readTBase (tag, isRequire, T, defaultValue) {}
    }

    // TOutputStream.js
    class TOutputStream {
      // 获取对应的Buffer对象
      get buffer () {}
      // 设置流的长度，用以网络分包
      setHeaderLength (value) {}
      // 写入一个头信息，包括typeId和tag，提供给TBase及其子类使用
      writeHead (typeId, tag) {}
      // 写入一个TBase子类（T），如果value不是TBase的子类则会使用T进行包装
      writeTBase (tag, value, T) {}
    }

这样，所有类型都可以通过统一的API写入到流中，或者从流中读入对应的实例。

### 复杂类型

Tars的实现中，复杂类型是通过一个工厂来实现的，大致思路如下：

    class HeroList {
      constructor (proto) {
        this._proto = proto
      }
    }

    Tars.List = function (proto) { return new HeroList(proto) }

严格来说，`Tars.List`并不是一个构造函数。通过tars2node生成的js代码，初始化一个`List`的实例是这样的：

    this.list = new Tars.List(Tars.Int32)

这样写不会报错，但是这个`new`在这里是没用的，如果把上面`Tars.List`改成另外一种写法：

    Tars.List = proto => new HeroList(proto)

这样执行生成的js代码就会报错了，因为`Tars.List`不是一个构造函数。

想要避免这种有点混淆的代码，重构的时候把`TList`和`TMap`这两个复合的数据类型都变成一个工厂函数：

    // t-list.js
    module.exports = T => {
      class TList extends TBase {
        // T is avaliable
      }
      return TList
    }

    // t-map.js
    module.exports = (KeyT, ValueT) => {
      class TMap extends TBase {
        // KeyT, ValueT is avaliable
      }
      return TMap
    }

业务代码或者taf2node生成的代码就需要这样初始化一个TList或者TMap：

    this._t_list = new (TList(TInt32))()
    this._t_map = new (TMap(TString, TInt32))()

虽然加了括号，但是这样的话就比原来的那种调用方式要清晰，这包含了两步操作：

1. 构造一个数据类型是TInt32的TList类型。
2. 使用`new`初始化一个对应的TList类型的实例。

### 读写流

在TBase中定义了相关的读写流的方法：

    class TBase {
      // 获取这个数据类型的typeId
      static get TYPE_ID () {}
      // 定义这个数据类型被跳过时对流或者数据的操作
      static skipField (is, tBuffer) {}
      // 根据tag的值从流中读取一个实例
      static read (is, tag, isRequire, defaultValue) {}
      // 当数据类型需要判断头信息时，重写这个方法，例如整型的自适应降级的操作
      static readWithHead (is, head) {}
      // 直接从流中读取一个实例（头信息已被读取），子类必须重写这个方法
      static readFrom (is, tBuffer) {}
      // 根据tag的值把这个实例写入到流中
      write (os, tag) {}
      // 直接把实例写入到流中（头信息已写入），子类必须重写这个方法
      writeTo (os, tBuffer) {}
    }

这样定义后，流中的读写方法就会变得十分简单，使用者可以根据喜好调用，例如读：

    let is = new TInputStream(tBuffer)
    let t = TString.read(is, 0, true, '')

等同于：

    let is = new TInputStream(tBuffer)
    let t = is.readTBase(0, true, TString, '')

写：

    let os = new TOutputStream()
    new TString('foo').write(os, 0)

等同于：

    let os = new TOutputStream()
    os.writeTBase(0, 'foo', TString)

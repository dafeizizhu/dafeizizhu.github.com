---
layout: post
title: "JavaScript处理二进制入门"
description: ""
category: 
tags: [JavaScript]
---

### 引用

1. [ArrayBuffer - ECMAScript 6入门](https://es6.ruanyifeng.com/#docs/arraybuffer#%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0%E7%BB%84%E7%9A%84%E5%BA%94%E7%94%A8)
2. [ArrayBuffer - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
3. [TypedArray - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
4. [DataView - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView)
5. [怎么理解JavaScript中的ArrayBuffer？ - 知乎](https://www.zhihu.com/question/30401979)

### 前提

> 这个接口的原始设计目的，与 WebGL 项目有关。所谓 WebGL，就是指浏览器与显卡之间的通信接口，为了满足 JavaScript 与显卡之间大量的、实时的数据交换，它们之间的数据通信必须是二进制的，而不能是传统的文本格式。文本格式传递一个 32 位整数，两端的 JavaScript 脚本与显卡都要进行格式转化，将非常耗时。这时要是存在一种机制，可以像 C 语言那样，直接操作字节，将 4 个字节的 32 位整数，以二进制形式原封不动地送入显卡，脚本的性能就会大幅提升。

如今操作二进制的场景在前端（浏览器）已经十分普遍了，例如处理`WebSocket`、`fetch()`、`XMLHttpRequest`接收到的数据，`canvas`中的数据，本地文件处理等。

### 结构

浏览器处理二进制的类的结构大概如下：

![20190320-001](/images/20190320-001.jpg)

其中：

1. `ArrayBuffer`：代表内存中的一段二进制数据。
2. `TypedArray`：二进制数据的视图，视图中的每一项都是固定的长度，例如`Int8Array`一项占1个字节，`Int16Array`一项占2个字节，如此类推。
3. `DataView`：复合类型的视图，根据需要从二进制数据中取出不定长的值。

### `ArrayBuffer`

> `ArrayBuffer`对象用来表示通用的，固定长度的原始二进制数据缓冲区。`ArrayBuffer`不能直接操作，而是要通过`TypedArray`或者`DataView`对象来操作。

由于`ArrayBuffer`不能直接读写，所以提供的属性和方法都比较少，其中属性有：

1. `byteLength`：对象占据的字节大小。在初始化对象的时候确定，是一个只读属性。

方法有：

1. `ArrayBuffer(byteLength)`：初始化一个长度为`byteLength`的二进制数据缓冲区。
2. `slice(begin[, end])`：从`begin`开始，到`end`（可选参数，默认到原缓冲区的末尾），截取出一个新的`ArrayBuffer`对象。

值得注意的是，方括号运算符是无法作用于`ArrayBuffer`对象的，例如：

    var a = new ArrayBuffer(3)
    console.info(a)     // ArrayBuffer(3) {}
    console.info(a[0])  // undefined
    a[0] = 2
    console.info(a)     // ArrayBuffer(3) {0: 2}

使用方括号只是在原来的对象上加入了一个键为`0`的值，对二进制缓冲区内的数据并没有影响。

### `TypedArray`

同一段内存，使用不同的数据格式去读会产生不同的数据。例如一段`0xffff`，以8位无符号整数进行读取，得到`[15, 15, 15, 15]`；如果以16位无符号整数进行读取，得到`[255, 255]`。不同数据有不同的解读方式，就叫做“视图”。`TypedArray`就是其中一种视图，其中的数组成员都是同一个数据类型。

在浏览器中，并没有提供`TypedArray`这个类，而是提供了基于`TypedArray`的9种视图：

1. `Int8Array`：8位有符号整数，每项的长度为1个字节。
1. `Uint8Array`：8位无符号整数，每项的长度为1个字节。
1. `Int16Array`：16位有符号整数，每项的长度为2个字节。
1. `Uint16Array`：16位有符号整数，每项的长度为2个字节。
1. `Int32Array`：32位有符号整数，每项的长度为4个字节。
1. `Uint32Array`：32位无符号整数，每项的长度为4个字节。
1. `Float32Array`：32位浮点数，每项的长度为4个字节。
1. `Float64Array`：64位浮点数，每项的长度为8个字节。
1. `Uint8ClampedArray`：8位有符号整数，每项的长度为1个字节，溢出处理与`Uint8Array`不同。

上面的视图很像普通数组，包含大部分数组的方法（`concat()`除外），都有`length`属性，都能用方括号运算符获取单个元素。普通数组和`TypedArray`对象的差异主要是以下方面：

1. `TypedArray`对象的所有成员都是同一个类型，尝试设置非法值（例如字符串且不是数字）都会转成`0`。
2. `TypedArray`对象是连续的，不会有空位，默认值为`0`。
3. `TypedArray`对象只是一层视图，本身不存储数据，它的数据都存储在底层的`ArrayBuffer`对象中。

构造函数有：

1. `TypedArray(buffer[, byteOffset[, length]])`：在`ArrayBuffer`对象`buffer`上，视图的范围从`begin`（默认为`0`）开始包含`length`（默认到`buffer`的最末端）。
2. `TypedArray(length)`：直接分配大小为`length`个字节的内存空间，在其上生成视图。
3. `TypedArray(typedArray)`：复制`typedArray`的内存，在其上生成视图。
4. `TypedArray(arrayLikeObject)`：复制一个普通数组`arrayLikeObject`的内存，在其上生成视图。

注意，除了第一种构造函数生成的视图是共享`buffer`之外，其他构造函数都是复制出新的内存空间，`buffer`不共享。

属性有：

1. `buffer`：返回内存区域对应的`ArrayBuffer`对象。
2. `byteLength`：返回数组占据内存的长度，单位是字节。
3. `byteOffset`：返回数组是从底层`Arraybuffer`对象的哪个字节开始的。
4. `length`：返回数组包含多少个成员。

方法，除了数组的通用方法之外，有几个方法需要拿出来单独说：

1. `set(arrayLikeObject[, offset])`：复制`arrayLikeObject`从`offset`（默认为`0`）开始的内存整段复制到当前对象。
2. `subarray([begin[, end]])`：从`begin`（默认为`0`）到`end`（默认为数组末尾）创建一个数组。创建出来的数组与当前数组共享`buffer`属性。
3. `slice([begin[, end]])`：从`begin`（默认为`0`）到`end`（默认为数组末尾）创建一个新的`TypedArray`对象，底层的`buffer`也是从当前数组复制过来的。

还有两个静态方法：

1. `TypedArray.of(...args)`：将参数转成一个`TypedArray`对象。
2. `TypedArray.from(arrayLikeObject)`：将一个可遍历的数据结构（例如数组）转成一个`TypedArray`对象。

模拟数组的`concat()`方法：

    function concatenate (resultConstructor, ...arrays) {
      let totalLength = 0
      for (let arr of arrays) {
        totalLength += arr.length
      }
      let result = new resultConstructor(totalLength)
      let offset = 0
      for (let arr of arrays) {
        result.set(arr, offset)
        offset += arr.length
      }
      return result
    }

    concatenate(Uint8Array, Uint8Array.of(1, 2), Uint8Array.of(3, 4)) // Uint8Array(4) [1, 2, 3, 4]

大端字节和小端字节：

    const BIG_ENDIAN = Symbol('BIG_ENDIAN');
    const LITTLE_ENDIAN = Symbol('LITTLE_ENDIAN');

    function getPlatformEndianness() {
      let arr32 = Uint32Array.of(0x12345678);
      let arr8 = new Uint8Array(arr32.buffer);
      switch ((arr8[0]*0x1000000) + (arr8[1]*0x10000) + (arr8[2]*0x100) + (arr8[3])) {
        case 0x12345678:
          return BIG_ENDIAN;
        case 0x78563412:
          return LITTLE_ENDIAN;
        default:
          throw new Error('Unknown endianness');
      }
    } 

    console.info(getPlatformEndianness())  // Symbol(LITTLE_ENDIAN)

字符串和`ArrayBuffer`的互相转换，通过`Uint16Array`实现：

    // ArrayBuffer 转为字符串，参数为 ArrayBuffer 对象
    function ab2str(buf) {
      // 注意，如果是大型二进制数组，为了避免溢出，
      // 必须一个一个字符地转
      if (buf && buf.byteLength < 1024) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
      }

      const bufView = new Uint16Array(buf);
      const len =  bufView.length;
      const bstr = new Array(len);
      for (let i = 0; i < len; i++) {
        bstr[i] = String.fromCharCode.call(null, bufView[i]);
      }
      return bstr.join('');
    }

    // 字符串转为 ArrayBuffer 对象，参数为字符串
    function str2ab(str) {
      const buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
      const bufView = new Uint16Array(buf);
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    }

    console.info(ab2str(str2ab('你好世界')))    // 你好世界

混合使用几种`TypedArray`，可以模拟出C语言的结构，例如：

    struct someStruct {
      unsigned long id;
      char username[16];
      float amountDue;
    }

内存结构分析：

1. `id`：类型为32位无符号整数，占据第0至3个字节。
2. `username`：类型为16个8位无符号整数，占据第4至19个字节。
3. `amountDue`：类型为32位浮点数，占据第20至23个字节。

所以整个结构占据24个字节的内存空间，使用`TypedArray`可以这么模拟：

    // 编码
    const buffer = new ArrayBuffer(24)
    const idView = new Uint32Array(buffer, 0, 1)
    const usernameView = new Uint8Array(buffer, 4, 16)
    const amountDueView = new Float32Array(buffer, 20, 1)

    idView[0] = 1
    usernameView.set(new Uint8Array(str2ab('你好')))
    amountDueView[0] = 1.23

    console.info(buffer)      // ArrayBuffer(24) {}

    // 解码
    const buffer2 = buffer.slice()
    const idView2 = new Uint32Array(buffer2, 0, 1)
    const usernameView2 = new Uint8Array(buffer2, 4, 16)
    const amountDueView2 = new Float32Array(buffer2, 20, 1)

    console.info(idView)                  // Uint32Array [1]
    console.info(                         // 你好
      ab2str(
        usernameView2.buffer.slice(
          usernameView2.byteOffset,
          usernameView2.byteLength
        )
      )
    )
    console.info(amountDueView2)          // Float32Array [1.2300000190734863]

### DataView

创建复合视图的第二个办法就是使用`DataView`。`DataView`可以自行设定大端字序和小端字序，从而处理字序不同的设备传过来的二进制数据。

构造函数：

1. `DataView(buffer[, byteOffset[, byteLength]])`：基于`buffer`，从`byteOffset`（默认为`0`）长度为`byteLength`（默认与`buffer`长度相同）创建一个视图。

属性：

1. `buffer`：返回内存区域对应的`ArrayBuffer`对象。
2. `byteLength`：返回数组占据内存的长度，单位是字节。
3. `byteOffset`：返回数组是从底层`Arraybuffer`对象的哪个字节开始的。

方法分成两大类：

1. `get<Typed>(byteOffset[, littleEndian])`：从`byteOffset`中拿一个对应类型的数据。
2. `set<Typed>(byteOffset, value[, littleEndian])：在`byteOffset`位置设置对应类型的值`value`。

其中`Typed`对应上面`TypedArray`的各种类型，例如`getInt8()`和`setInt8()`。除了`Int8`和`Uint8`之外，一项数据包含两个或者两个字节以上的类型，可以传入第三个参数`littleEndian`，当这个参数是`false`或者`undefined`的时候，使用大端字序，否则使用小端字序。

例如上述的C语言的结构，也可以使用`DataView`的方式进行模拟：

    // 编码
    const buffer = new ArrayBuffer(24)
    const dataView = new DataView(buffer)

    dataView.setUint32(0, 1, true)
    new Uint8Array(str2ab('你好')).forEach((b, i) => {
      dataView.setUint8(4 + i, b)
    })
    dataView.setFloat32(20, 1.23, true)

    console.info(dataView)                        // DataView(24) {}
    console.info(dataView.getUint32(0, true))      // 1
    console.info(dataView.getFloat32(20, true))    // 1.2300000190734863

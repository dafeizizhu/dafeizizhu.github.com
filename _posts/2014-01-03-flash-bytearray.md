---
layout: post
title: "使用ByteArray"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

在Flash中，我们可以使用`ByteArray`来操作二进制数据：

    var stream:ByteArray = new ByteArray();

使用`ByteArray`，可以把数据按照流的形式组织成一个`ByteArray`。`ByteArray`提供了`readXXX`和对应的`writeXXX`方法，按照同样调用顺序把数据读取和写入到`ByteArray`中，实现对数据的序列化。例如，我们可以这么写：

    bytes.writeUTFBytes("someString");
    bytes.writeFloat(1);

可以这么读：

    var str:String = bytes.readUTFBytes();
    var float:Float = bytes.readFloat();

`ByteArray`的`position`属性记录当前指针的位置，初始值为`0`。当读取或者写入`ByteArray`的时候，会更新`position`属性以指向上次读取或者写入字节后的位置：

    bytes.writeUTFBytes("Hello World!");
	// position + 12

可以更改这个`position`属性的值实现随机读写的功能。

`ByteArray`还提供了两个属性指示其长度。其中`bytesAvailable`表示当前位置（`position`）到结尾处还剩多少个字节，而`length`则表示整个`ByteArray`的长度。

使用`ByteArray`的`readObject`和`writeObject`还可以方便地把一个对象序列化到一个`ByteArray`或者从一个`ByteArray`中反序列化出来：

    var myXML:XML = {...};
    bytes.writeObject(myXML); 
    bytes.position = 0;        //reset position to beginning 
    bytes.compress(CompressionAlgorithm.DEFLATE);    // compress ByteArray 
    writeBytesToFile("order.xml", bytes); 

这样就把`obj`写入到一个`ByteArray`里面了，可以把它存到一个文件或者提交到服务端持久话起来。从文件或者服务端读取出来以后：

    readFileIntoByteArray("order", inBytes);
    inBytes.position = 0; // reset position to beginning 
    inBytes.uncompress(CompressionAlgorithm.DEFLATE); 
    inBytes.position = 0;    //reset position to beginning 
    // read XML Object 
    var orderXML:XML = inBytes.readObject(); 

---
layout: post
title: "Flash的“cookie” ShareObject"
description: ""
category: 
tags: [Flash]
---
{% include JB/setup %}

`ShareObject`类用于在用户计算机或者服务器上读取和存储有限的数据。在用户计算机上的存储类似于浏览器的cookie，远程共享对象类似于实时数据传输设备，需要Adobe Flash Media Server，这边就简单带过远程共享对象，主要讨论类似cookie的使用方式。

使用共享对象可以执行以下操作：

1. 本地持久化，类似于浏览器cookie。在用户计算机上存储数据可以减少服务器的负担。
2. 在Flash Media Server上存储并共享数据。通过远程共享对象可以让多个客户端共享数据。

当应用程序关闭的时候，会刷新共享对象或者写入磁盘。使用本地磁盘空间会受到一些限制，用户可以通过设置界面管理每个域可用的磁盘空间。在调用`getLocal`和`flush`这两个方法的时候需要执行检查是否能操作成功。

注意，为了使设置界面的对话框显示完全，`swf`文件的宽度至少为215像素，高度至少为138像素。

像浏览器cookie一样使用共享对象，例如：

    var so:SharedObject = SharedObject.getLocal("savedData");

以上的代码会返回一个共享对象的实例，包含以下几个属性：

1. `client`，表示对其调用回调方法的对象。
2. `data`，只读，表示这个共享对象的数据，可以视为一个键值对。
3. `defaultObjectEncodeing`，表示共享对象的默认对象编码。
4. `fps`，只写，指定每秒种客户端对共享对象所做的更改被发送到服务器的次数。
5. `objectEncodeing`，表示这个共享对象的对象编码。
6. `size`，只读，共享对象的大小，单位是字节。

通过`getLocal`返回一个共享对象之后，我们可以使用它的`data`属性存储或者访问一些数据：

    so.data.someKey = "someValue";
    trace(so.data.someKey); // "someValue"

本地共享通向可以通过共享对象实例上面的`clear`方法清除。通过调用`flush`方法可以将本地共享对象立即写入到本地文件中。

与浏览器cookie可以设置超时时间、域和路径等参数，`getLocal`方法接受三个参数：

1. `name`，表示共享对象的名称。
2. `localPath`，可选，创建共享对象的`swf`文件的完整路径或者部分路径，这个确定共享对象的本地存储路径。
3. `secure`，可选，确定是否只限于使用`HTTPS`连接传递的`swf`文件。

可以看到这上面是没有超时这个配置的，所以除非用户或者程序主动删除共享对象的本地存储的文件，不然这个共享对象是一直有效的。

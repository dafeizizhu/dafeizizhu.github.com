---
layout: post
title: "在windows底下折腾React开发环境"
description: ""
category: 
tags: [React, App]
---

这几天在玩React，想在办公的电脑上也玩一下，导致捣腾了几天o(╯□╰)o。想玩React的，有条件的同学还是上Mac吧，一来iOS必需在Mac上构建，而来在Windows里面弄开发环境实在是太折腾了。

在Windows上玩React，只能玩Android的，分两个步骤：

1. 安装Android SDK
2. 安装react-native

首先安装[Android SDK](http://dl.google.com/android/installer_r24.4.1-windows.exe)。这里选择独立的SDK，不包含IDE的，暂时不需要。

安装完SDK后需要安装React用到的几个工具。打开SDK Manager，勾选以下几项进行安装：

1. Tools -> Android SDK Tools
2. Tools -> Android SDK Platform-tools
3. Tools -> Android SDK Build-tools, 23.0.1
4. Android 6.0(API 23) -> SDK Platform
5. Android 6.0(API 23) -> Intel x86 Atom_64 System Image
6. Android 6.0(API 23) -> Intel x86 Atom System Image
7. Extras -> Android Support Repository
8. Extras -> Intel x86 Emulator Accelerator (HXAM installer)

安装完毕之后需要新建一个安卓设备的模拟器（AVD）。打开AVD Manager，可以选择预设的模板（Device Definition）新建一个模拟器。在列表（Android Virtual Devices）中选中刚才新建的模拟器，单击Start运行模拟器。

如果运行模拟器的过程中显示类似这样的提示信息：

    emulator: ERROR: x86 emulation currently requires hardware acceleration! Please ensure Intel HAXM is properly installed and usable

则需要安装HAXM。刚才使用SDK Manager下载包的时候已经把HAXM的安装程序下载了，路径在`%ANDROID_HOME%/extras/intel/Hardware_Accelerated_Execution_Manager/intelhaxm-android.exe`。

注：这个东西需要开启CPU的Hardware virtualization，如果没有开的话需要在主板的BIOS开启这项功能，否则安装HAXM过程中会报错。

经历了这么多步骤之后，相信AVD应该已经能顺利地启动了，再吐槽两句：

1. AVD的启动太慢了，着急的请打开任务管理器观察`emulator-x86.exe`这个进程，当它用了好多内存的时候就应该能看到界面了。
2. 一个AVD占用太多硬盘资源了，心疼我那小得一匹的C盘。

完成AVD的启动之后，可以搭建React Native的开发环境了，根据官网的指示，首先要安装`react-native-cli`：

    npm install -g react-native-cli

然后在工作目录中使用`react-native-cli`生成一个项目的脚手架：

    react-native init AwesomeProject

经过漫长的下载包、安装包的过程之后，就可以运行这个项目：

    cd AwesomeProject
    react-native run-android

然后就可以在模拟器上看到第一个Hello World App了……等等，有这么简单么？

首先，使用`npm`的时候，在墙内的同学最好能翻一翻，不然N次的网络错误会让你崩溃。

然后，在`npm install`的过程中需要使用python，请务必安装2.7的版本，[下载地址](https://www.python.org/ftp/python/2.7/python-2.7.amd64.msi)。

当所有依赖包啥的都下载回来了，可以运行的时候，输入上面的命令，发现还是报错：

    Can't find variable: __fbBatchedBridge (line 1 in the generated bundle)

原来在Windows下面`react-native run-android`是不会自动构建的，需要手动调用一个类似构建的命令：

    react-native start

这个命令启动了一个服务，默认是一个watcher的功能。这时候坑又来了，在运行这个命令的时候，发现到最后还是报错了：

    Watchman took too long to load

什么鬼！在Windows下面必须要安装`watchman`才能正常构建！悲剧的是在Windows下面watchman只有Alpha的版本，这个是[下载地址](http://bit.ly/watchmanwinalpha)。

这个版本需要安装Microsoft Visual C++ 2013 Redistributable，这个是[下载地址](https://download.microsoft.com/download/F/3/5/F3500770-8A08-488E-94B6-17A1E1DD526F/vcredist_x64.exe)。

经历了千辛万苦之后watchman终于可以启动起来了，没想到还是报那个错！真的是濒临崩溃了……

又各种Google了一翻，最后找到了[答案](https://github.com/facebook/react-native/issues/2841)，需要修改`react-native`模块里面的某个文件的超时时间：

    const MAX_WAIT_TIME = 60000;

好坑爹，不知道新的版本有没有把这个值当成是一个配置项来配置呢。

再次经历了千辛万苦的折腾后，再次运行`react-native start`，我的机器经历了49709毫秒，也就是接近50秒的时候才完成扫描文件的任务，默认的超时是30秒，怪不得一开始会超时！

终于看到了Hello World了！感动得双眼掉泪o(╯□╰)o！启动了watcher之后，对源文件进行修改后会自动构建，在模拟器中单击Menu键，在弹出的菜单中选择`Reload JS`，就可以看到修改后的效果了！

最后还是唠叨一句，有条件的同学就直接上Mac了，好吧o(╯□╰)o。

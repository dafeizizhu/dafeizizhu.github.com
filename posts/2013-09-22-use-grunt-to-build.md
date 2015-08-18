---
layout: post
title: "使用Grunt去构建"
description: ""
category: 
tags: [前端]
---
{% include JB/setup %}

之前已经接触过grunt了，在去年的工作中就已经使用grunt去做一些零星的构建工作，但是没有系统地使用过，而且也是使用原生的node比较多。今天自己使用grunt的构建工具已经差不多编写完成了，在这里写一下，顺便也当作一个不是很正式的文档吧。

###准备工作
____

grunt是使用node作为运行环境的，所以先要安装一个node。

安装grunt-cli和项目脚手架工具：

    npm install -g grunt-cli
    npm install -g grunt-init

这两个node的模块都要安装到全局里面，方便在任何一个地方调用。

由于使用了SPM去安装外部依赖，需要安装SPM：

    npm install -g spm

先从仓库里面把必须的文件checkout出来。暂时存了一份在github上，可以通过`git clone`来checkout，地址是[https://github.com/amkit2/amkit2.git](https://github.com/amkit2/amkit2.git)。

checkout之后，在该目录上面执行命令：

    npm install

把需要的node模块下载下来，有grunt的几个官方插件，例如copy、clean等；由于使用了seajs作为模块化开发的工具，所以还有几个关于seajs的插件，例如transport、concat等。完整的插件及其版本列表在`package.json`里面。

以Windows为例，在我的文档下面新建一个`.grunt-init`的文件夹（可能需要使用命令行新建）。在里面把项目的模板checkout出来，暂时也放在github，地址是[https://github.com/amkit2/grunt-init-amkit2.git](https://github.com/amkit2/grunt-init-amkit2.git)。

到现在环境已经准备好了，可以开始创建第一个模块！

###新建一个模块
____

在根目录下面可以任意创建项目的根文件夹，用SPM的术语来说就是family。这里没有什么family和module的概念，只有路径。这里用一个约定去判断一个目录是否为一个基本的模块：目录里面有一个`src`文件夹和`package.json`文件。所有的构建都是基于这个原子模块来进行的。

简单起见，以SPM规定的文件目录结构去开始我们的第一个模块。在根文件夹里面新建一个目录作为模块目录，在这个目录里面执行命令：

    grunt-init amkit2

按照向导输入模块的名字、版本和`package.json`的父`package.json`。这个是模仿maven pom文件中的`parent`字段，可以把一些全局配置抽取到顶层目录的`package.json`中。

执行完毕后可以看到在这个文件夹中生成了一个`src`文件夹和`package.json`文件，按照惯例这个文件夹就是一个模块文件夹。

现在可以编写我们的逻辑代码了！

###部署我们的代码
____

当我们辛辛苦苦把代码编写完毕之后，可以在根文件夹中执行`grunt`来进行部署。默认的task会遍历根文件夹下面的所有目录，如果满足以上的惯例则把相对路径存储下来。遍历完毕之后会对每一个路径进行打包部署操作。

打包的过程使用grunt的各个task去组装，有：

1. `clean:target`，把当前目录对应的模块版本的相关文件删掉。
2. `install:target`，使用`spm install`下载外部依赖（例如`seajs`、`jquery`等）。
3. `copy:temp`，复制源码到一个临时目录。
4. `transport:target`，使用SPM提供的grunt插件转化CMD模块，为模块增加Id和依赖数组。
5. `concat:target`，使用SPM提供的grunt插件合并CMD模块。
6. `uglify:target`，脚本的扰码和压缩。
7. `cssmin:target`，样式表的扰码和压缩。
8. `clean:temp`，清除临时目录。
9. `install:deploy`，在部署目录下载外部依赖。
10. `clean:deploy`，把部署目录对应的模块版本的相关文件删掉。
11. `copy:deploy`，把生成好的文件复制到部署目录。

部署目录现在是使用了一个环境变量去声明，这个做法是方便在不同机器上设置不同的部署目录，又不会在代码文件中生成，不用上传到版本控制的服务器（例如svn），减少冲突的可能。也可以使用相对目录去声明这个部署目录，以后会加入部署目录的默认值。

也可以使用以下的命令去部署特定的模块：

    grunt pub:path:to:module

其中的参数是模块目录相对于根文件夹的相对路径。

###实时watcher
____

由于项目是使用打包部署后的代码才能看到效果，所以在日常的工作中我们需要快速修改、快速看到效果。有两种实现方式：

1. 在开发的时候使用源码去看效果，这样就限制了部署的时候只能按照源码的目录结构进行部署，不然的话需要修改使用模块的代码，以适应路径的变化。
2. 通过一个watcher，当我们在编辑源码的时候，实时进行小范围的打包部署（例如只打包部署文件所在的模块），这样只需要刷新页面就能看到效果了。

暂时的方案是使用第2种方式，编写了一个watcher。当脚本、样式和模板文件发生变化的时候，就会自动地打包部署到部署目录。watcher的task为了提高效率，减少了下载外部依赖的步骤。

使用方式很简单，在根文件夹下面执行命令：

    grunt watch

就可以使用到watcher的功能了哦！

###总结
____

基本上整个打包部署的流程就是这样了，还有很多可以完善的东西，例如测试、持续集成、开发期间的代码调试等。边用边改进的节奏！

---
layout: post
title: "Ant里面的if和else"
description: ""
category: 
tags: [前端]
---

还是继续昨天那个恶心的项目。虽然不能够用脚本去编译，但是复制粘贴、修改版本号这些工作还是需要用脚本做的。如果是其他项目，我一定会用`gulp`来写这些构建脚本，但是在Flash Builder里面用的默认是Ant。讨厌的XML！

但是话说回来，Ant的功能还是挺强大的（我恨XML）。因为这个项目分出了几条构建分支，每条构建分支的部署地址是不一样的，我希望在执行脚本的时候必须在某条构建分支的代码底下（虽然不能保证是这些代码编译的，但是起码多个保障嘛）。这时候需要判断当前的代码是在那条git分支底下。思路大概是这样的：

1. 使用`git status`列出当前所在的分支，例如`# On branch master`。
2. 使用`exec`的`outputproperty`特性记录输出，看看输出的内容是否包含我们需要的分支的名字。
3. 如果有包含，则进行构建。
4. 如果没包含，则输出一行错误信息。

首先使用`exec`列出当前分支信息：

    <exec executable="git" dir="${basedir}" outputproperty="output">
      <arg value="status" />
    </exec>

然后使用Ant的`condition`：

    <condition property="scondition">  
      <contains string="${output}" substring="On branch master"/>  
    </condition>

上面这段代码定义了一个`condition`，条件是`output`这个属性包含字符串`On branch master`。然后创建两个`task`：

    <target name="isTrue" if="scondition">
      <!-- Do the build -->
    </target>

    <target name="isFalse" unless="scondition">  
      <echo>is not the correct branch! need branch[master]</echo>  
    </target>

这两个`task`会根据`scondition`这个条件选择是否执行。最后我们在构建脚本后面直接执行这两个`task`就可以了：

    <antcall target="isTrue">  
    </antcall>  
    <antcall target="isFalse">  
    </antcall>

`condition`还可以配置多种条件，例如`isTrue`、`isFalse`等等，可以[查看这里](https://ant.apache.org/manual/Tasks/conditions.html)。

最后还是吐槽一句，恶心的XML！

---
layout: post
title: "多构建版本管理与git cherry-pick"
description: ""
category: 
tags: [前端]
---

开发过程中，难免会遇到这么一个情况：软件A有N个发行版本，每个版本有其独特的配置参数，例如版本Alpha需要一个红色的按钮，而版本Beta需要一个黄色的按钮。我们可以用一个配置文件去管理这些参数：

    {
      'Alpha': {
        'color': 'red'
      },
      'Beta': {
        'color': 'yellow'
      }
    }

那怎么去控制使用哪个配置参数呢？最简单的是写在代码里：

    button.color = config['Alpha'].color

当我们需要版本Beta的时候，我们需要手动把这个参数改成`Beta`。作为一个程序猿，当然不允许这样的行为：第一，我们非常懒，受不鸟每次手动改；第二，我们非常蠢，经常会忘记修改这个恶心的参数常量。

有几种方案可以让我们省略这个“手工”过程。第一个就是条件编译常量，例如AS3里面的：

    CONFIG::Alpha
    {
      button.color = 'red';
    }
    CONFIG::Beta
    {
      button.color = 'yellow';
    }

我们可以编写构建脚本（AS3实用的是Ant），使用不同的编译常量去编译版本。这样，只要跑Alpha的构建脚本，就会使用Alpha的参数去编译版本，完美！

这个方案可以适用于大部分情况，有一个例外，就是不能用脚本去编译（o(╯□╰)o）。我有一个使用Flash CS6做的项目，没有找到对应的脚本去构建（麻烦知道怎么用脚本去构建的朋友好心告诉我）。那怎么办呢？我想到了用`git`。

思路大概是这样的：先把构建的参数提取到一个文件中，然后建立一个新的分支，把参数修改一下，然后再构建对应的版本。想法是好的，但是有一个大问题，就是例如在构建后，主干分支修改了若干个bug，需要同步到Alpha和Beta版本中去，使用简单的`git merge`是不行的，合并之后的代码会覆盖原有构建分支中的参数。那怎么把这些bug的修复代码合并到构建分支中呢？

`git`提供了一个工具叫`cherry-pick`。它可以把特定的`commit`合并到当前分支中，生成一条新的`commit`（尽管内容和注释是一样的，但是ID是不一样的）。就像这样：

    master -- A -- B
    |
    Alpha -- C
    |
    Beta -- D

其中`C`和`D`是构建分支中修改构建参数的`commit`。我们可以这样：

    git checkout Alpha
    git cherry-pick A
    git cherry-pick B

然后分支结构就会变成这样：

    master -- A -- B
    |
    Alpha -- C -- A -- B
    |
    Beta -- D

这样我们就可以把`A`和`B`这两个bug修复`commit`合并到构建分支去了。在`git`的1.7.2版本中还支持批量合入`commit`：

    git cherry-pick A..B

或

    git cherry-pick A^..B

前者包含`A`到`B`左开右闭的`commit`，后者则是`A`到`B`的闭区间里的`commit`。

虽然这个方案还是比较好的解决了以上提到的问题，但怎么感觉还是不够简单呢，特别是要自己去看这些`commit`并自行`cherry-pick`到每个构建分支。希望以后能找到更方便更懒更安全的方式去解决这些不能用脚本构建的恶心问题！

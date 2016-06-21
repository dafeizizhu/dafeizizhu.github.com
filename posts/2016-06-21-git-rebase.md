---
layout: post
title: "Git分支 - 分支的衍合"
description: ""
category: 
tags: [Git, 前端]
---

摘自：[https://git-scm.com/book/zh/v1/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%9A%84%E8%A1%8D%E5%90%88](https://git-scm.com/book/zh/v1/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%9A%84%E8%A1%8D%E5%90%88)

把一个分支中的修改整合到另一个分支的办法有两种：`merge`和`rebase`（衍合）。

最容易的整合分支方法是`merge`命令，它会把两个分支最新的快照以及两者最新的共同祖先进行三方合并，合并的结果是产生一个新的提交请求：

    C0 -> C1 -> C2 -> C4 -> C5 // master
                  |        |
                   -> C3 ->    // experiment

其实，还有另外一种选择：你可以把C3里产生的变化补丁在C4的基础上重新打一遍。在Git里，这种操作叫作衍合（rebase）。有了`rebase`命令，就可以把一个分支里的提交改变移到另一个分支重放一遍。在上面的例子中，运行：

    $ git checkout experiment
    $ git rebase master

它的原理是回到两个分支最近的共同祖先，根据当前分支的后续的历次提交对象（C3）生成一系列文件补丁，然后以基底分支（`master`）最后一个提交对象（C4）为出发点，逐个应用之前准备好的补丁文件，最后生成一个新的合并对象（C3），从而改写`experiment`的提交历史，使它成为`master`分支的直接下游：

    C0 -> C1 -> C2 -> C4 -> C3` // master @C4, experiment @C3` 
                   |
                   -> C3

回到`master`分支，进行一次快速合并：

    $ git checkout master
    $ git merge experiment

最后的分支历史如下：

    C0 -> C1 -> C2 -> C4 -> C3` // master and experiment both @C3`

这种方式最后对应的快照跟普通合并的快照内容是一模一样的，但是`rebase`能产生一个更为整洁的提交历史，仿佛所有修改都是在一根线上先后进行的，尽管它们原本是同时并行发生的。

衍合不一定非得根据分化之前的分支进行：

    $ git rebase --onto master server client

这好比说：取出`client`分支，找出`client`分支和`server`分支的共同祖先之后的变化，然后把它们在`master`上重演一遍。

再把`server`分支的变化包含进来：

    $ git rebase master server

最后进行快进：

    $ git checkout master
    $ git merge server

使用衍合，需要遵守一条准则：**一旦分支中的提交对象发布到公共仓库，就千万不要对该分支进行衍合操作**。

在进行衍合的时候，实际上抛弃了一些冼村的提交对象而创造了一些类似但不同的新的提交对象。如果你把原来分支中的提交对象发布出去，并且其他人更新下载后在其基础上开展工作，而稍后你又用`git rebase`抛弃这些提交对象，把新的重演后的提交对象发布出去，你的合作者就不得不合并他们的工作，这样当你再次从他们那里获取内容，提交历史就会变得一团糟。

如果把衍合当作一种在推送之前清理提交历史的手段，而且仅仅衍合那些尚未公开的提交对象，就没有问题。如果衍合那些已经公开的提交对象，并且已经有人基于这些对象开展了后续开发工作的话，就会出现叫人沮丧的麻烦。

---
layout: post
title: "HTML LINK 标签"
description: ""
category: 
tags: [html]
---
{% include JB/setup %}

我们平常用的最多的`link`标签就是引入外部的样式文件。大家有没有想过其实`link`还有别的作用。今天就来看看`link`究竟还能做些什么东西。

> The HTML link Element specifies relationships between the current document and other documents. 

以上是MDN对`link`标签的解释。其实`link`标签就是声明文档与文档之间的关系，例如HTML与外部样式文件之间的关系就是`stylesheet`的关系。这个标签的属性有：

1. `charset`，声明被链接的文件使用的字符编码。**注意，这个属性在HTML5中已经被HTML文档中的`Content-Type`头取代。**
2. `href`，声明被链接的文档的URI。
3. `hreflang`，声明被链接的文档的语言，在`href`的值不为空的时候才有效。
4. `type`，声明这个链接的MIME类型。例如平常使用的外部样式表就是`text/css`。
5. `rel`，声明被链接文档与该文档的关系。如`stylesheet`，更多的关系请留意下文。
6. `rev`，声明该文档与被链接文档的关系。
7. `media`，声明目标样式与设备的关系。响应式设计中的`media query`就是基于这个属性来进行媒体查询的。关于媒体查询会在以后的博客中作介绍。

还有几个不是标准的属性，**不是每个浏览器都支持哦**：

1. `disabled`，声明链接是否可用，例如可以通过设置值为`false`禁用某个外部样式表。
2. `target`，声明在哪里加载这个外部文档，如`a`的`target`属性的取值。

还有几个HTML5专用的属性：

1. `crossorigin`，声明这个`link`标签是否需要使用跨域请求（CROS）来获取。取值范围是`anonymous`（匿名访问）或者`use-credentials`（需要认证）。如果没有设置这个属性，则会以一般的请求来获取外部文档。
2. `sizes`，声明icon的大小，必须`rel`为`icon`才有效。

我们最常用的引入外部样式表可以用下面的一段代码：

    <link href="xxx.css" type="text/css" rel="stylesheet" media="screen" />

在这个情况下只有`href`和`rel`就可以让外部文档作为一个样式文件加入到当前文档中：

    <link href="xxx.css" rel="stylesheet" />

最后来关注一下`rel`（或者`rev`）能有哪些取值：

1. `Alternate`，被链接的文档是该文档的替代版本，例如翻译、打印等。
2. `Stylesheet`，被链接的文档是一个外部样式表。
3. `Start`，被链接的文档是文档集合的第一个文档。
4. `Next`，被链接的文档是文档集合的下一个文档。
5. `Prev`，被链接的文档是文档集合的上一个文档。
6. `Contents`，被链接的文档是当前文档的目录。
7. `Index`，被链接的文档是当前文档的索引。
8. `Glossary`，被链接的文档是在文档中使用的词汇的术语表（解释）。
9. `Copyright`，被链接的文档是当前文档的版权信息。
10. `Chapter`，被链接的文档是当前文档的章信息。
11. `Section`，被链接的文档是当前文档的节信息。
12. `Subsection`，被链接的文档是当前文档的小节信息。
13. `Appendix`，被链接的文档是当前文档的附录。
14. `Help`，被链接的文档是当前文档的帮助信息。
15. `Bookmark`，被链接的文档是当前文档的相关文档。

这些属性其中一个重要的作用，就是可以通过以上的这些`rel`属性的值，可以告诉搜索引擎各个文档之间的关系，方便搜索引擎整理这些文档之间的索引信息。

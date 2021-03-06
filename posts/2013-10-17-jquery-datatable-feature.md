---
layout: post
title: "jQuery DataTable 配置之特性配置"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

表格其实是一个非常难开发得好的组建，因为其需求太多了。排序、分页、过滤、单元格个性化……考虑到这些东西，还是使用DataTable作为底层比较方便（可惜已经很久没更新了，估计太重了坑太多……）。DataTable的用法非常简单：

    $(elem).dataTable();

可以传入一个`options`作为配置。DataTable的配置十分丰富，分成特性、选项等几个方面，今天先看看如何配置DataTable支持的特性。

**bAutoWidth**

布尔值，默认是`true`。表示启用或者禁用自动调整列宽的功能。自动调整列宽可以通过显式制定列宽（通过配置`aoColumns`）来禁用：

<iframe width="100%" height="300" src="http://jsfiddle.net/hKpX4/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe>

**bDeferRender**

布尔值，默认是`false`。表示是否需要动态加载数据。当表格的数据量很大的时候，为了提高加载的速度，只能加载一页数据，当用户翻页的时候才加载下一页的数据。这样，需要把`bDeferRender`设置成`true`，并提供一个地址作为数据源（`sAjaxSource`）。

**bFilter**

布尔值，默认是`true`。表示是否需要过滤器。如果设成`false`则不会显示默认的过滤器。

**bInfo**

布尔值，默认是`true`。表示是否需要显示表格的信息，就是类似`Showing 1 to 10 of 57 entries`这种信息。把它设为`false`则不会显示这些信息。

**bLengthChange**

布尔值，默认是`true`。表示是否允许用户去选择每页显示大小，需要和分页一块使用。如果设置成`false`则不会显示调整每页大小的下拉框。

**bPaginate**

布尔值，默认是`true`。表示是否启用分页功能。如果配置成`false`则：

1. 不会显示选择每页显示大小的下拉框。
2. 不会显示分页器。
3. DataTable会把所有数据都显示出来。

**bProcessing**

布尔值，默认是`false`。表示在排序等操作时要不要显示状态。由于当数据量十分少，也不是动态加载的情况下，这些操作耗时都十分少，所以只需要在数据量非常大或者动态加载的情况下才启用这个功能。

**bScrollInfinite**

布尔值，默认是`false`。表示是否启用“无限”滚动的功能，即当用户不断把滚动条往下拉的时候自动加载后面的数据。这个功能十分适用于大数据量的场景。由于这个功能跟分页是矛盾的，所以启用这个功能之后分页功能会自动被禁用。

请注意这个特性已经被废弃，且下一个版本就会被移除（都一年多了，不知道还会有版本不……）。

**bServerSide**

布尔值，默认是`false`。表示是否需要服务端进行处理。注意如果启用这个功能，必须同时设置`sAjaxSource`来声明服务端的地址。

**bSort**

布尔值，默认是`true`。表示是否启用排序功能。每一列的排序也可以通过每列上的`bSortable`来配置是否启用排序功能。如果设置成`false`则单击表头没有任何反应了。

**bSortClasses**

布尔值，默认是`true`。表示是否为当前排序的列的所有单元格增加class。当数据量很大的时候，反复增加和删除class可能会造成性能瓶颈，这时候需要把这个配置设置成`false`来提高性能。

**bStateSave**

布尔值，默认是`false`。表示是否需要保存表格当前的状态，例如分页、排序等。启动这个功能会生成一个cookie去存储相关的信息。这样用户再刷新这个界面的时候就会保持这些状态。

**sScrollX**

字符串，默认是空字符串。表示表格横向宽度。默认的行为是自适应容器的，我们可以设置一个有效的CSS的长度值（例如数字，或者是百分比），这样表格的内容区就会变成这个长度。如果这个长度超过表格的宽度，则会出现横向滚动条。

**sScrollY**

`sScrollX`的纵向版。

---
layout: page
title: 大肥子猪
tagline: 脚踏实地
---
{% include JB/setup %}


<div class="row-fluid">
  <div id="left" class="span9">
    <ul>
       {% for post in site.posts limit:5 %}
         <li style="margin-bottom: 50px;">
            <a href="{{ BASE_PATH }}{{ post.url}}"><h2>{{ post.title }}</h2></a>&nbsp;<span>{{ post.date | date_to_string }}</span>
            {{ post.content }}
         </li>
       {% endfor %}
    </ul>
  </div>
  <div id="right" class="span3">
    <ul class="posts">
      {% for post in site.posts %}
        <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
      {% endfor %}
    </ul>
  </div>
</div>



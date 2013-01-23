---
layout: page
title: 一码农
tagline: Supporting tagline
---
{% include JB/setup %}

<div>
  <div id="left">
    <ul>
       {% for post in site.posts %}
         <li>
            <p>{{ post.date | date_to_string }}</p>
            {{ post.content }}
         </li>
       {% endfor %}
    </ul>
  </div>
  <div id="right">
    <ul class="posts">
      {% for post in site.posts %}
        <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
      {% endfor %}
    </ul>
  </div>
</div>



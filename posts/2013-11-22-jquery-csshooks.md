---
layout: post
title: "jQuery扫盲之cssHooks"
description: ""
category: 
tags: [JavaScript, jQuery]
---
{% include JB/setup %}

在DOM的`style`属性中，不同浏览器对于一些CSS属性名称的处理是不一样的，例如`float`，在IE里面是`styleFloat`，而在Chrome则是`cssFloat`等。jQuery为我们处理了这些不一致，我们可以直接使用`css`去获取或者设置`float`的属性值。jQuery还提供了`cssHooks`这个对外的属性让我们可以自定义某些CSS属性的`getter`和`setter`：

> Hook directly into jQuery to override how particular CSS properties are retrieved or set, normalize CSS property naming, or create custom properties.

对于`float`等常用的CSS属性，jQuery已经为我们处理了这些浏览器的不一致，但是对于一些属性，例如`border-radius`（要加上浏览器特定的前缀）等，jQuery是没有处理的。对于这种场景，其中一种比较笨的方法是我们把所有浏览器的实现都写一遍：

    $(elem).css({
      "border-radius": "2px",
      "-ms-border-radius": "2px",
      "-webkit-border-radius": "2px",
      "-moz-border-radius": "2px",
    });

这时候更聪明的方式是，我们可以使用`cssHooks`去处理这些前缀：

    (function( $ ) {
 
      if ( !$.cssHooks ) {
        throw( new Error( "jQuery 1.4.3+ is needed for this plugin to work" ) );
      }
 
      function styleSupport( prop ) {
        var vendorProp, supportedProp,
            capProp = prop.charAt( 0 ).toUpperCase() + prop.slice( 1 ),
            prefixes = [ "Moz", "Webkit", "O", "ms" ],
            div = document.createElement( "div" );
 
        if ( prop in div.style ) {
          supportedProp = prop;
        } else {
          for ( var i = 0; i < prefixes.length; i++ ) {
            vendorProp = prefixes[ i ] + capProp;
            if ( vendorProp in div.style ) {
              supportedProp = vendorProp;
              break;
            }
          }
        }
 
        div = null;
        $.support[ prop ] = supportedProp;
        return supportedProp;
      }
 
      var borderRadius = styleSupport( "borderRadius" );
 
      // Set cssHooks only for browsers that support a vendor-prefixed border radius
      if ( borderRadius && borderRadius !== "borderRadius" ) {
        $.cssHooks.borderRadius = {
          get: function( elem, computed, extra ) {
            return $.css( elem, borderRadius );
          },
          set: function( elem, value) {
            elem.style[ borderRadius ] = value;
          }
        };
      }
    })( jQuery );

然后我们就可以像常用的CSS属性一样使用它了：

    $( "#element" ).css( "borderRadius", "10px" );
    $( "#another" ).css( "border-radius", "20px" );

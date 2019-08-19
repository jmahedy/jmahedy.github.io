"use strict";define(["Modernizr","vendor/polyfills","vendor/core/intersection-observer"],function(r){var c={rootMargin:"0px 0px 256px 0px",init:function(){if(document.querySelector("html").classList.add("js-lazyload"),"IntersectionObserver"in window&&"MutationObserver"in window){var e=new MutationObserver(function(){c.setupObservers()}),t=document.querySelector("body");if(e.observe(t,{childList:!0,subtree:!0,attributes:!1}),!r.objectfit)new MutationObserver(function(){c.setupObjectfitObserver()}).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});c.setupObservers()}},setupObservers:function(){var e=[].slice.call(document.querySelectorAll("img.u-lazyload:not(.has-lazy-observer)")),t=[].slice.call(document.querySelectorAll("picture.u-lazyload:not(.has-lazy-observer)")),r=[].slice.call(document.querySelectorAll("video.u-lazyload:not(.is-visible):not(.has-lazy-observer)")),s=[].slice.call(document.querySelectorAll(".u-lazyload:not(img):not(video):not(picture):not(.has-lazy-observer)")),o=new IntersectionObserver(function(e){e.forEach(function(e){if(e.isIntersecting){var t=e.target;t.src=t.dataset.src,void 0!==t.dataset.srcset&&(t.srcset=t.dataset.srcset),t.classList.add("u-lazyload-objectfit"),t.classList.remove("u-lazyload"),t.classList.remove("has-lazy-observer"),o.unobserve(t)}})},{rootMargin:c.rootMargin});e.forEach(function(e){e.classList.add("has-lazy-observer"),o.observe(e)});var a=new IntersectionObserver(function(e){e.forEach(function(e){if(e.isIntersecting){var t=e.target,r=t.querySelector("img");r.src=r.dataset.src;for(var s=t.querySelectorAll("source"),o=0;o<s.length;o++)s[o].srcset=s[o].dataset.srcset;r.classList.add("u-lazyload-objectfit"),t.classList.remove("u-lazyload"),t.classList.remove("has-lazy-observer"),a.unobserve(t)}})},{rootMargin:c.rootMargin});t.forEach(function(e){e.classList.add("has-lazy-observer"),a.observe(e)}),c.setupObjectfitObserver(o);var i=new IntersectionObserver(function(e){e.forEach(function(e){e.isIntersecting&&(e.target.classList.add("is-visible"),i.unobserve(e.target))})},{rootMargin:c.rootMargin});s.forEach(function(e){e.classList.add("has-lazy-observer"),i.observe(e)});var n=new IntersectionObserver(function(e){e.forEach(function(e){if(e.isIntersecting){for(var t in e.target.children)if(void 0!==e.target.children[t]){var r=e.target.children[t];"string"==typeof r.tagName&&"SOURCE"===r.tagName&&(r.src=r.dataset.src)}e.target.load(),e.target.classList.remove("u-lazyload"),e.classList.remove("has-lazy-observer"),n.unobserve(e.target)}})},{rootMargin:c.rootMargin});r.forEach(function(e){e.classList.add("has-lazy-observer"),n.observe(e)})},setupObjectfitObserver:function(s){if(!r.objectfit){var e=[].slice.call(document.querySelectorAll("img.u-lazyload:not(.has-lazy-objectfit-observer), img.u-lazyload-objectfit:not(.has-lazy-objectfit-observer), picture.u-lazyload img:not(.has-lazy-objectfit-observer)")),o=new IntersectionObserver(function(e){e.forEach(function(e){if(e.isIntersecting){var t=e.target,r=t.querySelector("img");null!=r&&(r.src=r.dataset.src,t.style.backgroundImage="url('"+r.dataset.src+"')",r.classList.remove("u-lazyload"),r.classList.remove("has-lazy-observer"),r.classList.remove("has-lazy-objectfit-observer"),r.classList.remove("u-lazyload-objectfit"),s&&s.unobserve(r)),o.unobserve(t)}})},{rootMargin:c.rootMargin});e.forEach(function(e){var t=e.closest(".js-objectfit-polyfill");null!=t&&(e.classList.add("has-lazy-objectfit-observer"),o.observe(t))})}}};return{initInstance:function(){null===document.querySelector("html.js-lazyload")&&c.init()}}});
//# sourceMappingURL=../maps/blocks/u-lazyload.js.map

!function(c,f){var i=function(){return i.get.apply(i,arguments)},l=i.utils={isArray:Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},isPlainObject:function(e){return!!e&&"[object Object]"===Object.prototype.toString.call(e)},toArray:function(e){return Array.prototype.slice.call(e)},getKeys:Object.keys||function(e){var t=[],r="";for(r in e)e.hasOwnProperty(r)&&t.push(r);return t},encode:function(e){return String(e).replace(/[,;"\\=\s%]/g,function(e){return encodeURIComponent(e)})},decode:function(e){return decodeURIComponent(e)},retrieve:function(e,t){return null==e?t:e}};i.defaults={},i.expiresMultiplier=86400,i.set=function(e,t,r){if(l.isPlainObject(e))for(var n in e)e.hasOwnProperty(n)&&this.set(n,e[n],t);else{var i=(r=l.isPlainObject(r)?r:{expires:r}).expires!==f?r.expires:this.defaults.expires||"",o=typeof i;"string"===o&&""!==i?i=new Date(i):"number"===o&&(i=new Date(+new Date+1e3*this.expiresMultiplier*i)),""!==i&&"toGMTString"in i&&(i=";expires="+i.toGMTString());var s=r.path||this.defaults.path;s=s?";path="+s:"";var u=r.domain||this.defaults.domain;u=u?";domain="+u:"";var a=r.secure||this.defaults.secure?";secure":"";!1===r.secure&&(a=""),c.cookie=l.encode(e)+"="+l.encode(t)+i+s+u+a}return this},i.setDefault=function(e,t,r){if(l.isPlainObject(e)){for(var n in e)this.get(n)===f&&this.set(n,e[n],t);return i}if(this.get(e)===f)return this.set.apply(this,arguments)},i.remove=function(e){for(var t=0,r=(e=l.isArray(e)?e:l.toArray(arguments)).length;t<r;t++)this.set(e[t],"",-1);return this},i.removeSpecific=function(e,t){if(!t)return this.remove(e);e=l.isArray(e)?e:[e],t.expires=-1;for(var r=0,n=e.length;r<n;r++)this.set(e[r],"",t);return this},i.empty=function(){return this.remove(l.getKeys(this.all()))},i.get=function(e,t){var r=this.all();if(l.isArray(e)){for(var n={},i=0,o=e.length;i<o;i++){var s=e[i];n[s]=l.retrieve(r[s],t)}return n}return l.retrieve(r[e],t)},i.all=function(){if(""===c.cookie)return{};for(var e=c.cookie.split("; "),t={},r=0,n=e.length;r<n;r++){var i=e[r].split("="),o=l.decode(i.shift()),s=l.decode(i.join("="));t[o]=s}return t},i.enabled=function(){if(navigator.cookieEnabled)return!0;var e="_"===i.set("_","_").get("_");return i.remove("_"),e},"function"==typeof define&&define.amd?define(function(){return{cookie:i}}):"undefined"!=typeof exports?exports.cookie=i:window.cookie=i}("undefined"==typeof document?null:document);
//# sourceMappingURL=../maps/vendor/cookie.js.map

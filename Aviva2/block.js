"use strict";define("b",{load:function(t,s,a,e){var p=t,c=t.split("/");e.paths&&!Object.prototype.hasOwnProperty.call(e,t)&&(-1!==t.indexOf("/")&&e.paths[c[0]]?e.paths[t]=t.replace(c[0],e.paths[c[0]]):(/^((\\)|(http)s?(:\/\/))+/i.test(p)||(p=e.baseBlocksUrl+"/"+t),e.paths[p]=p)),s([p],function(t){a(t)})}});
//# sourceMappingURL=maps/block.js.map

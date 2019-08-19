_satellite.pushAsyncScript(function(event, target, $variables){
  var AAUID = _satellite.getVisitorId().getMarketingCloudVisitorID();
    
var neustarfb = document.createElement("img");
neustarfb.setAttribute('id', 'neustarfb');
neustarfb.setAttribute('style', 'display:none');
neustarfb.setAttribute('height', '1');
neustarfb.setAttribute('width', '1');
neustarfb.setAttribute('src', 'https://www.facebook.com/tr?id=383101485568216&ev=PageView&cd[order_id]='+AAUID);
var insertionNode = document.body.firstChild;
insertionNode.parentNode.insertBefore(neustarfb, insertionNode);

});

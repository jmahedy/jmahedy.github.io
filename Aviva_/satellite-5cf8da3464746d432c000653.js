_satellite.pushAsyncScript(function(event, target, $variables){
  var AAUID = _satellite.getVisitorId().getMarketingCloudVisitorID();
var cacheBuster = Date.now();

var neustar = document.createElement("img");
neustar.setAttribute('id', 'neustar');
neustar.setAttribute('style', 'display:none');
neustar.setAttribute('height', '1');
neustar.setAttribute('width', '1');
neustar.setAttribute('src', 'https://d.agkn.com/pixel/9708/?che='+cacheBuster+'&aauid='+AAUID); 
var insertionNode = document.body.firstChild;
insertionNode.parentNode.insertBefore(neustar, insertionNode);

});

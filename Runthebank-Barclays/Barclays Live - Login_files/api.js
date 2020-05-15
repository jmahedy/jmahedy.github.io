lib={};loadReg=[];init=null;d=document;l=(d.layers)?1:0;op=navigator.userAgent.toLowerCase().indexOf('opera')!=-1;ie=(d.all)?1:0;dom=(d.getElementById)?1:0;ns6=(navigator.appName=="Netscape" && parseInt(navigator.appVersion)==5);
ismac=(navigator.userAgent.toLowerCase().indexOf("mac")>-1)?1:0;ie4=(navigator.appVersion.indexOf('MSIE 4')>0);

function gE(e,f){er="Div not found: "+e+". Check style sheet";if(l){f=(f)?f:self;V=f.document.layers;if(V[e])return V[e];for(W=0;W<V.length;W++)return(gE(e,V[W]));alert(er);return}if(d.all)return d.all[e]||alert(er);return d.getElementById(e)||alert(er);}
function sE(e){if(l)e.visibility='show';else e.style.visibility='visible';e.v=true}
function hE(e){if(l)e.visibility='hide';else e.style.visibility='hidden';e.v=false}
function sZ(e,z){if(l)e.zIndex=z;else e.style.zIndex=z;}
function sX(e,x){if(l)e.left=x;else if(op)e.style.pixelLeft=x;else e.style.left=x+'px';}
function sY(e,y){if(l)e.top=y;else if(op)e.style.pixelTop=y;else e.style.top=y+'px';}
function sW(e,w){if(l)e.clip.width=w;else if(op)e.style.pixelWidth=w;else e.style.width=w;}
function sH(e,h){if(l)e.clip.height=h;else if(op)e.style.pixelHeight=h;else e.style.height=h;}
function sC(e,t,r,b,x){if(l){X=e.clip;X.top=t;X.right=r;X.bottom=b;X.left=x;}else e.style.clip='rect('+t+'px '+r+'px '+b+'px '+x+'px)';}
function wH(e,h){if(l){Y=e.document;Y.open();Y.write(h);Y.close();}else e.innerHTML=h}

function sS(e,w,h){sW(e,w);sH(e,h)}
function sP(e,x,y){sX(e,x);sY(e,y)}
function aE(o,e,f,c){if(o.addEventListener)o.addEventListener(e,f,c);else if(o.attachEvent)o.attachEvent("on"+e,f);else eval("o.on"+e+"="+f)}
//function aE(e,ev,f){ev=ev.replace(/^(on)?/,'on');if(!e[ev+'c'])e[ev+'c']=[];e[ev+'c'][e[ev+'c'].length]=f;if(!e[ev])e[ev]=function(v){v=v||event;if(!v.currentTarget)v.currentTarget=e;if(!v.target)v.target=v.currentTarget;for(i=0;i<e[ev+'c'].length;i++)e[ev+'c'][i](v)}};
function docW(){if(ie)return d.body.clientWidth||0; else return innerWidth||0}
function docH(){if(ie)return d.body.clientHeight||0; else return innerHeight||0}
function gDSOC(){DSOC=new Object();DSOC.x=ie?d.body.scrollLeft:pageXOffset;DSOC.y=ie?d.body.scrollTop:pageYOffset;return DSOC;}

function gX(e){if(l)return e.left;else if(op)return e.style.pixelLeft;else return e.style.left.split('px')[0];}
function gY(e){if(l)return e.top;else if(op)return e.style.pixelTop;else return e.style.top.split('px')[0];}
function gW(e){if(l)return e.clip.width;else if(op)return e.style.pixelWidth;else return e.style.width;}
function gH(e){if(l)return e.clip.height;else if(op)return e.style.pixelHeight;else return e.style.height;}
function gCH(e){if(l)return e.document.height;return e.offsetHeight;}
function gCW(e){if(l)return e.document.width;if(ns6)return e.offsetWidth;e.offsetWidth;return parseInt(e.scrollWidth);}
//function gCW(e){if(l)return e.document.width;else if(ie)e.offsetWidth;return parseInt(e.scrollWidth);e.style.width = "auto";w = e.offsetWidth;e.style.width = w;return w;}

function cE(i){if(l){d.layers[i]=new Layer(0);eval("document."+i+"=d.layers[i]");}else{if(typeof d.createElement!='undefined'){X="<div id='"+i+"' style=\"position:absolute\">&nbsp;</div>";Y=d.createElement("DIV");if(Y){Y.innerHTML=X;d.body.appendChild(Y);}else if(typeof d.body.insertAdjacentHTML!='undefined')d.body.insertAdjacentHTML("BeforeEnd",X);}}}

function sT(e,t){e.id=setInterval('gT('+t+');',ti);} // wm set timer to start floating, calling gT() until the destination x,y is reached..
function gT(e,x,y){o=gX(e);a=parseInt((o-x)/ts);if(o!=x)sX(e,o-a);o=gY(e);b=parseInt((o-y)/ts);if(o!=y)sY(e,o-b);if(a==0&&b==0){clearInterval(e.id);}} // wm goto/float position set by timer sT()..
function a(t){alert(t);}
function w(t){window.status=t;}

//get Anchor Position
function gAP(n){
	var crd=new Object(),x=0,y=0;
	if(dom && ie){x=gAPageOL(d.all[n]);y=gAPageOT(d.all[n]);}
	else if(dom){var o=d.getElementById(n);x=gAPageOL(o);y=gAPageOT(o);}
	else if(ie){x=gAPageOL(d.all[n]);y=gAPageOT(d.all[n]);}
	else if(l){
		var found=0;
		for(var i=0;i<d.anchors.length;i++){if(d.anchors[i].name==n){found=1;break;}}
		if(found==0){crd.x=0;crd.y=0;return crd;}
		x=d.anchors[i].x;y=d.anchors[i].y;}
	else{crd.x=0;crd.y=0;return crd;}
	crd.x=x;crd.y=y;return crd;}
function gAWP(n){
	var crd=gAP(n),x=0,y=0;
	if(dom){
		if(isNaN(window.screenX)){x=crd.x-d.body.scrollLeft+window.screenLeft;y=crd.y-d.body.scrollTop+window.screenTop;}
		else{x=crd.x+window.screenX+(window.outerWidth-window.innerWidth)-window.pageXOffset;y=crd.y+window.screenY+(window.outerHeight-24-window.innerHeight)-window.pageYOffset;}
		}
	else if(ie){x=crd.x-d.body.scrollLeft+window.screenLeft;y=crd.y-d.body.scrollTop+window.screenTop;}
	else if(l){
		x=crd.x+window.screenX+(window.outerWidth-window.innerWidth)-window.pageXOffset;
		y=crd.y+window.screenY+(window.outerHeight-24-window.innerHeight)-window.pageYOffset;
		}
	crd.x=x;crd.y=y;return crd;}
function gAPageOL(e){ol=e.offsetLeft;while((e=e.offsetParent)!=null){ol+=e.offsetLeft;}return ol;}
function gAWPageOL(e){return gAPageOL(e)-d.body.scrollLeft;}	
function gAPageOT(e){ot=e.offsetTop;while((e=e.offsetParent)!=null){ot+=e.offsetTop;}return ot;}
function gAWPageOT(e){return gAPageOT(e)-d.body.scrollTop;}


function loadRegAdd(t){loadReg[loadReg.length]=t}
//onload=function(){for(var i in loadReg)eval(loadReg[i]);if(init)init()}

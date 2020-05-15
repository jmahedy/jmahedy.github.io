function saveCookie(name,value,days,path,theDomain,secure){
	if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires="; expires="+date.toGMTString();} 
	else expires = "";
	var theCookie = name + "=" + value + 
		((expires)	? "; expires="	+ expires.toGMTString() : "") + 
		((path)		? "; path="	+ path   : "; path=/") + 
		((theDomain)	? "; domain="	+ theDomain : "; domain=.lehman.com") + 
		((secure)	? "; secure"	: ""); 
	document.cookie=theCookie;
}
function readCookie(name){
	var nameEQ=name+"=";var ca=document.cookie.split(';');
	for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ') c=c.substring(1,c.length);if (c.indexOf(nameEQ)==0) return c.substring(nameEQ.length,c.length);}
	return null;
}
function readSubCookie(cookieStr,name,delim){
	var nameEQ=name+"=";var ca=cookieStr.split(delim || '~');
	for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ') c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0) return unescape(c.substring(nameEQ.length,c.length));}
	return null;
}
function saveSubCookie(cookieName,name,val,delim){
	cookieStr = unescape(readCookie(cookieName));
	nameEQ=name+"=";
	ca=cookieStr.split(delim || '~');
	nCookie = "";
	for(var i=0;i<ca.length;i++){
		var c=ca[i];
		while(c.charAt(0)==' ') c=c.substring(1,c.length);
		if(c.indexOf(nameEQ)==0) continue;
		nCookie += c+"~";
	}
	nCookie += (name+"="+val+"~");
	saveCookie(cookieName,escape(nCookie));
	return null;
}
function deleteSubCookie(cookieName,name,delim){
	cookieStr = unescape(readCookie(cookieName));
	nameEQ=name+"=";
	ca=cookieStr.split(delim || '~');
	nCookie = "";
	for(var i=0;i<ca.length;i++){
		var c=ca[i];
		while(c.charAt(0)==' ') c=c.substring(1,c.length);
		if(c.indexOf(nameEQ)==0) continue;
		nCookie += c+"~";
	}
//	saveCookie(cookieName,nCookie);
	saveCookie(cookieName,escape(nCookie));
	return null;
}

var expDays = 30;
var exp = new Date();
exp.setTime(exp.getTime() + (expDays*24*60*60*1000));

function getCookieVal (offset) {
var endstr = document.cookie.indexOf (";", offset);
if (endstr == -1)
endstr = document.cookie.length;
return unescape(document.cookie.substring(offset, endstr));
}
function GetCookie (name) {
var arg = name + "=";
var alen = arg.length;
var clen = document.cookie.length;
var i = 0;
while (i < clen) {
var j = i + alen;
if (document.cookie.substring(i, j) == arg)
return getCookieVal (j);
i = document.cookie.indexOf(" ", i) + 1;
if (i == 0) break;
}
return null;
}
function SetCookie (name, value) {
var argv = SetCookie.arguments;
var argc = SetCookie.arguments.length;
var expireDate = new Date ();
	expireDate.setMonth(expireDate.getMonth() + 3);

var path = (argc > 3) ? argv[3] : null;
var domain = (argc > 4) ? argv[4] : null;
var secure = (argc > 5) ? argv[5] : false;
document.cookie = name + "=" + escape (value) +
("; expires=" + expireDate.toGMTString()) +
((path == null) ? "" : ("; path=" + path)) +
((domain == null) ? "" : ("; domain=" + domain)) +
((secure == true) ? "; secure" : "");
}
function DeleteCookie (name) {
var exp = new Date();
exp.setTime (exp.getTime() - 1);
var cval = GetCookie (name);
document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}
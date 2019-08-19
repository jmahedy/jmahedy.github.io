var s = s_gi(_satellite.getToolsByType("sc")[0].settings.account);

/************************** CONFIG SECTION *************************/
s.usePlugins = true;
s.debugTracking = true;
s.trackLocal = true;

/************************** s_doPlugins SECTION *************************/
s.doPlugins = function (s) {
	
	// getLoadTime Plugin Part 2
	s.prop9 = s_getLoadTime();
	s.events = s.apl(s.events,"event349="+s.prop9,",",1)

	var sURL = document.referrer;
	if (sURL && sURL.indexOf('/') > -1 && (sURL.indexOf('aviva') === -1)) {
		sURL = sURL.split('/');
		s.prop42 = sURL[2];
	};

	// Plugin Config - Updated Daylight Savings 2/3/17
	function dateLookUp(month) {
		var fullDate,
			weekday,
			d = 25,
			looking = true,
			y = new Date().getFullYear();

		while (looking) {
			fullDate = new Date(y, month, d);
			weekday = fullDate.getDay();
			if (weekday === 0) {
				looking = false;
			} else {
				d++;
			};
		};

		return fullDate;
	}

	s.dstStart = dateLookUp(2);
	s.dstEnd = dateLookUp(9);

	// Captures number of logins
	if (s.events && s.events.indexOf('event218') > -1) {
		s.eVar15 = "+1";
	}
  
  // Capture orientation in eVar29
	if (window.screen.orientation !== undefined) {
		var orientation  = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
		if (orientation === "landscape-primary") {
			s.eVar29 = 'Landscape Primary';
		} else if (orientation === "landscape-secondary") {
			s.eVar29 = 'Landscape Secondary';
		} else if (orientation === "portrait-primary") {
			s.eVar29 = 'Portrait Primary';
		} else if (orientation === "portrait-secondary") {
			s.eVar29 = 'Portrait Secondary';
		} else {
			s.eVar29 = 'unsupported';
		}
	}	

	// Get Previous Page Name, Total Percent Viewed and Percent Viewed on initial load
	s.prop25 = s.getPreviousValue(s.pageName,'gpv_p25'); //prop25: prev page name
	if (s.pageName) s.getPercentPageViewed(); 
	if (s.prop25) {
		s.prop54 = s._ppvHighestPixelsSeen; // contains the total number of vertical pixels
		s.prop55 = s._ppvHighestPercentViewed; // contains the total percent viewed
		s.prop56 = s._ppvInitialPercentViewed;// contains the percent viewed on initial load
	}
	
	// Get time + day value, GMT. Ex. "8:03 AM|Monday"
	s.eVar17 = s.getTimeParting('n','0');

	// Set to "new"/"return" depending on whether the visitor has visited the site within the last 365 days
	s.eVar19 = s.getNewRepeat(365);

	// Set to number of visits within the last 365 days.
	s.eVar30 = s.getVisitNum(365);

	// Track time between last Quote start and first purshase
	if (s.events && s.events.indexOf('event201') > -1) {
		s.prop18 = 'start';
	}
	if (s.events && s.events.indexOf('event215') > -1) {
		s.prop18 = 'stop';
	}
	s.prop18 = s.getTimeToComplete(s.prop18,'ttc',0);

	// Channel: combination: stacks channel values if the user enters from a new channel using a 90 day cookie life time
	if (!s.eVar13 && s.eVar12) {
		s.eVar13 = s.crossVisitParticipation(s.eVar12,'s_atch','90','5',' > ','','1');
	}

	// Set App Referrer
	if (!document.referrer) {
		var s_camp= s.Util.getQueryParam('cmp');
		if (typeof s_camp !== 'undefined') {
			if (s_camp.indexOf("app-")>-1) {
				s.referrer= 'app_traffic';
			}
		}
	}

	// External Campaigns
	if (!s.campaign) {
		if (s.Util.getQueryParam('source') !== "" && s.Util.getQueryParam('cmp') === "") {
		} else {
			var params = '',
				codeVal,
				codes = ['cmp','utm_source','utm_medium','utm_campaign','cid','source','om_u','trafficsource'];

			for (var code = 0, len = codes.length; code < len; code++ ) {
				codeVal = s.Util.getQueryParam(codes[code]);
				if (codeVal !== "") {
					params += codeVal + ':';
				}
			};
			if(params.substring(params.length - 1) == ":") {
			    params = params.substring(0, params.length - 1);
			}

			s.campaign = params;
			s.campaign = s.getValOnce(s.campaign, 's_campaign', 0);
		}
	}
	
	// Audience Management Initialization 
	s.AudienceManagement.setup({
		"partner": "aviva",
		"containerNSID": 0,
		"uuidCookie": {
		  "name":"aam_uuid",
		  "days":30
		},
		"visitorService": {
            "namespace" : "5F8B76DA5233876B0A490D4D@AdobeOrg"
        }	
	});
}

/************************** PLUGINS SECTION *************************/
/* You may insert any plugins you wish to use here.*/
/*
 * Plugin Utility: apl v1.1
 */
s.apl=new Function("l","v","d","u",""
+"var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a."
+"length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
+"e()));}}if(!m)l=l?l+d+v:v;return l");


/*
 * Get Load Time Function: getLoadTime
 */
function s_getLoadTime(){if(!window.s_loadT){var b=new Date().getTime(),o=window.performance?performance.timing:0,a=o?o.requestStart:window.inHeadTS||0;s_loadT=a?Math.round((b-a)/100):''}return s_loadT}
s_getLoadTime(); //Immediately start

/*
 * Utility Function: split v1.5 (JS 1.0 compatible)
 */
s.split=new Function("l","d",""
+"var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
+"++]=l.substring(0,i);l=l.substring(i+d.length);}return a");

/*
 * Plugin: getPreviousValue_v1.0 - return previous value of designated
 *   variable (requires split utility)
 */
s.getPreviousValue=new Function("v","c","el",""
+"var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
+"){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
+"){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
+":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
+"s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");

/*
 * Plugin: getValOnce_v1.11
 */
s.getValOnce=new Function("v","c","e","t",""
+"var s=this,a=new Date,v=v?v:'',c=c?c:'s_gvo',e=e?e:0,i=t=='m'?6000"
+"0:86400000,k=s.c_r(c);if(v){a.setTime(a.getTime()+e*i);s.c_w(c,v,e"
+"==0?0:a);}return v==k?'':v");

/* Adobe Consulting Plugin: getPercentPageViewed v3.01 w/handlePPVevents helper function (Requires AppMeasurement and p_fo plugin) */ 
s.getPercentPageViewed=function(pid,ch){var s=this,a=s.c_r("s_ppv");a=-1<a.indexOf(",")?a.split(","):[];a[0]=s.unescape(a[0]); 
pid=pid?pid:s.pageName?s.pageName:document.location.href;s.ppvChange=ch?ch:!0;if("undefined"===typeof s.linkType||"o"!==
s.linkType)s.ppvID&&s.ppvID===pid||(s.ppvID=pid,s.c_w("s_ppv",""),s.handlePPVevents()),s.p_fo("s_gppvLoad")&&window
.addEventListener&&(window.addEventListener("load",s.handlePPVevents,!1),window.addEventListener("click",s.handlePPVevents, !1),window.addEventListener("scroll",s.handlePPVevents,!1),window.addEventListener("resize",s.handlePPVevents,!1)),s._ppvPreviousPage
=a[0]?a[0]:"",s._ppvHighestPercentViewed=a[1]?a[1]:"",s._ppvInitialPercentViewed=a[2]?a[2]:"",s._ppvHighestPixelsSeen=a[3]?a[3]:""}; 

/* Adobe Consulting Plugin: handlePPVevents helper function (for getPercentPageViewed v3.01 Plugin) */ 
s.handlePPVevents=function(){if("undefined"!==typeof s_c_il){for(var c=0,d=s_c_il.length;c<d;c++)if(s_c_il[c]&& 
s_c_il[c].getPercentPageViewed){var a=s_c_il[c];break}if(a&&a.ppvID){var f=Math.max(Math.max(document.body.scrollHeight, 
document.documentElement.scrollHeight),Math.max(document.body.offsetHeight,document.documentElement.offsetHeight),Math.max(document.
body.clientHeight,document.documentElement.clientHeight));c=(window.pageYOffset||window.document.documentElement.scrollTop||window.document.body.scrollTop)+(window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight);d=Math.min(Math.round
(c/f*100),100);var e="";!a.c_r("s_tp")||a.unescape(a.c_r("s_ppv").split(",")[0])!==a.ppvID||1==a.ppvChange&&
a.c_r("s_tp")&&f!= a.c_r("s_tp")?(a.c_w("s_tp",f),a.c_w("s_ppv","")):e=a.c_r("s_ppv");var b=e&&-1<e.indexOf(",")?e.split(",",4):[];f=0<b.length?b[0]: 
escape(a.ppvID);var g=1<b.length?parseInt(b[1]):d,h=2<b.length?parseInt(b[2]):d;b=3<b.length?parseInt(b[3]):c;0<d&&(e=f+"," 
+(d>g?d:g)+","+h+","+(c>b?c:b));a.c_w("s_ppv",e)}}}; 

/* Adobe Consulting Plugin: p_fo (pageFirstOnly) v2.0 (Requires AppMeasurement) */ 
s.p_fo=function(on){var s=this;s.__fo||(s.__fo={});if(s.__fo[on])return!1;s.__fo[on]={};return!0}; 

/*
 * Plugin: getTimeParting 3.4
 */
s.getTimeParting=new Function("h","z",""
+"var s=this,od;od=new Date('1/1/2000');if(od.getDay()!=6||od.getMont"
+"h()!=0){return'Data Not Available';}else{var H,M,D,U,ds,de,tm,da=['"
+"Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturda"
+"y'],d=new Date();z=z?z:0;z=parseFloat(z);if(s._tpDST){var dso=s._tp"
+"DST[d.getFullYear()].split(/,/);ds=new Date(dso[0]+'/'+d.getFullYea"
+"r());de=new Date(dso[1]+'/'+d.getFullYear());if(h=='n'&&d>ds&&d<de)"
+"{z=z+1;}else if(h=='s'&&(d>de||d<ds)){z=z+1;}}d=d.getTime()+(d.getT"
+"imezoneOffset()*60000);d=new Date(d+(3600000*z));H=d.getHours();M=d"
+".getMinutes();M=(M<10)?'0'+M:M;D=d.getDay();U=' AM';if(H>=12){U=' P"
+"M';H=H-12;}if(H==0){H=12;}D=da[D];tm=H+':'+M+U;return(tm+'|'+D);}");

/*
 * Plugin: getNewRepeat 1.2 - Returns whether user is new or repeat
 */
s.getNewRepeat=new Function("d","cn",""
+"var s=this,e=new Date(),cval,sval,ct=e.getTime();d=d?d:30;cn=cn?cn:"
+"'s_nr';e.setTime(ct+d*24*60*60*1000);cval=s.c_r(cn);if(cval.length="
+"=0){s.c_w(cn,ct+'-New',e);return'New';}sval=s.split(cval,'-');if(ct"
+"-sval[0]<30*60*1000&&sval[1]=='New'){s.c_w(cn,ct+'-New',e);return'N"
+"ew';}else{s.c_w(cn,ct+'-Repeat',e);return'Repeat';}");

/*
 * Plugin: getVisitNum - version 3.0
 */
s.getVisitNum=new Function("tp","c","c2",""
+"var s=this,e=new Date,cval,cvisit,ct=e.getTime(),d;if(!tp){tp='m';}"
+"if(tp=='m'||tp=='w'||tp=='d'){eo=s.endof(tp),y=eo.getTime();e.setTi"
+"me(y);}else {d=tp*86400000;e.setTime(ct+d);}if(!c){c='s_vnum';}if(!"
+"c2){c2='s_invisit';}cval=s.c_r(c);if(cval){var i=cval.indexOf('&vn="
+"'),str=cval.substring(i+4,cval.length),k;}cvisit=s.c_r(c2);if(cvisi"
+"t){if(str){e.setTime(ct+1800000);s.c_w(c2,'true',e);return str;}els"
+"e {return 'unknown visit number';}}else {if(str){str++;k=cval.substri"
+"ng(0,i);e.setTime(k);s.c_w(c,k+'&vn='+str,e);e.setTime(ct+1800000);"
+"s.c_w(c2,'true',e);return str;}else {s.c_w(c,e.getTime()+'&vn=1',e)"
+";e.setTime(ct+1800000);s.c_w(c2,'true',e);return 1;}}");
s.dimo=new Function("m","y",""
+"var d=new Date(y,m+1,0);return d.getDate();");
s.endof=new Function("x",""
+"var t=new Date;t.setHours(0);t.setMinutes(0);t.setSeconds(0);if(x=="
+"'m'){d=s.dimo(t.getMonth(),t.getFullYear())-t.getDate()+1;}else if("
+"x=='w'){d=7-t.getDay();}else {d=1;}t.setDate(t.getDate()+d);return "
+"t;");

/*
 * Plugin: getTimeToComplete 0.4 - return the time from start to stop
 */
s.getTimeToComplete=new Function("v","cn","e",""
+"var s=this,d=new Date,x=d,k;if(!s.ttcr){e=e?e:0;if(v=='start'||v=='"
+"stop')s.ttcr=1;x.setTime(x.getTime()+e*86400000);if(v=='start'){s.c"
+"_w(cn,d.getTime(),e?x:0);return '';}if(v=='stop'){k=s.c_r(cn);if(!s"
+".c_w(cn,'',d)||!k)return '';v=(d.getTime()-k)/1000;var td=86400,th="
+"3600,tm=60,r=5,u,un;if(v>td){u=td;un='days';}else if(v>th){u=th;un="
+"'hours';}else if(v>tm){r=2;u=tm;un='minutes';}else{r=.2;u=1;un='sec"
+"onds';}v=v*r/u;return (Math.round(v)/r)+' '+un;}}return '';");

s.loadModule("AudienceManagement");

/************************** AppMeasurement_Module_AudienceManagement *************************/
function AppMeasurement_Module_AudienceManagement(d){var a=this;a.s=d;var b=window;b.s_c_in||(b.s_c_il=[],b.s_c_in=0);a._il=b.s_c_il;a._in=b.s_c_in;a._il[a._in]=a;b.s_c_in++;a._c="s_m";a.setup=function(c){b.DIL&&c&&(c.disableDefaultRequest=!0,c.disableScriptAttachment=!0,c.disableCORS=!0,c.secureDataCollection=!1,a.instance=b.DIL.create(c),a.tools=b.DIL.tools)};a.isReady=function(){return a.instance?!0:!1};a.getEventCallConfigParams=function(){return a.instance&&a.instance.api&&a.instance.api.getEventCallConfigParams?
a.instance.api.getEventCallConfigParams():{}};a.passData=function(b){a.instance&&a.instance.api&&a.instance.api.passData&&a.instance.api.passData(b)}}
!function(){"use strict";var r,o,a;"function"!=typeof window.DIL&&(window.DIL=function(n){var c,e,I,r,u,h,t,o,s,i,a,d,l,f,p,g,m,y=[],b={};n!==Object(n)&&(n={}),I=n.partner,r=n.containerNSID,u=n.mappings,h=n.uuidCookie,t=!0===n.enableErrorReporting,o=n.visitorService,s=n.declaredId,i=!0===n.delayAllUntilWindowLoad,a=void 0===n.secureDataCollection||!0===n.secureDataCollection,d="boolean"==typeof n.isCoopSafe?n.isCoopSafe:null,l=!0===n.disableDefaultRequest,f=n.afterResultForDefaultRequest,p=n.visitorConstructor,g=!0===n.disableCORS,m=!0===n.ignoreHardDependencyOnVisitorAPI,t&&DIL.errorModule.activate(),m&&y.push("Warning: this instance is configured to ignore the hard dependency on the VisitorAPI service. This means that no URL destinations will be fired if the instance has no connection to VisitorAPI. If the VisitorAPI service is not instantiated, ID syncs will not be fired either.");var v=!0===window._dil_unit_tests;if((c=arguments[1])&&y.push(c+""),!I||"string"!=typeof I){var D={name:"error",message:c="DIL partner is invalid or not specified in initConfig",filename:"dil.js"};return DIL.errorModule.handleError(D),new Error(c)}if(c="DIL containerNSID is invalid or not specified in initConfig, setting to default of 0",(r||"number"==typeof r)&&(r=parseInt(r,10),!isNaN(r)&&0<=r&&(c="")),c&&(r=0,y.push(c),c=""),(e=DIL.getDil(I,r))instanceof DIL&&e.api.getPartner()===I&&e.api.getContainerNSID()===r)return e;if(!(this instanceof DIL))return new DIL(n,"DIL was not instantiated with the 'new' operator, returning a valid instance with partner = "+I+" and containerNSID = "+r);DIL.registerDil(this,I,r);var O={IS_HTTPS:a||"https:"===document.location.protocol,SIX_MONTHS_IN_MINUTES:259200,IE_VERSION:function(){if(document.documentMode)return document.documentMode;for(var e=7;4<e;e--){var t=document.createElement("div");if(t.innerHTML="\x3c!--[if IE "+e+"]><span></span><![endif]--\x3e",t.getElementsByTagName("span").length)return t=null,e}return null}()};O.IS_IE_LESS_THAN_10="number"==typeof O.IE_VERSION&&O.IE_VERSION<10;var C={stuffed:{}},S={},w={firingQueue:[],fired:[],firing:!1,sent:[],errored:[],reservedKeys:{sids:!0,pdata:!0,logdata:!0,callback:!0,postCallbackFn:!0,useImageRequest:!0},firstRequestHasFired:!1,abortRequests:!1,num_of_cors_responses:0,num_of_cors_errors:0,corsErrorSources:[],num_of_img_responses:0,num_of_img_errors:0,platformParams:{d_nsid:r+"",d_rtbd:"json",d_jsonv:DIL.jsonVersion+"",d_dst:"1"},nonModStatsParams:{d_rtbd:!0,d_dst:!0,d_cts:!0,d_rs:!0},modStatsParams:null,adms:{TIME_TO_CATCH_ALL_REQUESTS_RELEASE:3e4,calledBack:!1,mid:null,noVisitorAPI:null,VisitorAPI:null,instance:null,releaseType:"no VisitorAPI",isOptedOut:!0,isOptedOutCallbackCalled:!1,admsProcessingStarted:!1,process:function(e){try{if(this.admsProcessingStarted)return;this.admsProcessingStarted=!0;var t,n,s,i=o;if("function"!=typeof e||"function"!=typeof e.getInstance)throw this.noVisitorAPI=!0,new Error("Visitor does not exist.");if(i!==Object(i)||!(t=i.namespace)||"string"!=typeof t)throw this.releaseType="no namespace",new Error("DIL.create() needs the initConfig property `visitorService`:{namespace:'<Experience Cloud Org ID>'}");if(!((n=e.getInstance(t,{idSyncContainerID:r}))===Object(n)&&n instanceof e&&"function"==typeof n.isAllowed&&"function"==typeof n.getMarketingCloudVisitorID&&"function"==typeof n.getCustomerIDs&&"function"==typeof n.isOptedOut&&"function"==typeof n.publishDestinations))throw this.releaseType="invalid instance",s="Invalid Visitor instance.",n===Object(n)&&"function"!=typeof n.publishDestinations&&(s+=" In particular, visitorInstance.publishDestinations is not a function. This is needed to fire URL destinations in DIL v8.0+ and should be present in Visitor v3.3+ ."),new Error(s);if(this.VisitorAPI=e,!n.isAllowed())return this.releaseType="VisitorAPI is not allowed to write cookies",void this.releaseRequests();this.instance=n,this.waitForMidToReleaseRequests()}catch(e){if(!m)throw new Error("Error in processing Visitor API, which is a hard dependency for DIL v8.0+: "+e.message);this.releaseRequests()}},waitForMidToReleaseRequests:function(){var t=this;this.instance&&(this.instance.getMarketingCloudVisitorID(function(e){t.mid=e,t.releaseType="VisitorAPI",t.releaseRequests()},!0),(!j.exists||!j.isIabContext&&j.isApproved()||j.isIabContext&&k.hasGoSignal())&&setTimeout(function(){"VisitorAPI"!==t.releaseType&&(t.releaseType="timeout",t.releaseRequests())},this.getLoadTimeout()))},releaseRequests:function(){this.calledBack=!0,w.registerRequest()},getMarketingCloudVisitorID:function(){return this.instance?this.instance.getMarketingCloudVisitorID():null},getMIDQueryString:function(){var e=L.isPopulatedString,t=this.getMarketingCloudVisitorID();return e(this.mid)&&this.mid===t||(this.mid=t),e(this.mid)?"d_mid="+this.mid+"&":""},getCustomerIDs:function(){return this.instance?this.instance.getCustomerIDs():null},getCustomerIDsQueryString:function(e){if(e!==Object(e))return"";var t,n,s,i,r="",o=[],a=[];for(t in e)e.hasOwnProperty(t)&&(n=e[a[0]=t])===Object(n)&&(a[1]=n.id||"",a[2]=n.authState||0,o.push(a),a=[]);if(i=o.length)for(s=0;s<i;s++)r+="&d_cid_ic="+q.encodeAndBuildRequest(o[s],"%01");return r},getIsOptedOut:function(){this.instance?this.instance.isOptedOut([this,this.isOptedOutCallback],this.VisitorAPI.OptOut.GLOBAL,!0):(this.isOptedOut=!1,this.isOptedOutCallbackCalled=!0)},isOptedOutCallback:function(e){this.isOptedOut=e,this.isOptedOutCallbackCalled=!0,w.registerRequest(),j.isIabContext()&&k.checkQueryStringObject()},getLoadTimeout:function(){var e=this.instance;if(e){if("function"==typeof e.getLoadTimeout)return e.getLoadTimeout();if(void 0!==e.loadTimeout)return e.loadTimeout}return this.TIME_TO_CATCH_ALL_REQUESTS_RELEASE}},declaredId:{declaredId:{init:null,request:null},declaredIdCombos:{},setDeclaredId:function(e,t){var n=L.isPopulatedString,s=encodeURIComponent;if(e===Object(e)&&n(t)){var i=e.dpid,r=e.dpuuid,o=null;if(n(i)&&n(r))return o=s(i)+"$"+s(r),!0===this.declaredIdCombos[o]?"setDeclaredId: combo exists for type '"+t+"'":(this.declaredIdCombos[o]=!0,this.declaredId[t]={dpid:i,dpuuid:r},"setDeclaredId: succeeded for type '"+t+"'")}return"setDeclaredId: failed for type '"+t+"'"},getDeclaredIdQueryString:function(){var e=this.declaredId.request,t=this.declaredId.init,n=encodeURIComponent,s="";return null!==e?s="&d_dpid="+n(e.dpid)+"&d_dpuuid="+n(e.dpuuid):null!==t&&(s="&d_dpid="+n(t.dpid)+"&d_dpuuid="+n(t.dpuuid)),s}},registerRequest:function(e){var t,n=this.firingQueue;e===Object(e)&&(n.push(e),e.isDefaultRequest||(l=!0)),this.firing||!n.length||i&&!DIL.windowLoaded||(this.adms.isOptedOutCallbackCalled||this.adms.getIsOptedOut(),this.adms.calledBack&&!this.adms.isOptedOut&&this.adms.isOptedOutCallbackCalled&&(j.isApproved()||k.hasGoSignal())&&(this.adms.isOptedOutCallbackCalled=!1,(t=n.shift()).src=t.src.replace(/&d_nsid=/,"&"+this.adms.getMIDQueryString()+k.getQueryString()+"d_nsid="),L.isPopulatedString(t.corsPostData)&&(t.corsPostData=t.corsPostData.replace(/^d_nsid=/,this.adms.getMIDQueryString()+k.getQueryString()+"d_nsid=")),A.fireRequest(t),this.firstRequestHasFired||"script"!==t.tag&&"cors"!==t.tag||(this.firstRequestHasFired=!0)))},processVisitorAPI:function(){this.adms.process(p||window.Visitor)},getCoopQueryString:function(){var e="";return!0===d?e="&d_coop_safe=1":!1===d&&(e="&d_coop_unsafe=1"),e}};b.requestController=w;var R,_,E={sendingMessages:!1,messages:[],messagesPosted:[],destinations:[],destinationsPosted:[],jsonForComparison:[],jsonDuplicates:[],jsonWaiting:[],jsonProcessed:[],publishDestinationsVersion:null,requestToProcess:function(e,t){var n,s=this;function i(){s.jsonForComparison.push(e),s.jsonWaiting.push([e,t])}if(e&&!L.isEmptyObject(e))if(n=JSON.stringify(e.dests||[]),this.jsonForComparison.length){var r,o,a,d=!1;for(r=0,o=this.jsonForComparison.length;r<o;r++)if(a=this.jsonForComparison[r],n===JSON.stringify(a.dests||[])){d=!0;break}d?this.jsonDuplicates.push(e):i()}else i();if(this.jsonWaiting.length){var u=this.jsonWaiting.shift();this.process(u[0],u[1]),this.requestToProcess()}this.messages.length&&!this.sendingMessages&&this.sendMessages()},process:function(e){var t,n,s,i,r,o,a=encodeURIComponent,d=this.getPublishDestinationsVersion(),u=!1;if(-1!==d){if((t=e.dests)&&t instanceof Array&&(n=t.length)){for(s=0;s<n;s++)i=t[s],o=[a("dests"),a(i.id||""),a(i.y||""),a(i.c||"")].join("|"),this.addMessage(o),r={url:i.c,hideReferrer:void 0===i.hr||!!i.hr,message:o},this.addDestination(r),void 0!==i.hr&&(u=!0);1===d&&u&&q.consoleWarnOnce("Warning: visitorInstance.publishDestinations version is old (Visitor v3.3). URL destinations will not have the option of being fired on page, only in the iframe.")}this.jsonProcessed.push(e)}else q.consoleWarnOnce("Warning: Invalid visitorInstance.publishDestinations version. URL destinations will not be fired")},addMessage:function(e){this.messages.push(e)},addDestination:function(e){this.destinations.push(e)},sendMessages:function(){this.sendingMessages||(this.sendingMessages=!0,this.messages.length&&this.publishDestinations())},publishDestinations:function(){var t=this,e=w.adms.instance,n=[],s=[],i=function(e){y.push("visitor.publishDestinations() result: "+(e.error||e.message)),t.sendingMessages=!1,t.requestToProcess()},r=function(){t.messages=[],t.destinations=[]};return 1===this.publishDestinationsVersion?(q.extendArray(n,this.messages),q.extendArray(this.messagesPosted,this.messages),r(),e.publishDestinations(I,n,i),"Called visitor.publishDestinations() version 1"):1<this.publishDestinationsVersion?(q.extendArray(s,this.destinations),q.extendArray(this.destinationsPosted,this.destinations),r(),e.publishDestinations({subdomain:I,callback:i,urlDestinations:s}),"Called visitor.publishDestinations() version > 1"):void 0},getPublishDestinationsVersion:function(){if(null!==this.publishDestinationsVersion)return this.publishDestinationsVersion;var e=w.adms.instance,t=-1;return e&&"function"==typeof e.publishDestinations&&(3===e.publishDestinations.length?t=1:1===e.publishDestinations.length&&(t=2)),this.publishDestinationsVersion=t}},P={traits:function(e){return L.isValidPdata(e)&&(S.sids instanceof Array||(S.sids=[]),q.extendArray(S.sids,e)),this},pixels:function(e){return L.isValidPdata(e)&&(S.pdata instanceof Array||(S.pdata=[]),q.extendArray(S.pdata,e)),this},logs:function(e){return L.isValidLogdata(e)&&(S.logdata!==Object(S.logdata)&&(S.logdata={}),q.extendObject(S.logdata,e)),this},customQueryParams:function(e){return L.isEmptyObject(e)||q.extendObject(S,e,w.reservedKeys),this},signals:function(e,t){var n,s=e;if(!L.isEmptyObject(s)){if(t&&"string"==typeof t)for(n in s={},e)e.hasOwnProperty(n)&&(s[t+n]=e[n]);q.extendObject(S,s,w.reservedKeys)}return this},declaredId:function(e){return w.declaredId.setDeclaredId(e,"request"),this},result:function(e){return"function"==typeof e&&(S.callback=e),this},afterResult:function(e){return"function"==typeof e&&(S.postCallbackFn=e),this},useImageRequest:function(){return S.useImageRequest=!0,this},clearData:function(){return S={},this},submit:function(e){return S.isDefaultRequest=!!e,A.submitRequest(S),S={},this},getPartner:function(){return I},getContainerNSID:function(){return r},getEventLog:function(){return y},getState:function(){var e={},t={};return q.extendObject(e,w,{registerRequest:!0}),q.extendObject(t,E,{requestToProcess:!0,process:!0,sendMessages:!0}),{initConfig:n,pendingRequest:S,otherRequestInfo:e,destinationPublishingInfo:t,log:y}},idSync:function(){throw new Error("Please use the `idSyncByURL` method of the Experience Cloud ID Service (Visitor) instance")},aamIdSync:function(){throw new Error("Please use the `idSyncByDataSource` method of the Experience Cloud ID Service (Visitor) instance")},passData:function(e){return L.isEmptyObject(e)?"Error: json is empty or not an object":(A.defaultCallback(e),e)},getPlatformParams:function(){return w.platformParams},getEventCallConfigParams:function(){var e,t=w,n=t.modStatsParams,s=t.platformParams;if(!n){for(e in n={},s)s.hasOwnProperty(e)&&!t.nonModStatsParams[e]&&(n[e.replace(/^d_/,"")]=s[e]);!0===d?n.coop_safe=1:!1===d&&(n.coop_unsafe=1),t.modStatsParams=n}return n},setAsCoopSafe:function(){return d=!0,this},setAsCoopUnsafe:function(){return d=!1,this},getEventCallIabSignals:function(e){var t;return e!==Object(e)?"Error: config is not an object":"function"!=typeof e.callback?"Error: config.callback is not a function":(t=parseInt(e.timeout,10),isNaN(t)&&(t=null),void k.getQueryStringObject(e.callback,t))}},A={corsMetadata:(R="none","undefined"!=typeof XMLHttpRequest&&XMLHttpRequest===Object(XMLHttpRequest)&&"withCredentials"in new XMLHttpRequest&&(R="XMLHttpRequest"),{corsType:R}),getCORSInstance:function(){return"none"===this.corsMetadata.corsType?null:new window[this.corsMetadata.corsType]},submitRequest:function(e){return w.registerRequest(A.createQueuedRequest(e)),!0},createQueuedRequest:function(e){var t,n,s,i,r,o=e.callback,a="img",d=e.isDefaultRequest;if(delete e.isDefaultRequest,!L.isEmptyObject(u))for(s in u)if(u.hasOwnProperty(s)){if(null==(i=u[s])||""===i)continue;if(s in e&&!(i in e)&&!(i in w.reservedKeys)){if(null==(r=e[s])||""===r)continue;e[i]=r}}return L.isValidPdata(e.sids)||(e.sids=[]),L.isValidPdata(e.pdata)||(e.pdata=[]),L.isValidLogdata(e.logdata)||(e.logdata={}),e.logdataArray=q.convertObjectToKeyValuePairs(e.logdata,"=",!0),e.logdataArray.push("_ts="+(new Date).getTime()),"function"!=typeof o&&(o=this.defaultCallback),t=this.makeRequestSrcData(e),(n=this.getCORSInstance())&&!0!==e.useImageRequest&&(a="cors"),{tag:a,src:t.src,corsSrc:t.corsSrc,callbackFn:o,postCallbackFn:e.postCallbackFn,useImageRequest:!!e.useImageRequest,requestData:e,corsInstance:n,corsPostData:t.corsPostData,isDefaultRequest:d}},defaultCallback:function(e,t){var n,s,i,r,o,a,d,u,c;if((n=e.stuff)&&n instanceof Array&&(s=n.length))for(i=0;i<s;i++)(r=n[i])&&r===Object(r)&&(o=r.cn,a=r.cv,void 0!==(d=r.ttl)&&""!==d||(d=Math.floor(q.getMaxCookieExpiresInMinutes()/60/24)),u=r.dmn||"."+document.domain.replace(/^www\./,""),c=r.type,o&&(a||"number"==typeof a)&&("var"!==c&&(d=parseInt(d,10))&&!isNaN(d)&&q.setCookie(o,a,24*d*60,"/",u,!1),C.stuffed[o]=a));var l,f,p=e.uuid;L.isPopulatedString(p)&&(L.isEmptyObject(h)||("string"==typeof(l=h.path)&&l.length||(l="/"),f=parseInt(h.days,10),isNaN(f)&&(f=100),q.setCookie(h.name||"aam_did",p,24*f*60,l,h.domain||"."+document.domain.replace(/^www\./,""),!0===h.secure))),w.abortRequests||E.requestToProcess(e,t)},makeRequestSrcData:function(r){r.sids=L.removeEmptyArrayValues(r.sids||[]),r.pdata=L.removeEmptyArrayValues(r.pdata||[]);var o=w,e=o.platformParams,t=q.encodeAndBuildRequest(r.sids,","),n=q.encodeAndBuildRequest(r.pdata,","),s=(r.logdataArray||[]).join("&");delete r.logdataArray;var i,a,d=encodeURIComponent,u=O.IS_HTTPS?"https://":"http://",c=o.declaredId.getDeclaredIdQueryString(),l=o.adms.instance?o.adms.getCustomerIDsQueryString(o.adms.getCustomerIDs()):"",f=function(){var e,t,n,s,i=[];for(e in r)if(!(e in o.reservedKeys)&&r.hasOwnProperty(e))if(t=r[e],e=d(e),t instanceof Array)for(n=0,s=t.length;n<s;n++)i.push(e+"="+d(t[n]));else i.push(e+"="+d(t));return i.length?"&"+i.join("&"):""}(),p="d_dil_ver="+d(DIL.version),h="d_nsid="+e.d_nsid+o.getCoopQueryString()+c+l+(t.length?"&d_sid="+t:"")+(n.length?"&d_px="+n:"")+(s.length?"&d_ld="+d(s):""),g="&d_rtbd="+e.d_rtbd+"&d_jsonv="+e.d_jsonv+"&d_dst="+e.d_dst,m="&h_referer="+d(location.href);return a=(i=u+I+".demdex.net/event")+"?"+p+"&"+h+g+f+m,{corsSrc:i+"?"+p+"&_ts="+(new Date).getTime(),src:a,corsPostData:h+g+f+m,isDeclaredIdCall:""!==c}},fireRequest:function(e){if("img"===e.tag)this.fireImage(e);else{var t=w.declaredId,n=t.declaredId.request||t.declaredId.init||{},s={dpid:n.dpid||"",dpuuid:n.dpuuid||""};this.fireCORS(e,s)}},fireImage:function(t){var e,n,s=w;s.abortRequests||(s.firing=!0,e=new Image(0,0),s.sent.push(t),e.onload=function(){s.firing=!1,s.fired.push(t),s.num_of_img_responses++,s.registerRequest()},n=function(e){c="imgAbortOrErrorHandler received the event of type "+e.type,y.push(c),s.abortRequests=!0,s.firing=!1,s.errored.push(t),s.num_of_img_errors++,s.registerRequest()},e.addEventListener("error",n),e.addEventListener("abort",n),e.src=t.src)},fireCORS:function(s,i){var r=this,o=w,e=this.corsMetadata.corsType,t=s.corsSrc,n=s.corsInstance,a=s.corsPostData,d=s.postCallbackFn,u="function"==typeof d;if(!o.abortRequests&&!g){o.firing=!0;try{n.open("post",t,!0),"XMLHttpRequest"===e&&(n.withCredentials=!0,n.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),n.onreadystatechange=function(){4===this.readyState&&200===this.status&&function(e){var t;try{if((t=JSON.parse(e))!==Object(t))return r.handleCORSError(s,i,"Response is not JSON")}catch(e){return r.handleCORSError(s,i,"Error parsing response as JSON")}try{var n=s.callbackFn;o.firing=!1,o.fired.push(s),o.num_of_cors_responses++,n(t,i),u&&d(t,i)}catch(e){e.message="DIL handleCORSResponse caught error with message "+e.message,c=e.message,y.push(c),e.filename=e.filename||"dil.js",e.partner=I,DIL.errorModule.handleError(e);try{n({error:e.name+"|"+e.message},i),u&&d({error:e.name+"|"+e.message},i)}catch(e){}}finally{o.registerRequest()}}(this.responseText)}),n.onerror=function(){r.handleCORSError(s,i,"onerror")},n.ontimeout=function(){r.handleCORSError(s,i,"ontimeout")},n.send(a)}catch(e){this.handleCORSError(s,i,"try-catch")}o.sent.push(s),o.declaredId.declaredId.request=null}},handleCORSError:function(e,t,n){w.num_of_cors_errors++,w.corsErrorSources.push(n)},handleRequestError:function(e,t){var n=w;y.push(e),n.abortRequests=!0,n.firing=!1,n.errored.push(t),n.registerRequest()}},L={isValidPdata:function(e){return!!(e instanceof Array&&this.removeEmptyArrayValues(e).length)},isValidLogdata:function(e){return!this.isEmptyObject(e)},isEmptyObject:function(e){if(e!==Object(e))return!0;var t;for(t in e)if(e.hasOwnProperty(t))return!1;return!0},removeEmptyArrayValues:function(e){var t,n=0,s=e.length,i=[];for(n=0;n<s;n++)null!=(t=e[n])&&""!==t&&i.push(t);return i},isPopulatedString:function(e){return"string"==typeof e&&e.length}},q={convertObjectToKeyValuePairs:function(e,t,n){var s,i,r=[];for(s in t||(t="="),e)e.hasOwnProperty(s)&&null!=(i=e[s])&&""!==i&&r.push(s+t+(n?encodeURIComponent(i):i));return r},encodeAndBuildRequest:function(e,t){return e.map(function(e){return encodeURIComponent(e)}).join(t)},getCookie:function(e){var t,n,s,i=e+"=",r=document.cookie.split(";");for(t=0,n=r.length;t<n;t++){for(s=r[t];" "===s.charAt(0);)s=s.substring(1,s.length);if(0===s.indexOf(i))return decodeURIComponent(s.substring(i.length,s.length))}return null},setCookie:function(e,t,n,s,i,r){var o=new Date;n&&(n=1e3*n*60),document.cookie=e+"="+encodeURIComponent(t)+(n?";expires="+new Date(o.getTime()+n).toUTCString():"")+(s?";path="+s:"")+(i?";domain="+i:"")+(r?";secure":"")},extendArray:function(e,t){return e instanceof Array&&t instanceof Array&&(Array.prototype.push.apply(e,t),!0)},extendObject:function(e,t,n){var s;if(e!==Object(e)||t!==Object(t))return!1;for(s in t)if(t.hasOwnProperty(s)){if(!L.isEmptyObject(n)&&s in n)continue;e[s]=t[s]}return!0},getMaxCookieExpiresInMinutes:function(){return O.SIX_MONTHS_IN_MINUTES},replaceMethodsWithFunction:function(e,t){var n;if(e===Object(e)&&"function"==typeof t)for(n in e)e.hasOwnProperty(n)&&"function"==typeof e[n]&&(e[n]=t)},doesConsoleWarnExist:null,consoleWarnMemo:{},consoleWarnOnce:function(e){null===this.doesConsoleWarnExist&&(this.doesConsoleWarnExist=window.console===Object(window.console)&&"function"==typeof window.console.warn),this.consoleWarnMemo[e]||(this.consoleWarnMemo[e]=!0,this.doesConsoleWarnExist&&window.console.warn(e),y.push(e))}},j=(_=b.requestController,{exists:null,instance:null,aamIsApproved:null,init:function(){var e=this;this.checkIfExists()?(this.exists=!0,this.instance=window.adobe.optIn,this.instance.fetchPermissions(function(){e.callback()},!0)):this.exists=!1},checkIfExists:function(){return window.adobe===Object(window.adobe)&&window.adobe.optIn===Object(window.adobe.optIn)},callback:function(){this.aamIsApproved=this.instance.isApproved([this.instance.Categories.AAM]),_.adms.waitForMidToReleaseRequests(),_.adms.getIsOptedOut()},isApproved:function(){return!this.isIabContext()&&!_.adms.isOptedOut&&(!this.exists||this.aamIsApproved)},isIabContext:function(){return this.instance&&this.instance.isIabContext}});b.optIn=j;var T,M,V,x,k=(M=(T=b).requestController,V=T.optIn,x={isVendorConsented:null,doesGdprApply:null,consentString:null,queryStringObjectCallbacks:[],init:function(){this.fetchConsentData()},hasGoSignal:function(){return!(!(V.isIabContext()&&this.isVendorConsented&&this.doesGdprApply&&"string"==typeof this.consentString&&this.consentString.length)||M.adms.isOptedOut)},fetchConsentData:function(n,e){var s=this,t={};"function"!=typeof n&&(n=function(){}),V.instance&&V.isIabContext()?(e&&(t.timeout=e),V.instance.execute({command:"iabPlugin.fetchConsentData",params:t,callback:function(e,t){t===Object(t)?(s.doesGdprApply=!!t.gdprApplies,s.consentString=t.consentString||""):(s.doesGdprApply=!1,s.consentString=""),s.isVendorConsented=V.instance.isApproved(V.instance.Categories.AAM),e?n({}):s.checkQueryStringObject(n),M.adms.waitForMidToReleaseRequests()}})):n({})},getQueryString:function(){return V.isIabContext()?"gdpr="+(this.doesGdprApply?1:0)+"&gdpr_consent="+this.consentString+"&":""},getQueryStringObject:function(e,t){this.fetchConsentData(e,t)},checkQueryStringObject:function(e){x.hasGoSignal()&&"function"==typeof e&&e({gdpr:this.doesGdprApply?1:0,gdpr_consent:this.consentString})}});b.iab=k,"error"===I&&0===r&&window.addEventListener("load",function(){DIL.windowLoaded=!0});var N=!1,Q=function(){N||(N=!0,w.registerRequest(),F())},F=function(){setTimeout(function(){l||w.firstRequestHasFired||("function"==typeof f?P.afterResult(f).submit(!0):P.submit(!0))},DIL.constants.TIME_TO_DEFAULT_REQUEST)},U=document;"error"!==I&&(DIL.windowLoaded?Q():"complete"!==U.readyState&&"loaded"!==U.readyState?window.addEventListener("load",function(){DIL.windowLoaded=!0,Q()}):(DIL.windowLoaded=!0,Q())),w.declaredId.setDeclaredId(s,"init"),j.init(),k.init(),w.processVisitorAPI();O.IS_IE_LESS_THAN_10&&q.replaceMethodsWithFunction(P,function(){return this}),this.api=P,this.getStuffedVariable=function(e){var t=C.stuffed[e];return t||"number"==typeof t||(t=q.getCookie(e))||"number"==typeof t||(t=""),t},this.validators=L,this.helpers=q,this.constants=O,this.log=y,this.pendingRequest=S,this.requestController=w,this.destinationPublishing=E,this.requestProcs=A,this.units=b,v&&(this.variables=C,this.callWindowLoadFunctions=Q)},DIL.extendStaticPropertiesAndMethods=function(e){var t;if(e===Object(e))for(t in e)e.hasOwnProperty(t)&&(this[t]=e[t])},DIL.extendStaticPropertiesAndMethods({version:"9.1",jsonVersion:1,constants:{TIME_TO_DEFAULT_REQUEST:500},variables:{scriptNodeList:document.getElementsByTagName("script")},windowLoaded:!1,dils:{},isAddedPostWindowLoad:function(){var e=arguments[0];this.windowLoaded="function"==typeof e?!!e():"boolean"!=typeof e||e},create:function(e){try{return new DIL(e)}catch(e){throw new Error("Error in attempt to create DIL instance with DIL.create(): "+e.message)}},registerDil:function(e,t,n){var s=t+"$"+n;s in this.dils||(this.dils[s]=e)},getDil:function(e,t){var n;return"string"!=typeof e&&(e=""),t||(t=0),(n=e+"$"+t)in this.dils?this.dils[n]:new Error("The DIL instance with partner = "+e+" and containerNSID = "+t+" was not found")},dexGetQSVars:function(e,t,n){var s=this.getDil(t,n);return s instanceof this?s.getStuffedVariable(e):""}}),DIL.errorModule=(r=DIL.create({partner:"error",containerNSID:0,ignoreHardDependencyOnVisitorAPI:!0}),a=!(o={harvestererror:14138,destpuberror:14139,dpmerror:14140,generalerror:14137,error:14137,noerrortypedefined:15021,evalerror:15016,rangeerror:15017,referenceerror:15018,typeerror:15019,urierror:15020}),{activate:function(){a=!0},handleError:function(e){if(!a)return"DIL error module has not been activated";e!==Object(e)&&(e={});var t=e.name?(e.name+"").toLowerCase():"",n=t in o?o[t]:o.noerrortypedefined,s=[],i={name:t,filename:e.filename?e.filename+"":"",partner:e.partner?e.partner+"":"no_partner",site:e.site?e.site+"":document.location.href,message:e.message?e.message+"":""};return s.push(n),r.api.pixels(s).logs(i).useImageRequest().submit(),"DIL error report sent"},pixelMap:o}),DIL.tools={},DIL.modules={helpers:{}})}();


/************************** AppMeasurement_JS *************************/
/*
 Start ActivityMap Module

 The following module enables ActivityMap tracking in Adobe Analytics. ActivityMap
 allows you to view data overlays on your links and content to understand how
 users engage with your web site. If you do not intend to use ActivityMap, you
 can remove the following block of code from your AppMeasurement.js file.
 Additional documentation on how to configure ActivityMap is available at:
 https://marketing.adobe.com/resources/help/en_US/analytics/activitymap/getting-started-admins.html
*/
function AppMeasurement_Module_ActivityMap(f){function g(a,d){var b,c,m;if(a&&d&&(b=e.c[d]||(e.c[d]=d.split(","))))for(m=0;m<b.length&&(c=b[m++]);)if(-1<a.indexOf(c))return null;n=1;return a}function p(a,d,b,c,e){var g,k;if(a.dataset&&(k=a.dataset[d]))g=k;else if(a.getAttribute)if(k=a.getAttribute("data-"+b))g=k;else if(k=a.getAttribute(b))g=k;if(!g&&f.useForcedLinkTracking&&e){var h;a=a.onclick?""+a.onclick:"";varValue="";if(c&&a&&(d=a.indexOf(c),0<=d)){for(d+=c.length;d<a.length;)if(b=a.charAt(d++),
0<="'\"".indexOf(b)){h=b;break}for(k=!1;d<a.length&&h;){b=a.charAt(d);if(!k&&b===h)break;"\\"===b?k=!0:(varValue+=b,k=!1);d++}}(h=varValue)&&(f.w[c]=h)}return g||e&&f.w[c]}function q(a,d,b){var c;return(c=e[d](a,b))&&(n?(n=0,c):g(h(c),e[d+"Exclusions"]))}function r(a,d,b){var c;if(a&&!(1===(c=a.nodeType)&&(c=a.nodeName)&&(c=c.toUpperCase())&&s[c])&&(1===a.nodeType&&(c=a.nodeValue)&&(d[d.length]=c),b.a||b.t||b.s||!a.getAttribute||((c=a.getAttribute("alt"))?b.a=c:(c=a.getAttribute("title"))?b.t=c:"IMG"==
(""+a.nodeName).toUpperCase()&&(c=a.getAttribute("src")||a.src)&&(b.s=c)),(c=a.childNodes)&&c.length))for(a=0;a<c.length;a++)r(c[a],d,b)}function h(a){if(null==a||void 0==a)return a;try{return a.replace(RegExp("^[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]+","mg"),"").replace(RegExp("[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]+$","mg"),"").replace(RegExp("[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]{1,}",
"mg")," ").substring(0,254)}catch(d){}}var e=this;e.s=f;var l=window;l.s_c_in||(l.s_c_il=[],l.s_c_in=0);e._il=l.s_c_il;e._in=l.s_c_in;e._il[e._in]=e;l.s_c_in++;e._c="s_m";e.c={};var n=0,s={SCRIPT:1,STYLE:1,LINK:1,CANVAS:1};e._g=function(){var a,d,b,c=f.contextData,e=f.linkObject;(a=f.pageName||f.pageURL)&&(d=q(e,"link",f.linkName))&&(b=q(e,"region"))&&(c["a.activitymap.page"]=a.substring(0,255),c["a.activitymap.link"]=128<d.length?d.substring(0,128):d,c["a.activitymap.region"]=127<b.length?b.substring(0,
127):b,c["a.activitymap.pageIDType"]=f.pageName?1:0)};e.link=function(a,d){var b;if(d)b=g(h(d),e.linkExclusions);else if((b=a)&&!(b=p(a,"sObjectId","s-object-id","s_objectID",1))){var c,f;(f=g(h(a.innerText||a.textContent),e.linkExclusions))||(r(a,c=[],b={a:void 0,t:void 0,s:void 0}),(f=g(h(c.join(""))))||(f=g(h(b.a?b.a:b.t?b.t:b.s?b.s:void 0)))||!(c=(c=a.tagName)&&c.toUpperCase?c.toUpperCase():"")||("INPUT"==c||"SUBMIT"==c&&a.value?f=g(h(a.value)):"IMAGE"==c&&a.src&&(f=g(h(a.src)))));b=f}return b};
e.region=function(a){for(var d,b=e.regionIDAttribute||"id";a&&(a=a.parentNode);){if(d=p(a,b,b,b))return d;if("BODY"==a.nodeName)return"BODY"}}}
/* End ActivityMap Module */
/*
 ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============

AppMeasurement for JavaScript version: 2.14.0
Copyright 1996-2016 Adobe, Inc. All Rights Reserved
More info available at http://www.adobe.com/marketing-cloud.html
*/
function AppMeasurement(r){var a=this;a.version="2.14.0";var k=window;k.s_c_in||(k.s_c_il=[],k.s_c_in=0);a._il=k.s_c_il;a._in=k.s_c_in;a._il[a._in]=a;k.s_c_in++;a._c="s_c";var q=k.AppMeasurement.ac;q||(q=null);var p=k,m,s;try{for(m=p.parent,s=p.location;m&&m.location&&s&&""+m.location!=""+s&&p.location&&""+m.location!=""+p.location&&m.location.host==s.host;)p=m,m=p.parent}catch(u){}a.D=function(a){try{console.log(a)}catch(b){}};a.Pa=function(a){return""+parseInt(a)==""+a};a.replace=function(a,b,d){return!a||
0>a.indexOf(b)?a:a.split(b).join(d)};a.escape=function(c){var b,d;if(!c)return c;c=encodeURIComponent(c);for(b=0;7>b;b++)d="+~!*()'".substring(b,b+1),0<=c.indexOf(d)&&(c=a.replace(c,d,"%"+d.charCodeAt(0).toString(16).toUpperCase()));return c};a.unescape=function(c){if(!c)return c;c=0<=c.indexOf("+")?a.replace(c,"+"," "):c;try{return decodeURIComponent(c)}catch(b){}return unescape(c)};a.Hb=function(){var c=k.location.hostname,b=a.fpCookieDomainPeriods,d;b||(b=a.cookieDomainPeriods);if(c&&!a.Ha&&!/^[0-9.]+$/.test(c)&&
(b=b?parseInt(b):2,b=2<b?b:2,d=c.lastIndexOf("."),0<=d)){for(;0<=d&&1<b;)d=c.lastIndexOf(".",d-1),b--;a.Ha=0<d?c.substring(d):c}return a.Ha};a.c_r=a.cookieRead=function(c){c=a.escape(c);var b=" "+a.d.cookie,d=b.indexOf(" "+c+"="),f=0>d?d:b.indexOf(";",d);c=0>d?"":a.unescape(b.substring(d+2+c.length,0>f?b.length:f));return"[[B]]"!=c?c:""};a.c_w=a.cookieWrite=function(c,b,d){var f=a.Hb(),e=a.cookieLifetime,g;b=""+b;e=e?(""+e).toUpperCase():"";d&&"SESSION"!=e&&"NONE"!=e&&((g=""!=b?parseInt(e?e:0):-60)?
(d=new Date,d.setTime(d.getTime()+1E3*g)):1===d&&(d=new Date,g=d.getYear(),d.setYear(g+2+(1900>g?1900:0))));return c&&"NONE"!=e?(a.d.cookie=a.escape(c)+"="+a.escape(""!=b?b:"[[B]]")+"; path=/;"+(d&&"SESSION"!=e?" expires="+d.toUTCString()+";":"")+(f?" domain="+f+";":""),a.cookieRead(c)==b):0};a.Eb=function(){var c=a.Util.getIeVersion();"number"===typeof c&&10>c&&(a.unsupportedBrowser=!0,a.sb(a,function(){}))};a.sb=function(a,b){for(var d in a)a.hasOwnProperty(d)&&"function"===typeof a[d]&&(a[d]=b)};
a.M=[];a.fa=function(c,b,d){if(a.Ia)return 0;a.maxDelay||(a.maxDelay=250);var f=0,e=(new Date).getTime()+a.maxDelay,g=a.d.visibilityState,h=["webkitvisibilitychange","visibilitychange"];g||(g=a.d.webkitVisibilityState);if(g&&"prerender"==g){if(!a.ga)for(a.ga=1,d=0;d<h.length;d++)a.d.addEventListener(h[d],function(){var c=a.d.visibilityState;c||(c=a.d.webkitVisibilityState);"visible"==c&&(a.ga=0,a.delayReady())});f=1;e=0}else d||a.o("_d")&&(f=1);f&&(a.M.push({m:c,a:b,t:e}),a.ga||setTimeout(a.delayReady,
a.maxDelay));return f};a.delayReady=function(){var c=(new Date).getTime(),b=0,d;for(a.o("_d")?b=1:a.za();0<a.M.length;){d=a.M.shift();if(b&&!d.t&&d.t>c){a.M.unshift(d);setTimeout(a.delayReady,parseInt(a.maxDelay/2));break}a.Ia=1;a[d.m].apply(a,d.a);a.Ia=0}};a.setAccount=a.sa=function(c){var b,d;if(!a.fa("setAccount",arguments))if(a.account=c,a.allAccounts)for(b=a.allAccounts.concat(c.split(",")),a.allAccounts=[],b.sort(),d=0;d<b.length;d++)0!=d&&b[d-1]==b[d]||a.allAccounts.push(b[d]);else a.allAccounts=
c.split(",")};a.foreachVar=function(c,b){var d,f,e,g,h="";e=f="";if(a.lightProfileID)d=a.Q,(h=a.lightTrackVars)&&(h=","+h+","+a.ka.join(",")+",");else{d=a.g;if(a.pe||a.linkType)h=a.linkTrackVars,f=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(h=a[e].Yb,f=a[e].Xb));h&&(h=","+h+","+a.G.join(",")+",");f&&h&&(h+=",events,")}b&&(b=","+b+",");for(f=0;f<d.length;f++)e=d[f],(g=a[e])&&(!h||0<=h.indexOf(","+e+","))&&(!b||0<=b.indexOf(","+e+","))&&c(e,g)};a.q=function(c,
b,d,f,e){var g="",h,l,k,n,m=0;"contextData"==c&&(c="c");if(b){for(h in b)if(!(Object.prototype[h]||e&&h.substring(0,e.length)!=e)&&b[h]&&(!d||0<=d.indexOf(","+(f?f+".":"")+h+","))){k=!1;if(m)for(l=0;l<m.length;l++)h.substring(0,m[l].length)==m[l]&&(k=!0);if(!k&&(""==g&&(g+="&"+c+"."),l=b[h],e&&(h=h.substring(e.length)),0<h.length))if(k=h.indexOf("."),0<k)l=h.substring(0,k),k=(e?e:"")+l+".",m||(m=[]),m.push(k),g+=a.q(l,b,d,f,k);else if("boolean"==typeof l&&(l=l?"true":"false"),l){if("retrieveLightData"==
f&&0>e.indexOf(".contextData."))switch(k=h.substring(0,4),n=h.substring(4),h){case "transactionID":h="xact";break;case "channel":h="ch";break;case "campaign":h="v0";break;default:a.Pa(n)&&("prop"==k?h="c"+n:"eVar"==k?h="v"+n:"list"==k?h="l"+n:"hier"==k&&(h="h"+n,l=l.substring(0,255)))}g+="&"+a.escape(h)+"="+a.escape(l)}}""!=g&&(g+="&."+c)}return g};a.usePostbacks=0;a.Kb=function(){var c="",b,d,f,e,g,h,l,k,n="",m="",p=e="",r=a.V();if(a.lightProfileID)b=a.Q,(n=a.lightTrackVars)&&(n=","+n+","+a.ka.join(",")+
",");else{b=a.g;if(a.pe||a.linkType)n=a.linkTrackVars,m=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(n=a[e].Yb,m=a[e].Xb));n&&(n=","+n+","+a.G.join(",")+",");m&&(m=","+m+",",n&&(n+=",events,"));a.events2&&(p+=(""!=p?",":"")+a.events2)}if(r&&a.xa()&&r.getCustomerIDs){e=q;if(g=r.getCustomerIDs())for(d in g)Object.prototype[d]||(f=g[d],"object"==typeof f&&(e||(e={}),f.id&&(e[d+".id"]=f.id),f.authState&&(e[d+".as"]=f.authState)));e&&(c+=a.q("cid",e))}a.AudienceManagement&&
a.AudienceManagement.isReady()&&(c+=a.q("d",a.AudienceManagement.getEventCallConfigParams()));for(d=0;d<b.length;d++){e=b[d];g=a[e];f=e.substring(0,4);h=e.substring(4);g||("events"==e&&p?(g=p,p=""):"marketingCloudOrgID"==e&&r&&a.X("ECID")&&(g=r.marketingCloudOrgID));if(g&&(!n||0<=n.indexOf(","+e+","))){switch(e){case "customerPerspective":e="cp";break;case "marketingCloudOrgID":e="mcorgid";break;case "supplementalDataID":e="sdid";break;case "timestamp":e="ts";break;case "dynamicVariablePrefix":e=
"D";break;case "visitorID":e="vid";break;case "marketingCloudVisitorID":e="mid";break;case "analyticsVisitorID":e="aid";break;case "audienceManagerLocationHint":e="aamlh";break;case "audienceManagerBlob":e="aamb";break;case "authState":e="as";break;case "pageURL":e="g";255<g.length&&(a.pageURLRest=g.substring(255),g=g.substring(0,255));break;case "pageURLRest":e="-g";break;case "referrer":e="r";break;case "vmk":case "visitorMigrationKey":e="vmt";break;case "visitorMigrationServer":e="vmf";a.ssl&&
a.visitorMigrationServerSecure&&(g="");break;case "visitorMigrationServerSecure":e="vmf";!a.ssl&&a.visitorMigrationServer&&(g="");break;case "charSet":e="ce";break;case "visitorNamespace":e="ns";break;case "cookieDomainPeriods":e="cdp";break;case "cookieLifetime":e="cl";break;case "variableProvider":e="vvp";break;case "currencyCode":e="cc";break;case "channel":e="ch";break;case "transactionID":e="xact";break;case "campaign":e="v0";break;case "latitude":e="lat";break;case "longitude":e="lon";break;
case "resolution":e="s";break;case "colorDepth":e="c";break;case "javascriptVersion":e="j";break;case "javaEnabled":e="v";break;case "cookiesEnabled":e="k";break;case "browserWidth":e="bw";break;case "browserHeight":e="bh";break;case "connectionType":e="ct";break;case "homepage":e="hp";break;case "events":p&&(g+=(""!=g?",":"")+p);if(m)for(h=g.split(","),g="",f=0;f<h.length;f++)l=h[f],k=l.indexOf("="),0<=k&&(l=l.substring(0,k)),k=l.indexOf(":"),0<=k&&(l=l.substring(0,k)),0<=m.indexOf(","+l+",")&&(g+=
(g?",":"")+h[f]);break;case "events2":g="";break;case "contextData":c+=a.q("c",a[e],n,e);g="";break;case "lightProfileID":e="mtp";break;case "lightStoreForSeconds":e="mtss";a.lightProfileID||(g="");break;case "lightIncrementBy":e="mti";a.lightProfileID||(g="");break;case "retrieveLightProfiles":e="mtsr";break;case "deleteLightProfiles":e="mtsd";break;case "retrieveLightData":a.retrieveLightProfiles&&(c+=a.q("mts",a[e],n,e));g="";break;default:a.Pa(h)&&("prop"==f?e="c"+h:"eVar"==f?e="v"+h:"list"==
f?e="l"+h:"hier"==f&&(e="h"+h,g=g.substring(0,255)))}g&&(c+="&"+e+"="+("pev"!=e.substring(0,3)?a.escape(g):g))}"pev3"==e&&a.e&&(c+=a.e)}a.ja&&(c+="&lrt="+a.ja,a.ja=null);return c};a.C=function(a){var b=a.tagName;if("undefined"!=""+a.ec||"undefined"!=""+a.Tb&&"HTML"!=(""+a.Tb).toUpperCase())return"";b=b&&b.toUpperCase?b.toUpperCase():"";"SHAPE"==b&&(b="");b&&(("INPUT"==b||"BUTTON"==b)&&a.type&&a.type.toUpperCase?b=a.type.toUpperCase():!b&&a.href&&(b="A"));return b};a.La=function(a){var b=k.location,
d=a.href?a.href:"",f,e,g;f=d.indexOf(":");e=d.indexOf("?");g=d.indexOf("/");d&&(0>f||0<=e&&f>e||0<=g&&f>g)&&(e=a.protocol&&1<a.protocol.length?a.protocol:b.protocol?b.protocol:"",f=b.pathname.lastIndexOf("/"),d=(e?e+"//":"")+(a.host?a.host:b.host?b.host:"")+("/"!=d.substring(0,1)?b.pathname.substring(0,0>f?0:f)+"/":"")+d);return d};a.N=function(c){var b=a.C(c),d,f,e="",g=0;return b&&(d=c.protocol,f=c.onclick,!c.href||"A"!=b&&"AREA"!=b||f&&d&&!(0>d.toLowerCase().indexOf("javascript"))?f?(e=a.replace(a.replace(a.replace(a.replace(""+
f,"\r",""),"\n",""),"\t","")," ",""),g=2):"INPUT"==b||"SUBMIT"==b?(c.value?e=c.value:c.innerText?e=c.innerText:c.textContent&&(e=c.textContent),g=3):"IMAGE"==b&&c.src&&(e=c.src):e=a.La(c),e)?{id:e.substring(0,100),type:g}:0};a.bc=function(c){for(var b=a.C(c),d=a.N(c);c&&!d&&"BODY"!=b;)if(c=c.parentElement?c.parentElement:c.parentNode)b=a.C(c),d=a.N(c);d&&"BODY"!=b||(c=0);c&&(b=c.onclick?""+c.onclick:"",0<=b.indexOf(".tl(")||0<=b.indexOf(".trackLink("))&&(c=0);return c};a.Sb=function(){var c,b,d=a.linkObject,
f=a.linkType,e=a.linkURL,g,h;a.la=1;d||(a.la=0,d=a.clickObject);if(d){c=a.C(d);for(b=a.N(d);d&&!b&&"BODY"!=c;)if(d=d.parentElement?d.parentElement:d.parentNode)c=a.C(d),b=a.N(d);b&&"BODY"!=c||(d=0);if(d&&!a.linkObject){var l=d.onclick?""+d.onclick:"";if(0<=l.indexOf(".tl(")||0<=l.indexOf(".trackLink("))d=0}}else a.la=1;!e&&d&&(e=a.La(d));e&&!a.linkLeaveQueryString&&(g=e.indexOf("?"),0<=g&&(e=e.substring(0,g)));if(!f&&e){var m=0,n=0,p;if(a.trackDownloadLinks&&a.linkDownloadFileTypes)for(l=e.toLowerCase(),
g=l.indexOf("?"),h=l.indexOf("#"),0<=g?0<=h&&h<g&&(g=h):g=h,0<=g&&(l=l.substring(0,g)),g=a.linkDownloadFileTypes.toLowerCase().split(","),h=0;h<g.length;h++)(p=g[h])&&l.substring(l.length-(p.length+1))=="."+p&&(f="d");if(a.trackExternalLinks&&!f&&(l=e.toLowerCase(),a.Oa(l)&&(a.linkInternalFilters||(a.linkInternalFilters=k.location.hostname),g=0,a.linkExternalFilters?(g=a.linkExternalFilters.toLowerCase().split(","),m=1):a.linkInternalFilters&&(g=a.linkInternalFilters.toLowerCase().split(",")),g))){for(h=
0;h<g.length;h++)p=g[h],0<=l.indexOf(p)&&(n=1);n?m&&(f="e"):m||(f="e")}}a.linkObject=d;a.linkURL=e;a.linkType=f;if(a.trackClickMap||a.trackInlineStats)a.e="",d&&(f=a.pageName,e=1,d=d.sourceIndex,f||(f=a.pageURL,e=0),k.s_objectID&&(b.id=k.s_objectID,d=b.type=1),f&&b&&b.id&&c&&(a.e="&pid="+a.escape(f.substring(0,255))+(e?"&pidt="+e:"")+"&oid="+a.escape(b.id.substring(0,100))+(b.type?"&oidt="+b.type:"")+"&ot="+c+(d?"&oi="+d:"")))};a.Lb=function(){var c=a.la,b=a.linkType,d=a.linkURL,f=a.linkName;b&&(d||
f)&&(b=b.toLowerCase(),"d"!=b&&"e"!=b&&(b="o"),a.pe="lnk_"+b,a.pev1=d?a.escape(d):"",a.pev2=f?a.escape(f):"",c=1);a.abort&&(c=0);if(a.trackClickMap||a.trackInlineStats||a.Ob()){var b={},d=0,e=a.nb(),g=e?e.split("&"):0,h,l,k,e=0;if(g)for(h=0;h<g.length;h++)l=g[h].split("="),f=a.unescape(l[0]).split(","),l=a.unescape(l[1]),b[l]=f;f=a.account.split(",");h={};for(k in a.contextData)k&&!Object.prototype[k]&&"a.activitymap."==k.substring(0,14)&&(h[k]=a.contextData[k],a.contextData[k]="");a.e=a.q("c",h)+
(a.e?a.e:"");if(c||a.e){c&&!a.e&&(e=1);for(l in b)if(!Object.prototype[l])for(k=0;k<f.length;k++)for(e&&(g=b[l].join(","),g==a.account&&(a.e+=("&"!=l.charAt(0)?"&":"")+l,b[l]=[],d=1)),h=0;h<b[l].length;h++)g=b[l][h],g==f[k]&&(e&&(a.e+="&u="+a.escape(g)+("&"!=l.charAt(0)?"&":"")+l+"&u=0"),b[l].splice(h,1),d=1);c||(d=1);if(d){e="";h=2;!c&&a.e&&(e=a.escape(f.join(","))+"="+a.escape(a.e),h=1);for(l in b)!Object.prototype[l]&&0<h&&0<b[l].length&&(e+=(e?"&":"")+a.escape(b[l].join(","))+"="+a.escape(l),
h--);a.tb(e)}}}return c};a.nb=function(){if(a.useLinkTrackSessionStorage){if(a.Ca())return k.sessionStorage.getItem(a.R)}else return a.cookieRead(a.R)};a.Ca=function(){return k.sessionStorage?!0:!1};a.tb=function(c){a.useLinkTrackSessionStorage?a.Ca()&&k.sessionStorage.setItem(a.R,c):a.cookieWrite(a.R,c)};a.Mb=function(){if(!a.Wb){var c=new Date,b=p.location,d,f,e=f=d="",g="",h="",l="1.2",k=a.cookieWrite("s_cc","true",0)?"Y":"N",m="",q="";if(c.setUTCDate&&(l="1.3",(0).toPrecision&&(l="1.5",c=[],c.forEach))){l=
"1.6";f=0;d={};try{f=new Iterator(d),f.next&&(l="1.7",c.reduce&&(l="1.8",l.trim&&(l="1.8.1",Date.parse&&(l="1.8.2",Object.create&&(l="1.8.5")))))}catch(r){}}d=screen.width+"x"+screen.height;e=navigator.javaEnabled()?"Y":"N";f=screen.pixelDepth?screen.pixelDepth:screen.colorDepth;g=a.w.innerWidth?a.w.innerWidth:a.d.documentElement.offsetWidth;h=a.w.innerHeight?a.w.innerHeight:a.d.documentElement.offsetHeight;try{a.b.addBehavior("#default#homePage"),m=a.b.cc(b)?"Y":"N"}catch(s){}try{a.b.addBehavior("#default#clientCaps"),
q=a.b.connectionType}catch(t){}a.resolution=d;a.colorDepth=f;a.javascriptVersion=l;a.javaEnabled=e;a.cookiesEnabled=k;a.browserWidth=g;a.browserHeight=h;a.connectionType=q;a.homepage=m;a.Wb=1}};a.S={};a.loadModule=function(c,b){var d=a.S[c];if(!d){d=k["AppMeasurement_Module_"+c]?new k["AppMeasurement_Module_"+c](a):{};a.S[c]=a[c]=d;d.ib=function(){return d.qb};d.ub=function(b){if(d.qb=b)a[c+"_onLoad"]=b,a.fa(c+"_onLoad",[a,d],1)||b(a,d)};try{Object.defineProperty?Object.defineProperty(d,"onLoad",
{get:d.ib,set:d.ub}):d._olc=1}catch(f){d._olc=1}}b&&(a[c+"_onLoad"]=b,a.fa(c+"_onLoad",[a,d],1)||b(a,d))};a.o=function(c){var b,d;for(b in a.S)if(!Object.prototype[b]&&(d=a.S[b])&&(d._olc&&d.onLoad&&(d._olc=0,d.onLoad(a,d)),d[c]&&d[c]()))return 1;return 0};a.Ob=function(){return a.ActivityMap&&a.ActivityMap._c?!0:!1};a.Pb=function(){var c=Math.floor(1E13*Math.random()),b=a.visitorSampling,d=a.visitorSamplingGroup,d="s_vsn_"+(a.visitorNamespace?a.visitorNamespace:a.account)+(d?"_"+d:""),f=a.cookieRead(d);
if(b){b*=100;f&&(f=parseInt(f));if(!f){if(!a.cookieWrite(d,c))return 0;f=c}if(f%1E4>b)return 0}return 1};a.T=function(c,b){var d,f,e,g,h,k,m;m={};for(d=0;2>d;d++)for(f=0<d?a.Da:a.g,e=0;e<f.length;e++)if(g=f[e],(h=c[g])||c["!"+g]){if(h&&!b&&("contextData"==g||"retrieveLightData"==g)&&a[g])for(k in a[g])h[k]||(h[k]=a[g][k]);a[g]||(m["!"+g]=1);m[g]=a[g];a[g]=h}return m};a.$b=function(c){var b,d,f,e;for(b=0;2>b;b++)for(d=0<b?a.Da:a.g,f=0;f<d.length;f++)e=d[f],c[e]=a[e],c[e]||"prop"!==e.substring(0,4)&&
"eVar"!==e.substring(0,4)&&"hier"!==e.substring(0,4)&&"list"!==e.substring(0,4)&&"channel"!==e&&"events"!==e&&"eventList"!==e&&"products"!==e&&"productList"!==e&&"purchaseID"!==e&&"transactionID"!==e&&"state"!==e&&"zip"!==e&&"campaign"!==e&&"events2"!==e&&"latitude"!==e&&"longitude"!==e&&"ms_a"!==e&&"contextData"!==e&&"supplementalDataID"!==e&&"tnt"!==e&&"timestamp"!==e&&"abort"!==e&&"referrer"!==e||(c["!"+e]=1)};a.Gb=function(a){var b,d,f,e,g,h=0,k,m="",n="";if(a&&255<a.length&&(b=""+a,d=b.indexOf("?"),
0<d&&(k=b.substring(d+1),b=b.substring(0,d),e=b.toLowerCase(),f=0,"http://"==e.substring(0,7)?f+=7:"https://"==e.substring(0,8)&&(f+=8),d=e.indexOf("/",f),0<d&&(e=e.substring(f,d),g=b.substring(d),b=b.substring(0,d),0<=e.indexOf("google")?h=",q,ie,start,search_key,word,kw,cd,":0<=e.indexOf("yahoo.co")&&(h=",p,ei,"),h&&k)))){if((a=k.split("&"))&&1<a.length){for(f=0;f<a.length;f++)e=a[f],d=e.indexOf("="),0<d&&0<=h.indexOf(","+e.substring(0,d)+",")?m+=(m?"&":"")+e:n+=(n?"&":"")+e;m&&n?k=m+"&"+n:n=""}d=
253-(k.length-n.length)-b.length;a=b+(0<d?g.substring(0,d):"")+"?"+k}return a};a.bb=function(c){var b=a.d.visibilityState,d=["webkitvisibilitychange","visibilitychange"];b||(b=a.d.webkitVisibilityState);if(b&&"prerender"==b){if(c)for(b=0;b<d.length;b++)a.d.addEventListener(d[b],function(){var b=a.d.visibilityState;b||(b=a.d.webkitVisibilityState);"visible"==b&&c()});return!1}return!0};a.ca=!1;a.J=!1;a.wb=function(){a.J=!0;a.H()};a.K=!1;a.U=!1;a.xb=function(c){a.marketingCloudVisitorID=c.MCMID;a.visitorOptedOut=
c.MCOPTOUT;a.analyticsVisitorID=c.MCAID;a.audienceManagerLocationHint=c.MCAAMLH;a.audienceManagerBlob=c.MCAAMB;a.K=!1;a.U=!0;a.H()};a.ab=function(c){a.maxDelay||(a.maxDelay=250);return a.o("_d")?(c&&setTimeout(function(){c()},a.maxDelay),!1):!0};a.aa=!1;a.I=!1;a.za=function(){a.I=!0;a.H()};a.isReadyToTrack=function(){var c=!0;if(!a.mb()||!a.lb())return!1;a.xa()||(c=!1);a.pb()||(c=!1);return c};a.mb=function(){a.ca||a.J||(a.bb(a.wb)?a.J=!0:a.ca=!0);return a.ca&&!a.J?!1:!0};a.lb=function(){var c=a.va();
if(c)if(a.ta||a.ba)if(a.ta){if(!c.isApproved(c.Categories.ANALYTICS))return!1}else return!1;else return c.fetchPermissions(a.rb,!0),a.ba=!0,!1;return!0};a.X=function(c){var b=a.va();return b&&!b.isApproved(b.Categories[c])?!1:!0};a.va=function(){return k.adobe&&k.adobe.optIn?k.adobe.optIn:null};a.xa=function(){var c=a.V();return c&&c.getVisitorValues&&(a.K||a.U||(a.K=!0,c.getVisitorValues(a.xb)),a.K&&!a.U)?!1:!0};a.V=function(){var c=a.visitor;c&&!c.isAllowed()&&(c=null);return c};a.pb=function(){a.aa||
a.I||(a.ab(a.za)?a.I=!0:a.aa=!0);return a.aa&&!a.I?!1:!0};a.ba=!1;a.rb=function(){a.ba=!1;a.ta=!0};a.l=q;a.r=0;a.callbackWhenReadyToTrack=function(c,b,d){var f;f={};f.Bb=c;f.Ab=b;f.yb=d;a.l==q&&(a.l=[]);a.l.push(f);0==a.r&&(a.r=setInterval(a.H,100))};a.H=function(){var c;if(a.isReadyToTrack()&&(a.vb(),a.l!=q))for(;0<a.l.length;)c=a.l.shift(),c.Ab.apply(c.Bb,c.yb)};a.vb=function(){a.r&&(clearInterval(a.r),a.r=0)};a.kb=function(c){var b,d=q;if(!a.isReadyToTrack()){d={};a.$b(d);if(c!=q)for(b in c)d[b]=
c[b];a.callbackWhenReadyToTrack(a,a.track,[d]);return!0}return!1};a.Ib=function(){var c=a.cookieRead("s_fid"),b="",d="",f;f=8;var e=4;if(!c||0>c.indexOf("-")){for(c=0;16>c;c++)f=Math.floor(Math.random()*f),b+="0123456789ABCDEF".substring(f,f+1),f=Math.floor(Math.random()*e),d+="0123456789ABCDEF".substring(f,f+1),f=e=16;c=b+"-"+d}a.cookieWrite("s_fid",c,1)||(c=0);return c};a.t=a.track=function(c,b){var d,f=new Date,e="s"+Math.floor(f.getTime()/108E5)%10+Math.floor(1E13*Math.random()),g=f.getYear(),
g="t="+a.escape(f.getDate()+"/"+f.getMonth()+"/"+(1900>g?g+1900:g)+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()+" "+f.getDay()+" "+f.getTimezoneOffset()),h=a.V();a.o("_s");b&&a.T(b);a.kb(c)||(c&&(d=a.T(c,1)),a.Pb()&&!a.visitorOptedOut&&(a.wa()||(a.fid=a.Ib()),a.Sb(),a.usePlugins&&a.doPlugins&&a.doPlugins(a),a.account&&(a.abort||(a.trackOffline&&!a.timestamp&&(a.timestamp=Math.floor(f.getTime()/1E3)),f=k.location,a.pageURL||(a.pageURL=f.href?f.href:f),a.referrer||a.Za||(f=a.Util.getQueryParam("adobe_mc_ref",
null,null,!0),a.referrer=f||void 0===f?void 0===f?"":f:p.document.referrer),a.Za=1,a.referrer=a.Gb(a.referrer),a.o("_g")),a.Lb()&&!a.abort&&(h&&a.X("TARGET")&&!a.supplementalDataID&&h.getSupplementalDataID&&(a.supplementalDataID=h.getSupplementalDataID("AppMeasurement:"+a._in,a.expectSupplementalData?!1:!0)),a.X("AAM")||(a.contextData["cm.ssf"]=1),a.Mb(),g+=a.Kb(),a.ob(e,g),a.o("_t"),a.referrer=""))));a.abort=a.supplementalDataID=a.timestamp=a.pageURLRest=a.linkObject=a.clickObject=a.linkURL=a.linkName=
a.linkType=k.s_objectID=a.pe=a.pev1=a.pev2=a.pev3=a.e=a.lightProfileID=0;d&&a.T(d,1)};a.Ba=[];a.registerPreTrackCallback=function(c){for(var b=[],d=1;d<arguments.length;d++)b.push(arguments[d]);"function"==typeof c?a.Ba.push([c,b]):a.debugTracking&&a.D("DEBUG: Non function type passed to registerPreTrackCallback")};a.fb=function(c){a.ua(a.Ba,c)};a.Aa=[];a.registerPostTrackCallback=function(c){for(var b=[],d=1;d<arguments.length;d++)b.push(arguments[d]);"function"==typeof c?a.Aa.push([c,b]):a.debugTracking&&
a.D("DEBUG: Non function type passed to registerPostTrackCallback")};a.eb=function(c){a.ua(a.Aa,c)};a.ua=function(c,b){if("object"==typeof c)for(var d=0;d<c.length;d++){var f=c[d][0],e=c[d][1].slice();e.unshift(b);if("function"==typeof f)try{f.apply(null,e)}catch(g){a.debugTracking&&a.D(g.message)}}};a.tl=a.trackLink=function(c,b,d,f,e){a.linkObject=c;a.linkType=b;a.linkName=d;e&&(a.k=c,a.v=e);return a.track(f)};a.trackLight=function(c,b,d,f){a.lightProfileID=c;a.lightStoreForSeconds=b;a.lightIncrementBy=
d;return a.track(f)};a.clearVars=function(){var c,b;for(c=0;c<a.g.length;c++)if(b=a.g[c],"prop"==b.substring(0,4)||"eVar"==b.substring(0,4)||"hier"==b.substring(0,4)||"list"==b.substring(0,4)||"channel"==b||"events"==b||"eventList"==b||"products"==b||"productList"==b||"purchaseID"==b||"transactionID"==b||"state"==b||"zip"==b||"campaign"==b)a[b]=void 0};a.tagContainerMarker="";a.ob=function(c,b){var d=a.gb()+"/"+c+"?AQB=1&ndh=1&pf=1&"+(a.ya()?"callback=s_c_il["+a._in+"].doPostbacks&et=1&":"")+b+"&AQE=1";
a.fb(d);a.cb(d);a.W()};a.gb=function(){var c=a.hb();return"http"+(a.ssl?"s":"")+"://"+c+"/b/ss/"+a.account+"/"+(a.mobile?"5.":"")+(a.ya()?"10":"1")+"/JS-"+a.version+(a.Vb?"T":"")+(a.tagContainerMarker?"-"+a.tagContainerMarker:"")};a.ya=function(){return a.AudienceManagement&&a.AudienceManagement.isReady()||0!=a.usePostbacks};a.hb=function(){var c=a.dc,b=a.trackingServer;b?a.trackingServerSecure&&a.ssl&&(b=a.trackingServerSecure):(c=c?(""+c).toLowerCase():"d1","d1"==c?c="112":"d2"==c&&(c="122"),b=
a.jb()+"."+c+".2o7.net");return b};a.jb=function(){var c=a.visitorNamespace;c||(c=a.account.split(",")[0],c=c.replace(/[^0-9a-z]/gi,""));return c};a.Ya=/{(%?)(.*?)(%?)}/;a.Zb=RegExp(a.Ya.source,"g");a.Fb=function(c){if("object"==typeof c.dests)for(var b=0;b<c.dests.length;++b){var d=c.dests[b];if("string"==typeof d.c&&"aa."==d.id.substr(0,3))for(var f=d.c.match(a.Zb),e=0;e<f.length;++e){var g=f[e],h=g.match(a.Ya),k="";"%"==h[1]&&"timezone_offset"==h[2]?k=(new Date).getTimezoneOffset():"%"==h[1]&&
"timestampz"==h[2]&&(k=a.Jb());d.c=d.c.replace(g,a.escape(k))}}};a.Jb=function(){var c=new Date,b=new Date(6E4*Math.abs(c.getTimezoneOffset()));return a.j(4,c.getFullYear())+"-"+a.j(2,c.getMonth()+1)+"-"+a.j(2,c.getDate())+"T"+a.j(2,c.getHours())+":"+a.j(2,c.getMinutes())+":"+a.j(2,c.getSeconds())+(0<c.getTimezoneOffset()?"-":"+")+a.j(2,b.getUTCHours())+":"+a.j(2,b.getUTCMinutes())};a.j=function(a,b){return(Array(a+1).join(0)+b).slice(-a)};a.pa={};a.doPostbacks=function(c){if("object"==typeof c)if(a.Fb(c),
"object"==typeof a.AudienceManagement&&"function"==typeof a.AudienceManagement.isReady&&a.AudienceManagement.isReady()&&"function"==typeof a.AudienceManagement.passData)a.AudienceManagement.passData(c);else if("object"==typeof c&&"object"==typeof c.dests)for(var b=0;b<c.dests.length;++b){var d=c.dests[b];"object"==typeof d&&"string"==typeof d.c&&"string"==typeof d.id&&"aa."==d.id.substr(0,3)&&(a.pa[d.id]=new Image,a.pa[d.id].alt="",a.pa[d.id].src=d.c)}};a.cb=function(c){a.i||a.Nb();a.i.push(c);a.ia=
a.B();a.Wa()};a.Nb=function(){a.i=a.Qb();a.i||(a.i=[])};a.Qb=function(){var c,b;if(a.oa()){try{(b=k.localStorage.getItem(a.ma()))&&(c=k.JSON.parse(b))}catch(d){}return c}};a.oa=function(){var c=!0;a.trackOffline&&a.offlineFilename&&k.localStorage&&k.JSON||(c=!1);return c};a.Ma=function(){var c=0;a.i&&(c=a.i.length);a.p&&c++;return c};a.W=function(){if(a.p&&(a.A&&a.A.complete&&a.A.F&&a.A.ra(),a.p))return;a.Na=q;if(a.na)a.ia>a.P&&a.Ua(a.i),a.qa(500);else{var c=a.zb();if(0<c)a.qa(c);else if(c=a.Ja())a.p=
1,a.Rb(c),a.Ub(c)}};a.qa=function(c){a.Na||(c||(c=0),a.Na=setTimeout(a.W,c))};a.zb=function(){var c;if(!a.trackOffline||0>=a.offlineThrottleDelay)return 0;c=a.B()-a.Sa;return a.offlineThrottleDelay<c?0:a.offlineThrottleDelay-c};a.Ja=function(){if(0<a.i.length)return a.i.shift()};a.Rb=function(c){if(a.debugTracking){var b="AppMeasurement Debug: "+c;c=c.split("&");var d;for(d=0;d<c.length;d++)b+="\n\t"+a.unescape(c[d]);a.D(b)}};a.wa=function(){return a.marketingCloudVisitorID||a.analyticsVisitorID};
a.Z=!1;var t;try{t=JSON.parse('{"x":"y"}')}catch(w){t=null}t&&"y"==t.x?(a.Z=!0,a.Y=function(a){return JSON.parse(a)}):k.$&&k.$.parseJSON?(a.Y=function(a){return k.$.parseJSON(a)},a.Z=!0):a.Y=function(){return null};a.Ub=function(c){var b,d,f;a.wa()&&2047<c.length&&(a.$a()&&(d=1,b=new XMLHttpRequest),b&&(a.AudienceManagement&&a.AudienceManagement.isReady()||0!=a.usePostbacks)&&(a.Z?b.Ea=!0:b=0));!b&&a.Xa&&(c=c.substring(0,2047));!b&&a.d.createElement&&(0!=a.usePostbacks||a.AudienceManagement&&a.AudienceManagement.isReady())&&
(b=a.d.createElement("SCRIPT"))&&"async"in b&&((f=(f=a.d.getElementsByTagName("HEAD"))&&f[0]?f[0]:a.d.body)?(b.type="text/javascript",b.setAttribute("async","async"),d=2):b=0);b||(b=new Image,b.alt="",b.abort||"undefined"===typeof k.InstallTrigger||(b.abort=function(){b.src=q}));b.Ta=Date.now();b.Ga=function(){try{b.F&&(clearTimeout(b.F),b.F=0)}catch(a){}};b.onload=b.ra=function(){b.Ta&&(a.ja=Date.now()-b.Ta);a.eb(c);b.Ga();a.Db();a.da();a.p=0;a.W();if(b.Ea){b.Ea=!1;try{a.doPostbacks(a.Y(b.responseText))}catch(d){}}};
b.onabort=b.onerror=b.Ka=function(){b.Ga();(a.trackOffline||a.na)&&a.p&&a.i.unshift(a.Cb);a.p=0;a.ia>a.P&&a.Ua(a.i);a.da();a.qa(500)};b.onreadystatechange=function(){4==b.readyState&&(200==b.status?b.ra():b.Ka())};a.Sa=a.B();if(1==d)f=c.indexOf("?"),d=c.substring(0,f),f=c.substring(f+1),f=f.replace(/&callback=[a-zA-Z0-9_.\[\]]+/,""),b.open("POST",d,!0),b.withCredentials=!0,b.send(f);else if(b.src=c,2==d){if(a.Qa)try{f.removeChild(a.Qa)}catch(e){}f.firstChild?f.insertBefore(b,f.firstChild):f.appendChild(b);
a.Qa=a.A}b.F=setTimeout(function(){b.F&&(b.complete?b.ra():(a.trackOffline&&b.abort&&b.abort(),b.Ka()))},5E3);a.Cb=c;a.A=k["s_i_"+a.replace(a.account,",","_")]=b;if(a.useForcedLinkTracking&&a.L||a.v)a.forcedLinkTrackingTimeout||(a.forcedLinkTrackingTimeout=250),a.ea=setTimeout(a.da,a.forcedLinkTrackingTimeout)};a.$a=function(){return"undefined"!==typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest?!0:!1};a.Db=function(){if(a.oa()&&!(a.Ra>a.P))try{k.localStorage.removeItem(a.ma()),a.Ra=a.B()}catch(c){}};
a.Ua=function(c){if(a.oa()){a.Wa();try{k.localStorage.setItem(a.ma(),k.JSON.stringify(c)),a.P=a.B()}catch(b){}}};a.Wa=function(){if(a.trackOffline){if(!a.offlineLimit||0>=a.offlineLimit)a.offlineLimit=10;for(;a.i.length>a.offlineLimit;)a.Ja()}};a.forceOffline=function(){a.na=!0};a.forceOnline=function(){a.na=!1};a.ma=function(){return a.offlineFilename+"-"+a.visitorNamespace+a.account};a.B=function(){return(new Date).getTime()};a.Oa=function(a){a=a.toLowerCase();return 0!=a.indexOf("#")&&0!=a.indexOf("about:")&&
0!=a.indexOf("opera:")&&0!=a.indexOf("javascript:")?!0:!1};a.setTagContainer=function(c){var b,d,f;a.Vb=c;for(b=0;b<a._il.length;b++)if((d=a._il[b])&&"s_l"==d._c&&d.tagContainerName==c){a.T(d);if(d.lmq)for(b=0;b<d.lmq.length;b++)f=d.lmq[b],a.loadModule(f.n);if(d.ml)for(f in d.ml)if(a[f])for(b in c=a[f],f=d.ml[f],f)!Object.prototype[b]&&("function"!=typeof f[b]||0>(""+f[b]).indexOf("s_c_il"))&&(c[b]=f[b]);if(d.mmq)for(b=0;b<d.mmq.length;b++)f=d.mmq[b],a[f.m]&&(c=a[f.m],c[f.f]&&"function"==typeof c[f.f]&&
(f.a?c[f.f].apply(c,f.a):c[f.f].apply(c)));if(d.tq)for(b=0;b<d.tq.length;b++)a.track(d.tq[b]);d.s=a;break}};a.Util={urlEncode:a.escape,urlDecode:a.unescape,cookieRead:a.cookieRead,cookieWrite:a.cookieWrite,getQueryParam:function(c,b,d,f){var e,g="";b||(b=a.pageURL?a.pageURL:k.location);d=d?d:"&";if(!c||!b)return g;b=""+b;e=b.indexOf("?");if(0>e)return g;b=d+b.substring(e+1)+d;if(!f||!(0<=b.indexOf(d+c+d)||0<=b.indexOf(d+c+"="+d))){e=b.indexOf("#");0<=e&&(b=b.substr(0,e)+d);e=b.indexOf(d+c+"=");if(0>
e)return g;b=b.substring(e+d.length+c.length+1);e=b.indexOf(d);0<=e&&(b=b.substring(0,e));0<b.length&&(g=a.unescape(b));return g}},getIeVersion:function(){if(document.documentMode)return document.documentMode;for(var a=7;4<a;a--){var b=document.createElement("div");b.innerHTML="\x3c!--[if IE "+a+"]><span></span><![endif]--\x3e";if(b.getElementsByTagName("span").length)return a}return null}};a.G="supplementalDataID timestamp dynamicVariablePrefix visitorID marketingCloudVisitorID analyticsVisitorID audienceManagerLocationHint authState fid vmk visitorMigrationKey visitorMigrationServer visitorMigrationServerSecure charSet visitorNamespace cookieDomainPeriods fpCookieDomainPeriods cookieLifetime pageName pageURL customerPerspective referrer contextData currencyCode lightProfileID lightStoreForSeconds lightIncrementBy retrieveLightProfiles deleteLightProfiles retrieveLightData".split(" ");
a.g=a.G.concat("purchaseID variableProvider channel server pageType transactionID campaign state zip events events2 products audienceManagerBlob tnt".split(" "));a.ka="timestamp charSet visitorNamespace cookieDomainPeriods cookieLifetime contextData lightProfileID lightStoreForSeconds lightIncrementBy".split(" ");a.Q=a.ka.slice(0);a.Da="account allAccounts debugTracking visitor visitorOptedOut trackOffline offlineLimit offlineThrottleDelay offlineFilename usePlugins doPlugins configURL visitorSampling visitorSamplingGroup linkObject clickObject linkURL linkName linkType trackDownloadLinks trackExternalLinks trackClickMap trackInlineStats linkLeaveQueryString linkTrackVars linkTrackEvents linkDownloadFileTypes linkExternalFilters linkInternalFilters useForcedLinkTracking forcedLinkTrackingTimeout useLinkTrackSessionStorage trackingServer trackingServerSecure ssl abort mobile dc lightTrackVars maxDelay expectSupplementalData usePostbacks registerPreTrackCallback registerPostTrackCallback AudienceManagement".split(" ");
for(m=0;250>=m;m++)76>m&&(a.g.push("prop"+m),a.Q.push("prop"+m)),a.g.push("eVar"+m),a.Q.push("eVar"+m),6>m&&a.g.push("hier"+m),4>m&&a.g.push("list"+m);m="pe pev1 pev2 pev3 latitude longitude resolution colorDepth javascriptVersion javaEnabled cookiesEnabled browserWidth browserHeight connectionType homepage pageURLRest marketingCloudOrgID ms_a".split(" ");a.g=a.g.concat(m);a.G=a.G.concat(m);a.ssl=0<=k.location.protocol.toLowerCase().indexOf("https");a.charSet="UTF-8";a.contextData={};a.offlineThrottleDelay=
0;a.offlineFilename="AppMeasurement.offline";a.R="s_sq";a.Sa=0;a.ia=0;a.P=0;a.Ra=0;a.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";a.w=k;a.d=k.document;try{if(a.Xa=!1,navigator){var v=navigator.userAgent;if("Microsoft Internet Explorer"==navigator.appName||0<=v.indexOf("MSIE ")||0<=v.indexOf("Trident/")&&0<=v.indexOf("Windows NT 6"))a.Xa=!0}}catch(x){}a.da=function(){a.ea&&(k.clearTimeout(a.ea),a.ea=q);a.k&&a.L&&a.k.dispatchEvent(a.L);a.v&&("function"==typeof a.v?
a.v():a.k&&a.k.href&&(a.d.location=a.k.href));a.k=a.L=a.v=0};a.Va=function(){a.b=a.d.body;a.b?(a.u=function(c){var b,d,f,e,g;if(!(a.d&&a.d.getElementById("cppXYctnr")||c&&c["s_fe_"+a._in])){if(a.Fa)if(a.useForcedLinkTracking)a.b.removeEventListener("click",a.u,!1);else{a.b.removeEventListener("click",a.u,!0);a.Fa=a.useForcedLinkTracking=0;return}else a.useForcedLinkTracking=0;a.clickObject=c.srcElement?c.srcElement:c.target;try{if(!a.clickObject||a.O&&a.O==a.clickObject||!(a.clickObject.tagName||
a.clickObject.parentElement||a.clickObject.parentNode))a.clickObject=0;else{var h=a.O=a.clickObject;a.ha&&(clearTimeout(a.ha),a.ha=0);a.ha=setTimeout(function(){a.O==h&&(a.O=0)},1E4);f=a.Ma();a.track();if(f<a.Ma()&&a.useForcedLinkTracking&&c.target){for(e=c.target;e&&e!=a.b&&"A"!=e.tagName.toUpperCase()&&"AREA"!=e.tagName.toUpperCase();)e=e.parentNode;if(e&&(g=e.href,a.Oa(g)||(g=0),d=e.target,c.target.dispatchEvent&&g&&(!d||"_self"==d||"_top"==d||"_parent"==d||k.name&&d==k.name))){try{b=a.d.createEvent("MouseEvents")}catch(l){b=
new k.MouseEvent}if(b){try{b.initMouseEvent("click",c.bubbles,c.cancelable,c.view,c.detail,c.screenX,c.screenY,c.clientX,c.clientY,c.ctrlKey,c.altKey,c.shiftKey,c.metaKey,c.button,c.relatedTarget)}catch(m){b=0}b&&(b["s_fe_"+a._in]=b.s_fe=1,c.stopPropagation(),c.stopImmediatePropagation&&c.stopImmediatePropagation(),c.preventDefault(),a.k=c.target,a.L=b)}}}}}catch(n){a.clickObject=0}}},a.b&&a.b.attachEvent?a.b.attachEvent("onclick",a.u):a.b&&a.b.addEventListener&&(navigator&&(0<=navigator.userAgent.indexOf("WebKit")&&
a.d.createEvent||0<=navigator.userAgent.indexOf("Firefox/2")&&k.MouseEvent)&&(a.Fa=1,a.useForcedLinkTracking=1,a.b.addEventListener("click",a.u,!0)),a.b.addEventListener("click",a.u,!1))):setTimeout(a.Va,30)};a.Eb();a.fc||(r?a.setAccount(r):a.D("Error, missing Report Suite ID in AppMeasurement initialization"),a.Va(),a.loadModule("ActivityMap"))}
function s_gi(r){var a,k=window.s_c_il,q,p,m=r.split(","),s,u,t=0;if(k)for(q=0;!t&&q<k.length;){a=k[q];if("s_c"==a._c&&(a.account||a.oun))if(a.account&&a.account==r)t=1;else for(p=a.account?a.account:a.oun,p=a.allAccounts?a.allAccounts:p.split(","),s=0;s<m.length;s++)for(u=0;u<p.length;u++)m[s]==p[u]&&(t=1);q++}t?a.setAccount&&a.setAccount(r):a=new AppMeasurement(r);return a}AppMeasurement.getInstance=s_gi;window.s_objectID||(window.s_objectID=0);
function s_pgicq(){var r=window,a=r.s_giq,k,q,p;if(a)for(k=0;k<a.length;k++)q=a[k],p=s_gi(q.oun),p.setAccount(q.un),p.setTagContainer(q.tagContainerName);r.s_giq=0}s_pgicq();

urlParams={
	currentLocation: document.location.href,
	DELIMETER: '&',
	argumentList: [],
	parameterList: [],
	parseParameters: function(){
		this.parameterList = [];
		if(this.currentLocation.indexOf('?') != -1) {
			var s = this.currentLocation.substring(this.currentLocation.indexOf('?')+1);
			var parameters = s.split("&");
			for(var i=0; i <= parameters.length-1; i++){
				this.parameterList[this.parameterList.length] = parameters[i].split('=')[0]
				this.parameterList[this.parameterList.length] = parameters[i].split('=')[1]
			}
		}
		return this.parameterList;
	},
	getParameter: function(name){
		paramValue = '';
		if(this.currentLocation.indexOf(name + '=') != -1) {
			paramValue = this.currentLocation.substring(this.currentLocation.indexOf(name+'=')+name.length+1, this.currentLocation.length);
			if(paramValue.indexOf(this.DELIMETER)!=-1) paramValue = paramValue.substring(0, paramValue.indexOf(this.DELIMETER));
			/* NO DELIMETER EXISTS, COPY TO END OF STRING
			else paramValue = paramValue;
			*/
		}
		if(paramValue) return paramValue
		else return '';
	},
	getParameterNames: function(){
		//get a list of all param names
		this.parseParameters();
		var parameterNames = [];
		if(this.currentLocation.indexOf('?') != -1) {
			var s = this.currentLocation.substring(this.currentLocation.indexOf('?')+1);
			var parameters = s.split("&");
			for(var i=0; i <= parameters.length-1; i++){
				parameterNames[parameterNames.length] = parameters[i].split('=')[0]
			}
		}
		return parameterNames;
	},
	getParameterValues: function(String){
		//get a list of all param values
		this.parseParameters();
		var parameterValues = [];
		if(this.currentLocation.indexOf('?') != -1) {
			var s = this.currentLocation.substring(this.currentLocation.indexOf('?')+1);
			var parameters = s.split("&");
			for(var i=0; i <= parameters.length-1; i++){
				parameterValues[parameterValues.length] = parameters[i].split('=')[1]
			}
		}
		return parameterValues;
	},
	setArgument: function(String, Value){
		//set a url arg
	},
	getArguments: function(){
		var args="";
		for(var arg in arguments) {
			if(typeof arguments[arg] != "function") {
				if(args.length > 0) {
					args += "&";
				}
				args += arg + "=" + arguments[arg];
			}
		}
		return args;
	},
	makeSearchString: function(){
		var args = arguments;
		var searchString = "?";
		var pair;
		for(var i=0; i<args.length; i++){
			if(typeof(args[i]) == typeof([])){
				for(var j=0; j<args[i].length; j++){
					pair = escape(args[i][j++]) + "=";
					pair += escape(args[i][j]);
					searchString += pair + "&";					
				}
			}else{
				pair = escape(args[i++]) + "=";
				pair += escape(args[i]);
				searchString += pair + "&";
			}
		}
		return searchString.substring(0, searchString.length - 1);
	},
	resubmitPage: function(){
		var args = arguments;
		this.parseParameters();
		var url = (this.currentLocation.indexOf('?')!=-1) ? this.currentLocation.substring(0, this.currentLocation.indexOf('?')) : this.currentLocation;
		var paramList = this.parameterList;
		for(var i=0; i<args.length; i++){
			var found=false;
			for(var j=0; j<paramList.length; j++){
				n=args[i];v=args[i+1];
				if(paramList[j]==n){
					paramList[j+1]=v;found=true;
				}
			}
			if(!found){
				paramList[paramList.length] = escape(args[i++]);
				paramList[paramList.length] = escape(args[i]);
			}else{i++}
		}
		var s = this.makeSearchString(paramList)
		document.location.href = url + s;
	}

}

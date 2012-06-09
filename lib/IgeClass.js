/*
	Isogenic Game Engine - Class generator
	--------------------------------------
	
	This code is part of the Isogenic Game Engine, however it is released
	under a separate license from other parts of the engine and can be used,
	reproduced, copied and distributed for all types of projects.
	
	Rob Evans
	Irrelon Software Limited
	http://www.isogenicengine.com
	------------------------------------------------------------------------
	
	Usage:
	
	// Define a new class
	var YourClass = new IgeClass({
		
		_tx: null, // Simple property
		
		init: function (arg1, arg2) {
			
			// Your constructor code here
			
		},
		
		setTx: function (tx) {
			
			// A simple method
			this._tx = tx;
			console.log(tx);
			
		},
		
		getTx: function () {
			
			return this._tx;
			
		}
		
	});
	
	// Create a new instance of your class
	var classInstance = new YourClass(arg1, arg2);
*/

/** IgeClass - Allows the creation of classes that follow the same definition as MooTools classes without the MooTools dependency. {
	engine_ver:"0.0.3",
	category:"class",
} **/
IgeClass = function (params) {
	
	var newClass = this.create(params);
	
	if (params['Depends'])
	{
		
		this.loadDepends(params['Depends']);
		
	} else {
		
		if (params['Extends']) { this.process(newClass, params['Extends'].prototype); }
		this.process(newClass, params);
		
	}
	
	// Return our new class
	return newClass;
	
}

/* IgeClass.prototype.create - Define the new class with params.initialize or blank function */
IgeClass.prototype.create = function (params) {
	return function () { this.bind = IgeClass.prototype.bind; this.log = IgeClass.prototype.log; params['init'].apply(this, arguments); } || function () {};
}

/* IgeClass.prototype.loadDepends - Load any scripts that this class depends on */
IgeClass.prototype.loadDepends = function (depends) {
	var script = new IgeElement('script', {src: source, type: 'text/javascript'});	
}

/* IgeClass.prototype.process - Process passed parameters and add them to newClass.prototype */
IgeClass.prototype.process = function (newClass, params) {
	
	for (var param in params)
	{
		
		switch (typeof params[param])
		{
			
			case 'function' && param != 'initialize' && param != 'Extends':
				newClass.prototype[param] = params[param];
			break;
			
			default:
				newClass.prototype[param] = params[param];
			break;
			
		}
		
	}
	
	return newClass;
	
}

/* bind - Function to replace the "this" of the method by the "this" of the caller */
IgeClass.prototype.bind = function(Method, ignoreNullMethod) {
	
	if (typeof Method == 'function') {
		var _this = this;
		return(
			function(){
				return( Method.apply( _this, arguments ) );
			}
		);
	} else {
		if (!ignoreNullMethod) {
			this.log('An attempt to use bind against a method that does not exist was made!', 'warning');
		}
		return (function () { });
	}
	
},

/* log - Logs the param argument to the console based upon the level parameter */
IgeClass.prototype.log = function (param, level, obj) {
	
	var debugOn = false;
	var debugLevel = [];
	var breakOnError = false;
	var isServer = false;
	var isSandboxed = false;
	
	if (!level) { level = 'info'; }
	
	if ((this.engine && this.engine.config) || (this.config && this.config.debug)) {
		/* CEXCLUDE */
		if (this.engine != null) { 
			// Use settings from engine config
			debugOn = this.engine.config.debug;
			debugLevel = this.engine.config.debugLevel;
			breakOnError = this.engine.config.debugBreakOnError;
			isSandboxed = this.engine.config.sandbox;
		} else if (this.config != null) {
			// Use settings from config
			debugOn = this.config.debug;
			debugLevel = this.config.debugLevel;
			breakOnError = this.config.debugBreakOnError;
			isSandboxed = this.config.sandbox;
		} else {
			// Set some defaults
			debugOn = true;
			debugLevel = ['info', 'warning', 'error', 'log'];
			breakOnError = true;
			isSandboxed = true;
		}
		isServer = true;
		/* CEXCLUDE */
	} else {
		// Client-side debugging
		debugOn = window.igeDebug;
		debugLevel = window.igeDebugLevel;
		breakOnError = window.igeDebugBreakOnError;
	}
	if (!isSandboxed) {
		var className = this._className || "Unnamed Class";
			
		if (debugOn && valueIn(level, debugLevel))
		{
			
			if (console != null) {
				switch (level)
				{
					
					case 'log':
						if (obj) { console.log(obj); }
						console.log("IGE *" + level + "* [" + className + "] :");
						console.log(param);
					break;
					
					case 'info':
						if (obj) { console.log(obj); }
						console.info("IGE *" + level + "* [" + className + "] : " + param);
					break;
					
					case 'error':
						if (obj) { console.log(obj); }
						if (breakOnError) {
							throw("IGE *" + level + "* [" + className + "] : " + param);
						} else {
							console.log("IGE *" + level + "* [" + className + "] :");
						}
					break;
					
					case 'warning':
						if (obj) { console.log(obj); }
						console.warn("IGE *" + level + "* [" + className + "] : " + param);
					break;
					
				}
			}
			
		}
	}
	
}

/* valueIn - Checks if a value is contained in an array */
var valueIn = function (value, arr) {
	for (var index =0; index < arr.length; index++) {
		if (arr[index] == value) { return true; }
	}
	
	return false;
}
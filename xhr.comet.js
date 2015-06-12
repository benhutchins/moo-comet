/* -----------------------------------------------------------------

	Script: 
		A mootools comet wrapper

		@script		XHR.Comet
		@version	0.1
		@author		Benjamin Hutchins
		@date		May 29th, 2008

	Copyright:
		Copyright (c) 2008, Benjamin Hutchins <http://www.xvolter.com/>

	License:
		MIT license

   ----------------------------------------------------------------- */

XHR.Comet = new Class({

	tunnel: null,
	type: 0,

	options: {
		url: '',
		name: "MooComet",
		onPush: Class.empty
	},

	initialize: function(options) {
		this.setOptions(options);

		this.type = (window.ie ? 3 : (window.opera ? 2 : 1));

		if(this.type > 1) {
			this.options.url = this.options.url + (this.options.url.search("\\?")>-1?"&":"?") + "cometType=" + this.type + "&cometName=" + this.options.name;
		}

		if (this.type == 3) {
			this.tunnel = new ActiveXObject("htmlfile");
		}

		else if (this.type == 2){
			this.tunnel = document.createElement("event-source");
		}

		else {
			this.tunnel = new XHR.Comet.XHR(this.options.url, this.options);
			this.tunnel.addCallback(this.onChange.bind(this), {readyState: false, status: false});
		}

		return this;
	},

	cancel: function() {
	       if (this.type == 3) {
		       this.tunnel.body.innerHTML="<iframe src='about:blank'></iframe>";
	       }

	       else if (this.type == 2) {
		       document.body.removeChild(this.tunnel);
	       }

	       else {
		       this.tunnel.cancel();
	       }

	       return this;
	},

	send: function() {
		if (this.type == 3) {
			this.tunnel.open();
			this.tunnel.write("<html><body></body></html>");
			this.tunnel.close();
			this.tunnel.parentWindow._cometObject = this;
			this.tunnel.body.innerHTML = "<iframe src='" + this.options.url + "'></iframe>";
		}

		else if (this.type == 2) {
			this.tunnel.setAttribute("src", this.options.url);
			document.body.appendChild(this.tunnel);
			this.tunnel.addEventListener(this.options.name, this.onChange.bind(this), false);
		}

		else {
			this.tunnel.send(this.options.url, {data: {'cometType': 1, 'cometName': this.options.name}});
		}

		return this;
	},

	onChange: function(text, xml) {
		var response = null;
		if(this.type == 2)
			response = arguments[0].data;
		else {
			response = text.split("<end />");
			response = response[response.length-1];
		}
		this.fireEvent('onPush', response);
	}
});
XHR.Comet.implement(new Events, new Options);

XHR.Comet.XHR = XHR.extend({
	callbacks: [],

	check: function() {
		return true;
		/*if (!this.timer) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.start.bind(this, arguments)); return false;
		}
		return false;*/
	},

	addCallback: function(fn, options){

		options = $extend({
			fn: Class.empty,
			readyState: 4,
			status: 200
		}, options);

		this.callbacks.push($extend(options, {fn: fn}));
		return this;
	},

	onStateChange: function(){
		//if (!this.running) return;

		this.status = 0;
		try {
			this.status = this.transport.status;
		} catch(e) {}

		this.response = {text: this.transport.responseText, xml: this.transport.responseXML};

		this.callbacks.forEach(function(callback) {
			if (callback.readyState != false && callback.readyState != this.transport.readyState)
				return;

			if (callback.status != false && callback.status != this.status)
				return;

			callback.fn(this.response.text, this.response.xml);
		}, this);
	}
});

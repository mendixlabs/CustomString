(function() {
	'use strict';

	dojo.provide('CustomString.widget.CustomString');
		
	dojo.declare('CustomString.widget.CustomString', [ mxui.widget._WidgetBase, dijit._TemplatedMixin ], {

		templateString : '<div class="CustomString-container" dojoAttachPoint="customString"></div>',

		_contextGuid			: null,
		_contextObj				: null,
		_objSub					: null,
		 
		// DOJO.WidgetBase -> PostCreate is fired after the properties of the widget are set.
		postCreate: function() {
			// Setup events
			
		},

		update : function (obj, callback) {
			if(typeof obj === 'string'){
				this._contextGuid = obj;
				mx.data.get({
					guids    : [obj],
					callback : dojo.hitch(this, function (objArr) {
						if (objArr.length === 1)
							this._loadData(objArr[0],this.customString);
						else
							console.log('Could not find the object corresponding to the received object ID.')
					})
				});
			} else if(obj === null){
				// Sorry no data no show!
				console.log('Whoops... the customString has no context object passed to it!');
			} else {
				// Attach to data refresh.
				if (this._objSub)
					this.unsubscribe(this._objSub);

				this._objSub = mx.data.subscribe({
					guid : obj.getGuid(),
					callback : dojo.hitch(this, this.update)
				});
				// Load data
				this._loadData(obj,this.customString);
			}

			if(typeof callback !== 'undefined') {
				callback();
			}
		},

		_loadData : function (obj,divElement) {
			mx.data.action({
			    params       : {
			        actionname : this.sourceMF,
			        applyto     : "selection",
			        guids       : [obj.getGuid()]

			    },		
			    callback     : dojo.hitch(this,function(returnedString) {
			        // no MxObject expected
			        divElement.innerHTML = this.checkString(returnedString, this.renderHTML);
			    }),
			    error        : dojo.hitch(this, function(error) {
			        alert(error.description);
			    }),
			    onValidation : dojo.hitch(this, function(validations) {
			        alert("There were " + validation.length + " validation errors");
			    })
			});
		},

		checkString : function (string, htmlBool) {
        if(string.indexOf("<script") > -1 || !htmlBool)
            string = mxui.dom.escapeHTML(string);   
        return string;  
    	}
	});
})();
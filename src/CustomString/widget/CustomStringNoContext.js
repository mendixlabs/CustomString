
// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require([
    'dojo/_base/declare', 
    'dojo/_base/lang',
    'CustomString/widget/CustomString'
], function (declare, dojoLang,_customStringNoContextWidget) {
   
    // Declare widget's prototype.
    return declare("CustomString.widget.CustomStringNoContext", [ _customStringNoContextWidget ], {

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function() {
            this._setupEvents();
            this._render();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        
         // Attach events to HTML dom elements
        _setupEvents: function() {
            if(this.mfToExecute){
                this.connect(this.customString, "click", this._executeMicroflow)};
        },
        
   
        _render : function () {
           mx.data.action({
                params       : {
                    actionname : this.sourceMF
                },      
                callback     : dojoLang.hitch(this, this._processSourceMFCallback),
                error        : dojoLang.hitch(this, function(error) {
                    alert(error.description);
                }),
                onValidation : dojoLang.hitch(this, function(validations) {
                    alert("There were " + validations.length + " validation errors");
                })
            });
        },

        _executeMicroflow: function () {
            if (this.mfToExecute) {
                mx.data.action({
                    store: {
                       caller: this.mxform
                    },
                    params: {
                        actionname: this.mfToExecute
                    },
                    callback: function () {
                        // ok
                    },
                    error: function () {
                        // error
                    }

                });
            }
        },


    });
});

require(["CustomString/widget/CustomStringNoContext"], function() {
    "use strict";
});

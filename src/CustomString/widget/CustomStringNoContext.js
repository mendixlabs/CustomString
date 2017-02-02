
// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "CustomString/widget/CustomString"
], function (declare, dojoLang,_customStringNoContextWidget) {

    // Declare widget's prototype.
    return declare("CustomString.widget.CustomStringNoContext", [ _customStringNoContextWidget ], {

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            this._setupEvents();
        },

        // Attach events to HTML dom elements
        _setupEvents: function() {
            logger.debug(this.id + "._setupEvents");
            if (this.mfToExecute) {
                this.connect(this.customString, "click", this._executeMicroflow);
            }
        },

        _render : function (callback) {
            logger.debug(this.id + "._render");
            mx.ui.action(this.sourceMF, {
                callback     : dojoLang.hitch(this, this._processSourceMFCallback, callback),
                error        : dojoLang.hitch(this, function(error) {
                    alert(error.description);
                    mendix.lang.nullExec(callback);
                }),
                onValidation : dojoLang.hitch(this, function(validations) {
                    alert("There were " + validations.length + " validation errors");
                    mendix.lang.nullExec(callback);
                })
            }, this);
        },

        _executeMicroflow: function () {
            logger.debug(this.id + "._executeMicroflow");
            if (this.mfToExecute) {
                mx.ui.action(this.mfToExecute, {}, this);
            }
        }

    });
});

require(["CustomString/widget/CustomStringNoContext"], function() {
    "use strict";
});

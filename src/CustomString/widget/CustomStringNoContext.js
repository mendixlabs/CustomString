require([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "CustomString/widget/CustomString"
], function (declare, lang, _customStringNoContextWidget) {

    return declare("CustomString.widget.CustomStringNoContext", [ _customStringNoContextWidget ], {

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            this._setupEvents();
        },

        _setupEvents: function() {
            logger.debug(this.id + "._setupEvents");
            if (this.mfToExecute) {
                this.connect(this.customString, "click", this._executeMicroflow);
            }
        },

        _render : function (callback) {
            logger.debug(this.id + "._render");
            mx.ui.action(this.sourceMF, {
                callback     : lang.hitch(this, this._processSourceMFCallback, callback),
                error        : lang.hitch(this, function(error) {
                    alert(error.description);
                    this._executeCallback(callback, "_render error cb");
                }),
                onValidation : lang.hitch(this, function(validations) {
                    alert("There were " + validations.length + " validation errors");
                    this._executeCallback(callback, "_render onvalidation cb");
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

require(["CustomString/widget/CustomStringNoContext"]);

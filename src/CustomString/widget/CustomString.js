define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/html",
    "mxui/dom",
    "dojo/text!CustomString/widget/template/CustomString.html"
], function(declare, _WidgetBase, _TemplatedMixin, dojoArray, lang, html, dom, widgetTemplate) {
    "use strict";

    return declare("CustomString.widget.CustomString", [ _WidgetBase, _TemplatedMixin ], {

        templateString: widgetTemplate,

        // Parameters configured in the Modeler.
        sourceMF: "",
        renderHTML: "",

        // Internal
        _handles: null,
        _contextObj: null,
        _alertDiv: null,

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            this._setupEvents();
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;

            if (this._contextObj) {
                this._resetSubscriptions();
                this._updateRendering(callback);
            } else if (this._render){
                this._render(callback);
            } else {
                this._executeCallback(callback, "update");
            }
        },

        _setupEvents: function() {
            logger.debug(this.id + "._setupEvents");
            this.connect(this.customString, "click", function(e) {
                // If a microflow has been set execute the microflow on a click.
                if (this.mfToExecute !== "") {
                    mx.ui.action(this.mfToExecute, {
                        params: {
                            applyto: "selection",
                            guids: [ this._contextObj.getGuid() ]
                        },
                        callback: function(obj) {},
                        error: lang.hitch(this, function(error) {
                            console.log(this.id + ": An error occurred while executing microflow: " + error.description);
                        })
                    }, this);
                }
            });
        },

        _updateRendering : function (callback) {
            logger.debug(this.id + "._updateRendering");
            mx.ui.action(this.sourceMF, {
                params: {
                    applyto     : "selection",
                    guids       : [this._contextObj.getGuid()]
                },
                callback     : lang.hitch(this, this._processSourceMFCallback, callback),
                error        : lang.hitch(this, function(error) {
                    alert(error.description);
                    this._executeCallback(callback, "_updateRendering error");
                }),
                onValidation : lang.hitch(this, function(validations) {
                    alert("There were " + validations.length + " validation errors");
                    this._executeCallback(callback, "_updateRendering onValidation");
                })
            }, this);
        },

        _processSourceMFCallback: function (callback, returnedString) {
            logger.debug(this.id + "._processSourceMFCallback");
            if (this.customString) {
                html.set(this.customString, this.checkString(returnedString, this.renderHTML));
            }
            this._executeCallback(callback, "_processSourceMFCallback");
        },

        checkString : function (string, htmlBool) {
            logger.debug(this.id + ".checkString");
            if (!string) {
                return "";
            }
            if (string.indexOf("<script") > -1 || !htmlBool) {
                logger.debug(this.id + ".checkString escape String");
                string = dom.escapeString(string);
            }
            return string;
        },

        _resetSubscriptions: function() {
            logger.debug(this.id + "._resetSubscriptions");
            this.unsubscribeAll();

            if (this._contextObj) {
                this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: lang.hitch(this, function(guid) {
                        this._updateRendering();
                    })
                });
            }
        },

        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["CustomString/widget/CustomString"]);

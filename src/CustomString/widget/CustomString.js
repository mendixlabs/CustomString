/*
    CustomString
    ========================

    @file      : CustomString.js
    @version   : 2.0.0
    @author    : Roeland Salij
    @date      : Thursday, December 03, 2015
    @copyright : Mendix 2015
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/html",
    "mxui/dom",
    "dojo/text!CustomString/widget/template/CustomString.html"
], function(declare, _WidgetBase, _TemplatedMixin, dojoArray, dojoLang, html, dom, widgetTemplate) {
    "use strict";

    // Declare widget's prototype.
    return declare("CustomString.widget.CustomString", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // Parameters configured in the Modeler.
        sourceMF: "",
        renderHTML: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function() {
            logger.level(logger.DEBUG);
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;

            if (this._contextObj) {
                this._resetSubscriptions();
                this._updateRendering(callback);
            } else if (this._render){
                this._render(callback);
            } else {
                mendix.lang.nullExec(callback);
            }
        },

         // Attach events to HTML dom elements
        _setupEvents: function() {
            logger.debug(this.id + "._setupEvents");
            this.connect(this.customString, "click", function(e) {
                // If a microflow has been set execute the microflow on a click.
                if (this.mfToExecute !== "") {
                    mx.data.action({
                        params: {
                            applyto: "selection",
                            actionname: this.mfToExecute,
                            guids: [ this._contextObj.getGuid() ]
                        },
                        store: {
                            caller: this.mxform
                        },
                        callback: function(obj) {
                            //TODO what to do when all is ok!
                        },
                        error: dojoLang.hitch(this, function(error) {
                            console.log(this.id + ": An error occurred while executing microflow: " + error.description);
                        })
                    }, this);
                }
            });
        },

        _updateRendering : function (callback) {
            logger.debug(this.id + "._updateRendering");
            mx.data.action({
                params       : {
                    actionname : this.sourceMF,
                    applyto     : "selection",
                    guids       : [this._contextObj.getGuid()]

                },
                store: {
                    caller: this.mxform
                },
                callback     : dojoLang.hitch(this, this._processSourceMFCallback, callback),
                error        : dojoLang.hitch(this, function(error) {
                    alert(error.description);
                    mendix.lang.nullExec(callback);
                }),
                onValidation : dojoLang.hitch(this, function(validations) {
                    alert("There were " + validations.length + " validation errors");
                    mendix.lang.nullExec(callback);
                })
            });
        },


        _processSourceMFCallback: function (callback, returnedString) {
            logger.debug(this.id + "._processSourceMFCallback");
            html.set(this.customString, this.checkString(returnedString, this.renderHTML));
            mendix.lang.nullExec(callback);
        },

        checkString : function (string, htmlBool) {
            logger.debug(this.id + ".checkString");
            if (string.indexOf("<script") > -1 || !htmlBool) {
                logger.debug(this.id + ".checkString escape String");
                string = dom.escapeString(string);
            }
            return string;
        },

        // Reset subscriptions.
        _resetSubscriptions: function() {
            logger.debug(this.id + "._resetSubscriptions");
            // Release handles on previous object, if any.
            if (this._handles) {
                dojoArray.forEach(this._handles, function (handle) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }

            // When a mendix object exists create subscribtions.
            if (this._contextObj) {
                var objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojoLang.hitch(this, function(guid) {
                        this._updateRendering();
                    })
                });

                this._handles = [objectHandle];
            }
        }
    });
});

require(["CustomString/widget/CustomString"], function() {
    "use strict";
});

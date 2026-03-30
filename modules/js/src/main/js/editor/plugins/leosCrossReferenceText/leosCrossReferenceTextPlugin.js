/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
; // jshint ignore:line
define(function leosCrossReferenceTextPluginModule(require) {
    "use strict";

    var pluginTools = require("plugins/pluginTools");
    var dialogDefinition = require("./leosCrossReferenceTextDialog");

    var pluginName = "leosCrossReferenceText";
    var widgetName = "leosCrossReferenceTextWidget";
    var dialogName = "leosCrossReferenceTextDialog";

    var pluginDefinition = {
        requires: "dialog,widget",
        init: function(editor) {
            pluginTools.addDialog(dialogName, dialogDefinition.initializeDialog);

            editor.widgets.add(widgetName, {
                inline: true,
                requires: "leosWidgetPlugin",
                allowedContent: "mref[id,data-akn-name],ref[id,data-akn-name,href]",
                dialog: dialogName,

                upcast: function(element) {
                    return element.attributes["data-akn-name"] === "mref";
                },

                init: function() {
                    editor.LEOS.mrefElement = this.element;
                }
            });
        }
    };

    var transformationConfig = {
        akn: "mref",
        html: "mref",
        attr: [{
            akn: "xml:id",
            html: "id"
        }, {
            akn: "leos:origin",
            html: "data-origin"
        }, {
            akn: "leos:broken",
            html: "leos:broken"
        },
        {
            akn: "leos:update-translation",
            html: "data-akn-update-translation"
        }, {
        html: "data-akn-name=mref"
        }],
        sub: [{
            akn: "text",
            html: "mref/text"
        }, {
            akn: "ref",
            html: "mref/ref",
            attr: [{
                akn: "xml:id",
                html: "id"
            }, {
                akn: "leos:origin",
                html: "data-origin"
            }, {
                html: "data-akn-name=ref"
            }, {
                akn: "href",
                html: "href"
            },
            {
                akn: "leos:update-translation",
                html: "data-akn-update-translation"
            }],
            sub: {
                akn: "text",
                html: "mref/ref/text"
            }
        }]
    };

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);
    pluginTools.addPlugin(pluginName, pluginDefinition);

    return {
        name: pluginName,
        transformationConfig: transformationConfig
    };
});

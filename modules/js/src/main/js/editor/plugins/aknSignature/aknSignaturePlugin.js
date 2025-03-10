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
define(function aknSignaturePluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");

    var pluginName = "aknSignature";
    var ENTER_KEY = 13;
    var UNDERLINE = CKEDITOR.CTRL + 85;
    var BOLD = CKEDITOR.CTRL + 66;
    var BACKSPACE =  8;
    var DELETE = 46;

    var pluginDefinition = {
        init: function init(editor) {
            $(editor.element.$).on("keydown", null, [editor], _checkAndBlockCustom);

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : ENTER_KEY,
                action : _onEnterKey
            });

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : UNDERLINE,
                action : _onCtrlUKey
            });

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : BOLD,
                action : _onCtrlBKey
            });
        }
    };

    function _onEnterKey(context) {
        context.event.cancel();
    }

    function _onCtrlUKey(context) {
        context.event.cancel();
    }

    function _onCtrlBKey(context) {
        context.event.cancel();
    }

    function _checkAndBlockCustom(e) {
        var editor = e.data[0];
        if(e.keyCode === BACKSPACE  || e.keyCode === DELETE){
            var selection = editor.getSelection();
            var startElement = leosKeyHandler.getSelectedElement(selection);
            if (startElement) {
                var tagName = startElement.$.localName;
                if (tagName === 'p' && startElement.getText().trim() == "") {
                    //Cancel the event
                    e.stopImmediatePropagation();
                    return false;
                }
            }
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var SIGNATURE_NAME = "signature";

    var transformationConfig = {
        akn: SIGNATURE_NAME,
        html: "td[data-akn-name=" + SIGNATURE_NAME + "]",
        attr: [{
            akn: "xml:id",
            html: "id"
        }, {
            html: ["data-akn-name", SIGNATURE_NAME].join("=")
        }]
    };

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    // return plugin module
    var pluginModule = {
        name: pluginName,
        transformationConfig: transformationConfig
    };

    return pluginModule;
});
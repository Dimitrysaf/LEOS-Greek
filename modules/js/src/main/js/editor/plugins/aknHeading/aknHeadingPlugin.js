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
define(function aknChapterPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");
    var pluginName = "aknHeading";

    var ENTER_KEY = 13;
    var SHIFT_ENTER = CKEDITOR.SHIFT + ENTER_KEY;
    var UNDERLINE = CKEDITOR.CTRL + 85;
    var BOLD = CKEDITOR.CTRL + 66;
    var ITALIC = CKEDITOR.CTRL + 73;

    var pluginDefinition = {
        requires : "widget,leosWidget",
        init : function init(editor) {

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : ENTER_KEY,
                action : _cancelEvent
            });

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : SHIFT_ENTER,
                action : _cancelEvent
            });
            
            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : UNDERLINE,
                action : _cancelEvent
            });

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : BOLD,
                action : _cancelEvent
            });

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : ITALIC,
                action : _cancelEvent
            });
        }
    };

    function _cancelEvent(context) {
        var selection = context.event.editor.getSelection();
        var startElement = leosKeyHandler.getSelectedElement(selection);
        if (startElement.getName() === 'h2') {
            context.event.cancel();
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var transformationConfig = {
            akn : "heading",
            html : "h2",
            attr : [ {
                html : "class=akn-element-heading"
            }, {
                html : "data-akn-name=aknHeading"
            }, {
                akn : "leos:origin",
                html : "data-heading-origin"
            }, {
                akn : "leos:editable",
                html : "contenteditable"
            }, {
                akn : "leos:softuser",
                html : "data-akn-attr-softuser"
            }, {
                akn : "leos:softdate",
                html : "data-akn-attr-softdate"
            }, {
                akn : "xml:id",
                html : "data-akn-heading-id"
            },{
                akn : "class",
                html : "data-akn-class"
            } ],
            sub : {
                akn : "text",
                html : "h2/text"
            }
    };

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    // return plugin module
    var pluginModule = {
        name: pluginName,
        transformationConfig: transformationConfig
    };

    return pluginModule;
});
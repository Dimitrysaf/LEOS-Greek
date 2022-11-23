/*
 * Copyright 2022 European Commission
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
define(function aknInlineElementPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var pluginName = "aknInlineElement";

    var pluginDefinition = {
        icons: pluginName.toLowerCase(),
        init : function init(editor) {
            editor.on("instanceReady",_removeTextNodes);
            editor.on("toHtml", removeInitialSnapshot, null, null, 100);
        }
    };

    function _removeTextNodes(evt) {
        var editor = evt.editor;
        editor.editable().getChildren().toArray().forEach(function (element) {
            if (element.type === CKEDITOR.NODE_TEXT) {
                element.remove();
            }
        })
        editor.fire("focus");
    }

    function removeInitialSnapshot(event) {
        if (event.editor.undoManager.snapshots.length > 0) {
            if (event.editor.undoManager.snapshots[0].contents.indexOf("div")<0) {
                event.editor.undoManager.snapshots.shift();
            }
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var transformationConfig = {
        akn : "inline[name=date]",
        html : "p[class=date]",
        attr : [{
            akn : "xml:id",
            html : "id"
        }, {
            akn : "leos:origin",
            html : "data-origin"
        }, {
            akn: "name=date",
            html : "class=date"
        }],
        sub : {
            akn : "text",
            html : "p/text"
        }
    };

    // return plugin module
    var pluginModule = {
        name : pluginName,
        transformationConfig : transformationConfig
    };

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    return pluginModule;
});
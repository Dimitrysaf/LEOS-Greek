/*
 * Copyright 2023 European Commission
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
define(function leosTextHighlightPluginModule(require) {
    "use strict";

    var LOG = require("logger");
    var pluginTools = require("plugins/pluginTools");
    var pluginName = "leosTextHighlight";

    var pluginDefinition = {
        init: function init(editor) {
            _enableHighlightButton(editor);
            editor.on("saveSnapshot", _resolveOverlappedSpans);
        }
    }

    function _resolveOverlappedSpans(evt) {
        var editedElement = evt.editor.element.getChildren().toArray().find((element) => element.getAttribute('data-akn-name') === evt.editor.LEOS.elementType);
        var highlightedSpans = editedElement && $(editedElement.$).find('span[data-akn-style]').toArray();
        if (highlightedSpans) {
            for (let i = 0; i < highlightedSpans.length; i++) {
                var childSpans = $(highlightedSpans[i]).find('span[style]');
                if (childSpans.length > 0) {
                    childSpans.insertAfter($(highlightedSpans[i]));
                    $(highlightedSpans[i]).remove();
                }
            }
        }
    }

    function _enableHighlightButton(editor) {
        if (!editor.LEOS.isTrackChangesEnabled) {
            if(editor.config.removeButtons === "") {
                editor.config.removeButtons = 'BGColor';
            } else {
                editor.config.removeButtons = editor.config.removeButtons + ',BGColor';
            }
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var transformationConfig = {
        akn : "inline",
        html : "span[style]",
        attr : [{
            akn : "xml:id",
            html : "id"
        },{
            akn: "style",
            html : "style"

        },{
            akn: "name=bgcolor",
            html : "data-akn-style=bgcolor"
        }],
        sub : {
            akn : "text",
            html : "span/text"
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

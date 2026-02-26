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
define(function leosMathematicalFormulaPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var leosPluginUtils = require("plugins/leosPluginUtils");
    var leosCommandStateHandler = require("plugins/leosCommandStateHandler/leosCommandStateHandler");
    let leosPluginUtils = require("plugins/leosPluginUtils");

    var pluginName = "leosMathematicalFormula";
    
    var changeStateElements = {
        articleHeading : {
            elementName: 'h2',
            selector: '[data-akn-name=aknHeading]'
        },
        crossHeading: {
            elementName: 'p',
            selector: '[data-akn-name=crossHeading]'
        }
    };

    var pluginDefinition = {
        requires: "mathjax",
        init: function init(editor) {
            editor.on('selectionChange', _onSelectionChange);
            editor.on('doubleclick', function(evt) {
                var element = evt.data.element;
                var mathJaxElement = element.getAscendant(function (el) {
                    return el.hasClass && el.hasClass('cke_widget_wrapper_mathTex');
                }, true);
                var aknpEditor = element.getAscendant(function (el) {
                    return el.getAttribute && el.getAttribute(leosPluginUtils.DATA_AKN_NAME) === leosPluginUtils.AKNP;
                });
                if (mathJaxElement && aknpEditor) {
                    evt.cancel();
                }
            }, null, null, 0);
        }
    };
    
    function _onSelectionChange(event) {
        let selection = event.editor.getSelection();
        let isTableOnlyMode = event.editor.config.tableOnlyMode;
        let startElement = selection.getStartElement();
        if (isTableOnlyMode && !leosPluginUtils.isInsideTable(startElement)) {
            event.editor.getCommand('mathjax').setState(CKEDITOR.TRISTATE_DISABLED);
        } else {
            leosCommandStateHandler.changeCommandState(event.editor, 'mathjax', changeStateElements, true);
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);
    var transformationConfig = {
        akn : "inline[name=mathTex]",
        html : "span[class=mathTex]",
        attr : [{
            akn : "xml:id",
            html : "id"
        }, {
            akn : "leos:origin",
            html : "data-origin"
        }, {
            akn: "name=mathTex",
            html : "class=mathTex"
        }],
        sub : {
            akn : "text",
            html : "span/text"
        }

    };

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    // return plugin module
    var pluginModule = {
        name : pluginName,
        transformationConfig : transformationConfig
    };

    return pluginModule;
});
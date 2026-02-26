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
define(function aknHtmlSubScriptPluginModule(require) {
    "use strict";
    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var pluginName = "aknHtmlSubScript";
    var commandName = "subscript";
    var leosCommandStateHandler = require("plugins/leosCommandStateHandler/leosCommandStateHandler");
    var aknHTMLPluginsUtils = require("plugins/aknHTMLPluginUtils");
    let leosPluginUtils = require("plugins/leosPluginUtils");

    var changeStateElements = {
        imageHcontainer: {
            elementName: 'hcontainer',
            selector: '[name=FGR]'
        }
    };

    var pluginDefinition = {
        init: function init(editor) {
            editor.on('selectionChange', _onSelectionChange, null, null, 11);
            editor.on("afterCommandExec", function (event) {
                if(event.data.command.name === commandName) {
                    const startContainer = aknHTMLPluginsUtils.resolveNestedStyleElements(event);
                    startContainer && startContainer.removeAttribute('id');
                }
            }, null, null, 99);
        }
    };

    pluginTools.addPlugin(pluginName, pluginDefinition);
    var transformationConfig = {
        akn: "sub",
        html: "sub",
        attr: [{
            akn : "leos:origin",
            html : "data-origin"
        }],
        sub: {
            akn: "text",
            html: "sub/text"
        }
    };
    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    function _onSelectionChange(event) {
        let selection = event.editor.getSelection();
        let isTableOnlyMode = event.editor.config.tableOnlyMode;
        let startElement = selection.getStartElement();
        if (isTableOnlyMode && !leosPluginUtils.isInsideTable(startElement)) {
            event.editor.getCommand('subscript').setState(CKEDITOR.TRISTATE_DISABLED);
        } else {
            leosCommandStateHandler.changeCommandState(event.editor, commandName, changeStateElements);
        }
    }

    // return plugin module
    var pluginModule = {
        name: pluginName,
        transformationConfig: transformationConfig,
        specificConfig: {
            coreStyles_subscript : { element: 'sub' ,alwaysRemoveElement: true }
        }
    };
    return pluginModule;
});
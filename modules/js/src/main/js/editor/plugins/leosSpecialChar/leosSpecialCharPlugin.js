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
define(function leosSpecialCharPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var leosCommandStateHandler = require("plugins/leosCommandStateHandler/leosCommandStateHandler");
    let leosPluginUtils = require("plugins/leosPluginUtils");
    var pluginName = "leosSpecialChar";

    var changeStateElements = {
        crossHeading: {
            elementName: 'p',
            selector: '[data-akn-name=crossHeading]'
        }
    };

    var pluginDefinition = {
        requires: "specialchar",
        init: function init(editor) {
            editor.config.specialChars = editor.config.specialChars.slice();
            var gtIndex = editor.config.specialChars.indexOf('&gt;');
            if (gtIndex !== -1) {
                editor.config.specialChars.splice(gtIndex + 1, 0,
                    ['&le;', 'Less than or equal to'],
                    ['&ge;', 'Greater than or equal to']
                );
            }
            editor.on('selectionChange', _onSelectionChange);
        }
    };

    function _onSelectionChange(event) {
        let selection = event.editor.getSelection();
        let isTableOnlyMode = event.editor.config.tableOnlyMode;
        let startElement = selection.getStartElement();
        if (isTableOnlyMode && !leosPluginUtils.isInsideTable(startElement)) {
            event.editor.getCommand('specialchar').setState(CKEDITOR.TRISTATE_DISABLED);
        } else {
            leosCommandStateHandler.changeCommandState(event.editor, 'specialchar', changeStateElements, true);
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    // return plugin module
    var pluginModule = {
        name: pluginName
    };

    return pluginModule;
});
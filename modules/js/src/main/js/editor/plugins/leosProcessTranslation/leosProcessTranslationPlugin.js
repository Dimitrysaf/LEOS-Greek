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
define(function leosProcessTranslationPluginModule(require) {
    "use strict";

    var CKEDITOR = require("promise!ckEditor");
    var pluginTools = require("plugins/pluginTools");
    var leosCommandStateHandler = require("plugins/leosCommandStateHandler/leosCommandStateHandler");
    var dialogDefinition = require("./leosProcessTranslationDialog");
    var pluginName = "leosProcessTranslation";
    var changeStateElements = {
        updateTranslation : {
            elementName: 'p',
            selector: 'p[data-akn-name=aknp]:not([data-akn-update-translation=true]), p[data-akn-name=docPurpose]:not([data-akn-update-translation=true])'
        },
    };
    var iconProcessTranslation = 'icons/leosprocesstranslation.png';

    var pluginDefinition = {
        requires: "dialog",
        
        init: function(editor) {
            pluginTools.addDialog(dialogDefinition.dialogName, dialogDefinition.initializeDialog);
            
            editor.addCommand(dialogDefinition.dialogName, new CKEDITOR.dialogCommand(dialogDefinition.dialogName));

            editor.ui.addButton('ProcessTranslation', {
                label: 'Process Translation',
                command: dialogDefinition.dialogName,
                toolbar: 'save',
                icon: this.path + iconProcessTranslation
            });
            
            editor.on('processTranslation', _onProcessTranslation);
            editor.on('selectionChange', _onSelectionChange);
        }
    };

    function _onProcessTranslation(event) {
        var editable = event.editor.editable();
        if (editable) {
            var elements = editable.find('[data-akn-update-translation]');
            for (var i = 0; i < elements.count(); i++) {
                elements.getItem(i).removeAttribute('data-akn-update-translation');
            }
        }
    }

    function _onSelectionChange(event) {
        leosCommandStateHandler.changeCommandState(event.editor, dialogDefinition.dialogName, changeStateElements, true);
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    return {
        name: pluginName
    };
});

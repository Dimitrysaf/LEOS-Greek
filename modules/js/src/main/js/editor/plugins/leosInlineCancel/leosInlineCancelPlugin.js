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
define(function leosInlineCancelPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var dialogDefinition = require("./leosInlineCancelDialog");

    var pluginName = "leosInlineCancel";
    
    var pluginDefinition = {
        icons: pluginName.toLowerCase(),
        
        init : function(editor) {
            
            // adds dialog
            pluginTools.addDialog(dialogDefinition.dialogName, dialogDefinition.initializeDialog);
            
            //creates dialog command
            var dialogCommand = editor.addCommand(dialogDefinition.dialogName, new CKEDITOR.dialogCommand(dialogDefinition.dialogName));

            editor.addCommand('inlinecancel', {
                readOnly: 1,
                exec : function(editor) {
                    // #3210: editor.checkDirty() is not enough here as many events mark the element as dirty;
                    // On top of checkDirty, comparing the current content with the original one;
                    // A cleanup is required before that to remove any irrelevant data
                    const original = cleanup(localStorage.getItem(editor.LEOS.elementId));
                    const current = cleanup(editor.getData());
                    if(editor.checkDirty() && (original !== current)) {
                        dialogCommand.exec();
                    } else {
                        editor.fire("close");
                    }
                }
            });

            editor.ui.addButton('leosInlineCancel', {
                label : 'Close',
                command : 'inlinecancel',
                toolbar: 'save'
            });
        }
    };

    function cleanup(elementData) {
        return elementData
            .replaceAll('\u00a0', ' ').replaceAll('&nbsp;', ' ')           // remove special spaces
            .replaceAll(/\s+leos:\w+="\s*\w+\s*"/g, '')                    // remove leos:* attributes
            .replaceAll(/\s+class="(\s*\w+\s*)+"/g, '')                    // remove class attributes
            .replaceAll(/\s+xml:id="\s*\w+\s*"/g, '')                      // remove xml:id attributes
            .replace(/<div\b[^>]*>.*?<\/div>/, '').replace('</div>', '')   // remove CoEdition tags
            // convert all tags to lowercase: handle cases like docPurpose -> docpurpose discrepancies
            .replaceAll(/<\/?(\S+)/g, (match, tagName) => match.replace(tagName, tagName.toLowerCase()))
            // convert all attributes to lowercase: handle cases like refersTo -> refersto discrepancies
            .replaceAll(/<([^>]+)>/g, (match, tagContent) => 
                '<' + tagContent.replace(/(\s+)(\w+)=/g, (m, space, attr) => space + attr.toLowerCase() + '=') + '>')
            .replaceAll(/<\/?tbody\b[^>]*>/g, '')                          // tbody tag missing in the editor data
            .trim();
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    // return plugin module
    var pluginModule = {
        name : pluginName
    };

    return pluginModule;
});
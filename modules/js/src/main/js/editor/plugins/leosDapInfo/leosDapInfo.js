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
define(function leosDapInfoPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var pluginName = "leosDapInfo";
    var TRISTATE_DISABLED = CKEDITOR.TRISTATE_DISABLED, TRISTATE_OFF = CKEDITOR.TRISTATE_OFF;
    var DAP_CMD_NAME = "dapinfo";
    var iconDapInfo =  'icons/leosdapinfo.png';

    var pluginDefinition = {
        requires: 'richcombo',
        icons: pluginName.toLowerCase(),

        init: function(editor) {
            var currentTocItem =  editor.LEOS.tocItemsList.find(x => x.aknTag === editor.LEOS.elementType.toLowerCase());
            if(!!currentTocItem
                && currentTocItem.dapInfos
                && currentTocItem.dapInfos.dapInfos) {

                // add the menu to the editor
                if (currentTocItem.dapInfos.dapInfos.length > 1) {
                    /**
                     * String to use as the button label.
                     */
                    var strinsert_button_label = 'DAP';

                    /**
                     * String to use as the button title.
                     */
                    var strinsert_button_title = 'DAP information';

                    /**
                     * String to use as the button voice label.
                     */
                    var strinsert_button_voice = 'DAP information';
                    editor.ui.addRichCombo('leosDapInfo',
                        {
                            label: strinsert_button_label,
                            title: strinsert_button_title,
                            voiceLabel: strinsert_button_voice,
                            toolbar: 'dapInfo',
                            className: 'cke_format',
                            multiSelect: false,
                            panel:
                                {
                                    css: [editor.config.contentsCss, CKEDITOR.skin.getPath('editor')],
                                    voiceLabel: strinsert_button_voice
                                },

                            init: function () {
                                var dapInfoArray = currentTocItem.dapInfos.dapInfos;
                                for (var i = 0, len = dapInfoArray.length; i < len; i++) {
                                    var strToInsert = dapInfoArray[i];
                                    this.add(strToInsert.dapInfoURL, strToInsert.dapInfoLabel, strToInsert.dapInfoLabel);
                                }
                            },

                            onClick: function (value) {
                                window.open(value, '_blank').focus();
                            },

                        });

                } else {
                    editor.ui.addButton('leosDapInfo', {
                        label: 'DAP Info',
                        command: DAP_CMD_NAME,
                        toolbar: 'dapInfo',
                        icon: this.path + iconDapInfo,
                    });
                    editor.addCommand(DAP_CMD_NAME, {
                        exec: function (editor) {
                            if (this.state != TRISTATE_DISABLED && currentTocItem.dapInfos.dapInfos[0]) {
                                window.open(currentTocItem.dapInfos.dapInfos[0].dapInfoURL, '_blank').focus();
                            }
                        }
                    });
                }
            }
        }
    };
    
    pluginTools.addPlugin(pluginName, pluginDefinition);

    // return plugin module
    var pluginModule = {
        name: pluginName
    };

    return pluginModule;
});
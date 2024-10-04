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
define(function aknRecitalPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var numberModule = require("plugins/leosNumber/recitalNumberModule");
    var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");

    var pluginName = "aknRecital";
    var ENTER_KEY = 13;
    var UNDERLINE = CKEDITOR.CTRL + 85;
    var BOLD = CKEDITOR.CTRL + 66;
    var WHITE_SPACE = '\u00A0';

    var pluginDefinition = {
        init: function init(editor) {
            editor.on("change", function(event) {
                event.editor.fire( 'lockSnapshot');
                if (event.editor.mode !== 'source') {
                    if (event.editor.checkDirty()) {
                        numberModule.numberRecitals(event);
                    }
                }
                event.editor.fire( 'unlockSnapshot' );
            });

            $(editor.element.$).on("keyup mouseup", null, [editor], _handleClickEvent);

            editor.on("toDataFormat", function (evt) {
                const parser = new DOMParser();
                var xmlString = evt.data.dataValue.replace('<recital', '<recital xmlns:leos="leos"');
                xmlString = xmlString.replace(/&amp;nbsp;/g, WHITE_SPACE)
                    .replace(/&nbsp;/g, WHITE_SPACE)
                    .replace(/&#xa0;/g, WHITE_SPACE)
                    .replace(/&#160;/g, WHITE_SPACE)
                    .replace(/&amp;#xa0;/g, WHITE_SPACE);
                const doc = parser.parseFromString(xmlString, 'text/xml');
                const recitalTag = doc.querySelector('recital');
                const numTag = doc.querySelector('num');
                if (recitalTag && numTag) {
                    const insTag = numTag.querySelector('ins');
                    const delTag = numTag.querySelector('del');
                    if (insTag && !insTag.hasAttribute('leos:action-number')) {
                        insTag.remove();
                    } else if (insTag && delTag) {
                            numTag.childNodes.forEach(node => {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    const regex = /\(\d+\)/;
                                    if (regex.test(node.nodeValue.trim())) {
                                        node.nodeValue = node.nodeValue.replace(regex, '').trim();
                                    }
                                }
                            });
                    }
                    evt.data.dataValue = recitalTag.outerHTML.replace('xmlns:leos="leos"', '');
                }

            }, null, null, 99);

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

    var _handleClickEvent = function _handleClickEvent(event) {
        if(event.data[0].getSelection()) {
            var range = event.data[0].getSelection().getRanges()[0];
            if(range.collapsed) {
                range.checkEndOfBlock(true);
            }
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var RECITAL_NAME = "recital";

    var transformationConfig = {
        akn: RECITAL_NAME,
        html: "p",
        attr: [{
            akn: "xml:id",
            html: "id"
        }, {
            akn : "leos:origin",
            html : "data-origin"
        }, {
            akn: "leos:editable",
            html: "data-akn-attr-editable"
        }, {
            akn : "leos:softuser",
            html : "data-akn-attr-softuser"
        }, {
            akn : "leos:softdate",
            html : "data-akn-attr-softdate"
        },{
            akn : "leos:softmove_to",
            html : "data-akn-attr-softmove_to"
        }, {
            akn : "leos:softmove_from",
            html : "data-akn-attr-softmove_from"
        }, {
            akn : "leos:softmove_label",
            html : "data-akn-attr-softmove_label"
        }, {
            akn : "leos:softaction",
            html : "data-akn-attr-softaction"
        }, {
            akn : "leos:softactionroot",
            html : "data-akn-attr-softactionroot"
        }, {
            html: ["data-akn-name", RECITAL_NAME].join("=")
        }, {
            akn : "leos:action",
            html : "data-akn-action"
        }, {
            akn : "leos:uid",
            html : "data-akn-uid"
        }, {
            akn : "leos:title",
            html : "title"
        }],
        sub: [{
            akn: "num",
            html: "p",
            attr: [{
                akn: "xml:id",
                html: "data-akn-num-id"
            }, {
                akn : "leos:origin",
                html : "data-num-origin"
            },{
                akn : "leos:uid",
                html : "data-akn-uid-number"
            }],
            sub: [{
                akn: "text",
                html: "p[data-akn-num]"
            }, {
                akn: "del",
                html: "p",
                attr: [{
                    akn: "xml:id",
                    html: "data-akn-del-num-id"
                }, {
                    akn: "leos:action-number",
                    html: "data-akn-num-del-action"
                }, {
                    akn: "leos:tc-original-number",
                    html: "data-akn-tc-original-number"
                }, {
                    akn: "leos:title",
                    html: "title-number"
                }, {
                    akn: "leos:uid",
                    html: "data-akn-uid-number"
                }],
                sub: [{
                    akn: "text",
                    html: "p[data-akn-tc-original-number]"
                }]

            }, {
                akn: "ins",
                html: "p",
                attr: [{
                    akn: "xml:id",
                    html: "data-akn-ins-num-id"
                }, {
                    akn: "leos:action-number",
                    html: "data-akn-num-ins-action"
                }, {
                    akn: "leos:tc-original-number",
                    html: "data-akn-tc-original-number"
                }, {
                    akn: "leos:title",
                    html: "title-number"
                }, {
                    akn: "leos:uid",
                    html: "data-akn-uid-number"
                }],
                sub: [{
                    akn: "text",
                    html: "p[data-akn-num]"
                }]

            } ]
        }, {
            akn: "mp",
            html: "p",
            attr: [{
                akn: "xml:id",
                html: "data-akn-mp-id"
            }, {
                akn: "leos:origin",
                html: "data-mp-origin"
            }],
            sub: {
                akn: "text",
                html: "p/text"
            }
        }]
    };

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    // return plugin module
    var pluginModule = {
        name: pluginName,
        transformationConfig: transformationConfig,
        renumberRecital:numberModule.numberRecitals
    };

    return pluginModule;
});
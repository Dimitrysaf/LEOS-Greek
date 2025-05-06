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
define(function aknRecitalAAPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var leosPluginUtils = require("plugins/leosPluginUtils");
    var leosCommandStateHandler = require("plugins/leosCommandStateHandler/leosCommandStateHandler");
    var leosHierarchicalElementTransformerStamp = require("plugins/leosHierarchicalElementTransformer/hierarchicalElementTransformer");
    var numberModule = require("plugins/leosNumber/recitalNumberModule");
    var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");

    var pluginName = "aknRecitalAA";
    var ENTER_KEY = 13;
    var BACKSPACE =  8;
    var DELETE = 46;
    var ARROW_KEYS = [37, 38, 39, 40];
    var UNDERLINE = CKEDITOR.CTRL + 85;
    var BOLD = CKEDITOR.CTRL + 66;
    var WHITE_SPACE = '\u00A0';

    var changeStateElements = {
        recitalAA: {
            elementName: 'li',
            selector: '[data-akn-name=recital]'
        }
    };

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

            editor.on("contentDom", function() {
                editor.document.$.onselectionchange = () => {
                    let selection = editor.getSelection();
                    if (selection) {
                        if (editor.getSelection().getSelectedText() !== "") {
                            leosCommandStateHandler.changeCommandState(editor, 'leosBase64ImageDialog', changeStateElements, true);
                        } else {
                            leosCommandStateHandler.changeCommandState(editor, 'leosBase64ImageDialog', null, true);
                        }
                    }
                };
            });
            $(editor.element.$).on("keydown", null, [editor], _preventTextInputInSubflow);
            $(editor.element.$).on("keyup", null, [editor], _handleKeyUpEvent);

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

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : DELETE,
                action : _onDeleteKey
            });

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : BACKSPACE,
                action : _onBackspaceKey
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

    function unselectEndBreakLine(range) {
        if (!range.startContainer.equals(range.endContainer) && range.endOffset === 0) {
            range.setEndAt(range.endContainer.getPrevious(), CKEDITOR.POSITION_BEFORE_END);
            range.optimize();
            range.select();
        }
    }

    function preventBlockMerge(context) {
        var selection = context.editor.getSelection();
        if (selection) {
            var range = selection.getRanges()[0];
            if (range.collapsed) {
                if (context.event.data.keyCode === BACKSPACE && range.checkStartOfBlock() ||
                        context.event.data.keyCode === DELETE && range.checkEndOfBlock()) {
                    context.event.cancel();
                }
            } else {
                unselectEndBreakLine(range, context);
                if (range.collapsed || leosPluginUtils.isEmptyWithBogus(range.startContainer.$) && leosPluginUtils.isEmptyWithBogus(range.endContainer.$)) {
                    context.event.cancel();
                } else if (!context.editor.LEOS.isTrackChangesEnabled && leosPluginUtils.mergeBlocksNonCollapsedSelection(context.editor, range, range.startPath())){
                    // Scroll to the new position of the caret (https://dev.ckeditor.com/ticket/11960).
                    selection.scrollIntoView();
                    context.editor.fire( 'saveSnapshot' );
                    context.event.cancel();
                }
            }
        }
    }

    function _onDeleteKey(context) {
        preventBlockMerge(context);
    }

    function _onBackspaceKey(context) {
        preventBlockMerge(context);
    }

    function _preventTextInputInSubflow(e) {
        var selection = e.data[0].getSelection();
        var startElement = leosKeyHandler.getSelectedElement(selection);
        while (startElement && leosPluginUtils.getElementName(startElement) !== "p") {
            startElement = startElement.getLast();
        }
        if (startElement?.getAttribute(leosPluginUtils.DATA_AKN_NAME) === leosPluginUtils.SUBFLOW_NAME &&
                !ARROW_KEYS.includes(e.keyCode) && e.keyCode !== BACKSPACE && e.keyCode !== DELETE) {
            //Cancel the event
            e.stopImmediatePropagation();
            return false;
        }
    }

    function _handleKeyUpEvent(event) {
        function checkAndRemoveEmptySubflow() {
            var startElement = leosKeyHandler.getSelectedElement(selection);
            if ((event.originalEvent.keyCode === BACKSPACE || event.originalEvent.keyCode === DELETE) &&
                    startElement.getAttribute(leosPluginUtils.DATA_AKN_NAME) === leosPluginUtils.SUBFLOW_NAME &&
                    startElement.getChildren().count() === 1 && startElement.getChildren().getItem(0).getName() === leosPluginUtils.BOGUS) {
                editor.fire( 'lockSnapshot' );
                var nextElement = startElement.getNext();
                if (nextElement != null) {
                    range.moveToElementEditStart(nextElement);
                } else {
                    range.moveToElementEditEnd(startElement.getPrevious());
                }
                range.select();
                startElement.remove();
                editor.fire( 'unlockSnapshot' );
            }
        }

        var editor = event.data[0];
        var selection =  editor.getSelection();
        if (selection) {
            var range = selection.getRanges()[0];
            if (range.collapsed) {
                checkAndRemoveEmptySubflow();
                range.checkEndOfBlock();
            }
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var RECITAL_NAME = "recital";

    var leosHierarchicalElementTransformer = leosHierarchicalElementTransformerStamp({
        firstLevelConfig: {
            akn: RECITAL_NAME,
            html: "ol",
            attr: [{
                html: ["data-akn-name", RECITAL_NAME].join("=")
            }, {
                akn: "leos:title",
                html: "title"
            }]
        },
        rootElementsForFrom: ["recital"],
        rootElementsForTo: ["ol", "li"]
    });

    var transformationConfig = leosHierarchicalElementTransformer.getTransformationConfig();

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    // return plugin module
    var pluginModule = {
        name: pluginName,
        transformationConfig: transformationConfig,
        renumberRecital:numberModule.numberRecitals
    };

    return pluginModule;
});
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
    var UTILS = require("core/leosUtils");
    var MEDIA_CONTAINER = "mediacontainer";

    var pluginName = "aknRecitalAA";
    var ENTER_KEY = 13;
    var CTRL_ENTER = CKEDITOR.CTRL + ENTER_KEY;
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
                    _onSelectionChange({ editor: editor });
                };
            });

            editor.on('selectionChange', _onSelectionChange, null, null, 11);
            editor.on('insertElement', _onInsertTable, this, null, 99 );
            editor.on('beforeCommandExec', _onClickListButton, null, null, 1 );
            editor.on('key', _handleKey, null, null, 1 );
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
                    evt.data.dataValue = recitalTag.outerHTML.replace('xmlns:leos="leos"', '')
                       .replace(/name="mediacontainer"/g,'')
                       .replace(/<mediacontainer/g, '<mediaContainer')
                       .replace(/<\/mediacontainer>/g, '<\/mediaContainer>');

                }
            }, null, null, 99);

            editor.on("toHtml", function (evt) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(evt.data.dataValue, "text/html");
                const mediaContainers = doc.querySelectorAll(MEDIA_CONTAINER);
                if (mediaContainers && mediaContainers.length && mediaContainers.length > 0) {
                    mediaContainers.forEach(mc => {
                        mc.setAttribute("name", MEDIA_CONTAINER);
                    });
                    evt.data.dataValue = doc.querySelector(RECITAL_NAME).outerHTML;
                }
            }, null, null, 1);

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
        var selection = context.editor.getSelection();
        var startElement = leosKeyHandler.getSelectedElement(selection);
        if (startElement && leosPluginUtils.getElementName(startElement) === leosPluginUtils.ORDER_LIST_ELEMENT) {
            startElement = startElement.getLast().getLast();
        }
        var div = startElement?.getAscendant("div", true);
        if (div?.getAttribute(leosPluginUtils.DATA_AKN_NAME) !== leosPluginUtils.SUBFLOW_NAME || div.getAttribute(leosPluginUtils.DATA_AKN_HCONTAINER)) {
            context.event.cancel();
        }
    }

    function _onCtrlUKey(context) {
        context.event.cancel();
    }

    function _onCtrlBKey(context) {
        context.event.cancel();
    }

    function preventBlockMerge(event) {
        var editor = event.editor;
        var selection = editor.getSelection();

        function unselectEndBreakLine() {
            var startDiv = range.startContainer.getAscendant(leosPluginUtils.DIV,true);
            var endDiv = range.endContainer.getAscendant(leosPluginUtils.DIV,true);
            if (!startDiv.equals(endDiv) && range.endOffset === 0) {
                range.setEndAt(endDiv.getPrevious(), CKEDITOR.POSITION_BEFORE_END);
                range.optimize();
                range.select();
            }
        }

        function removeFullySelectedTables() {
            let endElement = range.endContainer;
            while (endElement.getAttribute && endElement.getAttribute(leosPluginUtils.DATA_AKN_HCONTAINER) === leosPluginUtils.HCONTAINER_TABLE
                && range.endOffset === 1 && !endElement.equals(range.getCommonAncestor())) {
                range.setEndAt(endElement.getPrevious(), CKEDITOR.POSITION_BEFORE_END);
                range.select();
                endElement.remove();
                endElement = range.endContainer;
            }
            // To avoid full recital from getting deleted when there's a subflow before the table
            range.shrink(CKEDITOR.SHRINK_ELEMENT, true);
        }

        function isAllTextInFirstDivSelected() {
            range.optimize();
            var startElement = range.startContainer,
                endElement = range.endContainer;
            return startElement.type === CKEDITOR.NODE_ELEMENT && endElement.type === CKEDITOR.NODE_ELEMENT && startElement.getId() === endElement.getId() &&
                startElement.getName() === leosPluginUtils.DIV && startElement.getAttribute(leosPluginUtils.DATA_AKN_NAME) !== leosPluginUtils.SUBFLOW_NAME &&
                range.startOffset === 0 && range.endOffset === endElement.getChildCount();
        }

        function deleteIfEmptyList(divElement) {
            function shrinkSelectionToListItem() {
                if (leosPluginUtils.getElementName(range.startContainer) === leosPluginUtils.DIV) {
                    if (range.startOffset === 0) {
                        range.moveToElementEditStart(listElement.getFirst());
                    } else {
                        range.moveToElementEditEnd(listElement.getLast());
                    }
                    range.select();
                }
            }

            if (divElement) {
                var listElement = divElement.getChild(0);
                if (leosPluginUtils.getElementName(listElement) === leosPluginUtils.UNORDERED_LIST_ELEMENT && listElement.getChildCount() === 1
                    && UTILS.isEmptyElement(listElement.getChild(0).$)) {
                    editor.fire('saveSnapshot');
                    if (editor.LEOS.isTrackChangesEnabled) {
                        shrinkSelectionToListItem();
                        if (!range.startContainer.$.attributes || !(range.startContainer.$.attributes[leosPluginUtils.DATA_AKN_EMPTY]
                            || range.startContainer.$.attributes[leosPluginUtils.DATA_REJECT_INSERTED_ENTER])) {
                            editor.fire("handleTrackTraceForEnterDeleted", range);
                            return false;
                        }
                    }
                    removeAndUpdateSelection(divElement, range);
                    return true;
                }
            }
            return false;
        }

        if (selection) {
            var range = selection.getRanges()[0];
            if (range.collapsed) {
                var div = range.startContainer.getAscendant("div", true);
                var isList = div.find(leosPluginUtils.UNORDERED_LIST_ELEMENT).$.length > 0;
                if (isList && deleteIfEmptyList(div)
                    || event.data.keyCode === BACKSPACE && range.checkBoundaryOfElement(div, CKEDITOR.START)
                    || event.data.keyCode === DELETE && range.checkBoundaryOfElement(div, CKEDITOR.END)) {
                    event.cancel();
                    return false;
                }
            } else {
                unselectEndBreakLine();
                if (range.collapsed || leosKeyHandler.isContentEmptyTextNode(range.startContainer) && leosKeyHandler.isContentEmptyTextNode(range.endContainer)) {
                    event.cancel();
                    return false;
                } else if (!editor.LEOS.isTrackChangesEnabled) {
                    removeFullySelectedTables();
                    if (isAllTextInFirstDivSelected()) {
                        range.deleteContents();
                        range.startContainer.appendBogus();
                        event.cancel();
                        return false;
                    } else if (leosPluginUtils.mergeBlocksNonCollapsedSelection(editor, range, range.startPath())) {
                        // Scroll to the new position of the caret (https://dev.ckeditor.com/ticket/11960).
                        selection.scrollIntoView();
                        editor.fire('saveSnapshot');
                        event.cancel();
                        return false;
                    }
                }
            }
        }
    }

    function _preventTextInputInSubflow(e) {
        var selection = e.data[0].getSelection();
        var startElement = leosKeyHandler.getSelectedElement(selection);
        if (startElement && leosPluginUtils.getElementName(startElement) === leosPluginUtils.ORDER_LIST_ELEMENT) {
            startElement = startElement.getLast().getLast();
        }
        if (startElement?.getAttribute(leosPluginUtils.DATA_AKN_NAME) === leosPluginUtils.SUBFLOW_NAME &&
            startElement?.getAttribute(leosPluginUtils.DATA_AKN_HCONTAINER) &&
            !ARROW_KEYS.includes(e.keyCode) && e.keyCode !== BACKSPACE && e.keyCode !== DELETE && e.keyCode !== CTRL_ENTER) {
            //Cancel the event
            e.stopImmediatePropagation();
            return false;
        }
    }

    function _handleKey(event) {
        if (event.data.keyCode === BACKSPACE || event.data.keyCode === DELETE) {
            return preventBlockMerge(event);
        }
    }

    function _onSelectionChange(event) {
        var editor = event.editor;
        var selection = editor.getSelection();

        function allowOnlyOneListInRecital() {
            if (editor.element.findOne(leosPluginUtils.UNORDERED_LIST_ELEMENT) && startElement) {
                leosCommandStateHandler.changeCommandState(editor, 'leosIndentList', changeStateElements, true);
            } else {
                leosCommandStateHandler.changeCommandState(editor, 'leosIndentList', null, true);
            }
        }

        if (selection) {
            var startElement = selection.getStartElement();
            var startElementName = leosPluginUtils.getElementName(startElement);
            if (startElementName === leosPluginUtils.ORDER_LIST_ELEMENT ||
                startElementName === leosPluginUtils.DIV && startElement.find(leosPluginUtils.ORDER_LIST_ELEMENT).$.length > 0) {
                selection = leosPluginUtils.selectLastEditableElement(selection, leosPluginUtils.DIV);
                startElement = selection.getStartElement();
            }
            if (selection.getSelectedText() !== "" || leosPluginUtils.isInsideTable(startElement)) {
                leosCommandStateHandler.changeCommandState(editor, 'leosBase64ImageDialog', changeStateElements, true);
                leosCommandStateHandler.changeCommandState(editor, 'table', changeStateElements, true);
                leosCommandStateHandler.changeCommandState(editor, 'leosIndentList', changeStateElements, true);
            } else {
                leosCommandStateHandler.changeCommandState(editor, 'leosBase64ImageDialog', null, true);
                if (selection.getSelectedElement()?.getName() === "img") {
                    leosCommandStateHandler.changeCommandState(editor, 'table', changeStateElements, true);
                    leosCommandStateHandler.changeCommandState(editor, 'leosIndentList', changeStateElements, true);
                } else {
                    leosCommandStateHandler.changeCommandState(editor, 'table', null, true);
                    allowOnlyOneListInRecital();
                }
            }
        }
    }

    function removeAndUpdateSelection(element, range) {
        var nextElement = element.getNext();
        if (nextElement != null) {
            range.moveToElementEditStart(nextElement);
        } else {
            range.moveToElementEditEnd(element.getPrevious());
        }
        element.remove();
        range.select();
    }

    function checkAndRemoveEmptyElement(element, editor, range) {
        editor.fire('lockSnapshot');
        element.getChildren().toArray().forEach(function (el) {
            if (el.getName && el.getName() === leosPluginUtils.BOGUS) {
                el.remove();
            }
        });
        if (element.getChildCount() === 0) {
            removeAndUpdateSelection(element, range);
        }
        editor.fire('unlockSnapshot');
    }

    function _onInsertTable(event) {
        var editor = event.editor;
        var selection =  editor.getSelection();
        var range = selection.getRanges()[0];
        var selectedElement = leosKeyHandler.getSelectedElement(selection);
        checkAndRemoveEmptyElement(selectedElement, editor, range);
    }

    function _onClickListButton(event) {
        if (event.data.name === 'leosIndentList') {
            var selection = event.editor.getSelection();
            var selectedElement = leosKeyHandler.getSelectedElement(selection);
            if (selectedElement) {
                var range = selection.getRanges()[0];
                if (leosPluginUtils.getElementName(selectedElement) === leosPluginUtils.ORDER_LIST_ELEMENT) {
                    selectedElement = selectedElement.getLast().getLast();
                }
                selectedElement = selectedElement.getAscendant(leosPluginUtils.DIV, true);
                var newBlock = new CKEDITOR.dom.element(leosPluginUtils.DIV);
                var newList = new CKEDITOR.dom.element(leosPluginUtils.UNORDERED_LIST_ELEMENT);
                var newListItemPoint = new CKEDITOR.dom.element(leosPluginUtils.LIST_ITEM);
                newListItemPoint.appendBogus();
                newListItemPoint.setAttribute(leosPluginUtils.DATA_AKN_NUM, "—");
                newList.append(newListItemPoint);
                newBlock.append(newList);
                newBlock.setAttribute(leosPluginUtils.DATA_AKN_NAME, leosPluginUtils.SUBFLOW_NAME);
                newBlock.insertAfter(selectedElement);
                range.moveToPosition(newListItemPoint, CKEDITOR.POSITION_AFTER_START);
                range.select();
                event.editor.fire('saveSnapshot');
            }
        }
    }

    function _handleKeyUpEvent(event) {
        var editor = event.data[0];
        var selection =  editor.getSelection();
        if (selection) {
            var range = selection.getRanges()[0];
            if (range && range.collapsed) {
                var startElement = leosKeyHandler.getSelectedElement(selection);
                if ((event.originalEvent.keyCode === BACKSPACE || event.originalEvent.keyCode === DELETE) &&
                        (startElement.getAttribute(leosPluginUtils.DATA_AKN_NAME) === leosPluginUtils.SUBFLOW_NAME ||
                        startElement.getAttribute(leosPluginUtils.DATA_AKN_NAME) === leosPluginUtils.RECITAL)) {
                        checkAndRemoveEmptyElement(startElement, editor, range);
                }
                range.checkEndOfBlock();
            }
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var RECITAL_NAME = "recital";

    var leosHierarchicalElementTransformer = leosHierarchicalElementTransformerStamp({
        firstLevelConfig: {
            akn: RECITAL_NAME,
            html: ["ol[data-akn-name=", RECITAL_NAME, "]"].join(""),
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
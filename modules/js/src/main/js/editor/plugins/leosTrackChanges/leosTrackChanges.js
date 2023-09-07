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
define(function leosTrackChangesModule(require) {
    "use strict";

    var log = require("logger");
    var UTILS = require("core/leosUtils");
    var leosPluginUtils = require("plugins/leosPluginUtils");

    var core = {

        // Track changes names and element types
        TRACKCHANGES_ELEMENT: "span", TRACKCHANGES_ELEMENT_SELECTOR: "span[data-akn-action]", TRACKCHANGES_TABLE_ROW_ELEMENT_SELECTOR: "tr[data-akn-action]",
        ACTION_ATTR: "data-akn-action", INSERT_ACTION: "insert", DELETE_ACTION: "delete",
        UID_ATTR: "data-akn-uid",

        IS_NEW: "data-akn-is-new", DATA_AKN_TC_ORIGINAL_NUMBER: "data-akn-tc-original-number",
        UNNUMBERED: "UNNUMBERED", NEW: "NEW",

        // Caret definitions
        CARET_START: false, CARET_END: true,

        // TC Locations / where the tc is found
        BEFORE: "before", AFTER: "after", NONE: "none", CURRENT: "current", PARENT: "parent",

        // Style elements tags
        STYLE_ELEMENTS:  ["strong", "em", "sub", "sup"],

        searchTrackChangeElementCheckingParent: function(editor, action) {
            editor.getSelection().getRanges()[0].optimize();
            var range = editor.getSelection().getRanges()[0];
            if (this.isTrackChangeElement(range.startContainer, action)) {
                return [range.startContainer, this.CURRENT];
            } else if (this.isTrackChangeElement(range.startContainer.getParent(), action)) {
                return [range.startContainer.getParent(), this.PARENT];
            } else { // If other checks not have found anything. This should be a parent.
                var tcElement = this.findElementInPathByName(editor, this.TRACKCHANGES_ELEMENT, action);
                if (tcElement) {
                    return [tcElement, this.PARENT];
                }
            }
            // TODO: Not needed anymore but check if causes some regression
            // Check element before and after caret
            // return this.searchTrackChangeElement(editor, action);
            return null;
        },

        searchTrackChangeElement: function(editor, action, deleteKey) {
            var tcElement = null, previousSearched = false, nextSearched = false;
            editor.getSelection().getRanges()[0].optimize();
            while (!previousSearched || !nextSearched) {
                if (nextSearched) {
                    tcElement = this.searchPreviousTrackChangeElement(editor, action, deleteKey);
                    previousSearched = true;
                } else {
                    tcElement = this.searchNextTrackChangeElement(editor, action, deleteKey);
                    nextSearched = true;
                }
                if (tcElement || (previousSearched && nextSearched)) {
                    break;
                }
            }
            return tcElement;
        },

        searchPreviousTrackChangeElement: function(editor, action, deleteKey) {
            var node = editor.getSelection().getRanges()[0].getPreviousEditableNode();
            if (this.isTrackChangeElement(node, action)) {
                return [node, this.CARET_END];
            } else if (node && (node.type === CKEDITOR.NODE_TEXT) && node.hasPrevious() && (deleteKey === false)) {
                node = node.getPrevious();
                if (this.isTrackChangeElement(node, action)) {
                    return [node, this.CARET_END];
                }
            }
            return null;
        },

        searchNextTrackChangeElement: function(editor, action, deleteKey) {
            var node = editor.getSelection().getRanges()[0].getNextEditableNode();
            if (this.isTrackChangeElement(node, action)) {
                return [node, this.CARET_START];
            } else if (node && (node.type === CKEDITOR.NODE_TEXT) && node.hasNext() && (deleteKey === true)) {
                node = node.getNext();
                if (this.isTrackChangeElement(node, action)) {
                    return [node, this.CARET_START];
                }
            }
            return null;
        },

        getUserAndId: function(editor) {
            return [editor.LEOS.user.name, editor.LEOS.user.login];
        },

        getUserId: function(editor) {
            return editor.LEOS.user.login;
        },

        getDateFormat: function() {
            return UTILS.toIsoString(new Date());
        },

        getTrackChangeAttributes: function(editor, action) {
            var user = this.getUserAndId(editor);
            var tcAttributes = {
                "data-akn-action": action,
                "data-akn-uid": user[1],
                "title": user[0]
            };
            return tcAttributes;
        },

        getTrackChangeAttributesForNumbering: function(editor, action) {
            var user = this.getUserAndId(editor);
            var tcAttributes = {
                "data-akn-action-for-number": action,
                "data-akn-uid-number": user[1],
                "title-number": user[0]
            };
            return tcAttributes;
        },

        removeTrackChangesAttributes: function(element) {
            var tcAttributes = ["data-akn-action", "data-akn-uid", "title"];
            for (var attrName of tcAttributes) {
                element.removeAttribute(attrName);
            }
        },

        removeTrackChangesAttributesForNumbering: function(element) {
            var tcAttributes = ["data-akn-action-for-number", "data-akn-uid-number", "title-number"];
            for (var attrName of tcAttributes) {
                element.removeAttribute(attrName);
            }
        },

        addTrackChangesAttributes: function(editor, element, action) {
            var tcAttributes = this.getTrackChangeAttributes(editor, action);
            for (var attrName in tcAttributes) {
                element.setAttribute(attrName, tcAttributes[attrName]);
            }
        },

        addTrackChangesAttributesForNumbering: function(editor, element, action) {
            var tcAttributes = this.getTrackChangeAttributesForNumbering(editor, action);
            for (var attrName in tcAttributes) {
                element.setAttribute(attrName, tcAttributes[attrName]);
            }
        },

        buildTrackChangeElement: function(editor, action, text, isHtml) {
            var tcElement = new CKEDITOR.dom.element(this.TRACKCHANGES_ELEMENT);
            tcElement.setAttributes(this.getTrackChangeAttributes(editor, action));
            if (isHtml ? tcElement.setHtml(text) : tcElement.setText(text));
            return tcElement;
        },

        insertTrackChangeElement: function(editor, action, text, toEnd, isHtml) {
            var tcElement = this.buildTrackChangeElement(editor, action, text, isHtml);
            var selectedElement = editor.getSelection().getStartElement();
            if (core.isTrackChangeElement(selectedElement)) {
                tcElement.insertAfter(selectedElement);
                tcElement.mergeSiblings();
            } else if (this.STYLE_ELEMENTS.includes(selectedElement.getName())) {
                tcElement.insertAfter(selectedElement);
            } else {
                editor.insertElement(tcElement);
            }
            this.setToEditablePosition(editor, tcElement, toEnd);
            return tcElement;
        },

        toArray: function(list) {
            var array = new Array();
            for (var i = 0; i < list.count();i++) { array[i] = list.getItem(i); }
            return array;
        },

        getSelectedHtml: function(editor) {
            var selection = editor.getSelection();
            if (selection) {
                var bookmarks = selection.createBookmarks(), range = selection.getRanges()[0], fragment = range.clone().cloneContents();
                selection.selectBookmarks(bookmarks);
                var retval = "", childList = fragment.getChildren(), childCount = childList.count();
                for (var i = 0; i < childCount; i++) {
                    var child = childList.getItem(i);
                    retval += (child.getOuterHtml ? child.getOuterHtml() : child.getText());
                }
                return retval;
            }
        },

        getCleanData: function(editor) {
            var data = editor.getData().replace( /<[^<|>]+?>/gi, "").replace(/[\r\n]/g, "")
                .replace(/\u00a0/g, " "); // Cleanup break etc.
            return textHandling.escapeHTMLDecode(data); // Decode html
        },

        findElementInPathByName: function(editor, elType, elAction) {
            var selection = editor.getSelection();
            if (selection) {
                var path = selection.getRanges()[0].startPath();
                for (var i = 0; path.elements.length > i; i++) {
                    var el = path.elements[i];
                    if ((el.getName() == elType) && (el.getAttribute(this.ACTION_ATTR) == elAction)) {
                        return el;
                    }
                }
            }
            return null;
        },

        setToEditablePosition: function(editor, element, setToEnd) {
            if ((element !== null) && (element.type !== null)) {
                var range = editor.createRange();
                range.moveToElementEditablePosition(element, setToEnd);
                range.select();
            }
        },

        setToPosition: function(editor, element, position) {
            if ((element !== null) && (element.type !== null)) {
                var range = editor.createRange();
                range.moveToPosition(element, position);
                range.select();
            }
        },

        isEmpty: function(element) {
            return ((element != null) && !CKEDITOR.tools.trim(element.getText()));
        },

        isTrackChangeElement: function(element, action) {
            var actions = action ? [action] : [this.INSERT_ACTION, this.DELETE_ACTION];
            for (var action of actions) {
                if ((element != null) && (element.$.nodeType === CKEDITOR.NODE_ELEMENT) &&
                    (element.getName().toLowerCase() === this.TRACKCHANGES_ELEMENT) && (element.getAttribute(this.ACTION_ATTR) === action)) {
                    return true;
                }
            }
            return false;
        },

        isInsideTrackChangeElement: function(editor, action) {
            var actions = action ? [action] : [this.INSERT_ACTION, this.DELETE_ACTION];
            for (var action of actions) {
                var tcElement = this.searchTrackChangeElementCheckingParent(editor, action);
                if (tcElement && (tcElement[1] === this.CURRENT || tcElement[1] === this.PARENT)) {
                    return tcElement[0];
                }
            }
            return null;
        },

        breakParentAndMoveTo: function(editor, element, parent, moveTo) {
            element.breakParent(parent);
            if (this.isEmpty(element.getPrevious()) && (this.isTrackChangeElement(element.getPrevious(), this.INSERT_ACTION) || this.isTrackChangeElement(element.getPrevious(), this.DELETE_ACTION))) {
                element.getPrevious().remove();
            }
            if (this.isEmpty(element.getNext()) && (this.isTrackChangeElement(element.getNext(), this.INSERT_ACTION) || this.isTrackChangeElement(element.getNext(), this.DELETE_ACTION))) {
                element.getNext().remove();
            }
            this.setToEditablePosition(editor, element, moveTo);
        },

        findElementsInSelection: function(selection) {
            var selectedTcElements = [];
            var range = selection.getRanges()[0];
            if (!selection.isFake && (typeof(range.getCommonAncestor) !== undefined) && (typeof(range.getCommonAncestor().getElementsByTag) !== undefined)) {
                var allTcElementsWithinRangeParent = range.getCommonAncestor().getElementsByTag(this.TRACKCHANGES_ELEMENT);
                for (var i = 0, tcElement; allTcElementsWithinRangeParent.count() > i; i++) {
                    tcElement = allTcElementsWithinRangeParent.getItem(i);
                    if (selection.getNative().containsNode(tcElement.$, true)) {
                        selectedTcElements.push(tcElement);
                    }
                }
            }
            return selectedTcElements;
        },

        updateTrackChangesStyles: function(currentUserId, proposalRef, isTrackChangesShowed) {
            var editorTcStyle = UTILS.generateTrackChangesStyles(currentUserId, proposalRef, isTrackChangesShowed, this.UID_ATTR, this.ACTION_ATTR);
            $("head #editorTcStyle").remove();
            $("head").prepend("<style id='editorTcStyle'>" + editorTcStyle + "</style>");
        },

        canUserAcceptChanges: function(editor) {
            // return !editor.LEOS.isClonedProposal && editor.LEOS.user.permissions && editor.LEOS.user.permissions.includes("CAN_ACCEPT_CHANGES");
            //TODO: Accept has been enabled in cloned proposals for testing purposes
            return editor.LEOS.user.permissions && editor.LEOS.user.permissions.includes("CAN_ACCEPT_CHANGES");
        },

        canUserRejectChanges: function(editor) {
            return editor.LEOS.user.permissions && editor.LEOS.user.permissions.includes("CAN_REJECT_CHANGES");
        },

        clone: function(element) {
            var cloneElement = null;
            if (element) {
                cloneElement = element.clone(true);
                cloneElement.$.classList.remove("cke_widget_focused", "cke_widget_selected");
            }
            return cloneElement;
        },

        setOriginalNumber: function(element, previousNumber) {
            if (!element.getAttribute(this.DATA_AKN_TC_ORIGINAL_NUMBER)) {
                if (element.getAttribute(leosPluginUtils.ID) === null) {
                    element.setAttribute(this.DATA_AKN_TC_ORIGINAL_NUMBER, core.NEW);
                } else {
                    if (previousNumber) {
                        element.setAttribute(this.DATA_AKN_TC_ORIGINAL_NUMBER, previousNumber);
                    } else {
                        element.setAttribute(this.DATA_AKN_TC_ORIGINAL_NUMBER, core.UNNUMBERED);
                    }
                }
            }
        }

    };

    var actions = {

        handleEnterInTrackChanges: function (event) {
            var selection = event.editor.getSelection();
            var ranges = selection && selection.getRanges();
            var range = ranges && ranges[0];
            var el = range.startContainer;
            if (el && core.isTrackChangeElement(el, core.INSERT_ACTION) && el.getText().trim() === '') {
                el.remove();
            }
        },

        preventInsertInDelete: function(editor) {
            // Prevent typing within delete element. Check if next, last or current
            // is deleted element. If this is the case move to end
            editor.getSelection().getRanges()[0].optimize();
            var range = editor.getSelection().getRanges()[0];
            var tcElement = core.searchTrackChangeElementCheckingParent(editor, core.DELETE_ACTION);

            // If parent or current is deleted element overwrite output of above
            if (tcElement && ((tcElement[1] === core.PARENT) || (tcElement[1] === core.CURRENT))) {
                tcElement = [tcElement[0], core.CARET_START]; // Move to start of element behind the deleted
            }

            // Set caret after deleted if something is found
            if (tcElement && tcElement[0] && (tcElement[1] == core.CARET_START)) {
                if (tcElement[0].$.nodeType === CKEDITOR.NODE_TEXT) {
                    tcElement[0] = tcElement[0].getParent();
                }
                range = editor.createRange();
                var next = tcElement[0].getNextSourceNode().getNextSourceNode();
                if (next) { // If not null and not first or the highest item
                    range.selectNodeContents(next);
                    range.collapse(true);
                } else { //TODO: Add if next is Insert Element set to start insert Element!!
                    range.setStartBefore(tcElement[0]);
                }
                range.select();
            }
        },

        insertNewData: function(editor, data) {
            editor.getSelection().getRanges()[0].optimize();
            var tcElement = core.searchTrackChangeElementCheckingParent(editor, core.INSERT_ACTION);
            if (tcElement && tcElement[0] && (tcElement[0].getAttribute(core.UID_ATTR) === core.getUserId(editor)) && !tcElement[0].getId()) {
                if (tcElement[1] === core.PARENT || tcElement[1] === core.CURRENT) {
                    return false;
                } else if (tcElement[1] === core.CARET_START) {
                    core.setToPosition(editor, tcElement[0], CKEDITOR.POSITION_BEFORE_START);
                    var elementAdded = core.insertTrackChangeElement(editor, core.INSERT_ACTION, data, core.CARET_END, true);
                    elementAdded.mergeSiblings();
                } else {
                    var html = tcElement[1] === core.CARET_END ? tcElement[0].getHtml() + data : data + tcElement[0].getHtml();
                    tcElement[0].setHtml(html);
                }
            } else {
                var newElement = core.insertTrackChangeElement(editor, core.INSERT_ACTION, data, core.CARET_END, true);
                if (tcElement && tcElement[0] && (tcElement[1] === core.PARENT || tcElement[1] === core.CURRENT)) {
                    core.breakParentAndMoveTo(editor, newElement, tcElement[0], core.CARET_END);
                }
            }
            return true;
        },

        selectElementToDelete: function(deleteKey, editor) {
            var selectedNode;
            var position = !deleteKey ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START;

            do {
                selectedNode = deleteKey ? editor.getSelection().getRanges()[0].getNextNode() :
                    editor.getSelection().getRanges()[0].getPreviousNode();
                if (selectedNode && (selectedNode.$.textContent.replace(/\u200B/g,'') === '') && ((selectedNode.type !== CKEDITOR.NODE_ELEMENT) ||
                        ((selectedNode.type === CKEDITOR.NODE_ELEMENT) && !selectedNode.hasClass("cke_widget_inline")))) {
                    selectedNode = deleteKey ? editor.getSelection().getRanges()[0].getNextEditableNode() :
                        editor.getSelection().getRanges()[0].getPreviousEditableNode();
                }
                core.setToPosition(editor, selectedNode, position);
            } while (selectedNode && (selectedNode.type === CKEDITOR.NODE_ELEMENT) && !selectedNode.hasClass("cke_widget_inline"));

            if (!selectedNode) {
                return false;
            } else if (selectedNode.type === CKEDITOR.NODE_ELEMENT) {
                editor.getSelection().selectElement(selectedNode);
                return false;
            } else {
                var range = editor.createRange();
                range.moveToPosition(selectedNode, position);
                if (selectedNode.$.length === 1) {
                    range.selectNodeContents(selectedNode);
                } else if (deleteKey) {
                    range.endOffset = range.endOffset + 1;
                } else {
                    range.startOffset = range.startOffset - 1;
                }
                range.select();
            }
            return true;
        },

        acceptChange: function(editor, element) {
            editor.getSelection().fake(element.getParent());
            if (element.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION) {
                element.remove();
            } else if ((element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) && ($(element, editor.getData()).length > 0)) {
                element.$.outerHTML = element.$.innerHTML;
            }
        },

        rejectChange: function(editor, element) {
            editor.getSelection().fake(element.getParent());
            if (element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) {
                element.remove();
            } else if ((element.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION) && ($(element, editor.getData()).length > 0)) {
                element.$.outerHTML = element.$.innerHTML;
            }
        },

        acceptRowChange: function(editor, element) {
            if (element.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION) {
                var table = element.getAscendant("table");
                if (table.$.rows.length == 1) {
                    table.remove();
                } else {
                    element.remove();
                }
            } else if (element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) {
                core.removeTrackChangesAttributes(element);
            }
        },

        rejectRowChange: function(editor, element) {
            if (element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) {
                var table = element.getAscendant("table");
                if (table.$.rows.length == 1) {
                    table.remove();
                } else {
                    element.remove();
                }
            } else if (element.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION) {
                core.removeTrackChangesAttributes(element);
            }
        }

    };

    var textHandling = {

        escapeHTMLEncode: function(str) {
            var div = document.createElement("div");
            var text = document.createTextNode(str);
            div.appendChild(text);
            return div.innerHTML;
        },

        escapeHTMLDecode: function(str) {
            return $("<div/>").html(str).text();
        }

    };

    return {
        core : core,
        actions : actions,
        textHandling : textHandling
    };
});

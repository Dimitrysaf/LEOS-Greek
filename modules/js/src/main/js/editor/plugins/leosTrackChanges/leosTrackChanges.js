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
        SOFT_ACTION_ATTR: "data-akn-attr-softaction", LEOS_SOFT_ACTION_ATTR: "leos:softaction", LEOS_SOFT_ACTION_MOVE_FROM_VALUE: "move_from",
        LEOS_ACTION_ATTR: "leos:action", ACTION_ATTR: "data-akn-action", INSERT_ACTION: "insert", DELETE_ACTION: "delete",
        LEOS_UID_ATTR: "leos:uid", UID_ATTR: "data-akn-uid",

        DATA_AKN_TC_ORIGINAL_NUMBER: "data-akn-tc-original-number", DATA_AKN_ACTION_NUMBER: "data-akn-action-number",
        UNNUMBERED: "UNNUMBERED", NEW: "NEW", DATA_AKN_ACTION_ENTER: "data-akn-action-enter",
        DATA_AKN_RENUMBER: "data-akn-renumber", DATA_AKN_RENUMBER_ORIGIN: "data-akn-renumber-origin",
        DATA_AKN_ID_TO_BE_REMOVED: "data-akn-id-to-be-removed", DATA_AKN_ID_TO_BE_RESTORED: "data-akn-id-to-be-restored",
        ACCEPT: "accept", REJECT: "reject",

        DATA_AKN_SOFTACTION: "data-akn-attr-softaction", DATA_AKN_ATTR_SOFTMOVE_FROM: "data-akn-attr-softmove_from",
        SOFTACTION_MOVE_FROM: "move_from",

        // Caret definitions
        CARET_START: false, CARET_END: true,

        // TC Locations / where the tc is found
        BEFORE: "before", AFTER: "after", NONE: "none", CURRENT: "current", PARENT: "parent",

        // Style elements tags
        STYLE_ELEMENTS:  ["strong", "em", "sub", "sup"],

        OUTSIDE_EDITOR_ELTS_SELECTOR: {article: 1, citation: 1, recital: 1, paragraph: 1, level: 1, chapter: 1, akntitle: 1, part: 1, section: 1},

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
            if (action === core.DELETE_ACTION) {
                tcAttributes["data-wsc-ignore-checking"] = true;
            }
            return tcAttributes;
        },

        getTrackChangeAttributesForNumbering: function(editor, action) {
            var user = this.getUserAndId(editor);
            var tcAttributes = {
                "data-akn-action-number": action,
                "data-akn-uid-number": user[1],
                "title-number": user[0]
            };
            return tcAttributes;
        },

        getTrackChangeAttributesForEnter: function(editor, action) {
            var user = this.getUserAndId(editor);
            var tcAttributes = {
                "data-akn-action-enter": action,
                "data-akn-uid-enter": user[1],
                "title-enter": user[0]
            };
            return tcAttributes;
        },

        removeTrackChangesAttributes: function(element) {
            var tcAttributes = ["data-akn-action", "data-akn-uid", "title", "data-wsc-ignore-checking"];
            for (var attrName of tcAttributes) {
                element.removeAttribute(attrName);
            }
        },

        removeTrackChangesAttributesForNumbering: function(element) {
            var tcAttributes = ["data-akn-action-number", "data-akn-uid-number", "title-number", "data-akn-tc-original-number"];
            for (var attrName of tcAttributes) {
                element.removeAttribute(attrName);
            }
        },

        removeTrackChangesAttributesForEnter: function(element) {
            var tcAttributes = ["data-akn-action-enter", "data-akn-uid-enter", "title-enter"];
            for (var attrName of tcAttributes) {
                element.removeAttribute(attrName);
            }
        },

        removeSoftAttributes: function(element) {
            var softAttributes = ["data-akn-attr-softuser", "data-akn-attr-softdate", "data-akn-attr-softaction",
                "data-akn-attr-softactionroot", "data-akn-attr-softmove_label", "data-akn-attr-softmove_from"];
            for (var attrName of softAttributes) {
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

        addTrackChangesAttributesForEnter: function(editor, element, action) {
            var tcAttributes = this.getTrackChangeAttributesForEnter(editor, action);
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
            if (core.isTrackChangeElement(selectedElement, core.DELETE_ACTION)) {
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

        isInsideTrackedHigherElement: function(editor, user) {
            var selection = editor.getSelection();
            if (selection) {
                var el = selection.getRanges()[0].getCommonAncestor().getAscendant(this.OUTSIDE_EDITOR_ELTS_SELECTOR);
                if (!!el) {
                    if ((el.hasAttribute(this.ACTION_ATTR))
                        && (!el.hasAttribute(this.SOFT_ACTION_ATTR) || el.getAttribute(this.SOFT_ACTION_ATTR) != this.LEOS_SOFT_ACTION_MOVE_FROM_VALUE)
                        && (el.getAttribute(this.UID_ATTR) == user)) {
                        return true;
                    }
                    if ((el.hasAttribute(this.LEOS_ACTION_ATTR))
                        && (!el.hasAttribute(this.LEOS_SOFT_ACTION_ATTR) || el.getAttribute(this.LEOS_SOFT_ACTION_ATTR) != this.LEOS_SOFT_ACTION_MOVE_FROM_VALUE)
                        && (el.getAttribute(this.LEOS_UID_ATTR) == user)) {
                        return true;
                    }
                }
            }
            return false;
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
                if ((element != null) && element.$ && (element.$.nodeType === CKEDITOR.NODE_ELEMENT) &&
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

        isNewTrackChangeNumber: function(element) {
            var hasNewNumberAttribute = false;
            var elementToCheck = element.startContainer;
            if (elementToCheck.type === CKEDITOR.NODE_TEXT) { elementToCheck = elementToCheck.getParent() }
            do {
                if (elementToCheck.getAttribute(this.DATA_AKN_TC_ORIGINAL_NUMBER) === this.NEW) {
                    hasNewNumberAttribute = true;
                }
            } while (!hasNewNumberAttribute && elementToCheck.getName() !== 'li' && (elementToCheck = elementToCheck.getParent()));
            return hasNewNumberAttribute;
        },

        isCreatedByEnterKey: function(element) {
            var isCreatedByEnterKey = false;
            var elementToCheck = element.startContainer;
            if (elementToCheck.type === CKEDITOR.NODE_TEXT) { elementToCheck = elementToCheck.getParent() }
            do {
                if (elementToCheck.type === CKEDITOR.NODE_ELEMENT && elementToCheck.getAttribute(this.DATA_AKN_ACTION_ENTER) === 'insert') {
                    isCreatedByEnterKey = true;
                }
            } while (!isCreatedByEnterKey && elementToCheck.getName() !== 'li' && elementToCheck.getName() !== 'p' && (elementToCheck = elementToCheck.getParent()));
            return isCreatedByEnterKey;
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
            return editor.LEOS.user.permissions && editor.LEOS.user.permissions.includes("CAN_ACCEPT_CHANGES") &&
                (!editor.LEOS.isClonedProposal || (editor.LEOS.isClonedProposal && editor.LEOS.user.roles && editor.LEOS.user.roles.includes("SUPPORT")));
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
                if (!element.getAttribute(leosPluginUtils.ID)) {
                    element.setAttribute(this.DATA_AKN_TC_ORIGINAL_NUMBER, core.NEW);
                } else if (previousNumber) {
                    element.setAttribute(this.DATA_AKN_TC_ORIGINAL_NUMBER, previousNumber);
                }
            }
        },

        getClosestElementWithPseudoElt: function(element, pseudoElt) {
            do {
                if (!isNaN(parseInt(window.getComputedStyle(element.$, ":" + pseudoElt).height))) {
                    return element.$;
                }
                element = element.getParent();
            } while (element && !element.$.classList.contains("leos-placeholder"));
            return null;
        },

        isMouseOverPseudoElt: function(element, mousePosition, pseudoElt) {
            function getElementPosition(element) {
                var x = 0, y = 0;
                do {
                    x += element.offsetLeft;
                    y += element.offsetTop;
                    element = element.offsetParent
                } while (element);
                return [x, y];
            }

            var positionEditor = getElementPosition(element);
            var top = positionEditor[1], bottom = top + parseInt(window.getComputedStyle(element, ":" + pseudoElt).height);
            var left = positionEditor[0], right = left + parseInt(window.getComputedStyle(element, ":" + pseudoElt).width);
            var mouseX = mousePosition[0], mouseY = mousePosition[1];

            return ((mouseX >= (left - 5)) && (mouseX <= (right + 5)) && (mouseY >= (top - 5)) && (mouseY <= (bottom + 5)));
        }

    };

    var actions = {

        handleEnterInTrackChanges: function(editor) {
            var selection = editor.getSelection();
            var ranges = selection && selection.getRanges();
            var range = ranges && ranges[0];
            var el = range && range.startContainer;
            if (el && core.isTrackChangeElement(el, core.INSERT_ACTION) && el.getText() === '') {
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
            if (tcElement && tcElement[0] && (tcElement[0].getAttribute(core.UID_ATTR) === core.getUserId(editor))
                    && !tcElement[0].getId()) {
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

        acceptChange: function(editor, element, numberModule) {
            if (element.getAttribute(core.DATA_AKN_ACTION_ENTER) || (element.getAttribute(core.DATA_AKN_ACTION_NUMBER) && !element.getAttribute(leosPluginUtils.DATA_AKN_NUM)) ||
                ((element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) && (element.getAttribute(core.DATA_AKN_SOFTACTION) === core.SOFTACTION_MOVE_FROM))) {
                if ((element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION)
                    && (element.getAttribute(core.DATA_AKN_SOFTACTION) === core.SOFTACTION_MOVE_FROM)
                    && this.checkIfAcceptIsProcessedInBackend(editor, element, numberModule)) {
                    element.setAttribute(core.DATA_AKN_ID_TO_BE_REMOVED, element.getAttribute(core.DATA_AKN_ATTR_SOFTMOVE_FROM));
                    element.setAttribute(core.DATA_AKN_RENUMBER_ORIGIN, core.ACCEPT);
                }
                core.removeTrackChangesAttributes(element);
                core.removeTrackChangesAttributesForEnter(element);
                core.removeTrackChangesAttributesForNumbering(element);
                core.removeSoftAttributes(element);
                element.setAttribute(core.DATA_AKN_RENUMBER, core.ACCEPT);
                if (!element.getAttribute(leosPluginUtils.ID)) {
                    element.setAttribute(leosPluginUtils.ID, "_temp_tc_" + Date.now().toString(36) + Math.random().toString(36).substring(2));
                }
            } else if (element.getAttribute(core.DATA_AKN_ACTION_NUMBER)) {
                for (var elementSibling of element.getParent().$.children) {
                    if (elementSibling.getAttribute(core.DATA_AKN_ACTION_NUMBER) && elementSibling.getAttribute(leosPluginUtils.DATA_AKN_NUM)) {
                        core.removeTrackChangesAttributes(elementSibling);
                        core.removeTrackChangesAttributesForNumbering(elementSibling);
                        core.removeSoftAttributes(elementSibling);
                        elementSibling.setAttribute(core.DATA_AKN_RENUMBER, core.ACCEPT);
                        if (!elementSibling.getAttribute(leosPluginUtils.ID)) {
                            elementSibling.setAttribute(leosPluginUtils.ID, "_temp_tc_" + Date.now().toString(36) + Math.random().toString(36).substring(2));
                        }
                    }
                }
            } else {
                editor.getSelection().fake(element.getParent());
                if (element.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION) {
                    var liParentElement = element.getParent();
                    element.remove();
                    this.removeEmptyElement(liParentElement, numberModule, editor);
                } else if ((element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) && ($(element, editor.getData()).length > 0)) {
                    element.$.outerHTML = element.$.innerHTML;
                }
            }
        },

        checkIfAcceptIsProcessedInBackend: function (editor, element, numberModule) {
            var toBeProcessedInBackend = true;
            var nodeInSameEditorSession = editor.container.findOne("[id='" + element.getAttribute(core.DATA_AKN_ATTR_SOFTMOVE_FROM) + "']");
            if (nodeInSameEditorSession) {
                var nodeList = nodeInSameEditorSession.getParent().find("> li[data-akn-element='point']");
                if (nodeList.count() === 0) {
                    nodeList = nodeInSameEditorSession.getParent().find("> li[data-akn-element='paragraph']");
                }
                var changeOffset = false;
                for (var nodeListCount = 0; nodeListCount < nodeList.count(); nodeListCount++) {
                    var node = nodeList.getItem(nodeListCount);
                    if (changeOffset) {
                        var sequence = numberModule.getSequence(nodeInSameEditorSession.getParent().$);
                        var originalNumber = node.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER);
                        if (originalNumber) {
                            var originalNumberIndex = sequence.getIndex(originalNumber);
                            if (originalNumberIndex >= 0) {
                                node.setAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER, sequence.generator(nodeInSameEditorSession.getParent().$, node, originalNumberIndex - 2));
                            }
                        }
                    }
                    if (nodeInSameEditorSession.$ === node.$) {
                        changeOffset = true;
                    }
                }
                nodeInSameEditorSession.remove();
                toBeProcessedInBackend = false;
            }
            return toBeProcessedInBackend;
        },

        removeEmptyElement: function (liParentElement, numberModule, editor) {
            var liParentElementToCheckText = liParentElement;
            while (liParentElementToCheckText && liParentElementToCheckText.getName() !== 'li') {
                liParentElementToCheckText = liParentElementToCheckText.getParent();
            }
            var liParentElementToCheckNumber = liParentElement;
            while (liParentElementToCheckNumber
            && !(liParentElementToCheckNumber.getAttribute(leosPluginUtils.DATA_AKN_ELEMENT) === leosPluginUtils.POINT || liParentElementToCheckNumber.getAttribute(leosPluginUtils.DATA_AKN_ELEMENT) === leosPluginUtils.INDENT || liParentElementToCheckNumber.getAttribute(leosPluginUtils.DATA_AKN_ELEMENT) === leosPluginUtils.PARAGRAPH)) {
                liParentElementToCheckNumber = liParentElementToCheckNumber.getParent();
            }
            if (liParentElementToCheckText && liParentElementToCheckText.getText() === ''
                && liParentElementToCheckNumber && liParentElementToCheckNumber.getParent()
                && liParentElementToCheckNumber.getAttribute(leosPluginUtils.DATA_AKN_NUM)) {
                var isFirstOfAll = numberModule.isFistElement(liParentElementToCheckNumber.getParent().$, liParentElementToCheckNumber.getAttribute(leosPluginUtils.DATA_AKN_NUM));
                var keyCodeToUse = 8;
                if (isFirstOfAll) {
                    keyCodeToUse = 46;
                }
                var ckEditorEvent = new CKEDITOR.dom.event(
                    new KeyboardEvent('key', {
                        keyCode: keyCodeToUse,
                        ctrlKey: false,
                        shiftKey: false,
                        getKey: function () {
                            return keyCode;
                        }
                    })
                );
                liParentElement.setAttribute(leosPluginUtils.DATA_AKN_EMPTY, 'true');
                core.setToPosition(editor, liParentElement, CKEDITOR.POSITION_AFTER_START);
                editor.fire('key', {keyCode: ckEditorEvent.getKey(), domEvent: ckEditorEvent});
            }
        },

        rejectInsertedEnter: function (element, editor) {
            var keyCodeToUse = 8;
            var ckEditorEvent = new CKEDITOR.dom.event(
                new KeyboardEvent('key', {
                    keyCode: keyCodeToUse,
                    ctrlKey: false,
                    shiftKey: false,
                    getKey: function () {
                        return keyCode;
                    }
                })
            );
            element.setAttribute(leosPluginUtils.DATA_REJECT_INSERTED_ENTER, 'true');
            core.setToPosition(editor, element, CKEDITOR.POSITION_AFTER_START);
            editor.fire('key', {keyCode: ckEditorEvent.getKey(), domEvent: ckEditorEvent});
        },

        rejectChange: function(editor, element, numberModule) {
            editor.getSelection().fake(element.getParent());
            if ((element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) &&
                (element.getAttribute(core.DATA_AKN_SOFTACTION) === core.SOFTACTION_MOVE_FROM)) {
                if (this.checkIfRejectIsProcessedInBackend(editor, element, numberModule)) {
                    element.getParent().getParent().setAttribute(core.DATA_AKN_ID_TO_BE_RESTORED, element.getAttribute(core.DATA_AKN_ATTR_SOFTMOVE_FROM));
                }
                element.remove();
            } else if (element.getAttribute(core.DATA_AKN_ACTION_ENTER) === core.INSERT_ACTION && element.getName() === leosPluginUtils.HTML_SUB_POINT) {
                this.rejectInsertedEnter(element, editor);
            } else if ((element.getAttribute(core.DATA_AKN_ACTION_NUMBER) && !element.getAttribute(leosPluginUtils.DATA_AKN_NUM))
                || element.getAttribute(core.DATA_AKN_ACTION_ENTER)) {
                element.remove();
            } else if (element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) {
                element.remove();
            } else if ((element.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION) && ($(element, editor.getData()).length > 0)) {
                element.$.outerHTML = element.$.innerHTML;
            }
        },

        checkIfRejectIsProcessedInBackend: function (editor, element, numberModule) {
            var toBeProcessedInBackend = true;
            var nodeInSameEditorSession = editor.container.findOne("[id='" + element.getAttribute(core.DATA_AKN_ATTR_SOFTMOVE_FROM) + "']");
            if (nodeInSameEditorSession) {
                var nodeList = nodeInSameEditorSession.getParent().find("> li[data-akn-element='point']");
                if (nodeList.count() === 0) {
                    nodeList = nodeInSameEditorSession.getParent().find("> li[data-akn-element='paragraph']");
                }
                var changeOffset = false;
                for (var nodeListCount = 0; nodeListCount < nodeList.count(); nodeListCount++) {
                    var node = nodeList.getItem(nodeListCount);
                    if (changeOffset) {
                        var sequence = numberModule.getSequence(nodeInSameEditorSession.getParent().$);
                        if (node.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER)) {
                            var numberIndex = sequence.getIndex(node.getAttribute(leosPluginUtils.DATA_AKN_NUM));
                            if (numberIndex >= 0) {
                                node.setAttribute(leosPluginUtils.DATA_AKN_NUM, sequence.generator(nodeInSameEditorSession.getParent().$, node, numberIndex));
                            }
                        }
                    }
                    if (nodeInSameEditorSession.$ === node.$) {
                        changeOffset = true;
                    }
                }
                core.removeTrackChangesAttributes(nodeInSameEditorSession);
                core.removeTrackChangesAttributesForEnter(nodeInSameEditorSession);
                core.removeTrackChangesAttributesForNumbering(nodeInSameEditorSession);
                core.removeSoftAttributes(nodeInSameEditorSession);
                nodeInSameEditorSession.removeAttribute("data-akn-attr-softmove_to");
                nodeInSameEditorSession.setAttribute("id", nodeInSameEditorSession.getAttribute("id").replace("moved_", ""));
                toBeProcessedInBackend = false;
            }
            return toBeProcessedInBackend;
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

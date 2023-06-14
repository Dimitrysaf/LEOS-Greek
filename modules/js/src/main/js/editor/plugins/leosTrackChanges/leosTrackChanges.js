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

    var core = {

        // Track changes names and element types
        TRACKCHANGES_ELEMENT: "span", TRACKCHANGES_ELEMENT_SELECTOR: "span[data-akn-name='trackchanges']",
        ACTION_ATTR: "data-akn-action", INSERT_ACTION: "insert", DELETE_ACTION: "delete",
        STATUS_ATTR: "data-akn-status", NEW_STATUS: "new",
        UID_ATTR: "data-akn-uid",

        // Caret definitions
        CARET_START: false, CARET_END: true,

        // TC Locations / where the tc is found
        BEFORE: "before", AFTER: "after", NONE: "none", CURRENT: "current", PARENT: "parent",

        // Style element types
        STYLE_ELEMENTS:  ["strong", "em", "sub", "sup"],

        searchTrackChangeElementCheckingParent: function(editor, action) {
            editor.getSelection().getRanges()[0].optimize();
            var range = editor.getSelection().getRanges()[0];
            var startContainer = range.startContainer;
            if ((typeof(startContainer.getAttribute) != 'undefined') && (startContainer.getAttribute(this.ACTION_ATTR) === action)) {
                return [startContainer, this.CURRENT];
            } else if ((typeof(startContainer.getParent().getAttribute) != 'undefined') && (startContainer.getParent().getAttribute(this.ACTION_ATTR) === action)) {
                return [startContainer.getParent(), this.PARENT];
            } else { // If other checks not have found anything. This should be a parent.
                var tcElement = this.findElementInPathByName(editor, this.TRACKCHANGES_ELEMENT, action);
                if (tcElement) {
                    return [tcElement, this.PARENT];
                }
            }
            // Check element before and after caret
            return this.searchTrackChangeElement(editor, action);
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
            if (node && (node.type === CKEDITOR.NODE_ELEMENT) && (typeof(node.getAttribute) != 'undefined') && (node.getAttribute(this.ACTION_ATTR) === action)) {
                return [node, this.CARET_END];
            } else if (node && (node.type === CKEDITOR.NODE_TEXT) && node.hasPrevious() && (deleteKey === false)) {
                node = node.getPrevious();
                if (node && (node.type === CKEDITOR.NODE_ELEMENT) && (typeof(node.getAttribute) != 'undefined') && (node.getAttribute(this.ACTION_ATTR) === action)) {
                    return [node, this.CARET_END];
                }
            }
            return null;
        },

        searchNextTrackChangeElement: function(editor, action, deleteKey) {
            var node = editor.getSelection().getRanges()[0].getNextEditableNode();
            if (node && (node.type === CKEDITOR.NODE_ELEMENT) && (typeof(node.getAttribute) != 'undefined') && (node.getAttribute(this.ACTION_ATTR) === action)) {
                return [node, this.CARET_START];
            } else if (node && (node.type === CKEDITOR.NODE_TEXT) && node.hasNext() && (deleteKey === true)) {
                node = node.getNext();
                if (node && (node.type === CKEDITOR.NODE_ELEMENT) && (typeof(node.getAttribute) != 'undefined') && (node.getAttribute(this.ACTION_ATTR) === action)) {
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
            var d = new Date();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            return (day < 10 ? "0" : "") + day + "/" + (month < 10 ? "0" : "") + month + "/" + d.getFullYear() + " " + d.toLocaleTimeString();
        },

        getTrackChangeAttributes: function(editor, action) {
            var user = this.getUserAndId(editor);
            var tcAttributes = {
                "data-akn-name" : "trackchanges",
                "data-akn-status" : this.NEW_STATUS,
                "data-akn-action": action,
                "data-akn-uid": user[1],
                "title": user[0] + " : " + this.getDateFormat()
            };
            return tcAttributes;
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
            if (this.isEmpty(selectedElement) && this.STYLE_ELEMENTS.includes(selectedElement.getName())) {
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

        isEmpty: function(element) {
            return ((element != null) && !CKEDITOR.tools.trim(element.getText()));
        },

        isTrackChangeElement: function(element, action) {
            var elementIsTrackchange = (element != null) && (element.$.nodeType === CKEDITOR.NODE_ELEMENT) &&
                (element.getName().toLowerCase() === this.TRACKCHANGES_ELEMENT) && (element.getAttribute(this.ACTION_ATTR) === action);
            var textHasParentElementTrackchange = (element != null) && (element.getParent() != null) && (element.$.nodeType === CKEDITOR.NODE_TEXT) &&
                (element.getParent().getName().toLowerCase() === this.TRACKCHANGES_ELEMENT) && (element.getParent().getAttribute(this.ACTION_ATTR) === action);
            return elementIsTrackchange || textHasParentElementTrackchange;
        },

        isSameUserTrackChangeElement: function(editor, element, action) {
            var trackChangeElementHasSameUser = (element != null) && (element.$.nodeType === CKEDITOR.NODE_ELEMENT) &&
                (element.getName().toLowerCase() === this.TRACKCHANGES_ELEMENT) && (element.getAttribute(this.ACTION_ATTR) === action) &&
                (element.getAttribute(this.UID_ATTR) === core.getUserId(editor));
            var parentTrackChangeElementHasSameUser = (element != null) && (element.getParent() != null) && (element.$.nodeType === CKEDITOR.NODE_TEXT) &&
                (element.getParent().getName().toLowerCase() === this.TRACKCHANGES_ELEMENT) && (element.getParent().getAttribute(this.ACTION_ATTR) === action) &&
                (element.getParent().getAttribute(this.UID_ATTR) === core.getUserId(editor));
            return trackChangeElementHasSameUser || parentTrackChangeElementHasSameUser;
        },

        isSameUserAndNewTrackChangeElement: function(editor, element, action) {
            var elementIsNewTrackchange = (element != null) && (element.$.nodeType === CKEDITOR.NODE_ELEMENT) &&
                (element.getName().toLowerCase() === this.TRACKCHANGES_ELEMENT) && (element.getAttribute(this.ACTION_ATTR) === action) &&
                (element.getAttribute(this.STATUS_ATTR) === this.NEW_STATUS) && (element.getAttribute(this.UID_ATTR) === core.getUserId(editor));
            var textHasParentElementNewTrackchange = (element != null) && (element.getParent() != null) && (element.$.nodeType === CKEDITOR.NODE_TEXT) &&
                (element.getParent().getName().toLowerCase() === this.TRACKCHANGES_ELEMENT) && (element.getParent().getAttribute(this.ACTION_ATTR) === action) &&
                (element.getParent().getAttribute(this.STATUS_ATTR) === this.NEW_STATUS) && (element.getAttribute(this.UID_ATTR) === core.getUserId(editor));
            return elementIsNewTrackchange || textHasParentElementNewTrackchange;
        },

        isInsideTrackChangeElement: function(editor) {
            for (var action of [this.INSERT_ACTION, this.DELETE_ACTION]) {
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
            var editorTcStyle = UTILS.generateTrackChangesStyles(currentUserId, proposalRef, isTrackChangesShowed,
                "akomantoso div.cke_editable " + this.TRACKCHANGES_ELEMENT_SELECTOR, this.UID_ATTR, this.ACTION_ATTR);
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
        }

    };

    var actions = {

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

        insertNewData: function(editor, event) {
            editor.getSelection().getRanges()[0].optimize();
            var tcElement = core.searchTrackChangeElementCheckingParent(editor, core.INSERT_ACTION);
            if (tcElement && core.isEmpty(tcElement[0])) { // TC Element is empty then it should be removed and create a new one
                tcElement[0].remove();
                tcElement = null;
            }
            if (tcElement && tcElement[0] && (tcElement[0].getAttribute(core.UID_ATTR) === core.getUserId(editor)) && (tcElement[0].getAttribute(core.STATUS_ATTR) === core.NEW_STATUS)) {
                if (tcElement[1] === core.PARENT || tcElement[1] === core.CURRENT) {
                    return;
                } else if (tcElement[1] === core.CARET_START) {
                    core.setToEditablePosition(editor, tcElement[0], core.CARET_START);
                    return;
                } else {
                    var text = (tcElement[1] === core.CARET_END ? tcElement[0].getText() + event.getChar() : event.getChar() + tcElement[0].getText());
                    tcElement[0].setText(text);
                }
            } else {
                var newElement = core.insertTrackChangeElement(editor, core.INSERT_ACTION, event.getChar(), core.CARET_END);
                if (tcElement && tcElement[0] && (tcElement[1] === core.PARENT || tcElement[1] === core.CURRENT)) {
                    core.breakParentAndMoveTo(editor, newElement, tcElement[0], core.CARET_END);
                }
            }
            event.getInstance().data.preventDefault(); // Prevent standard insert
        },

        deleteCharacter: function(editor, event, letter, isPreviousInsertOfSameUser, isNextInsertOfSameUser,
                                  previousNodeToAddText, nextNodeToAddText) {

            /*
             * This method add a delete track change for one single character
             * Rules to join delete track change is:
             * - If they are new, we can join
             * - After save (it is not new anymore) we cannot join
             */

            var range = editor.getSelection().getRanges()[0], deleteKey = (event.getKeyCode() === 46);
            range.optimize();

            /*
             * If it is same user, we just return and don't add this character as a new track change.
             * This means it will not be included, which means just deleted.
             */
            if (deleteKey && isNextInsertOfSameUser) {
                return;
            } else if (!deleteKey && isPreviousInsertOfSameUser) {
                return;
            }

            if (!deleteKey && nextNodeToAddText) {

                nextNodeToAddText.setText(letter + nextNodeToAddText.getText());
                this.moveTo(deleteKey, range, editor, nextNodeToAddText);

            } else {

                var newElement = core.buildTrackChangeElement(editor, core.DELETE_ACTION, letter, true);
                editor.insertElement(newElement);
                this.moveTo(deleteKey, range, editor, newElement);

            }

            var previousNodeAfterChange = editor.getSelection().getRanges()[0].getPreviousNode();
            var nextNodeAfterChange = editor.getSelection().getRanges()[0].getNextNode();
            if (nextNodeAfterChange.$.textContent === '') {
                nextNodeAfterChange = editor.getSelection().getRanges()[0].getNextEditableNode();
            }
            if (deleteKey && core.isSameUserAndNewTrackChangeElement(editor, nextNodeAfterChange, core.DELETE_ACTION)) {
                previousNodeAfterChange.setText(previousNodeAfterChange.getText() + nextNodeAfterChange.getText());
                nextNodeAfterChange.remove();
            } else if (!deleteKey && core.isSameUserAndNewTrackChangeElement(editor, previousNodeAfterChange, core.DELETE_ACTION)) {
                nextNodeAfterChange.setText(previousNodeAfterChange.getText() + nextNodeAfterChange.getText());
                previousNodeAfterChange.remove();
            }

        },

        moveTo: function (deleteKey, range, editor, elementToMoveTo) {
            /*
             * If it is a delete key, we need move forward.
             * If it is a backspace key, we need move backward.
             */
            if (!deleteKey) {
                range = editor.createRange();
                range.moveToPosition(elementToMoveTo, CKEDITOR.POSITION_AFTER_START);
                range.select();
            } else {
                range = editor.createRange();
                range.moveToPosition(elementToMoveTo, CKEDITOR.POSITION_BEFORE_END);
                range.select();
            }
            return range;
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

        /*
         * Method used in "key" listener when we have just 1 line selected.
         * Make use of addTrackChangesNested for reusability.
         */
        deleteTextAndAddTrackChange: function(editor, range, childrenFromFragment) {
            if (!range.collapsed) {
                range.collapse(true);
                range.select();
            }
            var closedElements = this.addTrackChangesNested(editor, range, childrenFromFragment);
            for (var i = 0; i < closedElements.length; i++) {
                editor.insertElement(closedElements[i]);
            }
            editor.fire("saveSnapshot");
        },

        /*
         * Method used in "key" listener when we have MORE than 1 line selected.
         * Make use of addTrackChangesNested for reusability.
         */
        deleteFromListAndAddTrackChange: function(editor, range, nodeList) {
            if (!range.collapsed) {
                range.collapse(true);
                range.select();
            }
            for (var i = 0; i < nodeList.toArray().length; i++) {
                var domElement = nodeList.getItem(i).$;
                var outerHTML = "";
                var closedElements = this.addTrackChangesNested(editor, range, new CKEDITOR.dom.nodeList(domElement.childNodes));
                for (var countClosedElements = 0; countClosedElements < closedElements.length; countClosedElements++) {
                    outerHTML += closedElements[countClosedElements].$.outerHTML;
                }
                /*
                 * Three ways to thread selection with MORE than 1 line:
                 * - When we are in first line
                 * - Last line
                 * - Middle lines
                 */
                var currentElement = editor.getSelection().document.find('#' + domElement.id).getItem(0).$;
                if (i === 0 && currentElement.innerHTML.length !== domElement.innerHTML.length) {
                    currentElement.innerHTML =
                        currentElement.innerHTML.substring(0, currentElement.innerHTML.length - domElement.innerHTML.length) +
                        outerHTML;
                } else if(i === nodeList.toArray().length-1 && currentElement.innerHTML.length !== domElement.innerHTML.length) {
                    currentElement.innerHTML = outerHTML + currentElement.innerHTML.substring(domElement.innerHTML.length);
                } else {
                    currentElement.innerHTML = outerHTML;
                }
            }
            editor.fire("saveSnapshot");
        },

        /*
         * childrenElements is a CKEDITOR.dom.nodeList
         *
         * To make code more reusable, this method is used in
         * - deleteTextAndAddTrackChange
         * - deleteFromListAndAddTrackChange
         * - listener for "cut"
         */
        addTrackChangesNested: function(editor, range, childrenElements) {
            var html = "";
            var closedElements = new Array();
            for (var i = 0; i < childrenElements.toArray().length; i++) {
                var child = childrenElements.getItem(i);
                /*
                 * When we meet a deleted, we close the tag, to start a new one,
                 * as we don't have deleted inside deleted.
                 */
                if (core.isTrackChangeElement(child, core.DELETE_ACTION)) {
                    if (html !== "") {
                        var tcItemToClose = core.buildTrackChangeElement(editor, core.DELETE_ACTION, html, true);
                        closedElements.push(tcItemToClose);
                    }
                    closedElements.push(child);
                    html = "";
                } else if (core.isTrackChangeElement(child, core.INSERT_ACTION)) {
                    /*
                     * When we meed a inserted track change block and same user,
                     * we ignore it to NOT be added.
                     */
                    if (child.getAttribute(core.UID_ATTR) !== core.getUserId(editor)) {
                        html += child.$.outerHTML;
                    }
                } else {
                    /*
                     * For elements that are NOT track change, we add it using outerHTML
                     * For text elements, we add using textContent
                     */
                    html += child.$.outerHTML ? child.$.outerHTML : child.$.textContent;
                }
            }
            /*
             * To finalize, we need close the final tag
             */
            if (html !== "") {
                var tcItem = core.buildTrackChangeElement(editor, core.DELETE_ACTION, html, true);
                closedElements.push(tcItem);
            }
            return closedElements;
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

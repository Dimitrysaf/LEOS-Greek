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
define(function leosTrackChangesModule(require) {
    "use strict";

    var log = require("logger");
    var UTILS = require("core/leosUtils");
    var leosPluginUtils = require("plugins/leosPluginUtils");
    var identityHandler = require("plugins/leosAttrHandler/leosIdentityHandlerModule");
    var core = {

        // Track changes names and element types
        TRACKCHANGES_ELEMENT: "span", TRACKCHANGES_ELEMENT_SELECTOR: "span[data-akn-action]", TRACKCHANGES_TABLE_ROW_ELEMENT_SELECTOR: "tr[data-akn-action]",
        SOFT_ACTION_ATTR: "data-akn-attr-softaction", LEOS_SOFT_ACTION_ATTR: "leos:softaction", LEOS_SOFT_ACTION_MOVE_FROM_VALUE: "move_from",
        LEOS_ACTION_ATTR: "leos:action", ACTION_ATTR: "data-akn-action", INSERT_ACTION: "insert", DELETE_ACTION: "delete",
        LEOS_UID_ATTR: "leos:uid", UID_ATTR: "data-akn-uid", ARTICLE:"article", SIGNATORY:"signatory", SIGNATURE: "signature", ID: "id",
        CITATION:"citation", RECITAL:"recital", LEVEL: "level", TABLE: "table", ORGANIZATION: "organization", ROLE: "role", PERSON: "person",
        SIGNATURE_SELECTOR: ":has(p[data-akn-name='organization'] ~ p[data-akn-name='role'] ~ p[data-akn-name='person'])",

        DATA_AKN_TC_ORIGINAL_NUMBER: "data-akn-tc-original-number", DATA_AKN_TC_ORIGINAL_INDENT_ACTION: "data-akn-tc-original-indent-action",
        DATA_INDENT_ORIGIN_LEVEL: "data-indent-origin-indent-level", DATA_AKN_ACTION_NUMBER: "data-akn-action-number",
        UNNUMBERED: "UNNUMBERED", NEW: "NEW", DATA_AKN_ACTION_ENTER: "data-akn-action-enter",
        DATA_AKN_NUM_DEL_ACTION: "data-akn-num-del-action",  DATA_AKN_NUM_INS_ACTION: "data-akn-num-ins-action",
        DATA_AKN_RENUMBER: "data-akn-renumber", DATA_AKN_RENUMBER_ORIGIN: "data-akn-renumber-origin",
        DATA_AKN_ID_TO_BE_REMOVED: "data-akn-id-to-be-removed", DATA_AKN_ID_TO_BE_RESTORED: "data-akn-id-to-be-restored",
        ACCEPT: "accept", REJECT: "reject", TRACKCHANGES_NUMBER_ELEMENT_SELECTOR: "li[data-akn-action-number]",
        DATA_AKN_NAME: "data-akn-name", DATA_AKN_ELEMENT: "data-akn-element",

        DATA_AKN_SOFTACTION: "data-akn-attr-softaction", DATA_AKN_ATTR_SOFTMOVE_FROM: "data-akn-attr-softmove_from",
        DATA_AKN_ATTR_SOFTMOVE_TO: "data-akn-attr-softmove_to",
        SOFTACTION_MOVE_FROM: "move_from", SOFTACTION_MOVE_TO: "move_to",

        BULLET: "•",

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

        getTrackChangeAttributesForAlternative: function(editor, originalOption) {
            var user = this.getUserAndId(editor);
            var tcAttributes = {
                "data-akn-action-alter": true,
                "data-akn-original-option": originalOption
            };
            return tcAttributes;
        },

        removeTrackChangesAttributes: function(element) {
            var tcAttributes = ["data-akn-action", "data-akn-uid", "title", "data-wsc-ignore-checking"];
            for (var attrName of tcAttributes) {
                element.removeAttribute(attrName);
            }
        },

        removeTrackChangesAttributesForNumberingDelete: function(element) {
            var tcAttributes = ["data-akn-num"];
            for (var attrName of tcAttributes) {
                element.removeAttribute(attrName);
            }
        },

        removeTrackChangesAttributesForNumbering: function(element) {
            var tcAttributes = ["data-akn-action-number", "data-akn-uid-number", "title-number", "data-akn-tc-original-number",
                "data-akn-tc-original-indent-action", "data-indent-origin-indent-level", "NEW"];
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

        removeTrackChangesAttributesForAlternative: function(element) {
            var tcAttributes = ["data-akn-action-alter", "data-akn-original-option"];
            for (var attrName of tcAttributes) {
                element.removeAttribute(attrName);
            }
        },

        removeSoftAttributes: function(element) {
            var softAttributes = ["data-akn-attr-softuser", "data-akn-attr-softdate", "data-akn-attr-softaction",
                "data-akn-attr-softactionroot", "data-akn-attr-softmove_label", "data-akn-attr-softmove_from", "data-akn-attr-softmove_to"];
            for (var attrName of softAttributes) {
                element.removeAttribute(attrName);
            }
            if (element.classList) {
                element.classList.remove("selectedMovedElement");
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

        addTrackChangesAttributesForAlternative: function(editor, element, originalOption) {
            var tcAttributes = this.getTrackChangeAttributesForAlternative(editor, originalOption);
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

        updateTransformedAlternateArticle: function(tcElement, editor) {
            // Regex pattern to match everything between the first <paragraph> and the last </paragraph>
            const regex = /<paragraph[^>]*>[\s\S]*?<\/paragraph>/g;
            const doc = UTILS.getHtmlDocFromMatch(tcElement, regex, editor);
            const liElements = doc.querySelectorAll('li');
            liElements.forEach(element => {
                core.addTrackChangesAttributesForNumbering(editor, element, core.INSERT_ACTION);
            })
            const updatedHTML = doc.body.innerHTML;
            tcElement.$.innerHTML = updatedHTML;
        },

        updateTransformedAlternateSignatory: function(tcElement, editor) {
            // Regex pattern to match everything between the first <signature> and the last <signature>
            const regex = /<signature[^>]*>[\s\S]*?<\/signature>/g;
            const doc = UTILS.getHtmlDocFromMatch(tcElement, regex, editor);
            tcElement.$.innerHTML = doc.body.innerHTML;
        },

        insertTrackChangeElement: function(editor, action, text, toEnd, isHtml) {

            // function added in #2738, check if it can be removed in #2739
            function isEmptyDeleteTrackChange() {
                return selectedElement.is('br') && core.isTrackChangeElement(selectedElement.getAscendant(core.TRACKCHANGES_ELEMENT), core.DELETE_ACTION);
            }

            function insertAlternativeSignature() {
                core.updateTransformedAlternateSignatory(tcElement, editor);
                tcElement.insertAfter(range.startContainer.getAscendant('td', true).getLast());
            }

            editor.fire('lockSnapshot', { "dontUpdate": true });
            var tcElement = this.buildTrackChangeElement(editor, action, text, isHtml);
            var selectedElement = editor.getSelection().getStartElement();
            var range = editor.getSelection().getRanges()[0];
            if(selectedElement.getName() === 'div' && !leosPluginUtils.isRecitalAA(selectedElement)) {
                let lastEditable = leosPluginUtils.findLastEditable(selectedElement);
                if (lastEditable) {
                    // Create a range for the last <li> or <p>
                    range = editor.createRange();
                    range.selectNodeContents(lastEditable);
                    // Apply the range to the editor's selection
                    editor.getSelection().selectRanges([range]);
                    selectedElement = lastEditable;
                }
            }

            if (core.isTrackChangeElement(selectedElement, core.DELETE_ACTION)) {
                if (range && (range.endOffset - range.startOffset) <= 1 && !range.collapsed) {
                    if (range.root.getFirst().getName() === core.ARTICLE) {
                        this.updateTransformedAlternateArticle(tcElement, editor);
                        tcElement.insertAfter(range.startContainer.getAscendant('ol').getLast());
                    } else if (range.root.getLast().getAttribute  && range.root.getLast().getAttribute(core.DATA_AKN_NAME) === core.SIGNATORY) {
                        insertAlternativeSignature();
                    } else {
                        tcElement.insertAfter(selectedElement);
                    }
                } else {
                    tcElement.insertAfter(selectedElement);
                }
                tcElement.mergeSiblings();
            // condition added in #2738, check if it can be removed in #2739
            } else if (isEmptyDeleteTrackChange() && range.getCommonAncestor().getAttribute
                    && range.getCommonAncestor().getAttribute(core.DATA_AKN_NAME) === core.SIGNATURE) {
                insertAlternativeSignature();
                while (isEmptyDeleteTrackChange()) {
                    range.setStartAfter(selectedElement.getParent().getParent());
                    range.select();
                    selectedElement.getParent().getParent().remove();
                    selectedElement = editor.getSelection().getStartElement();
                }
            } else if (this.STYLE_ELEMENTS.includes(selectedElement.getName())) {
                tcElement.insertAfter(selectedElement);
            } else {
                // if selectedElement is div, wrap tcElement in a <p> tag
                if(selectedElement.getName() === 'div' && !!selectedElement.getAttribute(core.DATA_AKN_NAME)
                    && selectedElement.getAttribute(core.DATA_AKN_NAME).toLowerCase() === UTILS.BLOCKCONTAINER ){
                    var paragraphElement = new CKEDITOR.dom.element(leosPluginUtils.HTML_SUB_POINT);
                    paragraphElement.setAttribute(leosPluginUtils.DATA_AKN_NAME, 'aknParagraph');
                    paragraphElement.append(tcElement);
                    tcElement = paragraphElement;
                }

                editor.editable().insertElementIntoRange(tcElement, range);
            }

            this.setToEditablePosition(editor, tcElement, toEnd);
            editor.fire('unlockSnapshot');
            return tcElement;
        },

        toArray: function(list) {
            var array = new Array();
            for (var i = 0; i < list.count(); i++) { array[i] = list.getItem(i); }
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

        isInsideTrackedDeletedOrSoftMovedToElement: function(editor) {
            var selection = editor.getSelection();
            if (selection) {
                var path = selection.getRanges()[0].startPath();
                for (var i = 0; path.elements.length > i; i++) {
                    var el = path.elements[i];
                    if ((el.getName() !== this.TRACKCHANGES_ELEMENT) && ((el.getAttribute(this.ACTION_ATTR) === core.DELETE_ACTION) ||
                        (el.getAttribute(this.DATA_AKN_SOFTACTION) === this.SOFTACTION_MOVE_TO) || el.hasClass("selectedMovedElement"))) {
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

        isNewTrackChangeNumber: function(range) {
            var hasNewNumberAttribute = false;
            var elementToCheck = range.startContainer;
            if (elementToCheck.type === CKEDITOR.NODE_TEXT) { elementToCheck = elementToCheck.getParent() }
            do {
                if (elementToCheck.getAttribute(this.DATA_AKN_TC_ORIGINAL_NUMBER) === this.NEW) {
                    hasNewNumberAttribute = true;
                }
            } while (!hasNewNumberAttribute && elementToCheck.getName() !== 'li' && (elementToCheck = elementToCheck.getParent()));
            return hasNewNumberAttribute;
        },

        isNewTrackChangeEnter: function(range) {
            var hasNewEnterAttribute = false;
            var elementToCheck = range.startContainer;
            if (elementToCheck.type === CKEDITOR.NODE_TEXT) { elementToCheck = elementToCheck.getParent() }
            do {
                if (elementToCheck.getAttribute(this.DATA_AKN_ACTION_ENTER) === this.INSERT_ACTION) {
                    hasNewEnterAttribute = true;
                }
            } while (!hasNewEnterAttribute && elementToCheck.getName() !== 'li' && (elementToCheck = elementToCheck.getParent()));
            return hasNewEnterAttribute;
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
                if (element.hasAttribute(core.NEW)) {
                    element.setAttribute(this.DATA_AKN_TC_ORIGINAL_NUMBER, core.NEW);
                } else {
                    element.setAttribute(this.DATA_AKN_TC_ORIGINAL_NUMBER, previousNumber ? previousNumber : core.UNNUMBERED);
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

        isMouseOverPseudoElt: function(element, pseudoElt, mousePosition) {
            var positionEditor = UTILS.getElementPosition(element);
            var top = positionEditor[1], bottom = top + parseInt(window.getComputedStyle(element, ":" + pseudoElt).height);
            var left = positionEditor[0], right = left + parseInt(window.getComputedStyle(element, ":" + pseudoElt).width);
            var mouseX = mousePosition[0], mouseY = mousePosition[1];
            return ((mouseX >= (left - 5)) && (mouseX <= (right + 5)) && (mouseY >= (top - 5)) && (mouseY <= (bottom + 5)));
        },

        hasTrackChanges: function(elementId, editor) {
            var element = editor.document.find('.leos-placeholder').getItem(0).find(`#${elementId}`).getItem(0);
            return element && element.getAttribute(core.DATA_AKN_ELEMENT) != core.LEVEL &&
                (element.hasAttribute(this.ACTION_ATTR)
                    || element.hasAttribute(this.DATA_AKN_ACTION_NUMBER)
                    || element.hasAttribute(this.DATA_AKN_ACTION_ENTER));
        },

        getLastTCElement: function(elementId, editor, processedElements) {
            var element = editor.document.find('.leos-placeholder').getItem(0).find(`#${elementId}`).getItem(0);
            if(element) {
                for (var i = element.getChildCount()-1; i >= 0; i--) {
                    var childElement = element.getChild(i);
                    if (!childElement || childElement.type === CKEDITOR.NODE_TEXT || (processedElements && processedElements.has(childElement.getAttribute(this.ID)))) {
                        continue;
                    }
                    if(childElement.type === CKEDITOR.NODE_ELEMENT && childElement.getChildCount() > 0) {
                        var idToSend = childElement.getAttribute(core.ID);
                        var lastTCElement = this.getLastTCElement(idToSend, editor, processedElements);
                        if(lastTCElement) {
                            return lastTCElement;
                        }
                    }
                    if (this.hasTrackChanges(childElement.getAttribute(this.ID), editor)) {
                        return childElement;
                    }
                }
                if (this.hasTrackChanges(element.getAttribute(this.ID), editor)) {
                    return element;
                }
            }
        }
    };

    var actions = {

        handleEnterInTrackChanges: function(editor) {
            var selection = editor.getSelection();
            var ranges = selection && selection.getRanges();
            var range = ranges && ranges[0];
            var el = range && range.startContainer;
            if (el && core.isTrackChangeElement(el, core.INSERT_ACTION) && (el.getText() === '') && !el.getChildCount()) {
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
                } else {
                    newElement.mergeSiblings();
                }
            }
            editor.fire("change");
            return true;
        },

        selectElementToDelete: function(deleteKey, editor) {
            var selectedNode;
            var position = !deleteKey ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START;

            do {
                selectedNode = deleteKey ? editor.getSelection().getRanges()[0].getNextNode() :
                    editor.getSelection().getRanges()[0].getPreviousNode();
                if(selectedNode && selectedNode.$.nodeType == CKEDITOR.NODE_ELEMENT &&
                    typeof selectedNode.getName === 'function' && selectedNode.getName() == 'br'){
                    selectedNode = deleteKey ? selectedNode.getNext() : selectedNode.getPrevious();
                }
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

        findSelector: function (element) {
            let nativeElement = element.$;
            // Get the tag name (lowercase for consistency)
            const tag = nativeElement.tagName.toLowerCase();

            // Get all attributes
            const attributes = Array.from(nativeElement.attributes)
                .map(attr => `[${attr.name}="${attr.value.replace(/"/g, '\\"')}"]`)
                .join('');

            // Combine tag and attributes
            const selector = `${tag}${attributes}`;
            return selector;
        },

        isElementPresentInEditor(editor, element) {
            if(!!element.getAttribute(core.ID)) {
                return !!editor.document.find('.leos-placeholder').getItem(0).find(`#${element.getAttribute(core.ID)}`).getItem(0);
            }else if(!!element.getAttribute(leosPluginUtils.DATA_AKN_MP_ID)) {
                return !!editor.document.find('.leos-placeholder').getItem(0).find(`[${leosPluginUtils.DATA_AKN_MP_ID}=${element.getAttribute(leosPluginUtils.DATA_AKN_MP_ID)}]`).getItem(0);
            }else{
                const selector = this.findSelector(element);
                return !!editor.document.find('.leos-placeholder').getItem(0).find(selector).getItem(0);
            }
        },

        acceptAllChanges: function(editor) {
            var processedElements = new Set();
            var isStructureTooComplex = [false];
            this.processAllChanges(editor, 'acceptElement', processedElements, isStructureTooComplex, 0);
            if(!isStructureTooComplex[0]){
                this.finalValidation(editor, isStructureTooComplex);
            }
            if(isStructureTooComplex[0]){
                editor.fire("handleTcComplexStructure");
            }
            editor.focus();
        },

        rejectAllChanges: function(editor) {
            var processedElements = new Set();
            var isStructureTooComplex= [false];
            this.processAllChanges(editor, 'rejectElement', processedElements, isStructureTooComplex, 0);
            if(!isStructureTooComplex[0]){
                this.finalValidation(editor, isStructureTooComplex);
            }
            if(isStructureTooComplex[0]){
                editor.fire("handleTcComplexStructure");
            }
            editor.focus();
        },

        processAllChanges: function (editor, actionName, processedElements, isStructureTooComplex, iterationCount) {
            const MAX_ITERATIONS= 30;
            if(isStructureTooComplex[0]){
                return;
            }
            if (iterationCount >= MAX_ITERATIONS) {
                console.warn("processAllChanges: max iterations reached, stopping to avoid infinite loop");
                isStructureTooComplex[0] = true;
                return;
            }
            var isElementDeleted = false;
            var element = editor.document.find('.leos-placeholder').getItem(0);
            this.injectTagIdsInNodeIncludingSpan(element);
            var maxDepth = this.findMaximusDepth(element);
            if(maxDepth > 0) {
                for (var i = maxDepth; i > 0; i--) {
                    var listElements = this.findListElementsByDepth(element, i);
                    for (var j = listElements.length - 1; j >= 0; j--) {
                        var listElementToProcess = listElements[j];
                        isElementDeleted = this.processListElement(editor, listElementToProcess, processedElements, actionName, isStructureTooComplex);
                        if (isElementDeleted || isStructureTooComplex[0]) {
                            break;
                        }
                    }
                    if (isElementDeleted || isStructureTooComplex[0]) {
                        break;
                    }
                }
                if (isElementDeleted && !isStructureTooComplex[0]) {
                    this.processAllChanges(editor, actionName, processedElements, isStructureTooComplex, iterationCount + 1);
                }
                if(isStructureTooComplex[0]){
                    return;
                }
            }
            this.injectTagIdsInNodeIncludingSpan(element);
            var editableElements = element.find("[data-akn-attr-editable='true']");
            if(editableElements.count() == 0){
                editableElements = element.find("[leos\\:editable='true']");
            }
            if(editableElements.count() == 0){ //signature
                editableElements = element.find("td[data-akn-name='signature']");
            }
            if(editableElements.count() == 0){ //LFDS
                editableElements = element.find("ol[data-akn-name='aknAnnexList']");
            }
            if(editableElements.count() == 0){ //HigherDivision
                editableElements = element.find("h2[data-akn-name='aknHeading']");
            }
            for (var j = editableElements.count() - 1; j >= 0; j--) {
                var edElementToProcess = editableElements.getItem(j);
                isElementDeleted = this.processListElement(editor, edElementToProcess, processedElements, actionName, isStructureTooComplex);
                if (isElementDeleted || isStructureTooComplex[0]) {
                    break;
                }
            }
            if (isElementDeleted && !isStructureTooComplex[0]) {
                this.processAllChanges(editor, actionName, processedElements, isStructureTooComplex, iterationCount + 1);
            }
        },

        finalValidation(editor, isStructureTooComplex){
            // do last check of track changes
            var element = editor.document.find('.leos-placeholder').getItem(0);
            var edElementToProcess;
            var maxDepth = this.findMaximusDepth(element);
            var editableElements;
            if(maxDepth > 0) {
                editableElements = this.findListElementsByDepth(element, 1);
            }else{
                editableElements = element.find("[data-akn-attr-editable='true']");
                if(editableElements.count() == 0){
                    editableElements = element.find("[leos\\:editable='true']");
                }
                if(editableElements.count() == 0){ //signature
                    editableElements = element.find("td[data-akn-name='signature']");
                }
                if(editableElements.count() == 0){ //LFDS
                    editableElements = element.find("ol[data-akn-name='aknAnnexList']");
                }
                if(editableElements.count() == 0){ //HigherDivision
                    editableElements = element.find("h2[data-akn-name='aknHeading']");
                }
                editableElements = editableElements.count() > 0 ? [editableElements.getItem(0)] : [];
            }
            if(editableElements.length > 0){
                edElementToProcess = editableElements[0];
                var idToSend = edElementToProcess.getAttribute(core.ID);
                var lastTCElement = core.getLastTCElement(idToSend, editor, new Set());
                if(lastTCElement){
                    isStructureTooComplex[0]=true;
                }
            }
        },

        injectTagIdsInNodeIncludingSpan(element) {
            if (!element){
                return;
            }

            let tagName = element.getName();
            if ("meta" === tagName) {
                return;
            }

            if (!["akomaNtoso", "bill", "documentCollection", "div", "doc", "attachments", "br" ].includes(tagName)) {
                let idAttrValue = element.getAttribute(core.ID);
                if (idAttrValue == null || idAttrValue.trim().length == 0) {
                    element.setAttribute(core.ID, identityHandler.generateId());
                    element.setAttribute(core.NEW, '');
                    element.removeAttribute(leosPluginUtils.DATA_AKN_CONTENT_ID);
                    element.removeAttribute(leosPluginUtils.DATA_AKN_WRAPPED_CONTENT_ID);
                }
            }

            let children = element.getChildren();
            for (let i = 0; i < children.count(); i++) {
                let child = children.getItem(i)
                if (child.$.nodeType === Node.ELEMENT_NODE) {
                    this.injectTagIdsInNodeIncludingSpan(child);
                }
            }
        },

        processListElement: function (editor, listElementToProcess, processedElements, actionName, isStructureTooComplex) {
            // Process table rows
            var rowElements = listElementToProcess.find(`table tr[${core.ACTION_ATTR}]`);
            for (var i = rowElements.count() - 1; i >= 0; i--) {
                var rowElementToProcess = rowElements.getItem(i);
                this.processElement(editor, rowElementToProcess, processedElements, actionName, isStructureTooComplex);
                if(isStructureTooComplex[0]){
                    break;
                }
            }

            // Process Soft Enter Inserts
            var softEnterElements = listElementToProcess.find(`p[${core.DATA_AKN_ACTION_ENTER}], li[${core.DATA_AKN_ACTION_ENTER}], li[${core.DATA_AKN_ACTION_NUMBER}]`);
            for (var j = softEnterElements.count() - 1; j >= 0; j--) {
                var softEnterElementToProcess = softEnterElements.getItem(j);
                if (!softEnterElementToProcess.hasAttribute(leosPluginUtils.DATA_AKN_NUM)) {
                    this.processElement(editor, softEnterElementToProcess, processedElements, actionName, isStructureTooComplex);
                    if(isStructureTooComplex[0]){
                        break;
                    }
                }
            }
            if(!isStructureTooComplex[0]){
                this.processElement(editor, listElementToProcess, processedElements, actionName, isStructureTooComplex);
            }else{
                return true;
            }

            this.processElement(editor, listElementToProcess, processedElements, actionName, isStructureTooComplex);

            return !this.isElementPresentInEditor(editor, listElementToProcess);
        },

        processElement: function (editor, element, processedElements, actionName, isStructureTooComplex) {
            this.injectTagIdsInNodeIncludingSpan(element);
            if (this.isElementPresentInEditor(editor, element) && !isStructureTooComplex[0]) {
                var idToSend = element.getAttribute(core.ID) ? element.getAttribute(core.ID) :
                    (element.getAttribute(leosPluginUtils.DATA_AKN_MP_ID) ? element.getAttribute(leosPluginUtils.DATA_AKN_MP_ID) : this.findSelector(element)) ;
                var lastTCElement = core.getLastTCElement(idToSend, editor, processedElements);
                if (!lastTCElement || !processedElements || !lastTCElement.hasAttribute(core.ID)) {
                    return;
                }
                var id = lastTCElement.getAttribute(core.ID);

                if (!processedElements.has(id)) {
                    editor.execCommand(actionName, lastTCElement);
                    processedElements.add(id);
                    this.processElement(editor, element, processedElements, actionName, isStructureTooComplex);
                } else {
                    isStructureTooComplex[0] = true;
                }
            }
        },

        findListElementsByDepth: function (root, targetDepth) {
            const result = [];

            function traverse(node, currentDepth) {
                if (node.getName && ['ol', 'ul'].includes(node.getName().toLowerCase()) && node.getAttribute && !!node.getAttribute(core.ID)) {
                    currentDepth++; // Entering a deeper ol or ul
                    if (currentDepth === targetDepth) {
                        result.push(node);
                    }
                }

                if (node.getChildCount) {
                    for (var i = node.getChildCount() - 1; i >= 0; i--) {
                        var child = node.getChild(i);
                        traverse(child, currentDepth);
                    }
                }
            }

            traverse(root, 0);

            return result;
        },

        findMaximusDepth: function (root) {
            let maxDepth = 0;

            function traverse(node, depth) {
                if (node.getName && ['ol', 'ul'].includes(node.getName().toLowerCase()) && node.getAttribute && !!node.getAttribute(core.ID)) {
                    depth++; // Increase depth when encountering an <ol> or <ul>
                    if (depth > maxDepth) {
                        maxDepth = depth;
                    }
                }

                if (node.getChildCount) {
                    for (var i = node.getChildCount() - 1; i >= 0; i--) {
                        var child = node.getChild(i);
                        traverse(child, depth);
                    }
                }
            }

            traverse(root, 0);

            return maxDepth;
        },

        acceptChange: function(editor, element, numberModule) {
            if (element.getAttribute(core.DATA_AKN_ACTION_ENTER) === core.DELETE_ACTION) {
                this.removeEnterAndJoinLines(element, editor);
            } else if (element.getAttribute(core.DATA_AKN_ACTION_ENTER) === core.INSERT_ACTION || (element.getAttribute(core.DATA_AKN_ACTION_NUMBER) && !element.getAttribute(leosPluginUtils.DATA_AKN_NUM)) ||
                ((element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) && (element.getAttribute(core.DATA_AKN_SOFTACTION) === core.SOFTACTION_MOVE_FROM))) {
                if ((element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION)
                    && (element.getAttribute(core.DATA_AKN_SOFTACTION) === core.SOFTACTION_MOVE_FROM)
                    && this.checkIfAcceptIsProcessedInBackend(editor, element, numberModule)) {
                    if (element && element.is('p') && element.getAttribute("data-akn-element") == "subparagraph" &&
                        element.getParent().is('li') && element.getParent().getAttribute("data-akn-element") == "point") {
                        element.getParent().setAttribute(core.DATA_AKN_ID_TO_BE_REMOVED, element.getAttribute(core.DATA_AKN_ATTR_SOFTMOVE_FROM));
                        element.getParent().setAttribute(core.DATA_AKN_RENUMBER_ORIGIN, core.ACCEPT);
                    } else {
                        element.setAttribute(core.DATA_AKN_ID_TO_BE_REMOVED, element.getAttribute(core.DATA_AKN_ATTR_SOFTMOVE_FROM));
                        element.setAttribute(core.DATA_AKN_RENUMBER_ORIGIN, core.ACCEPT);
                    }
                }
                core.removeTrackChangesAttributes(element);
                core.removeTrackChangesAttributesForEnter(element);
                core.removeTrackChangesAttributesForNumbering(element);
                core.removeSoftAttributes(element);
                element.setAttribute(core.DATA_AKN_RENUMBER, core.ACCEPT);
                if (!element.getAttribute(leosPluginUtils.ID)) {
                    element.setAttribute(leosPluginUtils.ID, "XtempXtcX" + Date.now().toString(36) + Math.random().toString(36).substring(2));
                }
            } else if (element.getAttribute(core.DATA_AKN_ACTION_NUMBER) && !element.hasAttribute(core.DATA_AKN_SOFTACTION)) {
                for (var elementSibling of element.getParent().$.children) {
                    if (elementSibling.getAttribute(core.DATA_AKN_ACTION_NUMBER) && elementSibling.getAttribute(leosPluginUtils.DATA_AKN_NUM) && !elementSibling.getAttribute(core.ACTION_ATTR)) {
                        core.removeTrackChangesAttributes(elementSibling);
                        if(elementSibling.getAttribute(core.DATA_AKN_ACTION_NUMBER) === core.DELETE_ACTION) {
                            core.removeTrackChangesAttributesForNumberingDelete(elementSibling);
                        }
                        core.removeTrackChangesAttributesForNumbering(elementSibling);
                        core.removeSoftAttributes(elementSibling);
                        elementSibling.setAttribute(core.DATA_AKN_RENUMBER, core.ACCEPT);
                        if (!elementSibling.getAttribute(leosPluginUtils.ID)) {
                            elementSibling.setAttribute(leosPluginUtils.ID, "XtempXtcX" + Date.now().toString(36) + Math.random().toString(36).substring(2));
                        }
                    }
                }
            } else if (element.getAttribute(core.DATA_AKN_ACTION_NUMBER) && !element.hasAttribute(core.ACTION_ATTR)) {
                for (var elementSibling of element.getParent().$.children) {
                    if (elementSibling.getAttribute(core.DATA_AKN_ACTION_NUMBER) && elementSibling.getAttribute(leosPluginUtils.DATA_AKN_NUM) && !elementSibling.getAttribute(core.ACTION_ATTR)) {
                        core.removeTrackChangesAttributes(elementSibling);
                        if(elementSibling.getAttribute(core.DATA_AKN_ACTION_NUMBER) === core.DELETE_ACTION) {
                            core.removeTrackChangesAttributesForNumberingDelete(elementSibling);
                        }
                        core.removeTrackChangesAttributesForNumbering(elementSibling);
                        core.removeSoftAttributes(elementSibling);
                        elementSibling.setAttribute(core.DATA_AKN_RENUMBER, core.ACCEPT);
                        if (!elementSibling.getAttribute(leosPluginUtils.ID)) {
                            elementSibling.setAttribute(leosPluginUtils.ID, "XtempXtcX" + Date.now().toString(36) + Math.random().toString(36).substring(2));
                        }
                    }
                }

            } else {
                editor.getSelection().fake(element.getParent());
                if (element.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION) {
                    var liParentElement = element.getParent();
                    var pOrDivParentElement = element.getAscendant({ p:1, div:1 });
                    if ( element.getAttribute(core.DATA_AKN_SOFTACTION) === core.SOFTACTION_MOVE_TO
                        && this.checkIfAcceptIsProcessedInBackendMovedTo(editor, element, numberModule)) {
                        element.getParent().getParent().setAttribute(core.DATA_AKN_ID_TO_BE_RESTORED, element.getAttribute(core.DATA_AKN_ATTR_SOFTMOVE_TO));
                    }
                    this.removeElementAndEmptySubflow(element);

                    if (pOrDivParentElement && !pOrDivParentElement.getText().trim()) {
                        let lastEditable = leosPluginUtils.findLastEditable(pOrDivParentElement.getAscendant("div"));
                        let isSignatureElement = leosPluginUtils.isSignatureElement(pOrDivParentElement.$);
                        // condition added in #2738, check if it can be removed in #2739
                        if (leosPluginUtils.isDuplicatedSignatureElement(pOrDivParentElement.$)) {
                            pOrDivParentElement.remove();
                        } else if (!!lastEditable && lastEditable.getId() == pOrDivParentElement.getId() || isSignatureElement) {
                            pOrDivParentElement.appendBogus();
                            var range = editor.createRange();
                            range.selectNodeContents(pOrDivParentElement);
                            range.collapse(true);
                            editor.getSelection().selectRanges([range]);
                            editor.focus();
                        }
                    }
                    if (this.checkIfEmptyListElement(liParentElement)) {
                        this.removeEmptyElement(liParentElement, numberModule, editor);
                    }
                } else if ((element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) && ($(element, editor.getData()).length > 0)) {
                    element.$.outerHTML = element.$.innerHTML;
                }
            }
            editor.focus();
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
                        if (originalNumber && sequence) {
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

        checkIfAcceptIsProcessedInBackendMovedTo: function (editor, element, numberModule) {
            var toBeProcessedInBackend = true;
            var nodeInSameEditorSession = editor.container.findOne("[id='" + element.getAttribute(core.DATA_AKN_ATTR_SOFTMOVE_TO) + "']");
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
                        if (originalNumber && sequence) {
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
                core.removeTrackChangesAttributes(nodeInSameEditorSession);
                core.removeTrackChangesAttributesForEnter(nodeInSameEditorSession);
                core.removeTrackChangesAttributesForNumbering(nodeInSameEditorSession);
                core.removeSoftAttributes(nodeInSameEditorSession);
                toBeProcessedInBackend = false;
            }
            return toBeProcessedInBackend;
        },

        checkIfEmptyListElement(element) {
            var liParentElementToCheckText = element;
            while (liParentElementToCheckText && liParentElementToCheckText.getName() !== 'li') {
                liParentElementToCheckText = liParentElementToCheckText.getParent();
            }
            var liParentElementToCheckNumber = element;
            liParentElementToCheckNumber = this.getParentToCheckAndRemove(liParentElementToCheckNumber);
            if (liParentElementToCheckText && liParentElementToCheckText.getText().trim() === ''
                && liParentElementToCheckNumber && liParentElementToCheckNumber.getParent()
                && liParentElementToCheckNumber.getAttribute(leosPluginUtils.DATA_AKN_NUM)) {
                return true;
            }
            return false;
        },

        removeEmptyElement: function (liParentElement, numberModule, editor) {
            liParentElement.getChildren().toArray().forEach(function(child) {
                if (!child.getText().trim()) {
                    child.remove();
                }
            });

            var liParentElementToCheckNumber = liParentElement;
            liParentElementToCheckNumber = this.getParentToCheckAndRemove(liParentElementToCheckNumber);
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
            if(liParentElement.getParent()) {
                core.setToPosition(editor, liParentElement, CKEDITOR.POSITION_AFTER_START);
            }
            editor.fire('key', {keyCode: ckEditorEvent.getKey(), domEvent: ckEditorEvent});
        },

        getParentToCheckAndRemove(liParentElementToCheckNumber) {
            while (liParentElementToCheckNumber && liParentElementToCheckNumber.getAttribute(leosPluginUtils.DATA_AKN_ELEMENT)
            && !(liParentElementToCheckNumber.getAttribute(leosPluginUtils.DATA_AKN_ELEMENT) === leosPluginUtils.POINT
                || liParentElementToCheckNumber.getAttribute(leosPluginUtils.DATA_AKN_ELEMENT) === leosPluginUtils.INDENT
                || liParentElementToCheckNumber.getAttribute(leosPluginUtils.DATA_AKN_ELEMENT) === leosPluginUtils.PARAGRAPH)) {
                liParentElementToCheckNumber = liParentElementToCheckNumber.getParent();
            }
            return liParentElementToCheckNumber;
        },

        removeEnterAndJoinLines: function (element, editor) {
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

            if(element.hasAttribute(core.DATA_AKN_ACTION_ENTER) && !element.hasAttribute(leosPluginUtils.DATA_AKN_NUM)) {
                editor.fire('handleTcEnter', {data: element});
            } else {
                if (element.getParent()) {
                    core.setToPosition(editor, element, CKEDITOR.POSITION_AFTER_START);
                }
                editor.fire('key', {keyCode: ckEditorEvent.getKey(), domEvent: ckEditorEvent});
            }
        },

        removeEnterInsert: function(element, editor, numberModule) {
            if(this.checkIfEmptyListElement(element)) {
                this.removeEmptyElement(element, numberModule, editor);
            } else {
                this.removeEnterAndJoinLines(element, editor);
            }
        },

        indentList: function(element, editor, isIndent) {
            var keyCodeToUse = isIndent ? 9 : CKEDITOR.SHIFT + 9;
            var ckEditorEvent = new CKEDITOR.dom.event(
                new KeyboardEvent('key', {
                    keyCode: 9,
                    ctrlKey: false,
                    shiftKey: true,
                    getKey: function () {
                        return keyCode;
                    }
                })
            );
            if(element.getParent()) {
                core.setToPosition(editor, element, CKEDITOR.POSITION_AFTER_START);
            }
            editor.fire('key', {keyCode: keyCodeToUse, domEvent: ckEditorEvent});
        },

        rejectChange: function(editor, element, numberModule) {
            editor.getSelection().fake(element.getParent());
            var parentElem = element.getAscendant(el => {
                return (el.getName && (el.getName() === 'div' || el.getName() === core.ARTICLE || el.getName() === core.TABLE)
                    && el.getAttribute('data-akn-action-alter') === 'true');
            });

            // function added in #2738, check if it can be removed in #2739
            function isAlternativeSignatureBlock() {
                if (parentElem && parentElem.is(core.TABLE)) {
                    return containsAllSignatureElements(element);
                }
                return false;
            }

            // function added in #2738, check if it can be removed in #2739
            function isAlternativeSignatureBlockAndSignatureElementMissing() {
                if (isAlternativeSignatureBlock()) {
                    return !containsAllSignatureElements(element.getParent());
                }
                return false;
            }

            function containsAllSignatureElements(element) {
                const childElements = element.getChildren().toArray();
                return childElements.some(e => e.getAttribute && e.getAttribute(core.DATA_AKN_NAME) === core.ORGANIZATION)
                    && childElements.some(e => e.getAttribute && e.getAttribute(core.DATA_AKN_NAME) === core.ROLE)
                    && childElements.some(e => e.getAttribute && e.getAttribute(core.DATA_AKN_NAME) === core.PERSON);
            }

            if ((element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) &&
                (element.getAttribute(core.DATA_AKN_SOFTACTION) === core.SOFTACTION_MOVE_FROM)) {
                if (this.checkIfRejectIsProcessedInBackend(editor, element, numberModule)) {
                    element.getParent().getParent().setAttribute(core.DATA_AKN_ID_TO_BE_RESTORED, element.getAttribute(core.DATA_AKN_ATTR_SOFTMOVE_FROM));
                }
                element.remove();
            } else if (element.getAttribute(core.DATA_AKN_ACTION_ENTER) === core.INSERT_ACTION) {
                this.removeEnterInsert(element, editor, numberModule);
            } else if (element.getAttribute(core.DATA_AKN_ACTION_ENTER) === core.DELETE_ACTION) {
                core.removeTrackChangesAttributesForEnter(element);
            } else if(element.getAttribute(core.DATA_AKN_ACTION_NUMBER) === core.INSERT_ACTION) {
                if(element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER) === core.NEW) {
                    this.removeEnterInsert(element, editor, numberModule);
                } else if ((element.getAttribute(leosPluginUtils.DATA_AKN_NUM) !== element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER)
                    || element.getAttribute(core.DATA_INDENT_ORIGIN_LEVEL)) && element.hasAttribute(core.DATA_AKN_TC_ORIGINAL_INDENT_ACTION)) {
                    if(element.getAttribute(core.DATA_AKN_TC_ORIGINAL_INDENT_ACTION).toLowerCase() === 'indent') {
                        this.indentList(element, editor, false);
                    } else {
                        this.indentList(element, editor, true);
                    }
                } else { // case of reject action when is newly inserted
                    var blockContainer = element.getAscendant(function(elem) {
                        return elem && typeof elem['is'] === 'function' && elem.is('div') &&
                            elem.getAttribute('data-akn-name') === 'blockContainer' &&
                            elem.getAttribute('leos:editable') === 'true';
                    }, true); // block container context Explanatory Memorandum
                    var articleAscendant = element.getAscendant(function(elem) {
                        return elem && typeof elem['is'] === 'function' && elem.is('article') &&
                            elem.getAttribute('data-akn-name') === 'article';
                    }, true); // block container context Explanatory Memorandum
                    if(!!blockContainer && element.getAttribute(leosPluginUtils.DATA_AKN_NUM) !== element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER)){
                        if(element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER) === core.UNNUMBERED) {
                            // remove data-akn-action-number data-akn-tc-original-number data-akn-uid-number data-akn-num
                            var tcAttributes = ["data-akn-action-number", "data-akn-tc-original-number", "data-akn-uid-number", "data-akn-num",
                                "title-number", "data-akn-tc-original-number", "NEW"];
                            for (var attrName of tcAttributes) {
                                element.removeAttribute(attrName);
                            }
                            element.renameNode('p');

                            // Find the parent list (<ul> or <ol>)
                            var parentList = element.getAscendant(function(element) {
                                return element.is('ul') || element.is('ol');
                            }, true);

                            if (!parentList) {
                                console.log('No parent list (<ul> or <ol>) found.');
                                return;
                            }

                            // Remove the <list> element from its parent
                            element.remove();

                            // Insert the <list> element after the parent list
                            element.insertAfter(parentList);
                            // Check if the parent list is empty (no children) and remove it if so
                            if (parentList.getChildCount() === 0) {
                                parentList.remove();
                            }
                        }else{
                            // case when the type of list is changed from numbered to unnumbered or the other way.
                            element.setAttribute('data-akn-num', element.getAttribute('data-akn-tc-original-number'));

                            if(element.getAttribute('data-akn-tc-original-number') == core.BULLET){
                                element.getParent().renameNode('ul');
                                element.getParent().setAttribute("data-akn-name","UnNumberedBlockList");
                            }else{
                                element.getParent().renameNode('ol');
                                element.getParent().setAttribute("data-akn-name","NumberedBlockList");
                            }
                            var tcAttributes = ["data-akn-action-number", "data-akn-tc-original-number", "data-akn-uid-number",
                                "title-number",  "NEW"];
                            for (var attrName of tcAttributes) {
                                element.removeAttribute(attrName);
                            }
                        }
                    }

                    // article case of reject action when is newly inserted paragraph
                    if(!!articleAscendant){
                        if(element.hasAttribute(leosPluginUtils.DATA_AKN_NUM) && element.hasAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER)
                            && element.getAttribute(leosPluginUtils.DATA_AKN_NUM) !== element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER)
                            && element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER) !== core.UNNUMBERED){
                            //test case of newly inserted element as 4. before 5. which has sublists
                            element.setAttribute(leosPluginUtils.DATA_AKN_NUM, element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER));
                            var tcAttributes = ["data-akn-action-number", "data-akn-tc-original-number", "data-akn-uid-number",
                                "title-number",  "NEW", "data-akn-attr-softuser", "data-akn-attr-softdate"];
                            for (var attrName of tcAttributes) {
                                element.removeAttribute(attrName);
                            }

                        }else {
                            var canFireParagraphChange = false;
                            for (var elementSibling of element.getParent().$.children) {
                                if (elementSibling.getAttribute(core.DATA_AKN_ACTION_NUMBER)
                                    && elementSibling.getAttribute(leosPluginUtils.DATA_AKN_NUM)
                                    && !elementSibling.getAttribute(core.ACTION_ATTR)
                                ) {
                                    if (/^\d+\.$/.test(elementSibling.getAttribute(leosPluginUtils.DATA_AKN_NUM))) {
                                         canFireParagraphChange = true;
                                    }

                                    core.removeTrackChangesAttributes(elementSibling);
                                    if (elementSibling.getAttribute(core.DATA_AKN_ACTION_NUMBER) === core.INSERT_ACTION) {
                                        core.removeTrackChangesAttributesForNumberingDelete(elementSibling);
                                    }
                                    core.removeTrackChangesAttributesForNumbering(elementSibling);
                                    core.removeSoftAttributes(elementSibling);
                                    if (!elementSibling.getAttribute(leosPluginUtils.ID)) {
                                        elementSibling.setAttribute(leosPluginUtils.ID, "XtempXtcX" + Date.now().toString(36) + Math.random().toString(36).substring(2));
                                    }
                                }
                            }
                            if (canFireParagraphChange) {//in aknNumberedParagraphPlugin.js, change status to PARA_MODE to UNNUMBERED
                                editor.fire('changeParaModeToUnnumbered');
                            }
                        }
                    }
                }
            } else if ((element.getAttribute(core.DATA_AKN_ACTION_NUMBER) && !element.getAttribute(leosPluginUtils.DATA_AKN_NUM))) {
                if(element.getAttribute(leosPluginUtils.DATA_AKN_NUM) !== element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER) && element.hasAttribute(core.DATA_AKN_TC_ORIGINAL_INDENT_ACTION)) {
                    if(element.getAttribute(core.DATA_AKN_TC_ORIGINAL_INDENT_ACTION).toLowerCase() === 'indent') {
                        this.indentList(element, editor, false);
                    } else {
                        this.indentList(element, editor, true);
                    }
                }else{
                    element.remove();
                }
            } else if (element.getAttribute(core.DATA_AKN_ACTION_NUMBER) === core.DELETE_ACTION
                        && element.getAttribute(leosPluginUtils.DATA_AKN_NUM)
                        && !element.hasAttribute(core.DATA_AKN_SOFTACTION)) {
                core.removeTrackChangesAttributesForNumbering(element);
            } else if (element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) {
                if(parentElem && parentElem.getAttribute(core.DATA_AKN_NAME) === core.ARTICLE && element.getAscendant("li")) {
                    element.getAscendant("li").remove();
                } else if (isAlternativeSignatureBlockAndSignatureElementMissing()) {
                    return;
                } else {
                    var liParentElement = element.getAscendant("li");
                    var pParentElement = element.getAscendant("p");
                    element.remove();
                    if (pParentElement && !pParentElement.getText().trim()) {
                        let lastEditable = leosPluginUtils.findLastEditable(pParentElement.getAscendant("div"));
                        let isSignatureElement = leosPluginUtils.isSignatureElement(pParentElement.$);
                        if (!isSignatureElement && (!lastEditable || lastEditable.getId() !== pParentElement.getId())
                                // condition added in #2738, check if it can be removed in #2739
                                || leosPluginUtils.isDuplicatedSignatureElement(pParentElement.$)) {
                            pParentElement.remove();
                        } else {
                            pParentElement.appendBogus();
                            var range = editor.createRange();
                            range.selectNodeContents(pParentElement);
                            range.collapse(true);
                            editor.getSelection().selectRanges([range]);
                            editor.focus();
                        }
                    }
                    if(liParentElement) {
                        if(liParentElement.getParent()){
                            editor.getSelection().fake(liParentElement);
                        }
                        if (this.checkIfEmptyListElement(liParentElement)) {
                            this.removeEmptyElement(liParentElement, numberModule, editor);
                        }
                    }
                }
            } else if (element.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION) {
                if(parentElem) {
                    editor.fire('updateAlternateToolbarState', {index: parentElem.getAttribute("data-akn-original-option")})
                    if(parentElem.getAttribute(core.DATA_AKN_NAME) === core.ARTICLE) {
                        core.removeTrackChangesAttributesForNumbering(element.getAscendant("li"));
                        core.addTrackChangesAttributes(editor, element, core.INSERT_ACTION);
                    // condition added in #2738, check if it can be removed in #2739
                    } else if (parentElem.getAttribute(core.DATA_AKN_NAME) !== core.SIGNATORY || isAlternativeSignatureBlock()) {
                        core.removeTrackChangesAttributesForAlternative(parentElem);
                    }
                }
                if(element.getAttribute(core.DATA_AKN_SOFTACTION) === core.SOFTACTION_MOVE_TO) {
                    if (this.checkIfRejectIsProcessedInBackendMovedTo(editor, element, numberModule)) {
                        element.setAttribute(core.DATA_AKN_ID_TO_BE_REMOVED, element.getAttribute(core.DATA_AKN_ATTR_SOFTMOVE_TO));
                        element.setAttribute(core.DATA_AKN_ID_TO_BE_RESTORED, element.getAttribute(core.ID));
                        element.setAttribute(core.DATA_AKN_RENUMBER_ORIGIN, core.REJECT);
                    }

                    element.removeAttribute('contenteditable');
                    element.removeAttribute('data-akn-attr-editable');
                    core.removeTrackChangesAttributesForNumbering(element);
                    core.removeTrackChangesAttributes(element);
                    core.removeSoftAttributes(element);
                }else if($(element, editor.getData()).length > 0) {
                    element.$.outerHTML = element.$.innerHTML;
                }
            }
            editor.focus();
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
                nodeInSameEditorSession.removeAttribute(core.DATA_AKN_ATTR_SOFTMOVE_TO);
                nodeInSameEditorSession.setAttribute("id", nodeInSameEditorSession.getAttribute("id").replace("movedX", ""));
                toBeProcessedInBackend = false;
            }
            return toBeProcessedInBackend;
        },

        checkIfRejectIsProcessedInBackendMovedTo: function (editor, element, numberModule) {
            var toBeProcessedInBackend = true;
            var nodeInSameEditorSession = editor.container.findOne("[id='" + element.getAttribute(core.DATA_AKN_ATTR_SOFTMOVE_TO) + "']");
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
                toBeProcessedInBackend = false;
                nodeInSameEditorSession.remove();
            }
            return toBeProcessedInBackend;
        },

        acceptRowChange: function(editor, element) {
            if (element.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION) {
                var table = element.getAscendant("table");
                if (table.$.rows.length == 1) {
                    this.removeElementAndEmptySubflow(table);
                } else {
                    element.remove();
                }
            } else if (element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) {
                core.removeTrackChangesAttributes(element);
            }
        },

        rejectRowChange: function(editor, element, numberModule) {
            if (element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) {
                var liParentElement = element.getAscendant("li");
                var pParentElement = element.getAscendant("p");
                var table = element.getAscendant("table");
                if (table.$.rows.length == 1) {
                    this.removeElementAndEmptySubflow(table);
                } else {
                    element.remove();
                }
                if (pParentElement && !pParentElement.getText().trim()) {
                    pParentElement.remove();
                }
                if(liParentElement) {
                    editor.getSelection().fake(liParentElement);
                    if (this.checkIfEmptyListElement(liParentElement)) {
                        this.removeEmptyElement(liParentElement, numberModule, editor);
                    }
                }
            } else if (element.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION) {
                core.removeTrackChangesAttributes(element);
            }
        },

        removeElementAndEmptySubflow(element) {
            var parent = element.getParent();
            if (parent.getName && parent.getName() === "div" && parent.getAttribute && parent.getAttribute(core.DATA_AKN_NAME) === leosPluginUtils.SUBFLOW_NAME
                && parent.getChildCount() === 1) {
                parent.remove();
            } else {
                element.remove();
            }
        },

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

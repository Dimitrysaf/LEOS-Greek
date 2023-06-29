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
define(function leosTrackChangesPluginModule(require) {
    "use strict";

    // load module dependencies
    var log = require("logger");
    var pluginTools = require("plugins/pluginTools");
    var diff_match_patch = require("diff_match_patch");
    var trackChanges = require("./leosTrackChanges");
    var trackChangesStyle = require("./leosTrackChangesStyle");

    var pluginName = "leosTrackChanges";

    var pluginDefinition = {
        init: function init(editor) {
            // Plugin only allowed for cloned proposals
            if (!editor.LEOS.isClonedProposal) {
                return;
            }

            var core = trackChanges.core, actions = trackChanges.actions, style = trackChangesStyle.style;
            var isTrackChangesShowed = editor.LEOS.isTrackChangesShowed, isTrackChangesEnabled = editor.LEOS.isTrackChangesEnabled;
            var canUserAcceptChanges = core.canUserAcceptChanges(editor), canUserRejectChanges = core.canUserRejectChanges(editor);

            // Add toggle display
            editor.ui.addButton("toggleDisplay", {
                label: "Toggle track changes display",
                icon: this.path + "icons/display.png",
                command: "toggleDisplayCommand",
                toolbar: "trackChanges",
                isToggle: isTrackChangesShowed
            });
            editor.addCommand("toggleDisplayCommand", {
                canUndo: false,
                exec: function(editor) {
                    isTrackChangesShowed = !isTrackChangesShowed;
                    this.setState(isTrackChangesShowed ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
                    core.updateTrackChangesStyles(core.getUserId(editor), editor.LEOS.proposalRef, isTrackChangesShowed);
                }
            });

            // Add context menu accept and reject options
            if (editor.contextMenu) {
                editor.addMenuGroup("trackChangesGroup");
                editor.addMenuItem( "acceptOneChangeItem", {
                    label: "Accept this change",
                    icon: this.path + "icons/ok.png",
                    command: "acceptOneChange",
                    group: "trackChangesGroup"
                });
                editor.addMenuItem( "rejectOneChangeItem", {
                    label: "Reject this change",
                    icon: this.path + "icons/remove.png",
                    command: "rejectOneChange",
                    group: "trackChangesGroup"
                });
                editor.addMenuItem( "acceptSelectedChangesItem", {
                    label: "Accept selected changes",
                    icon: this.path + "icons/ok.png",
                    command: "acceptSelectedChanges",
                    group: "trackChangesGroup"
                });
                editor.addMenuItem( "rejectSelectedChangesItem", {
                    label: "Reject selected changes",
                    icon: this.path + "icons/remove.png",
                    command: "rejectSelectedChanges",
                    group: "trackChangesGroup"
                });
                editor.addCommand("acceptOneChange", {
                    canUndo: true,
                    exec: function(editor) {
                        actions.acceptChange(editor, editor.getSelection().getStartElement());
                    }
                });
                editor.addCommand("rejectOneChange", {
                    canUndo: true,
                    exec: function(editor) {
                        actions.rejectChange(editor, editor.getSelection().getStartElement());
                    }
                });
                editor.addCommand("acceptSelectedChanges", {
                    canUndo: true,
                    exec: function(editor) {
                        var tcElements = core.findElementsInSelection(editor.getSelection());
                        for (var i = tcElements.length - 1; i >= 0; i--) {
                            actions.acceptChange(editor, tcElements[i]);
                        }
                    }
                });
                editor.addCommand("rejectSelectedChanges", {
                    canUndo: true,
                    exec: function(editor) {
                        var tcElements = core.findElementsInSelection(editor.getSelection());
                        for (var i = tcElements.length - 1; i >= 0; i--) {
                            actions.rejectChange(editor, tcElements[i]);
                        }
                    }
                });
                editor.contextMenu.addListener( function(element) {
                    if (editor.getSelection().isCollapsed()) {
                        var tcElement = element.$.closest(core.TRACKCHANGES_ELEMENT_SELECTOR);
                        if (tcElement) {
                            editor.getSelection().fake(new CKEDITOR.dom.element(tcElement));
                            return { acceptOneChangeItem: canUserAcceptChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                rejectOneChangeItem: canUserRejectChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED };
                        }
                    } else {
                        var tcElements = core.findElementsInSelection(editor.getSelection());
                        if (tcElements.length > 0) {
                            return { acceptSelectedChangesItem: canUserAcceptChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                rejectSelectedChangesItem: canUserRejectChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED };
                        }
                    }
                });
            }

            // Update toggle display state when editor has focus
            editor.on("focus", function () {
                editor.getCommand("toggleDisplayCommand")
                    .setState(isTrackChangesShowed ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
            });

            // Bind events if the Dom is ready!
            editor.on("contentDom", function() {

                var savedSnapshot, keyCodeLock;
                var editable = editor.editable();

                /*
                 * Global variable used to store the content of CTRL-X in "keydown" listener.
                 * This content will be then used again in "cut" event
                 */
                var ctrlXArray;

                /*
                 * Variables used to store information about previous and next before delete the character.
                 * We store it in "key" listener, before delete the character and use it again
                 * in "deleteCharacter" inside "keyup" listener, after character is already deleted
                 *
                 */
                var isPreviousInsertOfSameUser, isNextInsertOfSameUser, letter, previousNodeToAddText, nextNodeToAddText, useKeyup;

                // Initialize styles with selected track changes showed option
                core.updateTrackChangesStyles(core.getUserId(editor), editor.LEOS.proposalRef, isTrackChangesShowed);

                // Used for CTRL-X, to get the content BEFORE been deleted
                editable.attachListener(editor.document, "keydown", function(e) {
                    var event = new EventWrapper(e);
                    if (event.getKeyCode() === 88) {
                        ctrlXArray = editor.getSelection().getRanges()[0].cloneContents().getChildren().$;
                    }
                });

                // Delete functionality - key - catch snapshots
                editable.attachListener(editor, "key", function(e) {

                    if (!CKEDITOR.dialog.getCurrent() && isTrackChangesEnabled && (editor.getSelection().getRanges().length > 0)) {

                        var event = new EventWrapper(e);

                        // On delete functionality(prevents/backup of text)
                        if ((event.getKeyCode() === 8) || (event.getKeyCode() === 46)) {

                            editor.getSelection().getRanges()[0].optimize();
                            var range = editor.getSelection().getRanges()[0];
                            var deleteKey = (event.getKeyCode() === 46);

                            if (!keyCodeLock && range.collapsed) {

                                /*
                                 * This if is used when is collapsed, which means that nothing is selected and
                                 * we are deleting isolated characters, using backspace or delete
                                 */

                                keyCodeLock = true;
                                useKeyup = true;

                                /*
                                 * To know the blocks before and after the current position
                                 */
                                var previousNode = editor.getSelection().getRanges()[0].getPreviousNode();
                                var nextNode = editor.getSelection().getRanges()[0].getNextNode();
                                if (nextNode.$.textContent === '') {
                                    nextNode = editor.getSelection().getRanges()[0].getNextEditableNode();
                                }

                                if (deleteKey) {

                                    if (range.startContainer.type === CKEDITOR.NODE_TEXT && range.startContainer.$.textContent.length === range.startOffset) {
                                        range = editor.createRange();
                                        range.moveToPosition(nextNode, CKEDITOR.POSITION_AFTER_START);
                                        range.select();
                                    }
                                    var count = 0;
                                    while (range.startContainer.type === CKEDITOR.NODE_ELEMENT) {
                                        range = editor.createRange();
                                        range.moveToPosition(nextNode, CKEDITOR.POSITION_AFTER_START);
                                        range.select();
                                        //TODO: improve to break while in case of possible loop
                                        if (count >= 30) {
                                            break;
                                        }
                                        nextNode = editor.getSelection().getRanges()[0].getNextNode();
                                        count++;
                                    }

                                    previousNodeToAddText = null;
                                    nextNodeToAddText = null;
                                    if (range.startContainer.$.previousSibling && range.startOffset === 0) {
                                        var possibleNodeToAdd = new CKEDITOR.dom.element(range.startContainer.$.previousSibling);
                                        var isPreviousNewDeleteOfSameUser = core.isSameUserAndNewTrackChangeElement(editor, possibleNodeToAdd, core.DELETE_ACTION);
                                        if (isPreviousNewDeleteOfSameUser) {
                                            previousNodeToAddText = possibleNodeToAdd;
                                        }
                                    }
                                    if (range.startOffset === 0) {
                                        nextNodeToAddText = nextNode;
                                    }

                                    var position = range.startOffset;
                                    letter = nextNode.$.textContent.substring(position, position+1);

                                } else {

                                    var count = 0;
                                    while (range.startContainer.type === CKEDITOR.NODE_ELEMENT) {
                                        range = editor.createRange();
                                        range.moveToPosition(previousNode, CKEDITOR.POSITION_BEFORE_END);
                                        range.select();
                                        if (count >= 30) {
                                            break;
                                        }
                                        previousNode = editor.getSelection().getRanges()[0].getPreviousNode();
                                        count++;
                                    }

                                    previousNodeToAddText = null;
                                    nextNodeToAddText = null;
                                    if (range.startContainer.$.nextSibling && range.startOffset === range.startContainer.$.length) {
                                        var possibleNodeToAdd = new CKEDITOR.dom.element(range.startContainer.$.nextSibling);
                                        var isNextNewDeleteOfSameUser = core.isSameUserAndNewTrackChangeElement(editor, possibleNodeToAdd, core.DELETE_ACTION);
                                        if (isNextNewDeleteOfSameUser) {
                                            nextNodeToAddText = possibleNodeToAdd;
                                        }
                                    }

                                    var position = range.startOffset;
                                    letter = previousNode.$.textContent.substring(position, position-1);

                                }


                                /*
                                 * This block is to add when we integrate ONE key mode to SELECT mode
                                 * Then we can delete the code after this block, till the end of this if
                                 * And also delete the logic in "keyup" for ONE key mode
                                 */
                                /*if (deleteKey) {
                                    range.endOffset = range.endOffset + 1;
                                    range.select();
                                } else {
                                    range.endOffset = range.endOffset - 1;
                                    range.select();
                                }*/

                                /*
                                 * Get the situation of insert blocks before delete the character, to be used in "deleteCharacter".
                                 * If we get this information after delete, then we loose the information of the deleted character.
                                 */
                                isPreviousInsertOfSameUser = core.isSameUserTrackChangeElement(editor, previousNode, core.INSERT_ACTION);
                                isNextInsertOfSameUser = core.isSameUserTrackChangeElement(editor, nextNode, core.INSERT_ACTION);

                                savedSnapshot = core.getCleanData(editor);

                                /*
                                 * Checks for no delete of delete.
                                 * 2 situations:
                                 * - If we press delete and NEXT is already a deleted block
                                 * - If we press backspace and PREVIOUS is already a deleted block
                                 */
                                if ((deleteKey && core.isTrackChangeElement(nextNode, core.DELETE_ACTION)) ||
                                    (!deleteKey && core.isTrackChangeElement(previousNode, core.DELETE_ACTION))) {
                                    event.getInstance().data.domEvent.preventDefault();
                                    savedSnapshot = null;
                                    useKeyup = false;
                                } else if (deleteKey && isNextInsertOfSameUser) {
                                    useKeyup = false;
                                } else if (!deleteKey && isPreviousInsertOfSameUser) {
                                    useKeyup = false;
                                } else if (deleteKey && previousNodeToAddText) {

                                    previousNodeToAddText.setText(previousNodeToAddText.getText() + letter);
                                    actions.moveTo(deleteKey, range, editor, previousNodeToAddText);
                                    useKeyup = false;

                                } else if (deleteKey && nextNodeToAddText) {

                                    range = editor.createRange();
                                    range.moveToPosition(nextNodeToAddText, CKEDITOR.POSITION_AFTER_START);
                                    range.select();

                                    var newElement = core.buildTrackChangeElement(editor, core.DELETE_ACTION, letter, true);
                                    editor.insertElement(newElement);
                                    actions.moveTo(deleteKey, range, editor, newElement);
                                    useKeyup = false;

                                } else if (deleteKey) {

                                    var newElement = core.buildTrackChangeElement(editor, core.DELETE_ACTION, letter, true);
                                    editor.insertElement(newElement);
                                    actions.moveTo(deleteKey, range, editor, newElement);
                                    useKeyup = false;
                                    if (letter === " ") {
                                        event.getInstance().data.domEvent.preventDefault();
                                    }

                                }

                            } else if (!range.collapsed) {

                                editor.fire("saveSnapshot");

                                var fragment = range.cloneContents(true);
                                var nodeList = fragment.find('li:not(:has(ol))');

                                /*
                                 * If count is > 0, we selected more then one line
                                 * Then we have a treatment per line in deleteFromListAndAddTrackChange, which
                                 * will call addTrackChangesNested
                                 */
                                if (nodeList.count() > 0) {
                                    actions.deleteFromListAndAddTrackChange(editor, range, nodeList);
                                    event.getInstance().data.domEvent.preventDefault();
                                    event.getInstance().stop();
                                } else {

                                    /*
                                     * If it is just one line, the treatment is a little different
                                     * Then we call deleteTextAndAddTrackChange, which
                                     * will ALSO call addTrackChangesNested
                                     */

                                    var childrenFromFragment = fragment.getChildren();

                                    if (childrenFromFragment.toArray().length === 1) {

                                        /*
                                         * Here, we have 1 line, but selection is inside ONLY ONE track change element.
                                         * Then, we have 2 possibilities: we are deleting inside a delete or a insert.
                                         */
                                        if (core.isTrackChangeElement(range.startContainer, core.DELETE_ACTION)) {
                                            /*
                                             * For delete, we NEVER delete a deleted
                                             */
                                            event.getInstance().data.domEvent.preventDefault();
                                        } else if (!core.isSameUserTrackChangeElement(editor, range.startContainer, core.INSERT_ACTION)) {
                                            /*
                                             * For insert, we mark as delete track change if it is another user.
                                             * If it is same user we don't need any action, as we just delete using normal flow.
                                             */
                                            range.extractContents(true);
                                            var child = childrenFromFragment.getItem(0);
                                            var tcDeleteItem = core.buildTrackChangeElement(editor, core.DELETE_ACTION, child.$.textContent, false);
                                            editor.insertElement(tcDeleteItem);
                                            event.getInstance().data.domEvent.preventDefault();
                                            event.getInstance().stop();
                                        }

                                    } else {

                                        /*
                                         * Here, we have  more than 1 line.
                                         * In future we should change to NOT use extractContents,
                                         * As this is causing problem when we select part of 2 deleted blocks (each one from one user)
                                         * then we add as separate blocks which should not be separated.
                                         */
                                        range.extractContents(true);
                                        actions.deleteTextAndAddTrackChange(editor, range, childrenFromFragment);
                                        event.getInstance().data.domEvent.preventDefault();

                                    }

                                }

                            } else {
                                // Prevent if lock exists
                                event.getInstance().data.domEvent.preventDefault();
                            }
                        }
                    }
                });

                // Delete functionality - keyup
                editable.attachListener(editor.document, "keyup", function(e) {
                    if (!CKEDITOR.dialog.getCurrent() && isTrackChangesEnabled && (editor.getSelection().getRanges().length > 0)) {
                        editor.getSelection().getRanges()[0].optimize();
                        var event = new EventWrapper(e);
                        var tcInsert = core.searchTrackChangeElementCheckingParent(editor, core.INSERT_ACTION);

                        // On Delete complete functionality. This part doesn't work without the keydown part.
                        // Because the keydown part is leading to track the changes.
                        try {
                            if ((event.getKeyCode() === 8 || event.getKeyCode() === 46) && savedSnapshot && useKeyup) {

                                // Insert deleted contents
                                editor.fire("lockSnapshot");
                                actions.deleteCharacter(editor, event, letter, isPreviousInsertOfSameUser, isNextInsertOfSameUser,
                                    previousNodeToAddText, nextNodeToAddText);
                                if (tcInsert && (tcInsert[0].getText().length === 0)) { // Empty tag check.. if so remove..
                                    tcInsert[0].remove();
                                }
                                editor.fire("unlockSnapshot");

                                // No prevent because the text needs to be deleted
                                // event.getInstance().data.preventDefault();

                            }
                        } finally {
                            // Release lock!
                            keyCodeLock = false;
                        }
                    }
                });

                // - Prevent of insert in Delete
                // - Insert functionality
                editable.attachListener(editor.document, "keypress", function(e) {
                    var event = new EventWrapper(e);
                    var character = event.getChar();
                    if (!CKEDITOR.dialog.getCurrent() && character && !e.data.$.ctrlKey && !e.data.$.metaKey
                        && (event.getKeyCode() != 8) && (event.getKeyCode() != 46) && (event.getKeyCode() != 29)) { // Do not capture CTRL hotkeys & escape
                        if (isTrackChangesEnabled) {
                            var range = editor.getSelection().getRanges()[0];
                            if (!range.collapsed) {
                                editor.fire("saveSnapshot");
                                var style = new CKEDITOR.style({attributes: core.getTrackChangeAttributes(editor, core.DELETE_ACTION)});
                                editor.applyStyle(style);
                                var endContainer = editor.getSelection().getRanges()[0].endContainer; // Collapse range to write at end
                                core.setToEditablePosition(editor, endContainer, core.CARET_END);
                                editor.fire("saveSnapshot");

                                actions.preventInsertInDelete(editor); // Moves the caret if needed
                                core.insertTrackChangeElement(editor, core.INSERT_ACTION, character, core.CARET_END);

                                event.getInstance().data.preventDefault(); // Prevent standard insert
                            } else {
                                actions.preventInsertInDelete(editor); // Moves the caret if needed
                                if (actions.insertNewData(editor, event.getChar())) { // Inserts the new data
                                    event.getInstance().data.preventDefault(); // Prevent standard insert
                                }
                            }
                        } else {
                            var tcElement = core.isInsideTrackChangeElement(editor);
                            if (tcElement) {
                                var newTcElement = core.insertTrackChangeElement(editor, core.INSERT_ACTION, character, core.CARET_END);
                                core.breakParentAndMoveTo(editor, newTcElement, tcElement, core.CARET_END);
                                newTcElement.remove();
                                editor.insertHtml(character, "text");

                                event.getInstance().data.preventDefault(); // Prevent standard insert
                            }
                        }
                    }
                });

                // Prevent dropping and dragging text
                editable.attachListener(editor.document, "drop", function(e) {
                    e.data.preventDefault();
                });

                editable.attachListener(editor.document, "dragstart", function(e) {
                    e.data.preventDefault();
                });

                editor.on("paste", function(e) {
                    if (!CKEDITOR.dialog.getCurrent() && isTrackChangesEnabled) {
                        var jElement = $("<div/>").html(e.data.dataValue);
                        $(jElement).find(core.TRACKCHANGES_ELEMENT + "[data-akn-action='delete']").remove();
                        var text = jElement.html();
                        var el = core.buildTrackChangeElement(editor, core.INSERT_ACTION, text, true);
                        if (editor.getSelection().getSelectedText().length > 0) { // On delete selection
                            var delEl = core.buildTrackChangeElement(editor, core.DELETE_ACTION, core.getSelectedHtml(editor), true);
                            e.data.dataValue = delEl.$.outerHTML + el.$.outerHTML;
                        } else { // Normal paste flow with track changes
                            e.data.dataValue = el.$.outerHTML;
                        }
                        editor.insertHtml(e.data.dataValue, "html");
                        e.cancel();
                    }
                });

                editable.attachListener(editor.document, "cut", function(e) {
                    /*
                     * Here it is another point we use addTrackChangesNested to reuse code.
                     */
                    if (!CKEDITOR.dialog.getCurrent() && isTrackChangesEnabled) {
                        var range = editor.getSelection().getRanges()[0];
                        var closedElements = actions.addTrackChangesNested(editor, range, new CKEDITOR.dom.nodeList(ctrlXArray));
                        var outerHTML = "";
                        for (var countClosedElements = 0; countClosedElements < closedElements.length; countClosedElements++) {
                            outerHTML += closedElements[countClosedElements].$.outerHTML;
                        }
                        editor.insertHtml(outerHTML, "html");
                        e.cancel();
                    }
                });
            });

            // Catch toolbar buttons commands before execution
            editor.on("beforeCommandExec", function(event) {
                if (isTrackChangesEnabled) {
                    var range = editor.getSelection().getRanges()[0];
                    if (range.collapsed && core.isInsideTrackChangeElement(editor, core.DELETE_ACTION)) {
                        return false;
                    }
                    switch (event.data.name) {
                        case "bold":
                        case "italic":
                        case "subscript":
                        case "superscript":
                            if (editor.LEOS.isTrackChangesStyleFormattingEnabled) {
                                var formatStyleToBeApplied = style.FORMAT_STYLES.find(s => s.event === event.data.name);
                                if (event.data.command.state == CKEDITOR.TRISTATE_OFF) {
                                    style.apply(editor, formatStyleToBeApplied.style);
                                    editor.fire("change");
                                    return false;
                                } else if (event.data.command.state == CKEDITOR.TRISTATE_ON) {
                                    //TODO: Check style definition. Custom or default implementation no works with it.
                                    //style.remove(editor, formatStyleToBeApplied.style);
                                    //editor.removeStyle(formatStyleToBeApplied.style);
                                }
                            }
                            break;
                        case "authorialNoteWidget":
                        case "leosCrossReferenceWidget":
                        case "mathjax":
                        case "table":
                            if (!range.collapsed) return false;
                            break;
                    }
                }
            });

            // Add observer to CKEditor when data is received
            editor.on("receiveData", function() {
                function processMutations(mutations) {
                    for (var mutation of mutations) {
                        if (mutation.type === "childList") {
                            for (var node of mutation.addedNodes) {
                                if (!(node instanceof HTMLElement)) continue;
                                if (node.classList.contains("cke_widget_authorialNoteWidget") || node.classList.contains("cke_widget_mathjax") ||
                                    node.classList.contains("cke_widget_leosCrossReferenceWidget")) {
                                    core.setToEditablePosition(editor, new CKEDITOR.dom.node(node), true);
                                    if (actions.insertNewData(editor, node.outerHTML))
                                        node.remove();
                                /*} else if ((node.tagName === "TABLE") || (node.tagName === "TR") || (node.tagName === "TD")) {
                                    if ((node.tagName === "TR") || (node.tagName === "TD"))
                                        node = node.closest("table");
                                    var tcAttributes = core.getTrackChangeAttributes(editor, core.INSERT_ACTION);
                                    for (var attrName in tcAttributes) {
                                        if (attrName !== "data-akn-name")
                                            node.setAttribute(attrName, tcAttributes[attrName]);
                                    }*/
                                } else {
                                    continue;
                                }
                                break;
                            }
                        }
                    }
                }
                if (isTrackChangesEnabled) {
                    var rootElement = editor.editable().$.firstChild;
                    if (rootElement && !rootElement.mutationObserver) {
                        rootElement.mutationObserver = new MutationObserver(processMutations);
                        rootElement.mutationObserver.observe(rootElement, { childList: true, subtree: true });
                    }
                }
            });
        }
    }

    var EventWrapper = function(_event) {
        var event = function() {
            return _event || window.event;
        }
        this.getInstance = function() {
            return event();
        }
        this.getChar = function() {
            var charCode = getCharCode();
            if (charCode === 0) {
                return null;
            }
            return String.fromCharCode(charCode);
        }
        this.getKeyCode = function() {
            var e = event();
            var charCode = e.data.domEvent ? e.data.domEvent.$.keyCode : e.data.$.keyCode;
            return charCode;
        }
        var getCharCode = function() {
            var e = event();
            var charCode = (CKEDITOR.env.ie ? (e.data.domEvent ? e.data.domEvent.$.keyCode : e.data.$.keyCode) : (e.data.domEvent ? e.data.domEvent.$.charCode : e.data.$.charCode));
            return charCode;
        }
    };

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var transformationConfig = {
        akn : "inline[name=trackchanges]",
        html : "span[data-akn-name=trackchanges]",
        attr : [{
            akn : "xml:id",
            html : "id"
        }, {
            akn: "name",
            html : "data-akn-name"
        }, {
            akn: "leos:action",
            html : "data-akn-action"
        }, {
            akn : "leos:uid",
            html : "data-akn-uid"
        }, {
            akn : "leos:title",
            html : "title"
        }],
        sub : {
            akn : "text",
            html : "span/text"
        }
    };

    // return plugin module
    var pluginModule = {
        name : pluginName,
        transformationConfig : transformationConfig
    };

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    return pluginModule;
});

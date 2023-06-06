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
    var UTILS = require("core/leosUtils");

    var pluginName = "leosTrackChanges";

    var pluginDefinition = {
        init: function init(editor) {
            // Plugin only allowed for cloned proposals
            if (!editor.LEOS.isClonedProposal) {
                return;
            }

            var core = trackChanges.core, actions = trackChanges.actions;
            var isTrackChangesShowed = editor.LEOS.isTrackChangesShowed, isTrackChangesEnabled = editor.LEOS.isTrackChangesEnabled;
            var canUserAcceptChanges = trackChanges.canUserAcceptChanges(editor),
                canUserRejectChanges = trackChanges.canUserRejectChanges(editor);

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
                    core.updateTrackChangesStyles(trackChanges.getUserId(editor), editor.LEOS.proposalRef, isTrackChangesShowed);
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
                 * Variables used to store if previous and next blocks are inserts from same user before delete the character.
                 * We store it in "key" listener, before delete the character and use it again
                 * in "deleteCharacter" inside "keyup" listener, after character is already deleted
                 *
                 */
                var isPreviousInsertedOfSameUser, isNextInsertedOfSameUser;

                // Initialize styles with selected track changes showed option
                core.updateTrackChangesStyles(trackChanges.getUserId(editor), editor.LEOS.proposalRef, isTrackChangesShowed);

                // Used for CTRL-X, to get the content BEFORE been deleted
                editable.attachListener(editor.document, "keydown", function(e) {
                    var event = new EventWrapper(e);
                    if (event.getKeyCode() === 88) {
                        ctrlXArray = editor.getSelection().getRanges()[0].cloneContents().getChildren().$;
                    }
                });

                // Delete functionality - key - catch snapshots
                editable.attachListener(editor, "key", function(e) {

                    if (isTrackChangesEnabled && (editor.getSelection().getRanges().length > 0)) {

                        var event = new EventWrapper(e);

                        // On delete functionality(prevents/backup of text)
                        if ((event.getKeyCode() === 8) || (event.getKeyCode() === 46)) {

                            editor.getSelection().getRanges()[0].optimize();
                            var range = editor.getSelection().getRanges()[0];
                            var deleteKey = (event.getKeyCode() === 46);

                            if (!keyCodeLock && range.collapsed) {

                                /*
                                 * This if is used when is collapsed, which means that nothing is selected and
                                 * we are deleting characters isolated, using backspace or delete
                                 */

                                keyCodeLock = true;

                                /*
                                 * To know the blocks before and after the current position
                                 */
                                var previousEditableNode = editor.getSelection().getRanges()[0].getPreviousEditableNode();
                                var nextEditableNode = editor.getSelection().getRanges()[0].getNextEditableNode();

                                /*
                                 * Get if previous and next blocks are inserts from same user before delete the character.
                                 * To be used in "deleteCharacter".
                                 * If we get this information after delete, then we loose the information of the deleted character.
                                 */
                                isPreviousInsertedOfSameUser = core.isSameUserTrackChangeElement(editor, previousEditableNode, core.INSERT_ACTION);
                                isNextInsertedOfSameUser = core.isSameUserTrackChangeElement(editor, nextEditableNode, core.INSERT_ACTION);

                                savedSnapshot = core.getCleanData(editor);

                                /*
                                 * Checks for no delete of delete.
                                 * 2 situations:
                                 * - If we press delete and NEXT is already a deleted block
                                 * - If we press backspace and PREVIOUS is already a deleted block
                                 */
                                if ((deleteKey && core.isTrackChangeElement(nextEditableNode, core.DELETE_ACTION)) ||
                                    (!deleteKey && core.isTrackChangeElement(previousEditableNode, core.DELETE_ACTION))) {
                                    event.getInstance().data.domEvent.preventDefault();
                                    savedSnapshot = null;
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
                                            var tcDeleteItem = core.buildTrackChangeWrapElement(editor, core.DELETE_ACTION, child.$.textContent);
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
                    if (isTrackChangesEnabled && (editor.getSelection().getRanges().length > 0)) {
                        editor.getSelection().getRanges()[0].optimize();
                        var event = new EventWrapper(e);
                        var tcInsert = core.searchTrackChangeElementCheckingParent(editor, core.INSERT_ACTION);

                        // On Delete complete functionality. This part doesn't work without the keydown part.
                        // Because the keydown part is leading to track the changes.
                        try {
                            if ((event.getKeyCode() === 8 || event.getKeyCode() === 46) && savedSnapshot) {

                                var diff = new diff_match_patch();
                                var foundDiff = false;
                                var differences = diff.diff_main(savedSnapshot, core.getCleanData(editor));

                                // The diff functionality of the package has the possibility to find multiple differences.
                                // Only because we use it on a delete or backspace event, there should be only one change!
                                // This change should be a -1 which point to a delete.
                                for (var i = differences.length - 1; i >= 0; i--) {
                                    if (differences[i][0] === -1) {
                                        foundDiff = true;
                                        differences = differences[i][1];
                                        break;
                                    }
                                }

                                // Insert deleted contents
                                if (foundDiff) {
                                    editor.fire("lockSnapshot");
                                    actions.deleteCharacter(editor, event, differences, isPreviousInsertedOfSameUser, isNextInsertedOfSameUser);
                                    if (tcInsert && (tcInsert[0].getText().length === 0)) { // Empty tag check.. if so remove..
                                        tcInsert[0].remove();
                                    }
                                    editor.fire("unlockSnapshot");
                                }

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
                    if (character && !e.data.$.ctrlKey && !e.data.$.metaKey
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
                                actions.insertNewData(editor, event);  // Inserts the new data
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
                    if (isTrackChangesEnabled) {
                        var jElement = $("<div/>").html(e.data.dataValue);
                        $(jElement).find(core.TRACKCHANGES_ELEMENT + "[data-akn-action='delete']").remove();
                        var text = jElement.html();
                        var el = core.buildTrackChangeElement(editor, core.INSERT_ACTION, text, true);
                        if (editor.getSelection().getSelectedText().length > 0) { // On delete selection
                            var delEl = core.buildTrackChangeElement(editor, trackChanges.core.DELETE_ACTION, core.getSelectedHtml(editor), true);
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
                    if (isTrackChangesEnabled) {
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
        }
    }

    var trackChanges = {

        getUserAndId: function(editor) {
            return [editor.LEOS.user.name, editor.LEOS.user.login];
        },

        getUserId: function(editor) {
            return editor.LEOS.user.login;
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

    trackChanges.actions = {

        preventInsertInDelete: function(editor) {
            // Prevent typing within delete element. Check if next, last or current
            // is deleted element. If this is the case move to end
            editor.getSelection().getRanges()[0].optimize();
            var range = editor.getSelection().getRanges()[0], core = trackChanges.core;
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
            var core = trackChanges.core, tcElement = core.searchTrackChangeElementCheckingParent(editor, core.INSERT_ACTION);
            if (tcElement && core.isEmpty(tcElement[0])) { // TC Element is empty then it should be removed and create a new one
                tcElement[0].remove();
                tcElement = null;
            }
            if (tcElement && tcElement[0] && (tcElement[0].getAttribute(core.UID_ATTR) === trackChanges.getUserId(editor)) && (tcElement[0].getAttribute(core.STATUS_ATTR) === core.NEW_STATUS)) {
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

        deleteCharacter: function(editor, event, differences, isPreviousInsertedOfSameUserBeforeDelete, isNextInsertedOfSameUserBeforeDelete) {

            /*
             * This method add a delete track change for one single character
             */

            var range = editor.getSelection().getRanges()[0], deleteKey = (event.getKeyCode() === 46), core = trackChanges.core;
            range.optimize();

            /*
             * If it is same user, we just return and don't add this character as a new track change.
             * This means it will not be included, which means just deleted.
             */
            if (deleteKey && isNextInsertedOfSameUserBeforeDelete) {
                return;
            } else if (!deleteKey && isPreviousInsertedOfSameUserBeforeDelete) {
                return;
            }

            var elementToMoveTo;
            var previousEditableNodeAfterDelete = editor.getSelection().getRanges()[0].getPreviousEditableNode();
            var nextEditableNodeAfterDelete = editor.getSelection().getRanges()[0].getNextEditableNode();

            /*
             * Rules to join delete track change is:
             * - If they are new, we can join
             * - After save (it is not new anymore) we cannot join
             */

            if (deleteKey &&
                (core.isNewTrackChangeElement(previousEditableNodeAfterDelete, core.DELETE_ACTION) ||
                    core.isNewTrackChangeElement(nextEditableNodeAfterDelete, core.DELETE_ACTION))) {

                /*
                 * For DELETE key
                 * If we have a previous or next block that already is a track change
                 */

                if (core.isNewTrackChangeElement(previousEditableNodeAfterDelete, core.DELETE_ACTION)) {
                    /*
                     * Decide to put character in previous block and check if next is also a new delete track change
                     * to join with it
                     */
                    previousEditableNodeAfterDelete.setText(previousEditableNodeAfterDelete.getText() + differences);
                    if (core.isNewTrackChangeElement(nextEditableNodeAfterDelete, core.DELETE_ACTION)) {
                        previousEditableNodeAfterDelete.setText(previousEditableNodeAfterDelete.getText() + nextEditableNodeAfterDelete.getText());
                        nextEditableNodeAfterDelete.remove();
                    }
                    /*
                     * If we joined with next, the cursor should go to previous, as we deleted next
                     * If we didn't join with next, the cursor should stay in previous
                     */
                    elementToMoveTo = previousEditableNodeAfterDelete;
                } else {
                    /*
                     * Decide to put character in next block, as we don't have a previous one as a new delete track change
                     * The cursos should move to next block
                     */
                    nextEditableNodeAfterDelete.setText(differences + nextEditableNodeAfterDelete.getText());
                    elementToMoveTo = nextEditableNodeAfterDelete;
                }

            } else if (!deleteKey &&
                (core.isNewTrackChangeElement(previousEditableNodeAfterDelete, core.DELETE_ACTION) ||
                    core.isNewTrackChangeElement(nextEditableNodeAfterDelete, core.DELETE_ACTION))) {

                /*
                 * For BACKSPACE key
                 * If we have a previous or next block that already is a track change
                 */

                if (core.isNewTrackChangeElement(nextEditableNodeAfterDelete, core.DELETE_ACTION)) {
                    /*
                     * Decide to put character in next block and check if previous is also a new delete track change
                     * to join with it
                     */
                    nextEditableNodeAfterDelete.setText(differences + nextEditableNodeAfterDelete.getText());
                    if (core.isNewTrackChangeElement(previousEditableNodeAfterDelete, core.DELETE_ACTION)) {
                        nextEditableNodeAfterDelete.setText(previousEditableNodeAfterDelete.getText() + nextEditableNodeAfterDelete.getText());
                        previousEditableNodeAfterDelete.remove();
                    }
                    /*
                     * If we joined with previous, the cursor should go to next, as we deleted previous
                     * If we didn't join with previous, the cursor should stay in next
                     */
                    elementToMoveTo = nextEditableNodeAfterDelete;
                } else {
                    /*
                     * Decide to put character in previous block, as we don't have a next one as a new delete track change
                     * The cursor should move to previous block
                     */
                    previousEditableNodeAfterDelete.setText(previousEditableNodeAfterDelete.getText() + differences);
                    elementToMoveTo = previousEditableNodeAfterDelete;
                }

            } else {

                /*
                 * To add a new delete track change to this character
                 */
                var newElement = core.buildTrackChangeWrapElement(editor, core.DELETE_ACTION, differences);
                editor.insertElement(newElement);
                elementToMoveTo = newElement;

            }

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

        },

        acceptChange: function(editor, element) {
            var core = trackChanges.core;
            editor.getSelection().fake(element.getParent());
            if (element.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION) {
                element.remove();
            } else if ((element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) && ($(element, editor.getData()).length > 0)) {
                element.$.outerHTML = element.$.innerHTML;
            }
        },

        rejectChange: function(editor, element) {
            var core = trackChanges.core;
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
            var core = trackChanges.core;
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
                        var tcItemToClose = core.buildTrackChangeWrapElement(editor, core.DELETE_ACTION, html);
                        closedElements.push(tcItemToClose);
                    }
                    closedElements.push(child);
                    html = "";
                } else if (core.isTrackChangeElement(child, core.INSERT_ACTION)) {
                    /*
                     * When we meed a inserted track change block and same user,
                     * we ignore it to NOT be added.
                     */
                    if (child.getAttribute(core.UID_ATTR) !== trackChanges.getUserId(editor)) {
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
                var tcItem = core.buildTrackChangeWrapElement(editor, core.DELETE_ACTION, html);
                closedElements.push(tcItem);
            }
            return closedElements;
        }

    };

    trackChanges.core = {

        // Track changes names and element types
        TRACKCHANGES_ELEMENT: "span", TRACKCHANGES_ELEMENT_SELECTOR: "span[data-akn-name='trackchanges']",
        ACTION_ATTR: "data-akn-action", INSERT_ACTION: "insert", DELETE_ACTION: "delete",
        STATUS_ATTR: "data-akn-status", NEW_STATUS: "new",
        UID_ATTR: "data-akn-uid",

        // Caret definitions
        CARET_START: false, CARET_END: true,

        //TC Locations / where the tc is found
        BEFORE: "before", AFTER: "after", NONE: "none", CURRENT: "current", PARENT: "parent",

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

        getTrackChangeAttributes: function(editor, action) {
            var user = trackChanges.getUserAndId(editor);
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

        buildTrackChangeWrapElement: function(editor, action, html) {
            var tcElement = new CKEDITOR.dom.element(this.TRACKCHANGES_ELEMENT);
            tcElement.setAttributes(this.getTrackChangeAttributes(editor, action));
            tcElement.$.innerHTML = html;
            return tcElement;
        },

        insertTrackChangeElement: function(editor, action, text, toEnd, isHtml) {
            var tcElement = this.buildTrackChangeElement(editor, action, text, isHtml);
            editor.insertElement(tcElement);
            this.setToEditablePosition(editor, tcElement, toEnd);
            return tcElement;
        },

        toArray: function(list) {
            var array = new Array();
            for (var i = 0; i < list.count();i++) { array[i] = list.getItem(i); }
            return array;
        },

        getDateFormat: function() {
            var d = new Date();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            return (day < 10 ? "0" : "") + day + "/" + (month < 10 ? "0" : "") + month + "/" + d.getFullYear() + " " + d.toLocaleTimeString();
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
            return trackChanges.textHandling.escapeHTMLDecode(data); // Decode html
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
                (element.getAttribute(this.UID_ATTR) === trackChanges.getUserId(editor));
            var parentTrackChangeElementHasSameUser = (element != null) && (element.getParent() != null) && (element.$.nodeType === CKEDITOR.NODE_TEXT) &&
                (element.getParent().getName().toLowerCase() === this.TRACKCHANGES_ELEMENT) && (element.getParent().getAttribute(this.ACTION_ATTR) === action) &&
                (element.getParent().getAttribute(this.UID_ATTR) === trackChanges.getUserId(editor));
            return trackChangeElementHasSameUser || parentTrackChangeElementHasSameUser;
        },

        isNewTrackChangeElement: function(element, action) {
            var elementIsNewTrackchange = (element != null) && (element.$.nodeType === CKEDITOR.NODE_ELEMENT) &&
                (element.getName().toLowerCase() === this.TRACKCHANGES_ELEMENT) && (element.getAttribute(this.ACTION_ATTR) === action) &&
                (element.getAttribute(this.STATUS_ATTR) === this.NEW_STATUS);
            var textHasParentElementNewTrackchange = (element != null) && (element.getParent() != null) && (element.$.nodeType === CKEDITOR.NODE_TEXT) &&
                (element.getParent().getName().toLowerCase() === this.TRACKCHANGES_ELEMENT) && (element.getParent().getAttribute(this.ACTION_ATTR) === action) &&
                (element.getParent().getAttribute(this.STATUS_ATTR) === this.NEW_STATUS);
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
            if ((typeof(range.getCommonAncestor) !== undefined) && (typeof(range.getCommonAncestor().getElementsByTag) !== undefined)) {
                var allTcElementsWithinRangeParent = range.getCommonAncestor().getElementsByTag(this.TRACKCHANGES_ELEMENT);
                for (var i = 0, tcElement; allTcElementsWithinRangeParent.count() > i; i++) {
                    tcElement = allTcElementsWithinRangeParent.getItem(i);
                    if ((selection.getNative().containsNode !== undefined) && selection.getNative().containsNode(tcElement.$,true)) {
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
        }

    };

    trackChanges.textHandling = {

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

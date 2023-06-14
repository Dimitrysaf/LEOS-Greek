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
                 * Variables used to store if previous and next blocks are inserts from same user before delete the character.
                 * We store it in "key" listener, before delete the character and use it again
                 * in "deleteCharacter" inside "keyup" listener, after character is already deleted
                 *
                 */
                var isPreviousInsertedOfSameUser, isNextInsertedOfSameUser;

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

            editor.on("beforeCommandExec", function(event) {
                var styleToBeApplied = style.STYLE_ELEMENTS.find(e => e.event === event.data.name);
                if (isTrackChangesEnabled && styleToBeApplied) {
                    if (event.data.command.state == CKEDITOR.TRISTATE_OFF) {
                        style.apply(editor, styleToBeApplied.style);
                        event.cancel();
                    } else if (event.data.command.state == CKEDITOR.TRISTATE_ON) {
                        //TODO: Check style definition. Custom or default implementation no works with it.
                        //style.remove(editor, styleToBeApplied.style);
                        //editor.removeStyle(styleToBeApplied.style);
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

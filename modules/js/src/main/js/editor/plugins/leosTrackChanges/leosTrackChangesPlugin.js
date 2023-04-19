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

    var pluginName = "leosTrackChanges";

    var pluginDefinition = {
        init: function init(editor) {
            // Plugin only allowed for cloned proposals
            if (!editor.LEOS.isClonedProposal) {
                return;
            }

            var core = trackChanges.core, actions = trackChanges.actions;
            var isTrackChangesVisible = true, isTrackChangesEnabled = editor.LEOS.isTrackChangesEnabled;
            var defaultTrackChangesEditorStyle = $("head #editorTcStyle");

            // Add toggle display
            editor.ui.addButton("toggleDisplay", {
                label: "Toggle track changes display",
                icon: this.path + "icons/display.png",
                command: "toggleDisplayCommand",
                toolbar: "trackChanges",
                isToggle: true
            });
            editor.addCommand("toggleDisplayCommand", {
                canUndo: false,
                exec: function(editor) {
                    isTrackChangesVisible = !isTrackChangesVisible;
                    this.setState(isTrackChangesVisible ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
                    $("head #editorTcStyle").remove();
                    if (isTrackChangesVisible) {
                        $("head").prepend(defaultTrackChangesEditorStyle);
                    } else {
                        var editorTcStyle = core.TRACKCHANGES_ELEMENT_SELECTOR + "[data-akn-action='insert'] { text-decoration: none; }\n";
                        editorTcStyle += core.TRACKCHANGES_ELEMENT_SELECTOR + "[data-akn-action='delete'] { display: none; }\n";
                        $("head").prepend("<style id='editorTcStyle'>" + editorTcStyle + "</style>");
                    }
                }
            });

            // Update toggle display state when editor has focus
            editor.on("focus", function () {
                editor.getCommand("toggleDisplayCommand")
                    .setState(isTrackChangesVisible ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
            });

            // Bind events if the Dom is ready!
            editor.on("contentDom", function() {
                var savedSnapshot, savedTcLocation, keyCodeLock, betweenFix, wasInsert, wasCollapsed;
                var ctrlDown = false, cutText;
                var editable = editor.editable();

                // Delete functionality - keydown - catch snapshots
                editable.attachListener(editor.document, "keydown", function(e) {
                    if (isTrackChangesEnabled && (editor.getSelection().getRanges().length > 0)) {
                        var event = new EventWrapper(e);
                        if (event.isCtrl()) {
                            ctrlDown = true; // Track ctrl down for the CTRL + x event
                        }

                        // On delete functionality(prevents/backup of text)
                        if ((event.getKeyCode() === 8) || (event.getKeyCode() === 46)) {
                            wasInsert = false;

                            editor.getSelection().getRanges()[0].optimize();
                            var range = editor.getSelection().getRanges()[0];
                            var startContainer = range.startContainer;
                            var deleteKey = (event.getKeyCode() === 46);

                            if (!keyCodeLock && range.collapsed) {
                                wasCollapsed = true;
                                keyCodeLock = true;

                                // Prevent between 2 deletes
                                var pTcElement = core.searchTrackChangeElementCheckingParent(editor, core.DELETE_ACTION);
                                var parentTcElement = (pTcElement && (pTcElement[1] === core.PARENT || pTcElement[1] === core.CURRENT || pTcElement[1] === core.CARET_START));
                                var nextTcElement = core.searchNextTrackChangeElement(editor, core.DELETE_ACTION, deleteKey);
                                var previousTcElement = core.searchPreviousTrackChangeElement(editor, core.DELETE_ACTION, deleteKey);
                                betweenFix = null;
                                if (parentTcElement && nextTcElement && deleteKey) {
                                    betweenFix = [pTcElement, nextTcElement, deleteKey];
                                } else if (parentTcElement && previousTcElement && !deleteKey) {
                                    betweenFix = [previousTcElement, pTcElement, !deleteKey];
                                }
                                // End prevent

                                savedSnapshot = core.getCleanData(editor);

                                // Search with direction. No parent Check.
                                var tcElement = core.searchTrackChangeElement(editor, core.DELETE_ACTION, false, deleteKey);
                                // Logic of tc before of after the change.
                                savedTcLocation = (tcElement ? (deleteKey ? (tcElement[1] === core.CARET_END ? core.BEFORE : core.AFTER) : (tcElement[1] === core.CARET_START ? core.AFTER : core.BEFORE)) : core.NONE);

                                // Checks for no delete of delete.
                                // Prevent is different search, if still found tc.
                                var tcElementPrevent = core.searchTrackChangeElement(editor, core.DELETE_ACTION);
                                if (tcElementPrevent && (((savedTcLocation === core.BEFORE) && !deleteKey) || ((savedTcLocation === core.AFTER) && deleteKey))) {
                                    event.getInstance().data.preventDefault();
                                    savedSnapshot = null;
                                }

                                // INSERT LAST CHARACTER DELETE FIX
                                // Search with direction. No parent Check.
                                var tcElementIns = core.searchTrackChangeElementCheckingParent(editor, core.INSERT_ACTION);
                                if (tcElementIns) {
                                    if (!range.checkBoundaryOfElement(range.startContainer, CKEDITOR.END) &&
                                        !range.checkBoundaryOfElement(range.startContainer, CKEDITOR.START) && (tcElementIns[1] === core.PARENT)) {
                                        wasInsert = true;
                                    } else if (!deleteKey) {
                                        if ((range.checkBoundaryOfElement(range.startContainer, CKEDITOR.END) && (tcElementIns[1] === core.PARENT)) ||
                                            (range.checkBoundaryOfElement(range.startContainer, CKEDITOR.END) && (tcElementIns[1] === core.CURRENT)) ||
                                            (!range.checkBoundaryOfElement(range.startContainer, CKEDITOR.END) && (tcElementIns[1] === core.CARET_END))) {
                                            wasInsert = true;
                                        }
                                    } else if (deleteKey) {
                                        if ((range.checkBoundaryOfElement(range.startContainer, CKEDITOR.START) && (tcElementIns[1] === core.PARENT)) ||
                                            (!range.checkBoundaryOfElement(range.startContainer, CKEDITOR.START) && (tcElementIns[1] === core.CARET_START))) {
                                            wasInsert = true;
                                        }
                                    }
                                }
                                // END

                                var selection = editor.getSelection();
                                range = selection.getRanges()[0];
                                startContainer = range.startContainer;

                                if (!tcElement) { // Check if no TrackChange element is found.
                                    if ((typeof(startContainer.getAttribute) != 'undefined') && (startContainer.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION)) {
                                        if ((range.startOffset === 0 && deleteKey) || (range.startOffset !== 0 && !deleteKey)) {
                                            event.getInstance().data.preventDefault();
                                            savedSnapshot = null;
                                        }
                                    } else if ((typeof(startContainer.getParent().getAttribute) != 'undefined') && (startContainer.getParent().getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION)) {
                                        event.getInstance().data.preventDefault();
                                        savedSnapshot = null;
                                    }
                                }
                            } else if (!range.collapsed) {
                                wasCollapsed = false;
                                editor.fire("saveSnapshot");

                                var childrenOfSelection = editor.getSelection().getRanges()[0].extractContents(true).getChildren();
                                var firstItem = null, lastItem = null;
                                var objNonReferencedArray = core.toArray(childrenOfSelection);
                                var updatedRange = editor.getSelection().getRanges()[0];

                                for (var i = 0; objNonReferencedArray.length > i; i++) {
                                    editor.fire("lockSnapshot"); // To prevent undo to catch every part
                                    var item = objNonReferencedArray[i];
                                    var tcItem = core.addTrackChangesNested(editor, item);
                                    if (tcItem != null) {
                                        if (!updatedRange.collapsed) {
                                            updatedRange.collapse(true);
                                            updatedRange.select();
                                        }
                                        editor.insertElement(tcItem);
                                    }
                                    if (firstItem == null) {
                                        firstItem = tcItem;
                                    } else {
                                        lastItem = tcItem;
                                    }
                                    editor.fire("unlockSnapshot");
                                }

                                //editor.fire("updateSnapshot");
                                editor.fire("saveSnapshot");

                                // Merge changes with previous HTML
                                if ((firstItem != null) && (firstItem.$.nodeType === CKEDITOR.NODE_ELEMENT)) {
                                    firstItem.mergeSiblings(false);
                                } if ((lastItem != null) && (lastItem.$.nodeType === CKEDITOR.NODE_ELEMENT)) {
                                    lastItem.mergeSiblings(false);
                                }

                                event.getInstance().data.preventDefault();
                            } else {
                                // Prevent if lock exists
                                event.getInstance().data.preventDefault();
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
                                    actions.deleteCharacter(editor, event, savedTcLocation, differences, betweenFix, wasInsert, wasCollapsed);
                                    if (tcInsert && (tcInsert[0].getText().length === 0)) { // Empty tag check.. if so remove..
                                        tcInsert[0].remove();
                                    }
                                    editor.fire("unlockSnapshot");
                                }

                                if ((cutText !== null) && (cutText !== undefined && event.isCtrl())) {
                                    // After cut insert track change element
                                    core.insertTrackChangeElement(editor, core.DELETE_ACTION, cutText, true, true);
                                    cutText = null;
                                }

                                if (event.isCtrl()) { // CTRL release (this is tracked for the cut event)
                                    ctrlDown = false;
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
                    // Save the text for the cut element
                    if (isTrackChangesEnabled) {
                        cutText = core.getSelectedHtml(editor);
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

        deleteCharacter: function(editor, event, savedTcLocation, differences, betweenFix, wasInsert, wasCollapsed) {
            editor.getSelection().getRanges()[0].optimize();
            var range = editor.getSelection().getRanges()[0], startContainer = range.startContainer,
                tcLocation, tcElement, tcText, setToEl = null, deleteKey = (event.getKeyCode() === 46), core = trackChanges.core;

            if (betweenFix) {
                betweenFix[0][0].setText(betweenFix[0][0].getText() + differences + betweenFix[1][0].getText());
                betweenFix[1][0].remove();
                core.setToEditablePosition(editor, betweenFix[0][0], betweenFix[2]);
                betweenFix = null; // Clean old value
            } else if (wasInsert) {
                return;
            } else {
                var tcInsertElement = core.searchTrackChangeElementCheckingParent(editor, core.INSERT_ACTION);

                // Get current TC Element Place?
                tcElement = core.searchTrackChangeElementCheckingParent(editor, core.DELETE_ACTION);
                if (tcElement && (tcInsertElement == undefined)) {
                    setToEl = tcElement[0];
                    if (deleteKey && (tcElement[1] === core.CURRENT)) {
                        savedTcLocation = core.BEFORE;
                    }
                } else if (savedTcLocation != core.NONE) {
                    var node = startContainer;
                    if (savedTcLocation == core.AFTER) {
                        while (node.hasNext() && (node.type != 1)) {
                            node = node.getNextSourceNode();
                        }
                    } else {
                        while (node.hasPrevious() && (node.type != 1)) {
                            node = node.getPreviousSourceNode();
                        }
                    }
                    setToEl = node;
                }

                // Set tcLocation en caretMove, depends on delete
                if ((savedTcLocation === core.NONE) && tcElement) {
                    tcLocation = deleteKey ? (tcElement[1] === core.CARET_END || tcElement[1] === core.PARENT ? core.BEFORE : core.AFTER) :
                        (tcElement[1] === core.CARET_START ? core.AFTER : core.BEFORE);
                } else {
                    tcLocation = savedTcLocation;
                }

                // Select text order by tcLocation if not none
                if ((tcLocation != core.NONE) && setToEl) {
                    tcText = (tcLocation === core.BEFORE ? setToEl.getText() + differences : differences + setToEl.getText());
                } else if (setToEl) { // If not new element and see below
                    // If the caret stayed in contact with the tcElement normal behaviour
                    tcText = (deleteKey ? setToEl.getText() + differences : differences + setToEl.getText());
                }

                if (setToEl && tcElement && (tcElement[0].getAttribute(core.UID_ATTR) === trackChanges.getUserId(editor))) {
                    // Add to already existing element
                    setToEl.setText(tcText.replace(/\u00a0/g, " "));
                    if (deleteKey) {
                        // If delete caret in gecko is set to start? Fix
                        core.setToEditablePosition(editor, setToEl, core.CARET_END);
                    }
                } else {
                    if (!wasCollapsed && tcInsertElement && (tcInsertElement[0].getAttribute(core.UID_ATTR) === trackChanges.getUserId(editor))
                        && ((tcInsertElement[1] === core.CURRENT) || (tcInsertElement[1] === core.PARENT))) {
                        // These checks are fixes to prevent deleting of users own added text.
                        var selection = editor.getSelection();
                        range = selection.getRanges()[0];
                        startContainer = range.startContainer;
                        if (typeof(startContainer.getAttribute) != 'undefined' && (startContainer.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION)) {
                            if ((range.startOffset === 0 && deleteKey) || (range.startOffset !== 0 && range.startOffset !== startContainer.length)) {
                                return; // Normal workflow
                            }
                        } else if (typeof(startContainer.getParent().getAttribute) != 'undefined' && startContainer.getParent().getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION) {
                            if ((range.startOffset === 0 && deleteKey) || (range.startOffset !== 0 && range.startOffset !== startContainer.length)) {
                                return; // Normal workflow
                            }
                        } else {
                            return; // Possible deep nested flow
                        }
                    }
                    // New trackchange "delete" element
                    var newElement = core.insertTrackChangeElement(editor, core.DELETE_ACTION, differences, deleteKey);
                    if (tcInsertElement && tcInsertElement[0] && (tcInsertElement[1] === core.PARENT || tcInsertElement[1] === core.CURRENT)) {
                        core.breakParentAndMoveTo(editor, newElement, tcInsertElement[0], deleteKey);
                    }
                }
            }
        }
    };

    trackChanges.core = {

        // Track changes names and element types
        TRACKCHANGES_ELEMENT: "span", TRACKCHANGES_ELEMENT_SELECTOR: "div#docContainer akomantoso span[data-akn-name='trackchanges']",
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

        searchTrackChangeElement: function(editor, action, previousFirst, deleteKey) {
            var tcElement = null, previousSearched = false, nextSearched = false;
            editor.getSelection().getRanges()[0].optimize();
            while (!previousSearched || !nextSearched) {
                if (previousFirst || nextSearched) {
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
            var node = editor.getSelection().getRanges()[0].getPreviousNode();
            if (node && (node.type === CKEDITOR.NODE_ELEMENT) && (typeof(node.getAttribute) != 'undefined') && (node.getAttribute(this.ACTION_ATTR) === action)) {
                return [node, this.CARET_END];
            } else if (node && (node.type === CKEDITOR.NODE_TEXT) && node.hasPrevious() && (deleteKey === false) && (node.getText().length === CKEDITOR.NODE_ELEMENT)) {
                node = node.getPrevious();
                if (node && (node.type === CKEDITOR.NODE_ELEMENT) && (typeof(node.getAttribute) != 'undefined') && (node.getAttribute(this.ACTION_ATTR) === action)) {
                    return [node, this.CARET_END];
                }
            }
            return null;
        },

        searchNextTrackChangeElement: function(editor, action, deleteKey) {
            var node = editor.getSelection().getRanges()[0].getNextNode();
            if (node && (node.type === CKEDITOR.NODE_ELEMENT) && (typeof(node.getAttribute) != 'undefined') && (node.getAttribute(this.ACTION_ATTR) === action)) {
                return [node, this.CARET_START];
            } else if (node && (node.type === CKEDITOR.NODE_TEXT) && node.hasNext() && (deleteKey === true) && (node.getText().length === CKEDITOR.NODE_ELEMENT)) {
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

        insertTrackChangeElement: function(editor, action, text, toEnd, isHtml) {
            var tcElement = this.buildTrackChangeElement(editor, action, text, isHtml);
            editor.insertElement(tcElement);
            this.setToEditablePosition(editor, tcElement, toEnd);
            return tcElement;
        },

        addTrackChangesNested: function(editor, item) {
            if (this.isTrackChangeElement(item, this.INSERT_ACTION)) {
                // Span insert element!
                if (item.getAttribute(this.UID_ATTR) != trackChanges.getUserId(editor)) {
                    // If not own insert, build delete tag
                    item = this.buildTrackChangeElement(editor, this.DELETE_ACTION, item.$.innerHTML, true);
                } else {
                    // Empty the item but prevent crash. if its own delete
                    item = null;
                }
            } else if (this.isTrackChangeElement(item, this.DELETE_ACTION)) {
                // Span delete element! - Maintain, no actions needed
                // Nothing yet... Prevent reaching else.
            } else if ((item != null) && (item.$.nodeType === CKEDITOR.NODE_TEXT)) {
                if (this.isTrackChangeElement(item.getParent(), this.INSERT_ACTION)) {
                    if (item.getAttribute(this.UID_ATTR) != trackChanges.getUserId(editor)) {
                        // If not own insert, build delete tag
                        item = this.buildTrackChangeElement(editor, this.DELETE_ACTION, item.$.innerHTML, true);
                    } else {
                        // Empty the item but prevent crash. if its own delete
                        item = null;
                    }
                } else {
                    // Normal flow - Make delete element
                    if (editor.getSelection().getStartElement().getAttribute(this.UID_ATTR) != trackChanges.getUserId(editor)) {
                        item = this.buildTrackChangeElement(editor, this.DELETE_ACTION, item.getText(),true);
                    } else {
                        item = null;
                    }
                }
            } else if (item != null) {
                //Normal objects, walk recursive
                var elementGeneratedHTML = "";
                var tempArray = this.toArray(item.getChildren());
                for (var e = 0; tempArray.length > e; e++) {
                    var tempItem = this.addTrackChangesNested(editor, tempArray[e]);
                    elementGeneratedHTML += (tempItem != null ? tempItem.$.outerHTML : "");
                }
                if (editor.getSelection().getStartElement().getAttribute(this.UID_ATTR) != trackChanges.getUserId(editor)) {
                    item.$.innerHTML = elementGeneratedHTML;
                }
            }
            return item;
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
            return ((element != null) && (element.$.nodeType === CKEDITOR.NODE_ELEMENT) &&
                (element.getName().toLowerCase() === this.TRACKCHANGES_ELEMENT) && (element.getAttribute(this.ACTION_ATTR) === action));
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
        this.isCtrl = function() {
            var e = event();
            return e.data.$.metaKey || e.data.$.ctrlKey || (this.getKeyCode() === 17) || (this.getKeyCode() === 91) || (this.getKeyCode() === 224);
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
            var charCode = e.data.$.keyCode;
            return charCode;
        }
        var getCharCode = function() {
            var e = event();
            var charCode = (CKEDITOR.env.ie ? e.data.$.keyCode : e.data.$.charCode);
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

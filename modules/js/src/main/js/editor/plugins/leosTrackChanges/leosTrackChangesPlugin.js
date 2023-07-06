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
    var trackChanges = require("./leosTrackChanges"), trackChangesStyle = require("./leosTrackChangesStyle"),
        trackChangesTable = require("./leosTrackChangesTable");
    var UTILS = require("core/leosUtils");

    var pluginName = "leosTrackChanges";

    var pluginDefinition = {
        init: function init(editor) {
            // Plugin only allowed for cloned proposals
            if (!editor.LEOS.isClonedProposal) {
                return;
            }

            var core = trackChanges.core, actions = trackChanges.actions, style = trackChangesStyle.style, table = trackChangesTable.table;
            var isTrackChangesShowed = editor.LEOS.isTrackChangesShowed, isTrackChangesEnabled = editor.LEOS.isTrackChangesEnabled;
            var canUserAcceptChanges = core.canUserAcceptChanges(editor), canUserRejectChanges = core.canUserRejectChanges(editor);
            var selectedElement;

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
                editor.addMenuItem("acceptOneChangeItem", {
                    label: "Accept this change",
                    icon: this.path + "icons/ok.png",
                    command: "acceptOneChange",
                    group: "trackChangesGroup"
                });
                editor.addMenuItem("rejectOneChangeItem", {
                    label: "Reject this change",
                    icon: this.path + "icons/remove.png",
                    command: "rejectOneChange",
                    group: "trackChangesGroup"
                });
                editor.addMenuItem("acceptSelectedChangesItem", {
                    label: "Accept selected changes",
                    icon: this.path + "icons/ok.png",
                    command: "acceptSelectedChanges",
                    group: "trackChangesGroup"
                });
                editor.addMenuItem("rejectSelectedChangesItem", {
                    label: "Reject selected changes",
                    icon: this.path + "icons/remove.png",
                    command: "rejectSelectedChanges",
                    group: "trackChangesGroup"
                });
                editor.addMenuItem("acceptRowChangeItem", {
                    label: "Accept this row change",
                    icon: this.path + "icons/ok.png",
                    command: "acceptRowChange",
                    group: "trackChangesGroup"
                });
                editor.addMenuItem( "rejectRowChangeItem", {
                    label: "Reject this row change",
                    icon: this.path + "icons/remove.png",
                    command: "rejectRowChange",
                    group: "trackChangesGroup"
                });
                editor.addCommand("acceptOneChange", {
                    canUndo: true,
                    exec: function(editor) {
                        actions.acceptChange(editor, selectedElement);
                    }
                });
                editor.addCommand("rejectOneChange", {
                    canUndo: true,
                    exec: function(editor) {
                        actions.rejectChange(editor, selectedElement);
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
                editor.addCommand("acceptRowChange", {
                    canUndo: true,
                    exec: function(editor) {
                        actions.acceptRowChange(editor, selectedElement);
                    }
                });
                editor.addCommand("rejectRowChange", {
                    canUndo: true,
                    exec: function(editor) {
                        actions.rejectRowChange(editor, selectedElement);
                    }
                });
                editor.contextMenu.addListener(function(element) {
                    var tcElement = element.$.closest(core.TRACKCHANGES_TABLE_ROW_ELEMENT_SELECTOR);
                    if (tcElement) { // Is a track change deleted row
                        selectedElement = new CKEDITOR.dom.element(tcElement);
                        return {
                            acceptRowChangeItem: canUserAcceptChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                            rejectRowChangeItem: canUserRejectChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
                        };
                    } else if (editor.getSelection().isCollapsed()) {
                        tcElement = element.$.closest(core.TRACKCHANGES_ELEMENT_SELECTOR);
                        if (tcElement) {
                            selectedElement = new CKEDITOR.dom.element(tcElement);
                            return {
                                acceptOneChangeItem: canUserAcceptChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                rejectOneChangeItem: canUserRejectChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
                            };
                        }
                    } else {
                        var tcElements = core.findElementsInSelection(editor.getSelection());
                        if (tcElements.length > 0) {
                            return {
                                acceptSelectedChangesItem: canUserAcceptChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                rejectSelectedChangesItem: canUserRejectChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
                            };
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

                var editable = editor.editable();
                var deleteTcStyle = new CKEDITOR.style({
                    element: core.TRACKCHANGES_ELEMENT,
                    attributes: core.getTrackChangeAttributes(editor, core.DELETE_ACTION)
                });

                // Initialize styles with selected track changes showed option
                core.updateTrackChangesStyles(core.getUserId(editor), editor.LEOS.proposalRef, isTrackChangesShowed);

                // Used for CTRL-X, to get the content BEFORE been deleted
                editable.attachListener(editor.document, "keydown", function(e) {
                    if (!CKEDITOR.dialog.getCurrent() && isTrackChangesEnabled && (editor.getSelection().getRanges().length > 0)) {
                        var event = new EventWrapper(e);
                        if (e.data.$.ctrlKey && event.getKeyCode() === UTILS.KEYS.KEY_CTRL_X) {
                            style.apply(editor, deleteTcStyle);
                            var range = editor.getSelection().getRanges()[0];
                            range.collapse(false);
                            range.select();
                            event.getInstance().data.preventDefault();
                            event.getInstance().stop();
                        }
                    }
                });

                // Delete functionality - key - catch snapshots
                editable.attachListener(editor, "key", function(e) {

                    if (!CKEDITOR.dialog.getCurrent() && isTrackChangesEnabled && (editor.getSelection().getRanges().length > 0)) {

                        var event = new EventWrapper(e);

                        // On delete functionality(prevents/backup of text)
                        if ((event.getKeyCode() === UTILS.KEYS.KEY_DELETE) || (event.getKeyCode() === UTILS.KEYS.KEY_BACKSPACE)) {

                            editor.getSelection().getRanges()[0].optimize();
                            var range = editor.getSelection().getRanges()[0];
                            var deleteKey = (event.getKeyCode() === UTILS.KEYS.KEY_BACKSPACE);

                            var allow = true;
                            if (range.collapsed) {
                                allow = actions.selectOneChar(deleteKey, range, editor);
                            }

                            if (allow) {
                                editor.fire("saveSnapshot");

                                style.apply(editor, deleteTcStyle);
                                range = editor.getSelection().getRanges()[0];
                                if (deleteKey) {
                                    range.collapse(false);
                                } else {
                                    range.collapse(true);
                                }
                                range.select();
                                editor.fire("change");
                            }

                            event.getInstance().data.domEvent.preventDefault();
                            event.getInstance().stop();

                        }
                    }
                });

                // - Prevent of insert in Delete
                // - Insert functionality
                editable.attachListener(editor.document, "keypress", function(e) {
                    var event = new EventWrapper(e);
                    var character = event.getChar();
                    if (!CKEDITOR.dialog.getCurrent() && character && !e.data.$.ctrlKey && !e.data.$.metaKey
                        && (event.getKeyCode() != UTILS.KEYS.KEY_DELETE) && (event.getKeyCode() != UTILS.KEYS.KEY_BACKSPACE) && (event.getKeyCode() != 29)) { // Do not capture CTRL hotkeys & escape
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

            });

            // Catch toolbar buttons commands before execution
            editor.on("beforeCommandExec", function(event) {
                if (isTrackChangesEnabled) {
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
                            var range = editor.getSelection().getRanges()[0];
                            if ((range.collapsed && core.isInsideTrackChangeElement(editor, core.DELETE_ACTION)) ||
                                !range.collapsed) {
                                return false;
                            }
                            break;
                        case "inlinesaveclose":
                            editor.setData(editor.getData().replace(/leos:title="([\s\S][^:]+?)"/g, "leos:title=\"$1 : " + core.getDateFormat() + "\""));
                            break;
                        case "rowDelete":
                            table.rowDelete(editor);
                            editor.fire("change");
                            return false;
                        case "rowInsertBefore":
                            table.rowInsertBefore(editor);
                            editor.fire("change");
                            return false;
                        case "rowInsertAfter":
                            table.rowInsertAfter(editor);
                            editor.fire("change");
                            return false;
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
        akn : "inline[leos:action]",
        html : "span[data-akn-action]",
        attr : [{
            akn : "xml:id",
            html : "id"
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

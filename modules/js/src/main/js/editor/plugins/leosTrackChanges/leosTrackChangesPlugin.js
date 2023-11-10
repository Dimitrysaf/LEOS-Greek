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
    var leosPluginUtils = require("plugins/leosPluginUtils");
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
            var deleteTcStyle = new CKEDITOR.style({ element: core.TRACKCHANGES_ELEMENT, attributes: core.getTrackChangeAttributes(editor, core.DELETE_ACTION) });
            var selectedElement, handleMutations = false;
            var mousePosition = [], docContainer = document.getElementById("docContainer");

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
                    var elementWithPseudoElt = core.getClosestElementWithPseudoElt(element, core.BEFORE);
                    if (elementWithPseudoElt && (elementWithPseudoElt.getAttribute(core.DATA_AKN_ACTION_NUMBER) || elementWithPseudoElt.getAttribute(core.DATA_AKN_ACTION_ENTER))
                        && core.isMouseOverPseudoElt(elementWithPseudoElt, mousePosition, core.BEFORE)) {
                        if (elementWithPseudoElt.getAttribute(core.DATA_AKN_SOFTACTION_ROOT)) {
                            editor.getSelection().fake(new CKEDITOR.dom.element(elementWithPseudoElt));
                            return {
                                acceptOneChangeItem: canUserAcceptChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                rejectOneChangeItem: canUserRejectChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
                            };
                        }
                    } else {
                        var tcElement = element.$.closest(core.TRACKCHANGES_TABLE_ROW_ELEMENT_SELECTOR);
                        if (tcElement) { // Is a track change deleted row
                            selectedElement = new CKEDITOR.dom.element(tcElement);
                            return {
                                acceptRowChangeItem: canUserAcceptChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                rejectRowChangeItem: canUserRejectChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
                            };
                        } else if (editor.getSelection().isCollapsed() && (element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION)
                            && (element.getAttribute(core.DATA_AKN_SOFTACTION) === core.SOFTACTION_MOVE_FROM)) {
                            return {
                                acceptOneChangeItem: canUserAcceptChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                rejectOneChangeItem: canUserRejectChanges ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
                            };
                        } else if (editor.getSelection().isCollapsed() || element.$.classList.contains("cke_widget_inline")) {
                            tcElement = element.$.closest(core.TRACKCHANGES_ELEMENT_SELECTOR);
                            if (tcElement) {
                                editor.getSelection().fake(new CKEDITOR.dom.element(tcElement));
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
                    }
                });
                docContainer.addEventListener("mousedown", function(event) {
                    var posx = 0, posy = 0;
                    if (event.pageX || event.pageY) {
                        posx = event.pageX + docContainer.scrollLeft;
                        posy = event.pageY + docContainer.scrollTop;
                    }
                    mousePosition = [posx, posy];
                });
            }

            editor.on("change", actions.handleEnterInTrackChanges, null, null, 100);

            editor.on("handleTcIndent", function (event) {
                if (isTrackChangesEnabled) {
                    var element = event.data.data;
                    core.setOriginalNumber(element, event.data.previousNumber);
                    if ((element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER) !== core.UNNUMBERED)
                        && (element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER) !== core.NEW)
                        && element.getAttribute(leosPluginUtils.DATA_AKN_NUM)) {
                        if (element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER) !== element.getAttribute(leosPluginUtils.DATA_AKN_NUM)) {
                            core.addTrackChangesAttributesForNumbering(editor, element, core.INSERT_ACTION);
                        } else {
                            core.removeTrackChangesAttributesForNumbering(element);
                        }
                    } else if ((element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER) !== core.UNNUMBERED)
                        && (element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER) !== core.NEW)
                        && !element.getAttribute(leosPluginUtils.DATA_AKN_NUM)) {
                        core.addTrackChangesAttributesForNumbering(editor, element, core.DELETE_ACTION);
                    } else if (element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER) === core.UNNUMBERED) {
                        if (element.getAttribute(leosPluginUtils.DATA_AKN_NUM)) {
                            core.addTrackChangesAttributesForNumbering(editor, element, core.INSERT_ACTION);
                        } else if (element.getAttribute(core.DATA_AKN_ACTION_ENTER) !== core.DELETE_ACTION) {
                            core.removeTrackChangesAttributesForNumbering(element);
                        }
                    } else if (element.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER) === core.NEW) {
                        element.setAttribute(core.DATA_AKN_SOFTACTION_ROOT, core.TRUE);
                        core.addTrackChangesAttributesForNumbering(editor, element, core.INSERT_ACTION);
                    }
                }
            });

            editor.on("handleTrackTraceForEnterCreated", function (event) {
                if (isTrackChangesEnabled) {
                    var editor = event.editor;
                    var selection = editor.getSelection();
                    var ranges = selection && selection.getRanges();
                    var range = ranges && ranges[0];
                    var el = range && range.startContainer;
                    if (el) {
                        core.addTrackChangesAttributesForEnter(editor, el, core.INSERT_ACTION);
                    }
                }
            });

            editor.on("handleTrackTraceForEnterDeleted", function (event) {
                function getElementToSetAttributes(element) {
                    var elementToSetAttribute = element;
                    if (elementToSetAttribute.type === CKEDITOR.NODE_TEXT) { elementToSetAttribute = elementToSetAttribute.getParent() }
                    while (elementToSetAttribute.getName() !== 'li' && elementToSetAttribute.getName() !== 'p' && elementToSetAttribute.getParent()) {
                        elementToSetAttribute = elementToSetAttribute.getParent();
                    }
                    if (leosPluginUtils.isListIntroAndFirstSubparaOfPointOrPara(elementToSetAttribute)) {
                        elementToSetAttribute = getElementToSetAttributes(elementToSetAttribute.getParent());
                    }
                    return elementToSetAttribute;
                }
                if (isTrackChangesEnabled) {
                    var element = event.data;
                    var elementToSetAttribute = getElementToSetAttributes(element.startContainer);

                    // Not add the attributes if the attributes are already there
                    if (elementToSetAttribute.getAttribute(core.DATA_AKN_ACTION_ENTER) !== core.DELETE_ACTION) {
                        core.addTrackChangesAttributesForEnter(editor, elementToSetAttribute, core.DELETE_ACTION);
                        if (elementToSetAttribute.getAttribute(leosPluginUtils.DATA_AKN_NUM)) {
                            core.addTrackChangesAttributesForNumbering(editor, elementToSetAttribute, core.DELETE_ACTION);
                        } else {
                            elementToSetAttribute.setAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER, core.UNNUMBERED);
                        }
                        editor.fire("change");
                    }
                }
            });

            editor.on("setOriginalTcNumber", function (event) {
                if (isTrackChangesEnabled) {
                    var element = event.data.data;
                    var previousNumber = event.data.previousNumber;
                    core.setOriginalNumber(element, previousNumber);
                }
            });

            // Update toggle display state when editor has focus
            editor.on("focus", function () {
                editor.getCommand("toggleDisplayCommand")
                    .setState(isTrackChangesShowed ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
            });

            editor.on("toDataFormat", function(event) {
                event.data.dataValue = event.data.dataValue.replace(/leos:title="([\s\S][^:]+?)"/g, "leos:title=\"$1 : " + core.getDateFormat() + "\"");
                event.data.dataValue = event.data.dataValue.replace(/leos:title-number="([\s\S][^:]+?)"/g, "leos:title-number=\"$1 : " + core.getDateFormat() + "\"");
                event.data.dataValue = event.data.dataValue.replace(/leos:title-enter="([\s\S][^:]+?)"/g, "leos:title-enter=\"$1 : " + core.getDateFormat() + "\"");
                event.data.dataValue = event.data.dataValue.replace(/xml:id="temp_([\s\S][^:]+?)"/g, "");
            }, null, null, 15);

            // Bind events if the Dom is ready!
            editor.on("contentDom", function() {

                var editable = editor.editable();

                // Initialize styles with selected track changes showed option
                core.updateTrackChangesStyles(core.getUserId(editor), editor.LEOS.proposalRef, isTrackChangesShowed);

                // Attach key listeners for table
                table.keyboardIntegration(editor);

                // Used for CTRL-X, to get the content BEFORE been deleted
                editable.attachListener(editor.document, "keydown", function(e) {
                    if (!CKEDITOR.dialog?.getCurrent() && !core.isInsideTrackedHigherElement(editor, core.getUserId(editor)) && isTrackChangesEnabled && (editor.getSelection().getRanges().length > 0)) {
                        var event = new EventWrapper(e);
                        if (e.data.$.ctrlKey && event.getKeyCode() === UTILS.KEYS.KEY_X) {
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
                    if (!CKEDITOR.dialog?.getCurrent() && !core.isInsideTrackedHigherElement(editor, core.getUserId(editor)) && isTrackChangesEnabled && (editor.getSelection().getRanges().length > 0)) {

                        var event = new EventWrapper(e);

                        // On delete functionality(prevents/backup of text)
                        if ((event.getKeyCode() === UTILS.KEYS.KEY_DELETE) || (event.getKeyCode() === UTILS.KEYS.KEY_BACKSPACE)) {

                            editor.getSelection().getRanges()[0].optimize();
                            var range = editor.getSelection().getRanges()[0];
                            var deleteKey = (event.getKeyCode() === UTILS.KEYS.KEY_BACKSPACE);

                            if(!deleteKey) {
                                var elementToDelete = range.getPreviousNode();
                                if(elementToDelete.type === CKEDITOR.NODE_TEXT && elementToDelete.$.textContent.replace(/\u200B/g,'') === '' && elementToDelete.getParent().getAttribute(core.DATA_AKN_ACTION_ENTER) === 'insert') {
                                    return;
                                }
                            } 
                            
                            if ((range.collapsed && actions.selectElementToDelete(deleteKey, editor)) || !range.collapsed) {

                                editor.fire("saveSnapshot");

                                style.apply(editor, deleteTcStyle);

                                range = editor.getSelection().getRanges()[0];
                                range.collapse(!deleteKey);
                                range.select();

                                editor.fire("change");
                            }

                            event.getInstance().data.domEvent.preventDefault();
                            event.getInstance().stop();

                        }
                    }
                }, null, null, 9);

                // - Prevent of insert in Delete
                // - Insert functionality
                editable.attachListener(editor.document, "keypress", function(e) {
                    var event = new EventWrapper(e);
                    var character = event.getChar();
                    if (!CKEDITOR.dialog?.getCurrent() && character && !e.data.$.ctrlKey && !e.data.$.metaKey
                        && (event.getKeyCode() != UTILS.KEYS.KEY_DELETE) && (event.getKeyCode() != UTILS.KEYS.KEY_BACKSPACE) && (event.getKeyCode() != 29)) { // Do not capture CTRL hotkeys & escape
                        if (isTrackChangesEnabled) {
                            if (!editor.getSelection().isCollapsed()) {
                                editor.fire("saveSnapshot");
                                style.apply(editor, deleteTcStyle);
                                var endContainer = editor.getSelection().getRanges()[0].endContainer; // Collapse range to write at end
                                core.setToEditablePosition(editor, endContainer, core.CARET_END);
                                editor.fire("saveSnapshot");
                            }
                            if (actions.insertNewData(editor, character)) { // Inserts the new data
                                event.getInstance().data.preventDefault(); // Prevent standard insert
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
                    if (!CKEDITOR.dialog?.getCurrent() && isTrackChangesEnabled) {
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
                switch (event.data.name) {
                    case "bold":
                    case "italic":
                    case "subscript":
                    case "superscript":
                        if (isTrackChangesEnabled && editor.LEOS.isTrackChangesStyleFormattingEnabled) {
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
                        if ((editor.getSelection().isCollapsed() && core.isInsideTrackChangeElement(editor, core.DELETE_ACTION)) ||
                            !editor.getSelection().isCollapsed()) {
                            return false;
                        }
                        break;
                    case "tableDelete":
                    case "rowDelete":
                    case "rowInsertBefore":
                    case "rowInsertAfter":
                        if (isTrackChangesEnabled) {
                            table.execCustomCommand(editor, event.data.name);
                            return false;
                        }
                        break;
                    case "cut":
                        style.apply(editor, deleteTcStyle);
                        var range = editor.getSelection().getRanges()[0];
                        range.collapse(false);
                        range.select();
                        editor.fire("change");
                        return false;
                }
            });

            editor.on('afterCommandExec', function(event) {
                if (event.data.name === 'enter') {
                    var elementToRemoveAttribute = event.editor.getSelection().getStartElement();
                    if (elementToRemoveAttribute.type === CKEDITOR.NODE_TEXT) { elementToRemoveAttribute = elementToRemoveAttribute.getParent() }
                    while (elementToRemoveAttribute.getName() !== 'li' && elementToRemoveAttribute.getParent()) {
                        elementToRemoveAttribute = elementToRemoveAttribute.getParent();
                    };
                    if (elementToRemoveAttribute.getAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER)) {
                        elementToRemoveAttribute.removeAttribute(core.DATA_AKN_TC_ORIGINAL_NUMBER);
                    }
                    if (elementToRemoveAttribute.getAttribute(core.DATA_AKN_ACTION_ENTER)) {
                        elementToRemoveAttribute.removeAttribute(core.DATA_AKN_ACTION_ENTER);
                    }
                    event.editor.fire("handleTcIndent", {data: elementToRemoveAttribute, previousNumber: elementToRemoveAttribute.getAttribute(leosPluginUtils.DATA_AKN_NUM)});
                }
            }, null, null, 15);

            // Implementation for tracking special characters
            // Handle element added by authorial note, references, mathjax and table
            CKEDITOR.on("dialogDefinition", function(event) {
                if (isTrackChangesEnabled) {
                    switch (event.data.name) {
                        case "specialchar":
                            var onChoice = function(event) {
                                var target, value;
                                if (event.data)
                                    target = event.data.getTarget();
                                else
                                    target = new CKEDITOR.dom.element(event);

                                if (target.getName() == "a" && (value = target.getChild(0).getHtml())) {
                                    target.removeClass("cke_light_background");
                                    dialog.hide();

                                    // We must use "insertText" here to keep text styled.
                                    var span = editor.document.createElement("span");
                                    span.setHtml(value);

                                    // Special character tracking
                                    if (!editor.getSelection().isCollapsed()) {
                                        style.apply(editor, deleteTcStyle);
                                        var endContainer = editor.getSelection().getRanges()[0].endContainer;
                                        core.setToEditablePosition(editor, endContainer, core.CARET_END);
                                    }
                                    if (!actions.insertNewData(editor, span.getText())) {
                                        editor.insertText(span.getText());
                                    }
                                }
                            };
                            var onClick = CKEDITOR.tools.addFunction(onChoice);
                            var dialog = event.data.definition.dialog;
                            dialog.on("show", function() {
                                var specialCharElements = document.getElementsByClassName("cke_specialchar");
                                for (var i = 0; i < specialCharElements.length; i++) {
                                    specialCharElements[i].removeAttribute("onkeydown");
                                    specialCharElements[i].setAttribute("onclick","CKEDITOR.tools.callFunction(" + onClick + ", this); return false;");
                                }
                            });
                            break;
                        case "authorialNoteDialog":
                        case "leosCrossReferenceDialog":
                        case "mathjax":
                            var dialog = event.data.definition.dialog;
                            dialog.on("ok", function(event) {
                                selectedElement = core.clone(event.sender._.editor.getSelection().getSelectedElement());
                                handleMutations = true;
                            });
                            break;
                        case "table":
                            var dialog = event.data.definition.dialog;
                            dialog.on("ok", function() {
                                handleMutations = true;
                            });
                            break;
                    }
                }
            });

            // Handle widgets deletion
            editor.widgets.on("instanceCreated", function instanceCreated(event) {
                if (isTrackChangesEnabled) {
                    var widget = event.data;
                    widget.on("key", function(event) {
                        if ((event.data.keyCode === UTILS.KEYS.KEY_DELETE) || (event.data.keyCode === UTILS.KEYS.KEY_BACKSPACE)) {
                            var widgetElement = event.sender.element.$.closest(".cke_widget_inline");
                            editor.getSelection().selectElement(new CKEDITOR.dom.element(widgetElement));
                            if (!core.isInsideTrackChangeElement(editor, core.DELETE_ACTION)) {
                                style.apply(editor, deleteTcStyle);
                            }
                            var endContainer = editor.getSelection().getRanges()[0].endContainer;
                            // If widget is not removed then set new position
                            if (editor.getSelection().getRanges()[0].startOffset !== editor.getSelection().getRanges()[0].endOffset) {
                                core.setToEditablePosition(editor, endContainer, (event.data.keyCode === UTILS.KEYS.KEY_BACKSPACE) ?
                                    core.CARET_END : core.CARET_START);
                            }
                            event.cancel();
                        } else if ((event.data.keyCode === UTILS.KEYS.KEY_ENTER) &&
                                core.isInsideTrackChangeElement(editor, core.DELETE_ACTION)) {
                            event.cancel(); // Prevent open widget dialog
                        }
                    });
                    widget.on("doubleclick", function(event) {
                        if (editor.getSelection().getSelectedElement() &&
                                core.isInsideTrackChangeElement(editor, core.DELETE_ACTION)) {
                            event.cancel(); // Prevent open widget dialog
                        }
                    });
                }
            }, null, null, 11);

            // Add observer to CKEditor when data is received
            editor.on("receiveData", function() {
                function processModification(target) {
                    editor.getSelection().selectElement(target);
                    if (!core.isInsideTrackChangeElement(editor)) {
                        selectedElement.insertBefore(target);
                        style.apply(editor, deleteTcStyle);
                        core.setToEditablePosition(editor, target, core.CARET_END);
                        if (actions.insertNewData(editor, target.$.outerHTML)) {
                            target.remove();
                        }
                    }
                }
                function processMutations(mutations) {
                    if (handleMutations) {
                        handleMutations = false;
                        for (var mutation of mutations) {
                            if (mutation.type === "childList") {
                                for (var node of mutation.addedNodes) {
                                    if (!(node instanceof HTMLElement)) continue;
                                    if (node.classList.contains("cke_widget_authorialNoteWidget") || node.classList.contains("cke_widget_mathjax") ||
                                            node.classList.contains("cke_widget_leosCrossReferenceWidget")) {
                                        core.setToEditablePosition(editor, new CKEDITOR.dom.element(node), core.CARET_END);
                                        if (actions.insertNewData(editor, node.outerHTML)) {
                                            node.remove();
                                        }
                                        break;
                                    } else if ((node.tagName === "TABLE") && !node.id) { // It is a new table
                                        var rows = node.querySelectorAll("tr");
                                        rows.forEach(function (row) {
                                            if (!row.getAttribute(core.UID_ATTR)) {
                                                core.addTrackChangesAttributes(editor, row, core.INSERT_ACTION);
                                            }
                                        });
                                        break;
                                    } else if (node.tagName === "REF") {
                                        var target = node.closest(".cke_widget_inline");
                                        if (target && target.classList.contains("cke_widget_leosCrossReferenceWidget")) { // Cross-reference modification
                                            processModification(new CKEDITOR.dom.element(target));
                                        }
                                        break;
                                    }
                                }
                            } else if (mutation.type === "attributes") {
                                var target = mutation.target.closest(".cke_widget_inline");
                                if (target && (target.classList.contains("cke_widget_authorialNoteWidget") || // Authorial note and Math modification
                                        target.classList.contains("cke_widget_mathjax"))) {
                                    processModification(new CKEDITOR.dom.element(target));
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
                        rootElement.mutationObserver.observe(rootElement, { childList: true, subtree: true,
                            attributes: true, attributeFilter: [ "data-cke-widget-data" ] });
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
            var charCode = e.data.domEvent ? e.data.domEvent.$.keyCode : (e.data.$ ? e.data.$.keyCode : e.data.keyCode);
            return charCode;
        }
        var getCharCode = function() {
            var e = event();
            var charCode = (CKEDITOR.env.ie ? (e.data.domEvent ? e.data.domEvent.$.keyCode : e.data.$.keyCode) : (e.data.domEvent ? e.data.domEvent.$.charCode : e.data.$.charCode));
            return charCode;
        }
    };

    pluginTools.addPlugin(pluginName, pluginDefinition);

    // return plugin module
    var pluginModule = {
        name : pluginName,
        trackChanges: trackChanges
    };

    return pluginModule;
});

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

    var pluginName = "leosTrackChanges";

    var trackChangesVisible;
    var trackChangesEnabled;
    var defaultTrackChangesEditorStyle;

    // Track changes editor selector
    const editorTcSelector = "div#docContainer akomantoso span[data-akn-name='trackchanges']";

    // Track changes names and element types
    const TRACKCHANGE_ELEMENT = "span";
    const ACTION_ATTR = "data-akn-action";
    const INSERT_ACTION = "insert";
    const DELETE_ACTION = "delete";
    const UID_ATTR = "data-akn-uid";
    const STATUS_ATTR = "data-akn-status";
    const NEW_STATUS = "new";

    // Caret definitions
    const CARET_START = false;
    const CARET_END = true;

    // TC Locations / Where the TC is found
    const CURRENT = "current";
    const PARENT = "parent";

    var pluginDefinition = {
        init: function init(editor) {
            // Plugin only allowed for cloned proposals
            if (!editor.LEOS.isClonedProposal) {
                return;
            }

            // Add toggle display
            addToggleDisplay(editor, this.path);

            // Update toggle display state when editor has focus
            editor.on("focus", function () {
                editor.getCommand("toggleDisplayCommand")
                    .setState(trackChangesVisible ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
            });

            // Bind events if the Dom is ready!
            editor.on("contentDom", function() {
                // Initialize toggle display
                trackChangesVisible = true;
                trackChangesEnabled = editor.LEOS.isTrackChangesEnabled;
                defaultTrackChangesEditorStyle = $("head #editorTcStyle");

                let editable = editor.editable();

                // - Prevent of insert in Delete
                // - Insert functionality
                editable.attachListener(editor.document, 'keypress', function(e) {
                    let event = new Event(e);
                    let character = event.getChar();
                    if (character && !e.data.$.ctrlKey && !e.data.$.metaKey
                        && (event.getKeyCode() != 8) && (event.getKeyCode() != 46) && (event.getKeyCode() != 29)) { // Do not capture CTRL hotkeys & escape
                        if (trackChangesEnabled) {
                            let range = editor.getSelection().getRanges()[0];
                            if (!range.collapsed) {
                                // Collapse range to write at end
                                editor.fire('saveSnapshot');
                                let endContainer = editor.getSelection().getRanges()[0].endContainer;
                                setToEditablePosition(editor, endContainer, CARET_END);
                                editor.fire('saveSnapshot');

                                preventInsertInDelete(editor); // Moves the caret if needed
                                insertTrackChangeElement(editor, INSERT_ACTION, character, CARET_END);
                            } else {
                                preventInsertInDelete(editor); // Moves the caret if needed
                                insertNewData(editor, event); // Inserts the new data
                            }
                        } else {
                            let tcElement = isInsideTrackChangeElement(editor);
                            if (tcElement) {
                                let newTcElement = insertTrackChangeElement(editor, INSERT_ACTION, character, CARET_END);
                                newTcElement.breakParent(tcElement);
                                setToEditablePosition(editor, newTcElement, CARET_END);
                                newTcElement.remove();
                                editor.insertHtml(character, 'text');

                                event.getInstance().data.preventDefault(); // Prevent standard insert
                            }
                        }
                    }
                });
            });
        }
    };

    function addToggleDisplay(editor, path) {
        editor.ui.addButton("toggleDisplay", {
            label: "Toggle track changes display",
            icon: path + "icons/display.png",
            command: "toggleDisplayCommand",
            toolbar: "trackChanges",
            isToggle: true
        });
        editor.addCommand("toggleDisplayCommand", {
            canUndo: false,
            exec: function(editor) {
                trackChangesVisible = !trackChangesVisible;
                this.setState(trackChangesVisible ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
                $("head #editorTcStyle").remove();
                if (trackChangesVisible) {
                    $("head").prepend(defaultTrackChangesEditorStyle);
                } else {
                    let editorTcStyle = editorTcSelector + "[data-akn-action='insert'] { text-decoration: none; }\n";
                    editorTcStyle += editorTcSelector + "[data-akn-action='delete'] { display: none; }\n";
                    $("head").prepend("<style id='editorTcStyle'>" + editorTcStyle + "</style>");
                }
            }
        });
    }

    function preventInsertInDelete(editor) {
        // Prevent typing within delete element. Check if next, last or current
        // is deleted element. If this is the case move to end
        editor.getSelection().getRanges()[0].optimize();
        let range = editor.getSelection().getRanges()[0];
        let tcElement = searchTrackChangeElementCheckingParent(editor, DELETE_ACTION);

        // If parent or current is deleted element overwrite output of above
        if (tcElement && ((tcElement[1] === PARENT) || (tcElement[1] === CURRENT))) {
            tcElement = [tcElement[0], CARET_START]; // Move to start of element behind the deleted
        }

        // Set caret after deleted if something is found
        if (tcElement && tcElement[0] && (tcElement[1] == CARET_START)) {
            if (tcElement[0].$.nodeType === CKEDITOR.NODE_TEXT) {
                tcElement[0] = tcElement[0].getParent();
            }
            range = editor.createRange();
            let next = tcElement[0].getNextSourceNode().getNextSourceNode();
            if (next) { // If not null and not first or the highest item
                range.selectNodeContents(next);
                range.collapse(true);
            } else {
                range.setStartBefore(tcElement[0]);
            }
            range.select();
        }
    }

    function insertNewData(editor, event) {
        editor.getSelection().getRanges()[0].optimize();
        let tcElement = searchTrackChangeElementAndRemoveIfEmpty(editor, INSERT_ACTION);
        if (tcElement && tcElement[0] && (tcElement[0].getAttribute(UID_ATTR) === getUserId(editor)) && (tcElement[0].getAttribute(STATUS_ATTR) === NEW_STATUS)) {
            if (tcElement[1] === PARENT || tcElement[1] === CURRENT) {
                return;
            } else if (tcElement[1] === CARET_START) {
                setToEditablePosition(editor, tcElement[0], CARET_START);
                return;
            } else {
                let text = (tcElement[1] === CARET_END ? tcElement[0].getText() + event.getChar() : event.getChar() + tcElement[0].getText());
                tcElement[0].setText(text);
            }
        } else {
            let newElement = insertTrackChangeElement(editor, INSERT_ACTION, event.getChar(), CARET_END);
            if (tcElement && tcElement[0] && (tcElement[1] === PARENT || tcElement[1] === CURRENT)) {
                newElement.breakParent(tcElement[0]);
                setToEditablePosition(editor, newElement, CARET_END);
            }
        }
        event.getInstance().data.preventDefault(); // Prevent standard insert
    }

    function searchTrackChangeElementAndRemoveIfEmpty(editor, action) {
        let tcElement = searchTrackChangeElementCheckingParent(editor, action);
        if (tcElement && tcElement[0] && !CKEDITOR.tools.trim(tcElement[0].getText())) {
            // TC Element is empty then it should be removed for creating a new one
            tcElement[0].remove();
            return null;
        }
        return tcElement;
    }

    function searchTrackChangeElementCheckingParent(editor, action) {
        editor.getSelection().getRanges()[0].optimize();
        let range = editor.getSelection().getRanges()[0];
        let startContainer = range.startContainer;
        if ((typeof(startContainer.getAttribute) != 'undefined') && (startContainer.getAttribute(ACTION_ATTR) === action)) {
            return [startContainer, CURRENT];
        } else if ((typeof(startContainer.getParent().getAttribute) != 'undefined') && (startContainer.getParent().getAttribute(ACTION_ATTR) === action)) {
            return [startContainer.getParent(), PARENT];
        } else { // If other checks not have found anything. This should be a parent.
            let tcElement = findElementInPathByName(editor, TRACKCHANGE_ELEMENT, action);
            if (tcElement) {
                return [tcElement, PARENT];
            }
        }
        // Check element before and after caret
        return searchTrackChangeElement(editor, action);
    }

    function searchTrackChangeElement(editor, action, previousFirst, deleteKey) {
        let tcElement = null;
        let previousSearched = false;
        let nextSearched = false;
        editor.getSelection().getRanges()[0].optimize();
        while (!previousSearched || !nextSearched) {
            if (previousFirst || nextSearched) {
                tcElement = searchPreviousTrackChangeElement(editor, action, deleteKey);
                previousSearched = true;
            } else {
                tcElement = searchNextTrackChangeElement(editor, action, deleteKey);
                nextSearched = true;
            }
            if (tcElement || (previousSearched && nextSearched)) {
                break;
            }
        }
        return tcElement;
    }

    function searchPreviousTrackChangeElement(editor, action, deleteKey) {
        let node = editor.getSelection().getRanges()[0].getPreviousNode();
        if (node && (node.type === CKEDITOR.NODE_ELEMENT) && (typeof(node.getAttribute) != 'undefined') && (node.getAttribute(ACTION_ATTR) === action)) {
            return [node, CARET_END];
        } else if (node && (node.type === CKEDITOR.NODE_TEXT) && node.hasPrevious() && (deleteKey === false) && (node.getText().length === CKEDITOR.NODE_ELEMENT)) {
            node = node.getPrevious();
            if (node && (node.type === CKEDITOR.NODE_ELEMENT) && (typeof(node.getAttribute) != 'undefined') && (node.getAttribute(ACTION_ATTR) === action)) {
                return [node, CARET_END];
            }
        }
        return null;
    }

    function searchNextTrackChangeElement(editor, action, deleteKey) {
        let node = editor.getSelection().getRanges()[0].getNextNode();
        if (node && (node.type === CKEDITOR.NODE_ELEMENT) && (typeof(node.getAttribute) != 'undefined') && (node.getAttribute(ACTION_ATTR) === action)) {
            return [node, CARET_START];
        } else if (node && (node.type === CKEDITOR.NODE_TEXT) && node.hasNext() && (deleteKey === true) && (node.getText().length === CKEDITOR.NODE_ELEMENT)) {
            node = node.getNext();
            if (node && (node.type === CKEDITOR.NODE_ELEMENT) && (typeof(node.getAttribute) != 'undefined') && (node.getAttribute(ACTION_ATTR) === action)) {
                return [node, CARET_START];
            }
        }
        return null;
    }

    function findElementInPathByName(editor, elType, elAction) {
        let selection = editor.getSelection();
        if (selection) {
            let path = selection.getRanges()[0].startPath();
            for (let i = 0; path.elements.length > i; i++) {
                let el = path.elements[i];
                if ((el.getName() == elType) && (el.getAttribute(ACTION_ATTR) == elAction)) {
                    return el;
                }
            }
        }
        return null;
    }

    function createTrackChangeElement(editor, action, text, isHtml) {
        let tcElement = new CKEDITOR.dom.element(TRACKCHANGE_ELEMENT);
        tcElement.setAttributes(getTrackChangeAttributes(editor, action));
        if (isHtml ? tcElement.setHtml(text) : tcElement.setText(text));
        return tcElement;
    }

    function insertTrackChangeElement(editor, action, text, toEnd, isHtml) {
        let tcElement = createTrackChangeElement(editor, action, text, isHtml);
        editor.insertElement(tcElement);
        setToEditablePosition(editor, tcElement, toEnd);
        return tcElement;
    }

    function isInsideTrackChangeElement(editor) {
        let tcElement = searchTrackChangeElementAndRemoveIfEmpty(editor, INSERT_ACTION);
        if (tcElement && (tcElement[1] === CURRENT || tcElement[1] === PARENT)) {
            return tcElement[0];
        } else {
            tcElement = searchTrackChangeElementAndRemoveIfEmpty(editor, DELETE_ACTION);
            if (tcElement && (tcElement[1] === CURRENT || tcElement[1] === PARENT)) {
                return tcElement[0];
            }
        }
        return null;
    }

    function getUserId(editor) {
        return editor.LEOS.user.login;
    }
    function getUserAndId(editor) {
        return [editor.LEOS.user.name, editor.LEOS.user.login];
    }

    function getDateFormat() {
        let d = new Date();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        return (day < 10 ? '0' : '') + day + "/" + (month < 10 ? '0' : '') + month + '/' + d.getFullYear() + " " + d.toLocaleTimeString();
    }

    function getTrackChangeAttributes(editor, action) {
        let user = getUserAndId(editor);
        let tcAttributes = {
            "data-akn-name" : "trackchanges",
            "data-akn-status" : NEW_STATUS,
            "data-akn-action": action,
            "data-akn-uid": user[1],
            "title": user[0] + " : " + getDateFormat()
        };
        return tcAttributes;
    }

    // Set caret(cursor) at end of the given element
    // Editor: the editor from CKEditor init function
    // setToEnd: A boolean to define if the caret is set to the end
    function setToEditablePosition(editor, element, setToEnd) {
        if ((element !== null) && (element.type !== null)) {
            let range = editor.createRange();
            range.moveToElementEditablePosition(element, setToEnd);
            range.select();
        }
    }

    var Event = function(_event) {
        let event = function() {
            return _event || window.event;
        }
        this.getInstance = function() {
            return event();
        }
        this.isCtrl = function() {
            let e = event();
            return e.data.$.metaKey || e.data.$.ctrlKey || (this.getKeyCode() === 17) || (this.getKeyCode() === 91) || (this.getKeyCode() === 224);
        }
        this.getChar = function() {
            let charCode = getCharCode();
            if (charCode === 0) {
                return null;
            }
            return String.fromCharCode(charCode);
        }
        this.getKeyCode = function() {
            let evt = event();
            let charCode = evt.data.$.keyCode;
            return charCode;
        }
        let getCharCode = function() {
            let evt = event();
            let charCode = (CKEDITOR.env.ie ? evt.data.$.keyCode : evt.data.$.charCode);
            return charCode;
        }
    }

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
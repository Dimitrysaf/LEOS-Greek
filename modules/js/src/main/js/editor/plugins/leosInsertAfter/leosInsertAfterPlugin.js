/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2.
 */
; // jshint ignore:line
define(function leosInsertAfterPluginModule(require) {
    "use strict";

    // load module dependencies
    var postal = require("postal");
    var pluginTools = require("plugins/pluginTools");
    var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");
    var CONFIG = require("core/leosConfig");
    var CKEDITOR = require("promise!ckEditor");
    var pluginName = "leosInsertAfter";
    var ENTER_KEY = 13;
    var CTRL_ENTER = CKEDITOR.CTRL + ENTER_KEY;
    var TRISTATE_DISABLED = CKEDITOR.TRISTATE_DISABLED, TRISTATE_OFF = CKEDITOR.TRISTATE_OFF;
    var EDITOR_CHANNEL = CONFIG.channels.editor.name;
    var editorChannel = postal.channel(EDITOR_CHANNEL);
    var elementId = null;
    var elementType = null;

    var pluginDefinition = {
        init: function init(editor) {
            var insertionInProgress = false;

            leosKeyHandler.on({
                editor: editor,
                eventType: 'key',
                key: CTRL_ENTER,
                action: _onCtrlEnter
            });


            function findNextAknSibling(xmlString, previousElementId) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, "application/xml");

                const previous = xmlDoc.getElementById(previousElementId);
                if (!previous) throw new Error("Element not found");

                const aknTag = previous.localName;
                let found = false;

                const walker = document.createTreeWalker(
                    xmlDoc,
                    NodeFilter.SHOW_ELEMENT,
                    null,
                    false
                );

                while (walker.nextNode()) {
                    const node = walker.currentNode;
                    if (node.isSameNode(previous)) {
                        found = true;
                        continue;
                    }

                    if (found && node.localName === aknTag) {
                        return node;
                    }
                }

                return null;
            }


            function _onCtrlEnter(context) {

                if (insertionInProgress) {
                    console.log("Insert operation already in progress.");
                    return;
                }

                insertionInProgress = true;

                //Save current element
                elementId = context.editor.LEOS.elementId;
                elementType = context.editor.LEOS.elementType;
                const parser = new DOMParser();
                const doc = parser.parseFromString(context.editor.LEOS.elementFragment, "application/xml");
                const selectedElement = doc.documentElement;
                let guidance = selectedElement.getAttribute('leos:guidance');
                let differentMessageForLast = guidance && guidance === 'true' ? false : true;

                var saveCompleteSub = editorChannel.subscribe('save.complete', function(editorClose) {
                    // Unsubscribe to avoid duplication
                    saveCompleteSub.unsubscribe();

                    var data = {
                        action: 'insert.after',
                        elementId: elementId,
                        elementType: elementType,
                        differentMessageForLast: differentMessageForLast
                    };

                    editorChannel.publish("actions.insert.after.element", data);
                });

                var insertCompleteSub = editorChannel.subscribe("actions.insert.after.completed", function(response) {
                    // Unsubscribe to avoid duplication
                    insertCompleteSub.unsubscribe();

                    var newElement = findNextAknSibling(response.editableXml, elementId);

                    if (!newElement) {
                        console.log("No next element found after old element.");
                        return;
                    }

                    var newElementId = newElement.getAttribute("id");
                    insertionInProgress = false;

                    var id = setInterval(function() {
                        if (!editor.semaphoreInitEditorOngoing) {
                            if (editorChannel) {
                                editorChannel.publish("actions.edit.element", {
                                    action: "edit",
                                    elementId: newElementId,
                                    elementType: elementType,
                                    elementCursorPos: 0,
                                    elementCursorChildPos: 0,
                                    elementCursorId: newElementId
                                });
                            }
                            clearInterval(id);
                        }
                    }, 500);
                });


                if (this.state != TRISTATE_DISABLED) {
                    if (context.editor.fire("canBeSaved")) {
                        context.editor.fire("save", {
                            data: context.editor.getData(),
                        });
                        context.editor.once("receiveData", context.editor.fire("close"));
                    }
                }

            }

        }
    };

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var pluginModule = {
        name: pluginName
    };

    return pluginModule;
});

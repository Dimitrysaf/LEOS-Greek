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
define(function aknBlockContainerPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var pluginName = "aknBlockContainer";

    var pluginDefinition = {
        init: function init(editor) {
            editor.on("toHtml", removeInitialSnapshot, null, null, 100);
            editor.on( 'key', function( evt ) {
                // Use getKey directly in order to ignore modifiers.
                // Justification: http://dev.ckeditor.com/ticket/11861#comment:13
                var key = evt.data.domEvent.getKey(), li;

                // DEl/BACKSPACE
                if ( editor.mode == 'wysiwyg' && key in { 8: 1, 46: 1 } ) {
                    var sel = editor.getSelection();
                    var range = sel.getRanges()[0];
                    if (!range || range.collapsed || editor.LEOS.isTrackChangesEnabled) {
                        // Nothing to do if no selection or track changes enabled
                        return;
                    }
                    var root = editor.editable().getNative();
                    var startContainer = range.startContainer.$;
                    var endContainer = range.endContainer.$;

                    var isAtStart = (range.startOffset === 0);
                    var endLength = (endContainer.nodeType === Node.TEXT_NODE) ? endContainer.length
                        : (endContainer.nodeType === Node.ELEMENT_NODE) ? endContainer.childNodes.length
                            : 0;
                    var isAtEnd = (range.endOffset === endLength);

                    var isWholeSelected = (startContainer === root && endContainer === root && isAtStart && isAtEnd);

                    if (isWholeSelected) {

                    var iterator = range.createIterator();
                    iterator.enlargeBr = false;

                    var firstP = null;
                    var firstLi = null;
                    var toRemove = [];

                    var node;

                    while ((node = iterator.getNextParagraph())) {
                        if (node.type === CKEDITOR.NODE_ELEMENT) {
                            const tag = node.getName();
                            if (tag === 'p') {
                                if (!firstP) {
                                    firstP = node;
                                } else {
                                    toRemove.push(node);
                                }
                            } else if (tag === 'li') {
                                if (!firstLi) {
                                    firstLi = node;
                                } else {
                                    toRemove.push(node);
                                }
                            } else {
                                toRemove.push(node);
                            }
                        }
                    }
                    if (firstP || firstLi || toRemove.length) {
                        evt.cancel();
                        // Clear and keep first <p>
                        if (firstP) {
                            firstP.setHtml('<br>');
                        }
                        // Clear and keep first <li>
                        if (firstLi) {
                            firstLi.setHtml('<br>');
                        }

                        // Remove all other p/li
                        toRemove.forEach(n => n.remove());

                        // Move caret to the first kept node (prefer <li> if present)
                        const focusNode = firstLi || firstP;
                        if (focusNode) {
                            const newRange = editor.createRange();
                            newRange.moveToPosition(focusNode, CKEDITOR.POSITION_AFTER_START);
                            newRange.select();
                        }

                        editor.fire('saveSnapshot');
                        setTimeout(function () {
                            editor.selectionChange(1);
                        });
                    }
                    }
                }

            }, null, null, 8 );
        }
    };

    pluginTools.addPlugin(pluginName, pluginDefinition);

    /*
     * Removes the initial snapshot which don't have 'blockcontainer'('div') as top level element
     */
    function removeInitialSnapshot(event) {
        if (event.editor.undoManager.snapshots.length > 0) {
            if (event.editor.undoManager.snapshots[0].contents.indexOf("div") < 0) {
                event.editor.undoManager.snapshots.shift();
            }
        }
    }


    var transformationConfig = {
        akn: "blockContainer",
        html: "div[data-akn-name=blockContainer]",
        attr: [{
            akn: "xml:id",
            html: "id"
        }, {
            akn : "leos:origin",
            html : "data-origin"
        }, {
            akn: "leos:editable",
            html: "leos:editable"
        }, {
            akn: "leos:deletable",
            html: "leos:deletable"
        }, {
            akn : "leos:softuser",
            html : "data-akn-attr-softuser"
        }, {
            akn : "leos:softdate",
            html : "data-akn-attr-softdate"
        }, {
            akn: "leos:id-to-be-restored",
            html: "data-akn-id-to-be-restored"
        }, {
            akn: "leos:renumber-origin",
            html: "data-akn-renumber-origin"
        }, {
            akn: "leos:id-to-be-removed",
            html: "data-akn-id-to-be-removed"
        }, {
            html: ["data-akn-name", "blockContainer"].join("=")
        }, {
            akn : "class",
            html : "data-akn-class"
        } ]
    };

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    // return plugin module
    var pluginModule = {
        name: pluginName,
        transformationConfig: transformationConfig
    };

    return pluginModule;
});
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
                    var root = editor.getSelection().getNative();
                    var startContainer = range.startContainer.$;
                    var endContainer = range.endContainer.$;

                    var isAtStart = (range.startOffset === 0);
                    var endLength = (endContainer.nodeType === Node.TEXT_NODE) ? endContainer.length
                        : (endContainer.nodeType === Node.ELEMENT_NODE) ? endContainer.childNodes.length
                            : 0;
                    var isAtEnd = (range.endOffset === endLength);

                    var isWholeSelected = (startContainer === root.focusNode && endContainer === root.focusNode && isAtStart && isAtEnd);
                    var selected = getSelectedTableList( sel );
                    //to do check that parent is div and is all selected
                    if (!!selected && selected.getParent().is("div") &&
                        selected.getParent().getAttribute("leos:editable") == "true" &&
                        selected.getParent().hasAttribute("data-akn-name") &&
                        selected.getParent().getAttribute("data-akn-name").toLowerCase() == "blockcontainer" &&
                        !selected.hasNext() && !selected.hasPrevious()) {
                            isWholeSelected = true;
                    }

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
                                const tableNode = node.getAscendant('table');
                                if (tableNode && !toRemove.some(obj => obj.getId() === tableNode.getId())) {
                                    toRemove.push(tableNode);
                                }
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
                            const firstEditable = editor.editable().findOne("[leos\\:editable='true']");
                            if (firstEditable && firstEditable.getChildCount() === 0) {
                                const newParagraph = new CKEDITOR.dom.element('p');
                                newParagraph.appendBogus();
                                firstEditable.append(newParagraph);
                                const newRange= editor.createRange();
                                newRange.moveToElementEditStart(newParagraph);
                                editor.getSelection().selectRanges([newRange]);
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

    // Check if the entire table/list contents is selected. from
    function getSelectedTableList( sel ) {
        var selected,
            range = sel.getRanges()[ 0 ],
            editable = sel.root,
            path = range.startPath(),
            structural = { table: 1, ul: 1, ol: 1, dl: 1 };

        if ( path.contains( structural ) ) {
            // Clone the original range.
            var walkerRng = range.clone();

            // Enlarge the range: X<ul><li>[Y]</li></ul>X => [X<ul><li>]Y</li></ul>X
            walkerRng.collapse( 1 );
            walkerRng.setStartAt( editable, CKEDITOR.POSITION_AFTER_START );

            // Create a new walker.
            var walker = new CKEDITOR.dom.walker( walkerRng );

            // Assign a new guard to the walker.
            walker.guard = guard();

            // Go backwards checking for selected structural node.
            walker.checkBackward();

            // If there's a selected structured element when checking backwards,
            // then check the same forwards.
            if ( selected ) {
                // Clone the original range.
                walkerRng = range.clone();

                // Enlarge the range (assuming <ul> is selected element from guard):
                //
                // 	   X<ul><li>[Y]</li></ul>X    =>    X<ul><li>Y[</li></ul>]X
                //
                // If the walker went deeper down DOM than a while ago when traversing
                // backwards, then it doesn't make sense: an element must be selected
                // symmetrically. By placing range end **after previously selected node**,
                // we make sure we don't go no deeper in DOM when going forwards.
                walkerRng.collapse();
                walkerRng.setEndAt( selected, CKEDITOR.POSITION_AFTER_END );

                // Create a new walker.
                walker = new CKEDITOR.dom.walker( walkerRng );

                // Assign a new guard to the walker.
                walker.guard = guard( true );

                // Reset selected node.
                selected = false;

                // Go forwards checking for selected structural node.
                walker.checkForward();

                return selected;
            }
        }

        return null;

        function guard( forwardGuard ) {
            var isNotWhitespace = CKEDITOR.dom.walker.whitespaces( true );
            var isNotBookmark = CKEDITOR.dom.walker.bookmark( false, true );
            var isBogus = CKEDITOR.dom.walker.bogus();
            
            function isNotEmpty( node ) {
                return isNotWhitespace( node ) && isNotBookmark( node );
            }

            return function( node, isWalkOut ) {
                // Save the encountered node as selected if going down the DOM structure
                // and the node is structured element.
                if ( isWalkOut && node.type == CKEDITOR.NODE_ELEMENT && node.is( structural ) )
                    selected = node;

                // Stop the walker when either traversing another non-empty node at the same
                // DOM level as in previous step.
                // NOTE: When going forwards, stop if encountered a bogus.
                if ( !isWalkOut && isNotEmpty( node ) && !( forwardGuard && isBogus( node ) ) )
                    return false;
            };
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
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
define(function leosTrackChangesTableModule(require) {
    "use strict";

    var log = require("logger");
    var trackChanges = require("./leosTrackChanges"), core = trackChanges.core;
    var trackChangesStyle = require("./leosTrackChangesStyle"), style = trackChangesStyle.style;

    var table = {

        getSelectedCells: function(selection, table) {
            var retval = [],
                database = {},
                cellNodeRegex = /^(?:td|th)$/;

            if (!selection) {
                return retval;
            }

            var ranges = selection.getRanges();

            function isInTable(cell) {
                if (!table) {
                    return true;
                }
                return table.contains(cell) && cell.getAscendant("table", true ).equals(table);
            }

            function moveOutOfCellGuard(node) {
                // Apply to the first cell only.
                if ( retval.length > 0 )
                    return;

                // If we are exiting from the first </td>, then the td should definitely be
                // included.
                if (node.type == CKEDITOR.NODE_ELEMENT && cellNodeRegex.test(node.getName()) && !node.getCustomData("selected_cell")) {
                    CKEDITOR.dom.element.setMarker(database, node, "selected_cell", true);
                    retval.push(node);
                }
            }

            for (var i = 0; i < ranges.length; i++) {
                var range = ranges[i];

                if (range.collapsed) {
                    // Walker does not handle collapsed ranges yet - fall back to old API.
                    var startNode = range.getCommonAncestor();
                    var nearestCell = startNode.getAscendant({ td: 1, th: 1 }, true);
                    if (nearestCell && isInTable(nearestCell)) {
                        retval.push(nearestCell);
                    }
                } else {
                    var walker = new CKEDITOR.dom.walker(range);
                    var node;
                    walker.guard = moveOutOfCellGuard;

                    while ((node = walker.next())) {
                        // If may be possible for us to have a range like this:
                        // <td>^1</td><td>^2</td>
                        // The 2nd td shouldn't be included.
                        //
                        // So we have to take care to include a td we've entered only when we've
                        // walked into its children.

                        if (node.type != CKEDITOR.NODE_ELEMENT || !node.is(CKEDITOR.dtd.table)) {
                            var parent = node.getAscendant({ td: 1, th: 1 }, true);
                            if (parent && !parent.getCustomData("selected_cell") && isInTable(parent)) {
                                CKEDITOR.dom.element.setMarker(database, parent, "selected_cell", true);
                                retval.push(parent);
                            }
                        }
                    }
                }
            }

            CKEDITOR.dom.element.clearAllMarkers(database);

            return retval;
        },

        placeCursorInCell: function(cell, placeAtEnd) {
            var docInner = cell.getDocument(),
                docOuter = CKEDITOR.document;

            // Fixing "Unspecified error" thrown in IE10 by resetting
            // selection the dirty and shameful way (https://dev.ckeditor.com/ticket/10308).
            // We can not apply this hack to IE8 because
            // it causes error (https://dev.ckeditor.com/ticket/11058).
            if (CKEDITOR.env.ie && CKEDITOR.env.version == 10) {
                docOuter.focus();
                docInner.focus();
            }

            var range = new CKEDITOR.dom.range(docInner);
            if (!range["moveToElementEdit" + (placeAtEnd ? "End" : "Start")](cell)) {
                range.selectNodeContents(cell);
                range.collapse(placeAtEnd ? false : true);
            }
            range.select(true);
        },

        deleteRows: function(editor, selectionOrRow) {
            if (selectionOrRow instanceof CKEDITOR.dom.selection) {
                var ranges = selectionOrRow.getRanges(),
                    cells = this.getSelectedCells(selectionOrRow),
                    firstCell = cells[ 0 ],
                    table = firstCell.getAscendant("table"),
                    map = CKEDITOR.tools.buildTableMap(table),
                    startRow = cells[0].getParent(),
                    startRowIndex = startRow.$.rowIndex,
                    lastCell = cells[cells.length - 1],
                    endRowIndex = lastCell.getParent().$.rowIndex + lastCell.$.rowSpan - 1,
                    rowsToDelete = [];

                selectionOrRow.reset();

                // Delete cell or reduce cell spans by checking through the table map.
                for (var i = startRowIndex; i <= endRowIndex; i++) {
                    var mapRow = map[i],
                        row = new CKEDITOR.dom.element(table.$.rows[i]);

                    for (var j = 0; j < mapRow.length; j++) {
                        var cell = new CKEDITOR.dom.element(mapRow[j]),
                            cellRowIndex = cell.getParent().$.rowIndex;

                        if (cell.$.rowSpan == 1) {
                            //cell.remove();
                            // Row spanned cell.
                        } else {
                            // Span row of the cell, reduce spanning.
                            cell.$.rowSpan -= 1;
                            // Root row of the cell, root cell to next row.
                            if (cellRowIndex == i) {
                                var nextMapRow = map[i + 1];
                                nextMapRow[j - 1] ? cell.insertAfter(new CKEDITOR.dom.element(nextMapRow[j - 1] )) : new CKEDITOR.dom.element(table.$.rows[i + 1]).append(cell, 1);
                            }
                        }

                        j += cell.$.colSpan - 1;
                    }

                    rowsToDelete.push(row);
                }

                var rows = table.$.rows;

                // After deleting whole table, the selection would be broken,
                // therefore it's safer to move it outside the table first.
                ranges[0].moveToPosition(table, CKEDITOR.POSITION_BEFORE_START);

                // Where to put the cursor after rows been deleted?
                // 1. Into next sibling row if any;
                // 2. Into previous sibling row if any;
                // 3. Into table's parent element if it's the very last row.
                var cursorPosition = new CKEDITOR.dom.element(rows[endRowIndex + 1] || (startRowIndex > 0 ? rows[startRowIndex - 1] : null) || table.$.parentNode);

                for (i = rowsToDelete.length; i >= 0; i--) {
                    this.deleteRows(editor, rowsToDelete[i]);
                }

                // If all the rows were removed, table gets removed too.
                if (!table.$.parentNode) {
                    ranges[0].select();
                    return null;
                }

                return cursorPosition;
            } else if (selectionOrRow instanceof CKEDITOR.dom.element) {
                if (!selectionOrRow.hasAttribute(core.UID_ATTR)) {
                    core.addTrackChangesAttributes(editor, selectionOrRow, core.DELETE_ACTION);
                } else if (selectionOrRow.getAttribute(core.UID_ATTR) === core.getUserId(editor)) {
                    table = selectionOrRow.getAscendant("table");
                    if (table.$.rows.length == 1) {
                        table.remove();
                    } else {
                        selectionOrRow.remove();
                    }
                }
            }

            return null;
        },

        rowDelete: function(editor) {
            var selection = editor.getSelection(),
                cursorPosition = this.deleteRows(editor, selection);

            if (cursorPosition) {
                this.placeCursorInCell(cursorPosition);
            }
        },

        insertRow: function(editor, selectionOrCells, insertBefore) {
            var cells = CKEDITOR.tools.isArray(selectionOrCells) ? selectionOrCells : this.getSelectedCells(selectionOrCells),
                firstCell = cells[0],
                table = firstCell.getAscendant("table"),
                doc = firstCell.getDocument(),
                startRow = cells[0].getParent(),
                startRowIndex = startRow.$.rowIndex,
                lastCell = cells[cells.length - 1],
                endRowIndex = lastCell.getParent().$.rowIndex + lastCell.$.rowSpan - 1,
                endRow = new CKEDITOR.dom.element(table.$.rows[endRowIndex]),
                rowIndex = insertBefore ? startRowIndex : endRowIndex,
                row = insertBefore ? startRow : endRow;

            var map = CKEDITOR.tools.buildTableMap(table),
                cloneRow = map[rowIndex],
                nextRow = insertBefore ? map[rowIndex - 1] : map[rowIndex + 1],
                width = map[0].length;

            var newRow = doc.createElement("tr");
            for (var i = 0; cloneRow[i] && i < width; i++) {
                var cell;
                // Check whether there's a spanning row here, do not break it.
                if (cloneRow[i].rowSpan > 1 && nextRow && cloneRow[i] == nextRow[i] ) {
                    cell = cloneRow[i];
                    cell.rowSpan += 1;
                } else {
                    cell = new CKEDITOR.dom.element(cloneRow[i]).clone();
                    cell.removeAttribute("rowSpan");
                    cell.appendBogus();
                    newRow.append(cell);
                    cell = cell.$;
                }

                i += cell.colSpan - 1;
            }

            core.addTrackChangesAttributes(editor, newRow, core.INSERT_ACTION);
            insertBefore ? newRow.insertBefore(row) : newRow.insertAfter(row);

            return newRow;
        },

        rowInsertBefore: function(editor) {
            var selection = editor.getSelection(),
                cells = this.getSelectedCells(selection);

            this.insertRow(editor, cells, true);
        },

        rowInsertAfter: function(editor) {
            var selection = editor.getSelection(),
                cells = this.getSelectedCells(selection);

            this.insertRow(editor, cells);
        },

        tableDelete: function(editor) {
            var path = editor.elementPath(),
                table = path.contains("table", 1);

            if (!table)
                return;

            // If the table's parent has only one child remove it as well (unless it's a table cell, or the editable element)
            //(https://dev.ckeditor.com/ticket/5416, https://dev.ckeditor.com/ticket/6289, https://dev.ckeditor.com/ticket/12110)
            var parent = table.getParent(),
                editable = editor.editable();

            if (parent.getChildCount() == 1 && !parent.is("td", "th", "li") && !parent.equals(editable))
                table = parent;

            var range = editor.createRange();
            range.moveToPosition(table, CKEDITOR.POSITION_BEFORE_START);
            var removeTable = true;
            if (table.getId()) {
                var currentUserId = core.getUserId(editor);
                var rows = table.$.querySelectorAll("tr");
                rows.forEach(function(row) {
                    if (!row.hasAttribute(core.UID_ATTR)) {
                        removeTable = false;
                        core.addTrackChangesAttributes(editor, row, core.DELETE_ACTION);
                    } else if (row.getAttribute(core.UID_ATTR) != currentUserId) {
                        removeTable = false;
                    }
                });
            }
            if (removeTable) {
                table.remove();
            }
            range.select();
        },

        execCustomCommand: function(editor, command) {
            this[command](editor);
        },

        /**
         * Adds keyboard integration for table selection in a given editor.
         *
         * @param {CKEDITOR.editor} editor
         * @private
         */
        keyboardIntegration: function(editor) {
            // Handle left, up, right, down, delete, backspace and enter keystrokes inside table fake selection.
            function getTableOnKeyDownListener(editor) {
                var keystrokes = {
                        37: 1, // Left Arrow
                        38: 1, // Up Arrow
                        39: 1, // Right Arrow,
                        40: 1, // Down Arrow
                        8: 1, // Backspace
                        46: 1, // Delete
                        13: 1 // Enter
                    },
                    tags = CKEDITOR.tools.extend({ table: 1 }, CKEDITOR.dtd.$tableContent);

                delete tags.td;
                delete tags.th;

                // Called when removing empty subseleciton of the table.
                // It should not allow for removing part of table, e.g. when user attempts to remove 2 cells
                // out of 4 in row. It should however remove whole row or table, if it was fully selected.
                function deleteEmptyTablePart(node, ranges) {
                    if (!ranges.length) {
                        return null;
                    }

                    var rng = editor.createRange(),
                        mergedRanges = CKEDITOR.dom.range.mergeRanges(ranges);

                    // Enlarge each range, so that it wraps over tr.
                    CKEDITOR.tools.array.forEach(mergedRanges, function(mergedRange) {
                        mergedRange.enlarge(CKEDITOR.ENLARGE_ELEMENT);
                    });

                    var boundaryNodes = mergedRanges[0].getBoundaryNodes(),
                        startNode = boundaryNodes.startNode,
                        endNode = boundaryNodes.endNode;

                    if (startNode && startNode.is && startNode.is(tags)) {
                        // A node that will receive selection after the firstRangeContainedNode is removed.
                        var boundaryTable = startNode.getAscendant("table", true),
                            targetNode = startNode.getPreviousSourceNode(false, CKEDITOR.NODE_ELEMENT, boundaryTable),
                            selectBeginning = false,
                            matchingElement = function(elem) {
                                // We're interested in matching only td/th but not contained by the startNode since it will be removed.
                                // Technically none of startNode children should be visited but it will due to https://dev.ckeditor.com/ticket/12191.
                                return !startNode.contains(elem) && elem.is && elem.is("td", "th");
                            };

                        while (targetNode && !matchingElement(targetNode)) {
                            targetNode = targetNode.getPreviousSourceNode(false, CKEDITOR.NODE_ELEMENT, boundaryTable);
                        }

                        if (!targetNode && endNode && endNode.is && !endNode.is("table") && endNode.getNext()) {
                            // Special case: say we were removing the first row, so there are no more tds before, check if there's a cell after removed row.
                            targetNode = endNode.getNext().findOne("td, th");
                            // In that particular case we want to select beginning.
                            selectBeginning = true;
                        }

                        if (!targetNode) {
                            // As a last resort of defence we'll put the selection before (about to be) removed table.
                            rng.setStartBefore(startNode.getAscendant("table", true));
                            rng.collapse(true);
                        } else {
                            rng["moveToElementEdit" + (selectBeginning ? "Start" : "End")](targetNode);
                        }

                        mergedRanges[0].deleteContents();

                        return [rng];
                    }

                    // By default return a collapsed selection in a first cell.
                    if (startNode) {
                        rng.moveToElementEditablePosition(startNode);
                        return [rng];
                    }
                }

                return function(evt) {
                    // Use getKey directly in order to ignore modifiers.
                    // Justification: https://dev.ckeditor.com/ticket/11861#comment:13
                    var key = evt.data.getKey(),
                        keystroke = evt.data.getKeystroke(),
                        selection,
                        toStart = key === 37 || key == 38,
                        ranges,
                        firstCell,
                        lastCell,
                        i;

                    // Handle only left/right/del/bspace keys.
                    // Disable editing cells in readonly mode (#1489).
                    if (!keystrokes[ key ] || editor.readOnly) {
                        return;
                    }

                    selection = editor.getSelection();

                    if (!selection || !selection.isInTable() || !selection.isFake) {
                        return;
                    }

                    ranges = selection.getRanges();
                    firstCell = ranges[0]._getTableElement();
                    lastCell = ranges[ranges.length - 1]._getTableElement();

                    // Only prevent event when tableselection handle it. Which is non-enter button, or pressing enter button with enterkey plugin present (#1816).
                    if (key !== 13 || editor.plugins.enterkey) {
                        evt.data.preventDefault();
                        evt.cancel();
                    }

                    if (key > 36 && key < 41) {
                        // Arrows.
                        ranges[0].moveToElementEditablePosition(toStart ? firstCell : lastCell, !toStart);
                        selection.selectRanges([ranges[0]]);
                    } else {
                        // Delete, backspace, enter.

                        // Do nothing for Enter with modifiers different than shift.
                        if (key === 13 && !(keystroke === 13 || keystroke === CKEDITOR.SHIFT + 13)) {
                            return;
                        }

                        var deleteTcStyle = new CKEDITOR.style({
                            element: core.TRACKCHANGES_ELEMENT,
                            attributes: core.getTrackChangeAttributes(editor, core.DELETE_ACTION)
                        });

                        style.apply(editor, deleteTcStyle);

                        /*for (i = 0; i < ranges.length; i++) {
                            clearCellInRange(ranges[i]);
                        }*/

                        /*var newRanges = deleteEmptyTablePart(firstCell, ranges);

                        if (newRanges) {
                            ranges = newRanges;
                        } else {
                            // If no new range was returned fallback to selecting first cell.
                            ranges[0].moveToElementEditablePosition(firstCell);
                        }*/

                        selection.selectRanges(ranges);

                        if (key === 13 && editor.plugins.enterkey) {
                            // We need to lock undoManager to consider clearing table and inserting new paragraph as single operation, and have only one undo step (#1816).
                            editor.fire("lockSnapshot");
                            keystroke === 13 ? editor.execCommand("enter") : editor.execCommand("shiftEnter");
                            editor.fire("unlockSnapshot");
                            editor.fire("saveSnapshot");
                        } else if (key !== 13) {
                            // Backspace and delete key should have saved snapshot.
                            editor.fire("saveSnapshot");
                        }
                    }
                };
            }

            function tableKeyPressListener(evt) {
                var selection = editor.getSelection(),
                    // Enter key also produces character, but Firefox doesn't think so (gh#415).
                    isCharKey = evt.data.$.charCode || (evt.data.getKey() === 13),
                    ranges,
                    firstCell,
                    i;

                // Disable editing cells in readonly mode (#1489).
                if (editor.readOnly) {
                    return;
                }

                // We must check if the event really did not produce any character as it's fired for all keys in Gecko.
                if (!selection || !selection.isInTable() || !selection.isFake || !isCharKey ||
                    evt.data.getKeystroke() & CKEDITOR.CTRL) {
                    return;
                }

                ranges = selection.getRanges();
                firstCell = ranges[0].getEnclosedNode().getAscendant( { td: 1, th: 1 }, true);

                var deleteTcStyle = new CKEDITOR.style({
                    element: core.TRACKCHANGES_ELEMENT,
                    attributes: core.getTrackChangeAttributes(editor, core.DELETE_ACTION)
                });

                style.apply(editor, deleteTcStyle);

                /*for (i = 0; i < ranges.length; i++) {
                    clearCellInRange(ranges[i]);
                }*/

                // In case of selection of table element, there won't be any cell (#867).
                if (firstCell) {
                    ranges[0].moveToElementEditablePosition(firstCell);
                    selection.selectRanges([ranges[0]]);
                }
            }

            function clearCellInRange(range) {
                var node = range.getEnclosedNode();

                // Set text only in case of table cells, otherwise remove whole element (#867).
                // Check if `node.is` is function, as returned node might be CKEDITOR.dom.text (#2089).
                if (node && typeof node.is === 'function' && node.is({ td: 1, th: 1 })) {
                    node.setText("");
                } else {
                    range.deleteContents();
                }

                CKEDITOR.tools.array.forEach(range._find('td'), function(cell) {
                    // Cells that were not removed, need to contain bogus BR (if needed), otherwise row might
                    // collapse. (tp#2270)
                    cell.appendBogus();
                });
            }

            // Automatically select non-editable element when navigating into
            // it by left/right or backspace/del keys.
            var editable = editor.editable();
            editable.attachListener(editable, "keydown", getTableOnKeyDownListener(editor), null, null, -2);
            editable.attachListener(editable, "keypress", tableKeyPressListener, null, null, -2);
        }

    };

    return {
        table : table
    };
});

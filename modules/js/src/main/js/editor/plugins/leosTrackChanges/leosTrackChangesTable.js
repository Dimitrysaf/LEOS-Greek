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
define(function leosTrackChangesTableModule(require) {
    "use strict";

    var log = require("logger");
    var trackChanges = require("./leosTrackChanges"), core = trackChanges.core;

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
                table = selectionOrRow.getAscendant("table");

                if (!selectionOrRow.getId()) {
                    if (table.$.rows.length == 1) {
                        table.remove();
                    } else {
                        selectionOrRow.remove();
                    }
                } else if (!selectionOrRow.getAttribute(core.UID_ATTR)) {
                    core.addTrackChangesAttributes(editor, selectionOrRow, core.DELETE_ACTION);
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
        }

    };

    return {
        table : table
    };
});

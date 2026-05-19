/*
 * Copyright 2026 European Union
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
/**
 * @fileOverview Allows resizing table row heights by dragging row borders.
 */
; // jshint ignore:line
define(function leosTableRowReSizeModule(require) {
    'use strict';

    var pluginTools = require('plugins/pluginTools');

    var pluginName = 'leosTableRowReSize';
    var pxUnit = CKEDITOR.tools.cssLength;

    function getHeight(el) {
        return parseInt(el.getComputedStyle('height'), 10) || el.$.offsetHeight;
    }

    function getBorderHeight(element, side) {
        var computed = element.getComputedStyle('border-' + side + '-width'),
            borderMap = { thin: '0px', medium: '1px', thick: '2px' };

        if (computed.indexOf('px') < 0) {
            if (computed in borderMap && element.getComputedStyle('border-style') != 'none')
                computed = borderMap[computed];
            else
                computed = 0;
        }
        return parseInt(computed, 10);
    }

    function buildTableRowBars(table) {
        var bars = [],
            rows = table.$.rows;

        for (var i = 0; i < rows.length - 1; i++) {
            var row = new CKEDITOR.dom.element(rows[i]),
                nextRow = new CKEDITOR.dom.element(rows[i + 1]),
                tablePos = table.getDocumentPosition(),
                rowPos = row.getDocumentPosition(),
                barTop, barBottom, barHeight;

            barTop = rowPos.y + row.$.offsetHeight - getBorderHeight(row, 'bottom');
            barBottom = nextRow.getDocumentPosition().y + getBorderHeight(nextRow, 'top');
            barHeight = Math.max(barBottom - barTop, 3);

            bars.push({
                table: table,
                index: i,
                x: tablePos.x,
                y: barTop,
                width: table.$.offsetWidth,
                height: barHeight,
                rowAbove: row,
                rowBelow: nextRow
            });
        }
        return bars;
    }

    function getBarAtPosition(bars, position) {
        for (var i = 0, len = bars.length; i < len; i++) {
            var bar = bars[i];
            if (position.x >= bar.x && position.x <= (bar.x + bar.width) &&
                position.y >= bar.y && position.y <= (bar.y + bar.height)) {
                return bar;
            }
        }
        return null;
    }

    function cancel(evt) {
        (evt.data || evt).preventDefault();
    }

    function rowResizer(editor) {
        var bar, document, resizer, isResizing, startOffset, currentShift, move;
        var topShiftBoundary, bottomShiftBoundary;

        function detach() {
            bar = null;
            currentShift = 0;
            isResizing = 0;

            document.removeListener('mouseup', onMouseUp);
            resizer.removeListener('mousedown', onMouseDown);
            resizer.removeListener('mousemove', onMouseMove);

            document.getBody().setStyle('cursor', 'auto');
            resizer.hide();
        }

        function resizeStart() {
            var minHeight = 10;
            topShiftBoundary = bar.y - (getHeight(bar.rowAbove) - minHeight);
            bottomShiftBoundary = bar.y + (getHeight(bar.rowBelow) - minHeight);

            resizer.setOpacity(0.5);
            startOffset = parseInt(resizer.getStyle('top'), 10);
            currentShift = 0;
            isResizing = 1;

            resizer.on('mousemove', onMouseMove);
            document.on('dragstart', cancel);
        }

        function resizeEnd() {
            isResizing = 0;
            resizer.setOpacity(0);

            if (currentShift) {
                resizeRow();
            }

            var table = bar.table;
            setTimeout(function() {
                table.removeCustomData('_cke_table_row_bars');
            }, 0);

            document.removeListener('dragstart', cancel);
        }

        function resizeRow() {
            var aboveHeight = getHeight(bar.rowAbove) + currentShift,
                belowHeight = getHeight(bar.rowBelow) - currentShift;

            var aboveCells = bar.rowAbove.$.cells;
            for (var i = 0; i < aboveCells.length; i++) {
                new CKEDITOR.dom.element(aboveCells[i]).setStyle('height', pxUnit(Math.max(aboveHeight, 10)));
            }

            var belowCells = bar.rowBelow.$.cells;
            for (var j = 0; j < belowCells.length; j++) {
                new CKEDITOR.dom.element(belowCells[j]).setStyle('height', pxUnit(Math.max(belowHeight, 10)));
            }

            editor.fire('saveSnapshot');
        }

        function onMouseDown(evt) {
            cancel(evt);
            editor.fire('saveSnapshot');
            resizeStart();
            document.on('mouseup', onMouseUp, this);
        }

        function onMouseUp(evt) {
            evt.removeListener();
            resizeEnd();
        }

        function onMouseMove(evt) {
            move(evt.data.getPageOffset().x, evt.data.getPageOffset().y);
        }

        document = editor.document;

        resizer = CKEDITOR.dom.element.createFromHtml('<div data-cke-temp=1 contenteditable=false unselectable=on ' +
            'style="position:absolute;cursor:row-resize;filter:alpha(opacity=0);opacity:0;' +
            'padding:0;background-color:#004;background-image:none;border:0px none;z-index:10"></div>', document);

        editor.on('destroy', function() {
            resizer.remove();
        });

        document.getDocumentElement().append(resizer);

        this.attachTo = function(targetBar) {
            if (isResizing)
                return;

            bar = targetBar;

            resizer.setStyles({
                width: pxUnit(targetBar.width),
                height: pxUnit(targetBar.height),
                left: pxUnit(targetBar.x),
                top: pxUnit(targetBar.y)
            });

            resizer.on('mousedown', onMouseDown, this);
            document.getBody().setStyle('cursor', 'row-resize');
            resizer.show();
        };

        move = this.move = function(posX, posY) {
            if (!bar)
                return 0;

            if (!isResizing &&
                !(posX >= bar.x && posX <= (bar.x + bar.width) &&
                  posY >= bar.y && posY <= (bar.y + bar.height))) {
                detach();
                return 0;
            }

            var resizerNewPosition = posY - Math.round(resizer.$.offsetHeight / 2);

            if (isResizing) {
                if (resizerNewPosition == topShiftBoundary || resizerNewPosition == bottomShiftBoundary)
                    return 1;

                resizerNewPosition = Math.max(resizerNewPosition, topShiftBoundary);
                resizerNewPosition = Math.min(resizerNewPosition, bottomShiftBoundary);

                currentShift = resizerNewPosition - startOffset;
            }

            resizer.setStyle('top', pxUnit(resizerNewPosition));
            return 1;
        };
    }

    function clearRowBarsCache(evt) {
        var target = evt.data.getTarget();

        if (evt.name == 'mouseout') {
            if (!target.is('table'))
                return;

            var dest = new CKEDITOR.dom.element(evt.data.$.relatedTarget || evt.data.$.toElement);
            while (dest && dest.$ && !dest.equals(target) && !dest.is('body'))
                dest = dest.getParent();
            if (!dest || dest.equals(target))
                return;
        }

        target.getAscendant('table', 1).removeCustomData('_cke_table_row_bars');
        evt.removeListener();
    }

    var pluginDefinition = {
        init: function init(editor) {
            editor.on('contentDom', function() {
                var resizer,
                    editable = editor.editable();

                editable.attachListener(editable.isInline() ? editable : editor.document, 'mousemove', function(evt) {
                    evt = evt.data;

                    var target = evt.getTarget();

                    if (target.type != CKEDITOR.NODE_ELEMENT)
                        return;

                    var page = {
                        x: evt.getPageOffset().x,
                        y: evt.getPageOffset().y
                    };

                    if (resizer && resizer.move(page.x, page.y)) {
                        cancel(evt);
                        return;
                    }

                    var table, bars;

                    if (!target.is('table') && !target.getAscendant({ thead: 1, tbody: 1, tfoot: 1 }, 1)) {
                        return;
                    }

                    table = target.getAscendant('table', 1);

                    if (!editor.editable().contains(table)) {
                        return;
                    }

                    if (!(bars = table.getCustomData('_cke_table_row_bars'))) {
                        table.setCustomData('_cke_table_row_bars', (bars = buildTableRowBars(table)));
                        table.on('mouseout', clearRowBarsCache);
                        table.on('mousedown', clearRowBarsCache);
                    }

                    var bar = getBarAtPosition(bars, page);
                    if (bar) {
                        !resizer && (resizer = new rowResizer(editor));
                        resizer.attachTo(bar);
                    }
                });
            });
        }
    };

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var pluginModule = {
        name: pluginName
    };

    return pluginModule;
});

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
/**
 * @fileOverview Handles the tables. It uses the transformer 'leosTableTransformer' more information could be found here 
 * https://webgate.ec.europa.eu/CITnet/confluence/display/LEOS/Annex+Mappings  
 */
; // jshint ignore:line
define(function leosTablePluginModule(require) {
    'use strict';

    // load module dependencies
    var pluginTools = require('plugins/pluginTools');
    var leosPluginUtils = require("plugins/leosPluginUtils");
    var leosTableTransformerStamp = require('plugins/leosTableTransformer/leosTableTransformer');
    var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");
    var leosCommandStateHandler = require("plugins/leosCommandStateHandler/leosCommandStateHandler");
    var $ = require('jquery');

    var pluginName = 'leosTable';
    var DELETE_KEY = 46;
    var BACKSPACE_KEY = 8;
    var ENTER_KEY = 13;
    var SHIFT_ENTER = CKEDITOR.SHIFT + ENTER_KEY;
    var HTML_CAPTION = "caption";
    var HTML_TABLE = "table";
    var changeStateElements = {
        articleHeading : {
            elementName: 'h2',
            selector: '[data-akn-name=aknHeading]'
        },
        caption: {
            elementName: 'caption',
            selector: null
        },
        crossHeading: {
            elementName: 'p',
            selector: '[data-akn-name=crossHeading]'
        },
        table: {
            elementName: 'table',
            selector: null
        }
    };

    var pluginDefinition = {
        init : function init(editor) {
            //To hide table 'Alignment', 'Width', 'Height', 'Border Size', 'Cell Spacing' , 'Cell Padding' and 'Summary' combo/edit boxes in the dialog box
            editor.on('dialogShow', function(event) {
                var dialog = event.data;
                if (dialog.getName() === 'table' || dialog.getName() === 'tableProperties') {
                    dialog.getContentElement('info', 'txtWidth').setValue('90%')
                    var items = ['cmbAlign', 'txtWidth', 'txtHeight', 'txtBorder', 'txtCellSpace', 'txtCellPad', 'txtSummary', 'txtCaption'];
                    items.forEach( function(item) {
                        dialog.getContentElement('info', item).getElement().hide();
                    });
                    dialog.resize(310,150);
                }
            });

            //To remove the cell insert, delete and properties menu items from the table tools menu
            editor.on('instanceReady', function(ck) { 
                ck.editor.removeMenuItem('tablecell_insertBefore'); 
                ck.editor.removeMenuItem('tablecell_insertAfter'); 
                ck.editor.removeMenuItem('tablecell_delete'); 
                ck.editor.removeMenuItem('tablecell_properties');
                var tableDeleteCmd = ck.editor.getCommand('tableDelete');
                if (tableDeleteCmd) {
                    tableDeleteCmd.exec = _tableDelete.bind(undefined, ck.editor);
                }

                if (ck.editor.contextMenu) {
                    ck.editor.contextMenu.addListener(function(element) {
                        if (element && element.getAscendant('table', true) && (element.getAscendant('table', true).getAttribute('leos:deletable') === 'false' || element.getAscendant('table', true).getAttribute('leos:predefinedTable') ==="true")){
                            ck.editor.contextMenu.items.map(function(item) {
                                if(item.command === 'tableDelete'){
                                    item.state = CKEDITOR.TRISTATE_DISABLED;
                                }
                                return item;
                            });
                        }
                    });
                }
            });
            editor.on('selectionChange', _onSelectionChange);
            editor.on("toHtml", _removeEmptyTableHeading, null, null, 15);

            editor.on( 'insertElement', _onInsertElement, this, null, 1 );
            editor.on( 'afterCommandExec' , _checkEmptyCKEditor, null, null, 100);
            editor.on( 'beforeCommandExec' , _mergeCellsFunctionality, null, null, 1);
            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : ENTER_KEY,
                action : _onEnterKey
            });
    
            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : SHIFT_ENTER,
                action : _onShiftEnterKey
            });

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : BACKSPACE_KEY,
                action : _handleTableRemoval
            });

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : DELETE_KEY,
                action : _handleTableRemoval
            });

            // Prevent typing outside table (only in table-only mode)
            editor.on('key', function(evt) {
                if (!editor.config.tableOnlyMode) return;

                var selection = evt.editor.getSelection();
                if (!selection) return;

                var startElement = selection.getStartElement();
                var isInTable = startElement && startElement.getAscendant('table', true) !== null;

                if (!isInTable) {
                    evt.cancel();
                }
            });
        }
    };

    function _checkEmptyCKEditor(evt) {
        const editor = evt.editor;

        const editable = editor.editable().find("[leos\\:editable='true']");
        const firstEditable = editable.getItem(0);

        if (!firstEditable
            || firstEditable.getChildCount() > 0
            || firstEditable.getAttribute(leosPluginUtils.DATA_AKN_NAME)?.toLowerCase()
                !== leosPluginUtils.BLOCKCONTAINER) {
            return;
        }

        const newParagraph = new CKEDITOR.dom.element('p');
        newParagraph.appendBogus();
        firstEditable.append(newParagraph);

        editor.getSelection().selectElement(newParagraph);

        editor.fire('saveSnapshot');
        editor.focus();
    }

    function _onInsertElement(event) {
        if(event.data.getName() === 'table'){
            var editor = event.editor;
            var range = editor.getSelection().getRanges()[0];
            if(range.collapsed){
                var container = range.startContainer;
                var parentElem = (container && container.type === CKEDITOR.NODE_TEXT) ? container.getParent() : container;
                var isParentUnnumberedParagraph  = parentElem && parentElem.getName() === 'li'
                   && parentElem.getAttribute('data-akn-element') === 'paragraph'
                   && parentElem.getAttribute('data-akn-num') === null;
                if(isParentUnnumberedParagraph){
                    // For annex and Revision there is no need to insert a new list;
                    // The application transforms by default, automatically, the new paragraph
                    var grandParentName = (parentElem.getParent().getName() == 'ol');
                    var grandParentAknName = parentElem.getParent().getAttribute("data-akn-name");
                    var isRightType = (grandParentName
                        && grandParentAknName !== 'aknAnnexList'
                        && grandParentAknName !== 'aknNumberedParagraphMandate');

                    if(isRightType){
                        var newElement = new CKEDITOR.dom.element(leosPluginUtils.HTML_POINT);
                        newElement.setAttribute(leosPluginUtils.DATA_AKN_NAME, leosPluginUtils.AKN_NUMBERED_PARAGRAPH);
                        newElement.setAttribute(leosPluginUtils.DATA_AKN_ELEMENT, leosPluginUtils.PARAGRAPH);
                        newElement.insertAfter(parentElem);
                        setToPosition(editor, newElement, CKEDITOR.POSITION_AFTER_START);
                    }
                } else if (leosPluginUtils.isRecitalAA(parentElem)) {
                    if (parentElem.getName() === leosPluginUtils.ORDER_LIST_ELEMENT) {
                        parentElem = parentElem.getLast().getLast();
                    }
                    parentElem = parentElem.getAscendant(leosPluginUtils.DIV, true);
                    var newBlock = new CKEDITOR.dom.element(leosPluginUtils.DIV);
                    newBlock.setAttribute(leosPluginUtils.DATA_AKN_NAME, leosPluginUtils.SUBFLOW_NAME);
                    newBlock.setAttribute(leosPluginUtils.DATA_AKN_HCONTAINER, leosPluginUtils.HCONTAINER_TABLE);
                    newBlock.setAttribute(leosPluginUtils.DATA_AKN_SUB_HCONTAINER, leosPluginUtils.SUB_HCONTAINER_TABLE);
                    newBlock.insertAfter(parentElem);
                    setToPosition(editor, newBlock, CKEDITOR.POSITION_AFTER_START);
                }
            }
            setTimeout(function() {
                var el = event.data;
                var next = el.getNext();
                if (next && next.is('p') && !next.getText().replace(/&nbsp;|\s|<br\s*\/?>/gi, '').length) {
                    next.remove();
                }
            }, 0);

        }
    }

    function setToPosition(editor, element, position) {
        if ((element !== null) && (element.type !== null)) {
            var range = editor.createRange();
            range.moveToPosition(element, position);
            range.select();
        }
    }

    function addParagraphForEmptyEditor(editor, removedElement, range) {
        var newParagraph = editor.document.createElement('p');
        newParagraph.insertBefore(removedElement);
        range.selectNodeContents(newParagraph);
        range.collapse(true);
        editor.getSelection().selectRanges([range]);
        editor.focus();
    }

    function _handleTableRemoval(context) {
        const editor = context.event.editor;
        const firstElement = editor.elementPath().elements[0];

        if (!firstElement || firstElement.type !== Node.ELEMENT_NODE) return;

        const cancelAndEnable = () => {
            context.event.cancel();
            editor.commands.inlinesave.enable();
            editor.commands.inlinesaveclose.enable();
        };

        if (firstElement.getName() === 'table') {
            if(firstElement.getAttribute("leos:predefinedtable") === 'true'
                    && editor.LEOS.type === 'stat_digit_financ_legis'){
                cancelAndEnable();
                return;
            }
            if(firstElement.getParent().getAttribute("data-akn-attr-editable") === "true"
                && firstElement.getParent().getChildCount() ===1){
                const range = editor.createRange();
                addParagraphForEmptyEditor(editor, firstElement, range);
            }
            firstElement.remove();
            cancelAndEnable();
            return;
        }
        if (firstElement.getName() === 'li') {
            const children = firstElement.getChildren();
            if (children.count() === 1) {
                const child = children.getItem(0);
                if (child.type === Node.ELEMENT_NODE && child.getName() === 'table') {
                    if(child.getAttribute("leos:predefinedtable") === 'true'
                        && editor.LEOS.type === 'stat_digit_financ_legis'){
                        cancelAndEnable();
                        return;
                    }

                    if(firstElement.getAttribute("data-akn-attr-editable") === "true"){
                        const range = editor.createRange();
                        addParagraphForEmptyEditor(editor, child, range);
                    }
                    child.remove();
                    cancelAndEnable();
                    return;
                }
            }
        }
        const range = editor.getSelection().getRanges()[0];
        if (range.collapsed !== true && !isSelectionInsideSingleTableCell(editor) && !!firstElement.getAscendant('table')
                &&  firstElement.getAscendant('table').getAttribute("leos:predefinedtable") === 'true'
                && editor.LEOS.type === 'stat_digit_financ_legis'){
            cancelAndEnable();
            return;
        }
    }

    function isSelectionInsideSingleTableCell(editor) {
        var selection = editor.getSelection();
        if (!selection || selection.isFake) {
            return false;
        }

        var ranges = selection.getRanges();
        if (!ranges || ranges.length === 0) {
            return false;
        }

        // Most real-world selections have exactly one range
        // (multi-range happens mostly in Firefox with table row selections)
        var range = ranges[0];

        // Get deepest elements containing start & end
        var startNode = range.startContainer;
        if (startNode.type === CKEDITOR.NODE_TEXT) {
            startNode = startNode.getParent();
        }

        var endNode = range.endContainer;
        if (endNode.type === CKEDITOR.NODE_TEXT) {
            endNode = endNode.getParent();
        }

        // Find closest <td> or <th> ancestor for start and end
        var startCell = startNode.getAscendant(function(el) {
            return el && (typeof el.is === 'function') && (el.is('td') || el.is('th'));
        }, true);

        var endCell = endNode.getAscendant(function(el) {
            return !!el && (typeof el.is === 'function') && (el.is('td') || el.is('th'));
        }, true);

        // Both must exist and be exactly the same cell
        return !!(startCell && endCell && startCell.equals(endCell));
    }

    function _tableDelete(editor) {// This is a copy of ckeditor plugins/table/plugin.js 'tableDelete' exec command function and modified
        // to avoid remove 'li' parent table element (check parent condition, 'li' element was added)

        var path = editor.elementPath(),
            table = path.contains('table', 1);

        if (!table)
            return;

        // If the table's parent has only one child remove it as well (unless it's a table cell, li element or the editable element)
        //(https://dev.ckeditor.com/ticket/5416, https://dev.ckeditor.com/ticket/6289, https://dev.ckeditor.com/ticket/12110)
        var parent = table.getParent(),
            editable = editor.editable();

        // Check if table is the only element in the editor (ignoring whitespace nodes)
        var isOnlyElement = editable.getChildCount() === 1 ||
                (
                    (editable.getFirst().is('table') &&
                        editable.getLast().type === CKEDITOR.NODE_TEXT &&
                        editable.getLast().getText().trim() === '') ||
                    (editable.getChild(1).equals(parent) && parent.getChildCount() === 1)
                );

        if (parent.getChildCount() == 1 && !parent.is('td', 'th', 'li') && !parent.equals(editable) && !isOnlyElement){
            table = parent;
        }

        var range = editor.createRange();

        if (isOnlyElement) {
            addParagraphForEmptyEditor(editor, table, range);
        } else {
            range.moveToPosition(table, CKEDITOR.POSITION_BEFORE_START);
        }
        table.remove();
        range.select();
    }

    function _onSelectionChange(event) {
        leosCommandStateHandler.changeCommandState(event.editor, 'table', changeStateElements);
    }

    function _removeEmptyTableHeading(event) {
        if (event.data.dataValue.includes("<thead></thead><tbody>")) {
            event.data.dataValue = event.data.dataValue.replace("<thead><\/thead><tbody>", "<tbody>");
        }
    }

    function _onEnterKey(context) {
        var selection = context.event.editor.getSelection();
        if (!selection) return;
        if (selection.getType() !== CKEDITOR.SELECTION_NONE) {
            var startElement = leosKeyHandler.getSelectedElement(selection);
            var currentElement = startElement.$;
            var elementName = currentElement.nodeName.toLowerCase();
            if (elementName === HTML_CAPTION) {
                context.event.cancel();
            }
        }
    }
    
    function _onShiftEnterKey(context) {
        var selection = context.event.editor.getSelection();
        if (!selection) return;
        if (selection.getType() !== CKEDITOR.SELECTION_NONE) {
            var startElement = leosKeyHandler.getSelectedElement(selection);
            var currentElement = startElement.$;
            if ($(currentElement).parents(HTML_TABLE).length) {
                context.event.cancel();
            }
        }
    }

    /*
    This code is adjusted and replicated from tabletools/plugin of ckeditor_4.12.1
    Purpose is to make sure that cells merge are working fine.
    With plugin code cell merge is incorrect or fails intermittently.
     */
    //merge cells functionality starts
    function _mergeCellsFunctionality(evt) {
        const editor = evt.editor;
        if (evt.data.name === 'cellMerge') {
            evt.data.cell = _mergeCells(editor.getSelection(), false);
            placeCursorInCell(evt.data.cell, true);
            if (editor.getCommand('inlinesave').state === CKEDITOR.TRISTATE_DISABLED) {
                editor.getCommand('inlinesave').setState(CKEDITOR.ON);
            }
            if (editor.getCommand('inlinesaveclose').state === CKEDITOR.TRISTATE_DISABLED) {
                editor.getCommand('inlinesaveclose').setState(CKEDITOR.ON);
            }
            evt.cancel();
        }
    }

    function placeCursorInCell( cell, placeAtEnd ) {
        var docInner = cell.getDocument(),
            docOuter = CKEDITOR.document;
        if ( CKEDITOR.env.ie && CKEDITOR.env.version == 10 ) {
            docOuter.focus();
            docInner.focus();
        }
        var range = new CKEDITOR.dom.range( docInner );
        if ( !range[ 'moveToElementEdit' + ( placeAtEnd ? 'End' : 'Start' ) ]( cell ) ) {
            range.selectNodeContents( cell );
            range.collapse( placeAtEnd ? false : true );
        }
        range.select( true );
    }

    function _mergeCells( selection, isDetect ) {
        var cells = getSelectedCells( selection );
        var commonAncestor;
        if (( commonAncestor = selection.getCommonAncestor() ) && commonAncestor.type == CKEDITOR.NODE_ELEMENT && commonAncestor.is( 'table' ) )
            return false;
        var cell,
            firstCell = cells[ 0 ],
            table = firstCell.getAscendant( 'table' ),
            map = CKEDITOR.tools.buildTableMap( table ),
            mapHeight = map.length,
            mapWidth = map[ 0 ].length,
            startRow = firstCell.getParent().$.rowIndex,
            startColumn = cellInRow( map, startRow, firstCell );

        var doc = firstCell.getDocument(),
            lastRowIndex = startRow,
            totalRowSpan = 0,
            totalColSpan = 0,
            frag = !isDetect && new CKEDITOR.dom.documentFragment( doc ),
            dimension = 0;

        for ( var i = 0; i < cells.length; i++ ) {
            cell = cells[ i ];

            var tr = cell.getParent(),
                cellFirstChild = cell.getFirst(),
                colSpan = cell.$.colSpan,
                rowSpan = cell.$.rowSpan,
                rowIndex = tr.$.rowIndex,
                colIndex = cellInRow( map, rowIndex, cell );
            dimension += colSpan * rowSpan;
            totalColSpan = Math.max( totalColSpan, colIndex - startColumn + colSpan );
            totalRowSpan = Math.max( totalRowSpan, rowIndex - startRow + rowSpan );
            if ( !isDetect ) {
                if ( trimCell( cell ), cell.getChildren().count() ) {
                    if ( rowIndex != lastRowIndex && cellFirstChild && !( cellFirstChild.isBlockBoundary && cellFirstChild.isBlockBoundary( { br: 1 } ) ) ) {
                        var last = frag.getLast( CKEDITOR.dom.walker.whitespaces( true ) );
                        if ( last && !( last.is && last.is( 'br' ) ) )
                            frag.append( 'br' );
                    }
                    cell.moveChildren( frag );
                }
                i ? cell.remove() : cell.setHtml( '' );
            }
            lastRowIndex = rowIndex;
        }
        if ( !isDetect ) {
            frag.moveChildren( firstCell );
            firstCell.appendBogus();
            if ( totalColSpan >= mapWidth )
                firstCell.removeAttribute( 'rowSpan' );
            else
                firstCell.$.rowSpan = totalRowSpan;
            if ( totalRowSpan >= mapHeight )
                firstCell.removeAttribute( 'colSpan' );
            else
                firstCell.$.colSpan = totalColSpan;
            var trs = new CKEDITOR.dom.nodeList( table.$.rows ),
                count = trs.count();

            for ( i = count - 1; i >= 0; i-- ) {
                var tailTr = trs.getItem( i );
                if ( !tailTr.$.cells.length ) {
                    tailTr.remove();
                    count++;
                    continue;
                }
            }
            return firstCell;
        }
        else {
            return ( totalRowSpan * totalColSpan ) == dimension;
        }
    }

    function getSelectedCells( selection, table ) {
        var retval = [],
            database = {};
        if ( !selection ) {
            return retval;
        }
        var ranges = selection.getRanges();

        function isInTable( cell ) {
            if ( !table ) {
                return true;
            }
            return table.contains( cell ) && cell.getAscendant( 'table', true ).equals( table );
        }

        function moveOutOfCellGuard( node ) {
            var cellNodeRegex = /^(?:td|th)$/;
            // Apply to the first cell only.
            if ( retval.length > 0 )
                return;
            if ( node.type == CKEDITOR.NODE_ELEMENT && cellNodeRegex.test( node.getName() ) && !node.getCustomData( 'selected_cell' ) ) {
                CKEDITOR.dom.element.setMarker( database, node, 'selected_cell', true );
                retval.push( node );
            }
        }

        for ( var i = 0; i < ranges.length; i++ ) {
            var range = ranges[ i ];
            if ( range.collapsed ) {
                // Walker does not handle collapsed ranges yet - fall back to old API.
                var startNode = range.getCommonAncestor();
                var nearestCell = startNode.getAscendant( { td: 1, th: 1 }, true );
                if ( nearestCell && isInTable( nearestCell ) ) {
                    retval.push( nearestCell );
                }
            } else {
                var walker = new CKEDITOR.dom.walker( range );
                var node;
                walker.guard = moveOutOfCellGuard;
                while ( ( node = walker.next() ) ) {
                    if ( node.type != CKEDITOR.NODE_ELEMENT || !node.is( CKEDITOR.dtd.table ) ) {
                        var parent = node.getAscendant( { td: 1, th: 1 }, true );
                        if ( parent && !parent.getCustomData( 'selected_cell' ) && isInTable( parent ) ) {
                            CKEDITOR.dom.element.setMarker( database, parent, 'selected_cell', true );
                            retval.push( parent );
                        }
                    }
                }
            }
        }
        CKEDITOR.dom.element.clearAllMarkers( database );
        return retval;
    }

    function cellInRow( tableMap, rowIndex, cell ) {
        var oRow = tableMap[ rowIndex ];
        if ( typeof cell == 'undefined' )
            return oRow;
        for ( var c = 0; oRow && c < oRow.length; c++ ) {
            if ( cell.is && oRow[ c ] == cell.$ )
                return c;
            else if ( c == cell )
                return new CKEDITOR.dom.element( oRow[ c ] );
        }
        return cell.is ? -1 : null;
    }

    function trimCell( cell ) {
        var bogus = cell.getBogus();
        bogus && bogus.remove();
        cell.trim();
    }
    //merge cells functionality end

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var leosTableTransformer = leosTableTransformerStamp({
        tableTransformationConfig: {
            akn : 'table',
            html : 'table',
            attr : [ {
                akn : 'xml:id',
                html : 'id',
            }, {
                akn : "leos:origin",
                html : "data-origin"
            }, {
                akn : 'border',
                html : 'border',
            }, {
                akn : 'cellpadding',
                html : 'cellpadding'
            }, {
                akn : 'cellspacing',
                html : 'cellspacing'
            }, {
                akn : 'style',
                html : 'style'
            }, {
                akn : 'summary',
                html : 'summary'
            }, {
                akn : "leos:editable",
                html : "contenteditable",
            }, {
                akn : "leos:deletable",
                html : "leos:deletable"
            }, {
                akn : "leos:predefinedtable",
                html : "leos:predefinedtable"
            }, {
                akn : "leos:tableonlymode",
                html : "leos:tableonlymode"
            }, {
                html : 'data-akn-name=leosTable'
            }],
            sub : {
                akn : 'tr',
                html : 'tr',
                attr : [{
                    akn : 'xml:id',
                    html : 'id',
                },{
                    akn : "leos:origin",
                    html : "data-origin"
                }, {
                    akn : "leos:editable",
                    html : "contenteditable",
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
                sub: {
                    akn : {
                        head: 'th',
                        body: 'td',
                    },
                    html : {
                        head: 'th',
                        body: 'td',
                    },
                    attr : [{
                        akn : 'rowspan',
                        html : 'rowspan',
                    }, {
                        akn : 'colspan',
                        html : 'colspan',
                    }, {
                        akn : 'style',
                        html : 'style',
                    },{
                        akn : 'xml:id',
                        html : 'id',
                    },{
                        akn : "leos:origin",
                        html : "data-origin"
                    }, {
                        akn : "leos:editable",
                        html : "contenteditable",
                    }, {
                        akn : 'class',
                        html : 'class'
                    },{
                        akn: "leos:action",
                        html : "data-akn-action"
                    }, {
                        akn : "leos:uid",
                        html : "data-akn-uid"
                    }, {
                        akn : "leos:title",
                        html : "title"
                    }]
                }
            }
        }
    });
    
    var transformationConfig = leosTableTransformer.getTransformationConfig();

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    // return plugin module
    var pluginModule = {
        name : pluginName,
        transformationConfig : transformationConfig
    };

    return pluginModule;
});
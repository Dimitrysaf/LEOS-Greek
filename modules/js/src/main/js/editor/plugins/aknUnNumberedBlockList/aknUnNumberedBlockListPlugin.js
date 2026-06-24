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
define(function aknUnNumberedBlockListPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var $ = require('jquery');
    var blockListTransformerStamp = require("plugins/leosBlockListTransformer/blockListTransformer");
    var identityHandler = require("plugins/leosAttrHandler/leosIdentityHandlerModule");
    var pluginName = "aknUnNumberedBlockList";
    var leosTrackChanges = require("plugins/leosTrackChanges/leosTrackChanges");
    var numberModule = require("plugins/leosNumber/listItemNumberModule");
    var unumberModule = require("plugins/leosUnumber/listUnumberModule");
    var leosPluginUtils = require("plugins/leosPluginUtils");
    var LOG = require("logger");
    var ORDERED_LIST_SELECTOR = "ul[data-akn-name='UnNumberedBlockList']";
    var config = { attributes: false, childList: true, subtree: true };
    var listNodeNames = { ol: 1, ul: 1 };

    var whitespaces = CKEDITOR.dom.walker.whitespaces(),
        bookmarks = CKEDITOR.dom.walker.bookmark(),
        nonEmpty = function( node ) {
            return !( whitespaces( node ) || bookmarks( node ) );
        },
        blockBogus = CKEDITOR.dom.walker.bogus();

    var pluginDefinition = {
        init : function init(editor) {
            $(editor.element.$).on("keyup mouseup", null, [editor], _handleClickEvent);
            numberModule.init(editor);
            unumberModule.init(editor);
            editor.on( 'key', function( evt ) {
                // Use getKey directly in order to ignore modifiers.
                // Justification: https://dev.ckeditor.com/ticket/11861#comment:13
                var key = evt.data.domEvent.getKey(), li;

                // DEl/BACKSPACE
                if ( editor.mode == 'wysiwyg' && key in { 8: 1, 46: 1 } ) {
                    var sel = editor.getSelection(),
                        range = sel.getRanges()[ 0 ],
                        path = range && range.startPath();

                    if ( !range || !range.collapsed )
                        return;

                    var isBackspace = key == 8;
                    var editable = editor.editable();
                    var walker = new CKEDITOR.dom.walker( range.clone() );
                    walker.evaluator = function( node ) {
                        return nonEmpty( node ) && !blockBogus( node );
                    };
                    // Backspace/Del behavior at the start/end of table is handled in core.
                    walker.guard = function( node, isOut ) {
                        return !( isOut && node.type == CKEDITOR.NODE_ELEMENT && node.is( 'table' ) );
                    };

                    var cursor = range.clone();

                    if ( isBackspace ) {
                        var previous, joinWith;

                        // Join a sub list's first line, with the previous visual line in parent.
                        if (
                            ( previous = path.contains( listNodeNames ) ) &&
                            range.checkBoundaryOfElement( previous, CKEDITOR.START ) &&
                            ( previous = previous.getParent() ) && previous.is( 'li' ) &&
                            ( previous = getSubList( previous ) )
                        ) {
                            joinWith = previous;
                            previous = previous.getPrevious( nonEmpty );
                            // Place cursor before the nested list.
                            cursor.moveToPosition(
                                previous && blockBogus( previous ) ? previous : joinWith,
                                CKEDITOR.POSITION_BEFORE_START );
                        }
                        // Join any line following a list, with the last visual line of the list.
                        else {
                            walker.range.setStartAt( editable, CKEDITOR.POSITION_AFTER_START );
                            walker.range.setEnd( range.startContainer, range.startOffset );

                            previous = walker.previous();

                            if (
                                previous && previous.type == CKEDITOR.NODE_ELEMENT &&
                                ( previous.getName() in listNodeNames ||
                                    previous.is( 'li' ) || previous.is( 'p' ) )
                            ) {
                                if ( !(previous.is( 'li' ) || previous.is( 'p' )) ) {
                                    walker.range.selectNodeContents( previous );
                                    walker.reset();
                                    walker.evaluator = isTextBlock;
                                    previous = walker.previous();
                                }

                                joinWith = previous;
                                // Place cursor at the end of previous block.
                                cursor.moveToElementEditEnd( joinWith );

                                // And then just before end of closest block element (https://dev.ckeditor.com/ticket/12729).
                                cursor.moveToPosition( cursor.endPath().block, CKEDITOR.POSITION_BEFORE_END );
                            }
                        }

                        if ( joinWith ) {
                            if (editor.LEOS.isTrackChangesEnabled) {
                                var isNewTrackChangeNumber = leosTrackChanges.core.isNewTrackChangeNumber(range);
                                var isNewTrackChangeEnter = leosTrackChanges.core.isNewTrackChangeEnter(range);
                                if (!isNewTrackChangeNumber && !isNewTrackChangeEnter && (!range.startContainer.$.attributes || !(range.startContainer.$.attributes['data-akn-empty'] || range.startContainer.$.attributes['data-reject-inserted-enter']))) {
                                    editor.fire("handleTrackTraceForEnterDeleted", range);
                                    evt.cancel();
                                    return;
                                }
                            }
                            joinNextLineToCursor( editor, cursor, range );
                            evt.cancel();
                        }
                        else {
                            var list = path.contains( listNodeNames );
                            // Backspace pressed at the start of list outdents the first list item. (https://dev.ckeditor.com/ticket/9129)
                            if ( list && range.checkBoundaryOfElement( list, CKEDITOR.START ) ) {
                                li = list.getFirst( nonEmpty );

                                if ( range.checkBoundaryOfElement( li, CKEDITOR.START ) ) {
                                    previous = list.getPrevious( nonEmpty );

                                    // Only if the list item contains a sub list, do nothing but
                                    // simply move cursor backward one character.
                                    if ( getSubList( li ) ) {
                                        if ( previous ) {
                                            range.moveToElementEditEnd( previous );
                                            range.select();
                                        }

                                        evt.cancel();
                                    }
                                    else {
                                        editor.execCommand( 'outdent' );
                                        evt.cancel();
                                    }
                                }
                            }
                        }

                    } else {
                        var next, nextLine;

                        li = path.contains( 'li' );

                        if ( li ) {
                            walker.range.setEndAt( editable, CKEDITOR.POSITION_BEFORE_END );

                            var last = li.getLast( nonEmpty );
                            var block = last && isTextBlock( last ) ? last : li;

                            // Indicate cursor at the visual end of an list item.
                            var isAtEnd = 0;

                            next = walker.next();

                            // When list item contains a sub list.
                            if (
                                next && next.type == CKEDITOR.NODE_ELEMENT &&
                                next.getName() in listNodeNames &&
                                next.equals( last )
                            ) {
                                isAtEnd = 1;

                                // Move to the first item in sub list.
                                next = walker.next();
                            }
                            // Right at the end of list item.
                            else if ( range.checkBoundaryOfElement( block, CKEDITOR.END ) ) {
                                isAtEnd = 2;
                            }

                            if ( isAtEnd && next ) {
                                // Put cursor range there.
                                nextLine = range.clone();
                                nextLine.moveToElementEditStart( next );

                                // https://dev.ckeditor.com/ticket/13409
                                // For the following case and similar
                                //
                                // <ul>
                                // 	<li>
                                // 		<p><a href="#one"><em>x^</em></a></p>
                                // 		<ul>
                                // 			<li><span>y</span></li>
                                // 		</ul>
                                // 	</li>
                                // </ul>
                                if ( isAtEnd == 1 ) {
                                    // Move the cursor to <em> if attached to "x" text node.
                                    cursor.optimize();

                                    // Abort if the range is attached directly in <li>, like
                                    //
                                    // <ul>
                                    // 	<li>
                                    // 		x^
                                    // 		<ul>
                                    // 			<li><span>y</span></li>
                                    // 		</ul>
                                    // 	</li>
                                    // </ul>
                                    if ( !cursor.startContainer.equals( li ) ) {
                                        var node = cursor.startContainer,
                                            farthestInlineAscendant;

                                        // Find <a>, which is farthest from <em> but still inline element.
                                        while ( node.is( CKEDITOR.dtd.$inline ) ) {
                                            farthestInlineAscendant = node;
                                            node = node.getParent();
                                        }

                                        // Move the range so it does not contain inline elements.
                                        // It prevents <span> from being included in <em>.
                                        //
                                        // <ul>
                                        // 	<li>
                                        // 		<p><a href="#one"><em>x</em></a>^</p>
                                        // 		<ul>
                                        // 			<li><span>y</span></li>
                                        // 		</ul>
                                        // 	</li>
                                        // </ul>
                                        //
                                        // so instead of
                                        //
                                        // <ul>
                                        // 	<li>
                                        // 		<p><a href="#one"><em>x^<span>y</span></em></a></p>
                                        // 	</li>
                                        // </ul>
                                        //
                                        // pressing DELETE produces
                                        //
                                        // <ul>
                                        // 	<li>
                                        // 		<p><a href="#one"><em>x</em></a>^<span>y</span></p>
                                        // 	</li>
                                        // </ul>
                                        if ( farthestInlineAscendant ) {
                                            cursor.moveToPosition( farthestInlineAscendant, CKEDITOR.POSITION_AFTER_END );
                                        }
                                    }
                                }

                                // Moving `cursor` and `next line` only when at the end literally (https://dev.ckeditor.com/ticket/12729).
                                if ( isAtEnd == 2 ) {
                                    cursor.moveToPosition( cursor.endPath().block, CKEDITOR.POSITION_BEFORE_END );

                                    // Next line might be text node not wrapped in block element.
                                    if ( nextLine.endPath().block ) {
                                        nextLine.moveToPosition( nextLine.endPath().block, CKEDITOR.POSITION_AFTER_START );
                                    }
                                }

                                if (editor.LEOS.isTrackChangesEnabled) {
                                    var isNewTrackChangeNumber = leosTrackChanges.core.isNewTrackChangeNumber(nextLine);
                                    var isNewTrackChangeEnter = leosTrackChanges.core.isNewTrackChangeEnter(nextLine);
                                    if (!isNewTrackChangeNumber && !isNewTrackChangeEnter && (!range.startContainer.$.attributes || !(range.startContainer.$.attributes['data-akn-empty'] || range.startContainer.$.attributes['data-reject-inserted-enter']))) {
                                        editor.fire("handleTrackTraceForEnterDeleted", nextLine);
                                        evt.cancel();
                                        return;
                                    }
                                }

                                joinNextLineToCursor( editor, cursor, nextLine );
                                evt.cancel();
                            }
                        } else {
                            // Handle Del key pressed before the list.
                            walker.range.setEndAt( editable, CKEDITOR.POSITION_BEFORE_END );
                            next = walker.next();

                            if ( next && next.type == CKEDITOR.NODE_ELEMENT && next.is( listNodeNames ) ) {
                                // The start <li>
                                next = next.getFirst( nonEmpty );

                                // Simply remove the current empty block, move cursor to the
                                // subsequent list.
                                if ( path.block && range.checkStartOfBlock() && range.checkEndOfBlock() ) {
                                    path.block.remove();
                                    range.moveToElementEditStart( next );
                                    range.select();
                                    evt.cancel();
                                }
                                    // Preventing the default (merge behavior), but simply move
                                    // the cursor one character forward if subsequent list item
                                // contains sub list.
                                else if ( getSubList( next )  ) {
                                    range.moveToElementEditStart( next );
                                    range.select();
                                    evt.cancel();
                                }
                                // Merge the first list item with the current line.
                                else {
                                    nextLine = range.clone();
                                    nextLine.moveToElementEditStart( next );
                                    joinNextLineToCursor( editor, cursor, nextLine );
                                    evt.cancel();
                                }
                            }
                        }

                    }

                    // The backspace/del could potentially put cursor at a bad position,
                    // being it handled or not, check immediately the selection to have it fixed.
                    setTimeout( function() {
                        editor.selectionChange( 1 );
                    } );
                }
            }, null, null, 8 );

            // editor.on("key", function(event) {
            //     var key = event.data.domEvent.getKey();
            //     var keys = new Set([8, 46]);
            //     // DEL/BACKSPACE
            //     if (editor.mode === "wysiwyg" && keys.has(key)) {
            //         console.log("TEST");
            //     }
            // }, null, null, 8 );

            //Go through ul elements to set "data-akn-name" attribute and through ascendant li elements to set "data-akn-num" attributes.
            editor.on("change", function(event) {
                _startObservingAllLists(event);
                if (event.editor.checkDirty()) {
                    event.editor.fire( 'lockSnapshot' );
                    var jqEditor = $(event.editor.editable().$);
                    var uls = jqEditor.find("ul");
                    for (var i=0; i<uls.length; i++) {
                        var idAttrValue = uls[i].getAttribute("id");
                        if (idAttrValue && $('[id="' + idAttrValue + '"]').length > 1) {
                            idAttrValue = identityHandler.generateId();
                            uls[i].setAttribute("id", idAttrValue);
                        }
                        uls[i].setAttribute("data-akn-name","UnNumberedBlockList");
                        var listItems = uls[i].children;
                        for (var jj = 0; jj < listItems.length; jj++) {
                            idAttrValue = listItems[jj].getAttribute("id");
                            if (idAttrValue && $('[id="' + idAttrValue + '"]').length > 1) {
                                idAttrValue = identityHandler.generateId();
                                listItems[jj].setAttribute("id", idAttrValue);
                            }
                            idAttrValue = listItems[jj].getAttribute("data-akn-num-id");
                            if (idAttrValue && $('[data-akn-num-id="' + idAttrValue + '"]').length > 1) {
                                idAttrValue = identityHandler.generateId();
                                listItems[jj].setAttribute("data-akn-num-id", idAttrValue);
                            }

                            var previousNumber = listItems[jj].getAttribute("data-akn-num");
                            listItems[jj].setAttribute("data-akn-num","•");
                            listItems[jj].removeAttribute("data-akn-name");
                            listItems[jj].removeAttribute("style");
                            if (event.editor.LEOS.isTrackChangesEnabled) {
                                event.editor.fire("handleTcIndent", { data: listItems[jj], previousNumber: previousNumber } );
                            }
                        }
                    }
                    event.editor.fire( 'unlockSnapshot' );
                }
            });
            editor.on('selectionChange', leosPluginUtils.disableListForTableInsideBlockContainer);
        }
    };
    function _startObservingAllLists(event){
        var editor = event.editor;
        if(editor.editable && editor.editable().getChildren && editor.editable().getChildren().count() > 0){
            _addMutationObserverToLists(editor.editable().find(ORDERED_LIST_SELECTOR).$)
        }
    }
    function _addMutationObserverToLists(listsNodeList){
        for (var i = 0; i < listsNodeList.length; i++){
            var list = listsNodeList[i];
            if (!list.listMutationObserver){
                list.listMutationObserver = new MutationObserver(_processMutations);
                list.listMutationObserver.observe(list, config);
            }
            unumberModule.resetElementAttributeOnIndents(list);
            unumberModule.checkListsWithOnlyCrossheadings(list);
        }
    }
    function _processMutations(mutationsList) {
        var mutations = _getMutations(mutationsList);
        leosPluginUtils.popSingleSubElement(mutations.singleSubPoints);
        leosPluginUtils.popNotInlineSubElement(mutations.notInlineElements);
    }
    function _getMutations(mutationsList){
        var listsWithoutIntro = []; // OLs without an intro
        var isListPushed = {};      // already processed OLs
        var singleSubPoints = [];   // single SubPoints
        var isSubPointPushed = {};  // already processed SubPoints
        var notInlineElements = [];
        var isNotInlinePushed = {};
        for(var i = 0; i < mutationsList.length; i++){
            _pushMutations(mutationsList[i].target, listsWithoutIntro, isListPushed, singleSubPoints, isSubPointPushed, notInlineElements, isNotInlinePushed);
        }
        return {listsWithoutIntro: listsWithoutIntro,
            singleSubPoints: singleSubPoints,
            notInlineElements: notInlineElements};
    }
    function _pushMutations(node, listsWithoutIntro, isListPushed, singleSubPoints, isSubPointPushed, notInlineElements, isNotInlinePushed){
        for (var i = 0; i < node.childNodes.length; i++){
            var child = node.childNodes[i];
            if(child.childNodes.length > 0){
                _pushMutations(child, listsWithoutIntro, isListPushed, singleSubPoints, isSubPointPushed, notInlineElements, isNotInlinePushed);
            }
            _pushListsWithoutIntro(child, listsWithoutIntro, isListPushed);
            _pushSingleSubPoints(node, child, singleSubPoints, isSubPointPushed);
            leosPluginUtils.pushNotInlineElements(child, notInlineElements, isNotInlinePushed);
        }
        _pushListsWithoutIntro(node, listsWithoutIntro, isListPushed);
        leosPluginUtils.pushNotInlineElements(node, notInlineElements, isNotInlinePushed);
    }

    /**
     * Add "child" element into "listsWithoutIntro" if is not a correct OL structure.
     * Correct structure:
     * <li>
     *  <p> </p> (or Text node, or span tag)  //TODO consider avoiding anything rather than p, and normalize in a second moment with _appendAllPreviousTextNodes()
     *  <ol>
     *      <li></li>
     *      <li></li>
     *  </ol>
     * </li>
     *
     * @param child, OL to be processed
     * @param listsWithoutIntro, array where to add the OL in case is not a correct structure
     * @param isListPushed, array with already processed OLs
     */
    function _pushListsWithoutIntro(child, listsWithoutIntro, isListPushed){
        var hasNoIntro = leosPluginUtils.getElementName(child) === leosPluginUtils.ORDER_LIST_ELEMENT
            && (!child.previousSibling || leosPluginUtils.getElementName(child.previousSibling) !== leosPluginUtils.HTML_SUB_POINT)
            && (!child.firstChild || leosPluginUtils.getElementName(child.firstChild) !== leosPluginUtils.HTML_POINT);
        if(hasNoIntro && isListPushed[child] !== 1){
            isListPushed[child] = 1;
            listsWithoutIntro.push(child);
        }
    }

    /**
     * Add "child" element into "singleSubPoints" if is the only element inside a <li> node.
     * Example: Add <p> to "singleSubPoints" if the structure is as below:
     * <li>
     *     <p> </p>
     * </li>
     *
     * @param node, parent <li>
     * @param child, element <p>
     * @param singleSubPoints, single SubPoints which will be converted later into Points
     * @param isSubPointPushed, SubPoints already processed
     */
    function _pushSingleSubPoints(node, child, singleSubPoints, isSubPointPushed){
        var isSingleSubPoint = leosPluginUtils.getElementName(node) === leosPluginUtils.HTML_POINT && leosPluginUtils.getElementName(child) === leosPluginUtils.HTML_SUB_POINT
            && !child.previousSibling && !child.nextSibling;
        if(isSingleSubPoint){
            var subPoint = new CKEDITOR.dom.element(child);
            if(_getAscendantPoint(subPoint.getParent()) && isSubPointPushed[subPoint] !== 1){
                isSubPointPushed[subPoint] = 1;
                singleSubPoints.push(subPoint);
            }
        }
    }

    function _getAscendantPoint(element) {
        return element.getAscendant(leosPluginUtils.HTML_POINT);
    }

    function isTextBlock( node ) {
        return node.type == CKEDITOR.NODE_ELEMENT && ( node.getName() in CKEDITOR.dtd.$block || node.getName() in CKEDITOR.dtd.$listItem ) && CKEDITOR.dtd[ node.getName() ][ '#' ];
    }

    // Join visually two block lines.
    function joinNextLineToCursor( editor, cursor, nextCursor ) {
        editor.fire( 'saveSnapshot' );

        // Merge with previous block's content.
        nextCursor.enlarge( CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS );
        var frag = nextCursor.extractContents();

        cursor.trim( false, true );
        var bm = cursor.createBookmark();

        // Kill original bogus;
        var currentPath = new CKEDITOR.dom.elementPath( cursor.startContainer ),
            pathBlock = currentPath.block,
            currentBlock = currentPath.lastElement.getAscendant( 'li', 1 ) || pathBlock,
            nextPath = new CKEDITOR.dom.elementPath( nextCursor.startContainer ),
            nextLi = nextPath.contains( CKEDITOR.dtd.$listItem ),
            nextList = nextPath.contains( CKEDITOR.dtd.$list ),
            last;

        // Remove bogus node the current block/pseudo block.
        if ( pathBlock ) {
            var bogus = pathBlock.getBogus();
            bogus && bogus.remove();
        }
        else if ( nextList ) {
            last = nextList.getPrevious( nonEmpty );
            if ( last && blockBogus( last ) )
                last.remove();
        }

        // Kill the tail br in extracted.
        last = frag.getLast();
        if ( last && last.type == CKEDITOR.NODE_ELEMENT && last.is( 'br' ) )
            last.remove();

        // Insert fragment at the range position.
        var nextNode = cursor.startContainer.getChild( cursor.startOffset );
        if ( nextNode )
            frag.insertBefore( nextNode );
        else
            cursor.startContainer.append( frag );

        // Move the sub list nested in the next list item.
        if ( nextLi ) {
            var sublist = getSubList( nextLi );
            if ( sublist ) {
                // If next line is in the sub list of the current list item.
                if ( currentBlock.contains( nextLi ) ) {
                    mergeChildren( sublist, nextLi.getParent(), nextLi );
                    sublist.remove();
                }
                // Migrate the sub list to current list item.
                else {
                    currentBlock.append( sublist );
                }
            }
        }

        var nextBlock, parent;
        // Remove any remaining zombies path blocks at the end after line merged.
        while ( nextCursor.checkStartOfBlock() && nextCursor.checkEndOfBlock() ) {
            nextPath = nextCursor.startPath();
            nextBlock = nextPath.block;

            // Abort when nothing to be removed (https://dev.ckeditor.com/ticket/10890).
            if ( !nextBlock )
                break;

            // Check if also to remove empty list.
            if ( nextBlock.is( 'li' ) ) {
                parent = nextBlock.getParent();
                if ( nextBlock.equals( parent.getLast( nonEmpty ) ) && nextBlock.equals( parent.getFirst( nonEmpty ) ) )
                    nextBlock = parent;
            }

            nextCursor.moveToPosition( nextBlock, CKEDITOR.POSITION_BEFORE_START );
            nextBlock.remove();
        }

        // Check if need to further merge with the list resides after the merged block. (https://dev.ckeditor.com/ticket/9080)
        var walkerRng = nextCursor.clone(), editable = editor.editable();
        walkerRng.setEndAt( editable, CKEDITOR.POSITION_BEFORE_END );
        var walker = new CKEDITOR.dom.walker( walkerRng );
        walker.evaluator = function( node ) {
            return nonEmpty( node ) && !blockBogus( node );
        };
        var next = walker.next();
        if ( next && next.type == CKEDITOR.NODE_ELEMENT && next.getName() in CKEDITOR.dtd.$list )
            mergeListSiblings( next );
        bm.normalized = ( !!bm.normalized ? bm.normalized : true);
        cursor.moveToBookmark( bm );

        // Make fresh selection.
        cursor.select();

        editor.fire( 'saveSnapshot' );
    }

    function getSubList( li ) {
        var last = li.getLast( nonEmpty );
        return last && last.type == CKEDITOR.NODE_ELEMENT && last.getName() in listNodeNames ? last : null;
    }

    // Merge child nodes with direction preserved. (https://dev.ckeditor.com/ticket/7448)
    function mergeChildren( from, into, refNode, forward ) {
        var child, itemDir;
        while ( ( child = from[ forward ? 'getLast' : 'getFirst' ]( elementType ) ) ) {
            if ( ( itemDir = child.getDirection( 1 ) ) !== into.getDirection( 1 ) )
                child.setAttribute( 'dir', itemDir );

            child.remove();

            refNode ? child[ forward ? 'insertBefore' : 'insertAfter' ]( refNode ) : into.append( child, forward );
            refNode = child;
        }
    }

    // Merge list adjacent, of same type lists.
    function mergeListSiblings( listNode ) {

        function mergeSibling( rtl ) {
            var sibling = listNode[ rtl ? 'getPrevious' : 'getNext' ]( nonEmpty );
            if ( sibling && sibling.type == CKEDITOR.NODE_ELEMENT && sibling.is( listNode.getName() ) ) {
                // Move children order by merge direction.(https://dev.ckeditor.com/ticket/3820)
                mergeChildren( listNode, sibling, null, !rtl );

                listNode.remove();
                listNode = sibling;
            }
        }

        mergeSibling();
        mergeSibling( 1 );
    }

    var _handleClickEvent = function _handleClickEvent(event) {
        var range = event.data[0].getSelection().getRanges()[0];
        if(range.collapsed) {
            range.checkEndOfBlock(true);
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);
    var BLOCKLIST = "blockList";

    var blockListTransformer = blockListTransformerStamp({
        blockListTransformationConfig : {
          akn : [BLOCKLIST,'[leos:listtype=UnNumbered]'].join(""),
          html : 'ul',
          attr : [{
              akn : "xml:id",
              html : "id"
          },{
              akn : "leos:origin",
              html : "data-origin"
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
          },{
              html : "data-akn-name=UnNumberedBlockList"
          },{
          	akn : "leos:listtype=UnNumbered",
          }],
          sub : [{
              akn : "item",
              html : "ul/li",
              attr : [ {
                  akn : "xml:id",
                  html : "id"
              }, {
                  akn : "leos:origin",
                  html : "data-origin"
              }],
              sub : [{
                  akn : "num",
                  html : "ul/li",
                  attr : [ {
                      akn : "xml:id",
                      html : "data-akn-num-id"
                  }, {
                      akn : "leos:origin",
                      html : "data-num-origin"
                  }],
                  sub: {
                      akn: "text",
                      html: "ul/li[data-akn-num]"
                  }
              },{
                  akn : "mp",
                  html : "ul/li",
                  attr : [ {
                      akn : "xml:id",
                      html : "data-akn-mp-id"
                  }, {
                      akn : "leos:origin",
                      html : "data-mp-origin"
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
                  } ],
                  sub : {
                      akn: "text",
                      html: "ul/li/text"
                  }
              }]
          }]
        },
        rootElementsForAkn : [ BLOCKLIST.toLowerCase(), "item" ],
        rootElementsForHtml : [ "ul", "li" ]
    });

    var transformationConfig = blockListTransformer.getTransformationConfig();

    // return plugin module
    var pluginModule = {
        name : pluginName,
        transformationConfig: transformationConfig
    };

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    return pluginModule;
});
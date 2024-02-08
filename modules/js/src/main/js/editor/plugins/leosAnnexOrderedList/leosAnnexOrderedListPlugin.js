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
define(function leosAnnexOrderedListPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var $ = require('jquery');
    var CKEDITOR = require("promise!ckEditor");
    var pluginName = "aknAnnexOrderedList";
    var leosHierarchicalElementTransformerStamp = require("plugins/leosHierarchicalElementTransformer/hierarchicalElementTransformer");
    var numberModule = require("plugins/leosNumber/listItemNumberModule");
    var unumberModule = require("plugins/leosUnumber/listUnumberModule");
    var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");
    var leosPluginUtils = require("plugins/leosPluginUtils");

    var BOGUS = "br";
    var TEXT = "text";
    var SPAN = "span";
    var ORDERED_LIST_SELECTOR = "ol[data-akn-name='aknAnnexOrderedList']";
    var PARA_SELECTOR = "*[data-akn-name='aknNumberedParagraph']";
    var SUB_PARA_SELECTOR = "*[data-akn-name='subparagraph']";
    var ENTER_KEY = 13;
    var SHIFT_ENTER = CKEDITOR.SHIFT + ENTER_KEY;
    var TAB_KEY = 9;
    var config = { attributes: false, childList: true, subtree: true };

    var LOCAL_MAX_LEVEL_LIST;

    var CHECKBOXES = ['☐','&#9744;','&#x2610;', '☑', '&#9745;' , '&#x2611;' ];
    var pluginDefinition = {
        lang: 'en',
        init: function init(editor) {
            numberModule.init(editor);
            unumberModule.init(editor);
            LOCAL_MAX_LEVEL_LIST =  leosPluginUtils.getMaxListLevel(editor);
            editor.on("beforeAknIndentList", _resetDataNumOnIndent);
            editor.on("toDataFormat", _checkLists, null, null, 0);
            editor.on("change", resetDataAknNameForOrderedList, null, null, 0);
            editor.on("change", resetNumbering, null, null, 1);
            editor.on("change", _startObservingAllLists);
            editor.on("change", leosPluginUtils.manageSpanInSubparagraphs);
            editor.on("receiveData", _startObservingAllLists);
            editor.on('afterCommandExec', _restoreListStructure, null, null, 100);
            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : ENTER_KEY,
                action : _onEnterKey
            });
            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : TAB_KEY,
                action : _onTabKey
            });

        }
    };

    function _checkLists(event) {
        var newDiv = new CKEDITOR.dom.element('div')
        newDiv.appendHtml(event.data.dataValue);
        leosPluginUtils.checkLists(newDiv);
        event.data.dataValue = newDiv.getHtml();
    }

    function _onEnterKey(context) {
        var selection = context.event.editor.getSelection();
        var selectedElement = leosKeyHandler.getSelectedElement(selection);
    
        if ((leosKeyHandler.isContentEmptyTextNode(selectedElement) && leosPluginUtils.isSelectionInFirstLevelList(selectedElement))
            || leosPluginUtils.isAnnexList(selectedElement.getAscendant(leosPluginUtils.ORDER_LIST_ELEMENT, true))) {
            context.event.cancel();
        } else if (leosKeyHandler.isContentEmptyTextNode(selectedElement)
            // If we are in an empty sub-point it should be stopped because enterKey plugin is out-denting the whole point
            && leosPluginUtils.getElementName(selectedElement) === leosPluginUtils.HTML_SUB_POINT
            && leosPluginUtils.getElementName(selectedElement.getParent()) === leosPluginUtils.HTML_POINT
            && _getAscendantPoint(selectedElement.getParent())) {
            context.event.cancel();
        } else if((selectedElement.getAscendant('li') && !!selectedElement.getAscendant('li').getAttribute(leosPluginUtils.DATA_AKN_NUM))
                || (leosPluginUtils.getElementName(selectedElement) === leosPluginUtils.HTML_POINT && !!selectedElement.getAttribute(leosPluginUtils.DATA_AKN_NUM))){
            var dataAknNumAttr = selectedElement.getAscendant('li').getAttribute(leosPluginUtils.DATA_AKN_NUM);
            if((!!dataAknNumAttr && CHECKBOXES.includes(dataAknNumAttr))
                || (!!selectedElement.getAttribute(leosPluginUtils.DATA_AKN_NUM) &&
                    CHECKBOXES.includes(selectedElement.getAttribute(leosPluginUtils.DATA_AKN_NUM)))){
                 context.event.cancel();
                 context.event.editor.fire( 'key', { keyCode: SHIFT_ENTER} );
            }
        }
    }

    function _onTabKey(context) {
        var selection = context.event.editor.getSelection();
        var selectedElement = leosKeyHandler.getSelectedElement(selection);

        var actualLevel = leosPluginUtils.calculateListLevel(selectedElement);
        if (actualLevel > LOCAL_MAX_LEVEL_LIST){
            context.event.cancel();
        }
    }

    //Fix ckeditor enterKey plugin's behaviour when enter is pressed at the end of a sub-point and restore the point structure
    function _restoreListStructure(event) {
        if (event.data.name === 'enter') {
            event.editor.fire('lockSnapshot', {"forceUpdate": true});
            var selectedElement = leosKeyHandler.getSelectedElement(event.editor.getSelection());
            var parent = selectedElement.getParent();
            var isSubPoint = leosPluginUtils.isSubparagraph(selectedElement);
            var isParentPoint = !leosPluginUtils.isSubparagraph(parent);
            var pointWithoutContent = !selectedElement.getPrevious() && !parent.getPrevious() && leosPluginUtils.isOrderedAnnexList(parent.getParent())
                && !parent.getParent().getPrevious();

            if(isSubPoint && isParentPoint && pointWithoutContent){
                event.editor.fire('unlockSnapshot');
                selectedElement.insertBefore(parent.getParent());
                leosPluginUtils.setFocus(selectedElement, event.editor);
            } else {
                event.editor.fire('unlockSnapshot');
            }
        }
    }

    /**
     * Add an Observer to all ordered lists (OL) present in the editor, considering as a separate list even the nested ones.
     */
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
    
    /**
     * MutationObserver callback, called after a change has been done inside an OL element.
     * @param mutationsList, array with all nodes affected by the change.
     *
     * Overall logic:
     * 1. Get actual mutations from the OL list.
     * 2. Add intro (HTML_SUB_POINT) to the OLs which to not contains an intro
     * 3. Transform singe sub-points into single points
     */
    function _processMutations(mutationsList) {
        var mutations = _getMutations(mutationsList);
        leosPluginUtils.popSingleSubElement(mutations.singleSubPoints);
        leosPluginUtils.popNotInlineSubElement(mutations.notInlineElements);
    }
    
    /**
     * Create a new <p> in the editor and add it before the <ol> for each element of "listsWithoutIntro"
     *
     * Before calling:
     * <li>
     *      Text node
     *      <ol>
     *          <li>
     *          <li>
     *      </ol>
     * </li>
     *
     * After calling with "listsWithoutIntro" <ol>:
     * <li>
     *      <p>Text node<p>
     *      <ol>
     *          <li>
     *          <li>
     *      </ol>
     * </li>
     *
     * @param listsWithoutIntro, list of OLs to be changed
     */
    function _addIntroBeforeEachList(listsWithoutIntro){
        listsWithoutIntro.forEach(function(list){
            if(list.parentNode){
                var intro = new CKEDITOR.dom.element(leosPluginUtils.HTML_SUB_POINT);
                list.parentNode.insertBefore(intro.$, list);
                _appendAllPreviousTextNodes(intro);
                if(intro.getChildCount() === 0){
                    intro.appendBogus();
                }
            }
        });
    }
    
    /**
     * Dom structure before calling:
     * <li>
     *  text node
     *  <br>
     *  another text node
     *  <p> </p>
     * <li>
     *
     * Dom structure after calling with "element" <p>:
     * <li>
     *  <p>
     *      text node
     *      <br>
     *      another text node
     *  </p>
     * <li>
     * @param element in the dom to be changed, <p>
     */
    function _appendAllPreviousTextNodes(element) {
        var reference = element;
        var spansToRemove = [];
        while (reference.hasPrevious()) {
            var previousElement = reference.getPrevious();
            var previousElementName = leosPluginUtils.getElementName(previousElement);
            if (previousElementName === TEXT || previousElementName === BOGUS || previousElementName === SPAN) {
                element.append(previousElement, true);
            } else {
                break;
            }
        }
        spansToRemove.forEach(function (child) {
            child.remove()
        });
    }
    
    /**
     * Get all mutations to be applied.
     * Mutations are returned as a structure {listsWithoutIntro: array, singleSubPoints: array}
     *
     * @param mutationsList, array with all nodes affected by the change.
     * @returns listsWithoutIntro: OLs without an intro (not a <p> as previous sibling),
     *          singleSubPoints: single SubPoints which will be converted later into Points
     */
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
    
    /**
     * Build mutations for the actual "node" and all his children.
     *
     * @param node, element inside the OL impacted by the change
     * @param listsWithoutIntro, OLs without an intro (not a <p> as previous sibling),
     * @param isListPushed, OLs already processed
     * @param singleSubPoints, single SubPoints which will be converted later into Points
     * @param isSubPointPushed, SubPoints already processed
     */
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

    //This is removing num and origin() on indent and outdent also
    function _resetDataNumOnIndent(event) {
        var editor = event.editor, range, node;
        var selection = editor.getSelection(),
            ranges = selection && selection.getRanges(),
            iterator = ranges.createIterator();

        while ((range = iterator.getNextRange())) {
            if (range.startContainer) {
                var startNode = range.startContainer.type !== CKEDITOR.NODE_TEXT && range.startContainer.getName() === leosPluginUtils.HTML_POINT
                    ? range.startContainer
                    : range.startContainer.getAscendant(leosPluginUtils.HTML_POINT);
                if (range.startContainer.type === CKEDITOR.NODE_TEXT && startNode.getParent().getName() === leosPluginUtils.ORDER_LIST_ELEMENT && startNode.getParent().getAttribute('data-akn-name') === 'aknAnnexList') {
                    startNode = range.startContainer.getParent().getName() === 'p' ? range.startContainer.getParent() : startNode;
                }
                _handleNode(startNode, editor);
            }
            if (range.endContainer) {
                var endNode = range.endContainer.type !== CKEDITOR.NODE_TEXT && range.endContainer.getName() === leosPluginUtils.HTML_POINT
                    ? range.endContainer
                    : range.endContainer.getAscendant(leosPluginUtils.HTML_POINT);
                if (range.endContainer.type === CKEDITOR.NODE_TEXT && endNode.getParent().getName() === leosPluginUtils.ORDER_LIST_ELEMENT && endNode.getParent().getAttribute('data-akn-name') === 'aknAnnexList') {
                    endNode = range.endContainer.getParent().getName() === 'p' ? range.endContainer.getParent() : endNode;
                }
                _handleNode(endNode, editor);
            }

            var rangeWalker = new CKEDITOR.dom.walker(range);
            while (node = rangeWalker.next()) {
                _handleNode(node, editor);
            }
        }
    }

    function _handleNode(node, editor) {
        if (!node || node.type !== CKEDITOR.NODE_ELEMENT || node.getParent().getAttribute('data-akn-name') === 'aknAnnexList'){
            return;
        }
        leosPluginUtils.handleIndentAttributes(node, editor);
        if (!node.getAttribute(leosPluginUtils.DATA_AKN_ELEMENT) || node.getAttribute(leosPluginUtils.DATA_AKN_ELEMENT).
            toLowerCase() != leosPluginUtils.CROSSHEADING.toLowerCase()) {
            node.removeAttribute(leosPluginUtils.DATA_AKN_NUM);
        }
        node.getChildren().toArray().forEach(_handleNode.bind(this, editor));
    }

    /*
     * Resets the numbering of the points depending on nesting level. LEOS-1487: Current implementation simply goes through whole document and renumbers all
     * ordered list items. For above reason this could cause some performance issues if so this implementation should be reconsidered.
     *
     */
    function resetNumbering(event) {
        var ckEditor = event.editor;
        ckEditor.fire('lockSnapshot');
        var jqEditor = $(ckEditor.editable().$);
        var orderedLists = jqEditor.find(ORDERED_LIST_SELECTOR);
        renumberLists(orderedLists);
        var paragraphs = jqEditor.find(PARA_SELECTOR);
        if (paragraphs.length > 0) {
            for (var ii = 0; ii < paragraphs.length; ii++) {
                var paragraph = paragraphs[ii];
                if (ckEditor.LEOS.isTrackChangesEnabled) {
                    var previousNumber = paragraph.hasAttribute(leosPluginUtils.DATA_AKN_TC_ORIGINAL_NUMBER) ? paragraph.getAttribute(leosPluginUtils.DATA_AKN_TC_ORIGINAL_NUMBER) : paragraph.getAttribute(leosPluginUtils.DATA_AKN_NUM);
                    if(previousNumber && previousNumber != null) {
                        ckEditor.fire("handleTcIndent", {data: paragraph, previousNumber: previousNumber});
                    }
                }
            }
        }
        var subparagraphs = jqEditor.find(SUB_PARA_SELECTOR);
        if (subparagraphs.length > 0) {
            for (var jj = 0; jj < subparagraphs.length; jj++) {
                var subparagraph = subparagraphs[jj];
                if (ckEditor.LEOS.isTrackChangesEnabled) {
                    var previousNumber = subparagraph.hasAttribute(leosPluginUtils.DATA_AKN_TC_ORIGINAL_NUMBER) ? subparagraph.getAttribute(leosPluginUtils.DATA_AKN_TC_ORIGINAL_NUMBER) : subparagraph.getAttribute(leosPluginUtils.DATA_AKN_NUM);
                    if(previousNumber && previousNumber != null) {
                        ckEditor.fire("handleTcIndent", {data: subparagraph, previousNumber: previousNumber});
                    }
                }
            }
        }
        ckEditor.fire('unlockSnapshot');
    }

    /* For each list, checks if it is numbered or unumbered */
    function renumberLists(lists) {
        for (var i = 0; i < lists.length; i++) {
            var list = lists.get(i);
            if (unumberModule.isNumbered(list)) {
                numberModule.updateNumbers([list]);
            } else {
                unumberModule.updateNumbers([list]);
            }
        }
    }

    /*
     * Returns the nesting level for given ol element
     */
    function getNestingLevelForOl(olElement) {
        var nestingLevel = -1;
        var currentOl = new CKEDITOR.dom.node(olElement);
        while (currentOl) {
            currentOl = currentOl.getAscendant(leosPluginUtils.ORDER_LIST_ELEMENT);
            nestingLevel++;
        }
        return nestingLevel;
    }

    function resetDataAknNameForOrderedList(event) {
        event.editor.fire('lockSnapshot');
        var jqEditor = $(event.editor.editable().$);
        var orderedLists = jqEditor.find(leosPluginUtils.ORDER_LIST_ELEMENT);
        for (var ii = 0; ii < orderedLists.length; ii++) {
            var orderedList = orderedLists[ii];
            var currentNestingLevel = getNestingLevelForOl(orderedList);
            if (currentNestingLevel > 0) {
                orderedList.setAttribute("data-akn-name", "aknAnnexOrderedList");
                var listItems = orderedList.children;
                for (var jj = 0; jj < listItems.length; jj++) {
                    listItems[jj].removeAttribute("data-akn-name");
                }
            }
            leosPluginUtils.checkPointsInList(orderedList);
        }
        event.editor.fire('unlockSnapshot');
    }

    function elementTagIndexProvider(element) {
        if ((element.name.toLowerCase() == leosPluginUtils.CROSSHEADING.toLowerCase()) || (typeof element.attributes[leosPluginUtils.CROSSHEADING_LIST_ATTR] !== 'undefined' && element.attributes[leosPluginUtils.CROSSHEADING_LIST_ATTR] == leosPluginUtils.LIST)) {
            return 3;
        } else if (!!element.attributes[leosPluginUtils.DATA_AKN_ELEMENT] && element.attributes[leosPluginUtils.DATA_AKN_ELEMENT] == leosPluginUtils.INDENT) {
            return 1;
        } else if ((element.name.toLowerCase() == leosPluginUtils.SUBPARAGRAPH.toLowerCase()) || (!!element.attributes[leosPluginUtils.DATA_AKN_ELEMENT]
         && element.attributes[leosPluginUtils.DATA_AKN_ELEMENT] == leosPluginUtils.SUBPARAGRAPH)) {
            return 2;
        } else {
            return leosPluginUtils.calculateListLevel(element) >= LOCAL_MAX_LEVEL_LIST ? 1 : 0;
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var leosHierarchicalElementTransformer = leosHierarchicalElementTransformerStamp({
        firstLevelConfig : {
            akn : 'list',
            html : 'ol[data-akn-name=aknAnnexOrderedList]',
            attr : [ {
                akn : "leos:editable",
                html : "contenteditable"
            }, {
                akn : "xml:id",
                html : "id"
            }, {
                akn : "leos:origin",
                html : "data-origin"
            }, {
                html : "data-akn-name=aknAnnexOrderedList"
            }, {
                akn : "class",
                html : "data-akn-class"
            } ]
        },
        rootElementsForFrom : [ "list", { elementTags : ["point", "indent", "subparagraph", "crossheading"], elementTagIndexProvider :
         elementTagIndexProvider }],
        contentWrapperForFrom : "subparagraph",
        rootElementsForTo : [ "ol", "li" ]
    });

	var transformationConfig = leosHierarchicalElementTransformer.getTransformationConfig();

    // return plugin module
    var pluginModule = {
        name : pluginName,
        transformationConfig: transformationConfig
    };

    pluginTools.addTransformationConfigForPlugin(leosHierarchicalElementTransformer.getTransformationConfig(), pluginName);

    return pluginModule;
});
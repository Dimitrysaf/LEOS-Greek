/*
 * Copyright 2018 European Commission
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
define(function leosPluginUtilsModule(require) {
    "use strict";

    var CKEDITOR = require("promise!ckEditor");

    var TEXT = "text";
    var BOGUS = "br";
    var TD = "td";
    var UNKNOWN = "unknown";
    var DATA_AKN_NUM = "data-akn-num";
    var DATA_AKN_NUM_ID = "data-akn-num-id";
    var DATA_INDENT_ORIGIN_NUM_ID = "data-indent-origin-num-id";
    var DATA_NUM_ORIGIN = "data-num-origin";
    var DATA_ORIGIN = "data-origin";
    var DATA_AKN_ELEMENT = "data-akn-element";
    var DATA_AKN_NAME = "data-akn-name";
    var DATA_AKN_ID = "data-akn-id";
    var ID = "id";
    var REGULAR = "REGULAR";
    var CROSSHEADING_LIST_ATTR = "data-akn-crossheading-type";
    var DATA_INDENT_LEVEL_ATTR = "data-indent-level";
    var AKN_ORDERED_ANNEX_LIST = "aknAnnexOrderedList";
    var AKN_ORDERED_LIST = "aknOrderedList";
    var AKN_NUMBERED_PARAGRAPH = "aknNumberedParagraph";
    var INDENT_LEVEL_ATTR = "--indent-level"
    var INLINE_NUM_ATTR = "--inline-num"
    var ORDER_LIST_ELEMENT = "ol";
    var HTML_POINT = "li";
    var HTML_SUB_POINT = "p";
    var SPAN = "span";
    var MAX_LEVEL_DEPTH = 7;
    var MAX_LIST_LEVEL = 5;
    var MAX_LEVEL_LIST_DEPTH = 4;
    var MAX_LIST_LEVEL_DEF = 4;
    var MAX_LEVEL_LIST_DEPTH_DEF = 3;
    var MAINBODY = "mainbody";
    var INDENT = "indent";
    var POINT = "point";
    var LIST = "list";
    var ALINEA = "alinea";
    var NUM = "num";
    var SUBPARAGRAPH = "subparagraph";
    var PARAGRAPH = "paragraph";
    var ARTICLE = "article";
    var LEVEL = "level";
    var CROSSHEADING = "crossHeading";
    var EC = "ec";
    var CN = "cn";
    var REFERS_TO = "refersto";
    var INP = "~_INP";
    var WRP = "~_WRP";

    var NUMBERED_ITEM = "point, indent, paragraph";
    var UNUMBERED_ITEM = "alinea, subparagraph";
    var NUMBERED_LEVEL_ITEM = "point, indent, paragraph, level";
    var ITEMS_SELECTOR = LIST + "," + NUMBERED_ITEM + "," + UNUMBERED_ITEM;
    var ATTR_INDENT_LEVEL = "data-indent-level";
    var ATTR_INDENT_NUMBERED = "data-indent-numbered";
    var DATA_AKN_WRAPPED_CONTENT_ID = "data-akn-wrapped-content-id";
    var DATA_AKN_CONTENT_ID = "data-akn-content-id";
    var DATA_CONTENT_ORIGIN = "data-content-origin";
    var DATA_WRAPPED_CONTENT_ORIGIN = "data-wrapped-content-origin";
    var DATA_AKN_MP_ID = "data-akn-mp-id";
    var DATA_MP_ORIGIN = "data-mp-origin";

    var INLINE_FROM_MATCH = /^(text|span|strong|em|u|sup|sub|br|a|img|mref|del)$/;

    var DATA_INDENT_ORIGIN_NUMBER = "data-indent-origin-num";
    var DATA_INDENT_ORIGIN_NUMBER_ID = "data-indent-origin-num-id";
    var DATA_INDENT_ORIGIN_NUMBER_ORIGIN = "data-indent-origin-num-origin";
    var DATA_INDENT_ORIGIN_TYPE = "data-indent-origin-type";

    var DATA_AKN_TC_ORIGINAL_NUMBER = "data-akn-tc-original-number";
    var UNNUMBERED = "UNNUMBERED";
    var NEW = "NEW";

    var LEOS_SOFTACTION = "leos:softaction";
    var DATA_AKN_NUM_SOFTACTION = "data-akn-num-attr-softaction";
    var DEL = "del";
    var MOVETO = "move_to";
    var DELETED = "deleted_";
    var MOVED = "moved_";

    var REG_EXP_FOR_UNICODE_ZERO_WIDTH_SPACE_IN_HEX = /\u200B/g;

    var COUNCIL_INSTANCE = "COUNCIL";
    var ART_DEF = "~_ART_DEF";
    var SPAN_ATTRIBUTES = ['style', 'tabindex', 'contenteditable', 'data-cke-widget-wrapper', 'data-cke-filter', 'data-cke-display-name', 'data-cke-widget-id', 'role', 'aria-label', 'data-akn-action', 'data-akn-action-number'];
    function _hasTextOrBogusAsNextSibling(element){
        return (element instanceof CKEDITOR.dom.element) && element.hasNext()
            && (_getElementName(element.getNext()) === TEXT || _getElementName(element.getNext()) === BOGUS);
    }

    function _hasEmptyTextAsPrevSibling(element){
        return (element instanceof CKEDITOR.dom.element) && element.hasPrevious()
            && ((_getElementName(element.getPrevious()) === TEXT
                    && element.getText() != null
                    && element.getText().trim() == "") || _getElementName(element.getPrevious()) === BOGUS);
    }

    function _getElementName(element) {
        var elementName = UNKNOWN;
        if (element instanceof CKEDITOR.dom.element) {
            elementName = element.getName();
        } else if (element instanceof CKEDITOR.dom.text
                || (element && element.nodeName && element.nodeName === "#text")) {
            elementName = TEXT;
        } else if(element && element.localName){
            elementName = element.localName;
        }
        return elementName;
    }

    function _setFocus(element, editor){
        if(element){
            var range = editor.createRange();
            range.selectNodeContents(element);
            range.collapse(true);
            range.select();
            range.scrollIntoView();
        }
    }

    /**
     * Calculates the depth level of the selected element inside the list (ol block).
     * It counts how many ol elements are present in the hierarchy.
     */
    function _calculateListLevel(selected) {
        var level = 0;
        var actualEL = selected;
        while (_isListElement(actualEL)) {
            if (!_isListIntro(actualEL)) {
                level++;
            }
            actualEL = actualEL.getAscendant(ORDER_LIST_ELEMENT);
        }
        return level;
    }

    /**
     * Returns true if the selected element is child of an li or ol
     */
    function _isListElement(el) {
        return (el && (el.getAscendant(ORDER_LIST_ELEMENT) || el.getAscendant(HTML_POINT)));
    }

    function _isAnnexList(element) {
        return !!element && 'aknAnnexList' === element.getAttribute(DATA_AKN_NAME);
    }

    function _isOrderedAnnexList(element) {
        return !!element && AKN_ORDERED_ANNEX_LIST === element.getAttribute(DATA_AKN_NAME);
    }

    function _isOrderedList(element) {
        return !!element && AKN_ORDERED_LIST === element.getAttribute(DATA_AKN_NAME);
    }

    function _isUnnumberedCNParagraph(el) {
		return el && (!el.getAttribute(DATA_ORIGIN) || el.getAttribute(DATA_ORIGIN).toLowerCase() === 'cn')
			&& el.getAttribute(DATA_AKN_ELEMENT) && el.getAttribute(DATA_AKN_ELEMENT).toLowerCase() === PARAGRAPH
			&& !el.getAttribute(DATA_AKN_NUM);
	}

	function _isAnnexUnnumberedCNParagraph(el) {
		return el && _isAnnexList(el.getAscendant(ORDER_LIST_ELEMENT, true)) && _isUnnumberedCNParagraph(el);
	}

    function _isAnnexSubparagraphElement(element) {
        var elementName = element.getName && element.getName();
        if (elementName === 'p' && 'subparagraph' === element.getAttribute('data-akn-element')) {
            var parentElement = element.getAscendant('ol');
            if (parentElement && 'aknAnnexList' === parentElement.getAttribute('data-akn-name')
                && 'paragraph' === parentElement.getAttribute('data-akn-element')) {
                return true;
            }
        }
        return false;
    }

    function _isSubparagraph(element) {
        return (!!element && element.type === CKEDITOR.NODE_ELEMENT
            && !!element.getAttribute(DATA_AKN_ELEMENT)
            && element.getAttribute(DATA_AKN_ELEMENT) === SUBPARAGRAPH
            && !element.is("table"));
    }

    function _isParagraph(element) {
        return (!!element && element.type === CKEDITOR.NODE_ELEMENT
            && element.is(HTML_POINT)
            && !!element.getAttribute(DATA_AKN_ELEMENT)
            && element.getAttribute(DATA_AKN_ELEMENT) === PARAGRAPH
            && !element.is("table"));
    }

    function _isPointOrIndent(element) {
        return (!!element && element.type == CKEDITOR.NODE_ELEMENT && !!element.getAttribute(DATA_AKN_ELEMENT)
            && (element.getAttribute(DATA_AKN_ELEMENT) == POINT || element.getAttribute(DATA_AKN_ELEMENT) == INDENT));
    }

    function _isListIntroAndFirstSubparaOfPointOrPara(element) {
        return _isListIntro(element) && !(element.getParent().getPrevious(liOrp));
    }

    function _isSubParaButNotListIntroOrFirstSubparaOfPointOrPara(element) {
        return _isSubparagraph(element) && (!_isListIntroAndFirstSubparaOfPointOrPara(element) || !(element.getPrevious()));
    }

    function _isListIntro(element) {
        if (!!element && element instanceof CKEDITOR.dom.element
            && (_isOrderedAnnexList(element.getParent()) || _isOrderedList(element.getParent()))
            && element.getParent().getFirst(liOrp).equals(element)) {
            return _isSubparagraph(element);
        }
    }

    function _isListEnding(element) {
        if (!!element
            && (_isOrderedAnnexList(element.getParent()) || _isOrderedList(element.getParent()))
            && element.getParent().getLast(liOrp).equals(element)
            && !element.getParent().getFirst(liOrp).equals(element)) {
            return _isSubparagraph(element);
        }
    }

    function _isInsideList(element) {
        return (!!element
            && (_getElementName(element.getParent()) == ORDER_LIST_ELEMENT));
    }

    function liOrp( node ) {
        return node instanceof CKEDITOR.dom.element && (node.is(HTML_SUB_POINT) || node.is(HTML_POINT));
    }


    function _moveChildren(source, target) {
        if ( !source || !target )
            return;
        var $ = source.$;
        var targetHtml = target.$;
        var child;

        while ( ( child = $.firstChild ) ) {
            if ($.parentElement.isEqualNode(targetHtml)) {
                targetHtml.insertBefore($.removeChild(child), $);
            } else {
                targetHtml.appendChild($.removeChild(child));
            }
        }
        $.parentElement.removeChild($);
    }

    function _moveElementChildren(source, target) {
        if ( !source || !target )
            return;
        var $ = source.$;
        var targetHtml = target.$;
        var i = $.children.length - 1;

        while ( i > -1 ) {
            var child = $.children.item(i);
            if (child.nodeType === CKEDITOR.NODE_ELEMENT && (child.nodeName.toLowerCase() == 'li' || child.nodeName.toLowerCase() == 'ol' || child.nodeName.toLowerCase() == 'p')) {
                if (!!$.nextSibling) {
                    targetHtml.insertBefore($.removeChild(child), $.nextSibling);
                } else {
                    targetHtml.appendChild($.removeChild(child));
                }
            }
            i--;
        }
    }

    function _isSelectionInFirstLevelList(element) {
        var listDepth = 0;
        var olElement = element.getAscendant(ORDER_LIST_ELEMENT);
        while (!_isAnnexList(olElement)) {
            if (olElement) {
                listDepth = listDepth + 1;
                olElement = olElement.getAscendant(ORDER_LIST_ELEMENT);
            } else {
                break;
            }
        }
        return listDepth === 1;
    }

    function _getAnnexList(element) {
        var olElement = element.getAscendant(ORDER_LIST_ELEMENT);
        while (olElement && !_isAnnexList(olElement)) {
            olElement = olElement.getAscendant(ORDER_LIST_ELEMENT);
        }
        return olElement;
    }

    /*
    * Returns the nesting level for given ol element
    */
    function _getNestingLevelForOl(olElement) {
        var nestingLevel = -1;
        var currentOl = new CKEDITOR.dom.node(olElement);
        while (currentOl) {
            currentOl = currentOl.getAscendant(ORDER_LIST_ELEMENT);
            nestingLevel++;
        }
        return nestingLevel;
    }

    function _setCrossheadingIndentAttribute(element, indentLevel) {
        if (!!element.style) {
            element.style.setProperty(INDENT_LEVEL_ATTR, indentLevel);
        } else {
            element.style = INDENT_LEVEL_ATTR + ":" + indentLevel + ";";
        }
        return element.setAttribute(DATA_INDENT_LEVEL_ATTR, indentLevel);
    }

    function _setCrossheadingNumProperty(element, num) {
        if (!!element.style && !!num) {
            element.style.setProperty(INLINE_NUM_ATTR, "1");
        } else if (!!num) {
            element.style = INLINE_NUM_ATTR + ":" + num + ";";
        }
    }

    function _removeCrossheadingNumProperty(element, num) {
        if (!!element.style) {
            element.style.removeProperty(INLINE_NUM_ATTR);
        }
    }

    function _convertToCrossheading(element, olElement) {
        var crossheading = document.createElement(HTML_SUB_POINT);
        var indentLevel = _getNestingLevelForOl(olElement);
        _setCrossheadingIndentAttribute(crossheading, indentLevel);
        crossheading.setAttribute(DATA_AKN_ELEMENT, CROSSHEADING);
        crossheading.setAttribute(DATA_AKN_NAME, CROSSHEADING);
        crossheading.setAttribute("data-akn-heading-content", "");
        crossheading.setAttribute(DATA_AKN_ID, element.getAttribute("id"));
        crossheading.innerHTML = element.innerHTML;
        element.parentNode.replaceChild(crossheading, element);
        return crossheading;
    }

    function _isCrossHeading(element) {
        return element && element.type == CKEDITOR.NODE_ELEMENT && element.getAttribute(DATA_AKN_ELEMENT) && element.getAttribute(DATA_AKN_ELEMENT).toLowerCase() === CROSSHEADING.toLowerCase();
    }

    function _isCrossHeadingInList(element) {
        return _isCrossHeading(element) && element.getAttribute(CROSSHEADING_LIST_ATTR) && element.getAttribute(CROSSHEADING_LIST_ATTR).toLowerCase() === LIST.toLowerCase();
    }

    // Check lists: is list only contains subparagraphs and crossheadings,
    // this should be removed and children moved to the parent
    function _manageEmptyLists(editor) {
        var lists = editor.element.find('ol');
        for (var i = 0; i < lists.count(); i++) {
            var list = lists.getItem(i);
            if ((_isOrderedAnnexList(list) || _isOrderedList(list)) && _isListContainsOnlySubparagraphsCrossheadingsOrEmpty(list)) {
                _moveChildrenToParent(list);
            }
        }
    }

    // Check lists: are the lists well formed about intros and wrappers,
    function _checkLists(element) {
        var lists = element.find('ol');
        for (var i = 0; i < lists.count(); i++) {
            var list = lists.getItem(i);
            if (_isOrderedAnnexList(list) || _isOrderedList(list)) {
                _checkList(list);
            }
        }
    }

    // Check list: is the list well formed about intros and wrappers,
    function _checkList(list) {
        var listChildren = list.getChildren().toArray();
        for (var j = 0; j < listChildren.length; j++) {
            var listItem = listChildren[j];
            if (liOrp(listItem)) {
                // FIRST CASE: subparagraph in the middle of a list (not intro, not wrapper)
                // We must split the list in two parts
                if (_isSubparagraph(listItem) && !_isListIntro(listItem) && !_isListEnding(listItem)) {
                    var newList = new CKEDITOR.dom.element('ol');
                    if (_isOrderedAnnexList(list)) {
                        newList.setAttribute(DATA_AKN_NAME, AKN_ORDERED_ANNEX_LIST);
                    } else {
                        newList.setAttribute(DATA_AKN_NAME, AKN_ORDERED_LIST);
                    }
                    newList.insertAfter(list);
                    var $ = list.$
                    var targetHtml = newList.$;
                    var nextChildren = listChildren.splice(j);
                    listItem.setAttribute(REFERS_TO, INP);
                    for (var k = 0; k < nextChildren.length; k++) {
                        targetHtml.appendChild($.removeChild(nextChildren[k].$));
                    }
                    _checkList(newList);
                    break;
                }
                // SECOND CASE: this is not a subparagraph (not intro, not wrapper), remove "refersTo" attribute
                if (!_isSubparagraph(listItem)) {
                    listItem.removeAttribute(REFERS_TO);
                }
            }
        }
        // CHECK is possible to add intro in the list
        if (_isSubparagraph(list.getPrevious()) && !_isListIntro(list.getFirst(liOrp))) {
            list.getPrevious().renameNode(HTML_POINT);
            list.getPrevious().setAttribute(REFERS_TO, INP);
            list.getPrevious().insertBefore(list.getFirst());
        }
        // CHECK is possible to add wrapper in the list
        if (_isSubparagraph(list.getNext()) && !_isListEnding(list.getLast(liOrp))) {
            list.getNext().renameNode(HTML_POINT);
            list.getNext().setAttribute(REFERS_TO, WRP);
            list.getNext().insertAfter(list.getLast());
        }
        if (_isListContainsOnlySubparagraphsCrossheadingsOrEmpty(list)) {
            _moveChildrenToParent(list);
        }
    }

    // Check list: is the list well formed about attributes of points,
    function _checkPointsInList(list) {
        var ckList = new CKEDITOR.dom.element(list);
        var listChildren = ckList.getChildren().toArray();
        for (var j = 0; j < listChildren.length; j++) {
            var listItem = listChildren[j];
            if (liOrp(listItem)) {
                // SECOND CASE: this is not a subparagraph (not intro, not wrapper), remove "refersTo" attribute
                if (!_isSubparagraph(listItem)) {
                    listItem.removeAttribute(REFERS_TO);
                }
            }
        }
    }

    // Check lists: if two lists are siblings,,
    // they should be merged if possible
    function _manageSiblingLists(editor) {
        var lists = editor.element.find('ol');
        for (var i = 0; i < lists.count(); i++) {
            var list = lists.getItem(i);
            var sibling = list.getNext();
            if (sibling instanceof CKEDITOR.dom.text
                && (sibling.getText().trim().replace(REG_EXP_FOR_UNICODE_ZERO_WIDTH_SPACE_IN_HEX, '') === "")){

                sibling.remove();
                sibling = list.getNext();
            }


            while (list.is('ol') && !!sibling && !!sibling.is && sibling.is('ol')
            && !_isListEnding(list.getLast()) && !_isListIntro(sibling.getFirst())) {
                _moveChildren(sibling, list);
                sibling = list.getNext();
            }
        }
    }

    // Check subparagraphs, if there is a subparagraph without text, it should be removed
    function _manageEmptySubparagraphs(editor) {
        var subparagraphs = editor.element.find('li');
        for (var i = 0; i < subparagraphs.count(); i++) {
            var subparagraph = subparagraphs.getItem(i);
            if (_isSubparagraph(subparagraph)
                && subparagraph.getChildren().count() == 0
                && !!subparagraph.getNext()
                && !!subparagraph.getNext().is
                && subparagraph.getNext().is('ol')) {
                if (!!subparagraph.getNext().getFirst() && _isSubparagraph(subparagraph.getNext().getFirst())) {
                    subparagraph.remove();
                }
            }
        }
        subparagraphs = editor.element.find('p');
        for (var i = 0; i < subparagraphs.count(); i++) {
            var subparagraph = subparagraphs.getItem(i);
            if (_isSubparagraph(subparagraph)
                && subparagraph.getChildren().count() == 0
                && !!subparagraph.getNext()
                && !!subparagraph.getNext().is
                && subparagraph.getNext().is('ol')) {
                if (!!subparagraph.getNext().getFirst() && _isSubparagraph(subparagraph.getNext().getFirst())) {
                    subparagraph.remove();
                }
            }
        }
    }

    function _keepCursorPosition(startContainerParents, endContainerParents, editor, cursor) {
        for (var i = startContainerParents.length - 1; i > 0; i--) {
            if (startContainerParents[i].type == CKEDITOR.NODE_ELEMENT) {
                if (!!startContainerParents[i].getId()) {
                    var elt = editor.element.findOne("#" + startContainerParents[i].getId());
                    if (!!elt) {
                        cursor.setStart(elt, cursor.startOffset);
                        break;
                    }
                } else if (!!startContainerParents[i].getParent()) {
                    cursor.setStart(startContainerParents[i], cursor.startOffset);
                    break;
                }
            }
        }
        for (var i = endContainerParents.length - 1; i > 0; i--) {
            if (endContainerParents[i].type == CKEDITOR.NODE_ELEMENT) {
                if (!!endContainerParents[i].getId()) {
                    var elt = editor.element.findOne("#" + endContainerParents[i].getId());
                    if (!!elt) {
                        cursor.setEnd(elt, cursor.endOffset);
                        break;
                    }
                } else if (!!endContainerParents[i].getParent()) {
                    cursor.setEnd(endContainerParents[i], cursor.endOffset);
                    break;
                }
            }
        }
        cursor.select();
    }

    function _isSubparagraphInPath(path) {
        if (!!path) {
            var currentElement = path.lastElement;
            return _isSubparagraph(currentElement);
        }
        return false;
    }

    function _isListIntroAndFirstSubelement(element) {
        if (element.type == CKEDITOR.NODE_TEXT) {
            var tmpElement = element;
            while (!!tmpElement && tmpElement.type !== CKEDITOR.NODE_ELEMENT) {
                tmpElement = tmpElement.getParent();
            }
            element = !!tmpElement ? tmpElement : element;
        }
        return (_isListIntro(element) && !element.getParent().$.previousSibling);
    }

    function _isFirstSubelement(element) {
        if (element.type == CKEDITOR.NODE_TEXT) {
            var tmpElement = element;
            while (!!tmpElement && tmpElement.type !== CKEDITOR.NODE_ELEMENT) {
                tmpElement = tmpElement.getParent();
            }
            element = !!tmpElement ? tmpElement : element;
        }
        return (_isSubparagraph(element) && element.getParent().getName().toLowerCase() != 'ol' && !element.$.previousSibling);
    }

    function _manageListIntro(element) {
        if (element.hasAscendant('table', false)
                && element.getAscendant('table', false).hasAscendant('li', false)) {
            // if the element is inside a table
            var tmpElement = element.getAscendant('li', false);
            element = !!tmpElement ? tmpElement : element;
        } else if (element.type == CKEDITOR.NODE_TEXT || (element.type === CKEDITOR.NODE_ELEMENT && element.getName() === 'span')) {
            var tmpElement = element;
            while (!!tmpElement && (tmpElement.type !== CKEDITOR.NODE_ELEMENT || tmpElement.getName() === 'span')) {
                tmpElement = tmpElement.getParent();
            }
            element = !!tmpElement ? tmpElement : element;
        }

        if (_isListIntroAndFirstSubelement(element)) {
            return element.getParent().getParent();
        }
        if (_isFirstSubelement(element)) {
            return element.getParent();
        }
        return element;
    }

    function _isFirstLevelListSubparagraph(element) {
        var elementType = element && element.getAttribute(DATA_AKN_ELEMENT);
        var parentElement = element.getAscendant('ol').getParent();
        var liElementType = element.getAscendant("li") && element.getAscendant('li').getAttribute(DATA_AKN_ELEMENT);
        var parentElementType = parentElement && parentElement.getAttribute(DATA_AKN_ELEMENT);
        return elementType === SUBPARAGRAPH && liElementType === PARAGRAPH && parentElementType === PARAGRAPH;
    }

    function _manageSubparagraphs(range) {
        range.startContainer = _manageListIntro(range.startContainer);
        range.endContainer = _manageListIntro(range.endContainer);
        return range.startPath();
    }

	function _manageNestedSubparagraphs(editor) {
		moveSubparagraphs(editor.element.find('li'));
        moveSubparagraphs(editor.element.find('p'));
	}

	function moveSubparagraphs(subparagraphs) {
        if(subparagraphs && subparagraphs.count() > 0) {
            for (var i = 0; i < subparagraphs.count(); i++) {
                var subparagraph = subparagraphs.getItem(i);
                if (_isSubparagraph(subparagraph) && subparagraph.getChildren().count() > 0) {
                	var hasOnlySubParagraphs = true;
                    for(var j = 0; j < subparagraph.getChildren().count(); j++) {
                        var child = subparagraph.getChildren().getItem(j);
                        if(!_isSubparagraph(child)) {
                            hasOnlySubParagraphs = false;
                        }
                    }
					if(hasOnlySubParagraphs) {
    					_moveElementChildren(subparagraph, subparagraph.getParent());
						if(subparagraph.getChildren().count() == 0) {
							subparagraph.remove();
						}
					}
                }
            }
        }
    }

    function _manageSpanInSubparagraphs(event) {
        var subparagraphs = event.editor.element.find('p');
        if(subparagraphs && subparagraphs.count() > 0) {
            for (var i = 0; i < subparagraphs.count(); i++) {
                var subparagraph = subparagraphs.getItem(i);
                if (subparagraph.getChildren().count() > 0) {
                    for(var j = 0; j < subparagraph.getChildren().count(); j++) {
                        var child = subparagraph.getChildren().getItem(j);
                        if(_getElementName(child) === SPAN  && !hasAtLeastOneAttributeFromList(child)) {
                            _moveElementChildrenFromSpan(child, subparagraph);
                            child.remove();
                        }
                    }
                }
            }
        }
    }

    function hasAtLeastOneAttributeFromList(child){
        var attributes = child.getAttributes();
        var atLeastOneAttributeFound = SPAN_ATTRIBUTES.some(function(attrb) {
            return !!attributes[attrb] ;
        });
        return atLeastOneAttributeFound;
    }

    // Check crossheadings:
    // 1. A crossheading should not contain a list -> crossheadings should be moved inside the list
    // and list should be moved to the previous point, indent
    // 2. List crossheadings should be part of a list
    function _manageCrossheadings(editor) {
        var crossheadings = editor.element.find('li');
        for (var i = 0; i < crossheadings.count(); i++) {
            var crossheading = crossheadings.getItem(i);
            // Crossheadings should not contain list
            if (_isCrossHeading(crossheading)
                && !!crossheading.getLast()
                && !!crossheading.getLast().is
                && crossheading.getLast().is('ol')
                && !_isListIntro(crossheading.getLast().getFirst())) {
                crossheading.getParent().$.insertBefore(crossheading.getLast().$, crossheading.$);
                var ol = crossheading.getPrevious();
                do {
                    ol.$.insertBefore(crossheading.$, ol.getFirst().$);
                } while ((crossheading = ol.getPrevious()) && _isCrossHeadingInList(crossheading));
                if (_isPointOrIndent(ol.getPrevious())) {
                    ol.getPrevious().$.appendChild(ol.$);
                }
            }
            // List Crossheadings should stay in a list
            if (_isCrossHeadingInList(crossheading)
                && !!crossheading.getParent()
                && !!crossheading.getParent().is
                && crossheading.getParent().is('li')) {
                if (!!crossheading.getParent().getAttribute(DATA_AKN_ELEMENT)
                    && (crossheading.getParent().getAttribute(DATA_AKN_ELEMENT) == LEVEL || crossheading.getParent().getAttribute(DATA_AKN_ELEMENT) == PARAGRAPH)) {
                    crossheading.renameNode('p');
                    crossheading.removeAttribute(CROSSHEADING_LIST_ATTR);
                    crossheading.setAttribute("data-akn-heading-content", "");
                } else {
                    var foundSubparagraph = false;
                    var prev = crossheading;
                    while ((prev = prev.getPrevious()) && !foundSubparagraph) {
                        if (_isSubparagraph(prev)) {
                            foundSubparagraph = true;
                        }
                    }
                    if (foundSubparagraph || _isContainsOnlyCrossheadingsOrEmpty(crossheading.getParent())) {
                        if (!!crossheading.getParent().getNext()) {
                            var nextParent = crossheading.getParent().getNext();
                            var next;
                            do {
                                next = crossheading.getNext();
                                crossheading.getParent().getParent().$.insertBefore(crossheading.$, nextParent.$);
                            } while (_isCrossHeading(next) && (crossheading = next))
                        } else {
                            crossheading.getParent().getParent().$.appendChild(crossheading.$);
                        }
                    } else {
                        crossheading.getParent().getParent().$.insertBefore(crossheading.$, crossheading.getParent().$);
                    }
                }
            }
        }
    }

    // Check points,
    // 1. If it contains only one subparagraph, content of subparagraph should be moved to point
    // 2. Points should be converted to subparagraph when they not anymore in a list
    function _managePoints(editor) {
        var points = editor.element.find('li');
        for (var i = 0; i < points.count(); i++) {
            var point = points.getItem(i);
            if (_isPointOrIndent(point) && point.getChildren().count() == 1 && _isSubparagraph(point.getFirst())) {
                _moveChildrenToParent(point.getFirst());
            }
            if (_isAnnexList(point.getParent()) && _isPointOrIndent(point)) {
                var level = $(point.getParent().$).find("li[data-akn-element='" + LEVEL + "']");
                if (level.length > 0) {
                    level[0].appendChild(point.$);
                    point.setAttribute(DATA_AKN_ELEMENT, SUBPARAGRAPH);
                    if (!!point.is && point.is('li') && !point.getParent().is('ol')) {
                        point.renameNode('p');
                    } else if (!!point.is && point.is('p') && point.getParent().is('ol')) {
                        point.renameNode('li');
                    }
                    _moveElementChildren(point, point.getParent());
                }
            }
            if (point.getParent().is('li')
                && !!point.getParent().getAttribute(DATA_AKN_ELEMENT)
                && (point.getParent().getAttribute(DATA_AKN_ELEMENT) == LEVEL || point.getParent().getAttribute(DATA_AKN_ELEMENT) == PARAGRAPH)
                && _isPointOrIndent(point)) {
                if(point.getChildren().count() === 0 && point.getHtml().trim() === "") {
                    point.remove();
                    continue;
                } else {
                    var parentElement = point.getParent().getAttribute(DATA_AKN_ELEMENT);
                    if (parentElement === LEVEL) {
                        point.setAttribute(DATA_AKN_ELEMENT, SUBPARAGRAPH);
                        point.setAttribute(DATA_AKN_NAME, SUBPARAGRAPH);
                    } else if (parentElement === PARAGRAPH) {
                        point.setAttribute(DATA_AKN_ELEMENT, PARAGRAPH);
                        point.setAttribute(DATA_AKN_NAME, AKN_NUMBERED_PARAGRAPH);
                    }
                    if (!!point.is && point.is('li') && !point.getParent().is('ol')) {
                        point.renameNode('p');
                    } else if (!!point.is && point.is('p') && point.getParent().is('ol')) {
                        point.renameNode('li');
                    }
                }
            }
            // Case when point has been outdented to paragraph
            if (_isPointOrIndent(point) && !point.getAscendant('li')) {
                point.setAttribute(DATA_AKN_ELEMENT, PARAGRAPH);
                point.setAttribute(DATA_AKN_NAME, AKN_NUMBERED_PARAGRAPH);
            }
        }
    }

    function _moveChildrenToParent( element ) {
        var parent = element.getParent();
        var children = element.getChildren().toArray();
        _moveChildren(element, element.getParent());
        if (!!parent.is &&  parent.is('li')) {
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.type == CKEDITOR.NODE_ELEMENT && !!child.is && child.is('li') && !child.getParent().is('ol') && _isSubparagraph(child)) {
                    child.renameNode('p');
                } else if (child.type == CKEDITOR.NODE_ELEMENT && !!child.is && child.is('p') && child.getParent().is('ol') && _isSubparagraph(child)) {
                    child.renameNode('li');
                }
            }
        }
    }

    function _isListContainsOnlySubparagraphsCrossheadingsOrEmpty(list) {
        var children = list.getChildren();
        for (var i = 0; i < children.count(); i++) {
            var child = children.getItem(i);
            if (!_isSubparagraph(child) && !_isCrossHeading(child)) {
                return false;
            }
        }
        return true;
    }

    function _isContainsOnlyCrossheadingsOrEmpty(list) {
        var children = list.getChildren();
        for (var i = 0; i < children.count(); i++) {
            var child = children.getItem(i);
            if (child.type == CKEDITOR.NODE_ELEMENT && child.getName() != 'br' && !_isCrossHeading(child)) {
                return false;
            }
        }
        return true;
    }

    function _isFirstList(indentationStatus) {
        return (indentationStatus.current.level == 0);
    }

    function _isListDepthMoreThanThreshold(indentationStatus, maxLevel) {
        return ((indentationStatus.current.level > maxLevel) || (indentationStatus.current.level == maxLevel + 1 && !indentationStatus.current.numbered));
    }

    function _getIndentLevel(editor) {
        var currentPoint = _getPoint(editor);
        var $points = currentPoint.parents(NUMBERED_LEVEL_ITEM);
        return $points.length;
    }

    function _getPoint(editor) {
        var rootElt = $(editor.element.$);
        return _isSubpoint(editor) && _isFirstChild(editor) ? rootElt.parents(NUMBERED_ITEM).first() : rootElt;
    }

    function _isSubpoint(editor) {
        var div = $(editor.element.$);
        if (div.length) {
            var olChild = div.children('ol');
            return (olChild.length && !!olChild.attr(DATA_AKN_NAME) && olChild.attr(DATA_AKN_NAME).toLowerCase().includes(SUBPARAGRAPH));
        }
        return false;
    }

    function _isFirstChild(editor) {
        return (($(editor.element.$).prevAll(ITEMS_SELECTOR).length == 0 && $(editor.element.$).parent().prop("tagName").toLowerCase() != LEVEL && $(editor.element.$).parent().prop("tagName").toLowerCase() != LIST)
            || ($(editor.element.$).prevAll(ITEMS_SELECTOR).length == 0 && $(editor.element.$).parent().prop("tagName").toLowerCase() == LIST && $(editor.element.$).parent().prevAll(ITEMS_SELECTOR).length == 0));
    }

    function _isFirstSubParagraph(editor) {
        return _isSubpoint(editor) && (($(editor.element.$).prevAll(ITEMS_SELECTOR).length == 0 && $(editor.element.$).parent().prop("tagName").toLowerCase() != LIST)
            || ($(editor.element.$).prevAll(ITEMS_SELECTOR).length == 0 && $(editor.element.$).parent().prop("tagName").toLowerCase() == LIST && $(editor.element.$).parent().prevAll(ITEMS_SELECTOR).length == 0));
    }

    function _isDefinitionArticleElement(element) {
        return element.getAscendant(ARTICLE) && element.getAscendant(ARTICLE).attributes[REFERS_TO] && element.getAscendant(ARTICLE).attributes[REFERS_TO] === ART_DEF;
    }

    function _getCurrentNumValue(editor) {
        var rootElt = $(editor.element.$);
        var pointInHtml = (_isSubpoint(editor) && _isFirstChild(editor)) ? rootElt.parents(NUMBERED_ITEM).first() : rootElt.find(HTML_POINT).first();
        var currentNum = pointInHtml.children(NUM).first();
        if (currentNum.length) {
            return currentNum.html();
        } else {
            return pointInHtml.attr(DATA_AKN_NUM);
        }
    }

    function _getDepth(item) {
        if (item.prop("tagName").toLowerCase() == PARAGRAPH) {
            var children = item.children(ITEMS_SELECTOR);
            if (children.length) {
                item = children.eq(children.length-1);
            } else {
                return 1;
            }
        }
        if (item.prop("tagName").toLowerCase() == SUBPARAGRAPH) {
            var children = item.children(ITEMS_SELECTOR);
            if (children.length) {
                item = children.eq(children.length-1);
            }
        }
        if (item.prop("tagName").toLowerCase() == POINT) {
            var children = item.children(ITEMS_SELECTOR);
            if (children.length) {
                item = children.eq(children.length-1);
            }
        }
        if (item.prop("tagName").toLowerCase() == LIST) {
            var children = item.children(ITEMS_SELECTOR);
            if (children.length) {
                item = children.eq(children.length-1);
            }
        }
        var currentLevel = item.parents(NUMBERED_LEVEL_ITEM).length;
        var depth = currentLevel;
        var descendantPoints = item.find(NUMBERED_ITEM);
        for (var i = 0; i < descendantPoints.length; i++) {
            var currentChild = descendantPoints.eq(i);
            var level = currentChild.parents(NUMBERED_LEVEL_ITEM).length;
            if (level > depth) {
                depth = level;
            }
        }
        if (item.prop("tagName").toLowerCase() != ALINEA  &&
            item.prop("tagName").toLowerCase() != SUBPARAGRAPH) {
            depth++;
        }

        return depth;
    }

    function _setCurrentNumValue(newValue, editor, indentationStatus) {
        var rootElt = $(editor.element.$);
        var pointInHtml = (_isSubpoint(editor) && _isFirstChild(editor)) ? rootElt.parents(NUMBERED_ITEM).first() : rootElt.find(HTML_POINT).first();
        if (_isUnumberedparagraph(pointInHtml)) {
            pointInHtml = rootElt.find(HTML_POINT).first();
        }
        if (pointInHtml.parents(PARAGRAPH).length && _isUnumberedparagraph(pointInHtml.parents(PARAGRAPH)) && indentationStatus.current.level == 0) {
            newValue = null;
        }

        var currentNum = pointInHtml.children(NUM).first();
        if (currentNum.length) {
            if (typeof newValue === 'undefined') {
                currentNum.html("");
            } else {
                currentNum.html(newValue);
            }
        } else {
            if (typeof newValue === 'undefined') {
                pointInHtml.removeAttr(DATA_AKN_NUM);
            } else {
                pointInHtml.attr(DATA_AKN_NUM, newValue);
            }
        }
    }

    function _isUnumberedHtmlParagraph(editor, indentationStatus) {
        var paragraph = $(editor.element.$).find(HTML_POINT).first()
        if (!!indentationStatus) {
            return (!indentationStatus.original.numbered && paragraph && paragraph.attr(DATA_AKN_ELEMENT) && paragraph.attr(DATA_AKN_ELEMENT).toLocaleLowerCase() == PARAGRAPH && !_hasHtmlNum(paragraph));
        } else {
            return (paragraph && paragraph.attr(DATA_AKN_ELEMENT) && paragraph.attr(DATA_AKN_ELEMENT).toLocaleLowerCase() == PARAGRAPH && !_hasHtmlNum(paragraph));
        }
    }

    function _isUnumberedparagraph(paragraph) {
        return (paragraph && paragraph.prop("tagName").toLocaleLowerCase() == PARAGRAPH && !_hasNum(paragraph));
    }

    function _hasHtmlNum(element) {
        if (element.attr(DATA_AKN_NUM)) {
            var dataAknNumAttrSoftAction = element.attr(DATA_AKN_NUM_SOFTACTION);
            if (!!dataAknNumAttrSoftAction && dataAknNumAttrSoftAction == DEL) {
                return false;
            }
            return true;
        }
        return false;
    }

    function _hasNum(element) {
        var childNum = element.children(NUM);
        if (childNum.length > 0) {
            var dataAknNumAttrSoftAction = childNum.attr(LEOS_SOFTACTION);
            if (!!dataAknNumAttrSoftAction && dataAknNumAttrSoftAction == DEL) {
                return false;
            }
            return true;
        }
        return false;
    }

    function _resetIndent(editor, isIndent) {
        editor.fire("resetIndent");

        var source = $(editor.element.$);
        if (_isSubpoint(editor) && _isFirstChild(editor)) {
            source = $(editor.element.$).parents(NUMBERED_ITEM).first();
        }
        source.css({'margin-left': -5});
        _resetIndentOtherItems(editor, source, isIndent);
    }

    function _resetIndentOtherItems(editor, source, isIndent) {
        // if point with alinea and list, the children should not be indented
        if (_isSubpoint(editor) && _isFirstChild(editor) && !isIndent) {
            var list = source.children(LIST).first();
            if (list.length) {
                var children = list.children(ITEMS_SELECTOR);
                $.each(children, function(key, child){
                    $(child).css({'margin-left': -5});
                });
            }
            var subpoints = source.children(UNUMBERED_ITEM);
            if (subpoints.length) {
                $.each(subpoints, function(key, child){
                    $(child).css({'margin-left': -5});
                });
            }
        }
        // If second, third, ... alinea, siblings alinea should be outdented
        else if (_isSubpoint(editor) && isIndent) {
            var alineaNextSiblings = source.nextAll(UNUMBERED_ITEM);
            $.each(alineaNextSiblings, function(key, sibling){
                $(sibling).css({'margin-left': -5});
            });
            var list = source.nextAll(LIST);
            if (list.length) {
                var children = list.children(ITEMS_SELECTOR);
                $.each(children, function(key, child){
                    $(child).css({'margin-left': -5});
                });
            }
        }
    }

    function _setIndentAttributes(editor, indentationStatus) {
        var li = $(editor.element.$).find(HTML_POINT).first();
        if (li.length) {
            li.attr(ATTR_INDENT_LEVEL, indentationStatus.current.level);
            li.attr(ATTR_INDENT_NUMBERED, indentationStatus.current.numbered);
        }
    }

    function _resetIndentAttributes(editor, indentationStatus) {
        var li = $(editor.element.$).find(HTML_POINT).first();
        if (li.length) {
            li.removeAttr(ATTR_INDENT_LEVEL);
            li.removeAttr(ATTR_INDENT_NUMBERED);
            indentationStatus.current.numbered = indentationStatus.original.numbered;
            indentationStatus.current.prevNumbered = [];
        }
    }

    function _doIndent(editor, indentationStatus) {
        var source = $(editor.element.$);

        editor.fire("indent");

        // If first alinea, should be considered as the point itself
        if (_isFirstChild(editor) && _isSubpoint(editor)) {
            source = $(editor.element.$).parents(NUMBERED_ITEM).first();
        }

        var diff = indentationStatus.current.level - indentationStatus.original.level;
        if (!indentationStatus.current.numbered
            && indentationStatus.original.numbered
            && (!source.parents(LEVEL).length || (_isSubpoint(editor) && _isFirstChild(editor)))) {
            source.css({'margin-left': 40 * (diff - 1) - 5});
        } else if (indentationStatus.original.level == 1 && !indentationStatus.original.numbered
            && !source.parents(LEVEL).length) {
            source.css({'margin-left': 40 * (diff + 1) - 5});
        } else if (source.parents(PARAGRAPH).length
            && _isUnumberedparagraph(source.parents(PARAGRAPH))
            && indentationStatus.current.level == 0
            && indentationStatus.current.numbered
            && indentationStatus.original.numbered) {
            source.css({'margin-left': 40 * (diff - 1) - 5});
        } else {
            source.css({'margin-left': 40 * diff - 5});
        }
        _doIndentOtherItems(editor, source, indentationStatus);
    }

    function _doIndentOtherItems(editor, source, indentationStatus) {
        var diff = indentationStatus.current.level - indentationStatus.original.level;

        // For indent, children should not be indented
        if (_isSubpoint(editor) && _isFirstChild(editor) && indentationStatus.current.move > 0) {
            var childrenElts = source.children(ITEMS_SELECTOR);
            if (childrenElts.length) {
                var levelDiff = indentationStatus.current.numbered ? -diff : -diff + 1;
                $.each(childrenElts, function(key, child){
                    if ($(child).prop("tagName").toLowerCase() == LIST) {
                        var children = $(child).children(NUMBERED_ITEM);
                        $.each(children, function (key, listChild) {
                            if (diff != 0) {
                                $(listChild).css({'margin-left': 40 * levelDiff - 5});
                            } else {
                                $(listChild).css({'margin-left': - 5});
                            }
                        });
                    } else if ($(child).prop("tagName").toLowerCase() == ALINEA ||
                        $(child).prop("tagName").toLowerCase() == SUBPARAGRAPH) {
                        if (diff != 0) {
                            $(child).css({'margin-left': 40 * levelDiff - 5});
                        } else {
                            $(child).css({'margin-left': - 5});
                        }
                    }
                });
            }
        }
        // If outdenting, next siblings should be outdented only when there is a change of level
        if (indentationStatus.current.move < 0) {
            var nextElts = source.nextAll(ITEMS_SELECTOR);
            if (nextElts.length) {
                $.each(nextElts, function(key, next){
                    var levelDiff = indentationStatus.current.numbered ? 1 : 0;
                    if ($(next).prop("tagName").toLowerCase() == LIST) {
                        var children = $(next).children(NUMBERED_ITEM);
                        $.each(children, function(key, child){
                            if (diff != 0) {
                                $(child).css({'margin-left': 40 * (diff+levelDiff) - 5});
                            } else {
                                $(child).css({'margin-left': - 5});
                            }
                        });
                    } else {
                        if (diff != 0) {
                            $(next).css({'margin-left': 40 * (diff+levelDiff) - 5});
                        } else {
                            $(next).css({'margin-left': - 5});
                        }
                    }
                });
            }
        }
    }

    function _popSingleSubElement(singleSubElements) {
        singleSubElements.forEach(function (subElement) {
            var parent = subElement.getParent();
            if (parent) {
                while (subElement.getChildCount() > 0) {
                    subElement.getChild(0).insertBefore(subElement);
                    _copyContentAndMpAttributeToElement(subElement, parent);
                }
                subElement.remove();
            }
        });
    }

    function _popNotInlineSubElement(notInlineSubElements) {
        notInlineSubElements.reverse();
        for (var i = 0; i < notInlineSubElements.length; i++){
            var subElem = notInlineSubElements[i];
            var parent = subElem.getParent();
            var hasNext = subElem.hasNext();
            var hasPrevious = subElem.hasPrevious() && !_hasEmptyTextAsPrevSibling(subElem);
            // Previous n'est pas nul mais est text vide-> trouver solution
            var isParentSubParagraph = !!parent && _isSubparagraph(parent);
            if (isParentSubParagraph && !hasNext && !hasPrevious) {
                _moveChildrenToParent(subElem);
            } else if (parent) {
                var newParentElement = new CKEDITOR.dom.element(HTML_POINT);
                newParentElement.setAttribute(DATA_AKN_ELEMENT, SUBPARAGRAPH);
                newParentElement.setAttribute(DATA_AKN_NAME, AKN_NUMBERED_PARAGRAPH);
                newParentElement.append(subElem);
                if (hasNext) {
                    newParentElement.insertBefore(parent);
                } else {
                    newParentElement.insertAfter(parent);
                }
            }
        }
    }
/**
     * Add "child" element into "notInlineElements" if the <li> node contains not inline elements and
     * a subparagraph.
     * Example: Add <p> to "notInlineElements" if the structure is as below:
     * <li>
     *     "some text"
     *     <table> </table>
     *     <p> </p>
     * </li>
     *
     * @param node, parent <li>
     * @param notInlineElements, elements which will be converted later into <li>
     * @param isNotInlinePushed, elements already processed
     */
     function _pushNotInlineElements(node, notInlineElements, isNotInlinePushed){
        var hasElementsLI = !!node && _getElementName(node) === HTML_POINT
             && node.childNodes.length > 1 && !!node.getAttribute(DATA_AKN_ELEMENT)
                         && node.getAttribute(DATA_AKN_ELEMENT) === SUBPARAGRAPH;
        if(!hasElementsLI){
            return;
        }
        var isAtLeastOneMatch = false;
        for (var i = 0; i < node.childNodes.length; i++){
            var child = node.childNodes[i];
            var childName = _getElementName(child);
            if(childName != ORDER_LIST_ELEMENT && !INLINE_FROM_MATCH.test(childName)){
               isAtLeastOneMatch = true;
               break;
            }
        }
        if(isAtLeastOneMatch){
            // keep the first element of the <li>
            for (var j = 1; j < node.childNodes.length; j++){
               var child = node.childNodes[j];
               if(!!isNotInlinePushed && isNotInlinePushed[child] !== 1){
                   isNotInlinePushed[child] = 1;
                   var elem = new CKEDITOR.dom.element(child);
                   notInlineElements.push(elem);
               }
           }
        }
     }

    function _copyContentAndMpAttributeToElement(from, to) {
        if (!!from.getAttribute(DATA_AKN_WRAPPED_CONTENT_ID)) {
            to.setAttribute(DATA_AKN_WRAPPED_CONTENT_ID, from.getAttribute(DATA_AKN_WRAPPED_CONTENT_ID));
            to.setAttribute(DATA_AKN_CONTENT_ID, from.getAttribute(DATA_AKN_WRAPPED_CONTENT_ID));
        }
        if (!!from.getAttribute(DATA_WRAPPED_CONTENT_ORIGIN)) {
            to.setAttribute(DATA_WRAPPED_CONTENT_ORIGIN, from.getAttribute(DATA_WRAPPED_CONTENT_ORIGIN));
            to.setAttribute(DATA_CONTENT_ORIGIN, from.getAttribute(DATA_WRAPPED_CONTENT_ORIGIN));
        }
        if (!!from.getAttribute(DATA_AKN_CONTENT_ID)) {
            to.setAttribute(DATA_AKN_WRAPPED_CONTENT_ID, from.getAttribute(DATA_AKN_CONTENT_ID));
            to.setAttribute(DATA_AKN_CONTENT_ID, from.getAttribute(DATA_AKN_CONTENT_ID));
        }
        if (!!from.getAttribute(DATA_CONTENT_ORIGIN)) {
            to.setAttribute(DATA_WRAPPED_CONTENT_ORIGIN, from.getAttribute(DATA_CONTENT_ORIGIN));
            to.setAttribute(DATA_CONTENT_ORIGIN, from.getAttribute(DATA_CONTENT_ORIGIN));
        }
        if (!!from.getAttribute(DATA_AKN_MP_ID)) {
            to.setAttribute(DATA_AKN_MP_ID, from.getAttribute(DATA_AKN_MP_ID));
        } else {
            to.setAttribute(DATA_AKN_MP_ID, "");
        }
        if (!!from.getAttribute(DATA_MP_ORIGIN)) {
            to.setAttribute(DATA_MP_ORIGIN, from.getAttribute(DATA_MP_ORIGIN));
        } else {
            to.setAttribute(DATA_MP_ORIGIN, "");
        }
    }

    function _handleIndentAttributes(node, editor) {
        if (editor.LEOS.isClonedProposal && !INLINE_FROM_MATCH.test(node.getName()) && node.getAttribute(DATA_AKN_ELEMENT)) {
            var elementName = node.getAttribute(DATA_AKN_ELEMENT).toUpperCase();
            switch(elementName) {
                case "ALINEA":
                    elementName = "OTHER_SUBPOINT";
                    break;
                case "SUBPARAGRAPH":
                    var parentName = node.getParent().getName().toLowerCase();
                    var grandParentName = node.getParent().getParent().getAttribute(DATA_AKN_ELEMENT).toUpperCase();
                    if (parentName == "ol" && grandParentName == "PARAGRAPH") {
                        elementName = "OTHER_SUBPARAGRAPH";
                    } else {
                        elementName = "OTHER_SUBPOINT";
                    }
                    break;
                case "INDENT":
                    elementName = "POINT";
                    break;
            }
            if (elementName == 'PARAGRAPH'
                || elementName == 'OTHER_SUBPARAGRAPH'
                || elementName == 'OTHER_SUBPOINT'
                || !!node.getAttribute(DATA_AKN_NUM_ID)) {
                node.setAttribute(DATA_INDENT_ORIGIN_TYPE, elementName);
                node.getAttribute(DATA_AKN_NUM) ? node.setAttribute(DATA_INDENT_ORIGIN_NUMBER, node.getAttribute(DATA_AKN_NUM)) : null;
            }
            if (!!node.getAttribute(DATA_AKN_NUM_ID)) {
                node.setAttribute(DATA_INDENT_ORIGIN_NUMBER_ID, node.getAttribute(DATA_AKN_NUM_ID));
            }
            if (!!node.getAttribute(DATA_NUM_ORIGIN)) {
                node.setAttribute(DATA_INDENT_ORIGIN_NUMBER_ORIGIN, node.getAttribute(DATA_NUM_ORIGIN));
            }
            editor.fire("setOriginalTcNumber", {data: node, previousNumber: node.getAttribute(DATA_AKN_NUM)});
        }
    }

    function _hasPointAttribute(element) {
        return (!!element.attributes[DATA_AKN_ELEMENT]
            && element.attributes[DATA_AKN_ELEMENT].value == POINT);
    }

    function _getArticleType(element, articleTypesConfig) {
        var type = REGULAR;
        var article = $(element.$).parents(ARTICLE);
        if (article.length == 0) {
            article = $(element.$).find(ARTICLE);
        }
        if (article.length > 0) {
            article = article.get(0);
            for (var key in articleTypesConfig) {
                var attribute = articleTypesConfig[key];
                if (!!attribute.attributeName && attribute.attributeName === "") {
                    type = key;
                } else if (!!attribute.attributeName
                    && (article.hasAttribute(attribute.attributeName)
                        || article.hasAttribute(attribute.attributeName.toLowerCase()))) {
                    if (article.getAttribute(attribute.attributeName) == attribute.attributeValue
                        || article.getAttribute(attribute.attributeName.toLowerCase()) == attribute.attributeValue) {
                        return key;
                    }
                }
            }
        }
        return type;
    }

    function _isDefinitionArticle(editor){
        var editorData = $(editor.getData());
        var rootElt = editorData.length && editorData.prop("tagName").toLowerCase() ===  ARTICLE ? editorData : $(editor.element.$).closest(ARTICLE);
        if(rootElt.length){
            return rootElt.attr("refersto") === ART_DEF;
        }
        return false;
    }

    function _getMaxListLevel(editor) {
        return _isDefinitionArticle(editor) ? MAX_LIST_LEVEL_DEF : MAX_LIST_LEVEL;
    }

    function _getMaxListLevelDepth(editor) {
        return _isDefinitionArticle(editor) ? MAX_LEVEL_LIST_DEPTH_DEF : MAX_LEVEL_LIST_DEPTH;
    }

    function _selectLastEditableElement(selection) {
        /*
         * This method was created to solve a conflict in CKEditor when
         * we use contenteditable attribute in some elements.
         * When open ckeditor to edit text with double click or using
         * the icon, and then we don't move the cursor and don't click
         * in any place, then the selected element is the "ol".
         * Then we need to change the selected element to the last one.
         * It was affecting the ENTER and also the indent and outdent.
         *
         */
        var listOfElementToSelect = selection.getStartElement().find('p, li');
        var elementToSelect = listOfElementToSelect.getItem(listOfElementToSelect.count()-1);
        return _selectNewElement(elementToSelect, selection);
    }

    function _getCorrectElementOnIndent(element, indent) {
        var newElement = element;
        if (!liOrp(element)) {
             newElement = element.getAscendant(liOrp);
        }
        if (_isSubparagraph(newElement) && !indent) {
            var parentElement = !_isInsideList(newElement) ? newElement.getParent() : newElement.getParent().getParent();
            if (_isPointOrIndent(parentElement) || _isParagraph(parentElement)) {
                return parentElement.getFirst();
            }
        }
        return !!newElement ? newElement : element;
    }

    function _selectCorrectElementForList(selection, indent) {
        var element = selection.getStartElement();
        element = _getCorrectElementOnIndent(element, indent);
        return _selectNewElement(element, selection);
    }

    function _selectCorrectPathForList(range, path, indent) {
        var element = path.lastElement;
        element = _getCorrectElementOnIndent(element, indent);
        range.startContainer = element;
        path = range.startPath();
        return path;
    }

    function _selectNewElement(newElement, selection) {
        var newRange = new CKEDITOR.dom.range(selection.document);
        newRange.moveToPosition(newElement, CKEDITOR.POSITION_BEFORE_END);
        return newRange.select();
    }

    function _manageNestedHtmlP(editor) {
        moveHtmlP(editor.element.find('p'));
    }

    function moveHtmlP(subparagraphs) {
        if(subparagraphs && subparagraphs.count() > 0) {
            for (var i = 0; i < subparagraphs.count(); i++) {
                var subparagraph = subparagraphs.getItem(i);
                if (_getElementName(subparagraph) === HTML_SUB_POINT && subparagraph.getChildren().count() > 0) {
                    var hasOnlySubParagraphs = true;
                    var hasAtLeastOneSubParagraph = false;
                    for(var j = 0; j < subparagraph.getChildren().count(); j++) {
                        var child = subparagraph.getChildren().getItem(j);
                        if(_getElementName(child) !== HTML_SUB_POINT) {
                            hasOnlySubParagraphs = false;
                        }else{
                            hasAtLeastOneSubParagraph = true;
                        }
                    }

                    if(hasOnlySubParagraphs) {
                        _moveElementChildrenKeepFirstChild(subparagraph, subparagraph.getParent());
                    }
                }
            }
        }
    }

    function _moveElementChildrenKeepFirstChild(source, target) {
        if ( !source || !target )
            return;
        var $ = source.$;
        var targetHtml = target.$;
        var i = $.children.length - 1;

        while ( i > -1 ) {
            var child = $.children.item(i);
            if (child.nodeType === CKEDITOR.NODE_ELEMENT &&  child.nodeName.toLowerCase() == 'p') {
                if (!!$.nextSibling && i > 0) {
                    targetHtml.insertBefore($.removeChild(child), $.nextSibling);
                } else {
                    for (var z = 0; z < child.childNodes.length; z++){
                       var grandChild = child.childNodes[z];
                       $.append(grandChild);
                    }
                    $.removeChild(child);
                }
            }
            i--;
        }
    }

    function _moveElementChildrenFromSpan(source, target) {
        if ( !source || !target )
            return;
        var $ = source.$;
        var targetHtml = target.$;
        var i = $.childNodes.length - 1;

        while ( i > -1 ) {
            var child = $.childNodes[i];
            if (!!$.nextSibling) {
                targetHtml.insertBefore($.removeChild(child), $.nextSibling);
            } else {
               targetHtml.appendChild($.removeChild(child));
            }
            i--;
        }
    }
    return {
        hasTextOrBogusAsNextSibling: _hasTextOrBogusAsNextSibling,
        getElementName: _getElementName,
        setFocus: _setFocus,
        calculateListLevel: _calculateListLevel,
        getAnnexList: _getAnnexList,
        isSelectionInFirstLevelList: _isSelectionInFirstLevelList,
        isAnnexList: _isAnnexList,
        isOrderedAnnexList: _isOrderedAnnexList,
        isOrderedList: _isOrderedList,
		isUnnumberedCNParagraph: _isUnnumberedCNParagraph,
		isAnnexUnnumberedCNParagraph: _isAnnexUnnumberedCNParagraph,
		isAnnexSubparagraphElement: _isAnnexSubparagraphElement,
        isSubparagraph: _isSubparagraph,
        isSubparagraphInPath: _isSubparagraphInPath,
        isPointOrIndent: _isPointOrIndent,
        isListIntroAndFirstSubparaOfPointOrPara: _isListIntroAndFirstSubparaOfPointOrPara,
        isSubParaButNotListIntroOrFirstSubparaOfPointOrPara: _isSubParaButNotListIntroOrFirstSubparaOfPointOrPara,
        isListIntro: _isListIntro,
        isListEnding: _isListEnding,
        isInsideList: _isInsideList,
        getNestingLevelForOl: _getNestingLevelForOl,
        convertToCrossheading: _convertToCrossheading,
        setCrossheadingIndentAttribute: _setCrossheadingIndentAttribute,
        isCrossHeading: _isCrossHeading,
        isCrossHeadingInList: _isCrossHeadingInList,
        setCrossheadingNumProperty: _setCrossheadingNumProperty,
        removeCrossheadingNumProperty: _removeCrossheadingNumProperty,
        isFirstList: _isFirstList,
        isListDepthMoreThanThreshold: _isListDepthMoreThanThreshold,
        getIndentLevel: _getIndentLevel,
        isSubpoint: _isSubpoint,
        isFirstChild: _isFirstChild,
        getCurrentNumValue: _getCurrentNumValue,
        getDepth: _getDepth,
        setCurrentNumValue: _setCurrentNumValue,
        isUnumberedHtmlParagraph: _isUnumberedHtmlParagraph,
        isUnumberedparagraph: _isUnumberedparagraph,
        resetIndent: _resetIndent,
        setIndentAttributes: _setIndentAttributes,
        resetIndentAttributes: _resetIndentAttributes,
        doIndent: _doIndent,
        popSingleSubElement : _popSingleSubElement,
        popNotInlineSubElement: _popNotInlineSubElement,
        pushNotInlineElements: _pushNotInlineElements,
        handleIndentAttributes : _handleIndentAttributes,
        moveChildren: _moveChildren,
        moveElementChildren: _moveElementChildren,
        managePoints: _managePoints,
        manageEmptyLists: _manageEmptyLists,
        manageEmptySubparagraphs: _manageEmptySubparagraphs,
        manageSiblingLists: _manageSiblingLists,
        manageSubparagraphs: _manageSubparagraphs,
        manageListIntro: _manageListIntro,
        manageSpanInSubparagraphs: _manageSpanInSubparagraphs,
        manageNestedHtmlP:_manageNestedHtmlP,
        isFirstLevelListSubparagraph: _isFirstLevelListSubparagraph,
        manageCrossheadings: _manageCrossheadings,
        keepCursorPosition: _keepCursorPosition,
        copyContentAndMpAttributeToElement: _copyContentAndMpAttributeToElement,
        hasPointAttribute: _hasPointAttribute,
        getArticleType: _getArticleType,
        isDefinitionArticle: _isDefinitionArticle,
        getMaxListLevel: _getMaxListLevel,
        getMaxListLevelDepth: _getMaxListLevelDepth,
        isFirstSubParagraph: _isFirstSubParagraph,
        isDefinitionArticleElement: _isDefinitionArticleElement,
        selectLastEditableElement: _selectLastEditableElement,
        selectCorrectElementForList: _selectCorrectElementForList,
        checkLists: _checkLists,
        checkPointsInList: _checkPointsInList,
		manageNestedSubparagraphs: _manageNestedSubparagraphs,
        selectCorrectPathForList: _selectCorrectPathForList,
        MAX_LEVEL_DEPTH: MAX_LEVEL_DEPTH,
        MAX_LIST_LEVEL: MAX_LIST_LEVEL,
        MAX_LEVEL_LIST_DEPTH: MAX_LEVEL_LIST_DEPTH,
        MAX_LIST_LEVEL_DEF: MAX_LIST_LEVEL_DEF,
        MAX_LEVEL_LIST_DEPTH_DEF: MAX_LEVEL_LIST_DEPTH_DEF,
        HTML_POINT: HTML_POINT,
        HTML_SUB_POINT: HTML_SUB_POINT,
        DATA_ORIGIN: DATA_ORIGIN,
        MAINBODY: MAINBODY,
        ARTICLE: ARTICLE,
        POINT: POINT,
        INDENT: INDENT,
        CROSSHEADING: CROSSHEADING,
        LIST: LIST,
        ALINEA: ALINEA,
        SUBPARAGRAPH: SUBPARAGRAPH,
        PARAGRAPH: PARAGRAPH,
        LEVEL: LEVEL,
        ORDER_LIST_ELEMENT: ORDER_LIST_ELEMENT,
        DATA_AKN_NAME: DATA_AKN_NAME,
        DATA_AKN_ELEMENT: DATA_AKN_ELEMENT,
        DATA_AKN_ID: DATA_AKN_ID,
        ID: ID,
        EC: EC,
        CN: CN,
        DATA_AKN_NUM: DATA_AKN_NUM,
        DATA_AKN_NUM_ID: DATA_AKN_NUM_ID,
        DATA_INDENT_ORIGIN_NUM_ID: DATA_INDENT_ORIGIN_NUM_ID,
        DATA_AKN_WRAPPED_CONTENT_ID: DATA_AKN_WRAPPED_CONTENT_ID,
        DATA_AKN_MP_ID: DATA_AKN_MP_ID,
        DATA_AKN_TC_ORIGINAL_NUMBER: DATA_AKN_TC_ORIGINAL_NUMBER,
        LEOS_SOFTACTION: LEOS_SOFTACTION,
        DEL: DEL,
        MOVETO: MOVETO,
        DELETED: DELETED,
        MOVED: MOVED,
        REFERS_TO: REFERS_TO,
        DATA_AKN_CONTENT_ID: DATA_AKN_CONTENT_ID,
        CROSSHEADING_LIST_ATTR: CROSSHEADING_LIST_ATTR,
        DATA_INDENT_LEVEL_ATTR: DATA_INDENT_LEVEL_ATTR,
        INDENT_LEVEL_ATTR: INDENT_LEVEL_ATTR,
        AKN_ORDERED_ANNEX_LIST: AKN_ORDERED_ANNEX_LIST,
        AKN_NUMBERED_PARAGRAPH: AKN_NUMBERED_PARAGRAPH,
        COUNCIL_INSTANCE: COUNCIL_INSTANCE,
        INLINE_FROM_MATCH: INLINE_FROM_MATCH,
        BOGUS: BOGUS,
        TD: TD,
        WRP: WRP
    };
});

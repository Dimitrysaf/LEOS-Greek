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
define(function listItemNumberModule(require) {
    "use strict";

    var UTILS = require("core/leosUtils");
    var leosPluginUtils = require("plugins/leosPluginUtils");
    var leosTrackChanges = require("plugins/leosTrackChanges/leosTrackChanges");
    var ckEditor;
    var defaultList = [];
    var listNumberConfig;
    var numberingConfigs;

    var sequenceMap = [
        {
            type: "ALPHA_LOWER_PARENTHESIS",
            inDefault: true,
            format: "x",
            prefix: "(",
            suffix: ")",
            name: 'Alphabets',
            generator: function generateSequenceForAlpha(list, item, idx) {
                return this.prefix+this.format.replace('x', generateAlpha(idx))+this.suffix;
            },
            getIndex: function getIndexForAlpha(number) {
                return generateAlphaIndex(number.replace('(', '').replace(')', ''));
            }
        }, {
            type: "ARABIC",
            inDefault: true,
            format: "x",
            prefix: "",
            suffix: "",
            name: 'Arabic',
            generator: function generateSequenceForArabic(list, item, idx) {
                return this.prefix+this.format.replace('x', idx + 1)+this.suffix;
            },
            getIndex: function getIndexForArabic(number) {
                if (isNaN(number)) {
                    return -1;
                }
                return Number(number);
            }
        }, {
            type: "ARABIC_PARENTHESIS",
            inDefault: true,
            format: "x",
            prefix: "(",
            suffix: ")",
            name: 'Arabic',
            generator: function generateSequenceForArabic(list, item, idx) {
                return this.prefix+this.format.replace('x', idx + 1)+this.suffix;
            },
            getIndex: function getIndexForArabic(number) {
                number = number.replace('(', '').replace(')', '');
                if (isNaN(number)) {
                    return -1;
                }
                return Number(number);
            }
        }, {
            type: "ARABIC_POSTFIXDOT",
            inDefault: true,
            format: "x",
            prefix: "",
            suffix: ".",
            name: 'Arabic',
            generator: function generateSequenceForArabic(list, item, idx) {
                return this.prefix+this.format.replace('x', idx + 1)+this.suffix;
            },
            getIndex: function getIndexForArabic(number) {
                number = number.replace('.', '');
                if (isNaN(number)) {
                    return -1;
                }
                return Number(number);
            }
        }, {
            type: "ROMAN_LOWER_PARENTHESIS",
            inDefault: true,
            format: "x",
            prefix: "(",
            suffix: ")",
            name: 'Roman',
            generator: function generateSequenceForRoman(list, item, idx) {
                return this.prefix+this.format.replace('x', romanize(idx + 1))+this.suffix;
            },
            getIndex: function getIndexForRoman(number) {
                return getRomanIndex(number.replace('(', '').replace(')', ''));
            }
        }, {
            type: "INDENT",
            inDefault: true,
            format: "-",
            prefix: "",
            suffix: "",
            name: 'IndentDash',
            generator: function generateSequenceForIndent(list, item, idx) {
                return this.prefix+this.format.replace('x', '-')+this.suffix;
            },
            getIndex: function getIndexForIndent(number) {
                return -1;
            }
        }
    ];

    function _getSequences(seqName) {
        if (seqName && seqName === 'Paragraph') {
            var paragraphTocItem = ckEditor.LEOS.tocItemsList.find(function(e){return e.aknTag === 'paragraph'});
            var paraNumTypeName = paragraphTocItem.autoNumbering.langNumConfigs
                .find(config => config.langGroup.toLowerCase() === ckEditor.LEOS.langGroup.toLowerCase())
                ?.numberingTypes[0];
            var paragraphNumType = numberingConfigs.find(function(e){return e.type === paraNumTypeName});
            var paragraphSequence = sequenceMap.find(function(el){return el.type === paraNumTypeName});
            paragraphSequence.format = 'x';
            paragraphSequence.suffix = paragraphNumType.suffix;
            return paragraphSequence;
        }
        else if (seqName) {
            return defaultList.find(function(el){return el.name === seqName});
        }
        else {//return all sequences
            return sequenceMap;
        }
    }

    /*
     * For given num param return roman number literal
     */
    function romanize(num) {
        var digits = String(+num).split(""),
            key = ["", "c", "cc", "ccc", "cd", "d", "dc", "dcc", "dccc", "cm", "", "x", "xx", "xxx", "xl", "l", "lx", "lxx",
                "lxxx", "xc", "", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"], roman = "", i = 3;
        while (i--) {
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        }
        return Array(+digits.join("") + 1).join("M") + roman;
    }

    /*
     * Returns the index of a roman number
     */
    function getRomanIndex(number) {
        var romanValues = {
            "i": 1, "ii": 2, "iii": 3, "iv": 4, "v": 5, "vi": 6, "vii": 7, "viii": 8, "ix": 9,
            "x": 10, "xx": 20, "xxx": 30, "xl": 40, "l": 50, "lx": 60, "lxx": 70, "lxxx": 80, "xc": 90,
            "c": 100, "cc": 200, "ccc": 300, "cd": 400, "d": 500, "dc": 600, "dcc": 700, "dccc": 800, "cm": 900
        }
        var start = 0; var end;
        var sum = 0;
        for (var indexLetter = 0; indexLetter < number.length; indexLetter++) {
            var letter = number.substring(indexLetter, indexLetter+1);
            if ("ivxlcdm".indexOf(letter) < 0) {
                return -1;
            }
        }
        while (start < number.length) {
            end = start + 3;
            if (end >= number.length) {
                end = number.length-1;
            }
            var piece = number.substring(start, end+1);
            while (!romanValues[piece]) {
                end--;
                piece = number.substring(start, end+1);
            }
            sum += romanValues[piece];
            start = end + 1;
        }
        return sum;
    }

    /*
     * Returns the array containing literals for alpha points
     */
    function generateAlpha(sequenceNumber) {
        var startOfAlfaNumerical = 97;
        var endOfAlfaNumerical = 123;
        var sequenceBase = endOfAlfaNumerical - startOfAlfaNumerical;
        var currentSequenceBase = 0;
        var sequence = [];
        while (true) {
            var currentLetter;
            if (currentSequenceBase > 0) {
                var currentBaseCount = parseInt(sequenceNumber / (Math.pow(sequenceBase, currentSequenceBase)));
                if (currentBaseCount === 0) {
                    break;
                }
                currentLetter = String.fromCharCode(currentBaseCount + startOfAlfaNumerical - 1);
            }

            if (currentSequenceBase === 0) {
                currentLetter = String.fromCharCode((sequenceNumber % sequenceBase) + startOfAlfaNumerical);
            }
            currentSequenceBase++;
            sequence.unshift(currentLetter);
        }
        return sequence.join("");
    }

    /*
     * Returns the index of an alpha number
     */
    function generateAlphaIndex(number) {
        var mult = 1;
        var cumulator = 0;
        for (var idxLetter = number.length-1; idxLetter >= 0; idxLetter--) {
            var letterValue = number.charCodeAt(idxLetter)-96;
            if (letterValue <= 0 || letterValue >= 27) {
                return -1;
            }
            cumulator += (letterValue) * mult;
            mult *= 26;
        }
        return cumulator;
    }

    /*
     * To identify the sequence first point in the list is used
     */
    function identifySequence(listItems, currentNestingLevel) {
        return getSequenceFromDefaultList(currentNestingLevel);
    }

    function _initialize(editor) {
        ckEditor = editor;
        editor.on("instanceReady", _initializeDefaultList);
    }

    /*
     * initialize default sequence list by sequence map
     */
    function _initializeDefaultList(event) {
        var editor = event.editor;
        var sequences = _getSequences();
        var articleType = leosPluginUtils.getArticleType(editor.element, editor.LEOS.articleTypesConfig);
        listNumberConfig = editor.LEOS.listNumberConfig[articleType];
        numberingConfigs = editor.LEOS.numberingConfigs;
        for (var i = 0; i < listNumberConfig.length; i++) {
            if (sequences[i].inDefault) {
                var numberType = numberingConfigs.find(function(e){return e.type === listNumberConfig[i].numberingType});
                var defaultListItem = sequences.find(function(e){return e.type ===  numberType.type});
                defaultListItem.prefix = numberType.prefix;
                defaultListItem.suffix = numberType.suffix;
                defaultList[listNumberConfig[i].depth-1] = defaultListItem;
            }
        }
    }

    /*
     * Get sequence type from default sequence list
     */
    function getSequenceFromDefaultList(currentNestingLevel) {
        var sequenceType = '';
        if (currentNestingLevel > defaultList.length || !defaultList[currentNestingLevel - 1]) {
            sequenceType = _getSequences('IndentDash');
            defaultList[currentNestingLevel - 1] = sequenceType;
        } else {
            sequenceType = defaultList[currentNestingLevel - 1];
        }
        return sequenceType;
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

    /*
     * Called to update numbering, changed from indent plugin or context menu
     */
    function _updateNumbers(orderedLists, seqNum) {
        for (var ii = 0; ii < orderedLists.length; ii++) {
            var orderedList = orderedLists[ii];
            var currentNestingLevel = getNestingLevelForOl(orderedList);
            var listItems = _removeCrossHeadingsFromListItems(orderedList.children);
            var sequence = '';
            if (typeof seqNum === 'undefined' || !seqNum) {
                sequence = identifySequence(listItems, currentNestingLevel);
            } else {
                sequence = seqNum;
            }
            (UTILS.getElementOrigin(orderedList) && UTILS.getElementOrigin(orderedList) === 'ec' &&
              ckEditor.LEOS.instanceType === UTILS.COUNCIL_INSTANCE)
                ? _doMandateNum(listItems, sequence)
                : _doProposalNum(orderedList, listItems, sequence);
        }
    }

    function _getSequence(orderedList) {
        var currentNestingLevel = getNestingLevelForOl(orderedList);
        var listItems = _removeCrossHeadingsFromListItems(orderedList.children);
        var sequence = identifySequence(listItems, currentNestingLevel);
        if (currentNestingLevel === 0) {
            sequence = _getSequences('Paragraph');
        }
        return sequence;
    }

    function _isFistElement(orderedList, number) {
        var currentNestingLevel = getNestingLevelForOl(orderedList);
        var listItems = _removeCrossHeadingsFromListItems(orderedList.children);
        var sequence = identifySequence(listItems, currentNestingLevel);
        if (currentNestingLevel === 0) {
            sequence = _getSequences('Paragraph');
        }
        return (currentNestingLevel === 0 && sequence.getIndex(number) === 1);
    }

    function _removeCrossHeadingsFromListItems(listItems) {
        var sortedListItems = [];
        for (var i=0; i<listItems.length; i++) {
            if (_isPoint(listItems[i])) {
                sortedListItems.push(listItems[i]);
            }
        }
        return sortedListItems;
    }

    function _isPoint(element) {
        var isLi = leosPluginUtils.getElementName(element) === leosPluginUtils.HTML_POINT;
        var crossheadingAttr = element.getAttribute(leosPluginUtils.CROSSHEADING_LIST_ATTR);
        var dataAknElementAttr = element.getAttribute(leosPluginUtils.DATA_AKN_ELEMENT);

        if (element && isLi && (dataAknElementAttr == null || dataAknElementAttr.toLowerCase() != leosPluginUtils.SUBPARAGRAPH.toLowerCase()) && (crossheadingAttr == null || crossheadingAttr != leosPluginUtils.LIST)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    * default numbering
    */
    function _updateNumbersByDefault(orderedLists) {
        for (var ii = 0; ii < orderedLists.length; ii++) {
            var orderedList = orderedLists[ii];
            var listItems = orderedList.children;
            for (var jj = 0; jj < listItems.length; jj++) {
                if (_isPoint(listItems[jj])) {
                    listItems[jj].setAttribute(leosPluginUtils.DATA_AKN_NUM, '#') && listItems[jj].setAttribute(leosPluginUtils.DATA_AKN_ELEMENT, leosPluginUtils.POINT);
                }
            }
        }
    }

    function _doProposalNum(orderedList, listItems, sequence) {
        var newIdx = 0;
        var offset = 0;
        for (var idx = 0; idx < listItems.length; idx++) {
            if (!(listItems[idx].getAttribute('contenteditable') === "false") && !(listItems[idx].getAttribute('data-akn-num') === '\u2610') && !(listItems[idx].getAttribute('data-akn-num') === '\u2611')) {
                var numID = listItems[idx].getAttribute(leosPluginUtils.DATA_AKN_NUM_ID);
                var number = listItems[idx].getAttribute(leosPluginUtils.DATA_AKN_NUM);

                var previousItem = listItems[idx-1];
                if (!!previousItem && previousItem.getAttribute(leosPluginUtils.DATA_AKN_NUM_ID) === numID && previousItem.getAttribute(leosPluginUtils.DATA_AKN_NUM) === number) {
                    listItems[idx].removeAttribute("data-akn-num");
                    listItems[idx].removeAttribute("data-akn-num-id");
                    listItems[idx].removeAttribute("data-akn-content-id");
                    listItems[idx].removeAttribute("data-akn-mp-id");
                    listItems[idx].removeAttribute("data-akn-tc-original-number");
                    var softAttributes = ["data-akn-attr-softuser", "data-akn-attr-softdate", "data-akn-attr-softaction",
                        "data-akn-attr-softactionroot", "data-akn-attr-softmove_label", "data-akn-attr-softmove_from", "data-akn-attr-softmove_to"];
                    for (var attrName of softAttributes) {
                        listItems[idx].removeAttribute(attrName);
                    }
                    listItems[idx].classList.remove("selectedMovedElement");
                    var tcAttributes = ["data-akn-action", "data-akn-uid", "title", "data-wsc-ignore-checking"];
                    for (var attrName of tcAttributes) {
                        listItems[idx].removeAttribute(attrName);
                    }
                    var tcNumberingAttributes= ["data-akn-action-number", "data-akn-uid-number", "title-number", "data-akn-tc-original-number"];
                    for (var attrName of tcNumberingAttributes) {
                        listItems[idx].removeAttribute(attrName);
                    }
                    var tcEnterAttributes = ["data-akn-action-enter", "data-akn-uid-enter", "title-enter"];
                    for (var attrName of tcEnterAttributes) {
                        listItems[idx].removeAttribute(attrName);
                    }
                }

                // To keep the num id on indentation and avoid diffing issues
                var originNumID = listItems[idx].getAttribute(leosPluginUtils.DATA_INDENT_ORIGIN_NUM_ID);
                if (numID && numID.startsWith(leosPluginUtils.DELETED)) {
                    listItems[idx].setAttribute(leosPluginUtils.DATA_AKN_NUM_ID, numID.replaceAll(leosPluginUtils.DELETED,''));
                    listItems[idx].removeAttribute("data-akn-num-attr-softaction");
                }
                if (!!originNumID) {
                    listItems[idx].setAttribute(leosPluginUtils.DATA_AKN_NUM_ID, originNumID);
                }
                var previousNumber = listItems[idx].getAttribute(leosPluginUtils.DATA_AKN_NUM);
                // Original number should be changed
                var originalNumber = listItems[idx].getAttribute(leosTrackChanges.core.DATA_AKN_TC_ORIGINAL_NUMBER);
                if (offset > 0 && originalNumber && originalNumber !== leosTrackChanges.core.NEW) {
                    var originalNumberIndex = sequence.getIndex(originalNumber);
                    if (originalNumberIndex >= 0) {
                        listItems[idx].setAttribute(leosTrackChanges.core.DATA_AKN_TC_ORIGINAL_NUMBER, sequence.generator(orderedList, listItems[idx], originalNumberIndex+offset-1));
                    }
                }
                if (offset != 0 && !listItems[idx].getAttribute(leosTrackChanges.core.ACTION_ATTR) && !listItems[idx].getAttribute(leosTrackChanges.core.DATA_AKN_ACTION_NUMBER)) {
                    previousNumber = sequence.generator(orderedList, listItems[idx], newIdx);
                }
                if (sequence.type !== "INDENT" && listItems[idx].getAttribute(leosTrackChanges.core.DATA_AKN_RENUMBER) === leosTrackChanges.core.ACCEPT) {
                    offset++;
                    previousNumber = sequence.generator(orderedList, listItems[idx], newIdx);
                    listItems[idx].setAttribute(leosTrackChanges.core.DATA_AKN_TC_ORIGINAL_NUMBER, previousNumber);
                    listItems[idx].removeAttribute(leosTrackChanges.core.DATA_AKN_RENUMBER);
                }
                if (sequence.type !== "INDENT" && listItems[idx].getAttribute(leosTrackChanges.core.DATA_AKN_RENUMBER) === leosTrackChanges.core.REJECT) {
                    offset--;
                    listItems[idx].remove();
                } else if (listItems[idx].getAttribute(leosTrackChanges.core.DATA_AKN_ACTION_ENTER) !== leosTrackChanges.core.DELETE_ACTION
                    && !(listItems[idx].getAttribute(leosPluginUtils.ID) && listItems[idx].getAttribute(leosPluginUtils.ID).startsWith(leosPluginUtils.MOVED))) {
                    sequence && listItems[idx].setAttribute(leosPluginUtils.DATA_AKN_NUM, sequence.generator(orderedList, listItems[idx], newIdx)) && listItems[idx].setAttribute(leosPluginUtils.DATA_AKN_ELEMENT, leosPluginUtils.POINT);
                    ckEditor.fire("handleTcIndent", {data: listItems[idx], previousNumber: previousNumber});
                    newIdx++;
                }
            }
        }
    }

    function _doMandateNum(listItems, sequence) {
        for (var jj = 0; jj < listItems.length; jj++) {
            if (!UTILS.getElementOrigin(listItems[jj])) {
                sequence && listItems[jj].setAttribute(leosPluginUtils.DATA_AKN_NUM, sequence.format.replace('x', '#')) && listItems[jj].setAttribute(leosPluginUtils.DATA_AKN_ELEMENT, leosPluginUtils.POINT);
            }
        }
    }

    return {
        init: _initialize,
        getSequences: _getSequences,
        updateNumbers: _updateNumbers,
        updateNumbersByDefault: _updateNumbersByDefault,
        getSequence: _getSequence,
        isFistElement: _isFistElement
    };
});
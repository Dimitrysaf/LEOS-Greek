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
define(function leosUtilsModule(require) {
    "use strict";

    // load module dependencies
    require("dateFormat");
    var log = require("logger");
    var lodash = require('lodash');
    //var $ = require("jquery");
    var CKEDITOR = require("promise!ckEditor");
    var REGEX_ORIGIN = new RegExp("[leos:|data-](\\w-?)*origin");
    var ZERO_WIDTH_SPACE = "^\u200B{7}$";
    
    var COUNCIL_INSTANCE = "COUNCIL";
    // configuration

    var PARAGRAPH_POINT_TAG = "LI";
    var SUBPARAGRAPH_SUBPOINT_TAG = "P";
    var DIV_TAG = "DIV";
    var TABLE_TAG = "TABLE";
    var TABLE_CELL_TAG = "TD";
    var TABLE_CELL_HEADER_TAG = "TH";
    var LINE_BREAK_TAG = "BR";
    var BOLD_TEXT_TAG = "STRONG";
    var EMPHATIZED_TEXT_TAG = "EM";
    var SUB_TEXT_TAG = "SUB";
    var SUP_TEXT_TAG = "SUP";
    var SPAN_TAG = "SPAN";
    var HEADING_TAG = "H2";
    var HEADING = "heading";
    var NUM = "num";
    var PARAGRAPH = "paragraph";
    var BLOCKCONTAINER = "blockcontainer";
    var LEVEL = "level";
    var DOCPURPOSE = "docPurpose";
    var ID = "id";
    var KEYS = {
        "KEY_DELETE": 46,
        "KEY_ENTER": 13,
        "KEY_BACKSPACE": 8,
        "KEY_V": 86,
        "KEY_X": 88
    }
    var SPELLCHECKER = {
        disabled: "disabled",
        qas: "qas",
        wsc: "wsc"
    }

    function _getParentElement(connector) {
        var element = null;
        if (connector) {
            var id = connector.getParentId();
            element = connector.getElement(id);
        }
        return element;
    }


    function _getElementOrigin(element) {
        var attrs = element instanceof CKEDITOR.dom.element ? element.$.attributes : element.attributes;
        for (var idx = 0; idx < attrs.length; idx++) {
            if (attrs[idx].name.match(REGEX_ORIGIN)) {
                return attrs[idx].value;
            }
        }
        return null;
    }

    function _isEmptyElement(elmnt) {
        var el = elmnt;
        if(elmnt.tagName == undefined && elmnt.length > 0 && !!elmnt[0].tagName ){
            el = elmnt[0];
        }
        function _getParentTocItem(el, tocItemsList) {
            var currentElem = el;
            var parentTocItem;
            do {
                parentTocItem = tocItemsList.find(function(elem) {
                    return lodash.camelCase(elem.aknTag).toLowerCase() === currentElem.parentElement.tagName.toLowerCase()
                        // Added title tag special condition in the scope of LEOS-6070
                        || (lodash.camelCase(elem.aknTag).toLowerCase() === 'title' && currentElem.parentElement.tagName.toLowerCase() === 'akntitle');
                });
                currentElem = currentElem.parentElement;
            } while (!parentTocItem && currentElem.parentElement);
            return parentTocItem;
        }
        function _containsOnlyChildrenOf(element, tagElements) {
            for (var j = 0; j < element.children.length; j++) {
                if (!tagElements.includes(element.children[j].tagName)) { return false; }
            }
            return true;
        }
        function _containsOnlyEmptyElts(element) {
            if (element.childNodes.length > 0) {
                for (var j = 0; j < element.childNodes.length; j++) {
                    if (element.childNodes[j].nodeType === Node.TEXT_NODE) {
                        if (element.childNodes[0].textContent.trim() !== '') {
                            return false;
                        }
                    } else if (element.childNodes[j].tagName !== LINE_BREAK_TAG) {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        }
        var childElementsToBeChecked = [LINE_BREAK_TAG, BOLD_TEXT_TAG, EMPHATIZED_TEXT_TAG, SUB_TEXT_TAG, SUP_TEXT_TAG, SPAN_TAG];
        var elementsToBeChecked = [PARAGRAPH_POINT_TAG, SUBPARAGRAPH_SUBPOINT_TAG];
        if (el.tagName === HEADING_TAG && CKEDITOR.currentInstance) {
            var tocItem = _getParentTocItem(el, CKEDITOR.currentInstance.LEOS.tocItemsList);
            if (tocItem && tocItem.itemHeading === "MANDATORY") {
                elementsToBeChecked.push(HEADING_TAG);
            }
        } else if (el.tagName === DIV_TAG && el.parentElement?.getAttribute("data-akn-name") === "recital") {
            elementsToBeChecked.push(DIV_TAG);
        }
        if (elementsToBeChecked.includes(el.tagName)) {
            var trimmedInnerText = $.trim(el.innerText);
            if (!trimmedInnerText || trimmedInnerText.match(ZERO_WIDTH_SPACE)) {
                if ((el.tagName === PARAGRAPH_POINT_TAG || el.tagName === SUBPARAGRAPH_SUBPOINT_TAG)
                    && el.parentElement 
                    && ((el.parentElement.tagName === TABLE_CELL_TAG &&
                        (!el.parentElement.hasAttribute('data-akn-name') || el.parentElement.getAttribute('data-akn-name') !== 'signature'))
                        || el.parentElement.tagName === TABLE_CELL_HEADER_TAG)) {
                    return false;
                } else if (el.children.length > 0 && _containsOnlyChildrenOf(el, childElementsToBeChecked)
                    && (el.previousElementSibling && el.previousElementSibling.tagName === TABLE_TAG)) {
                    return false;
                } else if (el.children.length > 0 && el.children[0].tagName === HEADING_TAG) {
                    return el.children[0].innerText.trim().length === 0;
                } else {
                    return el.children.length === 0 || _containsOnlyChildrenOf(el, childElementsToBeChecked);
                }
            }
            if (_containsOnlyEmptyElts(el)) {
                return true;
            }
        }
        return false;
    }

    function _setItemInStorage(key, value) {
        var storage = window.sessionStorage;
        if(storage) {
            storage.setItem(key, value);
        }
    }

    function _getItemStorage(key) {
        var storage = window.sessionStorage;
        if(storage) {
            return storage.getItem(key);
        }
        return "";
    }

    function _clearItemStorage() {
        var storage = window.sessionStorage;
        if(storage) {
            storage.clear();
        }
    }

    function _formatDate(date) {
        var options = {
            hourCycle: 'h23',
            hour: '2-digit',
            minute: '2-digit'
        };
        var day = date.getDate(), month = date.getMonth()+1, year = date.getFullYear();
        return ""+zeroPad(day)+"/"+zeroPad(month)+"/"+year+" "+date.toLocaleTimeString([], options);
    }

    function zeroPad(num) {
        return String("0"+num).slice(-2);
    }

    function _toIsoString(date) {
        var tzo = -date.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function(num) {
                return (num < 10 ? '0' : '') + num;
            };

        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            dif + pad(Math.floor(Math.abs(tzo) / 60)) +
            ':' + pad(Math.abs(tzo) % 60);
    }

    function _getElementTagName($element) {
        if ($element.get()[0]) {
            return $element.get()[0].tagName.toLowerCase();
        }
    }

    function _getParentWrapper($element, tocItemsList) {
        var $parent = _getWrapper($element, tocItemsList);
        return $parent ? $parent : null;
    }

    function _getWrapper($element, tocItemsList) {
        var wrapperTag = _getElementTagName($element);
        var wrapperElement = tocItemsList.find(function (elem) {
            return lodash.camelCase(elem.aknTag).toLowerCase() === wrapperTag;
        });

        if (wrapperElement) {
            return $element;
        } else {
            wrapperTag =  _getElementTagName(($element.parent()));
            if(wrapperTag === NUM) {
                return;
            }
            var parentElement = tocItemsList.find(function (elem) {
                return lodash.camelCase(elem.aknTag).toLowerCase() === wrapperTag;
            });
            if(parentElement && parentElement.root) {
                return $element.parent();
            } else {
                return _getWrapper($element.parent(), tocItemsList);
            }
        }
    }

    function _generateTrackChangesStyles(currentUserId, proposalRef, isTrackChangesShowed, uidAttr, actionAttr) {
        var isDocTcStyle = actionAttr.startsWith("leos:");
        var usersUid = [currentUserId];
        $("[" + uidAttr.replace("leos:", "leos\\:") + "]").each(function() {
            var userUid = $(this).attr(uidAttr); // Retrieve user and add it to users array if not exists
            if (userUid && $.inArray(userUid, usersUid) === -1) {
                usersUid.push(userUid);
            }
        });
        $("[" + uidAttr.replace("leos:", "leos\\:") + "-number" + "]").each(function() {
            var userUid = $(this).attr(uidAttr + "-number"); // Retrieve user and add it to users array if not exists
            if (userUid && $.inArray(userUid, usersUid) === -1) {
                usersUid.push(userUid);
            }
        });
        var tcShowStyle = "";
        for (var i = 0; usersUid.length > i; i++) {
            var userColors = _generateColors(usersUid[i].repeat(5) + proposalRef);
            if (isDocTcStyle) {
                tcShowStyle += "paragraph:has(> num) subparagraph[" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] + "'][leos\\:action-enter='insert']:before " +
                    "{" +
                    "content: '↵'; margin-left: 40px; min-width: 15px; color: " + userColors[0] + "; " +
                    "float: left; border: 0pt; padding-top: 6pt;" +
                    "}\n";
                tcShowStyle += "level:has(> num) subparagraph[" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] + "'][leos\\:action-enter='insert']:before " +
                    "{" +
                    "content: '↵'; min-width: 15px; color: " + userColors[0] + "; " +
                    "float: left; border: 0pt; padding-top: 6pt;" +
                    "}\n";
                tcShowStyle += "paragraph:not(:has(> num > ins)) subparagraph[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "'][leos\\:tc-original-number='NEW']:before, " +
                    "paragraph[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "'][leos\\:tc-original-number='NEW']:not(:has(> num > ins)):before, " +
                    "paragraph[" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] + "'][leos\\:tc-original-number='UNNUMBERED']:not(:has(> num > ins)):before, " +
                    "paragraph[" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] + "'][leos\\:tc-original-number='NEW']:not(:has(> num > ins)):before, " +
                    "paragraph:not(:has(> num)) subparagraph[" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] + "']" + "[leos\\:action-enter='insert']:before, " +
                    "level:not(:has(> num)) subparagraph[" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] + "'][leos\\:action-enter='insert']:before " +

                    "{" +
                    "content: '↵'; min-width: 15px; color: " + userColors[0] + "; " +
                    "float: left; border: 0pt; padding-top: 6pt;" +
                    "}\n";
                tcShowStyle += "aknp[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "'][leos\\:tc-original-number='NEW']:not(:has(> num > ins)):before, " +
                    "aknp[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "'][leos\\:tc-original-number='UNNUMBERED']:not(:has(> num > ins)):before " +
                    "{" +
                    "content: '↵'; min-width: 15px; color: " + userColors[0] + "; " +
                    "float: left; border: 0pt; padding-top: 1pt;" +
                    "}\n";
                tcShowStyle += "paragraph:not(:has(> num)) subparagraph[" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] + "'][leos\\:action-enter='delete']:before, " +
                    "paragraph[" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] + "'][leos\\:action-enter='delete']:not(:has(> num)):before " +
                    "{" +
                    "content: '↰'; min-width: 15px; color: " + userColors[0] + "; " +
                    "float: left; border: 0pt; padding-top: 6pt;" +
                    "}\n";
                tcShowStyle += "aknp[" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] + "'][leos\\:action-enter='delete']:not(:has(> num)):before " +
                    "{" +
                    "content: '↰'; min-width: 15px; color: " + userColors[0] + "; " +
                    "float: left; border: 0pt;" +
                    "}\n";
                tcShowStyle += "ins img { display:inline-block !important; border:" + (isTrackChangesShowed ? "2px solid rgba(0, 255, 0, 0.5)" :"none") + " !important;}";
            } else {
                tcShowStyle += "article > ol > li[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "'][data-akn-tc-original-number='NEW']:not([data-akn-num]):before, " +
                    "li > ol > li[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "'][data-akn-tc-original-number='NEW']:not([data-akn-num]):before, " +
                    "p[data-akn-name='aknParagraph'][" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] +"'][data-akn-tc-original-number='NEW']:not([data-akn-num]):before, " +
                    "p[data-akn-element='subparagraph'][" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] +"'][data-akn-action-enter='insert']:not([data-akn-num]):before, " +
                    "li[data-akn-element='subparagraph'][" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] +"'][data-akn-action-enter='insert']:not([data-akn-num]):before, " +
                    "p[data-akn-name='subparagraph'][" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] +"'][data-akn-action-enter='insert']:not([data-akn-num]):before, " +
                    "li[data-akn-name='subparagraph'][" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] +"'][data-akn-action-enter='insert']:not([data-akn-num]):before, " +
                    "li[data-akn-element='paragraph'][" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] +"'][data-akn-action-enter='insert']:not([data-akn-num]):before {" +
                    "content: '↵' !important; min-width: 15px !important; color: " + userColors[0] + " !important; " +
                    "float: left !important; text-decoration: none !important;" +
                    "}\n";
                tcShowStyle += "article > ol > li[" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] + "'][data-akn-action-enter='delete']:not([data-akn-num]):before, " +
                    "li > ol > li[" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] + "'][data-akn-action-enter='delete']:not([data-akn-num]):before, " +
                    "ol > li > p[" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] + "'][data-akn-action-enter='delete']:not([data-akn-num]):before, " +
                    "p[data-akn-element='subparagraph'][" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] +"'][data-akn-action-enter='delete']:not([data-akn-num]):before, " +
                    "li[data-akn-element='subparagraph'][" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] +"'][data-akn-action-enter='delete']:not([data-akn-num]):before, " +
                    "p[data-akn-name='subparagraph'][" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] +"'][data-akn-action-enter='delete']:not([data-akn-num]):before, " +
                    "p[data-akn-name='aknParagraph'][" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] +"'][data-akn-action-enter='delete']:not([data-akn-num]):before, " +
                    "li[data-akn-name='subparagraph'][" + uidAttr.replace("leos:", "leos\\:") + "-enter='" + usersUid[i] +"'][data-akn-action-enter='delete']:not([data-akn-num]):before {" +
                    "content: '↰' !important; min-width: 15px !important; color: " + userColors[0] + " !important; " +
                    "float: left !important; text-decoration: none !important;" +
                    "}\n";
                tcShowStyle += "article > ol > li[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "'][data-akn-action-number='delete'][data-akn-num]:not([data-akn-action-enter='delete']):not([data-akn-element='subparagraph']):before, " +
                    "li > ol > li[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "'][data-akn-action-number='delete'][data-akn-num]:not([data-akn-action-enter='delete']):not([data-akn-element='subparagraph']):before {" +
                    "content: attr(data-akn-num); min-width: 40px; text-decoration: line-through; color: " + userColors[0] + "; " +
                    "float: left; border: 0pt" +
                    "}\n";
                tcShowStyle += "article > ol > li[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "'][data-akn-action-number='delete'][data-akn-num][data-akn-action-enter='delete']:before, " +
                    "li > ol > li[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "'][data-akn-action-number='delete'][data-akn-num][data-akn-action-enter='delete']:before, " +
                    "ul > li[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "'][data-akn-action-number='delete'][data-akn-num][data-akn-action-enter='delete']:before {" +
                    "content: '↰' attr(data-akn-num); min-width: 40px; text-decoration: line-through; color: " + userColors[0] + "; " +
                    "float: left; border: 0pt" +
                    "}\n";
            }
            tcShowStyle += "[" + uidAttr.replace("leos:", "leos\\:") + "='" + usersUid[i] + "'], " +
                "[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "']:before { color: " + userColors[0] + " !important; &:hover, span." +
                (isDocTcStyle ? "MathJax_CHTML" : "cke_widget_mathjax") + ":hover { background-color: " + userColors[1] + "; } " +
                "  &:has([" + uidAttr.replace("leos:", "leos\\:") + "='" + usersUid[i] + "']:hover):hover:not([id*=revision]) { background-color: white; }" +
                " &:has([" + uidAttr.replace("leos:", "leos\\:") + "='" + usersUid[i] + "']:hover):not(&:hover):not([id*=revision]) { background-color:" +
                " white;  }"+
                " &:not(:has([" + uidAttr.replace("leos:", "leos\\:") + "='" + usersUid[i] + "']:hover)):not(&:hover):not([id*=revision]) { background-color: white;  }" +
                "}\n";
            tcShowStyle += "tr[" + uidAttr.replace("leos:", "leos\\:") + "='" + usersUid[i] + "'] { background-color: " + userColors[1] + "; }\n";
        }
        var tcHiddenStyle = "";
        tcHiddenStyle = (isDocTcStyle ? "ins, [" : "[") + actionAttr.replace("leos:", "leos\\:") + "='insert'] { text-decoration: none !important; }\n";
        tcHiddenStyle += (isDocTcStyle ? "del, [" : "[") + actionAttr.replace("leos:", "leos\\:") + "='delete'] { display: none; }\n";
        tcHiddenStyle += "tr[" + actionAttr.replace("leos:", "leos\\:") + "='insert'] { box-shadow: none !important; }\n";
        tcHiddenStyle += (isDocTcStyle ? "ins mref, ins authorialnote, ins span.MathJax_CHTML " :
                "[" + actionAttr + "='insert'] mref, [" + actionAttr + "='insert'] span.authorialnote, [" + actionAttr + "='insert'] span.cke_widget_mathjax ") +
            "{ box-shadow: none !important; }\n";
        tcHiddenStyle += isDocTcStyle ?
            "aknp:after {content: attr(next-aknp)}\n" +
            ":is([leos\\:action-enter='delete']:not(:has(> list)), [leos\\:action-enter='delete'] > list > subparagraph, " +
                    ":is(point,indent):has(> num > [leos\\:action-enter='delete']):not(:has(> list)), " +
                    "point:has(> num > [leos\\:action-enter='delete']) > list > subparagraph" +
                "):not(:has(aknp > img, > img)) {display:none !important}\n" : "";
        if (isTrackChangesShowed) {
            return tcShowStyle;
        } else {
            var tcStyle = tcHiddenStyle;
            tcStyle += "#contributionViewMainContainer {\n";
            tcStyle += tcShowStyle;
            tcStyle += (isDocTcStyle ? "del, [" : "[") + actionAttr.replace("leos:", "leos\\:") + "='delete'] { display: inline-block; }\n";
            tcStyle += "}\n";
            return tcStyle;
        }
    }

    function _generateColors(str) {
        for (var i = 0, hashCode = BigInt(0); i < str.length; hashCode = BigInt(str.charCodeAt(i++)) + ((hashCode << BigInt(5)) - hashCode));
        var hue = (((hashCode === -BigInt(0) || hashCode < BigInt(0)) ? -hashCode : hashCode) % BigInt(360)).toString();
        return ["hsl(" + hue + ", 100%, 35%)", "hsl(" + hue + ", 100%, 90%)"];
    }

    function _cleanUpElementFragment(str) {
        return str.replace(/>\n\s*/g, ">").replace(/<guidance.*<\/guidance>/g, '');
    }

    function _getDocContainer() {
        var docContainer = document.getElementById("docContainer");
        return docContainer.parentElement.classList?.contains("main-container") ? docContainer.parentElement : docContainer;
    }

    function _getElementPosition(element) {
        /*var x = 0, y = 0;
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent
        } while (element);
        return [x, y];*/
        var docContainer = _getDocContainer();
        var position = element.getBoundingClientRect();
        return [position.left + docContainer.scrollLeft, position.top + docContainer.scrollTop];
    }

    function _isMouseOutsideEditor(editor) {
        var element = editor.container.$;
        var positionEditor = this.getElementPosition(element);
        var left = positionEditor[0], right = left + parseInt(window.getComputedStyle(element).width);
        var top = positionEditor[1], bottom = top + parseInt(window.getComputedStyle(element).height);
        var mouseX = editor.LEOS.mousePosition[0], mouseY = editor.LEOS.mousePosition[1];
        return mouseX <= left || mouseX >= right || mouseY <= top || mouseY >= bottom;
    }

    function _removeZeroWidthSpaces(elementId) {
        $("#" + elementId).find("*").addBack().contents().filter(function () {
            if (this.nodeType === Node.TEXT_NODE && this.textContent) {
                return this.textContent.match(ZERO_WIDTH_SPACE);
            }
            return false;
        }).remove();
        $("#" + elementId).parent().contents().filter(function () {
            if (this.nodeType === Node.TEXT_NODE && this.textContent) {
                return this.textContent.match(ZERO_WIDTH_SPACE);
            }
            return false;
        }).remove();
    }

    function _getHtmlDocFromMatch(tcElement, regex, editor) {
        const matches = tcElement.$.innerHTML.match(regex);
        if (matches) {
            tcElement.$.innerHTML = matches.join('');
        }
        var data = {
            dataValue: tcElement.$.innerHTML,
            filter: editor.filter
        }
        var transformedFragment = editor.fire('toHtml', data);

        return new DOMParser().parseFromString(transformedFragment.dataValue, 'text/html');
    }

    return {
        getParentElement: _getParentElement,
        getElementOrigin : _getElementOrigin,
        isEmptyElement: _isEmptyElement,
        setItemInStorage : _setItemInStorage,
        getItemStorage : _getItemStorage,
        clearItemStorage : _clearItemStorage,
        formatDate : _formatDate,
        getElementTagName : _getElementTagName,
        getParentWrapper : _getParentWrapper,
        toIsoString : _toIsoString,
        generateTrackChangesStyles : _generateTrackChangesStyles,
        cleanUpElementFragment: _cleanUpElementFragment,
        getDocContainer: _getDocContainer,
        getElementPosition: _getElementPosition,
        isMouseOutsideEditor: _isMouseOutsideEditor,
        removeZeroWidthSpaces: _removeZeroWidthSpaces,
        getHtmlDocFromMatch: _getHtmlDocFromMatch,
        COUNCIL_INSTANCE : COUNCIL_INSTANCE,
        KEYS: KEYS,
        PARAGRAPH: PARAGRAPH,
        NUM: NUM,
        ID: ID,
        HEADING: HEADING,
        SPELLCHECKER: SPELLCHECKER,
        BLOCKCONTAINER: BLOCKCONTAINER,
        LEVEL: LEVEL,
        DOCPURPOSE: DOCPURPOSE
    };
});

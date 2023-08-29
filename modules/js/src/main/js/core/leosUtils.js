/*
 * Copyright 2022 European Commission
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
    //var $ = require("jquery");
    var CKEDITOR = require("promise!ckEditor");
    var REGEX_ORIGIN = new RegExp("[leos:|data-](\\w-?)*origin");
    
    var COUNCIL_INSTANCE = "COUNCIL";
    // configuration

    var PARAGRAPH_POINT_TAG = "LI";
    var SUBPARAGRAPH_SUBPOINT_TAG = "P";
    var TABLE_TAG = "TABLE";
    var TABLE_CELL_TAG = "TD";
    var TABLE_CELL_HEADER_TAG = "TH";
    var LINE_BREAK_TAG = "BR";
    var BOLD_TEXT_TAG = "STRONG";
    var EMPHATIZED_TEXT_TAG = "EM";
    var SUB_TEXT_TAG = "SUB";
    var SUP_TEXT_TAG = "SUP";
    var HEADING_TAG = "H2";
    var NUM = "num";
    var KEYS = {
        "KEY_DELETE": 8,
        "KEY_BACKSPACE": 46,
        "KEY_X": 88,
        "KEY_ENTER": 13
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

    function _registerEmptyTrimSelector(tocItemsList) {
        jQuery.extend(jQuery.expr[':'], {
            emptyTrim: function (el) {
                var elementsToBeChecked = [PARAGRAPH_POINT_TAG, SUBPARAGRAPH_SUBPOINT_TAG];
                var childElementsToBeChecked = [LINE_BREAK_TAG, BOLD_TEXT_TAG, EMPHATIZED_TEXT_TAG, SUB_TEXT_TAG, SUP_TEXT_TAG];
                if (el.tagName === HEADING_TAG) {
                    var tocItem = _getParentTocItem(el, tocItemsList);
                    if (tocItem && tocItem.itemHeading === "MANDATORY") {
                        elementsToBeChecked.push(HEADING_TAG);
                    }
                }
                if (elementsToBeChecked.includes(el.tagName)) {
                    if(!$.trim(el.innerText)) {
                        if ((el.tagName === PARAGRAPH_POINT_TAG || el.tagName === SUBPARAGRAPH_SUBPOINT_TAG)
                                && (el.parentElement.tagName === TABLE_CELL_TAG || el.parentElement.tagName === TABLE_CELL_HEADER_TAG)) {
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
                    if(el.childNodes[0].nodeName === LINE_BREAK_TAG) {
                        return true;
                    }
                }
                return false;
            }
        });
    }

    function _getParentTocItem(el, tocItemsList) {
        var currentElem = el;
        var parentTocItem;
        do {
            parentTocItem = tocItemsList.find(function (elem) {
                return elem.aknTag.toLowerCase() === currentElem.parentElement.tagName.toLowerCase()
                // Added title tag special condition in the scope of LEOS-6070
                || (elem.aknTag.toLowerCase() === 'title' && currentElem.parentElement.tagName.toLowerCase() === 'akntitle');
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
            return elem.aknTag.toLowerCase() === wrapperTag;
        });

        if (wrapperElement) {
            return $element;
        } else {
            wrapperTag =  _getElementTagName(($element.parent()));
            if(wrapperTag === NUM) {
                return;
            }
            var parentElement = tocItemsList.find(function (elem) {
                return elem.aknTag.toLowerCase() === wrapperTag;
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
        if (isTrackChangesShowed) {
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
            var tcStyle = "";
            for (var i = 0; usersUid.length > i; i++) {
                var userColors = (usersUid[i] !== "willajh") ? _generateColors(usersUid[i].repeat(5) + proposalRef) : ["hsl(330, 100%, 50%)", "hsl(330, 100%, 90%)"];
                tcStyle += "[" + uidAttr.replace("leos:", "leos\\:") + "='" + usersUid[i] + "'], " +
                    "[" + uidAttr.replace("leos:", "leos\\:") + "-number='" + usersUid[i] + "']:before { color: " + userColors[0] + " !important; &:hover, span." +
                    (isDocTcStyle ? "math" : "cke_widget_mathjax") + ":hover { background-color: " + userColors[1] + "; } }\n";
                tcStyle += "tr[" + uidAttr.replace("leos:", "leos\\:") + "='" + usersUid[i] + "'] { background-color: " + userColors[1] + "; }\n";
            }
        } else {
            tcStyle = (isDocTcStyle ? "ins, [" : "[") + actionAttr.replace("leos:", "leos\\:") + "='insert'] { text-decoration: none !important; }\n";
            tcStyle += (isDocTcStyle ? "del, [" : "[") + actionAttr.replace("leos:", "leos\\:") + "='delete'] { display: none; }\n";
            tcStyle += "tr[" + actionAttr.replace("leos:", "leos\\:") + "='insert'] { box-shadow: none !important; }\n";
            tcStyle += (isDocTcStyle ? "ins mref, ins authorialnote, ins span.math " :
                    "[" + actionAttr + "='insert'] mref, [" + actionAttr + "='insert'] span.authorialnote, [" + actionAttr + "='insert'] span.cke_widget_mathjax ") +
                "{ box-shadow: none !important; }\n";
        }
        return tcStyle;
    }

    function _generateColors(str) {
        for (var i = 0, hashCode = BigInt(0); i < str.length; hashCode = BigInt(str.charCodeAt(i++)) + ((hashCode << BigInt(5)) - hashCode));
        var hue = (((hashCode === -BigInt(0) || hashCode < BigInt(0)) ? -hashCode : hashCode) % BigInt(360)).toString();
        return ["hsl(" + hue + ", 100%, 35%)", "hsl(" + hue + ", 100%, 90%)"];
    }

    function _cleanUpElementFragment(str) {
        return str.replace(/>\n\s*/g, ">");
    }

    return {
        getParentElement: _getParentElement,
        getElementOrigin : _getElementOrigin,
        registerEmptyTrimSelector: _registerEmptyTrimSelector,
        setItemInStorage : _setItemInStorage,
        getItemStorage : _getItemStorage,
        clearItemStorage : _clearItemStorage,
        formatDate : _formatDate,
        getElementTagName : _getElementTagName,
        getParentWrapper : _getParentWrapper,
        toIsoString : _toIsoString,
        generateTrackChangesStyles : _generateTrackChangesStyles,
        cleanUpElementFragment: _cleanUpElementFragment,
        COUNCIL_INSTANCE : COUNCIL_INSTANCE,
        KEYS: KEYS
    };
});

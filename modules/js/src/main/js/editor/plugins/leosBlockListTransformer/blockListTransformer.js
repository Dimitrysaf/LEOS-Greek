/*
 * Copyright 2017 European Commission
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
define(function blockListTransformer(require) {
    "use strict";
    var STAMPIT = require("stampit");
    var LOG = require("logger");
    
    var DATA_AKN_NUM = "data-akn-num";
    var DATA_AKN_NUM_ID = "data-akn-num-id";
    var DATA_AKN_MP_ID = "data-akn-mp-id";
    var DATA_NUM_ORIGIN = "data-num-origin";
    var DATA_MP_ORIGIN = "data-mp-origin";
    var DATA_ORIGIN = "data-origin";

//-----------------------------
    var DATA_AKN_ACTION_FOR_NUMBER = "data-akn-action-for-number";
    var DATA_AKN_UID_NUMBER = "data-akn-uid-number";
    var TITLE_NUMBER = "title-number";
    var DATA_AKN_TC_ORIGINAL_NUMBER = "data-akn-tc-original-number";
    var DATA_AKN_EDITABLE = "data-akn-attr-editable";
    var LEOS_ORIGINAL_DEPTH_ATTR = "leos:originaldepth";
    var DATA_INDENT_LEVEL = "data-indent-level";

    var DATA_INDENT_NUMBERED = "data-indent-numbered";
    var LEOS_INDENT_LEVEL = "leos:indent-level";
    var LEOS_INDENT_NUMBERED = "leos:indent-numbered";
    var DATA_INDENT_ORIGIN_LEVEL = "data-indent-origin-indent-level";
    var DATA_INDENT_ORIGIN_NUMBER = "data-indent-origin-num";
    var DATA_INDENT_ORIGIN_NUMBER_ID = "data-indent-origin-num-id";
    var DATA_INDENT_ORIGIN_NUMBER_ORIGIN = "data-indent-origin-num-origin";
    var DATA_INDENT_ORIGIN_TYPE = "data-indent-origin-type";
    var DATA_INDENT_UNUMBERED_PARAGRAPH = "data-indent-unumbered-paragraph";
    var DATA_AKN_CROSS_HEADING_TYPE = "data-akn-crossheading-type";
    var DATA_AKN_ATTR_RENUMBERED = "data-akn-attr-renumbered";
    var LEOS_CROSS_HEADING_TYPE = "leos:crossheading-type";
    var DATA_LIST_CROSS_HEADING_PATH = "list/crossheading";
    var LEOS_INDENT_ORIGIN_LEVEL = "leos:indent-origin-indent-level";
    var LEOS_INDENT_ORIGIN_NUMBER = "leos:indent-origin-num";
    var LEOS_INDENT_ORIGIN_NUMBER_ID = "leos:indent-origin-num-id";
    var LEOS_INDENT_ORIGIN_NUMBER_ORIGIN = "leos:indent-origin-num-origin";
    var LEOS_INDENT_ORIGIN_TYPE = "leos:indent-origin-type";
    var LEOS_INDENT_UNUMBERED_PARAGRAPH = "leos:indent-unumbered-paragraph";
    var DATA_REFERS_TO = "refersto";
    var LEOS_REFERS_TO = "refersTo";

    var DATA_AKN_SOFTACTION = "data-akn-attr-softaction";
    var DATA_AKN_SOFTACTION_ROOT = "data-akn-attr-softactionroot";
    var DATA_AKN_SOFTUSER = "data-akn-attr-softuser";
    var DATA_AKN_SOFTDATE = "data-akn-attr-softdate";
    var DATA_AKN_SOFTMOVE_TO = "data-akn-attr-softmove_to";
    var DATA_AKN_SOFTMOVE_FROM = "data-akn-attr-softmove_from";
    var DATA_AKN_SOFTMOVE_LABEL = "data-akn-attr-softmove_label";
    var DATA_AKN_SOFTTRANS_FROM = "data-akn-attr-softtrans_from";
    var DATA_AKN_NUM_SOFTACTION = "data-akn-num-attr-softaction";
    var DATA_AKN_NUM_SOFTACTION_ROOT = "data-akn-num-attr-softactionroot";
    var DATA_AKN_NUM_SOFTUSER = "data-akn-num-attr-softuser";
    var DATA_AKN_NUM_SOFTDATE = "data-akn-num-attr-softdate";
    var DATA_AKN_ACTION_FOR_NUMBER = "data-akn-action-for-number";

    var DATA_AKN_TC_ORIGINAL_NUMBER = "data-akn-tc-original-number";
    var DATA_AKN_TC_ENTER_DELETED = "data-akn-tc-enter-deleted";
    var NEW = "NEW";
    var UNNUMBERED = "UNNUMBERED";
//------------------------
    // Checks if an element is a text element or an inline element
    function _isTextOrInlineElement(element) {
        var elementName = _getElementName(element);
        return ((elementName === 'text') || CKEDITOR.dtd.$inline.hasOwnProperty(elementName));
    }

    // Parse all the children of a cell (td,th or caption) and map it directly to the Akn cell if these are NOT inline elements
    // All other inline elements should be mapped into Akn p elements
    function _createNestedChildrenFromHtmlToAkn(element, rootPath) {
        var that = this;
        var children = element.children;

        // If they are text or inline elements, they should be included in an Akn p element
        // This p element should be added only once
        if (children.some(_isTextOrInlineElement, that)) {
            that.mapToChildProducts(element, {
                toPath: rootPath,
                toChild: 'mp',
                attrs: [{
                    from: DATA_AKN_MP_ID,
                    to: "xml:id",
                    action: "passAttributeTransformer"
                },{
                    from: DATA_MP_ORIGIN,
                    to: "leos:origin",
                    action: "passAttributeTransformer"
                }]
            });
        }

        children.forEach(function(childElement) {
            var childElementName = _getElementName(childElement);

            // If there are text elements, they should be included in an Akn p element
            if (childElementName === 'text') {
                that.mapToChildProducts(element, {
                    toPath: rootPath + '/mp',
                    toChild: 'text',
                    toChildTextValue: childElement.value
                });
                // If they are inline elements, they should be included in an Akn p element
            } else if (CKEDITOR.dtd.$inline.hasOwnProperty(childElementName)) {
                that.mapToNestedChildProduct(childElement, {
                    toPath: rootPath + '/mp'
                });
                // Other elements are put in the akn rootPath
            } else {
                that.mapToNestedChildProduct(childElement, {
                    toPath: rootPath
                });
            }
        });
    }

    function _getElementName(element) {
        var elementName = null;
        if (element instanceof CKEDITOR.htmlParser.element) {
            elementName = element.name;
        } else if (element instanceof CKEDITOR.htmlParser.text) {
            elementName = "text";
        } else {
            elementName = "unknown";
        }
        return elementName;
    };

    var anchor = function(content) {
        return "^" + content + "$";
    };

    var blockListTransformerStamp = STAMPIT().enclose(
            // executed on the instance creation
            function init() {
                var rootElementsForAkn = this.rootElementsForAkn;
                var rootElementsForHtml = this.rootElementsForHtml;
                
                // Regular expression section
                var PSR = "\/";
                //Html side
                var rootElementsForHtmlRegExp = new RegExp(anchor(rootElementsForHtml.join(PSR)));
                //Akn side
                var rootElementsForAknRegExpString = rootElementsForAkn.join(PSR);
                var rootElementsForAknRegExp = new RegExp(anchor(rootElementsForAknRegExpString));
                var rootElementsWithNumForAknRegExp = new RegExp(anchor(rootElementsForAkn.concat(["num"]).join(PSR)));
                var rootElementsWithNumAndTextForAknRegExp = new RegExp(anchor(rootElementsForAkn.concat(["num", "text"]).join(PSR)));
                var rootElementsWithMpForAknRegExp = new RegExp(anchor(rootElementsForAkn.concat(["mp"]).join(PSR)));
                var rootElementsWithMpAndTextForAknRegExp = new RegExp(anchor(rootElementsForAkn.concat(["mp/text"]).join(PSR)));
                //path = blockList/item/? (anything except text|num) - for e.g. nested list
                var rootElementsWithNestedElementForAknRegExp = new RegExp(anchor([rootElementsForAknRegExpString, "\/((?!text|num).)+"].join("")));

                //--added from hierarchicalElementTransformer.js --
                var rootElementsWithNumWithSpanForFromRegExp = new RegExp(anchor([rootElementsForAknRegExpString, "\/num\/span"].join("")));
                var rootElementsWithNumWithSpanTextForFromRegExp = new RegExp(anchor([rootElementsForAknRegExpString, "\/num\/span\/text"].join("")));
                //----

                // <= end of regular expression section
                
                // path section
                var rootElementsPathForHtml = rootElementsForHtml.join("/");
                var rootElementsPathForAkn = rootElementsForAkn.join("/");
                var rootElementsWithNumPathForAkn = [rootElementsPathForAkn, "num"].join("/");
                var rootElementsWithNumAndTextPathForAkn = [rootElementsWithNumPathForAkn, "text"].join("/");
                // <=end of path section

                var transformationConfig = {
                    akn: this.blockListTransformationConfig.akn,
                    html: this.blockListTransformationConfig.html,
                    attr: this.blockListTransformationConfig.attr,
                    transformer: {
                        to: {
                            action: function action(element) {
                                var path = element.transformationContext.elementPath;
                                if (rootElementsForAknRegExp.test(path)) {
                                    this.mapToProducts(element, [{
                                        toPath: rootElementsPathForHtml,
                                        attrs: [{
                                            from: "xml:id",
                                            to: "id",
                                            action: "passAttributeTransformer"
                                        },{
                                            from: "leos:origin",
                                            to: DATA_ORIGIN,
                                            action: "passAttributeTransformer"
                                        },{
                                            from: "leos:softuser",
                                            to: "data-akn-attr-softuser",
                                            action: "passAttributeTransformer"
                                        },{
                                            from: "leos:softdate",
                                            to: "data-akn-attr-softdate",
                                            action: "passAttributeTransformer"
                                        }, {
                                             from: "leos:action",
                                             to: DATA_AKN_ACTION_FOR_NUMBER,
                                             action: "passAttributeTransformer"
                                         }, {
                                             from: "leos:uid-number",
                                             to: DATA_AKN_UID_NUMBER,
                                             action: "passAttributeTransformer"
                                         }, {
                                             from: "leos:title-number",
                                             to: TITLE_NUMBER,
                                             action: "passAttributeTransformer"
                                         }, {
                                             from: "leos:tc-original-number",
                                             to: DATA_AKN_TC_ORIGINAL_NUMBER,
                                             action: "passAttributeTransformer"
                                         }]
                                    }]);

                                } else if(rootElementsWithNumForAknRegExp.test(path)) {
                                    this.mapToProducts(element, {
                                        toPath: rootElementsPathForHtml,
                                        attrs: [{
                                            from: "xml:id",
                                            to: DATA_AKN_NUM_ID,
                                            action: "passAttributeTransformer"
                                        },{
                                            from: "leos:origin",
                                            to: DATA_NUM_ORIGIN,
                                            action: "passAttributeTransformer"
                                        }]
                                    });
                                } else if (rootElementsWithNumAndTextForAknRegExp.test(path)) {
                                    this.mapToProducts(element, {
                                        toPath: rootElementsPathForHtml,
                                        toAttribute: DATA_AKN_NUM
                                    });
//-------------
                                } else if (rootElementsWithNumWithSpanForFromRegExp.test(path)) {
                                    this.mapToProducts(element, {
                                        toPath: rootElementsPathForHtml,
                                        attrs: [{
                                            from: "leos:action",
                                            to: DATA_AKN_ACTION_FOR_NUMBER,
                                            action: "passAttributeTransformer"
                                        }, {
                                            from: "leos:uid",
                                            to: DATA_AKN_UID_NUMBER,
                                            action: "passAttributeTransformer"
                                        }, {
                                            from: "leos:title",
                                            to: TITLE_NUMBER,
                                            action: "passAttributeTransformer"
                                        }, {
                                            from: "leos:tc-original-number",
                                            to: DATA_AKN_TC_ORIGINAL_NUMBER,
                                            action: "passAttributeTransformer"
                                        }]
                                    });
                                } else if (rootElementsWithNumWithSpanTextForFromRegExp.test(path)) {
                                    if (element.parent.attributes["leos:action"] === "delete") {
                                        this.mapToProducts(element, {
                                            toPath: rootElementsPathForHtml,
                                            attrs: [{
                                                to: DATA_AKN_NUM,
                                                toValue: UNNUMBERED,
                                                action: "passAttributeTransformer"
                                            }]
                                        });
                                    } else {
                                        this.mapToProducts(element, {
                                            toPath: rootElementsPathForHtml,
                                            toAttribute: DATA_AKN_NUM
                                        });
                                    }
//---------------
                                } else if(rootElementsWithMpForAknRegExp.test(path)) {
                                    this.mapToProducts(element, {
                                        toPath: rootElementsPathForHtml,
                                        attrs: [{
                                            from: "xml:id",
                                            to: DATA_AKN_MP_ID,
                                            action: "passAttributeTransformer"
                                        },{
                                            from: "leos:origin",
                                            to: DATA_MP_ORIGIN,
                                            action: "passAttributeTransformer"
                                        },{
                                            from: "leos:softuser",
                                            to: "data-akn-attr-softuser",
                                            action: "passAttributeTransformer"
                                        },{
                                            from: "leos:softdate",
                                            to: "data-akn-attr-softdate",
                                            action: "passAttributeTransformer"
//---------------------
                                        }, {
                                             from: "leos:action-number",
                                             to: DATA_AKN_ACTION_FOR_NUMBER,
                                             action: "passAttributeTransformer"
                                         }, {
                                             from: "leos:uid-number",
                                             to: DATA_AKN_UID_NUMBER,
                                             action: "passAttributeTransformer"
                                         }, {
                                             from: "leos:title-number",
                                             to: TITLE_NUMBER,
                                             action: "passAttributeTransformer"
                                         }, {
                                             from: "leos:tc-original-number",
                                             to: DATA_AKN_TC_ORIGINAL_NUMBER,
                                             action: "passAttributeTransformer"
                                         }]
//-------------
                                    });
                                } else if (rootElementsWithMpAndTextForAknRegExp.test(path)) {
                                    this.mapToChildProducts(element, {
                                        toPath: rootElementsPathForHtml,
                                        toChild: "text",
                                        toChildTextValue: element.value
                                    });
                                } else if (rootElementsWithNestedElementForAknRegExp.test(path)) {
                                    this.mapToNestedChildProduct(element, {
                                        toPath: rootElementsPathForHtml
                                    });
                                }
                            }
                        },
                        from: {
                            action: function action(element) {
                                var path = element.transformationContext.elementPath;
                                if (rootElementsForHtmlRegExp.test(path)) {
                                    if (element.attributes[DATA_AKN_NUM] && element.attributes[DATA_AKN_NUM] !== '\u2610' && element.attributes[DATA_AKN_NUM] !== '\u2611') {
                                        if (!element.attributes[DATA_AKN_ACTION_FOR_NUMBER]) {
                                            this.mapToProducts(element, [{
                                                toPath: rootElementsPathForAkn,
                                                attrs: [{
                                                    from: "id",
                                                    to: "xml:id",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_ORIGIN,
                                                    to: "leos:origin",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_EDITABLE,
                                                    to: "leos:editable",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: LEOS_ORIGINAL_DEPTH_ATTR,
                                                    to: LEOS_ORIGINAL_DEPTH_ATTR,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_LEVEL,
                                                    to: LEOS_INDENT_LEVEL,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_NUMBERED,
                                                    to: LEOS_INDENT_NUMBERED,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_ORIGIN_LEVEL,
                                                    to: LEOS_INDENT_ORIGIN_LEVEL,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_ORIGIN_NUMBER,
                                                    to: LEOS_INDENT_ORIGIN_NUMBER,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_ORIGIN_NUMBER_ID,
                                                    to: LEOS_INDENT_ORIGIN_NUMBER_ID,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_ORIGIN_NUMBER_ORIGIN,
                                                    to: LEOS_INDENT_ORIGIN_NUMBER_ORIGIN,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_ORIGIN_TYPE,
                                                    to: LEOS_INDENT_ORIGIN_TYPE,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_UNUMBERED_PARAGRAPH,
                                                    to: LEOS_INDENT_UNUMBERED_PARAGRAPH,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_REFERS_TO,
                                                    to: LEOS_REFERS_TO,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTACTION,
                                                    to: "leos:softaction",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTACTION_ROOT,
                                                    to: "leos:softactionroot",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTUSER,
                                                    to: "leos:softuser",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTDATE,
                                                    to: "leos:softdate",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTMOVE_TO,
                                                    to: "leos:softmove_to",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTMOVE_FROM,
                                                    to: "leos:softmove_from",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTMOVE_LABEL,
                                                    to: "leos:softmove_label",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTTRANS_FROM,
                                                    to: "leos:softtrans_from",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_ATTR_RENUMBERED,
                                                    to: "leos:renumbered",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_TC_ENTER_DELETED,
                                                    to: "leos:tc-enter-deleted",
                                                    action: "passAttributeTransformer"
                                                }]
                                            }, {
                                                toPath: [rootElementsPathForAkn, "num"].join("/"),
                                                attrs: [{
                                                    from: DATA_AKN_NUM_ID,
                                                    to: "xml:id",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_NUM_ORIGIN,
                                                    to: "leos:origin",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_NUM_SOFTACTION,
                                                    to: "leos:softaction",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_NUM_SOFTACTION_ROOT,
                                                    to: "leos:softactionroot",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_NUM_SOFTUSER,
                                                    to: "leos:softuser",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_NUM_SOFTDATE,
                                                    to: "leos:softdate",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_ACTION_FOR_NUMBER,
                                                    to: "leos:action",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_UID_NUMBER,
                                                    to: "leos:uid",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: TITLE_NUMBER,
                                                    to: "leos:title",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_TC_ORIGINAL_NUMBER,
                                                    to: "leos:tc-original-number",
                                                    action: "passAttributeTransformer"
                                                }]
                                            }, {
                                                toPath: [rootElementsPathForAkn, "num", "text"].join("/"),
                                                fromAttribute: DATA_AKN_NUM
                                            }]);
                                        } else {
                                            this.mapToProducts(element, [{
                                                toPath: rootElementsPathForAkn,
                                                attrs: [{
                                                    from: "id",
                                                    to: "xml:id",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_ORIGIN,
                                                    to: "leos:origin",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_EDITABLE,
                                                    to: "leos:editable",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: LEOS_ORIGINAL_DEPTH_ATTR,
                                                    to: LEOS_ORIGINAL_DEPTH_ATTR,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_LEVEL,
                                                    to: LEOS_INDENT_LEVEL,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_NUMBERED,
                                                    to: LEOS_INDENT_NUMBERED,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_ORIGIN_LEVEL,
                                                    to: LEOS_INDENT_ORIGIN_LEVEL,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_ORIGIN_NUMBER,
                                                    to: LEOS_INDENT_ORIGIN_NUMBER,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_ORIGIN_NUMBER_ID,
                                                    to: LEOS_INDENT_ORIGIN_NUMBER_ID,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_ORIGIN_NUMBER_ORIGIN,
                                                    to: LEOS_INDENT_ORIGIN_NUMBER_ORIGIN,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_ORIGIN_TYPE,
                                                    to: LEOS_INDENT_ORIGIN_TYPE,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_INDENT_UNUMBERED_PARAGRAPH,
                                                    to: LEOS_INDENT_UNUMBERED_PARAGRAPH,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_REFERS_TO,
                                                    to: LEOS_REFERS_TO,
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTACTION,
                                                    to: "leos:softaction",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTACTION_ROOT,
                                                    to: "leos:softactionroot",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTUSER,
                                                    to: "leos:softuser",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTDATE,
                                                    to: "leos:softdate",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTMOVE_TO,
                                                    to: "leos:softmove_to",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTMOVE_FROM,
                                                    to: "leos:softmove_from",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTMOVE_LABEL,
                                                    to: "leos:softmove_label",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_SOFTTRANS_FROM,
                                                    to: "leos:softtrans_from",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_ATTR_RENUMBERED,
                                                    to: "leos:renumbered",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_TC_ENTER_DELETED,
                                                    to: "leos:tc-enter-deleted",
                                                    action: "passAttributeTransformer"
                                                }]
                                            }, {
                                                toPath: [rootElementsPathForAkn, "num"].join("/"),
                                                attrs: [{
                                                    from: DATA_AKN_NUM_ID,
                                                    to: "xml:id",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_NUM_ORIGIN,
                                                    to: "leos:origin",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_NUM_SOFTACTION,
                                                    to: "leos:softaction",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_NUM_SOFTACTION_ROOT,
                                                    to: "leos:softactionroot",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_NUM_SOFTUSER,
                                                    to: "leos:softuser",
                                                    action: "passAttributeTransformer"
                                                }, {
                                                    from: DATA_AKN_NUM_SOFTDATE,
                                                    to: "leos:softdate",
                                                    action: "passAttributeTransformer"
                                                }]
                                            }]);
                                            var contentPath = rootElementsPathForAkn + "/num";
                                            if (element.attributes[DATA_AKN_TC_ORIGINAL_NUMBER] !== UNNUMBERED
                                                && element.attributes[DATA_AKN_TC_ORIGINAL_NUMBER] !== NEW) {
                                                this.mapToChildProducts(element, {
                                                    toPath: contentPath,
                                                    toChild: "span",
                                                    attrs: [{
                                                        to: "leos:action",
                                                        toValue: "delete",
                                                        action: "passAttributeTransformer"
                                                    }, {
                                                        from: DATA_AKN_UID_NUMBER,
                                                        to: "leos:uid",
                                                        action: "passAttributeTransformer"
                                                    }, {
                                                        from: TITLE_NUMBER,
                                                        to: "leos:title",
                                                        action: "passAttributeTransformer"
                                                    }, {
                                                        from: DATA_AKN_TC_ORIGINAL_NUMBER,
                                                        to: "leos:tc-original-number",
                                                        action: "passAttributeTransformer"
                                                    }]
                                                });
                                                this.mapToChildProducts(element, {
                                                    toPath: contentPath + "/span",
                                                    toChild: "text",
                                                    toChildTextValue: element.attributes[DATA_AKN_TC_ORIGINAL_NUMBER]
                                                });
                                            }
                                            if (element.attributes[DATA_AKN_NUM]) {
                                                this.mapToChildProducts(element, {
                                                    toPath: contentPath,
                                                    toChild: "span",
                                                    attrs: [{
                                                        from: DATA_AKN_ACTION_FOR_NUMBER,
                                                        to: "leos:action",
                                                        action: "passAttributeTransformer"
                                                    }, {
                                                        from: DATA_AKN_UID_NUMBER,
                                                        to: "leos:uid",
                                                        action: "passAttributeTransformer"
                                                    }, {
                                                        from: TITLE_NUMBER,
                                                        to: "leos:title",
                                                        action: "passAttributeTransformer"
                                                    }, {
                                                        from: DATA_AKN_TC_ORIGINAL_NUMBER,
                                                        to: "leos:tc-original-number",
                                                        action: "passAttributeTransformer"
                                                    }]
                                                });
                                                this.mapToChildProducts(element, {
                                                    toPath: contentPath + "/span",
                                                    toChild: "text",
                                                    toChildTextValue: element.attributes[DATA_AKN_NUM]
                                                });
                                            }
                                        }
                                    } else {
                                        this.mapToProducts(element, [{
                                            toPath: rootElementsPathForAkn,
                                            attrs: [{
                                                from: "id",
                                                to: "xml:id",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_ORIGIN,
                                                to: "leos:origin",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_EDITABLE,
                                                to: "leos:editable",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_INDENT_LEVEL,
                                                to: LEOS_INDENT_LEVEL,
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_INDENT_NUMBERED,
                                                to: LEOS_INDENT_NUMBERED,
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_INDENT_NUMBERED,
                                                to: LEOS_INDENT_NUMBERED,
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_INDENT_ORIGIN_LEVEL,
                                                to: LEOS_INDENT_ORIGIN_LEVEL,
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_INDENT_ORIGIN_NUMBER,
                                                to: LEOS_INDENT_ORIGIN_NUMBER,
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_INDENT_ORIGIN_NUMBER_ID,
                                                to: LEOS_INDENT_ORIGIN_NUMBER_ID,
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_INDENT_ORIGIN_NUMBER_ORIGIN,
                                                to: LEOS_INDENT_ORIGIN_NUMBER_ORIGIN,
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_INDENT_ORIGIN_TYPE,
                                                to: LEOS_INDENT_ORIGIN_TYPE,
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_REFERS_TO,
                                                to: LEOS_REFERS_TO,
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_SOFTACTION,
                                                to: "leos:softaction",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_SOFTACTION_ROOT,
                                                to: "leos:softactionroot",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_SOFTUSER,
                                                to: "leos:softuser",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_SOFTDATE,
                                                to: "leos:softdate",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_SOFTMOVE_TO,
                                                to: "leos:softmove_to",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_SOFTMOVE_FROM,
                                                to: "leos:softmove_from",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_SOFTMOVE_LABEL,
                                                to: "leos:softmove_label",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_SOFTTRANS_FROM,
                                                to: "leos:softtrans_from",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_ATTR_RENUMBERED,
                                                to: "leos:renumbered",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_ACTION_FOR_NUMBER,
                                                to: "leos:action-number",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_UID_NUMBER,
                                                to: "leos:uid-number",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: TITLE_NUMBER,
                                                to: "leos:title-number",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_TC_ORIGINAL_NUMBER,
                                                to: "leos:tc-original-number",
                                                action: "passAttributeTransformer"
                                            }, {
                                                from: DATA_AKN_TC_ENTER_DELETED,
                                                to: "leos:tc-enter-deleted",
                                                action: "passAttributeTransformer"
                                            }]
                                        }]);
                                    }

                                    /*
                                    this.mapToProducts(element, [{
                                        toPath: rootElementsPathForAkn,
                                        attrs: [{
                                            from: "id",
                                            to: "xml:id",
                                            action: "passAttributeTransformer"
                                        },{
                                            from: DATA_ORIGIN,
                                            to: "leos:origin",
                                            action: "passAttributeTransformer"
                                        },{
                                            to: "leos:softuser",
                                            from: "data-akn-attr-softuser",
                                            action: "passAttributeTransformer"
                                        },{
                                            to: "leos:softdate",
                                            from: "data-akn-attr-softdate",
                                            action: "passAttributeTransformer"
                                        }, {
                                             from: DATA_AKN_ACTION_FOR_NUMBER,
                                             to: "leos:action",
                                             action: "passAttributeTransformer"
                                         }, {
                                             from: DATA_AKN_UID_NUMBER,
                                             to: "leos:uid-number",
                                             action: "passAttributeTransformer"
                                         }, {
                                             from: TITLE_NUMBER,
                                             to: "leos:title",
                                             action: "passAttributeTransformer"
                                         }, {
                                             from: DATA_AKN_TC_ORIGINAL_NUMBER,
                                             to: "leos:tc-original-number",
                                             action: "passAttributeTransformer"
                                         }]
                                    }, {
                                        toPath: rootElementsWithNumPathForAkn,
                                        attrs: [{
                                            from: DATA_AKN_NUM_ID,
                                            to: "xml:id",
                                            action: "passAttributeTransformer"
                                        },{
                                            from: DATA_NUM_ORIGIN,
                                            to: "leos:origin",
                                            action: "passAttributeTransformer"
                                        }]
                                    }, {
                                        toPath: rootElementsWithNumAndTextPathForAkn,
                                        fromAttribute: DATA_AKN_NUM
                                    }]);
                                    */
                                    _createNestedChildrenFromHtmlToAkn.call(this, element, rootElementsPathForAkn);
                                }
                            }
                        }
                    }
                };

                this.getTransformationConfig = function() {
                    return transformationConfig;
                };
            });

    return blockListTransformerStamp;
});
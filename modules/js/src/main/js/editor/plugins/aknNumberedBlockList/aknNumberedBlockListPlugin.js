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
define(function aknNumberedBlockListPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var blockListTransformerStamp = require("plugins/leosBlockListTransformer/blockListTransformer");
    var identityHandler = require("plugins/leosAttrHandler/leosIdentityHandlerModule");
        var numberModule = require("plugins/leosNumber/listItemNumberModule");
    var unumberModule = require("plugins/leosUnumber/listUnumberModule");
    var leosPluginUtils = require("plugins/leosPluginUtils");

    var pluginName = "aknNumberedBlockList";
    var ORDERED_LIST_SELECTOR = "ol[data-akn-name='NumberedBlockList']";
    var config = { attributes: false, childList: true, subtree: true };

    
    var LOG = require("logger");

    var pluginDefinition = {
        init : function init(editor) {
            $(editor.element.$).on("keyup mouseup", null, [editor], _handleClickEvent);
            numberModule.init(editor);
            unumberModule.init(editor);
            //Go through ol elements to set "data-akn-name" attribute and through ascendant li elements to set "data-akn-num" attributes.
            editor.on("change", function(event) {
                _startObservingAllLists(event);
                if (event.editor.checkDirty()) {
                    event.editor.fire('lockSnapshot');
                    var jqEditor = $(event.editor.editable().$);

                    var ols = jqEditor.find("ol");
                    for (var i = 0; i < ols.length; i++) {
                        var idAttrValue = ols[i].getAttribute("id");
                        if (idAttrValue && $('[id="' + idAttrValue + '"]').length > 1) {
                            idAttrValue = identityHandler.generateId();
                            ols[i].setAttribute("id", idAttrValue);
                        }
                        ols[i].setAttribute("data-akn-name","NumberedBlockList");
                        var listItems = ols[i].children;
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
                            var numericSequence = jj + 1 + "."; //displayed as (1., 2., 3.) etc.
                            listItems[jj].setAttribute("data-akn-num",numericSequence);
                            listItems[jj].removeAttribute("data-akn-name"); //remove copied attribute from the parent
                            listItems[jj].removeAttribute("style");
                            if (event.editor.LEOS.isTrackChangesEnabled) {
                                event.editor.fire("handleTcIndent", { data: listItems[jj], previousNumber: previousNumber } );
                            }
                        }
                    }
                    event.editor.fire( 'unlockSnapshot' );
                }
            });
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
        akn : [BLOCKLIST,'[leos:listtype=Numbered]'].join(""),
        html : 'ol',
        attr : [ {
            akn : "xml:id",
            html : "id"
        }, {
            akn : "leos:origin",
            html : "data-origin"
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
        }, {
            akn : "leos:origin",
            html : "data-origin"
        }, {
            html : "data-akn-name=NumberedBlockList"
        }, {
        	akn : "leos:listtype=Numbered",
        }],
        sub : [{
            akn : "item",
            html : "ol/li",
            attr : [ {
                akn : "xml:id",
                html : "id"
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
            }, {
                akn : "leos:origin",
                html : "data-origin"
            }],
            sub : [{
                akn : "num",
                html : "ol/li",
                attr : [ {
                    akn : "xml:id",
                    html : "data-akn-num-id"
                }, {
                    akn : "leos:origin",
                    html : "data-num-origin"
                } ],
                sub: {
                    akn: "text",
                    html: "ol/li[data-akn-num]"
                }
            },{
                akn : "mp",
                html : "ol/li",
                attr : [{
                    akn : "xml:id",
                    html : "data-akn-mp-id"
                }, {
                    akn : "leos:origin",
                    html : "data-mp-origin"
                }],
                sub : {
                    akn: "text",
                    html: "ol/li/text"
                }
            }]
        }]
      },
      rootElementsForAkn : [ BLOCKLIST.toLowerCase(), "item" ],
      rootElementsForHtml : [ "ol", "li" ]
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
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
define(function leosTransformerPluginModule(require) {
    "use strict";

    var transformerStamp = require("transformer/transformer");

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var numberModule = require("plugins/leosNumber/listItemNumberModule");
    var UTILS = require("core/leosUtils");
    var leosPluginUtils = require("plugins/leosPluginUtils");

    var pluginName = "leosTransformer";
    var ORDERED_LIST_SELECTOR = "ol[data-akn-name='aknOrderedList']";

    var pluginDefinition = {
        init: function init(editor) {
            editor.on('toHtml', function(evt) {
                var fragment = evt.data.dataValue;
                var transformer = transformerStamp();
                var transformedFragment = transformer.transform({
                    transformationConfigResolver: editor.LEOS.profile.transformationConfigResolver,
                    direction: "to",
                    fragment: fragment,
                });
                return transformedFragment;
            }, null, null, 6);

            editor.on("toDataFormat", function(evt) {
                var fragment = evt.data.dataValue;
                _removeEmptyElements(fragment);
                var transformer = transformerStamp();
                transformer.transform({
                    transformationConfigResolver: editor.LEOS.profile.transformationConfigResolver,
                    direction: "from",
                    fragment: fragment
                });
            }, null, null, 14);
        }
    };

    function _removeEmptyElements(fragment){
        // fragment is CKEDITOR.htmlParser.element
        var htmlElement = fragment.getOuterHtml();
        var eventDataAsObj = _cleanElements(htmlElement);
        var toHtml = eventDataAsObj.html();
        fragment.setHtml(toHtml);
    }

    function _cleanElements(data) {
        var eventDataAsObject = $(data);
        var elementsToRemove =  eventDataAsObject
            .find("li, p[data-akn-id], h2[data-akn-heading-id], p[data-akn-num-id], p[data-akn-element='subparagraph'] ,p[data-akn-name='aknParagraph'], " +
                // added in #2738, check if it can be removed in #2739
                "p[data-akn-name='organization'], p[data-akn-name='role'], p[data-akn-name='person']")
            .find("*").addBack().filter(function() {
                return UTILS.isEmptyElement(this);
            });

        elementsToRemove.each(_checkEmptyAndRemove);

        /*
        - empty node is the last point of a List removing it means removing also the List.
        - the list contains an intro subparagraph remove it outside the list structure
        */
        var olOrderedList = eventDataAsObject.find("ol[data-akn-name='aknOrderedList']");
        if(!olOrderedList || olOrderedList.length == 0){
            olOrderedList = eventDataAsObject.find("ol[data-akn-name='aknAnnexOrderedList']");
        }
        olOrderedList.each(function( index, elem ){
            if (this.childElementCount == 1 && this.childNodes[0].getAttribute("data-akn-element") !== "point"){
                for (var i = 0; i < this.firstChild.childNodes.length; i++){
                    this.parentElement.appendChild(this.firstChild.childNodes[i]);
                }
                this.remove();
            }
        });

       resetNumberingOrderedList(eventDataAsObject);
       return eventDataAsObject;
    }

    function _checkEmptyAndRemove(index, elem){
        // do not delete if it is the last editable element in the CKEditor
        // if LI and it has attribute 'refersto', do not delete it
        var isPBeforeTable = $(elem).is('p') && $(elem).prev().is('table');
        var isGrandParentAnnexList = $(elem).parent().parent().attr('data-akn-name') === 'aknAnnexList';
        var isParentBlockContainer = $(elem).parent().attr('data-akn-name')==="blockContainer";
        isPBeforeTable = isPBeforeTable && !isGrandParentAnnexList && !isParentBlockContainer;
        // first condition added in #2738, check if it can be removed in #2739
        if ((leosPluginUtils.isDuplicatedSignatureElement(elem) ||
                ($(elem).parents('table').length === 0)
                && (!$(elem).attr("refersto") || $(elem).attr("refersto") === '~WRP')
                && !isPBeforeTable)
            && UTILS.isEmptyElement(elem) && ($.trim($(elem).text()) === '')) {
            var parent = $(elem).parent();
            $(elem).remove();
            _checkEmptyAndRemove(0, parent);
        }
    }

    function resetNumberingOrderedList(eventDataAsObject) {
        var elementWithoutAutoNum = eventDataAsObject.find('article[data-akn-attr-autonumbering=false]');
        var orderedLists = eventDataAsObject.find(ORDERED_LIST_SELECTOR);
        if (elementWithoutAutoNum && elementWithoutAutoNum.length > 0) {
            numberModule.updateNumbersByDefault(orderedLists);
        } else {
            numberModule.updateNumbers(orderedLists);
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    // return plugin module
    var pluginModule = {
        name: pluginName
    };

    return pluginModule;
});
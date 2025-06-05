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
define(function aknUnorderedListPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var $ = require('jquery');
    var leosHierarchicalElementTransformerStamp = require("plugins/leosHierarchicalElementTransformer/hierarchicalElementTransformer");
    var leosPluginUtils = require("plugins/leosPluginUtils");
    var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");
    var leosTrackChanges = require("plugins/leosTrackChanges/leosTrackChanges");

    var pluginName = "aknUnorderedList";

    var ENTER_KEY = 13;
    var INDENT_LIST_CMD_NAME = "leosIndentList";
    var iconIndentList = 'icons/indentedlist.png';

    var pluginDefinition = {
        init : function init(editor) {
            editor.ui.addButton(INDENT_LIST_CMD_NAME, {
                label: 'Insert List',
                command: INDENT_LIST_CMD_NAME,
                toolbar: 'unumberedList',
                icon: this.path + iconIndentList
            });

            editor.addCommand(INDENT_LIST_CMD_NAME, {});

            editor.on("change", resetDataAknNameForUnOrderedList, null, null, 0);
            editor.on("change", fireHandleTcIndent, null, null, 1);
            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : ENTER_KEY,
                action : _onEnterKey
            });
        }
    };

    function _onEnterKey(context) {
        var selectedElement = leosKeyHandler.getSelectedElement(context.selection);

        function isFirstLevelEmptyPoint() {
            return leosKeyHandler.isContentEmptyTextNode(selectedElement)
                && leosPluginUtils.getElementName(selectedElement) === leosPluginUtils.LIST_ELEMENT
                && !selectedElement.getParent().getAscendant(leosPluginUtils.UNORDERED_LIST_ELEMENT);
        }

        if (isFirstLevelEmptyPoint() || leosPluginUtils.isSubparagraph(selectedElement)) {
            context.event.cancel();
        }
    }

    function resetDataAknNameForUnOrderedList(event) {
        event.editor.fire( 'lockSnapshot' );
        var jqEditor = $(event.editor.editable().$);
        var unOrderedLists = jqEditor.find("ul");
        for (var ii = 0; ii < unOrderedLists.length; ii++) {
            var unOrderedList = unOrderedLists[ii];
            unOrderedList.setAttribute("data-akn-name", "aknUnorderedList");
            var listItems = unOrderedList.children;
            for (var jj = 0; jj < listItems.length; jj++) {
                listItems[jj].removeAttribute("data-akn-name");
            }

        }
        event.editor.fire( 'unlockSnapshot' );
    }

    /*
     * Fires handleTcIndent event to reject the attached number deletion track change when enter deletion track change is rejected.
     * 
     */
    function fireHandleTcIndent(event) {
        event.editor.fire( 'lockSnapshot' );
        var jqEditor = $(event.editor.editable().$);
        var unOrderedLists = jqEditor.find("*[data-akn-name='aknUnorderedList']");
        for (var ii = 0; ii < unOrderedLists.length; ii++) {
            var listItems = unOrderedLists[ii].children;
            for (var jj = 0; jj < listItems.length; jj++) {
                if (listItems[jj].getAttribute(leosTrackChanges.core.DATA_AKN_ACTION_ENTER) !== leosTrackChanges.core.DELETE_ACTION
                    && listItems[jj].getAttribute(leosPluginUtils.DATA_AKN_NUM)
                    && !(listItems[jj].getAttribute(leosPluginUtils.ID) && listItems[jj].getAttribute(leosPluginUtils.ID).startsWith(leosPluginUtils.MOVED))) {
                    event.editor.fire("handleTcIndent", {data: listItems[jj], previousNumber: "-"});
                }
            }
        }
        event.editor.fire( 'unlockSnapshot' );
    }

    function elementTagIndexProvider(element) {
        if (!!element.attributes[leosPluginUtils.DATA_AKN_ELEMENT] && element.attributes[leosPluginUtils.DATA_AKN_ELEMENT] === leosPluginUtils.INDENT) {
            return 1;
        } else if (element.name.toLowerCase() === leosPluginUtils.SUBPARAGRAPH.toLowerCase() ||
            (!!element.attributes[leosPluginUtils.DATA_AKN_ELEMENT] && element.attributes[leosPluginUtils.DATA_AKN_ELEMENT] === leosPluginUtils.SUBPARAGRAPH)) {
            return 2;
        } else {
            return 0;
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var leosHierarchicalElementTransformer = leosHierarchicalElementTransformerStamp({
        firstLevelConfig : {
            akn : 'list',
            html : 'ul',
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
                akn : "leos:softuser",
                html : "data-akn-attr-softuser"
            }, {
                akn : "leos:softdate",
                html : "data-akn-attr-softdate"
            }, {
                html : "data-akn-name=aknUnorderedList"
            }, {
                akn : "leos:action",
                html : "data-akn-action"
            }, {
                akn : "leos:uid",
                html : "data-akn-uid"
            } ]
        },
        rootElementsForFrom : [ "list",  { elementTags : ["point", "indent", "subparagraph"], elementTagIndexProvider : elementTagIndexProvider } ],
        contentWrapperForFrom : "subparagraph",
        rootElementsForTo : [ "ul", "li" ]
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
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
define(function leosSubElementMovePluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var $ = require("jquery");
    var LOG = require("logger");
    var UTILS = require("core/leosUtils");

    var pluginName = "leosSubElementMove";
    const DATA_ORIGIN = "data-origin";
    const EC_ORIGIN = "ec";
    const LS_ORIGIN = "ls";
    const MOVED_ELEMENT_CLASS = "selectedMovedElement";
    var trackChanges = require("plugins/leosTrackChanges/leosTrackChanges"), core = trackChanges.core;

    var pluginDefinition = {
        init: function init(editor) {
            editor.addCommand("moveTo", moveToCmd);
            addMoveToMenuItem(editor);

            editor.addCommand("moveHere", moveHereCmd);
            editor.addCommand("KeepSourceFormatting", KeepSourceFormattingCmd);
            //editor.addCommand("KeepText", KeepTextCmd);
            addMoveHereMenuItem(editor);

        }
    };

    function addMoveToMenuItem(editor) {
        if (editor.contextMenu) {
            LOG.debug("Adding Move to context menu item...");
            editor.addMenuGroup('moveToGroup');
            editor.addMenuItem('moveTo', {
                label: 'Move to',
                command: 'moveTo',
                group: 'moveToGroup'
            });

            editor.contextMenu.addListener(function (element) {
                if (editor.LEOS.isClonedProposal && ((element.hasAttribute(DATA_ORIGIN) &&
                    element.getAttribute(DATA_ORIGIN) === EC_ORIGIN)) &&
                    element.hasAttribute('data-akn-element') &&
                    element.getAttribute("data-akn-attr-softaction") !== "move_to" &&
                    element.getAttribute('data-akn-content-id') &&
                    element.getAttribute('data-akn-element') !== 'subparagraph') {
                    var selection = editor.getSelection();
                    if (selection.isCollapsed()) {
                        editor.getMenuItem("moveTo").label = 'Move this '.concat(element.getAttribute('data-akn-element'))
                            .concat(' to...');
                        return {moveTo: CKEDITOR.TRISTATE_OFF};
                    }
                }
            });
        }
    }

    function containsActionAttribute(element) {
        return element.getAttribute('data-akn-tc-original-number') && element.getAttribute('data-akn-tc-original-number') === core.NEW;
    }

    function addMoveHereMenuItem (editor) {
        if (editor.contextMenu) {
            LOG.debug("Adding Move here context menu item...");
            editor.addMenuGroup('moveHereGroup');
            editor.addMenuItems({
                moveHere: {
                    label: 'Move here',
                    command: 'moveHere',
                    group: 'moveHereGroup',
                    order: 1,
                    getItems : function() {
                        return {
                            KeepSourceFormatting : CKEDITOR.TRISTATE_OFF,
                            KeepText : CKEDITOR.TRISTATE_OFF,
                        };
                    }
                },
                KeepSourceFormatting: {
                    label: 'Keep source formatting',
                    command: 'KeepSourceFormatting',
                    group: 'moveHereGroup',
                }
            });

            editor.contextMenu.addListener(function (element) {
                if (editor.LEOS.isClonedProposal) {
                    var movedElement = _getMovedElement();
                    var isMovedElementSibling = ((element.hasClass(MOVED_ELEMENT_CLASS)) ||
                        (element.getNext() && element.getNext().type === CKEDITOR.NODE_ELEMENT && element.getNext().hasClass(MOVED_ELEMENT_CLASS)) ||
                        (element.getPrevious() && element.getPrevious().type === CKEDITOR.NODE_ELEMENT && element.getPrevious().hasClass(MOVED_ELEMENT_CLASS)));
                    if (movedElement && !isMovedElementSibling && containsActionAttribute(element)) {
                        editor.getMenuItem("KeepSourceFormatting").label = 'As ' + element.getAttribute('data-akn-element')
                        return {moveHere: CKEDITOR.TRISTATE_OFF};
                    }
                }
            });
        }
    }

    var moveToCmd = {
        exec: function executeCommandDefinition(editor) {
            var selection = editor.getSelection();
            var element = selection.getStartElement();
            UTILS.setItemInStorage("movedElement", element.getOuterHtml());
            element.setAttribute("class", MOVED_ELEMENT_CLASS);
            element.setAttribute("contenteditable", "false");
            //_setTrackChangesElement(element, editor);
        }
    }

    var moveHereCmd = {
        exec: function executeCommandDefinition(editor) {
        }
    }

    var KeepSourceFormattingCmd = {
        exec: function executeCommandDefinition(editor) {
            var movedElement = _getMovedElement();
            if(movedElement) {
                LOG.debug("Moved element is - " + movedElement.getAttribute('data-akn-element'));
                var selection = editor.getSelection();
                var element = selection.getStartElement();
                movedElement.getAttributeNames().forEach(attribute => element.setAttribute(attribute, movedElement.getAttribute(attribute)));
                movedElement.querySelectorAll("*").forEach(childElement => childElement.removeAttribute("id"));
                element.setHtml(movedElement.innerHTML);
                element.setAttribute("data-akn-num", element.getAttribute("data-akn-num"));
                element.setAttribute("data-num-origin", LS_ORIGIN);
                _setSoftMovedAttributes(editor, element);
                _setTrackChangesElement(element, editor);
                UTILS.clearItemStorage();
            }
        }
    }

    /*    var KeepTextCmd = {
            exec: function executeCommandDefinition(editor) {
                //TODO: implement
                var movedElement = _getMovedElement();
                if(movedElement) {
                    LOG.debug("Moved element is - " + movedElement.getAttribute('data-akn-element'));
                }
            }
        }*/

    function _getMovedElement() {
        var movedElement = UTILS.getItemStorage("movedElement");
        var wrapper = document.createElement('div');
        wrapper.innerHTML = movedElement;
        return wrapper.firstChild;
    }

    function _setTrackChangesElement(element, editor) {
        element.setAttribute(core.ACTION_ATTR, core.INSERT_ACTION);
        element.setAttribute(core.UID_ATTR, editor.LEOS.user.login);
    }

    function _setSoftMovedAttributes(editor, element) {
        var idAttr = element.getAttribute("id");
        var softActionAttrVal1 = element.getAttribute("data-akn-attr-softaction");
        if (!(softActionAttrVal1 && softActionAttrVal1 === "move_from")) {
            element.setAttribute("data-akn-attr-softaction", "move_from");
            element.setAttribute("data-akn-attr-softactionroot", "true");
            element.setAttribute("data-akn-attr-softmove_from", "movedX" + idAttr);
        }
        if(!idAttr.startsWith("tempX")) {
            element.setAttribute("id", "tempX" + idAttr);
        }

        // original element
        var originalMovedElement = document.getElementById(idAttr);

        var softActionAttrVal2 = originalMovedElement.getAttribute("data-akn-attr-softaction");
        var leosSoftActionAttrVal = originalMovedElement.getAttribute("leos:softmove_from");
        if (!((softActionAttrVal2 && softActionAttrVal2 === "move_from") || leosSoftActionAttrVal)) {
            originalMovedElement.setAttribute("data-akn-attr-softaction", "move_to");
            originalMovedElement.setAttribute("data-akn-attr-softactionroot", "true");
            originalMovedElement.setAttribute("data-akn-attr-softmove_to", idAttr);
            originalMovedElement.setAttribute("id", "movedX" + idAttr);
        } else {
            originalMovedElement.remove();
        }

    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    // return plugin module
    var pluginModule = {
        name: pluginName,
    };

    return pluginModule;
});
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
define(function aknContentPluginModule(require) {
    "use strict";

    // load module dependencies
    var UTILS = require("core/leosUtils");
    var leosPluginUtils = require("plugins/leosPluginUtils");
    var pluginTools = require("plugins/pluginTools");
    var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");

    var pluginName = "aknContent";
    var SHIFT_ENTER = CKEDITOR.SHIFT + UTILS.KEYS.KEY_ENTER;
    var CTRL_ENTER = CKEDITOR.CTRL + UTILS.KEYS.KEY_ENTER;

    var pluginDefinition = {
        init: function init(editor) {
            editor.on('key', _onKey, null, null, 0 );
            editor.on('beforeCommandExec', _onBeforeCommand, null, null, 0);

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : UTILS.KEYS.KEY_ENTER,
                action : _onEnterKey
            });

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : SHIFT_ENTER,
                action : _onShiftEnterKey
            });

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : CTRL_ENTER,
                action : _onCtrlEnterKey
            });
        }
    };

    function _onKey(event) {
        var keyCode = event.data && event.data.keyCode;
        if (!UTILS.KEYS.ARROW_KEYS.includes(keyCode)) {
            var selection = event.editor.getSelection();
            var ranges = selection && selection.getRanges();
            var range = ranges && ranges[0];
            if (_isFgrHcontainer(range) || _isSelectedElementWithId(selection, range)) {
                event.cancel();
            } else if (range && range.collapsed) {
                _preventAdjacentElementDeletion(keyCode, range, event);
            } else if (range && !range.collapsed) {
                _preventCrossSelection(range, event);
            }
        }
    }

    function _isFgrHcontainer(range) {
        var selectedElement = range && range.getCommonAncestor(true, true);
        var hcontainer = selectedElement && selectedElement.getAscendant(leosPluginUtils.HCONTAINER);
        return hcontainer && hcontainer.getAttribute('name') === leosPluginUtils.HCONTAINER_IMAGE;
    }

    function _isSelectedElementWithId(selection, range) {
        var selectedElement = selection.getSelectedElement();
        selectedElement = selectedElement ? selectedElement : range && range.getEnclosedNode();
        return selectedElement && selectedElement.type === CKEDITOR.NODE_ELEMENT &&
            (selectedElement.getAttribute('id') || selectedElement.find('[id]').count() > 0);
    }

    function _preventAdjacentElementDeletion(keyCode, range, event) {
        var nodeToDelete = keyCode === UTILS.KEYS.KEY_BACKSPACE ? range.getPreviousNode() :
            keyCode === UTILS.KEYS.KEY_DELETE ? range.getNextNode() : null;
        if (nodeToDelete && nodeToDelete.type === CKEDITOR.NODE_ELEMENT && nodeToDelete.getAttribute('id')) {
            event.cancel();
        }
    }

    function _preventCrossSelection(range, event) {
        range.shrink(CKEDITOR.SHRINK_ELEMENT, true);
        range.select();
        if (range.startContainer !== range.getCommonAncestor()) {
            event.cancel();
        }
    }

    function _onBeforeCommand(event) {
        if (event.data.name === 'cut') {
            var selection = event.editor.getSelection();
            var ranges = selection && selection.getRanges();
            var range = ranges && ranges[0];
            if (_isSelectedElementWithId(selection, range)) {
                event.cancel();
            } else if (range && !range.collapsed) {
                _preventCrossSelection(range, event);
            }
        }
    }

    function _onEnterKey(context) {
        context.event.cancel();
    }

    function _onShiftEnterKey(context) {
        context.event.cancel();
    }

    function _onCtrlEnterKey(context) {
        context.event.cancel();
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var transformationConfig = {
        akn: "mp",
        html: "p[data-akn-name=aknp]",
        attr: [
            {
                akn: "xml:id",
                html: "id"
            },
            {
                html: ["data-akn-name", "aknp"].join("=")
            },
            {
                akn: "style",
                html: "style"
            },
            {
                akn: "leos:update-translation",
                html: "data-akn-update-translation"
            }
        ],
        sub: {
            akn: "text",
            html: "p/text"
        }
    }

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    var pluginModule = {
        name: pluginName,
        transformationConfig: transformationConfig
    };

    return pluginModule;
});

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
define(function aknBlockSignatoryPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");

    var pluginName = "aknBlockSignatory";
    var ENTER_KEY = 13;
    var UNDERLINE = CKEDITOR.CTRL + 85;
    var BOLD = CKEDITOR.CTRL + 66;
    var ITALIC = CKEDITOR.CTRL + 73;
    var SHIFT_ENTER_KEY = CKEDITOR.SHIFT + ENTER_KEY;

    var pluginDefinition = {
        //requires : "widget,leosWidget",

        init: function init(editor) {
            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : ENTER_KEY,
                action : _onEnterKey
            });
            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : SHIFT_ENTER_KEY,
                action : _onShiftEnterKey
            });

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : UNDERLINE,
                action : _onCtrlUKey
            });

            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : BOLD,
                action : _onCtrlBKey
            });
            leosKeyHandler.on({
                editor : editor,
                eventType : 'key',
                key : ITALIC,
                action : _onCtrlIKey
            });

        }
    };

    function _onEnterKey(context) {
        context.event.cancel();
    }

    function _onShiftEnterKey(context) {
        context.event.cancel();
    }

    function _onCtrlUKey(context) {
        context.event.cancel();
    }

    function _onCtrlBKey(context) {
        context.event.cancel();
    }

    function _onCtrlIKey(context) {
        context.event.cancel();
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var SIGNATORY_NAME = "signatory";

    var transformationConfig = {
        akn: "block",
        html: "table",
        attr: [{
            akn: "xml:id",
            html: "id"
        }, {
            akn: ["name", SIGNATORY_NAME].join("="),
            html: ["data-akn-name", SIGNATORY_NAME].join("=")
        }, {
            akn : "leos:editable",
            html : "leos:editable"
        }, {
            akn : "leos:deletable",
            html : "leos:deletable"
        }, {
            akn : "leos:alternative",
            html : "leos:alternative"
        }, {
            akn : "leos:optionlist",
            html : "leos:optionlist"
        }, {
            akn : "leos:selectedoption",
            html : "leos:selectedoption"
        }],
        sub: [{
            akn: "block",
            html: "table/tbody",
            attr: [],
            sub: [{
                akn: "block",
                html: "table/tbody/tr",
                attr: []
            }]
        }]
    };

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    // return plugin module
    var pluginModule = {
        name: pluginName,
        transformationConfig: transformationConfig
    };

    return pluginModule;
});
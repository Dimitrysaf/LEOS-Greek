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
define(function aknClausePluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");

    var CKEDITOR = require("promise!ckEditor");

    var pluginName = "aknClause";

    var pluginDefinition = {
        init : function init(editor) {
        }
    };

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var transformationConfig = {
            akn : "clause",
            html : "div[data-akn-name=clause]",
            attr : [ {
                akn : "xml:id",
                html : "id"
            }, {
                akn : "leos:origin",
                html : "data-origin"
            }, {
                akn : "leos:deletable",
                html : "leos:deletable",
            }, {
                akn : "leos:editable",
                html : "leos:editable",
            }, {
                akn : "leos:alternative",
                html : "leos:alternative"
            }, {
                akn : "leos:optionlist",
                html : "leos:optionlist"
            }, {
                akn : "leos:selectedoption",
                html : "leos:selectedoption"
            }, {
                akn : "data-akn-original-option",
                html : "data-akn-original-option"
            }, {
                akn : "data-akn-action-alter",
                html : "data-akn-action-alter"
            }, {
                html : "data-akn-name=clause"
            }, {
                akn : "leos:softuser",
                html : "data-akn-attr-softuser"
            }, {
                akn : "leos:softdate",
                html : "data-akn-attr-softdate"
            }],
            sub: {
                akn: "content",
                html: "div",
                attr : [ {
                    akn : "xml:id",
                    html : "data-akn-content-id"
                }, {
                    akn : "leos:origin",
                    html : "data-content-origin"
                }],
                sub: {
                    akn: "mp",
                    html: "div/p",
                    attr : [ {
                        akn : "xml:id",
                        html : "data-akn-mp-id"
                    }, {
                        akn : "leos:origin",
                        html : "data-mp-origin"
                    }],
                    sub: {
                        akn: "text",
                        html: "div/p/text"
                    }
                }
            }
        };


    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    // return plugin module
    var pluginModule = {
        name : pluginName,
        transformationConfig: transformationConfig,
    };

    return pluginModule;
});
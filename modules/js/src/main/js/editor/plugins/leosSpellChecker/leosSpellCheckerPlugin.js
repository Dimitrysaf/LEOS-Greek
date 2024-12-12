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
define(function leosSpellCheckerPluginModule(require) {
    'use strict';

    var log = require("logger");
    var UTILS = require("core/leosUtils");
    var pluginTools = require('plugins/pluginTools');
    var pluginName = 'leosSpellChecker';

    function _addConfigQAS(doc, serviceUrl) {
        if (!doc.getElementById('qas-config')) {
            var script = doc.createElement('script');
            script.id = "qas-config"
            script.innerHTML = `{
                window.SPELLCHECKER_CONFIG = {
                    SUGGESTIONS_LIMIT: 5,
                    LANGUAGE: "en-GB", // LEOS will supply the language based on the document
                    API_URL: '${serviceUrl}', 
                    API_RESOURCE_PATH_CHECK: "/check", 
                    API_RESOURCE_PATH_LANGUAGES: "/languages", 
                    DISABLE_USER_CHOICE_LANGUAGE: false,// Disabled for cypress tests
                    DISABLE_USER_CHOICE_PROOFREADING_CHECKS: false,
                    isLeos: true
                };
            }`;
            doc.body.appendChild(script);
        }
    }

    function _addConfig(doc, serviceUrl) {
        if (!doc.getElementById('lsc-config')) {
            var script = doc.createElement('script');
            script.id = "lsc-config"
            script.innerHTML = `{
                window.WEBSPELLCHECKER_CONFIG = {
                    autoSearch: true,
                    enableAutoSearchIn: ['.cke_editable'],
                    autoDestroy: true,
                    enableGrammar: true,
                    disableDictionariesPreferences: true,
                    lang: 'en_GB',
                    ignoreAttributes: ['data-wsc-ignore-checking'],
                    serviceProtocol: '${serviceUrl.protocol.substring(0, serviceUrl.protocol.length - 1)}',
                    serviceHost: '${serviceUrl.hostname}',
                    servicePort: '${serviceUrl.port}',
                    servicePath: '${serviceUrl.pathname}'
                };
            }`;
            doc.body.appendChild(script);
        }
    }

    function _addScript(doc, sourceUrl) {
        if (!doc.getElementById('lsc-service')) {
            var script = doc.createElement('script');
            script.id = "lsc-service"
            script.addEventListener('error', _onErrorLoad, false);
            script.type = 'text/javascript';
            script.src = sourceUrl;
            script.async = true;
            doc.head.appendChild(script);
            function _onErrorLoad(event) {
                log.debug('Error occurred while loading script ', event);
            }
        }
    }

    var pluginDefinition = {
        init: function init(editor) {
            if (editor.LEOS.spellCheckerName === UTILS.SPELLCHECKER.wsc) {
                editor.disableAutoInline = true;
                editor.config.removePlugins = 'scayt,wsc';
                _addConfig(document, new URL(editor.LEOS.spellCheckerServiceUrl));
                _addScript(document, editor.LEOS.spellCheckerSourceUrl);
            }
            if (editor.LEOS.spellCheckerName === UTILS.SPELLCHECKER.qas) {
                editor.disableAutoInline = true;
                editor.config.removePlugins = 'scayt,wsc';
                _addConfigQAS(document, editor.LEOS.spellCheckerServiceUrl);
            }
        }
    };

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var pluginModule = {
        name: pluginName
    };
    return pluginModule;
});
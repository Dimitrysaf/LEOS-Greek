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
define(function pluginToolsModule(require) {
    "use strict";

    // load module dependencies
    var LOG = require("logger");
    var CKEDITOR = require("promise!ckEditor");
    var leosTools = require("editor/core/leosTools");
    var transformationConfigManager = require("transformer/transformationConfigManager");
    var pluginsRoot = "plugins";

    function addPlugin(pluginName, pluginDefinition) {
        var pluginFolder = [pluginsRoot, pluginName].join("/");
        var pluginFile = [pluginName, "Plugin.js"].join("");
        var pluginPath = [pluginFolder, pluginFile].join("/");
        var pluginUrl = leosTools.toUrl(pluginPath);
        LOG.debug("Adding plugin to CKEditor:", pluginName, "=>", pluginUrl);
        CKEDITOR.plugins.addExternal(pluginName, pluginUrl, "");
        CKEDITOR.plugins.add(pluginName, pluginDefinition);
    }

    /*
     * Adds the external plugins to the ckEditor
     * @externalPluginsNames - array with the plugins names
     */
    function addExternalPlugins(externalPlugins) {
        var externalPluginNames = ""
        var loadPromises = externalPlugins.map(
            function (externalPlugin) {
                var pluginName = externalPlugin.name;
                var pluginUrl = externalPlugin.url;
                if (!CKEDITOR.plugins.get(pluginName)) {
                    return leosTools.loadExternalJs(pluginUrl)
                        .then(function (resolvedUrl) {
                            LOG.debug("Adding external plugin to CKEditor:", pluginName, "=>", resolvedUrl);
                            CKEDITOR.plugins.addExternal(pluginName, resolvedUrl, "");
                            externalPluginNames += pluginName + ",";
                        })
                        .catch(function (error) {
                            LOG.error("Failed to load plugin:", pluginName, error);  // Handle the error (optional)
                        });
                }
            });
        return Promise.all(loadPromises).then(function () {
            return externalPluginNames;
        });
    }

    function addDialog(dialogName, dialogDefinition) {
        LOG.debug("Adding dialog to CKEditor:", dialogName);
        CKEDITOR.dialog.add(dialogName, dialogDefinition);
    }

    function getResourceUrl(pluginName, resource) {
        var pluginFolder = [pluginsRoot, pluginName].join("/");
        var resourcePath = [pluginFolder, resource].join("/");
        var resourceUrl = leosTools.toUrl(resourcePath);
        return resourceUrl;
    }

    function toUrl(path) {
        return leosTools.toUrl(path);
    }

    function addTransformationConfigForPlugin(transformationConfig, pluginName) {
        transformationConfigManager.addTransformationConfigForPlugin(transformationConfig, pluginName);
    }

    function createFilterList(transformationConfigResolver) {
        var filterList = [];
        var config = transformationConfigResolver._.resolverConfigs.from;
        for (var el in config) {
            var entryArr = el.split("/");
            for (var i = 0; i < entryArr.length; i++) {
                if (entryArr[i] !== 'text') {
                    var entry = entryArr[i] + '[*]'; //allow attributes and classes
                    if (filterList.indexOf(entry) <= -1) {
                        filterList.push(entry);
                    }
                }
            }
        }
        return filterList.join("; ");
    }

    // return module definition
    var pluginTools = {
        addPlugin: addPlugin,
        addExternalPlugins: addExternalPlugins,
        addDialog: addDialog,
        getResourceUrl: getResourceUrl,
        toUrl: toUrl,
        addTransformationConfigForPlugin: addTransformationConfigForPlugin,
        createFilterList: createFilterList
    };

    return pluginTools;
});

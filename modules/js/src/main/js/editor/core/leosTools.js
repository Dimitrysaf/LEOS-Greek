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
define(function leosToolsModule(require) {
    "use strict";

    function toUrl(resource) {
        return require.toUrl(resource);
    }

    async function loadExternalJs(url, scriptId) {
        var script = document.createElement('script');
        script.src = url;
        script.id = scriptId;
        document.head.appendChild(script);
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Loading script timed out: ${url}`));
            }, 2000);
            script.onload = () => {
                clearTimeout(timer);
                resolve(url);
            };
            script.onerror = () => {
                clearTimeout(timer); // Clear the timeout on error
                reject(new Error(`Failed to load script: ${url}`));
            };
        });
    }

    // return module definition
    var leosTools = {
        toUrl: toUrl,
        loadExternalJs: loadExternalJs
    };

    return leosTools;
});
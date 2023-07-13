/*
 * Copyright 2023 European Commission
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

/**
 * Initial config for require library.
 * Equivalent of /main/js/leosBootstrap.js
 */
(function karmaLeosBootstrap(global) {
    "use strict";

    global.LEOS = global.LEOS || {};  // ensure LEOS global namespace to export application functions and data

    var defaults = {
        scriptType: "application/javascript",  // standard MIME type for JavaScript
        baseUrl: 'base/src/main/', // base URL to use for all modules/resources lookup
        waitSeconds: 0, // loading modules/resources timeout in seconds (0 = no timeout)
        enforceDefine: true,  // enforce define to improve catching load failures in IE
        config: {
            "js/leosModulesBootstrap": {
                logLevel: "debug"
            }
        },
        map: {
            "*": {
                "test.util": "../test/js/editor/util"
            }
        }
    };

    var configs = global.LEOS_BOOTSTRAP_CONFIG;  // configuration settings
    var settings = _extend({}, defaults, configs);  // combined settings

    global.LEOS.config = settings;  // expose settings through LEOS configuration
    global.require = global.LEOS.config; // set RequireJS global configuration variable, that will be applied automatically when RequireJS loads

    // Extend a JavaScript target object with all the properties of source objects.
    function _extend(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object!');
        }

        var destination = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                Object.keys(source).forEach(function copyValue(key) {
                    destination[key] = source[key];
                });
            }
        }
        return destination;
    }
}(window));

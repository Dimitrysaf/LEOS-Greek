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

define(function specRunner(require) {
    "use strict";

    var $ = require("jquery");

    $.ajax({
        url: `/specs`,
        success: function(specs) {
            if (specs && specs.length > 0) {
                require(specs, function() {
                    var env = jasmine.getEnv();
                    const queryString = new jasmine.QueryString({
                        getWindowLocation: function() {
                          return window.location;
                        }
                    });
                    const filterSpecs = !!queryString.getParam('spec');
                    const htmlReporter = new jasmine.HtmlReporter({
                        env: env,
                        navigateWithNewParam: function(key, value) {
                          return queryString.navigateWithNewParam(key, value);
                        },
                        addToExistingQueryString: function(key, value) {
                          return queryString.fullStringWithNewParam(key, value);
                        },
                        getContainer: function() {
                          return document.body;
                        },
                        createElement: function() {
                          return document.createElement.apply(document, arguments);
                        },
                        createTextNode: function() {
                          return document.createTextNode.apply(document, arguments);
                        },
                        timer: new jasmine.Timer(),
                        filterSpecs: filterSpecs
                    });
                    env.addReporter(jsApiReporter);
                    env.addReporter(htmlReporter);
                    htmlReporter.initialize();
                    env.configure({ random: false });
                    env.execute();
                });
            }
        }
    });

});
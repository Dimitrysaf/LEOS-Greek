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
 * Equivalent of /main/js/leosModulesBootstrap.js
 */
(function karmaModulesBootstrap(global, require) {
    "use strict";

    var allTestFiles = [];
    var TEST_REGEXP = /^\/base\/src\/test\/js\/editor\/.*\.js$/;
    var runOnce = true;

    var startKarma = function () {
        if (runOnce) {
            runOnce = false;
            window.__karma__.start.apply(window.__karma__, arguments);
        }
    };

    // Get a list of all the test files to include
    Object.keys(window.__karma__.files).forEach(function (file) {
        if (TEST_REGEXP.test(file)) {
            allTestFiles.push(file);
        }
    });

    require.config({
      // dynamically load all test files
      deps: allTestFiles,
  
      // we have to kickoff jasmine, as it is asynchronous
      callback: startKarma
    });

}(window, requirejs));

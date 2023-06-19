/*
 * Copyright 2017 European Commission
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
define(function testLeosInlineSave(require) {
    "use strict";
    var $ = require("jquery");
    var pluginToTest = require("plugins/leosInlineSave/leosInlineSavePlugin");
    // var pluginToTest = require("plugins/aknRecital/aknRecitalPlugin");

    // var CKEDITOR = CKEDITOR

    var PLUGIN_CMD_NAME = 'inlinesave'
    // 1. TEST:  create a real instance of CKEDITOR
    // 2. TEST: fire the desired event
    // CODE:  make sure in the logic the event has been catched
    // TEST: in the test file make sure the logic did correct changes
    describe("Unit tests for plugins/testLeosInlineSave", function () {

        describe("Test the renumberRecital() function.", function () {
            it("Standard numbering: Expect  p(akn recital) element to have value of 'data-akn-num' attribute 1 more than attribute of proceding p(akn recital) element. ", function () {
                var event = {
                    editor: {
                        editable: function () {
                            return $;
                        }
                    }
                };

                spyOn($.fn, "find").and.callFake(function (arg) {
                    return "aaaa";
                });

                //actual call
                // CKEDITOR.execCommand(PLUGIN_CMD_NAME);
                console.info("ergerg");
                // pluginToTest.renumberRecital();
            });
        });
    });
});
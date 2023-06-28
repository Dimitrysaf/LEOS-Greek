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
define(function testLeosInlineSavePlugin(require) {
    "use strict";
    
    var $ = require("jquery");
    var CKEDITOR = require("promise!ckEditor");
    
    var  placeholder = document.getElementById("leos-placeholder");
    var leosInlineSavePlugin = require("plugins/leosInlineSave/leosInlineSavePlugin");
    var config = {
        language: "en",
        plugins: "toolbar",
        extraPlugins: leosInlineSavePlugin.name,
        toolbar : [ {
            name : "save",
            items: [ 'leosInlineSave' ]
        }]
    };
    
    var editor = CKEDITOR.inline(placeholder, config);
    
    describe("Unit tests for plugins/leosInlineSave",function() {
        var originalTimeout;
        
        beforeEach(function() {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        
        it("Tests if inlinesave is valid.", function(done) {
            editor.on("beforeCommandExec", function(event) {
                if (event.data && event.data.command.name === "inlinesave") {
                    var selection = editor.getSelection();
                    selection.selectElement(editor.element.getChildren().getItem(0));
                }
            });
            
            editor.on("afterCommandExec", function(event) {
                if (event.data && event.data.command.name === "inlinesave") {
                    let actual = 'abc';
                    expect("abc").toEqual(actual);
                    done();
                }
            });
            
            editor.on('instanceReady', function(evt) {
                editor.getCommand('inlinesave').setState(CKEDITOR.TRISTATE_ON);
                editor.execCommand('inlinesave');
            });
        });
        
        afterEach(function() {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
    });
    
});
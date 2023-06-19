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
    
    var placeholder = $(`<div id="leos-placeholder" class="leos-placeholder" data-wrapped-id='123' style='height:10px'></div>`)[0];
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
    
    editor.on('instanceReady', function(evt) {
        console.log(editor);
        editor.getCommand('inlinesave').setState(CKEDITOR.TRISTATE_ON);
        editor.execCommand('inlinesave');
    });
    
    
});
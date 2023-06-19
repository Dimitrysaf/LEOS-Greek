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
define(function testLeosTrackChangesPlugin(require) {
    "use strict";
    
    var $ = require("jquery");
    var CKEDITOR = require("promise!ckEditor");
    
    var placeholder = $(`<div id="leos-placeholder" class="leos-placeholder" data-wrapped-id='123' style='height:10px'></div>`)[0];
    var pluginToTest = require("plugins/leosTrackChanges/leosTrackChangesPlugin");
    var config = {
        language: "en",
        plugins: "toolbar",
        extraPlugins: pluginToTest.name,
        toolbar : [ {
            name : "trackChanges",
            items: [ 'trackChanges' ]
        }]
    };

    var editor = CKEDITOR.inline(placeholder, config);
    editor.LEOS = {
        isClonedProposal: true,
        isTrackChangesEnabled: true,
        isTrackChangesShowed: true,
        proposalRef: "",
        user: {
            name : "testuser",
            login: "testuser",
            permissions: ["CAN_ACCEPT_CHANGES", "CAN_REJECT_CHANGES"]
        }
    }

    editor.on('instanceReady', function(evt) {
        console.log(editor);
        // editor.getCommand('inlinesave').setState(CKEDITOR.TRISTATE_ON);
        // editor.execCommand('inlinesave');
    });
    
    
});
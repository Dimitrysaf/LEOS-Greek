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
define(function testLeosTrackChangesPlugin_trackChanges_deleteCharacter(require) {
    "use strict";

    var $ = require("jquery");
    var CKEDITOR = require("promise!ckEditor");
    var pluginToTest = require("plugins/leosTrackChanges/leosTrackChangesPlugin");

    var leosPluginUtils = require("plugins/leosPluginUtils");
    var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");

    var placeholder = document.getElementById("leos-placeholder")

    var config = {
        dialog2: "2",
        language: "en",
        plugins: "toolbar",
        extraPlugins: pluginToTest.name,
        toolbar: [{
            name: "trackChanges",
            items: ['trackChanges']
        }]
    };

    var editor = CKEDITOR.inline(placeholder, config);
    editor.LEOS = {
        isClonedProposal: true,
        isTrackChangesEnabled: true,
        isTrackChangesShowed: true,
        proposalRef: "",
        user: {
            name: "testuser",
            login: "testuser",
            permissions: ["CAN_ACCEPT_CHANGES", "CAN_REJECT_CHANGES"]
        },
        dialog: {
            current: "5"
        }
    }

    editor.on('instanceReady', function (evt) {
        console.log(editor);
        editor.setReadOnly(false);

        var selectedElement = editor.element.find("p")
        console.log("selectedElement: ", selectedElement.getItem(0), ", content: ", selectedElement.getItem(0).$);
        selectedElement = selectedElement.getItem(0)
        leosPluginUtils.setFocus(selectedElement, editor);
        // var startElement = leosKeyHandler.getSelectedElement(selection);
        var childrenCountStart = selectedElement.$.childNodes.length;
        var elementContentStart = selectedElement.$
        console.log("childrenCountStart: ",childrenCountStart, ",elementContentStart:", elementContentStart);

        var targetRange = editor.createRange();
        var targetPosition = editor.getSelection().getRanges()[0].getNextNode() // content of <p> "hello world"
        targetRange.moveToPosition(targetPosition, CKEDITOR.POSITION_AFTER_START); // put the cursor before "h"
        targetRange.startOffset = 3
        targetRange.endOffset = 3
        targetRange.select();

        var deleteKey = 46;
        var letter = "h";
        var isPreviousInsertedOfSameUserBeforeDelete = "";
        var isNextInsertedOfSameUserBeforeDelete = "";

        pluginToTest.trackChanges.actions.deleteCharacter(editor, deleteKey, letter, isPreviousInsertedOfSameUserBeforeDelete, isNextInsertedOfSameUserBeforeDelete)

        var childrenCountEnd = selectedElement.$.childNodes.length;//should be 3
        var elementContentEnd = selectedElement.$
        console.log("childrenCountEnd: ",childrenCountEnd, ",elementContentEnd:", elementContentEnd);

        var trackChangeEl = selectedElement.$.childNodes[1]
        var attrName = trackChangeEl.getAttribute("data-akn-name")
        var attrStatus =  trackChangeEl.getAttribute("data-akn-status")
        var attrUid =  trackChangeEl.getAttribute("data-akn-uid")
        var attrTitle =  trackChangeEl.getAttribute("title")
        console.info("TrackChanges: ", trackChangeEl, "attrName:", attrName, "attrStatus:", attrStatus, "attrUid:", attrUid, "attrTitle:", attrTitle)
        console.log("trackChangeEl.$: ", trackChangeEl.$, "trackChangeEl.getInnerHTML:", trackChangeEl.getInnerHTML())
    });
});



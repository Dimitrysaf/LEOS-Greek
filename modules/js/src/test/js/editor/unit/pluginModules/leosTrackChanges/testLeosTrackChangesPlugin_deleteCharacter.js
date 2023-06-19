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
define(function testLeosTrackChangesPlugin_deleteCharacter(require) {
    "use strict";

    var $ = require("jquery");
    var CKEDITOR = require("promise!ckEditor");
    var pluginToTest = require("plugins/leosTrackChanges/leosTrackChangesPlugin");

    var leosPluginUtils = require("plugins/leosPluginUtils");
    var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");

    var placeholder = document.getElementById("leos-placeholder")

    var config = {
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
        }
    }

    editor.on('instanceReady', function (evt) {
        console.log(editor);
        editor.setReadOnly(false);

        var selectedElement = editor.element.find("p")
        console.log("selectedElement: ", selectedElement.getItem(0), ", text: ", selectedElement.getItem(0).innerHTML);
        selectedElement = selectedElement.getItem(0)

        leosPluginUtils.setFocus(selectedElement, editor);

        var selection = editor.getSelection();
        var startElement = leosKeyHandler.getSelectedElement(selection);
        leosPluginUtils.setFocus(selectedElement, editor);
        console.info("startElement: ", startElement)

        var deleteKey = "";
        var differences = "";
        var isPreviousInsertedOfSameUserBeforeDelete = "";
        var isNextInsertedOfSameUserBeforeDelete = "";

        pluginToTest.trackChanges.actions.deleteCharacter(editor, deleteKey, differences, isPreviousInsertedOfSameUserBeforeDelete, isNextInsertedOfSameUserBeforeDelete)

        var children = selectedElement.$.childNodes
        console.info("children: ", children)
    });

    function when_deleteKeyFalse_and_isPreviousInsertedOfSameUserBeforeDeleteTrue_should_notChange() {
        var deleteKey = true;
        var isNextInsertedOfSameUserBeforeDelete = true;
        var differences = "";
        var isPreviousInsertedOfSameUserBeforeDelete = "";
        pluginToTest.trackChanges.actions.deleteCharacter(editor, deleteKey, differences, isPreviousInsertedOfSameUserBeforeDelete, isNextInsertedOfSameUserBeforeDelete)
    }
    function when_deleteKeyFalse_and_isPreviousInsertedOfSameUserBeforeDeleteTrue_should_notChange() {
        var deleteKey = false;
        var isNextInsertedOfSameUserBeforeDelete;
        var differences;
        var isPreviousInsertedOfSameUserBeforeDelete = true;
        pluginToTest.trackChanges.actions.deleteCharacter(editor, deleteKey, differences, isPreviousInsertedOfSameUserBeforeDelete, isNextInsertedOfSameUserBeforeDelete)
    }
});



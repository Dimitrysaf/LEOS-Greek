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
define(function deleteCharacter(require) {
    "use strict";

    var KEYS = {
        delete: 46,
        backspace: 8
    };

    var $ = require("jquery");
    var CKEDITOR = require("promise!ckEditor");
    var pluginToTest = require("plugins/leosTrackChanges/leosTrackChangesPlugin");

    var leosPluginUtils = require("plugins/leosPluginUtils");
    // var leosKeyHandler = require("plugins/leosKeyHandler/leosKeyHandler");
    // var leosTrackChangesUtil = require("plugins/leosTrackChanges/leosTrackChangesUtil");

    var placeholder = createPlaceHolder();
    var editor = initializeEditor(pluginToTest.name, placeholder)

    describe("Unit tests for plugins/leosInlineSave",function() {
        var originalTimeout;

        beforeEach(function () {
            console.info("out beforeEach")
        });
        it("out Tests if inlinesave is valid.", function(done) {
            console.info("out Tests if inlinesave is valid")

            editor.on('instanceReady', function (evt) {
                console.log(editor);
                editor.setReadOnly(false);

                var selectedElement = getSelectedElement(editor);
                printOffsetsWithinSelection(editor)

                selectTextWithinSelection(editor, 3, 3);
                printOffsetsWithinSelection(editor)
                // leosKeyHandler.selectTextInsideElement(editor, selectedElement, 3, 3)
                fireKeyEvent(editor, KEYS.delete);
                printOffsetsWithinSelection(editor)
                checkTrackChanges(selectedElement);
                printOffsetsWithinSelection(editor) //

                //move the selection the the next character
                selectedElement = selectedElement.getChildren().getItem(2)
                leosPluginUtils.setFocus(selectedElement, editor);

                selectTextWithinSelection(editor, 0, 0);
                printOffsetsWithinSelection(editor)
                fireKeyEvent(editor, KEYS.delete);
                checkTrackChanges(selectedElement);
                printOffsetsWithinSelection(editor)

                expect("abc").toEqual("abc");
                console.info("after expect")
                expect("abc").toEqual("abs33333");
                console.info("after expect false")
                done();
            });
        })
    })



    function createPlaceHolder() {
        var leosPlaceholderDiv = document.createElement("div");
        leosPlaceholderDiv.innerHTML = '<div id="leos-placeholder" class="leos-placeholder" data-wrapped-id="123" style="height:10px"></div>';
        document.body.appendChild(leosPlaceholderDiv);
        var placeholder = document.getElementById("leos-placeholder")
        return placeholder;
    }

    function getSelectedElement(editor) {
        var selectedElement = editor.element.find("p")
        console.log("editorElement: ", selectedElement.getItem(0), ", CONTENT: ", selectedElement.getItem(0).$);
        selectedElement = selectedElement.getItem(0)
        leosPluginUtils.setFocus(selectedElement, editor);
        // var startElement = leosKeyHandler.getSelectedElement(selection);
        var childrenCountStart = selectedElement.$.childNodes.length;
        var elementContentStart = selectedElement.$
        // console.log("childrenCountStart: ", childrenCountStart, ", Editor CONTENT:", elementContentStart);
        return selectedElement;
    }

    function setCursorToElement(editor, selectedElement) {
        leosPluginUtils.setFocus(selectedElement, editor);
        return selectedElement;
    }


    function selectTextWithinSelection(editor, startOffset, endOffset) {
        var targetRange = editor.createRange();
        var targetPosition = editor.getSelection().getRanges()[0].getNextNode() // content of <p> "hello world"
        targetRange.moveToPosition(targetPosition, CKEDITOR.POSITION_AFTER_START); // put the cursor before "h"
        targetRange.startOffset = startOffset
        targetRange.endOffset = endOffset
        targetRange.select();
    }

    function printOffsetsWithinSelection(editor) {
        var ranges = editor.getSelection().getRanges()
        var range = editor.getSelection().getRanges()[0]
        console.log("Selection: Nr. Ranges:", ranges.length, ", startOffset:", range.startOffset, ", endOffset:",  range.endOffset);
    }

    function fireKeyEvent(editor, keyCode) {
        var ckEditorEvent = new CKEDITOR.dom.event(
            new KeyboardEvent('key', {
                keyCode: keyCode,
                ctrlKey: false,
                shiftKey: false
            })
        )
        ckEditorEvent.getKey = function () {
            return false;
        }
        var event = {
            name: "key",
            domEvent: ckEditorEvent
        }
        editor.fire( 'key', event );
        return event;
    }

    function checkTrackChanges(selectedElement) {
        var childrenCountEnd = selectedElement.$.childNodes.length;//should be 3
        var elementContentEnd = selectedElement.$
        console.log("childrenCountEnd: ", childrenCountEnd, ", elementContentEnd:", elementContentEnd, ", new CONTENT:", elementContentEnd.outerHTML);

        var trackChangeEl = selectedElement.$.childNodes[1]
        var attrName = trackChangeEl.getAttribute("data-akn-name")
        var attrStatus = trackChangeEl.getAttribute("data-akn-status")
        var attrUid = trackChangeEl.getAttribute("data-akn-uid")
        var attrTitle = trackChangeEl.getAttribute("title")
        // console.info("TrackChanges: ", trackChangeEl, "attrName:", attrName, "attrStatus:", attrStatus, "attrUid:", attrUid, "attrTitle:", attrTitle)
        console.log("trackChangeElement.getInnerHTML:", trackChangeEl.getInnerHTML())
    }

    function initializeEditor(extraPluginsName, placeholder) {
        var config = {
            language: "en",
            plugins: "toolbar",
            extraPlugins: extraPluginsName,
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
        return editor;
    }
});



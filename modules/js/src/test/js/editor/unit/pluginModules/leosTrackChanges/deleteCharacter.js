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

    // var CKEDITOR = require("promise!ckEditor");
    var pluginToTest = require("plugins/leosTrackChanges/leosTrackChangesPlugin");
    var testUtil = require("test.util/ckEditorTestUtil");
    var leosPluginUtils = require("plugins/leosPluginUtils");

    var KEYS = {
        delete: 46,
        backspace: 8
    };

    var div = '<article>hello world</article>'
    var placeholder = createPlaceHolder(div);

    describe("Unit tests for TrackChanges/deleteMultipleCharacter", function() {
        var editor;

        beforeAll(function(done) {
            console.info("Beafore All");
            testUtil.initializeEditor(pluginToTest.name, placeholder).then((val) =>{
                editor = val;
                print(editor);
                done();
            });
        });

        it("when deleting single character (should create 3 nodes, where the 2nd is the trackChange element)", function (done) {
            editor.setReadOnly(false);
            editor.focus();

            movePosition(editor, 3);
            testUtil.fireKeyEvent(editor, KEYS.delete);
            print(editor);
            // printOffsetsWithinSelection(editor)

            var pEle = editor.element.getChildren().getItem(0);
            expect(pEle.getChildCount()).toEqual(3);
            var trackChangeEle = pEle.getChildren().getItem(1);
            expect(trackChangeEle.$.nodeType).toEqual(1);
            expect(trackChangeEle.getText()).toEqual('l');

            var childrenCountEnd = pEle.getChildCount();//should be 3
            var elementContentEnd = editor.element.$.innerHtml;
            console.log("new EDITOR CONTENT:", elementContentEnd, ", nr of children:", childrenCountEnd);
            // console.log("new EDITOR CONTENT html:", elementContentEnd.outerHTML);
            //<p>hel<span data-akn-name="trackChanges" data-akn-status="new" data-akn-action="delete" data-akn-uid="testuser" title="testuser : 29/06/2023 4:02:07 PM">l</span>​​​​​​​lo world</p>

            // var trackChangeEl = selectedElement.$.childNodes[1]
            // var attrName = trackChangeEl.getAttribute("data-akn-name")
            // var attrStatus = trackChangeEl.getAttribute("data-akn-status")
            // var attrUid = trackChangeEl.getAttribute("data-akn-uid")
            // var attrTitle = trackChangeEl.getAttribute("title")
            // console.log("trackChangeElement content:", trackChangeEl.getInnerHTML())
            //
            // expect(selectedElement.$.childNodes.length).toEqual(3);
            // expect(attrName).toEqual("trackchanges");
            // expect(attrStatus).toEqual("new");
            // expect(attrUid).toEqual("testuser");
            // expect(attrTitle).toContain("testuser");
            // expect(trackChangeEl.getInnerHTML()).toEqual("l");
            console.info("END")
            done();
        })

        // it("when deleting single character (should create 3 nodes, where the 2nd is the trackChange element)", function (done) {
        //     // editor.on('instanceReady', function (evt) {
        //         console.info("END2")
        //     // })
        // })

        afterAll(function() {
            testUtil.destroyEditor(editor, placeholder);
            console.log("After All");
        });
    })


    function createPlaceHolder(div) {
        var placeholder = document.getElementById("leos-placeholder")
        placeholder.innerHTML = div;
        return placeholder;
    }


    function split_at_index(value, index) {
        return [value.substring(0, index), value.substring(index)];
    }

    function movePosition(editor, index) {
        var selection = editor.getSelection();
        var range = selection.getRanges()[0];
        var element = selection.getStartElement();
        var splits = split_at_index(element.getText(), index);
        var firstNode = new CKEDITOR.dom.text(splits[0]);
        var secondNode = new CKEDITOR.dom.text(splits[1]);
        element.getChildren().getItem(0).remove();
        firstNode.appendTo(element);
        secondNode.appendTo(element);
        range.moveToPosition(secondNode, CKEDITOR.POSITION_AFTER_START);
        range.select();
        print(editor);
    }

    // function printOffsetsWithinSelection(editor) {
    //     var ranges = editor.getSelection().getRanges()
    //     var range = editor.getSelection().getRanges()[0]
    //     console.log("Selection: Nr. Ranges:", ranges.length, ", startOffset:", range.startOffset, ", endOffset:", range.endOffset);
    // }

    function print(editor) {
        var childNodes = editor.element.getChildren().getItem(0).getChildren();
        console.log(childNodes.toArray().map(child => child.getText()));
    }

});



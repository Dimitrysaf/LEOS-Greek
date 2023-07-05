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
define(function deleteMultipleCharacter(require) {
    "use strict";

    var CKEDITOR = require("promise!ckEditor");
    var testUtil = require("test.util/ckEditorTestUtil");
    var pluginToTest = require("plugins/leosTrackChanges/leosTrackChangesPlugin");

    var KEYS = {
        delete: 46,
        backspace: 8
    };

    var placeholder = document.getElementById("leos-placeholder");
        
    describe("Unit tests for TrackChanges/deleteMultipleCharacter", function() {
        var editor;

        beforeAll(async function() {
            console.info("Before All - deleteMultipleCharacter");
            editor = await testUtil.initializeEditor(pluginToTest.name, placeholder);
        });

        it("when deleting first character (should create trackChange element)", function(done) {
            console.log("First Case");
            var article = '<article>First Test</article>';
            editor.setData(article);
            editor.setReadOnly(false);
            testUtil.selectElement(editor, editor.element.findOne("p"));
            testUtil.printElementEditor(editor, "After SetData:");

            testUtil.movePosition(editor, editor.getSelection().getStartElement(), 3);
            testUtil.fireKeyEvent(editor, KEYS.delete);
            testUtil.printElementEditor(editor, "After First Delete:");

            var pEle = editor.element.findOne("p");
            expect(pEle.getChildCount()).toEqual(3);
            var trackChangeEle = pEle.getChildren().getItem(1);
            expect(trackChangeEle.$.nodeType).toEqual(1);
            expect(trackChangeEle.getText()).toEqual('s');

            done();
        });
        
        it("when deleting second character (should update the trackChange element)", function(done) {
            console.log("Second Case");
            var article = '<article>Second Test</article>';
            editor.setData(article);
            editor.setReadOnly(false);
            testUtil.selectElement(editor, editor.element.findOne("p"));
            testUtil.printElementEditor(editor, "After SetData:");

            testUtil.movePosition(editor, editor.getSelection().getStartElement(), 3);
            testUtil.fireKeyEvent(editor, KEYS.delete);
            testUtil.printElementEditor(editor, "After First Delete:");

            var pEle = editor.element.findOne("p");
            expect(pEle.getChildCount()).toEqual(3);
            var trackChangeEle = pEle.getChildren().getItem(1);
            expect(trackChangeEle.type).toEqual(CKEDITOR.NODE_ELEMENT);
            expect(trackChangeEle.getName()).toEqual("span");
            expect(trackChangeEle.getText()).toEqual('o');

            testUtil.fireKeyEvent(editor, KEYS.delete);
            testUtil.printElementEditor(editor, "After Second Delete:");

            done();
        });

        afterAll(function() {
            testUtil.destroyEditor(editor, placeholder);
            console.log("After All - deleteMultipleCharacter");
        });
    });

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

    function print(editor) {
        var childNodes = editor.element.getChildren().getItem(0).getChildren();
        console.log(childNodes.toArray().map(child => child.getText()));
    }
});



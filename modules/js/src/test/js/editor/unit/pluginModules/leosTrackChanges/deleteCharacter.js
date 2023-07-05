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

    var pluginToTest = require("plugins/leosTrackChanges/leosTrackChangesPlugin");
    var testUtil = require("test.util/ckEditorTestUtil");

    var KEYS = {
        delete: 46,
        backspace: 8
    };

    var placeholder = document.getElementById("leos-placeholder");

    describe("Unit tests for TrackChanges/deleteCharacter", function() {
        var editor;

        beforeAll(async function() {
            console.info("Before All - deleteCharacter");
            editor = await testUtil.initializeEditor(pluginToTest.name, placeholder)
        });

        beforeEach(function(done) {
            console.info("Before EACH - deleteCharacter");
            // var div = '<article>hello world</article>'
            // testUtil.createPlaceHolder(div);
            // editor.setData("")
            done();
        });

        it("when deleting single character (should create 3 nodes, where the 2nd is the trackChange element)", function (done) {
            //var div = '<article>hello world</article>'
            //placeholder = testUtil.createPlaceHolder(div);
            // editor.setData(placeholder)

            var article = '<article>hello world</article>';
            editor.setData(article);
            editor.setReadOnly(false);
            testUtil.selectElement(editor, editor.element.findOne("p"));
            testUtil.printElementEditor(editor, "After SetData:");


            testUtil.movePosition(editor, editor.getSelection().getStartElement(), 3);
            testUtil.fireKeyEvent(editor, KEYS.delete);
            testUtil.printElementEditor(editor, "After TrackChanges logic, editor.element:");

            var editorElement = editor.element.getChildren().getItem(0);
            var beforeElement = editorElement.getChildren().getItem(0);
            var trackChangeElement = editorElement.getChildren().getItem(1);
            var afterElement = editorElement.getChildren().getItem(2);
            // console.log("After TrackChanges logic, editor.element html:", editorElement.getOuterHtml());
            // console.log("After TrackChanges logic, trackChangeElement html:", trackChangeElement.getOuterHtml());

            expect(editorElement.getChildCount()).toEqual(3);
            expect(beforeElement.getText()).toEqual('hel');
            expect(trackChangeElement.getName()).toEqual('span');
            expect(trackChangeElement.getText()).toEqual('l');
            expect(trackChangeElement.getAttribute("data-akn-name")).toEqual("trackchanges");
            expect(trackChangeElement.getAttribute("data-akn-status")).toEqual("new");
            expect(trackChangeElement.getAttribute("data-akn-uid")).toEqual("testuser");
            expect(trackChangeElement.getAttribute("title")).toContain("testuser");
            expect(afterElement.getText()).toEqual('o world');

            console.info("END - deleting single character")
            done();
        })

        // it("when backspacing single character (should create 3 nodes, where the 2nd is the trackChange element)", function (done) {
        //     var div = '<article>hello world</article>'
        //     placeholder = testUtil.createPlaceHolder(div);
        //     // editor.setData(placeholder)
        //     testUtil.printElementEditor(editor, "Initilaizing: ", true);
        //
        //     editor.setReadOnly(false);
        //     editor.focus();
        //
        //     testUtil.movePosition(editor, 3);
        //     testUtil.fireKeyEvent(editor, KEYS.backspace);
        //     testUtil.printElementEditor(editor, "After TrackChanges logic, editor.element:");
        //
        //     var editorElement = editor.element.getChildren().getItem(0);
        //     var beforeElement = editorElement.getChildren().getItem(0);
        //     var trackChangeElement = editorElement.getChildren().getItem(1);
        //     var afterElement = editorElement.getChildren().getItem(2);
        //     // console.log("After TrackChanges logic, editor.element html:", editorElement.getOuterHtml());
        //     // console.log("After TrackChanges logic, trackChangeElement html:", trackChangeElement.getOuterHtml());
        //
        //     expect(editorElement.getChildCount()).toEqual(3);
        //     expect(beforeElement.getText()).toEqual('he');
        //     expect(trackChangeElement.getName()).toEqual('span');
        //     expect(trackChangeElement.getText()).toEqual('l');
        //     expect(trackChangeElement.getAttribute("data-akn-name")).toEqual("trackchanges");
        //     expect(trackChangeElement.getAttribute("data-akn-status")).toEqual("new");
        //     expect(trackChangeElement.getAttribute("data-akn-uid")).toEqual("testuser");
        //     expect(trackChangeElement.getAttribute("title")).toContain("testuser");
        //     expect(afterElement.getText()).toEqual('lo world');
        //     console.info("END - backspace single character")
        //     done();
        // })

        afterAll(function() {
            testUtil.destroyEditor(editor, placeholder);
            console.log("After All - deleteCharacter");
        });
    })
});



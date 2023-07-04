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

    var div = '<article>hello world</article>'
    var placeholder = testUtil.createPlaceHolder(div);

    describe("Unit tests for TrackChanges/deleteMultipleCharacter", function() {
        var editor;

        beforeAll(function(done) {
            console.info("Before All - deleteCharacter");
            testUtil.initializeEditor(pluginToTest.name, placeholder).then((val) =>{
                editor = val;
                testUtil.printElementEditor(editor);
                done();
            });
        });

        it("when deleting single character (should create 3 nodes, where the 2nd is the trackChange element)", function (done) {
            editor.setReadOnly(false);
            editor.focus();

            testUtil.movePosition(editor, 3);
            testUtil.fireKeyEvent(editor, KEYS.delete);
            testUtil.printElementEditor(editor, "After TrackChanges logic, editor.element:");

            var editorElement = editor.element.getChildren().getItem(0);
            var trackChangeElement = editorElement.getChildren().getItem(1);
            // console.log("After TrackChanges logic, editor.element html:", editorElement.getOuterHtml());
            // console.log("After TrackChanges logic, trackChangeElement html:", trackChangeElement.getOuterHtml());

            expect(editorElement.getChildCount()).toEqual(3);
            expect(trackChangeElement.getName()).toEqual('span');
            expect(trackChangeElement.getText()).toEqual('l');
            expect(trackChangeElement.getAttribute("data-akn-name")).toEqual("trackchanges");
            expect(trackChangeElement.getAttribute("data-akn-status")).toEqual("new");
            expect(trackChangeElement.getAttribute("data-akn-uid")).toEqual("testuser");
            expect(trackChangeElement.getAttribute("title")).toContain("testuser");
            console.info("END")
            done();
        })

        // it("when backspacing single character (should create 3 nodes, where the 2nd is the trackChange element)", function (done) {
        //     // editor.on('instanceReady', function (evt) {
        //         console.info("END2")
        //     // })
        // })

        afterAll(function() {
            testUtil.destroyEditor(editor, placeholder);
            console.log("After All - deleteCharacter");
        });
    })
});



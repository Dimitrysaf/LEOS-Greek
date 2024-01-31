/*
 * Copyright 2024 European Union
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

    describe("Unit tests for TrackChanges/deleteCharacter -  Legend: 'text' => normal test; (text) => text wrapped with TrackChanges SPAN", function() {
        var editor;

        beforeAll(async function() {
            console.info("=> DESCRIBE - START - deleteCharacter");
            editor = await testUtil.initializeEditor(pluginToTest.name)
        });

        it("when deleting character in 3rd position, 's' in 'First Test', should create TC structure: [ 'Fir' (s) 't Test' ]", function (done) {
            console.log("************** deleteCharacter / deleting single characters **************");
            var article = '<article>First Test</article>';
            editor.setData(article);
            editor.setReadOnly(false);
            testUtil.selectElement(editor, editor.element.findOne("p")); //article
            testUtil.printElementEditor(editor, "After Resetting Editor:");

            testUtil.movePosition(editor, editor.getSelection().getStartElement(), 3);
            testUtil.fireKeyEvent(editor, KEYS.delete);
            testUtil.printElementEditor(editor, "After TrackChanges logic, editor.element:");

            var editorElement = editor.element.getChildren().getItem(0);
            var beforeElement = editorElement.getChildren().getItem(0);
            var trackChangeElement = editorElement.getChildren().getItem(1);
            var afterElement = editorElement.getChildren().getItem(2);
            console.log("After TrackChanges logic, editor.element html:", editorElement.getOuterHtml());
            // console.log("After TrackChanges logic, trackChangeElement html:", trackChangeElement.getOuterHtml());

            expect(editorElement.getChildCount()).toEqual(3);
            expect(beforeElement.getText()).toEqual('Fir');
            expect(trackChangeElement.getName()).toEqual('span');
            expect(trackChangeElement.getText()).toEqual('s');
            expect(trackChangeElement.getAttribute("data-akn-uid")).toEqual("testuser");
            expect(trackChangeElement.getAttribute("title")).toContain("testuser");
            expect(afterElement.getText()).toEqual('t Test');
            done();
        })

        it("when backspacing character in 3rd position, 'r' in 'First Test', should create TC structure: [ 'Fi' (r) 'st Test' ]", function (done) {
            console.log("************** deleteCharacter / backspace single characters **************");
            var article = '<article>First Test</article>';
            editor.setData(article);
            editor.setReadOnly(false);
            testUtil.selectElement(editor, editor.element.findOne("p")); //article
            testUtil.printElementEditor(editor, "After Resetting Editor:");

            testUtil.movePosition(editor, editor.getSelection().getStartElement(), 3);
            testUtil.fireKeyEvent(editor, KEYS.backspace);
            testUtil.printElementEditor(editor, "After TrackChanges logic, editor.element:");

            var editorElement = editor.element.getChildren().getItem(0);
            var beforeElement = editorElement.getChildren().getItem(0);
            var trackChangeElement = editorElement.getChildren().getItem(1);
            var afterElement = editorElement.getChildren().getItem(2);
            console.log("After TrackChanges logic, editor.element html:", editorElement.getOuterHtml());
            // console.log("After TrackChanges logic, trackChangeElement html:", trackChangeElement.getOuterHtml());

            expect(editorElement.getChildCount()).toEqual(3);
            expect(beforeElement.getText()).toEqual('Fi');
            expect(trackChangeElement.getName()).toEqual('span');
            expect(trackChangeElement.getText()).toEqual('r');
            expect(trackChangeElement.getAttribute("data-akn-uid")).toEqual("testuser");
            expect(trackChangeElement.getAttribute("title")).toContain("testuser");
            expect(afterElement.getText()).toEqual('st Test');
            done();
        })

        it("when deleting 2 chars starting from 3rd position, 'st' in 'First Test', should create TC structure: [ 'Fir' (st) ' Test' ]", function(done) {
            console.log("************** deleteMultipleCharacter / delete multiple characters **************");
            var article = '<article>First Test</article>';
            editor.setData(article);
            editor.setReadOnly(false);
            testUtil.selectElement(editor, editor.element.findOne("p"));
            testUtil.printElementEditor(editor, "After Resetting Editor:");

            testUtil.movePosition(editor, editor.getSelection().getStartElement(), 3);
            testUtil.fireKeyEvent(editor, KEYS.delete);
            testUtil.printElementEditor(editor, "After TrackChanges logic (first delete), editor.element:");

            var editorElement = editor.element.getChildren().getItem(0);
            var beforeElement = editorElement.getChildren().getItem(0);
            var trackChangeElement = editorElement.getChildren().getItem(1);
            var afterElement = editorElement.getChildren().getItem(2);
            console.log("After TrackChanges logic (first delete), editor.element html:", editorElement.getOuterHtml());
            expect(editorElement.getChildCount()).toEqual(3);
            expect(beforeElement.getText()).toEqual('Fir');
            expect(trackChangeElement.getName()).toEqual('span');
            expect(trackChangeElement.getText()).toEqual('s');
            expect(trackChangeElement.getAttribute("data-akn-uid")).toEqual("testuser");
            expect(trackChangeElement.getAttribute("title")).toContain("testuser");
            expect(afterElement.getText()).toEqual('t Test');

            //delete another character
            testUtil.fireKeyEvent(editor, KEYS.delete);
            testUtil.printElementEditor(editor, "After TrackChanges logic (second delete), editor.element:");

            editorElement = editor.element.getChildren().getItem(0);
            beforeElement = editorElement.getChildren().getItem(0);
            trackChangeElement = editorElement.getChildren().getItem(1);
            afterElement = editorElement.getChildren().getItem(2);
            console.log("After TrackChanges logic (second delete), editor.element html:", editorElement.getOuterHtml());
            expect(editorElement.getChildCount()).toEqual(3);
            expect(beforeElement.getText()).toEqual('Fir');
            expect(trackChangeElement.getName()).toEqual('span');
            expect(trackChangeElement.getText()).toEqual('st');
            expect(trackChangeElement.getAttribute("data-akn-uid")).toEqual("testuser");
            expect(trackChangeElement.getAttribute("title")).toContain("testuser");
            expect(afterElement.getText()).toEqual(' Test');

            done();
        });

        it("when backspacing 2 chars starting from 3rd position, 'ir' in 'First Test', should create TC structure: [ 'F' (ir) 'st Test' ]", function(done) {
            console.log("************** deleteMultipleCharacter / backspace multiple characters **************");
            var article = '<article>First Test</article>';
            editor.setData(article);
            editor.setReadOnly(false);
            testUtil.selectElement(editor, editor.element.findOne("p")); //article
            testUtil.printElementEditor(editor, "After Resetting Editor:");

            testUtil.movePosition(editor, editor.getSelection().getStartElement(), 3);
            testUtil.fireKeyEvent(editor, KEYS.backspace);
            testUtil.printElementEditor(editor, "After TrackChanges logic (first backspace), editor.element:");

            var editorElement = editor.element.getChildren().getItem(0);
            var beforeElement = editorElement.getChildren().getItem(0);
            var trackChangeElement = editorElement.getChildren().getItem(1);
            var afterElement = editorElement.getChildren().getItem(2);
            console.log("After TrackChanges logic (first backspace), editor.element html:", editorElement.getOuterHtml());
            // console.log("After TrackChanges logic, trackChangeElement html:", trackChangeElement.getOuterHtml());

            expect(editorElement.getChildCount()).toEqual(3);
            expect(beforeElement.getText()).toEqual('Fi');
            expect(trackChangeElement.getName()).toEqual('span');
            expect(trackChangeElement.getText()).toEqual('r');
            expect(trackChangeElement.getAttribute("data-akn-uid")).toEqual("testuser");
            expect(trackChangeElement.getAttribute("title")).toContain("testuser");
            expect(afterElement.getText()).toEqual('st Test');

            //backspace another character
            testUtil.fireKeyEvent(editor, KEYS.backspace);
            testUtil.printElementEditor(editor, "After TrackChanges logic (second backspace), editor.element:");

            editorElement = editor.element.getChildren().getItem(0);
            beforeElement = editorElement.getChildren().getItem(0);
            trackChangeElement = editorElement.getChildren().getItem(1);
            afterElement = editorElement.getChildren().getItem(2);
            console.log("After TrackChanges logic (second backspace), editor.element html:", editorElement.getOuterHtml());
            expect(editorElement.getChildCount()).toEqual(3);
            expect(beforeElement.getText()).toEqual('F');
            expect(trackChangeElement.getName()).toEqual('span');
            expect(trackChangeElement.getText()).toEqual('ir');
            expect(trackChangeElement.getAttribute("data-akn-uid")).toEqual("testuser");
            expect(trackChangeElement.getAttribute("title")).toContain("testuser");
            expect(afterElement.getText()).toEqual('st Test');

            done();
        });

        afterAll(function() {
            testUtil.destroyEditor(editor);
            console.info("=> DESCRIBE - END - deleteCharacter");
        });
    })
});



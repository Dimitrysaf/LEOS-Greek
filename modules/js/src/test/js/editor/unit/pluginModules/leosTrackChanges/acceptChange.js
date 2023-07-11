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
define(function acceptChange(require) {
    "use strict";

    var pluginToTest = require("plugins/leosTrackChanges/leosTrackChangesPlugin");
    var testUtil = require("test.util/ckEditorTestUtil");

    describe("Unit tests for TrackChanges / acceptChange", function() {
        var editor;

        beforeAll(async function() {
            console.info("=> DESCRIBE - START - acceptChange");
            editor = await testUtil.initializeEditor(pluginToTest.name)
        });

        it("when acceptChange for 'deleted character', (should ...)", function (done) {
            var article = '<article>' +
                'Fir<span data-akn-name="trackchanges" data-akn-status="new" data-akn-action="delete" data-akn-uid="testuser" title="testuser">s</span>t Test' +
                '</article>'
            // var placeholder = testUtil.createPlaceHolder(div);
            // var element = new CKEDITOR.dom.element.createFromHtml(placeholder);
            // var trackChangeElement = element.getChildren().getItem(1)
            // console.log("trackChangeElement Html:", trackChangeElement.getOuterHtml());

            editor.setData(article);
            editor.setReadOnly(false);
            testUtil.selectElement(editor, editor.element.findOne("p")); //article
            testUtil.printElementEditor(editor, "After Resetting Editor:");

            editor.setReadOnly(false);
            editor.focus();

            // testUtil.movePosition(editor, 3);
            testUtil.printElementEditor(editor, "Before TrackChanges logic, editor.element:", true);

            pluginToTest.trackChanges.actions.acceptChange(editor, editor.element)

            testUtil.printElementEditor(editor, "After TrackChanges logic, editor.element:", true);

            var editorElement = editor.element.getChildren().getItem(0);
            var beforeElement = editorElement.getChildren().getItem(0);
            var trackChangeElement = editorElement.getChildren().getItem(1);
            var afterElement = editorElement.getChildren().getItem(2);
            console.log("After TrackChanges logic, editor.element html:", editorElement);
            console.log("After TrackChanges logic, trackChangeElement html:", trackChangeElement);

            // expect(editorElement.getChildCount()).toEqual(3);
            // expect(beforeElement.getText()).toEqual('hel');
            // expect(trackChangeElement.getName()).toEqual('span');
            // expect(trackChangeElement.getText()).toEqual('l');
            // expect(trackChangeElement.getAttribute("data-akn-name")).toEqual("trackchanges");
            // expect(trackChangeElement.getAttribute("data-akn-status")).toEqual("new");
            // expect(trackChangeElement.getAttribute("data-akn-uid")).toEqual("testuser");
            // expect(trackChangeElement.getAttribute("title")).toContain("testuser");
            // expect(afterElement.getText()).toEqual('o world');

            done();
        })


        afterAll(function() {
            testUtil.destroyEditor(editor);
            console.log("After All - TrackChanges / acceptChange");
        });
    })
});



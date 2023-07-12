/*
 * Copyright 2023 European Commission
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
define(function acceptRejectChange(require) {
    "use strict";

    var pluginToTest = require("plugins/leosTrackChanges/leosTrackChangesPlugin");
    var testUtil = require("test.util/ckEditorTestUtil");

    var placeholder = document.getElementById("leos-placeholder");

    describe("Unit tests for TrackChanges / acceptChange / rejectChange", function() {
        var editor;

        beforeAll(async function() {
            console.info("=> DESCRIBE - START - acceptChange");
            editor = await testUtil.initializeEditor(pluginToTest.name, placeholder)
        });

        it("when acceptChange for [ 'Fir' (st) ' Test' ], should create the structure  [ 'Fir' ' Test' ]", function (done) {
            var article = '<article>' +
                '<ol>' +
                '<li>Fir<span data-akn-action="delete">st</span> Test</li>' +
                '</ol>' +
                '</article>'

            editor.editable().setHtml(article);
            var liElement = editor.element.getChildren().getItem(0).getChildren().getItem(0).getChildren().getItem(0);
            console.log("Before TrackChanges acceptChange logic, LI html:", liElement.getOuterHtml());
            testUtil.printElementEditor(editor, "After Resetting Editor:");

            var tcElement = editor.element.findOne("span")
            pluginToTest.trackChanges.actions.acceptChange(editor, tcElement)
            testUtil.printElementEditor(editor, "After TrackChanges logic, editor.element:", true);

            liElement = editor.element.getChildren().getItem(0).getChildren().getItem(0).getChildren().getItem(0);
            console.log("After TrackChanges acceptChange logic, LI html:", liElement.getOuterHtml());
            expect(liElement.getChildCount()).toEqual(2);
            expect(liElement.getOuterHtml()).toEqual('<li>Fir Test</li>');

            done();
        })

        it("when rejectChange for [ 'Fir' (st) ' Test' ], should create the structure  [ 'First Test' ]", function (done) {
            var article = '<article>' +
                '<ol>' +
                '<li>Fir<span data-akn-action="delete">st</span> Test</li>' +
                '</ol>' +
                '</article>'

            editor.editable().setHtml(article);
            var liElement = editor.element.getChildren().getItem(0).getChildren().getItem(0).getChildren().getItem(0);
            console.log("Before TrackChanges rejectChange logic, LI html:", liElement.getOuterHtml());
            testUtil.printElementEditor(editor, "After Resetting Editor:");

            var tcElement = editor.element.findOne("span")
            pluginToTest.trackChanges.actions.rejectChange(editor, tcElement)
            testUtil.printElementEditor(editor, "After TrackChanges logic, editor.element:", true);

            liElement = editor.element.getChildren().getItem(0).getChildren().getItem(0).getChildren().getItem(0);
            console.log("After TrackChanges rejectChange logic, LI html:", liElement.getOuterHtml());
            expect(liElement.getChildCount()).toEqual(1);
            expect(liElement.getOuterHtml()).toEqual('<li>First Test</li>');

            done();
        })

        afterAll(function() {
            testUtil.destroyEditor(editor, placeholder);
            console.log("After All - TrackChanges / acceptChange");
        });
    })
});



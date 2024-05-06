import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import ckEditorWindow from "../pages/ckEditorWindow";

Then('ck editor window is displayed', () => {
    ckEditorWindow.getCkEditableInlineElement().should('exist');
})

Then('ck editor window is not displayed', () => {
    ckEditorWindow.getCkEditableInlineElement().should('not.exist');
})

When('click save and close button of ck editor', () => {
    ckEditorWindow.clickSaveAndCloseBtn();
})

When('click close button of ck editor', () => {
    ckEditorWindow.clickCloseBtn();
})

When('append {string} at offset {int} in paragraph {int} of article {int} when ck editor is open', function (newContent, offset, paragraphNumber, articleNumber) {
    ckEditorWindow.appendContentInParagraphInArticle(newContent,offset,paragraphNumber,articleNumber);
});

When('move the cursor position to offset {int} in paragraph {int} of article {int} when ck editor is open', function (offset, paragraphNumber, articleNumber) {
    ckEditorWindow.moveCursorToSpecificOffsetInParagraphOfArticle(offset,paragraphNumber,articleNumber);
});

When('add {string} at offset {int} in citation {int} when ck editor is open', function (newContent, offset, citationNumber) {
    ckEditorWindow.addContentInCitation(newContent, offset, citationNumber);
});

And('select content from offset {int} till offset {int} in citation {int} when ck editor is open', function (offsetStart, offsetEnd, citationNumber) {
    ckEditorWindow.selectContentInCitation(offsetStart, offsetEnd, citationNumber);
});

When('add {string} at offset {int} in recital {int} when ck editor is open', function (newContent, offset, recitalNumber) {
    ckEditorWindow.addContentInRecital(newContent, offset, recitalNumber);
});

And('select content from offset {int} till offset {int} in recital {int} when ck editor is open', function (offsetStart, offsetEnd, recitalNumber) {
    ckEditorWindow.selectContentInRecital(offsetStart, offsetEnd, recitalNumber);
});

And('click delete button from keyboard when ck editor is open', () => {
    ckEditorWindow.clickDeleteFromKeyboardWhenCKEditorOpen();
})

And('click enter from keyboard when ck editor is open', () => {
    ckEditorWindow.clickEnterFromKeyboardWhenCKEditorOpen();
})

When('add {string} at current cursor position when ck editor is open', function (newContent) {
    ckEditorWindow.addTextAtCurrentCursorPositionWhenCKEditorOpen(newContent);
});

When(`select content from offset {int} till offset {int} in numbered paragraph {int} of article when ck editor is open`, (offsetStart, offsetEnd, paragraphNumber) => {
    ckEditorWindow.selectContentInNumberedParagraphOfArticle(offsetStart, offsetEnd, paragraphNumber);
});

// Then(`paragraph {int} of article {int} contains {string} when ck editor is open`, (paragraphNumber, articleNumber, text) => {

// });
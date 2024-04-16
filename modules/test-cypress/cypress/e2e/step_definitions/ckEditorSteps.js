import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import ckEditorWindow from "../pages/ckEditorWindow";

Then('ck editor window is displayed', () => {
    ckEditorWindow.getCkEditableInlineElement().should('exist');
})

Then('ck editor window is not displayed', () => {
    ckEditorWindow.getCkEditableInlineElement().should('not.exist');
})

And('click save and close button of ck editor', () => {
    ckEditorWindow.clickSaveAndCloseBtn();
    cy.wait(2000);
})

When('click close button of ck editor', () => {
    ckEditorWindow.clickCloseBtn();
    cy.wait(2000);
})

When('append {string} at offset {int} in paragraph {int} of article {int} when ck editor is open', function (newContent, offset, paragraphNumber, articleNumber) {
    ckEditorWindow.appendContentInParagraphInArticle(newContent,paragraphNumber,articleNumber);
});

When('append {string} at offset {int} in paragraph {int} of article {int} when ck editor is open', function (newContent, offset, paragraphNumber, articleNumber) {
    ckEditorWindow.appendContentInParagraphInArticle(newContent,paragraphNumber,articleNumber);
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
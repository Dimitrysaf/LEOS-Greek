import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import ckEditorWindow from "../pages/ckEditorWindow";

Then('ck editor window is displayed', () => {
    ckEditorWindow.getCkEditableInlineElement().should('be.visible');
})

Then('ck editor window is not displayed', () => {
    ckEditorWindow.getCkEditableInlineElement().should('not.exist');
})

And('click save and close button of ck editor', () => {
    ckEditorWindow.clickSaveAndCloseBtn();
    cy.wait(2000);
})

And('click enter from keyboard', () => {
    ckEditorWindow.clickEnterFromKeyboard();
})

When('append {string} at offset {int} in paragraph {int} of article {int} when ck editor is open', function (newContent, offset, paragraphNumber, articleNumber) {
    ckEditorWindow.appendContentInParagraphInArticle(newContent,paragraphNumber,articleNumber);
});

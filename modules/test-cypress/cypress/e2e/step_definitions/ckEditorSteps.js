import { When, And, Then } from "cypress-cucumber-preprocessor/steps";
import ckEditorWindow from "../pages/ckEditorWindow";

And('click delete button from keyboard in edition mode', () => {
    ckEditorWindow.clickDeleteFromKeyboardWhenCKEditorOpen();
})

And('click enter from keyboard in edition mode', () => {
    ckEditorWindow.clickEnterFromKeyboardWhenCKEditorOpen();
})

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

When('append {string} at offset {int} in numbered paragraph {int} of article when ck editor is open', function (newContent, offset, paragraphNumber) {
    ckEditorWindow.appendContentInNumberedParagraphOfArticle(newContent, offset, paragraphNumber);
});

When('click on paragraph mode icon present in ck editor panel', () => {
    ckEditorWindow.clickParagraphModeIcon();
})

And('click on increase indent icon present in ck editor panel', () => {
    ckEditorWindow.clickIncreaseIndentIcon();
})

And('click on decrease indent icon present in ck editor panel', () => {
    ckEditorWindow.clickDecreaseIndentIcon();
})

And('click on soft enter icon present in ck editor panel', () => {
    ckEditorWindow.clickSoftEnterIcon();
})

And('click on add subparagraph icon present in ck editor panel', () => {
    ckEditorWindow.clickAddSubParagraphIcon();
})

Then('decrease indent icon is disabled in ck editor panel', () => {
    ckEditorWindow.elements.decreaseIndentIcon().should('have.class', 'cke_button_disabled');
})

Then(`{int} plugins are available in ck editor window`, (count) => {
    ckEditorWindow.elements.ckEditorBtn().should('have.length', count);
});

Then(`save button is disabled in ck editor`, () => {
    ckEditorWindow.elements.saveBtn().invoke('attr', 'class').should('contain', 'disabled');
});

Then(`save close button is disabled in ck editor`, () => {
    ckEditorWindow.elements.saveAndCloseBtn().invoke('attr', 'class').should('contain', 'disabled');
});

Then(`close button is enabled in ck editor`, () => {
    ckEditorWindow.elements.closeBtn().should('not.be.disabled');
});

Then(`cut button is disabled in ck editor`, () => {
    ckEditorWindow.elements.cutBtn().invoke('attr', 'class').should('contain', 'disabled');
});

Then(`copy button is disabled in ck editor`, () => {
    ckEditorWindow.elements.copyBtn().invoke('attr', 'class').should('contain', 'disabled');
});

Then(`paste button is enabled in ck editor`, () => {
    ckEditorWindow.elements.pasteBtn().should('not.be.disabled');
});

Then(`undo button is disabled in ck editor`, () => {
    ckEditorWindow.elements.undoBtn().invoke('attr', 'class').should('contain', 'disabled');
});

Then(`redo button is disabled in ck editor`, () => {
    ckEditorWindow.elements.redoBtn().invoke('attr', 'class').should('contain', 'disabled');
});

Then(`subscript button is enabled in ck editor`, () => {
    ckEditorWindow.elements.subScriptBtn().should('not.be.disabled');
});

Then(`superscript button is enabled in ck editor`, () => {
    ckEditorWindow.elements.superScriptBtn().should('not.be.disabled');
});

Then(`special character button is enabled in ck editor`, () => {
    ckEditorWindow.elements.insertSpecialCharacterBtn().should('not.be.disabled');
});

Then(`show blocks button is enabled in ck editor`, () => {
    ckEditorWindow.elements.showBlockBtn().should('not.be.disabled');
});

Then(`source button is enabled in ck editor`, () => {
    ckEditorWindow.elements.sourceBtn().should('not.be.disabled');
});

Then(`increase indent icon is disabled in ck editor`, () => {
    ckEditorWindow.elements.increaseIndentIcon().should('have.class', 'cke_button_disabled');
});

Then(`increase indent icon is displayed and enabled in ck editor panel`, () => {
    ckEditorWindow.elements.increaseIndentIcon().should('be.visible');
    ckEditorWindow.elements.increaseIndentIcon().should('not.be.disabled');
});

Then(`decrease indent icon is displayed and enabled in ck editor panel`, () => {
    ckEditorWindow.elements.decreaseIndentIcon().should('be.visible');
    ckEditorWindow.elements.decreaseIndentIcon().should('not.be.disabled');
});

Then('paragraph {int} of article has attribute {string}', (paragraph, attributeName) => {
    ckEditorWindow.getNumberedParagraphElementOfArticle(paragraph).should('have.attr', attributeName);
})

When(`replace content {string} with the existing content in cover page long title`, (content) => {
    ckEditorWindow.replaceContentInDocPurpose(content);
});

When('append {string} at offset {int} in numbered paragraph {int} of article in edition mode', function (newContent, offset, paragraphNumber) {
    ckEditorWindow.appendContentInParagraphOfArticle(newContent, offset, paragraphNumber);
});

When('append {string} at offset {int} of child {int} of numbered paragraph {int} of article in edition mode', function (newContent, offset, child, paragraphNumber) {
    ckEditorWindow.appendContentInParagraphOfArticle(newContent, offset, paragraphNumber, child);
});

When('press {string} at offset {int} in numbered paragraph {int} of article in edition mode', function (key, offset, paragraphNumber) {
    ckEditorWindow.deleteContentInNumberedParagraphOfArticle(key, offset, paragraphNumber);
});

When('press {string} at offset {int} of child {int} of numbered paragraph {int} of article in edition mode', function (key, offset, child, paragraphNumber) {
    ckEditorWindow.deleteContentInNumberedParagraphOfArticle(key, offset, paragraphNumber, child);
});

When('press {int} times {string} at offset {int} of numbered paragraph {int} of article in edition mode', function (times, key, offset, paragraphNumber) {
    ckEditorWindow.deleteContentInNumberedParagraphOfArticle(key, offset, paragraphNumber, null, times);
});

When('press {int} times {string} at offset {int} of child {int} of numbered paragraph {int} of article in edition mode', function (times, key, offset, child, paragraphNumber) {
    ckEditorWindow.deleteContentInNumberedParagraphOfArticle(key, offset, paragraphNumber, child, times);
});

When('move the cursor position to offset {int} in paragraph {int} of article in edition mode', function (offset, paragraphNumber) {
    ckEditorWindow.moveCursorToSpecificOffsetInParagraphOfArticle(offset, paragraphNumber);
});

When('add {string} at offset {int} in citation in edition mode', function (newContent, offset) {
    ckEditorWindow.addContentInCitation(newContent, offset);
});

And('select content from offset {int} till offset {int} in citation in edition mode', function (offsetStart, offsetEnd) {
    ckEditorWindow.selectContentInCitation(offsetStart, offsetEnd);
});

When('add {string} at offset {int} in recital in edition mode', function (newContent, offset) {
    ckEditorWindow.addContentInRecital(newContent, offset);
});

And('select content from offset {int} till offset {int} in recital in edition mode', (offsetStart, offsetEnd) => {
    ckEditorWindow.selectContentInRecital(offsetStart, offsetEnd);
});

When('add {string} at current cursor position in edition mode', function (newContent) {
    ckEditorWindow.addTextAtCurrentCursorPositionWhenCKEditorOpen(newContent);
});

When(`select content from offset {int} till offset {int} in numbered paragraph {int} of article in edition mode`, (offsetStart, offsetEnd, paragraphNumber) => {
    ckEditorWindow.selectContentInNumberedParagraphOfArticle(offsetStart, offsetEnd, paragraphNumber);
});

Then(`numbered paragraph {int} of article contains {string} in edition mode`, (paragraphNumber, str) => {
    ckEditorWindow.getNumberedParagraphElementOfArticle(paragraphNumber).invoke('text').then((text) => {
        expect(text.trim()).equal(str);
    });
});

When(`append {string} at p tag {int} of level in edition mode`, (text, pTagNumber) => {
    ckEditorWindow.appendInCkEditorLevel(text,pTagNumber);
});

When(`select content from offset {int} to {int} of p tag {int} of level in edition mode`, (offsetStart, offsetEnd, pTagNumber) => {
    ckEditorWindow.selectContentInLevel(offsetStart, offsetEnd, pTagNumber);
});

When(`add content {string} to li {int} with data-akn-element {string} of article in edition mode`, (newContent, li, dataAknElement) => {
    ckEditorWindow.addContentInParagraphOfArticle(newContent, li, dataAknElement);
});

When(`add content {string} to li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article in edition mode`, (newContent, pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement) => {
    ckEditorWindow.addContentInPointOfParagraphOfArticle(newContent, pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement);
});

When(`add content {string} to li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article in edition mode`, (newContent, li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3) => {
    ckEditorWindow.addContentInSecondLayerPointOfParagraphOfArticle(newContent, li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3);
});

When(`add content {string} to li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article in edition mode`, (newContent, li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4) => {
    ckEditorWindow.addContentInThirdLayerPointOfParagraphOfArticle(newContent, li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4);
});

When(`add content {string} to li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article in edition mode`, (newContent, li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4, li5, dataAknElement5) => {
    ckEditorWindow.addContentInFourthLayerPointOfParagraphOfArticle(newContent, li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4, li5, dataAknElement5);
});

When(`click at offset {int} of li {int} with data-akn-element {string} of article in edition mode`, (offset, paragraphLi, paragraphDataAknElement) => {
    ckEditorWindow.clickAtSpecificOffsetInParagraphOfArticle(offset, paragraphLi, paragraphDataAknElement);
});

When(`click at offset {int} in li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article in edition mode`, (pointOffset, pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement) => {
    ckEditorWindow.moveCursorToSpecificOffsetInPointOfParagraphOfArticle(pointOffset, pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement);
});

When(`p tag {int} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article contains {string} in edition mode`, (pTag, pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement, newContent) => {
    ckEditorWindow.getElementPTagOfPointOfParagraphOfArticle(pTag, pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).invoke('text').should('contain', newContent);
});

When(`click at offset {int} of p tag {int} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article in edition mode`, (pointOffset, pTag, pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement) => {
    ckEditorWindow.moveCursorToSpecificOffsetInPTagOfPointOfParagraphOfArticle(pointOffset, pTag, pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement);
});

Then(`p tag {int} of li {int} with data-akn-element {string} of article contains {string} in edition mode`, (pTag, paragraphLi, paragraphDataAknElement, content) => {
    ckEditorWindow.getElementPTagOfParagraphOfArticle(pTag, paragraphLi, paragraphDataAknElement).invoke('text').should('contain', content);
});

Then(`{string} attribute is not present in li {int} with data-akn-element {string} of article in edition mode`, (attribute, li, dataAknElement) => {
    ckEditorWindow.getParagraphElementOfArticle(li, dataAknElement).should('not.have.attr', attribute);
});

When(`click on internal reference icon present in ck editor panel`, () => {
    ckEditorWindow.clickInternalReferenceIcon();
});

When(`click at offset {int} of child {int} of citation in edition mode`, (offset, child) => {
    ckEditorWindow.clickAtSpecificOffsetInChildOfCitation(offset, child);
});

Then(`internal reference icon is not present in ck editor panel`, function () {
    ckEditorWindow.elements.internalReferenceIcon().should('not.exist');
});

When('move the cursor position to offset {int} in pTag {int} of level in edition mode', (offset, pTagNumber) => {
    ckEditorWindow.moveCursorToSpecificOffsetInLevel(offset, pTagNumber);
});

Then('pTag {int} of level contains {string} in edition mode', (pTagNumber, text) =>{
    ckEditorWindow.getElementPTagOfLevel(pTagNumber).should('include.text', text);
});

When('append {string} to p tag {int} with data akn element subparagraph of level in edition mode', (content, pTagNumber) =>{
    ckEditorWindow.addContentInSubParagraphOfLevel(content, pTagNumber);
});

When('click at offset {int} in pTag {int} with data-akn-element {string} of li with data-akn-element {string} of ol with data-akn-element {string} in edition mode',  (offSet, pTagNumber, dataAknElement1, dataAknElement2, dataAknElement3) => {
    ckEditorWindow.clickAtSpecificOffsetInSubparagraphOfLevel(offSet, pTagNumber, dataAknElement1, dataAknElement2, dataAknElement3);
});

Then('header of level in financial statement is not editable in ck editor text box', () => {
    ckEditorWindow.getHeadingOfLevel().invoke('attr', 'contenteditable').should('eq', 'false');
});


Then('drafting rule violations dialog box displayed with message {string}', (msg) => {
    ckEditorWindow.getCkEditorDialogHtml().invoke('text').then(text => expect(text.trim()).equal(msg));
});

Then('click dialog ok button', () => {
    ckEditorWindow.clickCkEditorDialogOkBtn();
});

And('do right click using mouse in edition mode', () => {
    ckEditorWindow.rightClickWhenCKEditorOpen();
})

// Then('background color of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article is {string} in edition mode', function (pointLi, dataAknElementPoint, paragraphLi, dataAknElementParagraph, backGroundColor) {
//
// });
//
// And('li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article contains attribute {string} with value {string} in edition mode', function (pointLi, dataAknElementPoint, paragraphLi, dataAknElementParagraph, attributeName, attributeValue) {
//
// });
//
// And("li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article doesn't contain attribute {string} in edition mode", function (pointLi, dataAknElementPoint, paragraphLi, dataAknElementParagraph, attributeName) {
//
// });
//
// And('li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article contains attribute {string} in edition mode', function (pointLi, dataAknElementPoint, paragraphLi, dataAknElementParagraph, attributeName) {
//
// });
//
// When('click at offset {int} in li {int} with data-akn-element {string} of article in edition mode', function () {
//
// });
//
// Then('background color of li {int} with data-akn-element {string} of article is {string} in edition mode', function () {
//
// });
//
// Then("li {int} with data-akn-element {string} of article doesn't contain attribute {string} in edition mode", function () {
//
// });
//
// Then('li {int} with data-akn-element {string} of article contains attribute {string} with value {string} in edition mode', function () {
//
// });
//
// Then('li {int} with data-akn-element {string} of article contains attribute {string} in edition mode', function () {
//
// });
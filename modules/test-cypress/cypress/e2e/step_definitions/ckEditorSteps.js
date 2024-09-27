import { When, And, Then } from "cypress-cucumber-preprocessor/steps";
import ckEditorWindow from "../pages/ckEditorWindow";

And('click delete button from keyboard in edition mode', () => {
    ckEditorWindow.clickDeleteFromKeyboardWhenCKEditorOpen();
})

And('click enter from keyboard in edition mode', () => {
    ckEditorWindow.clickEnterFromKeyboardWhenCKEditorOpen();
})

And('click backspace from keyboard in edition mode', function () {
    ckEditorWindow.clickBackspaceFromKeyboardWhenCKEditorOpen();
});

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
    ckEditorWindow.elements.insertSpecialCharacterIcon().should('not.be.disabled');
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

When('select content from offset {int} till offset {int} in paragraph in edition mode', function (offsetStart, offsetEnd) {
    ckEditorWindow.selectContentInParagraph(offsetStart, offsetEnd);
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
        expect(text.trim()).contain(str);
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

When(`click at offset {int} of child {int} of li {int} with data-akn-element {string} of article in edition mode`, (offset, child, paragraphLi, paragraphDataAknElement) => {
    ckEditorWindow.clickAtSpecificOffsetInChildOfParagraphOfArticle(offset, child, paragraphLi, paragraphDataAknElement);
});

Then('li {int} with data-akn-element {string} of article contains attribute {string} with value {string} in edition mode', function (li, dataAknElement, attributeName, attributeValue) {
    ckEditorWindow.getParagraphElementOfArticle(li, dataAknElement).should('have.attr', attributeName).and('equal', attributeValue);
});

Then('recital with {string} contains attribute {string} with value {string} in edition mode', function (recitalNumber, attributeName, attributeValue) {
    ckEditorWindow.getRecitalOfNumber(recitalNumber).should('have.attr', attributeName).and('equal', attributeValue);
});

Then('li {int} with data-akn-element {string} of article contains attribute {string} in edition mode', function (li, dataAknElement, attributeName) {
    ckEditorWindow.getParagraphElementOfArticle(li, dataAknElement).should('have.attr', attributeName);
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

Then('{int} paragraphs are present in article in edition mode', function (paragraphCount) {
    ckEditorWindow.getAllParagraphElementsOfArticle().should('have.length', paragraphCount);
});

When('do right click in li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article in edition mode', function (pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement) {
    ckEditorWindow.getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).rightclick({force:true});
});

When('do right click in li {int} with data-akn-element {string} of article in edition mode', function (paragraphLi, paragraphDataAknElement) {
    ckEditorWindow.getParagraphElementOfArticle(paragraphLi, paragraphDataAknElement).rightclick({force:true});
});

And("li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article doesn't contain attribute {string} in edition mode", function (pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement, attributeName) {
    ckEditorWindow.getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).should('not.have.attr', attributeName);
});

And('li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article contains attribute {string} in edition mode', function (pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement, attributeName) {
    ckEditorWindow.getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).should('have.attr', attributeName);
});

Then("li {int} with data-akn-element {string} of article doesn't contain attribute {string} in edition mode", function (paragraphLi, paragraphDataAknElement, attributeName) {
    ckEditorWindow.getParagraphElementOfArticle(paragraphLi, paragraphDataAknElement).should('not.have.attr', attributeName);
});

And('li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article contains attribute {string} with value {string} in edition mode', function (pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement, attributeName, attributeValue) {
    ckEditorWindow.getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).should('have.attr', attributeName, attributeValue);
});

Then('li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article contains attribute {string} with value {string} in edition mode', function (pointLiSecondLayer, pointDataAknElementSecondLayer, pointLiFirstLayer, pointDataAknElementFirstLayer, paragraphLi, paragraphDataAknElement, attributeName, attributeValue) {
    ckEditorWindow.getSecondLevelPointOfParagraphOfArticle(pointLiSecondLayer, pointDataAknElementSecondLayer, pointLiFirstLayer, pointDataAknElementFirstLayer, paragraphLi, paragraphDataAknElement).should('have.attr', attributeName, attributeValue);
});

Then('li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article contains attribute {string} with value {string} in edition mode', function (pointLiThirdLayer, pointDataAknElementThirdLayer, pointLiSecondLayer, pointDataAknElementSecondLayer, pointLiFirstLayer, pointDataAknElementFirstLayer, paragraphLi, paragraphDataAknElement, attributeName, attributeValue) {
    ckEditorWindow.getThirdLevelPointOfParagraphOfArticle(pointLiThirdLayer, pointDataAknElementThirdLayer, pointLiSecondLayer, pointDataAknElementSecondLayer, pointLiFirstLayer, pointDataAknElementFirstLayer, paragraphLi, paragraphDataAknElement).should('have.attr', attributeName, attributeValue);
});

Then('background color of li {int} with data-akn-element {string} of article is {string} in edition mode', function (paragraphLi, paragraphDataAknElement, backgroundColor) {
    ckEditorWindow.getParagraphElementOfArticle(paragraphLi, paragraphDataAknElement).should('have.css', 'background-color').and('eq', backgroundColor);
});

Then('background color of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article is {string} in edition mode', function (pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement, backgroundColor) {
    ckEditorWindow.getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).should('have.css', 'background-color').and('eq', backgroundColor);
});

When('click on cut icon present in ck editor panel', function () {
    ckEditorWindow.clickCutIcon();
});

When('click on copy icon present in ck editor panel', function () {
    ckEditorWindow.clickCopyIcon();
});

When('click on space bar from keyboard in edition mode', function () {
    ckEditorWindow.clickSpaceBarFromKeyboardWhenCKEditorOpen();
});

When('click on subscript icon present in ck editor panel', function () {
    ckEditorWindow.clickSubScriptIcon();
});

When('click on superscript icon present in ck editor panel', function () {
    ckEditorWindow.clickSuperScriptIcon();
});

When('click on undo icon present in ck editor panel', function () {
    ckEditorWindow.clickUndoIcon();
});

When('click on redo icon present in ck editor panel', function () {
    ckEditorWindow.clickRedoIcon();
});

When('click on insert footnote icon present in ck editor panel', function () {
    ckEditorWindow.clickInsertFootNoteIcon();
});

When('click on table icon present in ck editor panel', function () {
    ckEditorWindow.clickTableIcon();
});

When('click on math icon present in ck editor panel', function () {
    ckEditorWindow.clickMathIcon();
});

When('click on bold icon present in ck editor panel', function () {
    ckEditorWindow.clickBoldIcon();
});

When('click on italic icon present in ck editor panel', function () {
    ckEditorWindow.clickItalicIcon();
});

When('click on change text case icon present in ck editor panel', function () {
    ckEditorWindow.clickChangeTextCaseIcon();
});

When('click on insert special character icon present in ck editor panel', function () {
    ckEditorWindow.clickInsertSpecialCharacterIcon();
});

Then('undo button is enabled in ck editor', function () {
    ckEditorWindow.elements.undoBtn().should('not.be.disabled');
});

Then('redo button is enabled in ck editor', function () {
    ckEditorWindow.elements.redoBtn().should('not.be.disabled');
});

Then('{string} tag is present in citation in edition mode', function (tagName) {
    ckEditorWindow.elements.pTag().find(tagName).should('exist');
});

Then('{string} tag is not present in citation in edition mode', function (tagName) {
    ckEditorWindow.elements.pTag().find(tagName).should('not.exist');
});

Then('{string} tag is present in recital in edition mode', function (tagName) {
    ckEditorWindow.elements.pTag().find(tagName).should('exist');
});

Then('{string} tag is not present in recital in edition mode', function (tagName) {
    ckEditorWindow.elements.pTag().find(tagName).should('not.exist');
});

Then('citation contains text {string} in edition mode', function (text) {
    ckEditorWindow.elements.pTag().should('include.text', text);
});

Then('recital contains text {string} in edition mode', function (text) {
    ckEditorWindow.elements.pTag().should('include.text', text);
});

Then('authorial note with marker {int} and title {string} is present inside citation in edition mode', function (markerNumber, title) {
    ckEditorWindow.getAuthorialNoteWithMarkerNumber(markerNumber).should('have.attr', 'title', title);
});

Then('authorial note with marker {int} and title {string} is present inside recital in edition mode', function (markerNumber, title) {
    ckEditorWindow.getAuthorialNoteWithMarkerNumber(markerNumber).should('have.attr', 'title', title);
});

Then('numbered paragraph {int} of article contains text {string} in edition mode', function (paragraphNumber, text) {
    ckEditorWindow.getParagraphElementOfArticle(paragraphNumber, 'paragraph').should('include.text', text);
});

Then('numbered paragraph {int} of article contains {string} tag in edition mode', function (paragraphNumber, tagName) {
    ckEditorWindow.getTagElementFromParagraphOfArticle(paragraphNumber, tagName).should('exist');
});

Then("numbered paragraph {int} of article doesn't contain {string} tag in edition mode", function (paragraphNumber, tagName) {
    ckEditorWindow.getTagElementFromParagraphOfArticle(paragraphNumber, tagName).should('not.exist');
});

Then('numbered paragraph {int} of article contains authorial note with marker {int} and title {string} in edition mode', function (paragraphNumber, markerNumber, title) {
    ckEditorWindow.getAuthorialNoteWithMarkerNumberFromParagraphOfArticle(paragraphNumber, markerNumber).should('have.attr','title', title);
});

When('click at offset {int} of child {int} of recital in edition mode', function (offset, child) {
    ckEditorWindow.clickAtSpecificOffsetInChildOfRecital(offset, child);
});

When('add {string} at offset {int} in paragraph in edition mode', function (newContent, offset) {
    ckEditorWindow.addContentInParagraph(newContent, offset);
});

When(/^click on paragraph mode icon two times present in ck editor panel$/, function () {
    ckEditorWindow.clickTwoTimesParagraphModeIcon();
});
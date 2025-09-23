import {When, Then} from "@badeball/cypress-cucumber-preprocessor";
import ckEditorWindow from "../pages/ckEditorWindow";

When('click delete button from keyboard in edition mode', () => {
    ckEditorWindow.clickDeleteFromKeyboardWhenCKEditorOpen();
})

When('click enter from keyboard in edition mode', () => {
    ckEditorWindow.clickEnterFromKeyboardWhenCKEditorOpen();
})

When('click end from keyboard in edition mode', () => {
    ckEditorWindow.clickEndFromKeyboardWhenCKEditorOpen();
})

When('click right arrow from keyboard in edition mode', () => {
    ckEditorWindow.clickRightArrowFromKeyboardWhenCKEditorOpen();
})

When('click down arrow from keyboard in edition mode', () => {
    ckEditorWindow.clickDownArrowFromKeyboardWhenCKEditorOpen();
})

When('click backspace from keyboard in edition mode', function () {
    ckEditorWindow.clickBackspaceFromKeyboardWhenCKEditorOpen();
});

When(/^click ctrl key and enter key together from keyboard in edition mode$/, function () {
    ckEditorWindow.clickCtrlAndEnterFromKeyboardWhenCKEditorOpen();
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

When('click on increase indent icon present in ck editor panel', () => {
    ckEditorWindow.clickIncreaseIndentIcon();
})

When('click on decrease indent icon present in ck editor panel', () => {
    ckEditorWindow.clickDecreaseIndentIcon();
})

When('click on soft enter icon present in ck editor panel', () => {
    ckEditorWindow.clickSoftEnterIcon();
})

When('click on add subparagraph icon present in ck editor panel', () => {
    ckEditorWindow.clickAddSubParagraphIcon();
})

When(/^click on numberedList icon present in ck editor panel$/, function () {
    ckEditorWindow.clickNumberedListIcon();
});

When(/^click on bulletedList icon present in ck editor panel$/, function () {
    ckEditorWindow.clickBulletedListIcon();
});

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

Then('table icon is disabled in ck editor', () => {
    ckEditorWindow.elements.tableIcon().should('have.class', 'cke_button_disabled');
});

Then(`table icon is enabled in ck editor`, () => {
    ckEditorWindow.elements.tableIcon().should('not.have.class', 'cke_button_disabled');
});

Then(/^internal reference icon is disabled in ck editor panel$/, function () {
    ckEditorWindow.elements.internalReferenceIcon().should('have.class', 'cke_button_disabled');
});

Then(/^insert footnote icon is disabled in ck editor panel$/, function () {
    ckEditorWindow.elements.insertFootNoteIcon().should('have.class', 'cke_button_disabled');
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

Then(`click source button`, () => {
    ckEditorWindow.clickSourceIcon();
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

When('select content from offset {int} till offset {int} in citation in edition mode', function (offsetStart, offsetEnd) {
    ckEditorWindow.selectContentInCitation(offsetStart, offsetEnd);
});

When('add {string} at offset {int} in recital in edition mode', function (newContent, offset) {
    ckEditorWindow.addContentInRecital(newContent, offset);
});

When('select content from offset {int} till offset {int} in recital in edition mode', (offsetStart, offsetEnd) => {
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
    ckEditorWindow.appendInCkEditorLevel(text, pTagNumber);
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

When('select content from offset {int} till offset {int} in li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article in edition mode', function (offsetStart, offsetEnd, li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4, li5, dataAknElement5) {
    ckEditorWindow.selectContentInFourthLayerPointOfParagraphOfArticle(offsetStart, offsetEnd, li1, dataAknElement1, li2, dataAknElement2, li3, dataAknElement3, li4, dataAknElement4, li5, dataAknElement5);
});

When(`click at offset {int} of li {int} with data-akn-element {string} of article in edition mode`, (offset, paragraphLi, paragraphDataAknElement) => {
    ckEditorWindow.clickAtSpecificOffsetInParagraphOfArticle(offset, paragraphLi, paragraphDataAknElement);
});

When(`click at offset {int} of child {int} of li {int} with data-akn-element {string} of article in edition mode`, (offset, child, paragraphLi, paragraphDataAknElement) => {
    ckEditorWindow.clickAtSpecificOffsetInChildOfParagraphOfArticle(offset, child, paragraphLi, paragraphDataAknElement);
});

When(`click at offset {int} of pTag {int} of li {int} with data-akn-element {string} of article in edition mode`, function (offSet, pTagNumber, paragraphLi, paragraphDataAknElement) {
    ckEditorWindow.clickAtSpecificOffsetInPTagOfParagraphOfArticle(offSet, pTagNumber, paragraphLi, paragraphDataAknElement);
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

Then('li {int} with data-akn-element {string} of article contains {string} in edition mode', function (li, dataAknElement, content) {
    ckEditorWindow.getParagraphElementOfArticle(li, dataAknElement).invoke('text').should('contain', content);
});

Then(`p tag {int} of li {int} with data-akn-element {string} of article contains html {string} in edition mode`, (pTag, paragraphLi, paragraphDataAknElement, content) => {
    ckEditorWindow.getElementPTagOfParagraphOfArticle(pTag, paragraphLi, paragraphDataAknElement).should('include.html', content);
});

Then(`p tag {int} of li {int} with data-akn-element {string} of article should have {string} with value {string} in edition mode`, (pTag, paragraphLi, paragraphDataAknElement, attributeName, attributeValue) => {
    ckEditorWindow.getElementPTagOfParagraphOfArticle(pTag, paragraphLi, paragraphDataAknElement).should('have.attr', attributeName, attributeValue);
});

Then(`p tag {int} of li {int} with data-akn-element {string} of article should not have {string} in edition mode`, (pTag, paragraphLi, paragraphDataAknElement, attributeName) => {
    ckEditorWindow.getElementPTagOfParagraphOfArticle(pTag, paragraphLi, paragraphDataAknElement).should('not.have.attr', attributeName);
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

Then(`internal reference icon is present in ck editor panel`, function () {
    ckEditorWindow.elements.internalReferenceIcon().should('exist');
});

When('move the cursor position to offset {int} in pTag {int} of level in edition mode', (offset, pTagNumber) => {
    ckEditorWindow.moveCursorToSpecificOffsetInLevel(offset, pTagNumber);
});

When('move the cursor position to offset {int} in pTag {int} of fs level in edition mode', (offset, pTagNumber) => {
    ckEditorWindow.moveCursorToSpecificOffsetInFSLevel(offset, pTagNumber);
});

Then('pTag {int} of level contains {string} in edition mode', (pTagNumber, text) => {
    ckEditorWindow.getElementPTagOfLevel(pTagNumber).should('include.text', text);
});

Then('paragraph contains {string} in edition mode', (text) => {
    ckEditorWindow.getParagraph().should('include.text', text);
});

When(/^click at offset (\d+) of paragraph in edition mode$/, function (offSet) {
    ckEditorWindow.moveCursorToSpecificOffsetInParagraph(offSet);
});

When('append {string} to p tag {int} with data akn element subparagraph of level in edition mode', (content, pTagNumber) => {
    ckEditorWindow.addContentInSubParagraphOfLevel(content, pTagNumber);
});

When('click at offset {int} in pTag {int} with data-akn-element {string} of li with data-akn-element {string} of ol with data-akn-element {string} in edition mode', (offSet, pTagNumber, dataAknElement1, dataAknElement2, dataAknElement3) => {
    ckEditorWindow.clickAtSpecificOffsetInSubparagraphOfLevel(offSet, pTagNumber, dataAknElement1, dataAknElement2, dataAknElement3);
});

When('click at offset {int} of li {int} with data-akn-element {string} in edition mode', (offSet, paragraphLi, dataAknElement) => {
    ckEditorWindow.clickAtSpecificOffsetInParagraph(offSet, paragraphLi, dataAknElement);
});

When('click at offset {int} of span tag with attribute name {string} and value {string} of li tag {int} with attribute name {string} and value {string} of ol tag of level in edition mode', function (offSet, spanAttributeName, spanAttributeValue, LiTag1Number, LiTag1AttributeName, LiTag1AttributeValue) {
    ckEditorWindow.clickAtSpecificOffsetInSpanOfFirstLayerPointInLevel(offSet, spanAttributeName, spanAttributeValue, LiTag1Number, LiTag1AttributeName, LiTag1AttributeValue);
});

When('click at offset {int} of span tag with attribute name {string} and value {string} of li tag {int} with attribute name {string} and value {string} of ol tag of li tag {int} of ol tag of level in edition mode', function (offSet, spanAttributeName, spanAttributeValue, LiTag2Number, LiTag2AttributeName, LiTag2AttributeValue, LiTag1Number) {
    ckEditorWindow.clickAtSpecificOffsetInSpanOfSecondLayerPointInLevel(offSet, spanAttributeName, spanAttributeValue, LiTag2Number, LiTag2AttributeName, LiTag2AttributeValue, LiTag1Number);
});

When('click at offset {int} of span tag with attribute name {string} and value {string} of li tag {int} with attribute name {string} and value {string} of ol tag of li tag {int} of ol tag of li tag {int} of ol tag of level in edition mode', function (offSet, spanAttributeName, spanAttributeValue, LiTag3Number, LiTag3AttributeName, LiTag3AttributeValue, LiTag2Number, LiTag1Number) {
    ckEditorWindow.clickAtSpecificOffsetInSpanOfThirdLayerPointInLevel(offSet, spanAttributeName, spanAttributeValue, LiTag3Number, LiTag3AttributeName, LiTag3AttributeValue, LiTag2Number, LiTag1Number);
});

When('click at offset {int} of span tag with attribute name {string} and value {string} of li tag {int} with attribute name {string} and value {string} of ol tag of li tag {int} of ol tag of li tag {int} of ol tag of li tag {int} of ol tag of level in edition mode', function (offSet, spanAttributeName, spanAttributeValue, LiTag4Number, LiTag4AttributeName, LiTag4AttributeValue, LiTag3Number, LiTag2Number, LiTag1Number) {
    ckEditorWindow.clickAtSpecificOffsetInSpanOfFourthLayerPointInLevel(offSet, spanAttributeName, spanAttributeValue, LiTag4Number, LiTag4AttributeName, LiTag4AttributeValue, LiTag3Number, LiTag2Number, LiTag1Number);
});

When(`click at cell {int} of row {int} of table {int} of li {int} with data-akn-element {string} in edition mode`, (cell, row, table, paragraphLi, dataAknElement) => {
    ckEditorWindow.clickAtCellInRowInTableOfParagraph(cell, row, table, paragraphLi, dataAknElement);
});

Then('header of level in financial statement is not editable in ck editor text box', () => {
    ckEditorWindow.getHeadingOfLevel().invoke('attr', 'contenteditable').should('eq', 'false');
});

Then('drafting rule violations dialog box displayed with message {string}', (msg) => {
    ckEditorWindow.getCkEditorDialogHtml().invoke('text').then(text => expect(text.trim()).equal(msg));
});

Then('{int} paragraphs are present in article in edition mode', function (paragraphCount) {
    ckEditorWindow.getAllParagraphElementsOfArticle().should('have.length', paragraphCount);
});

When('do right click in li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article in edition mode', function (pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement) {
    ckEditorWindow.getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).rightclick({force: true});
});

When('do right click in li {int} with data-akn-element {string} of article in edition mode', function (paragraphLi, paragraphDataAknElement) {
    ckEditorWindow.getParagraphElementOfArticle(paragraphLi, paragraphDataAknElement).rightclick({force: true});
});

Then("li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article doesn't contain attribute {string} in edition mode", function (pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement, attributeName) {
    ckEditorWindow.getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).should('not.have.attr', attributeName);
});

Then('li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article contains attribute {string} in edition mode', function (pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement, attributeName) {
    ckEditorWindow.getPointOfParagraphOfArticle(pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement).should('have.attr', attributeName);
});

Then("li {int} with data-akn-element {string} of article doesn't contain attribute {string} in edition mode", function (paragraphLi, paragraphDataAknElement, attributeName) {
    ckEditorWindow.getParagraphElementOfArticle(paragraphLi, paragraphDataAknElement).should('not.have.attr', attributeName);
});

Then('li {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article contains attribute {string} with value {string} in edition mode', function (pointLi, pointDataAknElement, paragraphLi, paragraphDataAknElement, attributeName, attributeValue) {
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

When('click on alternative1 icon present in ck editor panel', function () {
    ckEditorWindow.clickCkEditorLeosAlternative1Btn();
});

When('click on alternative2 icon present in ck editor panel', function () {
    ckEditorWindow.clickCkEditorLeosAlternative2Btn();
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

Then('authorial note with marker {string} and title {string} is present inside citation in edition mode', function (markerNumber, title) {
    ckEditorWindow.getAuthorialNoteWithMarkerNumber(markerNumber).should('have.attr', 'title', title);
});

Then('authorial note with marker {string} and title {string} is present inside recital in edition mode', function (markerNumber, title) {
    ckEditorWindow.getAuthorialNoteWithMarkerNumber(markerNumber).should('have.attr', 'title', title);
});

Then('authorial note with marker {string} and title {string} is present inside level in edition mode', function (markerNumber, title) {
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

Then('numbered paragraph {int} of article contains authorial note with marker {string} and title {string} in edition mode', function (paragraphNumber, markerNumber, title) {
    ckEditorWindow.getAuthorialNoteWithMarkerNumberFromParagraphOfArticle(paragraphNumber, markerNumber).should('have.attr', 'title', title);
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

When(`click on image icon present in ck editor panel`, () => {
    ckEditorWindow.clickInsertImageIcon();
});

When(`upload an image file from a relative location {string} in iframe {string}`, (location, iframeClass) => {
    ckEditorWindow.uploadImageFile("cypress/fixtures/images/" + location, iframeClass);
});

Then(/^paragraph mode icon is disabled in ck editor panel$/, function () {
    ckEditorWindow.elements.paragraphModeIcon().should('have.class', 'cke_button_disabled');
});

Then(/^paragraph mode icon is enabled in ck editor panel$/, function () {
    ckEditorWindow.elements.paragraphModeIcon().should('not.be.disabled');
});

Then('check content inside ckeditor is of size {int}', function (size) {
    cy.window().then((win) => {
        const focusedElement = win.document.querySelectorAll(':focus');
        expect(focusedElement.length).to.equal(1);
        expect(focusedElement[0].innerHTML.length).to.equal(size);
    });
});

Then('content inside ckeditor contains {string}', function (text) {
    cy.window().then((win) => {
        const focusedElement = win.document.querySelectorAll(':focus');
        expect(focusedElement[0].innerHTML).contains(text);
    });
});

Then('alternative 1 and alternative 2 are present', () => {
    ckEditorWindow.elements.ckEditorLeosAlternative1Btn().should('be.visible');
    ckEditorWindow.elements.ckEditorLeosAlternative2Btn().should('be.visible');
})

Then('check content inside ckeditor is greater than {int}', function (size) {
    cy.window().then((win) => {
        const focusedElement = win.document.querySelectorAll(':focus');
        expect(focusedElement.length).to.equal(1);
        expect(focusedElement[0].innerHTML.length).to.greaterThan(size);
    });
});

When('click at offset {int} of pTag {int} with data-akn-element {string} of li {int} with data-akn-element {string} of article in edition mode', function (offset, pTagNumber, pTagDataAknElement, paragraphLi, paragraphDataAknElement) {
    ckEditorWindow.clickAtSpecificOffsetInSubparagraphOfParagraphOfArticle(offset, pTagNumber, pTagDataAknElement, paragraphLi, paragraphDataAknElement);
});

When(/^click at offset (\d+) of pTag (\d+) of level in edition mode$/, function (offSet, pTagNumber) {
    ckEditorWindow.clickAtSpecificOffsetInPTagOfLevel(offSet, pTagNumber);
});

Then('level contains attribute name {string} with attribute value {string} in edition mode', function (attributeName, attributeValue) {
    ckEditorWindow.getElementLiTagOfLevel().should('have.attr', attributeName).and('equal', attributeValue);
});

When(/^double click on internal reference link (\d+) in edition mode$/, function (count) {
    ckEditorWindow.clickInterReferenceLink(count);
});

Then(/^innerText of internal reference link (\d+) is "([^"]*)" in edition mode$/, function (count, innerText) {
    ckEditorWindow.getRefTag(count).should('have.text', innerText);
});

Then(/^p tag is present inside blockContainer in edition mode$/, function () {
    ckEditorWindow.elements.pTagFromBlockContainer().should('exist');
});

Then(/^ol tag of blockContainer contains attribute "([^"]*)" with value "([^"]*)" in edition mode$/, function (attributeName, attributeValue) {
    ckEditorWindow.elements.olTagFromBlockContainer().should('have.attr', attributeName).and('equal', attributeValue);
});

When(/^click at offset (\d+) in li with attribute "([^"]*)" with value "([^"]*)" of ol tag of blockContainer in edition mode$/, function (offSet, attributeName, attributeValue) {
    ckEditorWindow.clickAtSpecificOffsetOfLiTagOfOlOfBlockContainer(offSet, attributeName, attributeValue);
});

When(/^select content from offset (\d+) till offset (\d+) in li with attribute "([^"]*)" with value "([^"]*)" of ol tag of blockContainer in edition mode$/, function (offSetStart, offSetEnd, attributeName, attributeValue) {
    ckEditorWindow.selectContentInLiOfOlOfBlockContainer(offSetStart, offSetEnd, attributeName, attributeValue);
});

Then(/^content of li with attribute "([^"]*)" with value "([^"]*)" of ol tag of blockContainer contains "([^"]*)" in edition mode$/, function (attributeName, attributeValue, content) {
    ckEditorWindow.getLiTagFromOlOfBlockContainer(attributeName, attributeValue).should('have.text', content);
});

When(/^alternative1 is selected in ck editor panel$/, function () {
    ckEditorWindow.elements.ckEditorLeosAlternative1Btn().should('have.class', 'cke_button_on');
});

When(/^alternative2 is selected in ck editor panel$/, function () {
    ckEditorWindow.elements.ckEditorLeosAlternative2Btn().should('have.class', 'cke_button_on');
});

Then(/^content of clause is "([^"]*)" in edition mode$/, function (content) {
    ckEditorWindow.elements.clauseContent().should('have.text', content);
});

Then('content of p tag {int} with attribute {string} with value {string} of blockContainer contains {string} in edition mode', function (pTagCount, attributeName, attributeValue, content) {
    ckEditorWindow.getPTagFromBlockContainer(attributeName, attributeValue).eq(pTagCount-1).should('include.text', content);
});

When(/^click at offset (\d+) in p with attribute "([^"]*)" with value "([^"]*)" of blockContainer in edition mode$/, function (offSet, attributeName, attributeValue) {
    ckEditorWindow.clickAtSpecificOffsetOfPTagOfBlockContainer(offSet, attributeName, attributeValue);
});

When('user clicks on the track changes action plugin', () => {
    ckEditorWindow.clickTrackChangesActionPlugin();
});

Then('track changes action dropdown displays the following options:', (dataTable) => {
    const expectedActionList = dataTable.raw().flat();
    ckEditorWindow.getCkePanelListItem()
        .should('have.length', expectedActionList.length)
        .each(($el, index) => {
            cy.wrap($el).find('a').invoke('text').then(text => {
                expect(text.trim()).to.equal(expectedActionList[index]);
            });
        });
});

When('click on accept all changes dropdown button', () => {
    ckEditorWindow.getIframeBodyTcPlugin().within(() => {
        ckEditorWindow.clickAcceptAll();
    });
});

When('click on reject all changes dropdown button', () => {
    ckEditorWindow.getIframeBodyTcPlugin().within(() => {
        ckEditorWindow.clickRejectAll();
    });
});

Then('citation should not contain a span tag in edition mode', () => {
    ckEditorWindow.elements.pTag().find('span').should('not.exist');
});

Then('recital should not contain a span tag in edition mode', () => {
    ckEditorWindow.elements.pTag().find('span').should('not.exist');
});

Then(/^article should not contain a span tag in edition mode$/, function () {
    ckEditorWindow.elements.article().find('span').should('not.exist');
});

Then(/^level should not contain a span tag in edition mode$/, function () {
    ckEditorWindow.elements.level().find('span').should('not.exist');
});

Then(/^paragraph should not contain a span tag in edition mode$/, function () {
    ckEditorWindow.elements.paragraph().find('span').should('not.exist');
});

Then(/^citation contains span tag with attribute name "([^"]*)" with value "([^"]*)" in edition mode$/, function (attributeName, attributeValue) {
    ckEditorWindow.elements.pTag().find('span').should('have.attr', attributeName).and('equal', attributeValue);
});

Then(/^recital contains span tag with attribute name "([^"]*)" with value "([^"]*)" in edition mode$/, function (attributeName, attributeValue) {
    ckEditorWindow.elements.pTag().find('span').should('have.attr', attributeName).and('equal', attributeValue);
});

When(/^right click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of paragraph in edition mode$/, function (liTag, attributeName, attributeValue) {
    ckEditorWindow.rightClickOnSubparagraphOfParagraph(liTag, attributeName, attributeValue);
});

When(/^click at offset (\d+) of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of paragraph in edition mode$/, function (offSet, liTag, attributeName, attributeValue) {
    ckEditorWindow.clickAtSpecificOffsetInSubparagraphOfParagraph(offSet, liTag, attributeName, attributeValue);
});

When(/^click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of paragraph in edition mode$/, function (liTag, attributeName, attributeValue) {
    ckEditorWindow.clickOnSubparagraphOfParagraph(liTag, attributeName, attributeValue);
});

When(/^right click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of paragraph in edition mode$/, function (liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
    ckEditorWindow.rightClickOnFirstLayerElementOfParagraph(liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue);
});

When(/^click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of paragraph in edition mode$/, function (liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
    ckEditorWindow.clickOnFirstLayerElementOfParagraph(liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue);
});

When(/^right click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of paragraph in edition mode$/, function (liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
    ckEditorWindow.rightClickOnSecondLayerElementOfParagraph(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue);
});

When(/^click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of paragraph in edition mode$/, function (liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
    ckEditorWindow.clickOnSecondLayerElementOfParagraph(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue);
});

When(/^right click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of paragraph in edition mode$/, function (liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
    ckEditorWindow.rightClickOnThirdLayerElementOfParagraph(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue);
});

When(/^click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of paragraph in edition mode$/, function (liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
    ckEditorWindow.clickOnThirdLayerElementOfParagraph(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue);
});

When(/^right click on p tag with attribute name "([^"]*)" with value "([^"]*)" of level in edition mode$/, function (attributeName, attributeValue) {
    ckEditorWindow.rightClickOnPTagSubparagraphOfLevel(attributeName, attributeValue);
});

When(/^click on p tag with attribute name "([^"]*)" with value "([^"]*)" of level in edition mode$/, function (attributeName, attributeValue) {
    ckEditorWindow.clickOnPTagSubparagraphOfLevel(attributeName, attributeValue);
});

When(/^right click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of level in edition mode$/, function (liTag, attributeName, attributeValue) {
    ckEditorWindow.rightClickOnSubparagraphOfLevel(liTag, attributeName, attributeValue);
});

When(/^click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of level in edition mode$/, function (liTag, attributeName, attributeValue) {
    ckEditorWindow.clickOnSubparagraphOfLevel(liTag, attributeName, attributeValue);
});

When(/^right click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of level in edition mode$/, function (liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
    ckEditorWindow.rightClickOnFirstLayerElementOfLevel(liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue);
});

When(/^click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of level in edition mode$/, function (liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
    ckEditorWindow.clickOnFirstLayerElementOfLevel(liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue);
});

When(/^right click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of level in edition mode$/, function (liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
    ckEditorWindow.rightClickOnSecondLayerElementOfLevel(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue);
});

When(/^click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of level in edition mode$/, function (liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
    ckEditorWindow.clickOnSecondLayerElementOfLevel(liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue);
});

When(/^right click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of level in edition mode$/, function (liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
    ckEditorWindow.rightClickOnThirdLayerElementOfLevel(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue);
});

When(/^click on li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of li (\d+) with attribute name "([^"]*)" with value "([^"]*)" of level in edition mode$/, function (liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue) {
    ckEditorWindow.clickOnThirdLayerElementOfLevel(liThirdLayerTag, thirdLayerAttributeName, thirdLayerAttributeValue, liSecondLayerTag, secondLayerAttributeName, secondLayerAttributeValue, liFirstLayerTag, firstLayerAttributeName, firstLayerAttributeValue, liTag, attributeName, attributeValue);
});
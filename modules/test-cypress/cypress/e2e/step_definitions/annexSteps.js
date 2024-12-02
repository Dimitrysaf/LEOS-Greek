import {When, Then, And} from "cypress-cucumber-preprocessor/steps";

require('@cypress/xpath');
import annexPage from "../pages/annexPage";
import headerPage from "../pages/headerPage";

Then(`user is on annex page`, () => {
    headerPage.getCurrentPageName().should("have.text", "Annex");
    cy.wait(5000);
});

Then(`annex title is {string}`, (title) => {
    annexPage.elements.containerBlockNum().should('have.text', title);
});

Then(`block heading of the annex container is {string}`, (blockHeadingName) => {
    annexPage.elements.prefaceContainerBlockHeading().should('have.text', blockHeadingName);
});

When(`click on close button present in annex page`, () => {
    annexPage.clickCloseBtn();
});

When('mouseover and click on level {int}', levelNumber => {
    annexPage.mouseHoverAndClickOnLevel(levelNumber);
})

When('mouseover and click on paragraph {int}', function (paragraphNumber) {
    annexPage.mouseHoverAndClickOnParagraph(paragraphNumber);
});

Then(`total number of level is {int}`, (count) => {
    annexPage.elements.level().should('have.length', count);
});

Then(`level {int} contains {string}`, (levelNumber, text) => {
    annexPage.getContentOfAnnex(levelNumber).invoke('text').should('contain', text);
});

When(`click on insert before icon of level {int}`, (levelNumber) => {
    annexPage.clickInsertBeforeIconOfLevel(levelNumber);
});

When(/^click on insert after icon of level (\d+)$/, function (levelNumber) {
    annexPage.clickInsertAfterIconOfLevel(levelNumber);
});

Then(`click on edit icon of level {int}`, (levelNumber) => {
    annexPage.clickEditIconOfLevel(levelNumber);
});

When(`click on delete icon of level {int}`, (levelNumber) => {
    annexPage.clickDeleteIconOfLevel(levelNumber);
});

Then(`level {int} doesn't contain {string}`, (levelNumber, text) => {
    annexPage.getContentOfAnnex(levelNumber).invoke('text').should('not.contain', text);
});

Then('content of subparagraph {int} of level {int} contains a table with {int} row and {int} column', function (subparagraphNumber, levelNumber, rowNumber, columnNumber) {
    annexPage.getRowFromTableOfSubparagraphFromLevel(subparagraphNumber, levelNumber).should('have.length', rowNumber);
    annexPage.getColumnFromTableOfSubparagraphFromLevel(subparagraphNumber, levelNumber).should('have.length', columnNumber);
});

Then('level {int} contains authorial note with marker {string} and text {string}', function (levelNumber, markerNumber, text) {
    annexPage.getAuthorialNoteWithMarkerNumberFromLevel(levelNumber, markerNumber).should('have.text', text);
});

When('click on authorial note with marker {string} in level {int}', function (markerNumber, levelNumber) {
    annexPage.clickAuthorialNoteWithMarkerNumberFromLevel(levelNumber, markerNumber);
});


Then(`{string} is added as internal reference {int} of level {int}`, (text, mReferenceNumber, levelNumber) => {
    annexPage.getMRefTextFromLevel(mReferenceNumber, levelNumber).should('have.text', text);
});

Then(`level {int} contains image`, (levelNumber) => {
    annexPage.getImageOfLevel(levelNumber).should('exist');
});

Then(/^level (\d+) contains attribute "([^"]*)" with value "([^"]*)"$/, function (levelNumber, attributeName, attributeValue) {
    annexPage.getLevel(levelNumber).should('have.attr', attributeName).and('equal', attributeValue);
});

Then(/^num of level (\d+) contains attribute "([^"]*)" with value "([^"]*)"$/, function (levelNumber, attributeName, attributeValue) {
    annexPage.getNumOfLevel(levelNumber).should('have.attr', attributeName).and('equal', attributeValue);
});

Then(/^"([^"]*)" is showing as soft move label in num of level (\d+)$/, function (labelName, levelNumber) {
    annexPage.getSoftMoveLabelOfNumOfLevel(levelNumber).should('have.attr', 'title').and('equal', labelName);
});

Then(/^num value of level (\d+) contains "([^"]*)"$/, function (levelNumber, numValue) {
    annexPage.getNumOfLevel(levelNumber).invoke('clone').then(($el) => {
        $el.children().remove()
        return $el.text().trim()
    }).should('equal', numValue);
});

When(/^right click on soft move label of num of level (\d+)$/, function (levelNumber) {
    annexPage.rightClickOnSoftMoveLabelOfNumOfLevel(levelNumber);
});

And('del tag with attribute {string} and value {string} of num tag of level {int} contains value {string}', function (attributeName, attributeValue, levelNumber, value) {
    const tagName = 'del';
    annexPage.getNumOfLevel(levelNumber).find(tagName + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then('ins tag with attribute {string} and value {string} of num tag of level {int} contains value {string}', function (attributeName, attributeValue, levelNumber, value) {
    const tagName = 'ins';
    annexPage.getNumOfLevel(levelNumber).find(tagName + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then(/^total number of paragraph is (\d+)$/, function (count) {
    annexPage.elements.paragraph().should('have.length', count);
});

Then(/^no paragraph exists$/, function () {
    annexPage.elements.paragraph().should('not.exist');
});

When(/^right click on level (\d+)$/, function (levelNumber) {
    annexPage.getLevel(levelNumber).rightclick();
});

When(/^right click on paragraph (\d+)$/, function (paragraphNumber) {
    annexPage.getParagraph(paragraphNumber).rightclick();
});
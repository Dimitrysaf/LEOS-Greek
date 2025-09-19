import {When, Then} from "@badeball/cypress-cucumber-preprocessor";

require('@cypress/xpath');
import annexPage from "../pages/annexPage";
import headerPage from "../pages/headerPage";
import {checkContentResult} from "../util/expectDataTable";

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

When('mouseover and real click on level {int}', levelNumber => {
    annexPage.mouseHoverAndRealClickOnLevel(levelNumber);
})

When('mouseover and click on paragraph {int}', function (paragraphNumber) {
    annexPage.mouseHoverAndClickOnParagraph(paragraphNumber);
});

Then(`total number of level is {int}`, (count) => {
    annexPage.elements.level().should('have.length', count);
});

Then(`level {int} contains {string}`, (levelNumber, text) => {
    annexPage.getContentOfLevel(levelNumber).invoke('text').should('contain', text);
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

Then(`click on edit icon of paragraph {int}`, (paragraphNumber) => {
    annexPage.clickEditIconOfParagraph(paragraphNumber);
});

When(`click on delete icon of level {int}`, (levelNumber) => {
    annexPage.clickDeleteIconOfLevel(levelNumber);
});

Then(`level {int} doesn't contain {string}`, (levelNumber, text) => {
    annexPage.getContentOfLevel(levelNumber).invoke('text').should('not.contain', text);
});

Then('content of subparagraph {int} of level {int} contains a table with {int} row and {int} column', function (subparagraphNumber, levelNumber, rowNumber, columnNumber) {
    annexPage.getRowFromTableOfSubparagraphFromLevel(subparagraphNumber, levelNumber).should('have.length', rowNumber);
    annexPage.getColumnFromTableOfSubparagraphFromLevel(subparagraphNumber, levelNumber).should('have.length', columnNumber);
});

Then('content of paragraph {int} contains a table with {int} row and {int} column', function (paragraphNumber, rowNumber, columnNumber) {
    annexPage.getRowFromTableOfParagraph(paragraphNumber).should('have.length', rowNumber);
    annexPage.getColumnFromTableOfParagraph(paragraphNumber).should('have.length', columnNumber);
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

Then('del tag with attribute {string} and value {string} of num tag of level {int} contains value {string}', function (attributeName, attributeValue, levelNumber, value) {
    const tagName = 'del';
    annexPage.getNumOfLevel(levelNumber).find(tagName + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then('ins tag with attribute {string} and value {string} of num tag of level {int} contains value {string}', function (attributeName, attributeValue, levelNumber, value) {
    const tagName = 'ins';
    annexPage.getNumOfLevel(levelNumber).find(tagName + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then('attribute {string} of subparagraph {int} of list {int} of level {int} should not be equal to same attribute in subparagraph {int} of same level', function (attributeName, subparagraphNumber1, listNumber, levelNumber, subparagraphNumber2) {
    annexPage.getSubparagraphOfListOfLevel(levelNumber, listNumber, subparagraphNumber1).invoke('attr', attributeName).then((attributeValue) => {
        annexPage.getSubparagraphOfLevel(subparagraphNumber2, levelNumber).should('not.have.attr', attributeName, attributeValue);
    })
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

Then(/^content of point (\d+) of list of point (\d+) of list of point (\d+) of list of level (\d+) contains "([^"]*)"$/, function (pointThirdLayer, pointSecondLayer, pointFirstLayer, levelNumber, content) {
    annexPage.getLevel(levelNumber).children('list').children('point').eq(pointFirstLayer-1).children('list').children('point').eq(pointSecondLayer-1).children('list').children('point').eq(pointThirdLayer-1).find("content aknp").should('have.text', content);
});

Then(/^content of point (\d+) of list of point (\d+) of list of level (\d+) contains "([^"]*)"$/, function (pointSecondLayer, pointFirstLayer, levelNumber, content) {
    annexPage.getLevel(levelNumber).children('list').children('point').eq(pointFirstLayer-1).children('list').children('point').eq(pointSecondLayer-1).find("content aknp").should('have.text', content);
});

Then(/^content of point (\d+) of list of level (\d+) contains "([^"]*)"$/, function (pointFirstLayer, levelNumber, content) {
    annexPage.getLevel(levelNumber).children('list').children('point').eq(pointFirstLayer-1).find("content aknp").should('have.text', content);
});

Then(/^content of subparagraph (\d+) of list of level (\d+) contains "([^"]*)"$/, function (subparagraphNumber, levelNumber, content) {
    annexPage.getLevel(levelNumber).children('list').children('subparagraph').eq(subparagraphNumber-1).find("content aknp").should('have.text', content);
});

Then(/^del tag with attribute "([^"]*)" and value "([^"]*)" of num tag of point (\d+) of list of point (\d+) of list of point (\d+) of list of level (\d+) contains "([^"]*)"$/, function (attributeName, attributeValue, pointThirdLayer, pointSecondLayer, pointFirstLayer, levelNumber, value) {
    annexPage.getLevel(levelNumber).children('list').children('point').eq(pointFirstLayer-1).children('list').children('point').eq(pointSecondLayer-1).children('list').children('point').eq(pointThirdLayer-1).find("del" + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then(/^ins tag with attribute "([^"]*)" and value "([^"]*)" of num tag of point (\d+) of list of point (\d+) of list of point (\d+) of list of level (\d+) contains "([^"]*)"$/, function (attributeName, attributeValue, pointThirdLayer, pointSecondLayer, pointFirstLayer, levelNumber, value) {
    annexPage.getLevel(levelNumber).children('list').children('point').eq(pointFirstLayer-1).children('list').children('point').eq(pointSecondLayer-1).children('list').children('point').eq(pointThirdLayer-1).find("ins" + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then(/^del tag with attribute "([^"]*)" and value "([^"]*)" of num tag of point (\d+) of list of point (\d+) of list of level (\d+) contains "([^"]*)"$/, function (attributeName, attributeValue, pointSecondLayer, pointFirstLayer, levelNumber, value) {
    annexPage.getLevel(levelNumber).children('list').children('point').eq(pointFirstLayer-1).children('list').children('point').eq(pointSecondLayer-1).find("del" + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then(/^ins tag with attribute "([^"]*)" and value "([^"]*)" of num tag of point (\d+) of list of point (\d+) of list of level (\d+) contains "([^"]*)"$/, function (attributeName, attributeValue, pointSecondLayer, pointFirstLayer, levelNumber, value) {
    annexPage.getLevel(levelNumber).children('list').children('point').eq(pointFirstLayer-1).children('list').children('point').eq(pointSecondLayer-1).find("ins" + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then(/^del tag with attribute "([^"]*)" and value "([^"]*)" of num tag of point (\d+) of list of level (\d+) contains "([^"]*)"$/, function (attributeName, attributeValue, pointFirstLayer, levelNumber, value) {
    annexPage.getLevel(levelNumber).children('list').children('point').eq(pointFirstLayer-1).find("del" + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then(/^ins tag with attribute "([^"]*)" and value "([^"]*)" of num tag of point (\d+) of list of level (\d+) contains "([^"]*)"$/, function (attributeName, attributeValue, pointFirstLayer, levelNumber, value) {
    annexPage.getLevel(levelNumber).children('list').children('point').eq(pointFirstLayer-1).find("ins" + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then(/^del tag with attribute "([^"]*)" and value "([^"]*)" of num tag of subparagraph (\d+) of list of level (\d+) contains "([^"]*)"$/, function (attributeName, attributeValue, subParagraphNumber, levelNumber, value) {
    annexPage.getLevel(levelNumber).children('list').children('subparagraph').eq(subParagraphNumber-1).find("del" + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then('subparagraph {int} of level {int} contains an attribute with name {string} and value {string}', function (subParagraphNumber, levelNumber, attributeName, attributeValue) {
    annexPage.getSubparagraphOfLevel(subParagraphNumber, levelNumber).should('have.attr', attributeName).and('equal', attributeValue);
});

Then(/^content of computed style before of subparagraph (\d+) of level (\d+) contains "([^"]*)"$/, function (subParagraphNumber, levelNumber, content) {
    annexPage.getSubparagraphOfLevel(subParagraphNumber, levelNumber).then(($el) => {
        const before = window.getComputedStyle($el[0], '::before');
        expect(before.content).to.contain(content);
    });
});

Then(/^ins tag of content of subparagraph (\d+) of level (\d+) is "([^"]*)"$/, function (subParagraphNumber, levelNumber, content) {
    annexPage.getSubparagraphOfLevel(subParagraphNumber, levelNumber).find('content aknp').find('ins').should('have.text', content);
});

When(`click on internal reference link {int} of level {int}`, (mReferenceNumber, levelNumber) => {
    annexPage.clickRefOfMRefOfLevel(mReferenceNumber, levelNumber);
});

Then(`level {int} of annex is displayed`, (levelNumber) => {
    annexPage.getLevel(levelNumber).should('be.visible');
});

Then(/^content of paragraph (\d+) is "([^"]*)"$/, function (paragraphNumber, content) {
    annexPage.getContentOfParagraph(paragraphNumber).should('have.text', content);
});

Then(/^content of subparagraph with attribute name "([^"]*)" and value "([^"]*)" of paragraph (\d+) is "([^"]*)"$/, function (attributeName, attributeValue, paragraphNumber, content) {
    annexPage.getContentOfSubparagraphOfParagraph(attributeName, attributeValue, paragraphNumber).should('have.text', content);
});

Then(/^content of point (\d+) of paragraph (\d+) is "([^"]*)"$/, function (firstLayerPointNumber, paragraphNumber, content) {
    annexPage.getContentOfPointOfParagraph(firstLayerPointNumber, paragraphNumber).should('have.text', content);
});

Then(/^content of subparagraph with attribute name "([^"]*)" and value "([^"]*)" of list of point (\d+) of paragraph (\d+) is "([^"]*)"$/, function (attributeName, attributeValue, firstLayerPointNumber, paragraphNumber, content) {
    annexPage.getContentOfSubparagraphOfFirstLayerPointOfParagraph(attributeName, attributeValue, firstLayerPointNumber, paragraphNumber).should('have.text', content);
});

Then(/^content of point (\d+) of point (\d+) of paragraph (\d+) is "([^"]*)"$/, function (secondLayerPointNumber, firstLayerPointNumber, paragraphNumber, content) {
    annexPage.getContentOfSecondLayerPointOfParagraph(secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).should('have.text', content);
});

Then(/^content of subparagraph with attribute name "([^"]*)" and value "([^"]*)" of list of point (\d+) of point (\d+) of paragraph (\d+) is "([^"]*)"$/, function (attributeName, attributeValue, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber, content) {
    annexPage.getContentOfSubparagraphOfSecondLayerPointOfParagraph(attributeName, attributeValue, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).should('have.text', content);
});

Then(/^content of point (\d+) of point (\d+) of point (\d+) of paragraph (\d+) is "([^"]*)"$/, function (thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber, content) {
    annexPage.getContentOfThirdLayerPointOfParagraph(thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).should('have.text', content);
});

Then(/^content of subparagraph with attribute name "([^"]*)" and value "([^"]*)" of list of point (\d+) of point (\d+) of point (\d+) of paragraph (\d+) is "([^"]*)"$/, function (attributeName, attributeValue, thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber, content) {
    annexPage.getContentOfSubparagraphOfThirdLayerPointOfParagraph(attributeName, attributeValue, thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).should('have.text', content);
});

Then(/^content of point (\d+) of point (\d+) of point (\d+) of point (\d+) of paragraph (\d+) is "([^"]*)"$/, function (fourthLayerPointNumber, thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber, content) {
    annexPage.getContentOfFourthLayerPointOfParagraph(fourthLayerPointNumber, thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).should('have.text', content);
});

Then('content of subparagraph {int} of level {int} is {string}', function (subparagraphNumber, levelNumber, content) {
    annexPage.getContentOfSubparagraphOfLevel(subparagraphNumber, levelNumber).should('have.text', content);
});

Then(/^content of subparagraph with attribute name "([^"]*)" and value "([^"]*)" of list (\d+) of level (\d+) is "([^"]*)"$/, function (attributeName, attributeValue, listNumber, levelNumber, content) {
    annexPage.getContentOfSubparagraphWithAttributeOfLevel(attributeName, attributeValue, listNumber, levelNumber).should('have.text', content);
});

Then(/^content of point (\d+) of list (\d+) of level (\d+) is "([^"]*)"$/, function (firstLayerPointNumber, ListNumber, levelNumber, content) {
    annexPage.getContentOfFirstLayerPointOfLevel(firstLayerPointNumber, ListNumber, levelNumber).should('have.text', content);
});

Then(/^content of subparagraph (\d+) of list (\d+) of point (\d+) of list (\d+) of level (\d+) is "([^"]*)"$/, function (subparagraphNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber, content) {
    annexPage.getContentOfSubparagraphOfFirstLayerPointOfLevel(subparagraphNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).should('have.text', content);
});

Then(/^content of point (\d+) of list (\d+) of point (\d+) of list (\d+) of level (\d+) is "([^"]*)"$/, function (secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber, content) {
    annexPage.getContentOfSecondLayerPointOfLevel(secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).should('have.text', content);
});

Then(/^content of subparagraph with attribute name "([^"]*)" and value "([^"]*)" of list (\d+) of point (\d+) of list (\d+) of level (\d+) is "([^"]*)"$/, function (attributeName, attributeValue, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber, content) {
    annexPage.getContentOfSubparagraphWithAttributeOfFirstLayerPointOfLevel(attributeName, attributeValue, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).should('have.text', content);
});

Then(/^content of subparagraph (\d+) of list (\d+) of point (\d+) of list (\d+) of point (\d+) of list (\d+) of level (\d+) is "([^"]*)"$/, function (subparagraphNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber, content) {
    annexPage.getContentOfSubparagraphOfSecondLayerPointOfLevel(subparagraphNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).should('have.text', content);
});

Then(/^content of subparagraph with attribute name "([^"]*)" and value "([^"]*)" of list (\d+) of point (\d+) of list (\d+) of point (\d+) of list (\d+) of level (\d+) is "([^"]*)"$/, function (attributeName, attributeValue, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber, content) {
    annexPage.getContentOfSubparagraphWithAttributeOfSecondLayerPointOfLevel(attributeName, attributeValue, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).should('have.text', content);
});

Then(/^content of point (\d+) of list (\d+) of point (\d+) of list (\d+) of point (\d+) of list (\d+) of level (\d+) is "([^"]*)"$/, function (thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber, content) {
    annexPage.getContentOfThirdLayerPointOfLevel(thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).should('have.text', content);
});

Then(/^content of subparagraph (\d+) of list (\d+) of point (\d+) of list (\d+) of point (\d+) of list (\d+) of point (\d+) of list (\d+) of level (\d+) is "([^"]*)"$/, function (subparagraphNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber, content) {
    annexPage.getContentOfSubparagraphOfThirdLayerPointOfLevel(subparagraphNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).should('have.text', content);
});

Then(/^content of subparagraph with attribute name "([^"]*)" and value "([^"]*)" of list (\d+) of point (\d+) of list (\d+) of point (\d+) of list (\d+) of point (\d+) of list (\d+) of level (\d+) is "([^"]*)"$/, function (attributeName, attributeValue, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber, content) {
    annexPage.getContentOfSubparagraphWithAttributeOfThirdLayerPointOfLevel(attributeName, attributeValue, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).should('have.text', content);
});

Then(/^content of indent (\d+) of list (\d+) of point (\d+) of list (\d+) of point (\d+) of list (\d+) of point (\d+) of list (\d+) of level (\d+) is "([^"]*)"$/, function (fourthLayerIndentNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber, content) {
    annexPage.getContentOfFourthLayerIndentOfLevel(fourthLayerIndentNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).should('have.text', content);
});

Then(/^content of subparagraph (\d+) of list (\d+) of indent (\d+) of list (\d+) of point (\d+) of list (\d+) of point (\d+) of list (\d+) of point (\d+) of list (\d+) of level (\d+) is "([^"]*)"$/, function (subparagraphNumber, ListNumber5, fourthLayerIndentNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber, content) {
    annexPage.getContentOfSubparagraphOfFourthLayerIndentOfLevel(subparagraphNumber, ListNumber5, fourthLayerIndentNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).should('have.text', content);
});

Then('content of level {int} has below content', (levelNumber, datatable) => {
    annexPage.getContentOfLevel(levelNumber).then((element) => {
        checkContentResult(element, datatable);
    });
});
import {And, Then} from "cypress-cucumber-preprocessor/steps";
import comparisonWindow from "../pages/comparisonWindow";

Then(/^comparison container is displayed$/, function () {
    comparisonWindow.elements.versionComparisonMainContainer().should('be.visible');
});

Then(/^comparison container is not displayed$/, function () {
    comparisonWindow.elements.versionComparisonMainContainer().should('not.exist');
});

Then('article {int} contains attribute {string} with value {string} in comparison window', function (articleNumber, attributeName, attributeValue) {
    comparisonWindow.getArticle(articleNumber).should('have.attr', attributeName, attributeValue);
});

Then('paragraph {int} of article {int} contains attribute {string} with value {string} in comparison window', function (paragraphNumber, articleNumber, attributeName, attributeValue) {
    comparisonWindow.getParagraphFromArticle(paragraphNumber, articleNumber).should('have.attr', attributeName).and('equal', attributeValue);
});

Then('span tag with attribute {string} of num tag of article {int} contains value {string} in comparison window', function (attributeName, articleNumber, value) {
    comparisonWindow.getSpanOfNumOfArticle(attributeName, articleNumber).should('have.text', value);
});

Then('span tag with attribute {string} of content of paragraph {int} of article {int} contains value {string} in comparison window', function (attributeName, paragraphNumber, articleNumber, value) {
    comparisonWindow.getSpanOfContentOfParagraphOfArticle(attributeName, paragraphNumber, articleNumber).should('have.text', value);
});

Then('span tag with attribute {string} of num tag of paragraph {int} of article {int} contains value {string} in comparison window', function (attributeName, paragraphNumber, articleNumber, value) {
    comparisonWindow.getSpanOfNumOfParagraphOfArticle(attributeName, paragraphNumber, articleNumber).should('have.text', value);
});

Then(/^num tag of paragraph (\d+) of article (\d+) contains attribute "([^"]*)" with value "([^"]*)" in comparison window$/, function (paragraphNumber, articleNumber, attributeName, attributeValue) {
    comparisonWindow.getNumOfParagraphOfArticle(paragraphNumber, articleNumber).should('have.attr', attributeName).and('equal', attributeValue);
});

Then(`content of subparagraph {int} of list {int} of paragraph {int} of article {int} contains {string} in comparison window`, (subparagraphNumber, listNumber, paragraphNumber, articleNumber, content) => {
    comparisonWindow.getContentOfSubparagraphOfListOfParagraphFromArticle(subparagraphNumber, listNumber, paragraphNumber, articleNumber).should('include.text', content);
});

And(`num tag of point {int} of list {int} of paragraph {int} of article {int} contains {string} in comparison window`, (pointNumber, listNumber, paragraphNumber, articleNumber, content) => {
    comparisonWindow.getNumTagOfPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).should('have.text', content);
});

And(`content of subparagraph {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string} in comparison window`, (subparagraphNumber, subParagraphListNumber, pointNumber, poinListNumber, paragraphNumber, articleNumber, content) => {
    comparisonWindow.getContentOfSubParagraphOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber, poinListNumber, paragraphNumber, articleNumber).should('include.text', content);
});

And(`num tag of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string} in comparison window`, (pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    comparisonWindow.getNumTagOfPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('have.text', content);
});

And(`content of subparagraph {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string} in comparison window`, (subparagraphNumber, subParagraphListNumber, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber, content) => {
    comparisonWindow.getContentOfSubParagraphOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber).should('include.text', content);
});

And(`num tag of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string} in comparison window`, (pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    comparisonWindow.getNumTagOfPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('have.text', content);
});

And(`content of subparagraph {int} of list {int} of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string} in comparison window`, (subparagraphNumber, subParagraphListNumber, pointNumber3, poinListNumber3, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber, content) => {
    comparisonWindow.getContentOfSubParagraphOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber3, poinListNumber3, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber).should('include.text', content);
});

And(`num tag of indent {int} of list {int} of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string} in comparison window`, (indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    comparisonWindow.getNumTagOfIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('have.text', content);
});

And(`content of indent {int} of list {int} of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string} in comparison window`, (indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    comparisonWindow.getContentOfIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('have.text', content);
});

And(`content of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string} in comparison window`, (pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    comparisonWindow.getContentOfPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('include.text', content);
});
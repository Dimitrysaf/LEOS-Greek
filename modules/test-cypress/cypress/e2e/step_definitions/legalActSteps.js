import {When, And, Then} from "cypress-cucumber-preprocessor/steps";
import legalActPage from "../pages/legalActPage";
import headerPage from "../pages/headerPage";
import {checkContentResult} from "../util/expectDataTable";

Then('user is on legal act page', () => {
    headerPage.getCurrentPageName().should("have.text", "Legal Act");
    cy.wait(7000);
})

Then('document has {int} trackChange {string} tags with {string} content', (count, type, content) => {
    headerPage.getCurrentPageName().get(type).should("have.length", count);
    headerPage.getCurrentPageName().get(type).should("have.text", content);
})

Then('document has {int} trackChange {string} tags with below content', (count, type, datatable) => {
    headerPage.getCurrentPageName().get(type).should("have.length", count);
    headerPage.getCurrentPageName().get(type).each((element, index) => {
        expect(element[0].textContent).equal(datatable.raw().at(index).toString());
    });
})

Then('paragraph {int} of article {int} has below content', (paragraph, article, datatable) => {
    legalActPage.getContentOfParagraphFromArticle(paragraph, article).then((element) => {
        checkContentResult(element, datatable);
    });
})

Then('num of point {int} of list {int} of paragraph {int} of article {int} has below content', (point, list, paragraph, article, datatable) => {
    legalActPage.getNumTagOfPointOfParagraphFromArticle(point, list, paragraph, article).then((element) => {
        checkContentResult(element, datatable);
    });
})

Then('point {int} of list {int} of paragraph {int} of article {int} has below content', (point, list, paragraph, article, datatable) => {
    legalActPage.getContentOfPointOfParagraphFromArticle(point, list, paragraph, article).then((element) => {
        checkContentResult(element, datatable);
    });
})

When('mouseover and click on citation {int}', citationNumber => {
    legalActPage.mouseHoverAndClickOnCitation(citationNumber);
})

When('mouseover and click on recital {int}', recitalNumber => {
    legalActPage.mouseHoverAndClickOnRecital(recitalNumber);
})

When('mouseover and click on article {int}', articleNumber => {
    legalActPage.mouseHoverAndClickOnArticle(articleNumber);
})

When('click on edit icon of article {int}', articleNumber => {
    legalActPage.clickEditIconOfArticle(articleNumber);
})

When('click on close button present in legal act page', () => {
    legalActPage.clickCloseBtn();
})

When('{int} paragraphs are present in article {int}', (paragraphNumber, articleNumber) => {
    legalActPage.getAllParagraphFromArticle(articleNumber).should('have.length', paragraphNumber);
})

And('citation {int} contains {string}', (citationNumber, text) => {
    legalActPage.getCitation(citationNumber).contains(text);
})

And("citation {int} doesn't contain {string}", (citationNumber, text) => {
    legalActPage.getCitation(citationNumber).should('not.include.text', text)
})

And('recital {int} contains {string}', (recitalNumber, text) => {
    legalActPage.getRecital(recitalNumber).contains(text);
})

And("recital {int} doesn't contain {string}", (recitalNumber, text) => {
    legalActPage.getRecital(recitalNumber).should('not.include.text', text)
})

Then(`content of paragraph {int} of article {int} contains {string}`, (paragraphNumber, articleNumber, text) => {
    legalActPage.getContentOfParagraphFromArticle(paragraphNumber, articleNumber).should('include.text', text);
});

Then(`paragraph {int} of article {int} doesn't contain {string}`, (paragraphNumber, articleNumber, text) => {
    legalActPage.getParagraphFromArticle(paragraphNumber, articleNumber).should('not.include.text', text);
});

Then(`preface long title docPurpose contains {string}`, (title) => {
    legalActPage.elements.docPurpose().should('include.text', title);
});

When(`click on insert after icon of article {int}`, (articleNumber) => {
    legalActPage.clickInsertAfterIconOfArticle(articleNumber);
});

When(`click on insert before icon of article {int}`, (articleNumber) => {
    legalActPage.clickInsertBeforeIconOfArticle(articleNumber);
});

Then(`heading of article {int} contains {string}`, (articleNumber, heading) => {
    legalActPage.getHeadingFromArticle(articleNumber).should('have.text', heading);
});

Then(`paragraph {int} of article {int} doesn't contain num tag`, (paragraphNumber, articleNumber) => {
    legalActPage.getNumTagOfParagraphFromArticle(paragraphNumber, articleNumber).should('not.exist');
});

Then(`article {int} doesn't contain indent tag`, (articleNumber) => {
    legalActPage.getIndentTagFromArticle(articleNumber).should('not.exist');
});

And(`num tag of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (pointNumber, listNumber, paragraphNumber, articleNumber, content) => {
    legalActPage.getNumTagOfPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).should('have.text', content);
});

And(`num tag of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getNumTagOfPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('have.text', content);
});

And(`num tag of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getNumTagOfPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('have.text', content);
});

And(`num tag of indent {int} of list {int} of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getNumTagOfIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('have.text', content);
});

Then(`content of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (pointNumber, listNumber, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of indent {int} of list {int} of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).should('have.text', content);
});

Then(`content of subparagraph {int} of list {int} of paragraph {int} of article {int} contains {string}`, (subparagraphNumber, listNumber, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfSubparagraphOfListOfParagraphFromArticle(subparagraphNumber, listNumber, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of subparagraph {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (subparagraphNumber, subParagraphListNumber, pointNumber, poinListNumber, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfSubParagraphOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber, poinListNumber, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of subparagraph {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (subparagraphNumber, subParagraphListNumber, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfSubParagraphOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of subparagraph {int} of list {int} of point {int} of list {int} of point {int} of list {int} of point {int} of list {int} of paragraph {int} of article {int} contains {string}`, (subparagraphNumber, subParagraphListNumber, pointNumber3, poinListNumber3, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfSubParagraphOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber3, poinListNumber3, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber).should('include.text', content);
});

And(`content of subparagraph {int} of paragraph {int} of article {int} contains {string}`, (subparagraphNumber, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfSubparagraphOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber).should('include.text', content);
});

And(`num tag of paragraph {int} of article {int} contains {string}`, (paragraphNumber, articleNumber, content) => {
    legalActPage.getNumTagOfParagraphFromArticle(paragraphNumber, articleNumber).should('include.text', content);
});

Then(`content of subparagraph refersTo {string} of list {int} of paragraph {int} of article {int} contains {string}`, (subparagraphRefersTo, listNumber, paragraphNumber, articleNumber, content) => {
    legalActPage.getContentOfSubParagraphRefersToListOfParagraphOfArticle(subparagraphRefersTo, listNumber, paragraphNumber, articleNumber, content).should('have.text', content);
});

Then(`{int} recitals are added in legal act by import oj`, (recitalNumber) => {
    legalActPage.elements.recitalFromImportOj().should('have.length', recitalNumber);
});

Then(`{int} articles are added in legal act by import oj`, (articleNumber) => {
    legalActPage.elements.articleFromImportOj().should('have.length', articleNumber);
});

When(`click on edit icon of citation {int}`, (citationNumber) => {
    legalActPage.clickEditIconOfCitation(citationNumber);
});

When('click on insert after icon of citation {int}', function (citationNumber) {
    legalActPage.clickInsertAfterIconOfCitation(citationNumber);
});

When('click on insert before icon of recital {int}', function (recitalNumber) {
    legalActPage.clickInsertBeforeIconOfRecital(recitalNumber);
});

Then(`{string} is added as internal reference {int} of citation {int}`, (text, mReferenceNumber, citationNumber) => {
    legalActPage.getMRefTextFromCitation(mReferenceNumber, citationNumber).should('have.text', text);
});

Then(`{string} is added as internal reference {int} of recital {int}`, (text, mReferenceNumber, recitalNumber) => {
    legalActPage.getMRefTextFromRecital(mReferenceNumber, recitalNumber).should('have.text', text);
});

Then(`{string} is added as internal reference {int} of point {int} of list {int} of paragraph {int} of article {int}`, (text, mReferenceNumber, pointNumber, listNumber, paragraphNumber, articleNumber) => {
    legalActPage.getMRefTextFromPointOfParagraphOfArticle(mReferenceNumber, pointNumber, listNumber, paragraphNumber, articleNumber).should('have.text', text);
});

Then(`{string} is added as internal reference {int} of paragraph {int} of article {int}`, (text, mReferenceNumber, paragraphNumber, articleNumber) => {
    legalActPage.getMRefTextFromParagraphOfArticle(mReferenceNumber, paragraphNumber, articleNumber).should('have.text', text);
});

Then(`citation {int} is displayed`, (citationNumber) => {
    legalActPage.getCitation(citationNumber).should('be.visible')
});

Then(`recital {int} is displayed`, (recitalNumber) => {
    legalActPage.getRecital(recitalNumber).should('be.visible');
});

Then(`article {int} is displayed`, (articleNumber) => {
    legalActPage.getArticle(articleNumber).should('be.visible');
});

Then(`paragraph {int} of article {int} is displayed`, (paragraphNumber, articleNumber) => {
    legalActPage.getParagraphFromArticle(paragraphNumber, articleNumber).should('be.visible');
});

Then(`point {int} of list {int} of paragraph {int} of article {int} is displayed`, (pointNumber, listNumber, paragraphNumber, articleNumber) => {
    legalActPage.getPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).should('be.visible');
});

When(`click on internal reference link {int} of citation {int}`, (mReferenceNumber, citationNumber) => {
    legalActPage.clickRefOfMRefOfCitation(mReferenceNumber, citationNumber);
});

When(`click on internal reference link {int} of recital {int}`, (mReferenceNumber, recitalNumber) => {
    legalActPage.clickRefOfMRefOfRecital(mReferenceNumber, recitalNumber);
});

When(`click on internal reference link {int} of paragraph {int} of article {int}`, (mReferenceNumber, paragraphNumber, articleNumber) => {
    legalActPage.clickRefOfMRefOfParagraphOfArticle(mReferenceNumber, paragraphNumber, articleNumber);
});

When(`click on internal reference link {int} of point {int} of list {int} of paragraph {int} of article {int}`, (mReferenceNumber, pointNumber, listNumber, paragraphNumber, articleNumber) => {
    legalActPage.clickRefOfMRefOfPointOfParagraphOfArticle(mReferenceNumber, pointNumber, listNumber, paragraphNumber, articleNumber);
});

Then('paragraph {int} of article {int} contains attribute {string} with value {string}', function (paragraphNumber, articleNumber, attributeName, attributeValue) {
    legalActPage.getParagraphFromArticle(paragraphNumber, articleNumber).should('have.attr', attributeName).and('equal', attributeValue);
});

Then('content of paragraph {int} of article {int} contains tag {string}', function (paragraphNumber, articleNumber, tagName) {
    legalActPage.getContentOfParagraphFromArticle(paragraphNumber, articleNumber).find(tagName).should('exist');
});

Then('inserted paragraph number of paragraph {int} of article {int} is {string}', function (paragraphNumber, articleNumber, newParagraphNumber) {
    const tagName = 'ins';
    legalActPage.getNumTagOfParagraphFromArticle(paragraphNumber, articleNumber).find(tagName).should('have.text', newParagraphNumber);
});

Then('deleted paragraph number of paragraph {int} of article {int} is {string}', function (paragraphNumber, articleNumber, oldParagraphNumber) {
    const tagName = 'del';
    const attributeName = 'leos\\:action-number';
    const attributeValue = 'delete';
    legalActPage.getNumTagOfParagraphFromArticle(paragraphNumber, articleNumber).find(tagName + "[" + attributeName + "='" + attributeValue + "']").should('have.text', oldParagraphNumber);
});

Then('ins tag of num tag of paragraph {int} of article {int} contains attribute {string} with value {string}', function (paragraphNumber, articleNumber, attributeName, attributeValue) {
    const tagName = 'ins';
    legalActPage.getNumTagOfParagraphFromArticle(paragraphNumber, articleNumber).find(tagName).should('have.attr', attributeName).and('equal', attributeValue);
});

Then('ins tag with attribute {string} and value {string} of num tag of paragraph {int} of article {int} contains value {string}', function (attributeName, attributeValue, paragraphNumber, articleNumber, value) {
    const tagName = 'ins';
    legalActPage.getNumTagOfParagraphFromArticle(paragraphNumber, articleNumber).find(tagName + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then('del tag with attribute {string} and value {string} of num tag of paragraph {int} of article {int} contains value {string}', function (attributeName, attributeValue, paragraphNumber, articleNumber, value) {
    const tagName = 'del';
    legalActPage.getNumTagOfParagraphFromArticle(paragraphNumber, articleNumber).find(tagName + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then('{string} is showing as strikethrough in num of article {int} of bill', function (label, articleNumber) {
    legalActPage.getArticle(articleNumber).should('have.attr', 'leos:action', 'delete').find('num').should('have.text', label).should('have.attr', 'id').and('contain', 'moved');
});

Then('{string} is showing as soft move label in num of article {int} of bill', function (softLabel, articleNumber) {
    legalActPage.getNumTagOfArticle(articleNumber).find('span.leos-soft-move-label').should('include.text', softLabel);
});

Then('{string} is showing as strikethrough in num of chapter {int} of bill', function (label, chapterNumber) {
    legalActPage.getChapter(chapterNumber).should('have.attr', 'leos:action', 'delete').find('num').should('have.text', label).should('have.attr', 'id').and('contain', 'moved');
});

Then('{string} is showing as soft move label in num of chapter {int} of bill', function (softLabel, chapterNumber) {
    legalActPage.getNumTagOfChapter(chapterNumber).find('span.leos-soft-move-label').should('include.text', softLabel);
});

Then('heading tag is not present for article {int} of bill', function (articleNumber) {
    legalActPage.getHeadingFromArticle(articleNumber).should('not.exist');
});

Then('paragraph tag is not present for article {int} of bill', function (articleNumber) {
    legalActPage.getAllParagraphFromArticle(articleNumber).should('not.exist');
});

Then('{string} is showing as track changes deleted in num of article {int} of bill', function (label, articleNumber) {
    legalActPage.getNumTagOfArticle(articleNumber).find('del').should('have.text', label);
});

Then('{string} is showing as track changes inserted in num of article {int} of bill', function (label, articleNumber) {
    legalActPage.getNumTagOfArticle(articleNumber).find('ins').should('have.text', label);
});

Then('heading tag is present for article {int} of bill', function (articleNumber) {
    legalActPage.getHeadingFromArticle(articleNumber).should('exist');
});

Then('paragraph tag is present for article {int} of bill', function (articleNumber) {
    legalActPage.getAllParagraphFromArticle(articleNumber).should('exist');
});

Then('{string} is showing as inserted in num of article {int} of bill', function (label, articleNumber) {
    legalActPage.getNumTagOfArticle(articleNumber).should('have.attr', 'leos:action', 'insert')
        .should(($el) => {
            const ownText = Cypress._.filter($el[0].childNodes, {
                nodeType: Node.TEXT_NODE,
            }).map((el) => el.textContent.trim()).filter(Boolean).join(' ');
            expect(ownText, 'own text').to.equal(label)
        })
});


Then('{string} is showing as inserted in num of chapter {int} of bill', function (label, chapterNumber) {
    legalActPage.getNumTagOfChapter(chapterNumber).should('have.attr', 'leos:action', 'insert')
        .should(($el) => {
            const ownText = Cypress._.filter($el[0].childNodes, {
                nodeType: Node.TEXT_NODE,
            }).map((el) => el.textContent.trim()).filter(Boolean).join(' ');
            expect(ownText, 'own text').to.equal(label)
        })
});

Then('point {int} of list {int} of paragraph {int} of article {int} contains attribute {string} with value {string}', function (pointNumber, listNumber, paragraphNumber, articleNumber, attributeName, attributeValue) {
    legalActPage.getPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).should('have.attr', attributeName).and('equal', attributeValue);
});

Then('count of text {string} is {int} in citation {int}', function (text, count, citationNumber) {
    legalActPage.getCitation(citationNumber).contains(text).should('have.length', count);
});

Then('citation {int} contains authorial note with marker {int} and text {string}', function (citationNumber, markerNumber, text) {
    legalActPage.getAuthorialNoteWithMarkerNumberFromCitation(citationNumber, markerNumber).should('have.text', text);
});

When('click on authorial note with marker {int} in citation {int}', function (markerNumber, citationNumber) {
    legalActPage.clickAuthorialNoteWithMarkerNumberFromCitation(markerNumber, citationNumber);
});

Then('recital {int} contains authorial note with marker {int} and text {string}', function (recitalNumber, markerNumber, text) {
    legalActPage.getAuthorialNoteWithMarkerNumberFromRecital(recitalNumber, markerNumber).should('have.text', text);
});

When('click on authorial note with marker {int} in recital {int}', function (markerNumber, recitalNumber) {
    legalActPage.clickAuthorialNoteWithMarkerNumberFromRecital(markerNumber, recitalNumber);
});

Then('paragraph {int} of article {int} contains {string}', function (paragraphNumber, articleNumber, text) {
    legalActPage.getParagraphFromArticle(paragraphNumber, articleNumber).should('include.text', text);
});

Then('paragraph {int} of article {int} contains authorial note with marker {int} and text {string}', function (paragraphNumber, articleNumber, markerNumber, text) {
    legalActPage.getAuthorialNoteWithMarkerNumberFromParagraphOfArticle(paragraphNumber, articleNumber, markerNumber).should('have.text', text);
});

When('click on authorial note with marker {int} in paragraph {int} of article {int}', function (markerNumber, paragraphNumber, articleNumber) {
    legalActPage.clickAuthorialNoteWithMarkerNumberFromParagraphOfArticle(markerNumber, paragraphNumber, articleNumber);
});

Then('content of subparagraph {int} of  of paragraph {int} of article {int} contains a table with {int} row and {int} column', function (subparagraphNumber, paragraphNumber, articleNumber, rowNumber, columnNumber) {
    legalActPage.getRowFromTableOfSubparagraphOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber).should('have.length', rowNumber);
    legalActPage.getColumnFromTableOfSubparagraphOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber).should('have.length', columnNumber);
});

Then('show all action menu is not present for citation {int}', function (citationNumber) {
    legalActPage.getLeosActionsIconOfCitation(citationNumber).should('not.exist');
});

Then('show all action menu is not present for recital {int}', function (recitalNumber) {
    legalActPage.getLeosActionsIconOfRecital(recitalNumber).should('not.exist');
});

Then('recital {int} contains attribute {string} with value {string}', function (recitalNumber, attributeName, attributeValue) {
    legalActPage.getRecital(recitalNumber).should('have.attr', attributeName).and('equal', attributeValue);
});

Then('ins tag of aknp tag of recital {int} contains value {string}', function (recitalNumber, value) {
    const tagName = 'ins';
    legalActPage.getAknpTagOfRecital(recitalNumber).find(tagName).should('have.text', value);
});

And('del tag with attribute {string} and value {string} of num tag of recital {int} contains value {string}', function (attributeName, attributeValue, recitalNumber, value) {
    const tagName = 'del';
    legalActPage.getRecital(recitalNumber).find(tagName + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

Then('ins tag with attribute {string} and value {string} of num tag of recital {int} contains value {string}', function (attributeName, attributeValue, recitalNumber, value) {
    const tagName = 'ins';
    legalActPage.getRecital(recitalNumber).find(tagName + "[" + attributeName + "='" + attributeValue + "']").should('have.text', value);
});

When(/^click on soft move label with title "([^"]*)"$/, function (label) {
    legalActPage.clickSoftMoveLabelWithTitle(label);
});

When(/^soft move label with title "([^"]*)" is displayed$/, function (label) {
    legalActPage.elements.leosSoftMoveLabel().contains(label).should('be.visible');
});

Then(/^paragraph (\d+) of article (\d+) doesn't contain attribute "([^"]*)"$/, function (paragraphNumber, articleNumber, attributeName) {
    legalActPage.getParagraphFromArticle(paragraphNumber, articleNumber).should('not.have.attr', attributeName);
});

Then(/^num tag of paragraph (\d+) of article (\d+) doesn't contain "([^"]*)" tag$/, function (paragraphNumber, articleNumber, tagName) {
    legalActPage.getTagFromNumTagOfParagraphFromArticle(paragraphNumber, articleNumber, tagName).should('not.exist');
});

Then(/^article (\d+) contains attribute "([^"]*)" with value "([^"]*)"$/, function (articleNumber, attributeName, attributeValue) {
    legalActPage.getArticle(articleNumber).should('have.attr', attributeName).and('equal', attributeValue);
});
import {When, Then} from "@badeball/cypress-cucumber-preprocessor";
import internalReferenceWindow from "../pages/internalReferenceWindow";

When(`click on {string} link in enacting terms on the left side of internal reference window`, (link) => {
    internalReferenceWindow.clickEnactingTermsArticleLink(link);
});

When(`click on {string} link in citations on the left side of internal reference window`, (link) => {
    internalReferenceWindow.clickCitationLink(link);
});

When(`click on {string} link in recitals on the left side of internal reference window`, (link) => {
    internalReferenceWindow.clickRecitalLink(link);
});

When(`click on point {int} of list {int} of paragraph {int} of article on the right side of internal reference window`, (pointNumber, listNumber, paragraphNumber) => {
    internalReferenceWindow.clickPointOfParagraphOfArticle(pointNumber, listNumber, paragraphNumber);
});

When(`click on paragraph {int} of article on the right side of internal reference window`, (paragraphNumber) => {
    internalReferenceWindow.clickParagraphOfArticle(paragraphNumber);
});

When(`click on {string} link in annex on the left side of internal reference window`, (link) => {
    internalReferenceWindow.clickAnnexLink(link);
});

When('click on {string} tab on internal reference dialogue box', (annex) => {
    internalReferenceWindow.clickDocumentTab(annex)
})

Then('{string} label is displayed in navigation pane of internal reference dialogue box', (label) => {
    internalReferenceWindow.elements.jsTreeAnchorLink().contains(label).should('be.visible');
})

When('click on {string} label in navigation pane of internal reference dialogue box', (label) => {
    internalReferenceWindow.clickLabelInDialogPageContents(label);
})

Then(/^"([^"]*)" tab is selected in internal reference dialogue box$/, function (tabName) {
    internalReferenceWindow.elements.selectedDialogTab().should('have.text', tabName);
});

Then(/^reference text label is shown as "([^"]*)" in internal reference dialogue box$/, function (referenceText) {
    internalReferenceWindow.elements.referenceTextLabel().should('have.value', referenceText);
});

Then(/^enacting terms contains following articles in internal reference window$/, function (dataTable) {
    const expectedTexts = dataTable.raw().flat();
    internalReferenceWindow.elements.articleList().find('a').each((element, index) => {
        cy.wrap(element).should('have.text', expectedTexts[index]);
    });
});
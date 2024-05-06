import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');
import legalActPage from "../pages/legalActPage";

Then('user is on legal act page', () => {
    legalActPage.getCurrentPageName().should("have.text", "Legal Act");
    cy.wait(10000);
})

When('mousehover and click on citation {int}', citationNumber => {
    legalActPage.mouseHoverAndClickOnCitation(citationNumber);
})

When('mousehover and click on recital {int}', recitalNumber => {
    legalActPage.mouseHoverAndClickOnRecital(recitalNumber);
})

When('mousehover and click on article {int}', articleNumber => {
    legalActPage.mouseHoverAndClickOnArticle(articleNumber);
})

When('click on close button present in legal act page', () => {
    legalActPage.clickCloseBtn();
})
 
When('{int} paragraphs are present in article {int}', (paragraphNumber, articleNumber) => {
    legalActPage.getAllParagraphFromArticle(articleNumber).should('have.length', paragraphNumber);
})

And('ribbon toolbar is displayed', () => {
    legalActPage.elements.ribbonToolBar().should('be.visible');
})
  
And('citation {int} contains {string}', (citationNumber,text) => {
    legalActPage.getCitation(citationNumber).contains(text);
})

And('citation {int} doesnot contain {string}', (citationNumber,text) => {
    legalActPage.getCitation(citationNumber).should('not.include.text', text)
})

And('recital {int} contains {string}', (recitalNumber,text) => {
    legalActPage.getRecital(recitalNumber).contains(text);
})

And('recital {int} doesnot contain {string}', (recitalNumber,text) => {
    legalActPage.getRecital(recitalNumber).should('not.include.text', text)
})

When('mousehover on citation {int} and click on edit button from action menu', (citationNumber) => {
    legalActPage.mouseHoverOnCitation(citationNumber);
    legalActPage.mouseHoverOnThreeDots();
    legalActPage.elements.editIconActionMenu().click();
})

Then(`paragraph {int} of article {int} contains {string}`, (paragraphNumber, articleNumber, text) => {
    legalActPage.getParagraphFromArticle(paragraphNumber,articleNumber).contains(text);
});

Then(`paragraph {int} of article {int} doesnot contain {string}`, (paragraphNumber, articleNumber, text) => {
    legalActPage.getParagraphFromArticle(paragraphNumber,articleNumber).should('not.include.text', text);
});

Then(`paragraph {int} of article {int} doesnot contain {string}`, (paragraphNumber, articleNumber, text) => {
    legalActPage.getParagraphFromArticle(paragraphNumber,articleNumber).should('not.include.text', text);
});
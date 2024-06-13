import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import internalReferenceWindow from "../pages/internalReferenceWindow";

Then(`title of cke dialog box is {string}`, (title) => {
    internalReferenceWindow.elements.dialogTitle().should('have.text', title);
});

When(`click on ok button in internal reference window`, () => {
    internalReferenceWindow.clickOkBtn();
});

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
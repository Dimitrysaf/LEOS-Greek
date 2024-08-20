import { When, Then } from "cypress-cucumber-preprocessor/steps";
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
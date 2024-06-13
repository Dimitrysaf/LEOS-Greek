import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');
import coverPage from "../pages/coverPage";
import ckEditorWindow from "../pages/ckEditorWindow";

Then(`user is on cover page`, () => {
    coverPage.getCurrentPageName().should("have.text", "Cover Page");
    cy.wait(2000);
});

Then(`long title of cover page contains {string}`, (title) => {
    coverPage.elements.longTitle().should("have.text", title);
});

When(`click on close button present in cover page`, () => {
    coverPage.clickCloseBtn();
});

Then(`long title docpurpose of cover page is {string}`, (title) => {
    coverPage.elements.docpurpose().should("have.text", title);
});

When(`click on long title of doc purpose`, () => {
    coverPage.clickDocPurpose();
});
import { When, Then } from "cypress-cucumber-preprocessor/steps";
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

Then(`total number of level is {int}`, (count) => {
    annexPage.elements.level().should('have.length', count);
});

Then(`level {int} contains {string}`, (levelNumber, text) => {
    annexPage.getContentOfAnnex(levelNumber).invoke('text').should('contain', text);
});

When(`click on insert before icon of level {int}`, (levelNumber) => {
    annexPage.clickInsertBeforeIconOfLevel(levelNumber);
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
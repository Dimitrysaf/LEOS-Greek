import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');
import proposalViewerPage from "../pages/proposalViewerPage";

Then('user is on proposal viewer page', () => {
    proposalViewerPage.getCurrentPageName().should("have.text", "Proposal View");
})

Then('click on legal act link present in proposal viewer page', () => {
    proposalViewerPage.clickLegalActLink();
})

When('click on close button on proposal viewer page', () => {
    proposalViewerPage.clickCloseBtn();
})
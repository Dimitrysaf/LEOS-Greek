import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
require('@cypress/xpath');
import proposalViewerPage from "../pages/proposalViewerPage";

And('annotation side bar is present', () => {
    proposalViewerPage.getCurrentPageName().should("have.text", "Proposal View");
})

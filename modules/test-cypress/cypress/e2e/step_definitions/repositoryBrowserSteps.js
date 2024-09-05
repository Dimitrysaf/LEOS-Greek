import { When, Then } from "cypress-cucumber-preprocessor/steps";
import repositoryBrowserPage from "../pages/repositoryBrowserPage";
import headerPage from "../pages/headerPage";

Then('user is on repository browser page', () => {
    headerPage.getCurrentPageName().should("have.text", "Workspace");
})

When('click on Create act button', () => {
    repositoryBrowserPage.clickCreateProposalBtn();
})

When(`click on upload button`, () => {
    repositoryBrowserPage.clickUploadBtn();
});

When('click on act {int}', (proposalIndex) => {
    repositoryBrowserPage.clickOnNthProposal(proposalIndex);
});

When(`upload button is not present`, () => {
    repositoryBrowserPage.elements.uploadBtn().should('not.exist');
});

Then('name of act {int} contains {string}', (proposalIndex, name) => {
    repositoryBrowserPage.getNameOfProposal(proposalIndex).should('include.text', name);
});

Then('contribution status of act {int} contains {string}', (proposalIndex, status) => {
    repositoryBrowserPage.getRightContentOfProposal(proposalIndex).should('include.text', status)
});
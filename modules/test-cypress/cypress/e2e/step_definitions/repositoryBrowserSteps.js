import { When, Then } from "cypress-cucumber-preprocessor/steps";
import repositoryBrowserPage from "../pages/repositoryBrowserPage";

Then('user is on repository browser page', () => {
    repositoryBrowserPage.getCurrentPageName().should("have.text", "Workspace");
})

When('click on create proposal button', () => {
    repositoryBrowserPage.clickCreateProposalBtn();
})

When(`click on upload button`, () => {
    repositoryBrowserPage.clickUploadBtn();
});

When(`open first proposal`, () => {
    repositoryBrowserPage.openFirstProposal();
});

When('click on proposal {int}', (proposalIndex) => {
    repositoryBrowserPage.clickOnNthProposal(proposalIndex);
});

When(`upload button is not present`, () => {
    repositoryBrowserPage.elements.uploadBtn().should('not.exist');
});

When(`click on home button`, () => {
    repositoryBrowserPage.clickHomeBtn();
});

Then('name of proposal {int} contains {string}', (proposalIndex, name) => {
    repositoryBrowserPage.getNameOfProposal(proposalIndex).should('include.text', name);
});

Then('contribution status of proposal {int} contains {string}', (proposalIndex, status) => {
    repositoryBrowserPage.getRightContentOfProposal(proposalIndex).should('include.text', status)
});
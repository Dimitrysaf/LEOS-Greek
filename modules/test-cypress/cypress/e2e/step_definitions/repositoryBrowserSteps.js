import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import repositoryBrowserPage from "../pages/repositoryBrowserPage";

Then('user is on repository browser page', () => {
    repositoryBrowserPage.getCurrentPageName().should("have.text", "Workspace");
})

When('click on create proposal button', () => {
    repositoryBrowserPage.elements.createProposalBtn().click();
})

// When('click proposal {int} in repository browser page', (proposalRank) => {
//     cy.get('eui-card-header-title').eq(proposalRank-1).click();
//     cy.wait(2000);
// })

// When('click on workspace button from breadcrumb item', () => {
//     cy.get('eui-breadcrumb eui-breadcrumb-item:nth-child(2) button').click();
//     cy.wait(1000);
// })


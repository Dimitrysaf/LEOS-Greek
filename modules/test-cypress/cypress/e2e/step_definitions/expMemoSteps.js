import { When, Then } from "cypress-cucumber-preprocessor/steps";
import expMemoPage from "../pages/expMemoPage";

Then('user is on explanatory memorandum page', () => {
    expMemoPage.getCurrentPageName().should("have.text", "Explanatory Memorandum");
    cy.wait(2000);
})

Then('explanatory memorandum document container is displayed', function () {
    expMemoPage.elements.documentContainer().should('be.visible');
});

Then('below sentences are present for user guidance in the explanatory document container', (datatable) => {
    const givenGuidanceList = [];
    datatable.hashes().forEach((guidance) => {
        givenGuidanceList.push(guidance.guidanceList);
    });
    expMemoPage.elements.guidanceBlock()
        .then(($els) => {
            return (
                Cypress.$.makeArray($els)
                    .map((el) => el.innerText.trim())
            )
        })
        .should('deep.equal', givenGuidanceList);
});

Then('user guidance is not present in the explanatory document container', function () {
    expMemoPage.elements.guidanceBlock().should('not.exist');
});

When('click on close button on explanatory memorandum page', function () {
    expMemoPage.clickCloseBtn();
});
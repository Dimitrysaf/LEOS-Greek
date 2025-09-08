import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import expMemoPage from "../pages/expMemoPage";
import headerPage from "../pages/headerPage";

Then('user is on explanatory memorandum page', () => {
    headerPage.getCurrentPageName().should("have.text", "Explanatory Memorandum");
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

When('mouseover and click on block container {int} in explanatory memorandum page', (blockContainerNumber) => {
    expMemoPage.mouseHoverAndClickOnBlockContainer(blockContainerNumber);
});

Then(/^num of item (\d+) of blockList (\d+) of blockContainer (\d+) contains value "([^"]*)"$/, function (itemCount, blockListCount, blockContainerCount, text) {
    expMemoPage.getItemFirstLayer(itemCount, blockListCount, blockContainerCount).children('num').should('have.text', text);
});

Then(/^content of item (\d+) of blockList (\d+) of blockContainer (\d+) contains value "([^"]*)"$/, function (itemCount, blockListCount, blockContainerCount, content) {
    expMemoPage.getItemFirstLayer(itemCount, blockListCount, blockContainerCount).children('aknp').should('have.text', content);
});

Then(/^num of item (\d+) of blockList (\d+) of item (\d+) of blockList (\d+) of blockContainer (\d+) contains value "([^"]*)"$/, function (itemCount2, blockListCount2, itemCount, blockListCount, blockContainerCount, text) {
    expMemoPage.getItemSecondLayer(itemCount2, blockListCount2, itemCount, blockListCount, blockContainerCount).children('num').should('have.text', text);
});

Then(/^content of item (\d+) of blockList (\d+) of item (\d+) of blockList (\d+) of blockContainer (\d+) contains value "([^"]*)"$/, function (itemCount2, blockListCount2, itemCount, blockListCount, blockContainerCount, content) {
    expMemoPage.getItemSecondLayer(itemCount2, blockListCount2, itemCount, blockListCount, blockContainerCount).children('aknp').should('have.text', content);
});
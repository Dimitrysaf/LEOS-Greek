import {When, Then} from "@badeball/cypress-cucumber-preprocessor";
import contributionPage from "../pages/contributionPage";

When(`click on merge actions menu of {string} {int}`, (eltName, eltNumber) => {
    contributionPage.clickMergeActionsMenu(eltName, eltNumber);
});

When(`click on {string} in merge actions menu of {string} {int}`, (action, eltName, eltNumber) => {
    contributionPage.clickOnActionInMergeActions(eltName, eltNumber, action);
});

When(`click on merge action {string}`, (mergeAction) => {
    contributionPage.clickMergeAction(mergeAction);
});

When(`click on apply changes`, () => {
    contributionPage.clickApplyChanges();
});

Then(`check that {string} with id {string} is at position {int}`, (eltName, id, eltNumber) => {
    contributionPage.getElementInDocument(eltName, eltNumber).should('exist').should('have.id', id);
});

Then(`check that {string} {int} is accepted`, (eltName, eltNumber) => {
    contributionPage.getElementInContribution(eltName, eltNumber).invoke('attr', 'leos:mergeAction')
        .should('eq', 'ACCEPT');
});

Then(`check that {string} {int} is accepted with track changes`, (eltName, eltNumber) => {
    contributionPage.getElementInContribution(eltName, eltNumber).invoke('attr', 'leos:mergeAction')
        .should('eq', 'ACCEPT_TC');
});

Then(`check that {string} {int} is processed`, (eltName, eltNumber) => {
    contributionPage.getElementInContribution(eltName, eltNumber).invoke('attr', 'leos:mergeAction')
        .should('eq', 'PROCESSED');
});

Then(`check that there is no merge action on {string} {int}`, (eltName, eltNumber) => {
    contributionPage.getElementInContribution(eltName, eltNumber).invoke('attr', 'leos:mergeAction')
        .should('not.exist');
});

Then('check that {string} {int} contains attribute {string} with value {string}', function (eltName, eltNumber, attributeName, attributeValue) {
    contributionPage.getElementInDocument(eltName, eltNumber).should('have.attr', attributeName).and('equal', attributeValue);
});

Then(/^contribution view container is displayed$/, function () {
    contributionPage.elements.contributionViewContainer().should('be.visible');
});

Then(/^contribution view container is not displayed$/, function () {
    contributionPage.elements.contributionViewContainer().should('not.exist');
});

Then(`wrapper is not present for element {string} {int}`, (eltName, eltNumber) => {
    contributionPage.getElementInContribution(eltName, eltNumber).nextAll().should('have.length', 0);
});

When('click on merge actions menu of annex title', () => {
    contributionPage.ClickTitleMergeActionsMenu()
});

When(/^wrapper is present for paragraph (\d+) of article (\d+)$/, function (paragraphNumber, articleNumber) {
    contributionPage.getWrapperOfParagraphOfArticle(paragraphNumber, articleNumber).should('exist');
});

Then(/^wrapper is present for level (\d+)$/, function (levelNumber) {
    contributionPage.getWrapperOfLevel(levelNumber).should('exist');
});

Then(/^wrapper is present for article (\d+)$/, function (articleNumber) {
    contributionPage.getWrapperOfArticle(articleNumber).should('exist');
});
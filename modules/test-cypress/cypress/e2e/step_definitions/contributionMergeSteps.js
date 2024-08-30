import {When, Then} from "cypress-cucumber-preprocessor/steps";
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
import {When, And, Then} from "cypress-cucumber-preprocessor/steps";
import merge from "../pages/merge";

When(`click on merge actions menu of {string} {int}`, (eltName, eltNumber) => {
    merge.clickMergeActionsMenu(eltName, eltNumber);
});

When(`click on {string} in merge actions menu of {string} {int}`, (action, eltName, eltNumber) => {
    merge.clickOnActionInMergeActions(eltName, eltNumber, action);
});

When(`click on merge action {string}`, (mergeAction) => {
    merge.clickMergeAction(mergeAction);
});

When(`click on apply changes`, () => {
    merge.clickApplyChanges();
});

Then(`check that {string} with id {string} is at position {int}`, (eltName, id, eltNumber) => {
    merge.getElementInDocument(eltName, eltNumber).should('exist').should('have.id', id);
});

Then(`check that {string} {int} is accepted`, (eltName, eltNumber) => {
    merge.getElementInContribution(eltName, eltNumber).invoke('attr', 'leos:mergeAction')
    .should('eq', 'ACCEPT');
});

Then(`check that {string} {int} is accepted with track changes`, (eltName, eltNumber) => {
    merge.getElementInContribution(eltName, eltNumber).invoke('attr', 'leos:mergeAction')
    .should('eq', 'ACCEPT_TC');
});

Then(`check that {string} {int} is processed`, (eltName, eltNumber) => {
    merge.getElementInContribution(eltName, eltNumber).invoke('attr', 'leos:mergeAction')
    .should('eq', 'PROCESSED');
});

Then(`check that there is no merge action on {string} {int}`, (eltName, eltNumber) => {
    merge.getElementInContribution(eltName, eltNumber).invoke('attr', 'leos:mergeAction')
    .should('not.exist');
});
    
Then('check that {string} {int} contains attribute {string} with value {string}', function (eltName, eltNumber, attributeName, attributeValue) {
    merge.getElementInDocument(eltName, eltNumber).should('have.attr', attributeName).and('equal', attributeValue);
});


import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import collaboratorsTab from "../pages/collaboratorsTab";

When(/^click on add button in collaborators tab$/, function () {
    collaboratorsTab.clickAddBtn();
});

When('provide input {string} in name field of add users window', function (name) {
    collaboratorsTab.typeName(name);
});

When(/^click on add users button$/, function () {
    collaboratorsTab.clickAddUsersBtn();
});

Then('{string} is displayed in row {int} of column name of collaborators tab', function (name,row) {
    collaboratorsTab.getNameFromCollaboratorsTable(row).should('have.text', name);
});

Then('{string} is displayed in row {int} of column role of collaborators tab', function (role,row) {
    collaboratorsTab.getRoleFromCollaboratorsTable(row).should('have.text', role);
});

When('click on row {int} from the user list in name field of add users window', function (row) {
    collaboratorsTab.clickUser(row);
});

When('select role with value {string} in add users window', function (role) {
    collaboratorsTab.selectRole(role).should('have.value', role);
});

When(/^type "([^"]*)" in search filter input in collaborators tab$/, function (keyword) {
    collaboratorsTab.searchInput(keyword)
});

Then(/^total number of row is (\d+) in collaborators tab$/, function (count) {
    collaboratorsTab.elements.collaboratorsRow().should('have.length', count);
});

When(/^click on three vertical dots in column action of row (\d+) of collaborators tab$/, function (row) {
    collaboratorsTab.clickThreeVerticalDotsInActionColumn(row);
});

When(/^click on edit role button$/, function () {
    collaboratorsTab.clickEditRoleBtn();
});

When(/^select role with value "([^"]*)" in column action of row (\d+) of collaborators tab$/, function (role, row) {
    collaboratorsTab.selectRoleFromRow(role, row);
});

When('click on delete role button',()=>{
    collaboratorsTab.clickDeleteRole();
});

Then('{string} is not displayed in collaborators tab', function (name) {
    collaboratorsTab.getRowByName(name).should('not.exist');
});

Then ('delete option is not be visible for the collaborator',()=>{
        collaboratorsTab.elements.deleteRole().should('not.exist');
    });

Then('user name {string} is added as collaborator', (fullName) => {
    collaboratorsTab.getRowByName(fullName).should('exist');
});

Then('background color of row with username {string} is pink', (name) => {
    collaboratorsTab.getRowByName(name)
        .find('td').first()
        .should('have.class', 'eui-u-bg-color-danger-25');
});

Then('the entity is not present for collaborator {string}', (name) => {
    collaboratorsTab.getRowByName(name)
        .find('td').eq(1)
        .invoke('text')
        .then(text => expect(text.trim()).to.equal(''));
});

When('mousehover on entity column of user {string}', (name) => {
    collaboratorsTab.getRowByName(name)
        .find('td').eq(1)
        .trigger('mouseenter');
});

Then('tooltip contains {string}', (expectedText) => {
    collaboratorsTab.elements.tooltip()
        .should('be.visible')
        .and('contain.text', expectedText);
});

When('click on three vertical dots for user {string} in collaborators tab', (name) => {
    collaboratorsTab.clickThreeVerticalDotsForUser(name);
});

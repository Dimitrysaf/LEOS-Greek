import { When, And, Then } from "cypress-cucumber-preprocessor/steps";
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
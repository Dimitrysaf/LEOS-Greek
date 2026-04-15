import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import headerPage from "../pages/headerPage";
import userEntityManagementPage from "../pages/userEntityManagementPage"
//import { use } from "chai";

When("click on manage users and entities link under administration dropdown", function () {
    headerPage.clickAdministrationDropDownButton()
    headerPage.clickManageUsersAndEntityItem()
});

Then("add user button should be displayed", function () {
    userEntityManagementPage.checkPresenceOfAddUserButton()
});

When("click on add user button", function () {
    userEntityManagementPage.clickAddUserButton()
});

Then("user info section should be displayed", function () {
    userEntityManagementPage.checkPresenceOfUserInfoSection()
});

When("fill the user info details", function (dataTable) {
    const user = dataTable.hashes()[0]
    cy.wrap(user).as('userData')
    userEntityManagementPage.fillUserInfoSection(user)
})

When("search and assign the entities {string} to the user", function (entities) {
    const entityList = JSON.parse(entities);
    cy.wrap(entityList).each((entity) => {
        userEntityManagementPage.searchEntity(entity)
        userEntityManagementPage.selectEntity(entity)
        userEntityManagementPage.assignEntity()
    })
});

When ("click on save button", function () {
    userEntityManagementPage.saveUserInfoForm()
});

Then("show the successful message that a new user is created", function () {
    cy.get('@userData').then((user) => {    
        userEntityManagementPage.verifyNewUserCreation(user.firstName, user.lastName)
    })
});

Then("verify the new user details on the table", function() {
    cy.get('@userData').then((user) => {
        userEntityManagementPage.verifyUserLogin(user.userLogin)
    })
});
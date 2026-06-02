import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import headerPage from "../pages/headerPage";
import userEntityManagementPage from "../pages/userEntityManagementPage"
import euiDialogBoxPage from "../pages/euiDialogBoxPage"

When("click on manage users and entities link under administration dropdown", function () {
    headerPage.clickAdministrationDropDownButton()
    headerPage.clickManageUsersAndEntityItem()
});

Then("add user button should be displayed", function () {
    userEntityManagementPage.elements.addUserBtn().should('be.visible')
});

When("click on add user button", function () {
    userEntityManagementPage.clickAddUserButton()
});

Then("user info section should be displayed", function () {
    userEntityManagementPage.elements.userInfoLabel().should('be.visible')
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
    userEntityManagementPage.clickSaveButton()
});

When("verify user creation fails without entities", function (dataTable) {
    const user = dataTable.hashes()[0]
    userEntityManagementPage.fillUserInfoSection(user)
    userEntityManagementPage.clickSaveButton()
    userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('contain', 'Error creating user')
    userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', userEntityManagementPage.errorMessages.formValidationError)
    euiDialogBoxPage.clickAcceptBtn()
    userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('not.exist')
});

When("verify user creation fails if mandatory field is empty", function (dataTable) {
    const user = dataTable.hashes()[0]
    const mandatoryFields = ['firstName', 'lastName', 'email', 'userLogin']
    cy.wrap(mandatoryFields).each((field) => {
        userEntityManagementPage.fillUserInfoSectionExcept(user, field)
        userEntityManagementPage.clearField(field)
        userEntityManagementPage.clickSaveButton()
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('contain', 'Error creating user')
        userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', userEntityManagementPage.errorMessages.formValidationError)
        euiDialogBoxPage.clickAcceptBtn()
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('not.exist')
    })
});

When("verify user creation fails if any field contains invalid data", function (dataTable) {
    const rows = dataTable.hashes()
    cy.wrap(rows).each((row) => {
        userEntityManagementPage.fillUserInfoSectionWithInvalidData(
            { firstName: 'firstuser', lastName: 'lastuser', email: 'first@last.com', userLogin: 'firstLast' },
            row.fields, row.invalidValue
        )
        userEntityManagementPage.clickSaveButton()
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('contain', 'Error creating user')
        userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', userEntityManagementPage.errorMessages.formValidationError)
        euiDialogBoxPage.clickAcceptBtn()
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('not.exist')
    })
});

Then("show the successful message that a new user is created", function () {
    cy.get('@userData').then((user) => {    
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().contains('New user created')
        userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain',`User ${user.firstName} ${user.lastName} successfully created.`)
        euiDialogBoxPage.clickAcceptBtn()
    })
});

Then("verify the new user details on the table", function() {
    cy.get('@userData').then((user) => {
        userEntityManagementPage.searchNewUserLogin(user.userLogin)
        userEntityManagementPage.elements.userLoginColumnInTable().should('contain', user.userLogin)
    })
});

When("select manage entities tab", function () {
    userEntityManagementPage.selectManageEntitiesTab()
});

When("add entity button should be displayed", function () {
    userEntityManagementPage.elements.addEntityBtn().should('be.visible')
});

Then("click on add entity button", function () {
    userEntityManagementPage.clickAddEntityButton()
});

Then("custom entity info section should be displayed", function () {
    userEntityManagementPage.elements.customEntityInfoLabel().should('be.visible')
});

Then("create an entity by giving a name {string}", function (entityName) {
    cy.wrap(entityName).as('entityName')
    userEntityManagementPage.fillEntityInfoDetails(entityName)
    userEntityManagementPage.clickSaveButton()
});

Then("show the successful message that a new entity is created", function () {
    cy.get('@entityName').then((entityName) => {
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().contains('New entity created')
        userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain',`Entity ${entityName} successfully created.`)
        euiDialogBoxPage.clickAcceptBtn()
    })
});

Then("verify the new entity presence on the table", function () {
    cy.get('@entityName').then((entityName) => {
        userEntityManagementPage.searchNewEntity(entityName)
        userEntityManagementPage.elements.entityColumnInTable().should('contain', entityName)
    })
});

When("search and click on entity {string}", function (entityName) {
    userEntityManagementPage.searchNewEntity(entityName)
    userEntityManagementPage.clickEntityInTable(entityName)
});

When("verify entity update fails if name contains invalid data", function (dataTable) {
    const rows = dataTable.hashes()
    cy.wrap(rows).each((row) => {
        userEntityManagementPage.fillEntityInfoDetails(row.invalidName)
        userEntityManagementPage.clickSaveButton()
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('contain', 'Error updating entity')
        userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', userEntityManagementPage.errorMessages.formValidationError)
        euiDialogBoxPage.clickAcceptBtn()
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('not.exist')
    })
});

When("update the entity name to {string}", function (entityName) {
    cy.wrap(entityName).as('updatedEntityName')
    userEntityManagementPage.fillEntityInfoDetails(entityName)
});

Then("show the successful message that entity is updated", function () {
    cy.get('@updatedEntityName').then((entityName) => {
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().contains('Entity updated')
        userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', `Entity ${entityName} successfully updated`)
        euiDialogBoxPage.clickAcceptBtn()
    })
});

Then("verify the updated entity presence on the table", function () {
    cy.get('@updatedEntityName').then((entityName) => {
        userEntityManagementPage.searchNewEntity(entityName)
        userEntityManagementPage.elements.entityColumnInTable().should('contain', entityName)
    })
});

When("search and click on user with login {string}", function (userLogin) {
    cy.wrap(userLogin).as('userLogin')
    userEntityManagementPage.searchNewUserLogin(userLogin)
    userEntityManagementPage.clickUserLoginInTable(userLogin)
});

When("click on edit button", function () {
    userEntityManagementPage.clickEditButton()
});

When("update the user info details", function (dataTable) {
    const user = dataTable.hashes()[0]
    cy.wrap(user).as('updatedUserData')
    userEntityManagementPage.updateUserInfoDetails(user)
});

Then("show the successful message that user is updated", function () {
    cy.get('@updatedUserData').then((user) => {
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().contains('User updated')
        userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', `User ${user.firstName} ${user.lastName} successfully updated.`)
        euiDialogBoxPage.clickAcceptBtn()
    })
});

Then("verify the updated user details on the table", function () {
    cy.get('@updatedUserData').then((user) => {
        cy.get('@userLogin').then((userLogin) => {
            userEntityManagementPage.searchNewUserLogin(userLogin)
            userEntityManagementPage.elements.firstNameColumnInTable().should('contain', user.firstName)
            userEntityManagementPage.elements.lastNameColumnInTable().should('contain', user.lastName)
            userEntityManagementPage.elements.userLoginColumnInTable().should('contain', userLogin)
        })
    })
});

Then("verify the updated email in user info section", function () {
    cy.get('@updatedUserData').then((user) => {
        userEntityManagementPage.elements.readOnlyEmailTxtBx().should('have.value', user.email)
    })
});

When("select and remove the entities {string} from the user", function (entities) {
    const entityList = JSON.parse(entities)
    cy.wrap(entityList).each((entity) => {
        userEntityManagementPage.selectEntityToRemove(entity)
        userEntityManagementPage.removeEntity()
    })
});

Then("verify the entities {string} are removed from the user", function (entities) {
    const entityList = JSON.parse(entities);
    cy.wrap(entityList).each((entity) => {
        userEntityManagementPage.elements.userEntityCell(entity).should('not.exist');
    });
});

When("search user with login {string}", function (userLogin) {
    userEntityManagementPage.searchNewUserLogin(userLogin)
});

When("click on delete button for user {string}", function () {
    userEntityManagementPage.clickDeleteButtonForUser()
});

Then("error popup should be displayed as entity is associated with the user", function () {
    userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('contain', 'This user cannot be deleted.')
    userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', userEntityManagementPage.errorMessages.userDeletionWithEntitiesError)
    euiDialogBoxPage.clickAcceptBtn()
    userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('not.exist')
});

Then("confirm the user deletion for {string} {string} {string}", function (lastName, firstName, userLogin) {
    userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('contain', 'Delete user')
    userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', `Are you sure you want to delete user`)
    userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().find('b').should('contain', firstName)
    userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().find('b').should('contain', lastName)
    userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().find('b').should('contain', userLogin)
    euiDialogBoxPage.clickAcceptBtn()
});

Then("verify the user {string} is still present on the table", function (userLogin) {
    userEntityManagementPage.searchNewUserLogin(userLogin)
    userEntityManagementPage.elements.userLoginColumnInTable().should('contain', userLogin)
});

Then("verify the user {string} is no longer present on the table", function (userLogin) {
    userEntityManagementPage.searchNewUserLogin(userLogin)
    userEntityManagementPage.elements.userLoginColumnInTable().should('not.exist')
});

When("click on delete entity button", function () {
    userEntityManagementPage.clickDeleteEntityButton()
});

Then("error popup should be displayed as user is associated with the entity", function () {
    userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('contain', 'Cannot delete entity with users.')
    userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', userEntityManagementPage.errorMessages.entityDeletionWithUsersError)
    euiDialogBoxPage.clickAcceptBtn()
    userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('not.exist')
});

Then("verify the entity {string} is still present on the table", function (entityName) {
    userEntityManagementPage.searchNewEntity(entityName)
    userEntityManagementPage.elements.entityColumnInTable().should('contain', entityName)
});

Then("confirm the entity deletion for {string}", function (entityName) {
    userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('contain', 'Delete entity')
    userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', `Are you sure you want to delete entity`)
    userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().find('b').should('contain', entityName)
    euiDialogBoxPage.clickAcceptBtn()
});

Then("verify the entity {string} is no longer present on the table", function (entityName) {
    userEntityManagementPage.searchNewEntity(entityName)
    userEntityManagementPage.elements.entityColumnInTable().should('not.exist')
});

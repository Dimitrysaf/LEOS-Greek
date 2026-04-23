import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import headerPage from "../pages/headerPage";
import userEntityManagementPage from "../pages/userEntityManagementPage"

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
    userEntityManagementPage.saveUserInfoForm()
});

When("verify user creation fails without entities", function (dataTable) {
    const user = dataTable.hashes()[0]
    userEntityManagementPage.fillUserInfoSection(user)
    userEntityManagementPage.saveUserInfoForm()
    userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('contain', 'Error creating user')
    userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', userEntityManagementPage.errorMessages.userCreationError)
    userEntityManagementPage.confirmNewUserCreationDialogBox()
    userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('not.exist')
});

When("verify user creation fails if mandatory field is empty", function (dataTable) {
    const user = dataTable.hashes()[0]
    const mandatoryFields = ['firstName', 'lastName', 'email', 'userLogin']
    mandatoryFields.forEach((field) => {
        userEntityManagementPage.fillUserInfoSectionExcept(user, field)
        userEntityManagementPage.clearField(field)
        userEntityManagementPage.saveUserInfoForm()
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('contain', 'Error creating user')
        userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', userEntityManagementPage.errorMessages.userCreationError)
        userEntityManagementPage.confirmNewUserCreationDialogBox()
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('not.exist')
    })
});

When("verify user creation fails if any field contains invalid data", function (dataTable) {
    const rows = dataTable.hashes()
    rows.forEach((row) => {
        userEntityManagementPage.fillUserInfoSectionWithInvalidData(
            { firstName: 'firstuser', lastName: 'lastuser', email: 'first@last.com', userLogin: 'firstLast' },
            row.fields, row.invalidValue
        )
        userEntityManagementPage.saveUserInfoForm()
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('contain', 'Error creating user')
        userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain', userEntityManagementPage.errorMessages.userCreationError)
        userEntityManagementPage.confirmNewUserCreationDialogBox()
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().should('not.exist')
    })
});

Then("show the successful message that a new user is created", function () {
    cy.get('@userData').then((user) => {    
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().contains('New user created')
        userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain',`User ${user.firstName} ${user.lastName} successfully created.`)
        userEntityManagementPage.confirmNewUserCreationDialogBox()
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
    userEntityManagementPage.saveEntityForm()
});

Then("show the successful message that a new entity is created", function () {
    cy.get('@entityName').then((entityName) => {
        userEntityManagementPage.elements.newUserorEntityDialogBxTitle().contains('New entity created')
        userEntityManagementPage.elements.newUserorEntityCreationMessageLocator().should('contain',`Entity ${entityName} successfully created.`)
        userEntityManagementPage.confirmNewEntityCreationDialogBox()
    })
});

Then("verify the new entity presence on the table", function () {
    cy.get('@entityName').then((entityName) => {
        userEntityManagementPage.searchNewEntity(entityName)
        userEntityManagementPage.elements.entityColumnInTable().should('contain', entityName)
    })
});
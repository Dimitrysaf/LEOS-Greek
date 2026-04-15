class userEntityManagementPage {
    elements = {
        addUserBtn: () => cy.get('button[data-e2e=\'eui-button\'] > span').contains('Add user'),
        userInfoLabel: () => cy.get('eui-card-header-title').contains('USER INFO'),
        lastNameTxtBx: () => cy.get('input[placeholder=\'Last name\']'),
        firstNameTxtBx: () => cy.get('input[placeholder=\'First name\']'),
        emailTxtBx: () => cy.get('input[placeholder=\'Email\']'),
        userLoginTxtBx: () => cy.get('input[placeholder=\'User login\']'),
        searchEntityTxtBx: () => cy.get('input[placeholder=\'Search by entity name\']'),
        selectEntityDropDown: () => cy.get('select.entities-select:not(.ng-star-inserted)'),
        angleLeftBtn: () => cy.get('span.eui-icon-angle-left'),
        angleRightBtn: () => cy.get('span.eui-icon-angle-right'),
        saveUserBtn: () => cy.get('span').contains('Save'),
        newUserDialogBxTitle: () => cy.get('#headerTitle').contains('New user created'),
        newUserCreationMessageLocator: () => cy.get('#containerConfigId'),
        newUserDialogBxOkBtn: () => cy.get('button.eui-dialog__footer-accept-button').contains('OK'),
        searchUsersTxtBx: () => cy.get('input[placeholder=\'Search by user name, login or email\']'),
        searchIconBtn: () => cy.get('eui-icon-svg[icon=\'eui-search\']'),
        userLoginColumnInTable: () => cy.get('tr td:nth-child(3)'),

    }

    checkPresenceOfAddUserButton()
    {
        this.elements.addUserBtn().should('be.visible')
    }

    clickAddUserButton(){
        this.elements.addUserBtn().click()
    }

    checkPresenceOfUserInfoSection()
    {
        this.elements.userInfoLabel().should('be.visible')
    }

    fillUserInfoSection(user)
    {
        this.enterLastName(user.lastName)
        this.enterFirstName(user.firstName)
        this.enterEmail(user.email)
        this.enterUserLogin(user.userLogin)
    }

    enterLastName(lastname) {
        this.elements.lastNameTxtBx().type(lastname)
    }

    enterFirstName(firstname) {
        this.elements.firstNameTxtBx().type(firstname)
    }

    enterEmail(email)
    {
        this.elements.emailTxtBx().type(email)
    }

    enterUserLogin(userLogin)
    {
        this.elements.userLoginTxtBx().type(userLogin)
    }

    searchEntity(entity)
    {
        this.elements.searchEntityTxtBx().clear().type(entity)
    }

    selectEntity(entity)
    {
        this.elements.selectEntityDropDown().select(entity)
    }

    assignEntity()
    {
        this.elements.angleLeftBtn().click()
    }

    saveUserInfoForm()
    {
        this.elements.saveUserBtn().click()
    }

    verifyNewUserCreation(firstName, lastName){
        this.elements.newUserDialogBxTitle().should('be.visible')
        this.elements.newUserCreationMessageLocator().should('contain',`User ${firstName} ${lastName} successfully created.`)
        this.elements.newUserDialogBxOkBtn().click()
    }

    verifyUserLogin(userLogin) {
        this.elements.searchUsersTxtBx().type(userLogin)
        this.elements.searchIconBtn().click()
        this.elements.userLoginColumnInTable().should('contain', userLogin)
    }
}
export default new userEntityManagementPage;
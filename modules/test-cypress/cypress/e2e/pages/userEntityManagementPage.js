class userEntityManagementPage {
    elements = {
        manageEntitiesTab:() => cy.get('div.eui-tab-item').contains('Manage entities'),
        addEntityBtn: () => cy.get('button[data-e2e=\'eui-button\'] > span').contains('Add an entity'),
        customEntityInfoLabel: () => cy.get('eui-card-header-title').contains('CUSTOM ENTITY INFO'),
        entityNameTxtBx: () => cy.get('#entityName'),
        entityColumnInTable:() => cy.get('td a'),

        addUserBtn: () => cy.get('button[data-e2e=\'eui-button\'] > span').contains('Add user'),
        userInfoLabel: () => cy.get('eui-card-header-title').contains('USER INFO'),
        lastNameTxtBx: () => cy.get('input[placeholder=\'Last name\']'),
        firstNameTxtBx: () => cy.get('input[placeholder=\'First name\']'),
        emailTxtBx: () => cy.get('input[placeholder=\'Email\']'),
        userLoginTxtBx: () => cy.get('input[placeholder=\'User login\']'),
        searchEntityTxtBx: () => cy.get('input[placeholder=\'Search by entity name\']'),
        selectEntityDropDown: () => cy.get('select.entities-select:not(.ng-star-inserted)'),
        angleLeftBtn: () => cy.get('span.eui-icon-angle-left'),
        //angleRightBtn: () => cy.get('span.eui-icon-angle-right'),
        saveBtn: () => cy.get('span').contains('Save'),
        newUserorEntityDialogBxTitle: () => cy.get('#headerTitle'),
        newUserorEntityCreationMessageLocator: () => cy.get('#containerConfigId'),
        newUserorEntityDialogBxOkBtn: () => cy.get('button.eui-dialog__footer-accept-button').contains('OK'),
        searchUsersTxtBx: () => cy.get('input[placeholder=\'Search by user name, login or email\']'),
        searchIconBtn: () => cy.get('eui-icon-svg[icon=\'eui-search\']'),
        userLoginColumnInTable: () => cy.get('tr td:nth-child(3)'),
    }

    selectManageEntitiesTab(){
        this.elements.manageEntitiesTab().click()
    }

    clickAddEntityButton(){
        this.elements.addEntityBtn().click()
    }

    fillEntityInfoDetails(entityName){
        this.elements.entityNameTxtBx().clear().type(entityName)
    }

    saveEntityForm(){
        this.elements.saveBtn().click()
    }

    confirmNewEntityCreationDialogBox(){
        this.elements.newUserorEntityDialogBxOkBtn().click()
    }

    searchNewEntity(entityName){
        this.elements.searchEntityTxtBx().type(entityName)
        this.elements.searchIconBtn().click()
    }

    clickAddUserButton(){
        this.elements.addUserBtn().click()
    }

    fillUserInfoSection(user)
    {
        this.enterLastName(user.lastName)
        this.enterFirstName(user.firstName)
        this.enterEmail(user.email)
        this.enterUserLogin(user.userLogin)
    }

    enterLastName(lastname) {
        this.elements.lastNameTxtBx().type(lastname, { parseSpecialCharSequences: false })
    }

    enterFirstName(firstname) {
        this.elements.firstNameTxtBx().type(firstname, { parseSpecialCharSequences: false })
    }

    enterEmail(email)
    {
        this.elements.emailTxtBx().type(email, { parseSpecialCharSequences: false })
    }

    enterUserLogin(userLogin)
    {
        this.elements.userLoginTxtBx().type(userLogin, { parseSpecialCharSequences: false })
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
        this.elements.saveBtn().click()
    }

    fillUserInfoSectionExcept(user, missingField)
    {
        if (missingField !== 'firstName') this.enterFirstName(user.firstName)
        if (missingField !== 'lastName') this.enterLastName(user.lastName)
        if (missingField !== 'email') this.enterEmail(user.email)
        if (missingField !== 'userLogin') this.enterUserLogin(user.userLogin)
    }

    fillUserInfoSectionWithInvalidData(user, field, invalidValue)
    {
        this.enterFirstName(field === 'firstName' ? invalidValue : user.firstName)
        this.enterLastName(field === 'lastName' ? invalidValue : user.lastName)
        this.enterEmail(field === 'email' ? invalidValue : user.email)
        this.enterUserLogin(field === 'userLogin' ? invalidValue : user.userLogin)
    }

    confirmNewUserCreationDialogBox(){
        this.elements.newUserorEntityDialogBxOkBtn().click()
    }

    searchNewUserLogin(userLogin) {
        this.elements.searchUsersTxtBx().type(userLogin)
        this.elements.searchIconBtn().click()
    }

}
export default new userEntityManagementPage;
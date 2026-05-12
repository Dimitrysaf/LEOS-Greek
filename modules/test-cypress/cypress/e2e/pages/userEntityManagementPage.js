class userEntityManagementPage {
    errorMessages = {
        userCreationError: 'There are errors in the form. Please fill-in all highlighted fields correctly and try again.',
        entityUpdateError: 'There are errors in the form. Please fill-in all highlighted fields correctly and try again.',
        userDeletionWithEntitiesError: 'The user cannot be deleted, because there are entities associated with her/him. Edit the user to remove the association(s) and then try again.'
    }

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
        removeEntityDropDown: () => cy.get('select.ng-star-inserted'),
        userEntityCell: (entityName) => cy.get(`td.entity-name-cell:contains("${entityName}")`),
        angleLeftBtn: () => cy.get('span.eui-icon-angle-left'),
        angleRightBtn: () => cy.get('span.eui-icon-angle-right'),
        saveBtn: () => cy.get('span').contains('Save'),
        newUserorEntityDialogBxTitle: () => cy.get('#headerTitle'),
        newUserorEntityCreationMessageLocator: () => cy.get('#containerConfigId'),
        searchUsersTxtBx: () => cy.get('input[placeholder=\'Search by user name, login or email\']'),
        searchIconBtn: () => cy.get('eui-icon-svg[icon=\'eui-search\']'),
        firstNameColumnInTable: () => cy.get('tr td:nth-child(1)'),
        lastNameColumnInTable: () => cy.get('tr td:nth-child(2)'),
        userLoginColumnInTable: () => cy.get('tr td:nth-child(3)'),
        userDeleteBtnInTable: () => cy.get('tr td:nth-of-type(5) > a > eui-icon-svg'),
        editBtn: () => cy.get('span').contains('Edit'),
        readOnlyEmailTxtBx: () => cy.get('input[formcontrolname=\'email\']')
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

    searchNewEntity(entityName){
        this.elements.searchEntityTxtBx().clear().type(entityName)
        this.elements.searchIconBtn().click()
    }

    clickEntityInTable(entityName) {
        this.elements.entityColumnInTable().contains(entityName).click()
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
        this.elements.lastNameTxtBx().clear().type(lastname, { parseSpecialCharSequences: false })
    }

    enterFirstName(firstname) {
        this.elements.firstNameTxtBx().clear().type(firstname, { parseSpecialCharSequences: false })
    }

    enterEmail(email)
    {
        this.elements.emailTxtBx().clear().type(email, { parseSpecialCharSequences: false })
    }

    enterUserLogin(userLogin)
    {
        this.elements.userLoginTxtBx().clear().type(userLogin, { parseSpecialCharSequences: false })
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

    clearField(field)
    {
        const fieldMap = {
            firstName: this.elements.firstNameTxtBx,
            lastName: this.elements.lastNameTxtBx,
            email: this.elements.emailTxtBx,
            userLogin: this.elements.userLoginTxtBx
        }
        fieldMap[field]().clear()
    }

    fillUserInfoSectionWithInvalidData(user, field, invalidValue)
    {
        this.enterFirstName(field === 'firstName' ? invalidValue : user.firstName)
        this.enterLastName(field === 'lastName' ? invalidValue : user.lastName)
        this.enterEmail(field === 'email' ? invalidValue : user.email)
        this.enterUserLogin(field === 'userLogin' ? invalidValue : user.userLogin)
    }

    searchNewUserLogin(userLogin) {
        this.elements.searchUsersTxtBx().clear().type(userLogin)
        this.elements.searchIconBtn().click()
    }

    clickUserLoginInTable(userLogin) {
        this.elements.userLoginColumnInTable().contains(userLogin).click()
    }

    clickEditButton() {
        this.elements.editBtn().click()
    }

    updateUserInfoDetails(user) {
        this.enterFirstName(user.firstName)
        this.enterLastName(user.lastName)
        this.enterEmail(user.email)
    }

    clickDeleteButtonForUser() {
        this.elements.userDeleteBtnInTable().first().click({force:true})
    }

    selectEntityToRemove(entity) {
        this.elements.userEntityCell(entity).click();
    }

    removeEntity() {
        this.elements.angleRightBtn().click()
    }

}
export default new userEntityManagementPage;
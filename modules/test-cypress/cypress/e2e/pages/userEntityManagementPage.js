class userEntityManagementPage {
    errorMessages = {
        formValidationError: 'There are errors in the form. Please fill-in all highlighted fields correctly and try again.',
        userDeletionWithEntitiesError: 'The user cannot be deleted, because there are entities associated with her/him. Edit the user to remove the association(s) and then try again.',
        entityDeletionWithUsersError: 'This entity has users associated with it. Edit each of them to remove the association and then try again.'
    }

    elements = {
        tableRows: () => cy.get('tr'),
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
        firstNameColumnInTable: () => this.elements.tableRows().find('td:nth-child(1)'),
        lastNameColumnInTable: () => this.elements.tableRows().find('td:nth-child(2)'),
        userLoginColumnInTable: () => this.elements.tableRows().find('td:nth-child(3)'),
        userDeleteBtnInTable: () => this.elements.tableRows().find('td:nth-of-type(5) > a > eui-icon-svg'),
        editBtn: () => cy.get('span').contains('Edit'),
        deleteEntityBtn: () => cy.get('.eui-icon.eui-icon-delete'),
        readOnlyEmailTxtBx: () => cy.get('input[formcontrolname=\'email\']'),
        comrefTextToolTip: () => cy.get("[data-e2e='eui-tooltip']"),
        comrefTextInTable: (text) => this.elements.tableRows().find('td:nth-child(5)').contains(text)
    }

    selectManageEntitiesTab(){
        this.elements.manageEntitiesTab().click()
    }

    clickAddEntityButton(){
        this.elements.addEntityBtn().click()
    }

    fillEntityInfoDetails(entityName){
        this.elements.entityNameTxtBx().invoke('val', entityName).trigger('input').trigger('change')
    }

    searchNewEntity(entityName){
        this.elements.searchEntityTxtBx().invoke('val', entityName).trigger('input').trigger('change')
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
        this.elements.lastNameTxtBx().invoke('val', lastname).trigger('input').trigger('change')
    }

    enterFirstName(firstname) {
        this.elements.firstNameTxtBx().invoke('val', firstname).trigger('input').trigger('change')
    }

    enterEmail(email)
    {
        this.elements.emailTxtBx().invoke('val', email).trigger('input').trigger('change')
    }

    enterUserLogin(userLogin)
    {
        this.elements.userLoginTxtBx().invoke('val', userLogin).trigger('input').trigger('change')
    }

    searchEntity(entity)
    {
        this.elements.searchEntityTxtBx().invoke('val', entity).trigger('input').trigger('change')
    }

    selectEntity(entity)
    {
        this.elements.selectEntityDropDown().select(entity)
    }

    assignEntity()
    {
        this.elements.angleLeftBtn().click()
    }

    clickSaveButton()
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
        this.elements.searchUsersTxtBx().invoke('val', userLogin).trigger('input').trigger('change')
        this.elements.searchIconBtn().click()
    }

    clickUserLoginInTable(userLogin) {
        this.elements.userLoginColumnInTable().contains(userLogin).click()
    }

    clickEditButton() {
        this.elements.editBtn().click()
    }

    clickDeleteEntityButton() {
        this.elements.deleteEntityBtn().click()
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

    clickUserLoginInComrefRow(userLogin) {
        this.elements.tableRows().filter(':contains("COMREF")').find('td:nth-child(3)').contains(userLogin).click()
    }

}
export default new userEntityManagementPage;
class collaboratorsTab {
    elements = {
        appProposalCollaborators: () => cy.get('app-proposal-collaborators'),
        addBtn: () => this.elements.appProposalCollaborators().find('button').contains('Add'),
        inputName: () => cy.get('#bodyTemplatePortalId .eui-autocomplete__input-container input'),
        addUsersBtn: () => cy.get('button').contains('Add users'),
        collaboratorsTable: () => this.elements.appProposalCollaborators().find('table'),
        userList: () => cy.get("div[role='listbox'] eui-autocomplete-option"),
        role: () => cy.get('#role')
    }

    clickAddBtn(){
        this.elements.addBtn().click();
    }

    typeName(name){
        this.elements.inputName().type(name);
    }

    clickAddUsersBtn(){
        this.elements.addUsersBtn().click();
    }

    getNameFromCollaboratorsTable(row) {
        return this.elements.collaboratorsTable().find('tbody').find('tr').eq(row-1).find('td').eq(0);
    }

    getRoleFromCollaboratorsTable(row) {
        return this.elements.collaboratorsTable().find('tbody').find('tr').eq(row-1).find('td').eq(2);
    }

    clickUser(row) {
        this.elements.userList().eq(row-1).click();
    }

    selectRole(role){
        return this.elements.role().select(role);
    }
}
export default new collaboratorsTab();
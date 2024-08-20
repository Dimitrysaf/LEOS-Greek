class authorialNoteTable {
    elements = {
        authorialNoteTable: () => cy.get('.leos-authnote-table'),
        authNote: () => this.elements.authorialNoteTable().find('.leos-authnote')
    }

    getAuthNote(markerNumber){
        return this.elements.authNote().find('marker').eq(markerNumber-1);
    }

    clickAuthNote(markerNumber){
        this.getAuthNote(markerNumber).click();
    }
}
export default new authorialNoteTable();
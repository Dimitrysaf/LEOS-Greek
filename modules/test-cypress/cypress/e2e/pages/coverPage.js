class coverPage {
    elements = {
        coverPage: () => cy.get('coverpage'),
        longTitle: () => this.elements.coverPage().find('longtitle'),
        docPurpose: () => this.elements.longTitle().find('docpurpose'),
        closeBtn: () => cy.contains('Close'),
    }

    clickDocPurpose(){
        this.elements.docPurpose().click();
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
    }
}
export default new coverPage();
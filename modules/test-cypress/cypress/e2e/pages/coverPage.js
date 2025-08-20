class coverPage {
    elements = {
        coverPage: () => cy.get('coverpage'),
        longTitle: () => this.elements.coverPage().find('longtitle'),
        docPurpose: () => this.elements.longTitle().find('docpurpose'),
        closeBtn: () => cy.contains('Close'),
    }

    clickDocPurpose(){
        this.elements.docPurpose().realClick({ position: "center" });
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
    }

    clickEditIconOfDocPurpose() {
        this.elements.docPurpose().invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').realHover({ position: "top" }).find("span[data-widget-type='edit']").click({ force: true }));
    }
}
export default new coverPage();
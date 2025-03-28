class expMemoPage {
    elements = {
        closeBtn: () => cy.contains('Close'),
        documentContainer: () => cy.get('#docContainer'),
        guidanceBlock: () => cy.get('.guidance-green-block')
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
    }

    mouseHoverAndClickOnBlockContainer(blockContainerNumber){
        cy.xpath("//mainbody//blockcontainer[" + blockContainerNumber + "]").invoke('attr', 'id').then(id => cy.get("#" + id).realHover().click({ force: true }));
    }
}
export default new expMemoPage();
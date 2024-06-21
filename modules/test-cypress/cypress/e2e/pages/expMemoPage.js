import headerPage from './headerPage';

class expMemoPage extends headerPage{
    elements = {
        closeBtn: () => cy.contains('Close'),
        documentContainer: () => cy.get('#docContainer'),
        guidanceBlock: () => cy.get('.guidance-green-block')
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
    }
}
export default new expMemoPage();
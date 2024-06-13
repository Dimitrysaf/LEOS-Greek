import headerPage from './headerPage';
class coverPage extends headerPage {
    elements = {
        coverpage: () => cy.get('coverpage'),
        longtitle: () => this.elements.coverpage().find('longtitle'),
        docpurpose: () => this.elements.longtitle().find('docpurpose'),
        closeBtn: () => cy.contains('Close'),
    }

    clickDocPurpose(){
        this.elements.docpurpose().click();
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
    }
}
export default new coverPage();
import headerPage from './headerPage';

class repositoryBrowserPage extends headerPage {
    elements = {
        proposalTable: () => cy.get('app-proposal-item'),
        createProposalBtn: () => cy.contains('Create Proposal'),
        uploadBtn: () => cy.contains('Upload')
    }

    clickCreateProposalBtn(){
        this.elements.createProposalBtn().click();
    }

    clickUploadBtn(){
        this.elements.uploadBtn().click();
    }
}
export default new repositoryBrowserPage();
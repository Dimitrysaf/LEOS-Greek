import headerPage from './headerPage';

class repositoryBrowserPage extends headerPage {
    elements = {
        proposalTable: () => cy.get('app-proposal-item'),
        createProposalBtn: () => cy.contains('Create Proposal')
    }

    clickCreateProposalBtn(){
        this.elements.createProposalBtn().click();
    }
}
export default new repositoryBrowserPage();
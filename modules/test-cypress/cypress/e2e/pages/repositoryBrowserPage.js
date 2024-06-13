import headerPage from './headerPage';

class repositoryBrowserPage extends headerPage {
    elements = {
        proposalTable: () => cy.get('app-proposal-item a'),//cy.get('eui-card-header-title')
        createProposalBtn: () => cy.contains('Create Proposal'),
        uploadBtn: () => cy.contains('Upload'),
        searchFilterInputBtn: () => cy.get("input[placeholder='Search for a proposal']"),
    }

    clickCreateProposalBtn() {
        this.elements.createProposalBtn().click();
    }

    clickUploadBtn() {
        this.elements.uploadBtn().click();
    }

    openFirstProposal() {
        this.elements.proposalTable().first().click();
        cy.wait(1000);
    }

    clickOnNthProposal(proposalIndex) {
        this.elements.proposalList().each(($ele, index) => {
            if (index == proposalIndex) {
                cy.wrap($ele).click();
                cy.wait(1000);
            }
        })
    }

    getProposalCount(keyword) {
        this.enterSearchText(keyword);
        return this.elements.proposalTable().its('length');
    }

    enterSearchText(keyword) {
        this.elements.searchFilterInputBtn().invoke('show').type(keyword);
    }
}
export default new repositoryBrowserPage();
class repositoryBrowserPage {
    elements = {
        proposalTable: () => cy.get('app-proposal-item'),
        proposalLink: () => this.elements.proposalTable().find('a'),
        createProposalBtn: () => cy.contains('Create act'),
        uploadBtn: () => cy.contains('Upload act'),
        searchFilterInputBtn: () => cy.get("input[placeholder='Search for a proposal']"),
    }

    clickCreateProposalBtn() {
        this.elements.createProposalBtn().click();
    }

    clickUploadBtn() {
        this.elements.uploadBtn().click();
    }

    openFirstProposal() {
        this.elements.proposalLink().first().click();
        cy.wait(1000);
    }

    clickOnNthProposal(proposalIndex) {
        this.elements.proposalLink().each(($ele, index) => {
            if (index === proposalIndex-1) {
                cy.wrap($ele).click();
                cy.wait(500);
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

    getRightContentOfProposal(proposalIndex) {
        return this.elements.proposalTable().eq(proposalIndex-1).find('eui-card-header-right-content');
    }

    getNameOfProposal(proposalIndex) {
        return this.elements.proposalTable().eq(proposalIndex-1).find('eui-card-header-title');
    }
}
export default new repositoryBrowserPage();
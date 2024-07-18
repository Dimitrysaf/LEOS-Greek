class homePage {
    elements = {
        createProposalBtn: () => cy.contains('Create Proposal'),
        uploadBtn: () => cy.contains('Upload'),
        searchFilterInputBtn: () => cy.get("input[placeholder='Search for a proposal']"),
        euiLabel: () => cy.get("eui-label.hero-text"),
        viewAllActs: () => cy.contains("View all acts")
        
    }

    clickCreateProposalBtn() {
        this.elements.createProposalBtn().click();
    }

    clickUploadBtn() {
        this.elements.uploadBtn().click();
    }

    clickViewAllActs(){
        this.elements.viewAllActs().click();
    }
}
export default new homePage();
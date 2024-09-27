class homePage {
    elements = {
        //createProposalBtn: () => cy.contains('Create act'),
        //uploadBtn: () => cy.contains('Upload act'),
        //searchFilterInputBtn: () => cy.get("input[placeholder='Search for a proposal']"),
        euiLabel: () => cy.get("eui-label.hero-text"),
        viewAllActs: () => cy.contains("View all acts"),
        supportBtn: () => cy.get('.eui-button').contains('Support'),
        supportOptions: () => cy.get('div.eui-dropdown__panel-container a')
    }

/*    clickCreateProposalBtn() {
        this.elements.createProposalBtn().click();
    }

    clickUploadBtn() {
        this.elements.uploadBtn().click();
    }*/

    clickViewAllActs(){
        this.elements.viewAllActs().click();
    }

    clickSupportBtn(){
        this.elements.supportBtn().click();
    }
}
export default new homePage();
class homePage {
    elements = {
        //createProposalBtn: () => cy.contains('Create act'),
        //uploadBtn: () => cy.contains('Upload act'),
        //searchFilterInputBtn: () => cy.get("input[placeholder='Search for a proposal']"),
        euiLabel: () => cy.get("eui-label.hero-text"),
        viewAllActs: () => cy.contains("View all acts"),
        supportBtn: () => cy.get('.eui-button').contains('Support'),
        supportOptions: () => cy.get('div.eui-dropdown__panel-container a'),
        notificationIcon: () => cy.get("button[aria-label='Notifications']"),
        languageIcon: () => cy.get('button.eui-language-selector-button'),
        languageOptions: () => cy.get('.eui-language-selector-menu-language-item .eui-dropdown-item__content-text')
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

    clickNotificationIcon(){
        this.elements.notificationIcon().click();
    }

    clickLanguageIcon() {
        this.elements.languageIcon().click();
    }
}
export default new homePage();
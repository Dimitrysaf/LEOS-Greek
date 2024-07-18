class headerPage {
    elements = {
        homeBtn: () => cy.get('div.eui-toolbar__left a').contains('Home'),
        breadCrumbItem: () => cy.get('div.eui-breadcrumb__items button'),
        workspaceBreadCrumbItem: () => this.elements.breadCrumbItem().contains('Workspace'),
        // userProfileName: () => cy.get('div.eui-user-profile__infos-name'),
        // bellIcon: () => cy.get('button .eui-icon-bell'),
        // languageSelectorLink: () => cy.get('.eui-language-selector .eui-language-selector-link'),
        // supportDropDownBtn: () => cy.contains('Support'),
        // loadingIcon: () => cy.get('eui-block-document.eui-block-document--blocked'),
        // currentPage: () => cy.get('eui-breadcrumb eui-breadcrumb-item:last-child .eui-label')
    }

    getCurrentPageName(){
        return cy.get('eui-breadcrumb eui-breadcrumb-item:last-child .eui-label');
    }

    clickWorkspace(){
        this.elements.workspaceBreadCrumbItem().click();
    }

    getLoadingIcon(){
        return cy.get('eui-block-document.eui-block-document--blocked');
    }

    clickHomeBtn(){
        this.elements.homeBtn().click();
    }
}
export default new headerPage;
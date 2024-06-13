class headerPage {
    elements = {
        userProfileName: () => cy.get('div.eui-user-profile__infos-name'),
        bellIcon: () => cy.get('button .eui-icon-bell'),
        languageSelectorLink: () => cy.get('.eui-language-selector .eui-language-selector-link'),
        homeBtn: () => cy.contains('Home'),
        supportDropDownBtn: () => cy.contains('Support'),
        homeBtnBreadCrumbItem: () => cy.get('eui-breadcrumb eui-breadcrumb-item:first-child button'),
        workspaceBtnBreadCrumbItem: () => cy.get('eui-breadcrumb eui-breadcrumb-item:nth-child(2)'),
        loadingIcon: () => cy.get('eui-block-document.eui-block-document--blocked'),
        currentPage: () => cy.get('eui-breadcrumb eui-breadcrumb-item:last-child .eui-label')
    }

    getCurrentPageName(){
        return cy.get('eui-breadcrumb eui-breadcrumb-item:last-child .eui-label');
    }

    clickHomeBtn(){
        cy.contains('Home').click();
    }

    getLoadingIcon(){
        return cy.get('eui-block-document.eui-block-document--blocked');
    }
}
export default headerPage;
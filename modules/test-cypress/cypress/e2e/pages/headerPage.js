class headerPage {
    elements = {
        homeBtn: () => cy.get('div.eui-toolbar__left a').contains('Home'),
        breadCrumbItem: () => cy.get('div.eui-breadcrumb__items button'),
        actViewBreadCrumbItem: () => this.elements.breadCrumbItem().contains('Act View'),
        workspaceBreadCrumbItem: () => this.elements.breadCrumbItem().contains('Workspace'),
        homeLink: () => this.elements.breadCrumbItem().contains('Home'),
        breadCrumbItemLabel: () => cy.get('eui-breadcrumb eui-breadcrumb-item:last-child .eui-label'),
        loadingIcon: () => cy.get('eui-block-document.eui-block-document--blocked'),
        // userProfileName: () => cy.get('div.eui-user-profile__infos-name'),
        // bellIcon: () => cy.get('button .eui-icon-bell'),
        // languageSelectorLink: () => cy.get('.eui-language-selector .eui-language-selector-link'),
        // supportDropDownBtn: () => cy.contains('Support'),
        // currentPage: () => cy.get('eui-breadcrumb eui-breadcrumb-item:last-child .eui-label')
        documentVersionLabel: () => cy.get('div.eui-u-flex h5'),
    }

    getCurrentPageName(){
        cy.wait(1000);
        return this.elements.breadCrumbItemLabel();
    }

    clickActView(){
        this.elements.actViewBreadCrumbItem().click();
    }

    clickWorkspace(){
        this.elements.workspaceBreadCrumbItem().click();
    }

    clickHomeLink(){
        this.elements.homeLink().click();
    }

    getLoadingIcon(){
        return this.elements.loadingIcon();
    }

    clickHomeBtn(){
        this.elements.homeBtn().click();
    }
}
export default new headerPage;
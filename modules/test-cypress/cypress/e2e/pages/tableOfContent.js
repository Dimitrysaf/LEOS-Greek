class tableOfContent {
    elements = {
        editBtn: () => cy.get("*[icon='eui-ecl-edit']"),
        saveBtn: () => cy.get("button img[src='assets/images/toc-save.png']"),
        saveCloseBtn: () => cy.get("button img[src='assets/images/toc-save-close.png']"),
        cancelBtn: () => cy.get("*[icon='eui-close']"),
        menuOptions: () => cy.get('div.eui-list-item__container span'),
        contributionsPaneAccordion: () => cy.get('eui-page-column-body eui-fieldset').eq(2).find('.eui-fieldset__header button'),
        versionsPaneAccordion: () => cy.get('eui-page-column-body eui-fieldset').eq(1).find('.eui-fieldset__header button'),
        navigationPaneAccordion: () => cy.get('eui-page-column-body eui-fieldset').first().find('.eui-fieldset__header button'),
        navigationPaneExpanded: () => cy.get("button[aria-label='Collapse Navigation Pane']"),
        navigationPaneMinimized: () => cy.get("button[aria-label='Expand Navigation Pane']"),
        compareBtn: () => cy.get("button[title='Compare versions']"),
        searchBtn: () => cy.get("button[title='Show search bar']"),
        recentChangesVersionCardContent: () => cy.get('app-versions-pane-group eui-card').first().find('eui-card-content'),
        recentChangesVersionCardSubTitle: () => cy.get('app-versions-pane-group eui-card').first().find('.eui-card-header__title-container-subtitle'),
        lastVersionCardHeaderTitle: () => cy.get('app-versions-pane-group eui-card').last().find('.eui-card-header__title-container-title'),
        nestedTreeNode: () => cy.get('mat-nested-tree-node.mat-nested-tree-node'),
        changeTypeBtn: () => cy.get("button[aria-label='Change Type']"),
        definitionArticleTypeBtn: () => cy.get("button[aria-label='Definition']"),
        regularArticleTypeBtn: () => cy.get("button[aria-label='Regular']"),
        matTree: () => cy.get('mat-tree.mat-tree'),
        versionPaneCard: () => cy.get('.version-panes.eui-card'),
        cardTitle: () => this.elements.versionPaneCard().find('eui-card-header-title'),
        recentChangesCard: () => this.elements.cardTitle().contains('Recent changes').closest('eui-card.version-panes'),
        cardContentOfRecentChanges: () => this.elements.recentChangesCard().find('eui-card-content'),
        subVersion: () => this.elements.cardContentOfRecentChanges().find('div.subversion'),
        subVersionTitle: () => this.elements.subVersion().find('.title'),
        nodeLabel: () => cy.get(".mat-tree-node div.label[id^='node-label'], .mat-tree-node div.label-extended[id^='node-label']"),
        preambleLink: () => this.elements.nestedTreeNode().contains('Preamble').closest('div.mat-tree-node'),
        elementList: () => cy.get("ul[cdkdroplistconnectedto='tree'] li.eui-list-item"),
        labelExtended: () => cy.get(".label-extended").closest('mat-nested-tree-node'),
        revertToThisVersionBtn: () => cy.get("button").contains('Revert to this version'),
        dropdownContent: () => cy.get('eui-dropdown-content .eui-u-flex-align-items-start'),
        dropdownItemContentTextList: () => this.elements.dropdownContent().find('button .eui-dropdown-item__content-text'),
        contributionCard: () => cy.get('eui-card.revisions-pane').eq(0),
        euiLabelSuccess: () => cy.get('span.eui-label--success'),
        euiLabelDanger: () => cy.get('span.eui-label--danger')
    }

    clickContributionsPaneButton(){
        this.elements.contributionsPaneAccordion().click();
    }

    clickFirstContribution(){
        this.elements.contributionCard().click();

    }

    clickEditBtn(){
        this.elements.editBtn().click();
        cy.wait(500);
    }

    clickSaveBtn(){
        this.elements.saveBtn().click();
    }

    clickSaveCloseBtn(){
        this.elements.saveCloseBtn().click();
    }

    clickCancelBtn(){
        this.elements.cancelBtn().click();
    }

    clickVersionsPaneButton(){
        this.elements.versionsPaneAccordion().click();
    }

    clickNavigationPaneAccordian(){
        this.elements.navigationPaneAccordion().click();
    }

    clickFirstNestedTreeNode(){
        this.elements.nestedTreeNode().first().click();
    }

    getLatestRecentVersionCardContent(){
        return this.elements.recentChangesVersionCardContent().find('.subversion').first();
    }

    mouseHoverOnChangeTypeBtn(){
        this.elements.changeTypeBtn().realHover({ pointer: "mouse", position: "center" });
    }

    clickDefinitionArticleTypeBtn(){
        this.elements.definitionArticleTypeBtn().click();
    }

    clickRegularArticleTypeBtn(){
        this.elements.regularArticleTypeBtn().click();
    }

    clickThreeDotsOfTOCElement(ngContent){
        this.elements.matTree().contains(ngContent).parent().find("button *[icon='eui-ellipsis-vertical']").realHover().click();
    }

    clickShowMoreBtn(euiCardName){
        this.elements.cardTitle().contains(euiCardName).closest('eui-card.version-panes').find('button').click();
    }

    clickLinkInNavigationPane(link){
        this.elements.nodeLabel().contains(link).click();
    }

    clickRightAngleIconOfPreambleLink(){
        this.elements.preambleLink().find("eui-icon-svg[icon='eui-chevron-forward']").click();
    }

    getLabelExtended(){
        return this.elements.labelExtended();
    }

    clickRevertToThisVersion() {
        this.elements.revertToThisVersionBtn().click();
    }

    clickThreeDotsOfCardHeader(headerTitle) {
        this.elements.cardTitle().contains(headerTitle).closest('eui-card-header').find('button eui-icon-svg').click();
    }

    getNodeLabelText(label){
        return this.elements.nodeLabel().contains(label);
    }

    getCloseLiOfNodeLabel(label){
        return this.elements.nodeLabel().contains(label).closest('li');
    }

    getSubVersion(subVersionNumber) {
        return this.elements.subVersion().eq(subVersionNumber-1);
    }
}
export default new tableOfContent();
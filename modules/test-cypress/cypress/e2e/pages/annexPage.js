class annexPage {
    elements = {
        containerBlockNum: () => cy.get("container[name='headerOfAnnex'] block[name='num']"),
        prefaceContainerBlockHeading: () => cy.get("container[name='headerOfAnnex'] block[name='heading']"),
        closeBtn: () => cy.xpath("//button[text()='Close']"),
        level: () => cy.xpath("//level")
    }

    clickCloseBtn() {
        this.elements.closeBtn().click();
        cy.wait(500);
    }

    mouseHoverAndClickOnLevel(levelNumber) {
        cy.xpath("//level[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().click({ force: true }));
    }

    clickEditIconOfLevel(levelNumber) {
        cy.xpath("//level[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(5000).find("span[data-widget-type='edit']").click({force:true}));
    }

    clickInsertBeforeIconOfLevel(levelNumber) {
        cy.xpath("//level[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(5000).find("span[data-widget-type='insert.before']").click({force:true}));
    }

    clickDeleteIconOfLevel(levelNumber) {
        cy.xpath("//level[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(5000).find("span[data-widget-type='delete']").click({force:true}));
    }

    getContentOfAnnex(levelNumber) {
        return cy.xpath("//level[" + levelNumber + "]//content//aknp");
    }
}
export default new annexPage();
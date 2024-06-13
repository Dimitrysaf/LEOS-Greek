import headerPage from './headerPage';
class annexPage extends headerPage {
    elements = {
        containerBlockNum: () => cy.get("container[name='headerOfAnnex'] block[name='num']"),
        prefaceContainerBlockHeading: () => cy.get("container[name='headerOfAnnex'] block[name='heading']"),
        closeBtn: () => cy.get("button").contains('Close'),
        level: () => cy.xpath("//level")
    }

    clickLongTitle() {
        this.elements.longTitle().click();
    }

    clickCloseBtn() {
        this.elements.closeBtn().realHover().click('center', { force: true });
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

    clickInsertAfterIconOfLevel(levelNumber) {
        cy.xpath("//level[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(5000).find("span[data-widget-type='insert.after']").click({force:true}));
    }

    clickDeleteIconOfLevel(levelNumber) {
        cy.xpath("//level[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(5000).find("span[data-widget-type='delete']").click({force:true}));
    }

    getContentOfAnnex(levelNumber) {
        return cy.xpath("//level[" + levelNumber + "]//content//aknp");
    }
}
export default new annexPage();
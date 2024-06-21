import headerPage from './headerPage';

class financialStatementPage extends headerPage{
    elements = {
        closeBtn: () => cy.xpath("//button[text()='Close']"),
        doctype: () => cy.get("doctype[refersto='~_STAT_FINANC_LEGIS']")
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
    }

    mouseHoverAndClickOnLevel(levelNumber){
        cy.xpath("//mainbody//level[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().click({ force: true }));
    }

    getLevel(levelNumber){
        return cy.xpath("//mainbody//level[" + levelNumber + "]");
    }
    getContentOfLevel(levelNumber) {
        return this.getLevel(levelNumber).find('content aknp');
    }

    getSubparagraphOfLevel(subparagraphNumber, levelNumber) {
        return this.getLevel(levelNumber).find('subparagraph').eq(subparagraphNumber-1);
    }

    getContentOfSubparagraphOfLevel(subparagraphNumber, levelNumber) {
        return this.getSubparagraphOfLevel(subparagraphNumber, levelNumber) .find('content aknp');
    }

    clickEditIconOfLevel(levelNumber) {
        this.getLevel(levelNumber).realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(2000).find("span[data-widget-type='edit']").click({force:true}));
    }
}
export default new financialStatementPage();
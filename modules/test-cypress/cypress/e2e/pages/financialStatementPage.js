class financialStatementPage {
    elements = {
        closeBtn: () => cy.xpath("//button[text()='Close']"),
        doctype: () => cy.get("docType[refersTo='~STAT_FINANC_LEGIS']"),
        repeatedSubparagraph: () => cy.get('subparagraph[leos\\:repeated="true"]'),
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
    }

    mouseHoverAndClickOnLevel(levelNumber){
        cy.xpath("//mainbody//level[" + levelNumber + "]").invoke('attr', 'id').then(id => cy.get("#" + id).realHover().click({ force: true }));
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

    duplicateRepeatableSubparagraph() {
        cy.get('subparagraph[leos\\:repeatable="true"]').first().invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='insert.after']").click({ force: true }).wait(500));
    }

    deleteRepeatedSubparagraph() {
        cy.get('subparagraph[leos\\:repeated="true"]').first().invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='delete']").click({ force: true }).wait(500));
    }
}
export default new financialStatementPage();
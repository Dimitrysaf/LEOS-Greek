class financialStatementPage {
    elements = {
        closeBtn: () => cy.xpath("//button[text()='Close']"),
        doctype: () => cy.get("docType[refersTo='~STAT_DIGIT_FINANC_LEGIS']"),
        repeatableSubparagraph: () => cy.get('subparagraph[leos\\:repeatable="true"]'),
        repeatedSubparagraph: () => cy.get('subparagraph[leos\\:repeated="true"]'),
        repeatableSubparagraphGroup: () => cy.get('subparagraph[leos\\:repeatable="true"][leos\\:group="2"]'),
        repeatedSubparagraphGroupAfter: () => cy.get('subparagraph[leos\\:repeated="true"][leos\\:group="3"]'),
        repeatedSubparagraphGroupBefore: () => cy.get('subparagraph[leos\\:repeated="true"][leos\\:group="4"]'),
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
    }

    mouseHoverAndClickOnLevel(levelNumber){
        cy.xpath("//mainbody//level[" + levelNumber + "]").invoke('attr', 'id').then(id => cy.get("#" + id).realHover().click({ force: true }));
    }

    getLevel(levelNumber){
        return cy.xpath("(//mainbody//level)[" + levelNumber + "]");
    }

    getLandscapeLevel(levelNumber){
        return cy.get('mainbody div.landscape level');
    }

    getContentOfLevel(levelNumber) {
        return this.getLevel(levelNumber).find('content aknp');
    }

    getMRefTextFromContentOfLevel(mReferenceNumber, levelNumber){
        return this.getContentOfLevel(levelNumber).find('mref').eq(mReferenceNumber-1);
    }

    getSubparagraphOfLevel(subparagraphNumber, levelNumber) {
        return this.getLevel(levelNumber).find('subparagraph').eq(subparagraphNumber-1);
    }

    getSubparagraphOfLandscapeLevel(subparagraphNumber, levelNumber) {
        return this.getLandscapeLevel(levelNumber).find('subparagraph').eq(subparagraphNumber-1);
    }

    getContentOfSubparagraphOfLevel(subparagraphNumber, levelNumber) {
        return this.getSubparagraphOfLevel(subparagraphNumber, levelNumber) .find('content aknp');
    }

    clickEditIconOfLevel(levelNumber) {
        this.getLevel(levelNumber).realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(2000).find("span[data-widget-type='edit']").click({force:true}));
    }

    clickEditIconOfSubparagraphOfLandscapeLevel(subparagraphNumber, levelNumber) {
        this.getSubparagraphOfLandscapeLevel(subparagraphNumber, levelNumber).realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(2000).find("span[data-widget-type='edit']").click({force: true}));
    }

    duplicateRepeatableSubparagraph() {
        this.elements.repeatableSubparagraph().first().invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='insert.after']").click({ force: true }).wait(500));
    }

    deleteRepeatedSubparagraph() {
        this.elements.repeatedSubparagraph().first().invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='delete']").click({ force: true }).wait(500));
    }

    duplicateRepeatableSubparagraphGroupAfter() {
        this.elements.repeatableSubparagraphGroup().first().invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='insert.group.after']").click({ force: true }).wait(500));
    }

    duplicateRepeatableSubparagraphGroupBefore() {
        this.elements.repeatableSubparagraphGroup().first().invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='insert.group.before']").click({ force: true }).wait(500));
    }

    getRowFromTableOfSubparagraphFromLevel(subparagraphNumber, levelNumber) {
        return this.getSubparagraphFromLevel(subparagraphNumber, levelNumber).find('table tbody tr');
    }

    getColumnFromTableOfSubparagraphFromLevel(subparagraphNumber, levelNumber) {
        return this.getSubparagraphFromLevel(subparagraphNumber,  levelNumber).find('table tbody tr').eq(0).find('td');
    }

    getSubparagraphFromLevel(subparagraphNumber, levelNumber) {
        return this.getLevel(levelNumber).children('subparagraph').eq(subparagraphNumber-1);
    }
}
export default new financialStatementPage();
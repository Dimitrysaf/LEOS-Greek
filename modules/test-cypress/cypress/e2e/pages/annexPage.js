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
        cy.xpath("//level[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(1000).find("span[data-widget-type='edit']").click({force:true}));
    }

    clickInsertBeforeIconOfLevel(levelNumber) {
        cy.xpath("//level[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(1000).find("span[data-widget-type='insert.before']").click({force:true}));
    }

    clickInsertAfterIconOfLevel(levelNumber) {
        cy.xpath("//level[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(1000).find("span[data-widget-type='insert.after']").click({force:true}));
    }

    clickDeleteIconOfLevel(levelNumber) {
        cy.xpath("//level[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(1000).find("span[data-widget-type='delete']").click({force:true}));
    }

    mouseHoverAndClickOnParagraph(paragraphNumber) {
        cy.xpath("//paragraph[" + paragraphNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().click({ force: true }));
    }

    getContentOfAnnex(levelNumber) {
        return cy.xpath("//level[" + levelNumber + "]//content//aknp");
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

    getLevel(levelNumber) {
        return this.elements.level().eq(levelNumber-1);
    }

    getAuthorialNoteWithMarkerNumberFromLevel(levelNumber, markerNumber) {
        return this.getLevel(levelNumber).find("authorialnote[marker='"+markerNumber+"']");
    }

    clickAuthorialNoteWithMarkerNumberFromLevel(levelNumber, markerNumber) {
        this.getAuthorialNoteWithMarkerNumberFromLevel(levelNumber, markerNumber).click();
    }

    getMRefTextFromLevel(mReferenceNumber,levelNumber){
        return this.getLevel(levelNumber).find('mref').eq(mReferenceNumber-1);
    }

    clickRefOfMRefOfLevel(mReferenceNumber, levelNumber){
        this.getLevel(levelNumber).find('mref').eq(mReferenceNumber-1).find('ref').click();
    }

    getImageOfLevel(levelNumber){
        return this.getLevel(levelNumber).find('img');
    }

    getNumOfLevel(levelNumber) {
        return this.getLevel(levelNumber).children('num');
    }

    getSoftMoveLabelOfNumOfLevel(levelNumber) {
        return this.getNumOfLevel(levelNumber).children('span.leos-soft-move-label');
    }

    rightClickOnSoftMoveLabelOfNumOfLevel(levelNumber) {
        this.getSoftMoveLabelOfNumOfLevel(levelNumber).rightclick();
    }
}
export default new annexPage();
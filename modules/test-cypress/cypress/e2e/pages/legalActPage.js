class legalActPage {
    elements = {
        closeBtn: () => cy.contains('Close'),
        ribbonToolBar: () => cy.get('app-ribbon-toolbar-container'),
        bill: () => cy.get('bill'),
        preface: () => this.elements.bill().find('preface'),
        longTitle: () => this.elements.preface().find('longtitle'),
        docPurpose: () => this.elements.longTitle().find('docpurpose'),
        recitalFromImportOj: () => cy.get("recital[id^='impXrec']"),
        articleFromImportOj: () => cy.get("article[id^='impXart']")
    }

    clickCloseBtn() {
        this.elements.closeBtn().click();
    }

    getAllParagraphFromArticle(articleNumber) {
        return this.getArticle(articleNumber).find('paragraph');
    }

    getCitation(citationNumber) {
        return cy.xpath("//citation[" + citationNumber + "]");
    }

    getRecital(recitalNumber) {
        return cy.xpath("//recital[" + recitalNumber + "]");
    }

    getArticle(articleNumber) {
        return cy.get('article').eq(articleNumber-1);
    }

    getNumTagOfArticle(articleNumber) {
        return this.getArticle(articleNumber).find('num');
    }

    getChapter(chapterNumber) {
        return cy.get('chapter').eq(chapterNumber-1);
    }

    getNumTagOfChapter(chapterNumber) {
        return this.getChapter(chapterNumber).find('num');
    }

    mouseHoverAndClickOnArticle(articleNumber) {
        this.getArticle(articleNumber).invoke('attr', 'id').then(id => cy.get("#" + id).realHover({ position: "top" }).realClick({ position: "topLeft" }));
    }

    mouseHoverAndClickOnCitation(citationNumber) {
        cy.xpath("//citation[" + citationNumber + "]").realHover({ position: "top" }).invoke('attr', 'id').then(id => cy.get("#" + id).realHover({ position: "top" }).realClick({ position: "topLeft" }));
    }

    mouseHoverAndClickOnRecital(recitalNumber) {
        cy.xpath("//recital[" + recitalNumber + "]").realHover({ position: "top" }).invoke('attr', 'id').then(id => cy.get("#" + id).realHover({ position: "top" }).click({ force: true }));
    }

    getMRefTextFromCitation(mReferenceNumber,citationNumber){
        return this.getCitation(citationNumber).find('mref').eq(mReferenceNumber-1);
    }

    getMRefTextFromRecital(mReferenceNumber,recitalNumber){
        return this.getRecital(recitalNumber).find('mref').eq(mReferenceNumber-1);
    }

    getMRefTextFromPointOfParagraphOfArticle(mReferenceNumber, pointNumber, listNumber, paragraphNumber, articleNumber){
        return this.getContentOfPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).find('mref').eq(mReferenceNumber-1);
    }

    getMRefTextFromParagraphOfArticle(mReferenceNumber, paragraphNumber, articleNumber){
        return this.getContentOfParagraphFromArticle(paragraphNumber, articleNumber).find('mref').eq(mReferenceNumber-1);
    }

    clickRefOfMRefOfCitation(mReferenceNumber, citationNumber){
        this.getCitation(citationNumber).find('mref').eq(mReferenceNumber-1).find('ref').click();
    }

    clickRefOfMRefOfRecital(mReferenceNumber, recitalNumber){
        this.getRecital(recitalNumber).find('mref').eq(mReferenceNumber-1).find('ref').click();
    }

    clickRefOfMRefOfParagraphOfArticle(mReferenceNumber, paragraphNumber, articleNumber){
        this.getParagraphFromArticle(paragraphNumber, articleNumber).find('mref').eq(mReferenceNumber-1).find('ref').click();
    }

    clickRefOfMRefOfPointOfParagraphOfArticle(mReferenceNumber, pointNumber, listNumber, paragraphNumber, articleNumber){
        this.getPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).find('mref').eq(mReferenceNumber-1).find('ref').click();
    }

    clickEditIconOfCitation(citationNumber) {
        this.getCitation(citationNumber).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='edit']").click({ force: true }));
    }

    clickEditIconOfArticle(articleNumber) {
        this.getArticle(articleNumber).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='edit']").click({ force: true }));
    }

    clickInsertAfterIconOfArticle(articleNumber) {
        this.getArticle(articleNumber).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='insert.after']").click({ force: true }).wait(500));
    }

    clickInsertBeforeIconOfArticle(articleNumber) {
        this.getArticle(articleNumber).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='insert.before']").click({ force: true }));
    }

    getIndentTagFromArticle(articleNumber) {
        return this.getArticle(articleNumber).find('indent');
    }

    getParagraphFromArticle(paragraphNumber, articleNumber) {
        return this.getArticle(articleNumber).children('paragraph').eq(paragraphNumber-1);
    }

    getPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(listNumber-1).children('point').eq(pointNumber-1);
    }

    getPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(listNumber1-1).children('point').eq(pointNumber1-1).children('list').eq(listNumber2-1).children('point').eq(pointNumber2-1);
    }

    getPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(listNumber1-1).children('point').eq(pointNumber1-1).children('list').eq(listNumber2-1).children('point').eq(pointNumber2-1).children('list').eq(listNumber3-1).children('point').eq(pointNumber3-1);
    }

    getIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).children('list').eq(listNumber4-1).children('indent').eq(indentNumber-1);
    }

    getSubparagraphOfListOfParagraphFromArticle(subparagraphNumber, listNumber, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(listNumber-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getSubParagraphOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber, poinListNumber, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(poinListNumber-1).children('point').eq(pointNumber-1).children('list').eq(subParagraphListNumber-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getSubParagraphOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(poinListNumber1-1).children('point').eq(pointNumber1-1).children('list').eq(poinListNumber2-1).children('point').eq(pointNumber2-1).children('list').eq(subParagraphListNumber-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getSubParagraphOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber3, poinListNumber3, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(poinListNumber1-1).children('point').eq(pointNumber1-1).children('list').eq(poinListNumber2-1).children('point').eq(pointNumber2-1).children('list').eq(poinListNumber3-1).children('point').eq(pointNumber3-1).children('list').eq(subParagraphListNumber-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getSubparagraphOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('subparagraph').eq(subparagraphNumber-1);
    }

    getSubParagraphRefersToListOfParagraphOfArticle(subparagraphRefersTo, listNumber, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(listNumber-1).children("subparagraph[refersto='"+subparagraphRefersTo+"']");
    }

    getHeadingFromArticle(articleNumber) {
        return this.getArticle(articleNumber).children('heading');
    }

    getNumTagOfParagraphFromArticle(paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('num');
    }

    getNumTagOfPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber){
        return this.getPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).children('num');
    }

    getNumTagOfPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).children('num');
    }

    getNumTagOfPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).children('num');
    }

    getNumTagOfIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).children('num');
    }

    getContentOfParagraphFromArticle(paragraphNumber, articleNumber) {
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber){
        return this.getPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfSubparagraphOfListOfParagraphFromArticle(subparagraphNumber, listNumber, paragraphNumber, articleNumber){
        return this.getSubparagraphOfListOfParagraphFromArticle(subparagraphNumber, listNumber, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfSubParagraphOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber, poinListNumber, paragraphNumber, articleNumber){
        return this.getSubParagraphOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber, poinListNumber, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfSubParagraphOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber){
        return this.getSubParagraphOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfSubParagraphOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber3, poinListNumber3, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber){
        return this.getSubParagraphOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber3, poinListNumber3, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfSubparagraphOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber){
        return this.getSubparagraphOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfSubParagraphRefersToListOfParagraphOfArticle(subparagraphRefersTo, listNumber, paragraphNumber, articleNumber){
        return this.getSubParagraphRefersToListOfParagraphOfArticle(subparagraphRefersTo, listNumber, paragraphNumber, articleNumber).find('content aknp');
    }

    getAuthorialNoteWithMarkerNumberFromCitation(citationNumber, markerNumber) {
        return this.getCitation(citationNumber).find("authorialnote[marker='"+markerNumber+"']");
    }

    clickAuthorialNoteWithMarkerNumberFromCitation(markerNumber, citationNumber) {
        this.getAuthorialNoteWithMarkerNumberFromCitation(citationNumber, markerNumber).click();
    }

    getAuthorialNoteWithMarkerNumberFromRecital(recitalNumber, markerNumber) {
        return this.getRecital(recitalNumber).find("authorialnote[marker='"+markerNumber+"']");
    }

    clickAuthorialNoteWithMarkerNumberFromRecital(markerNumber, recitalNumber) {
        this.getAuthorialNoteWithMarkerNumberFromRecital(recitalNumber, markerNumber).click();
    }

    getAuthorialNoteWithMarkerNumberFromParagraphOfArticle(paragraphNumber, articleNumber, markerNumber) {
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).find("authorialnote[marker='"+markerNumber+"']");
    }

    clickAuthorialNoteWithMarkerNumberFromParagraphOfArticle(markerNumber, paragraphNumber, articleNumber) {
        this.getAuthorialNoteWithMarkerNumberFromParagraphOfArticle(paragraphNumber, articleNumber, markerNumber).click();
    }

    getRowFromTableOfSubparagraphOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber) {
        return this.getSubparagraphOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber).find('table tbody tr');
    }

    getColumnFromTableOfSubparagraphOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber) {
        return this.getSubparagraphOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber).find('table tbody tr').eq(0).find('td');
    }

    clickInsertAfterIconOfCitation(citationNumber) {
        this.getCitation(citationNumber).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='insert.after']").click({ force: true }));
    }

    clickInsertBeforeIconOfRecital(recitalNumber) {
        this.getRecital(recitalNumber).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='insert.before']").click({ force: true }));
    }

    getLeosActionsIconOfCitation(citationNumber){
        return this.getCitation(citationNumber).siblings('.leos-actions.Vaadin-Icons .leos-actions-icon');
    }

    getLeosActionsIconOfRecital(recitalNumber){
        return this.getRecital(recitalNumber).siblings('.leos-actions.Vaadin-Icons .leos-actions-icon');
    }
}
export default new legalActPage();
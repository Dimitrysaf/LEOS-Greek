class legalActPage {
    elements = {
        closeBtn: () => cy.get("button[translate='global.actions.close']"),
        bill: () => cy.get('bill'),
        citation: () => cy.xpath('//citation'),
        recital: () => cy.xpath('//recital'),
        article: () => cy.get('article'),
        clause: () => cy.get('clause'),
        clauseContent: () => this.elements.clause().find('content').find('aknp'),
        preface: () => this.elements.bill().find('preface'),
        eeaRelevanceContainer : () => this.elements.preface().find("container[name='eeaRelevance']"),
        longTitle: () => this.elements.preface().find('longtitle'),
        docPurpose: () => this.elements.longTitle().find('docpurpose'),
        recitalFromImportOj: () => cy.get("recital[id^='impXrec']"),
        partFromImportOj: () => cy.get("part[id^='impX']"),
        titleFromImportOj: () => cy.get("aknTitle[id^='impX']"),
        chapterFromImportOj: () => cy.get("chapter[id^='impX']"),
        sectionFromImportOj: () => cy.get("section[id^='impX']"),
        articleFromImportOj: () => cy.get("article[id^='impXart']"),
        aknBody: () => cy.get('aknbody'),
        leosSoftMoveLabel: () => this.elements.aknBody().find('span.leos-soft-move-label'),
        recitals: () => cy.xpath('//recitals'),
        recitalSection: () => this.elements.recitals().children('recitals')
    }

    clickCloseBtn() {
        this.elements.closeBtn().click().wait(500);
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

    getNumTagOfRecital(recitalNumber) {
        return this.getRecital(recitalNumber).find('num');
    }

    getAknpTagOfRecital(recitalNumber) {
        return this.getRecital(recitalNumber).find('aknp');
    }

    getArticle(articleNumber) {
        return this.elements.article().eq(articleNumber-1);
    }

    getClause(clauseNumber) {
        return this.elements.clause().eq(clauseNumber-1);
    }

    getNumTagOfArticle(articleNumber) {
        return this.getArticle(articleNumber).find('num');
    }

    getAllWidgetOfArticle(articleNumber) {
       return this.getArticle(articleNumber).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('span'));
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

    mouseHoverOnArticle(articleNumber) {
        this.getArticle(articleNumber).invoke('attr', 'id').then(id => cy.get("#" + id).realHover({ position: "center" }));
    }

    mouseHoverAndClickOnClause(clauseNumber) {
        this.getClause(clauseNumber).invoke('attr', 'id').then(id => cy.get("#" + id).realHover({ position: "top" }).realClick({ position: "topLeft" }));
    }

    mouseHoverAndClickOnCitation(citationNumber) {
        cy.xpath("//citation[" + citationNumber + "]").realHover({ position: "top" }).invoke('attr', 'id').then(id => cy.get("#" + id).realHover({ position: "top" }).realClick({ position: "topLeft" }));
    }

    mouseHoverAndClickOnRecital(recitalNumber) {
        cy.wait(1000);
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

    clickDeleteIconOfArticle(articleNumber) {
        this.getArticle(articleNumber).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='delete']").click({ force: true }));
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

    getSubParagraphOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber, pointListNumber, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(pointListNumber-1).children('point').eq(pointNumber-1).children('list').eq(subParagraphListNumber-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getSubParagraphOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(pointListNumber1-1).children('point').eq(pointNumber1-1).children('list').eq(pointListNumber2-1).children('point').eq(pointNumber2-1).children('list').eq(subParagraphListNumber-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getPointOfPointOfPointOfParagraphOfArticle(pointNumber3, pointListNumber3, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(pointListNumber1-1).children('point').eq(pointNumber1-1).children('list').eq(pointListNumber2-1).children('point').eq(pointNumber2-1).children('list').eq(pointListNumber3-1).children('point').eq(pointNumber3-1);
    }

    getSubParagraphOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, pointNumber3, pointListNumber3, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber){
        return this.getPointOfPointOfPointOfParagraphOfArticle(pointNumber3, pointListNumber3, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber).children('subparagraph').eq(subparagraphNumber-1);
    }

    getSubParagraphOfListOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber3, pointListNumber3, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber){
        return this.getPointOfPointOfPointOfParagraphOfArticle(pointNumber3, pointListNumber3, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber).children('list').eq(subParagraphListNumber-1).children('subparagraph').eq(subparagraphNumber-1);
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

    getContentOfSubParagraphOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber, pointListNumber, paragraphNumber, articleNumber){
        return this.getSubParagraphOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber, pointListNumber, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfSubParagraphOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber){
        return this.getSubParagraphOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfSubParagraphOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, pointNumber3, pointListNumber3, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber){
        return this.getSubParagraphOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, pointNumber3, pointListNumber3, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfSubParagraphOfListOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber3, pointListNumber3, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber){
        return this.getSubParagraphOfListOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber3, pointListNumber3, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber).find('content aknp');
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

    getRowFromTableOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber) {
        return this.getParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber).find('table tbody tr');
    }

    getColumnFromTableOfParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber) {
        return this.getParagraphFromArticle(subparagraphNumber, paragraphNumber, articleNumber).find('table tbody tr').eq(0).find('td');
    }

    clickInsertAfterIconOfCitation(citationNumber) {
        this.getCitation(citationNumber).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='insert.after']").click({ force: true }));
    }

    clickInsertBeforeIconOfRecital(recitalNumber) {
        this.getRecital(recitalNumber).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='insert.before']").click({ force: true }));
    }

    clickInsertAfterIconOfRecital(recitalNumber) {
        this.getRecital(recitalNumber).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='insert.after']").click({ force: true }));
    }

    getLeosActionsIconOfCitation(citationNumber){
        return this.getCitation(citationNumber).siblings('.leos-actions.Vaadin-Icons .leos-actions-icon');
    }

    getLeosActionsIconOfRecital(recitalNumber){
        return this.getRecital(recitalNumber).siblings('.leos-actions.Vaadin-Icons .leos-actions-icon');
    }

    clickSoftMoveLabelWithTitle(label) {
        this.elements.leosSoftMoveLabel().contains(label).click();
    }

    getTagFromNumTagOfParagraphFromArticle(paragraphNumber, articleNumber, tagName) {
        return this.getNumTagOfParagraphFromArticle(paragraphNumber, articleNumber).children(tagName);
    }

    mouseHoverOnRecital(recitalNumber) {
        this.getRecital(recitalNumber).invoke('attr', 'id').then(id => cy.get("#" + id).realHover({ position: "center" }));
    }

    clickDeleteIconOfRecital(recitalNumber) {
        this.getRecital(recitalNumber).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({ position: "top" }).click('top', { force: true }).parent().find("span[data-widget-type='delete']").click({ force: true }));
    }

    getTagFromArticle(articleNumber, tagName) {
        return this.getArticle(articleNumber).find(`> ${tagName}`);
    }

    getImageOfRecital(recitalNumber) {
        return this.getRecital(recitalNumber).find('img');
    }

    getSubflow(recitalNumber) {
        return this.getRecital(recitalNumber).find('subflow[name="structuredContent"]');
    }

    getSubflowOfRecital(subFlowNumber, recitalNumber) {
        return this.getSubflow(recitalNumber).eq(subFlowNumber-1);
    }

    getListOfRecital(subFlowNumber,recitalNumber){
        return this.getSubflowOfRecital(subFlowNumber, recitalNumber).find('list point content');
    }

    getRowFromTableOfSubflowFromRecital(subFlowNumber, recitalNumber) {
        return this.getSubflowOfRecital(subFlowNumber, recitalNumber).find('table tbody tr');
    }

    getColumnFromTableOfSubflowFromRecital(subFlowNumber, recitalNumber) {
        return this.getRowFromTableOfSubflowFromRecital(subFlowNumber, recitalNumber).eq(0).find('td');
    }

}
export default new legalActPage();
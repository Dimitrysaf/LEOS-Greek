class annexPage {
    elements = {
        containerBlockNum: () => cy.get("container[name='headerOfAnnex'] block[name='num']"),
        prefaceContainerBlockHeading: () => cy.get("container[name='headerOfAnnex'] block[name='heading']"),
        closeBtn: () => cy.xpath("//button[text()='Close']"),
        level: () => cy.get('mainbody level'),
        paragraph: () => cy.xpath("(//div[contains(@class, 'orientation')]//paragraph)")
    }

    clickCloseBtn() {
        this.elements.closeBtn().click();
        cy.wait(500);
    }

    mouseHoverAndClickOnLevel(levelNumber) {
        cy.xpath("(//div[contains(@class, 'orientation')]//level)[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().click({force: true}));
    }

    mouseHoverAndRealClickOnLevel(levelNumber) {
        cy.xpath("(//div[contains(@class, 'orientation')]//level)[" + levelNumber + "]").realHover({ position: "center" }).invoke('attr', 'id').then(id => cy.get("#" + id).realHover({ position: "center" }).realClick({ position: "topLeft" }));
    }

    clickEditIconOfLevel(levelNumber) {
        cy.xpath("(//div[contains(@class, 'orientation')]//level)[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(1000).find("span[data-widget-type='edit']").click({force:true}));
    }

    clickInsertBeforeIconOfLevel(levelNumber) {
        cy.xpath("(//div[contains(@class, 'orientation')]//level)[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(1000).find("span[data-widget-type='insert.before']").click({force:true}));
    }

    clickInsertAfterIconOfLevel(levelNumber) {
        cy.xpath("(//div[contains(@class, 'orientation')]//level)[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(1000).find("span[data-widget-type='insert.after']").click({force:true}));
    }

    clickDeleteIconOfLevel(levelNumber) {
        cy.xpath("(//div[contains(@class, 'orientation')]//level)[" + levelNumber + "]").realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(1000).find("span[data-widget-type='delete']").click({force:true}));
    }

    mouseHoverAndClickOnParagraph(paragraphNumber) {
        cy.xpath("(//div[contains(@class, 'orientation')]//paragraph)[" + paragraphNumber + "]").realHover({ position: "top" }).invoke('attr', 'id').then(id => cy.get("#" + id).realHover({ position: "top" }).click({ force: true }));
    }

    clickEditIconOfParagraph(paragraphNumber) {
        cy.xpath("(//div[contains(@class, 'orientation')]//paragraph)[" + paragraphNumber + "]").scrollIntoView().realHover({ position: "top" }).invoke('attr', 'id').then(id => cy.get("#" + id).realHover({ position: "top" }).next('div.leos-actions').realHover().wait(1000).find("span[data-widget-type='edit']").click({force:true}));
    }

    getContentOfLevel(levelNumber) {
        return cy.xpath("(//div[contains(@class, 'orientation')]//level)[" + levelNumber + "]//content//aknp");
    }

    getContentOfParagraph(paragraphNumber) {
        return this.getParagraph(paragraphNumber).find('content aknp');
    }

    getRowFromTableOfSubparagraphFromLevel(subparagraphNumber, levelNumber) {
        return this.getSubparagraphFromLevel(subparagraphNumber, levelNumber).find('table tbody tr');
    }

    getColumnFromTableOfSubparagraphFromLevel(subparagraphNumber, levelNumber) {
        return this.getSubparagraphFromLevel(subparagraphNumber,  levelNumber).find('table tbody tr').eq(0).find('td');
    }

    getRowFromTableOfParagraph(paragraphNumber) {
        return this.getParagraph(paragraphNumber).find('table tbody tr');
    }

    getColumnFromTableOfParagraph(paragraphNumber) {
        return this.getParagraph(paragraphNumber).find('table tbody tr').eq(0).find('td');
    }

    getSubparagraphFromLevel(subparagraphNumber, levelNumber) {
        return this.getLevel(levelNumber).children('subparagraph').eq(subparagraphNumber-1);
    }

    getLevel(levelNumber) {
        return this.elements.level().eq(levelNumber-1);
    }

    getParagraph(paragraphNumber) {
        return this.elements.paragraph().eq(paragraphNumber-1);
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

    getSubparagraphOfListOfLevel(levelNumber, listNumber, subparagraphNumber) {
        return this.getLevel(levelNumber).children('list').eq(listNumber - 1).children("subparagraph").eq(subparagraphNumber - 1);
    }

    getSubparagraphOfLevel(subparagraphNumber, levelNumber) {
        return this.getLevel(levelNumber).children("subparagraph").eq(subparagraphNumber - 1);
    }

    getSubparagraphWithAttributeOfLevel(attributeName, attributeValue, listNumber, levelNumber) {
        return this.getLevel(levelNumber).children('list').eq(listNumber-1).children("subparagraph["+attributeName+"='"+attributeValue+"']");
    }

    getSubparagraphOfParagraph(attributeName, attributeValue, paragraphNumber) {
        return this.getParagraph(paragraphNumber).children('list').children("subparagraph["+attributeName+"='"+attributeValue+"']");
    }

    getContentOfSubparagraphOfParagraph(attributeName, attributeValue, paragraphNumber){
        return this.getSubparagraphOfParagraph(attributeName, attributeValue, paragraphNumber).find('content aknp');
    }

    getPointOfParagraph(firstLayerPointNumber, paragraphNumber) {
        return this.getParagraph(paragraphNumber).children('list').children('point').eq(firstLayerPointNumber-1);
    }

    getContentOfPointOfParagraph(firstLayerPointNumber, paragraphNumber) {
        return this.getPointOfParagraph(firstLayerPointNumber, paragraphNumber).find('content aknp');
    }

    getSubparagraphOfFirstLayerPointOfParagraph(attributeName, attributeValue, firstLayerPointNumber, paragraphNumber) {
        return this.getPointOfParagraph(firstLayerPointNumber, paragraphNumber).children('list').children("subparagraph["+attributeName+"='"+attributeValue+"']");
    }

    getContentOfSubparagraphOfFirstLayerPointOfParagraph(attributeName, attributeValue, firstLevelPointNumber, paragraphNumber) {
        return this.getSubparagraphOfFirstLayerPointOfParagraph(attributeName, attributeValue, firstLevelPointNumber, paragraphNumber).find('content aknp');
    }

    getSecondLayerPointOfParagraph(secondLayerPointNumber, firstLayerPointNumber, paragraphNumber) {
        return this.getPointOfParagraph(firstLayerPointNumber, paragraphNumber).children('list').children('point').eq(secondLayerPointNumber-1);
    }

    getContentOfSecondLayerPointOfParagraph(secondLayerPointNumber, firstLayerPointNumber, paragraphNumber) {
        return this.getSecondLayerPointOfParagraph(secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).find('content aknp');
    }

    getSubparagraphOfSecondLayerPointOfParagraph(attributeName, attributeValue, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber) {
        return this.getSecondLayerPointOfParagraph(secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).children('list').children("subparagraph["+attributeName+"='"+attributeValue+"']");
    }

    getContentOfSubparagraphOfSecondLayerPointOfParagraph(attributeName, attributeValue, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber) {
        return this.getSubparagraphOfSecondLayerPointOfParagraph(attributeName, attributeValue, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).find('content aknp');
    }

    getThirdLayerPointOfParagraph(thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber) {
        return this.getSecondLayerPointOfParagraph(secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).children('list').children('point').eq(thirdLayerPointNumber-1);
    }

    getContentOfThirdLayerPointOfParagraph(thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber) {
        return this.getThirdLayerPointOfParagraph(thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).find('content aknp');
    }

    getSubparagraphOfThirdLayerPointOfParagraph(attributeName, attributeValue, thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber) {
        return this.getThirdLayerPointOfParagraph(thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).children('list').children("subparagraph["+attributeName+"='"+attributeValue+"']");
    }

    getContentOfSubparagraphOfThirdLayerPointOfParagraph(attributeName, attributeValue, thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber) {
        return this.getSubparagraphOfThirdLayerPointOfParagraph(attributeName, attributeValue, thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).find('content aknp');
    }

    getFourthLayerPointOfParagraph(fourthLayerPointNumber, thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber) {
        return this.getThirdLayerPointOfParagraph(thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).children('list').children('indent').eq(fourthLayerPointNumber-1);
    }

    getContentOfFourthLayerPointOfParagraph(fourthLayerPointNumber, thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber) {
        return this.getFourthLayerPointOfParagraph(fourthLayerPointNumber, thirdLayerPointNumber, secondLayerPointNumber, firstLayerPointNumber, paragraphNumber).find('content aknp');
    }

    getContentOfSubparagraphOfLevel(subparagraphNumber, levelNumber) {
        return this.getSubparagraphOfLevel(subparagraphNumber, levelNumber).find('content aknp');
    }

    getContentOfSubparagraphWithAttributeOfLevel(attributeName, attributeValue, listNumber, levelNumber) {
        return this.getSubparagraphWithAttributeOfLevel(attributeName, attributeValue, listNumber, levelNumber).find('content aknp');
    }

    getFirstLayerPointOfLevel(firstLayerPointNumber, ListNumber, levelNumber) {
        return this.getLevel(levelNumber).children('list').eq(ListNumber-1).children('point').eq(firstLayerPointNumber-1);
    }

    getSecondLayerPointOfLevel(secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getFirstLayerPointOfLevel(firstLayerPointNumber, ListNumber1, levelNumber).children('list').eq(ListNumber2-1).children('point').eq(secondLayerPointNumber-1);
    }

    getThirdLayerPointOfLevel(thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getSecondLayerPointOfLevel(secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).children('list').eq(ListNumber3-1).children('point').eq(thirdLayerPointNumber-1);
    }

    getFourthLayerIndentOfLevel(fourthLayerIndentNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getThirdLayerPointOfLevel(thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).children('list').eq(ListNumber4-1).children('indent').eq(fourthLayerIndentNumber-1);
    }

    getContentOfFirstLayerPointOfLevel(firstLayerPointNumber, ListNumber, levelNumber) {
        return this.getFirstLayerPointOfLevel(firstLayerPointNumber, ListNumber, levelNumber).find('content aknp');
    }

    getContentOfSecondLayerPointOfLevel(secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getSecondLayerPointOfLevel(secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).find('content aknp');
    }

    getSubparagraphOfFirstLayerPointOfLevel(subparagraphNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getFirstLayerPointOfLevel(firstLayerPointNumber, ListNumber1, levelNumber).children('list').eq(ListNumber2-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getSubparagraphWithAttributeOfFirstLayerPointOfLevel(attributeName, attributeValue, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getFirstLayerPointOfLevel(firstLayerPointNumber, ListNumber1, levelNumber).children('list').eq(ListNumber2-1).children("subparagraph["+attributeName+"='"+attributeValue+"']");
    }

    getSubparagraphOfSecondLayerPointOfLevel(subparagraphNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getSecondLayerPointOfLevel(secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).children('list').eq(ListNumber3-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getSubparagraphWithAttributeOfSecondLayerPointOfLevel(attributeName, attributeValue, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getSecondLayerPointOfLevel(secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).children('list').eq(ListNumber3-1).children("subparagraph["+attributeName+"='"+attributeValue+"']");
    }

    getSubparagraphOfThirdLayerPointOfLevel(subparagraphNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getThirdLayerPointOfLevel(thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).children('list').eq(ListNumber4-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getSubparagraphWithAttributeOfThirdLayerPointOfLevel(attributeName, attributeValue, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getThirdLayerPointOfLevel(thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).children('list').eq(ListNumber4-1).children("subparagraph["+attributeName+"='"+attributeValue+"']");
    }

    getSubparagraphOfFourthLayerIndentOfLevel(subparagraphNumber, ListNumber5, fourthLayerIndentNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getFourthLayerIndentOfLevel(fourthLayerIndentNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).children('list').eq(ListNumber5-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getContentOfSubparagraphOfFirstLayerPointOfLevel(subparagraphNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getSubparagraphOfFirstLayerPointOfLevel(subparagraphNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).find('content aknp');
    }

    getContentOfSubparagraphWithAttributeOfFirstLayerPointOfLevel(attributeName, attributeValue, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getSubparagraphWithAttributeOfFirstLayerPointOfLevel(attributeName, attributeValue, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).find('content aknp');
    }

    getContentOfSubparagraphOfSecondLayerPointOfLevel(subparagraphNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getSubparagraphOfSecondLayerPointOfLevel(subparagraphNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).find('content aknp');
    }

    getContentOfSubparagraphWithAttributeOfSecondLayerPointOfLevel(attributeName, attributeValue, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getSubparagraphWithAttributeOfSecondLayerPointOfLevel(attributeName, attributeValue, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).find('content aknp');
    }

    getContentOfThirdLayerPointOfLevel(thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getThirdLayerPointOfLevel(thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).find('content aknp');
    }

    getContentOfSubparagraphOfThirdLayerPointOfLevel(subparagraphNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getSubparagraphOfThirdLayerPointOfLevel(subparagraphNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).find('content aknp');
    }

    getContentOfSubparagraphWithAttributeOfThirdLayerPointOfLevel(attributeName, attributeValue, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getSubparagraphWithAttributeOfThirdLayerPointOfLevel(attributeName, attributeValue, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).find('content aknp');
    }

    getContentOfFourthLayerIndentOfLevel(fourthLayerIndentNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getFourthLayerIndentOfLevel(fourthLayerIndentNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).find('content aknp');
    }

    getContentOfSubparagraphOfFourthLayerIndentOfLevel(subparagraphNumber, ListNumber5, fourthLayerIndentNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber) {
        return this.getSubparagraphOfFourthLayerIndentOfLevel(subparagraphNumber, ListNumber5, fourthLayerIndentNumber, ListNumber4, thirdLayerPointNumber, ListNumber3, secondLayerPointNumber, ListNumber2, firstLayerPointNumber, ListNumber1, levelNumber).find('content aknp');
    }
}
export default new annexPage();
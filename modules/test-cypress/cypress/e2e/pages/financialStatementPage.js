
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

    clickCloseBtn() {
        this.elements.closeBtn().click();
    }

    mouseHoverAndClickOnLevel(levelNumber) {
        cy.xpath("//mainbody//level[" + levelNumber + "]").invoke('attr', 'id').then(id => cy.get("#" + id).realHover().click({force: true}));
    }

    getLevel(levelNumber) {
        return cy.xpath("(//mainbody//level)[" + levelNumber + "]");
    }

    getLevelByNum(levelName) {
        return cy.xpath("//mainbody//level/num[text()='" + levelName + "']").parent();
    }

    getLandscapeLevel(levelNumber) {
        return cy.get('mainbody div.landscape level').eq(levelNumber - 1);
    }

    getContentOfLevel(levelNumber) {
        return this.getLevel(levelNumber).find('content aknp');
    }

    getMRefTextFromContentOfLevel(mReferenceNumber, levelNumber) {
        return this.getContentOfLevel(levelNumber).find('mref').eq(mReferenceNumber - 1);
    }

    getSubparagraphOfLevel(subparagraphNumber, levelNumber) {
        return this.getLevel(levelNumber).find('subparagraph').eq(subparagraphNumber - 1);
    }

    getSubparagraphOfLandscapeLevel(subparagraphNumber, levelNumber) {
        return this.getLandscapeLevel(levelNumber).find('subparagraph').eq(subparagraphNumber - 1);
    }

    getContentOfSubparagraphOfLevel(subparagraphNumber, levelNumber) {
        return this.getSubparagraphOfLevel(subparagraphNumber, levelNumber).find('content aknp');
    }

    clickEditIconOfLevel(levelNumber) {
        this.getLevel(levelNumber).realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(2000).find("span[data-widget-type='edit']").click({force: true}));
    }

    clickEditIconOfSubparagraphOfLandscapeLevel(subparagraphNumber, levelNumber) {
        this.getSubparagraphOfLandscapeLevel(subparagraphNumber, levelNumber).realHover().invoke('attr', 'id').then(id => cy.get("#" + id).realHover().next('div.leos-actions').realHover().wait(2000).find("span[data-widget-type='edit']").click({force: true}));
    }

    duplicateRepeatableSubparagraph() {
        this.elements.repeatableSubparagraph().first().invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({position: "top"}).click('top', {force: true}).parent().find("span[data-widget-type='insert.after']").click({force: true}).wait(500));
    }

    deleteRepeatedSubparagraph() {
        this.elements.repeatedSubparagraph().first().invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({position: "top"}).click('top', {force: true}).parent().find("span[data-widget-type='delete']").click({force: true}).wait(500));
    }

    duplicateRepeatableSubparagraphGroupAfter() {
        this.elements.repeatableSubparagraphGroup().first().invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({position: "top"}).click('top', {force: true}).parent().find("span[data-widget-type='insert.group.after']").click({force: true}).wait(500));
    }

    duplicateRepeatableSubparagraphGroupBefore() {
        this.elements.repeatableSubparagraphGroup().first().invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({position: "top"}).click('top', {force: true}).parent().find("span[data-widget-type='insert.group.before']").click({force: true}).wait(500));
    }

    getRowFromTableOfSubparagraphFromLevel(subparagraphNumber, levelNumber) {
        return this.getSubparagraphFromLevel(subparagraphNumber, levelNumber).find('table tbody tr');
    }

    getColumnFromTableOfSubparagraphFromLevel(subparagraphNumber, levelNumber) {
        return this.getSubparagraphFromLevel(subparagraphNumber, levelNumber).find('table tbody tr').eq(0).find('td');
    }

    getSubparagraphFromLevel(subparagraphNumber, levelNumber) {
        return this.getLevel(levelNumber).children('subparagraph').eq(subparagraphNumber - 1);
    }

    selectCheckboxInLevel(checkboxIndex, levelName) {
        this.getLevelByNum(levelName).find('inline').eq(checkboxIndex - 1).click({force: true}).wait(200);
    }

    unSelectCheckboxInLevel(checkboxIndex, levelName) {
        this.getLevelByNum(levelName).find('inline').eq(checkboxIndex - 1).click({force: true}).wait(200);
    }

    getCheckBoxInLevel(checkboxIndex, levelName) {
        return this.getLevelByNum(levelName).find('inline').eq(checkboxIndex - 1);
    }

    getSelectedCheckBoxInLevel(levelName) {
        return this.getLevelByNum(levelName).find('inline[name="checked"]');
    }

    selectAllCheckboxesInLevel(levelName) {
        this.getLevelByNum(levelName)
            .find('[name="unchecked"]')
            .each(() => {
                cy.get('[name="unchecked"]')
                    .first()
                    .click({force: true}).wait(200);
            });
    }

    getRepeatedSubparagraphOfLevel(repeatableSubparagraphNumber, levelName) {
        return this.getLevelByNum(levelName).find("subparagraph[leos\\:repeatable='true']").eq(repeatableSubparagraphNumber - 1);
    }

    deleteRepeatableSubparagraph(repeatableSubparagraphNumber, levelName) {
        this.getRepeatedSubparagraphOfLevel(repeatableSubparagraphNumber, levelName).invoke('attr', 'id').then(id => cy.get("#" + id).trigger('mouseover').next('div .leos-actions').find('.leos-actions-icon').realHover({position: "top"}).click('top', {force: true}).parent().find("span[data-widget-type='delete']").click({force: true}).wait(200));
    }

    clickCalendarField(index, levelNumber) {
        this.getLevelByNum(levelNumber).find('button[class="ui-datepicker-trigger"]')
            .then($buttons => {
                const button = $buttons[index - 1];
                cy.wrap(button).click();
            });
    }

    selectCalendarField(dateStr, indexNumber) {
        const parts = dateStr.split('.');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        cy.get('input.hasDatepicker').eq(indexNumber - 1).scrollIntoView().click({force: true});
        if (parts.length === 3) {
            const [day, month, year] = parts;
            const monthName = monthNames[parseInt(month, 10) - 1];
            cy.get('.ui-datepicker-month').should('be.visible').select(monthName);
            cy.get('.ui-datepicker-year').should('be.visible').select(year);
            cy.get('.ui-datepicker-calendar td a').contains(day).click();
        } else if (parts.length === 1) {
            cy.get('.ui-datepicker-year').should('be.visible').select(parts[0]);
        }
    }

    getAllDatePicker(index, levelNumber) {
        return this.getLevelByNum(levelNumber).find('input[class="hasDatepicker"]').eq(index-1);
    }

}
export default new financialStatementPage();
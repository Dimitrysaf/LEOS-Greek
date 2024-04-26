import headerPage  from './headerPage';
class legalActPage extends headerPage{
    elements = {
        closeBtn: () => cy.contains('Close'),
        annotationSideBar: () => cy.contains('Annotations & document notes'),
        ribbonToolBar: () => cy.get('app-ribbon-toolbar-container'),
        threeDots: () => cy.get(".leos-actions-icon[style='display: inline-block;']"),
        editIconActionMenu: () => cy.get(".leos-actions.Vaadin-Icons span[data-widget-type='edit'][style='display: inline-block;']"),
        previousIconActionMenu: () => cy.get(".leos-actions.Vaadin-Icons span[data-widget-type='insert.before'][style='display: inline-block;']"),
        nextIconActionMenu: () => cy.get(".leos-actions.Vaadin-Icons span[data-widget-type='insert.after'][style='display: inline-block;']"),
        deleteIconActionMenu: () => cy.get(".leos-actions.Vaadin-Icons span[data-widget-type='delete'][style='display: inline-block;']")
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
        cy.wait(1000);
    }
    
    mouseHoverAndClickOnArticle(articleNumber){
        cy.get("#_art_" + articleNumber).realHover().click();
    }

    mouseHoverAndClickOnCitation(citationNumber){
        cy.get("#_cit_" + citationNumber).trigger('mouseover').trigger('click');
    }

    mouseHoverAndClickOnRecital(recitalNumber){
        cy.get("#_rec_" + recitalNumber).trigger('mouseover').trigger('click');
    }

    mouseHoverOnThreeDots(){
        this.elements.threeDots().trigger('mouseover');
        cy.wait(4000);
    }

    getAllParagraphFromArticle(articleNumber){
        return cy.xpath("//article[" + articleNumber + "]//paragraph");
    }

    getCitation(citationNumber){
        return cy.xpath("//citation[" + citationNumber + "]");
    }

    getRecital(recitalNumber){
        return cy.xpath("//recital[" + recitalNumber + "]");
    }

    getParagraphFromArticle(paragraphNumber, articleNumber){
        return cy.xpath("//article[" + articleNumber + "]//paragraph[" + paragraphNumber+ "]");
    }
}
export default new legalActPage();
import '@cypress/xpath';
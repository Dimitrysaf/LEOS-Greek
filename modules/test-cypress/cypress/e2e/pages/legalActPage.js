import headerPage from './headerPage';
class legalActPage extends headerPage {
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

    clickCloseBtn() {
        this.elements.closeBtn().click();
    }

    mouseHoverAndClickOnArticle(articleNumber) {
        let identifier;
        let elementType = "article";
        cy.xpath("//article[" + articleNumber + "]").realHover().invoke('attr', 'id').then(id => identifier = id);
        //this.openCKEditor(identifier, elementType);
        cy.window().then((w) => {
            w.EditorConnector.handleEdit({
              "action": "edit",
              "elementId": identifier,
              "elementType": elementType,
              "elementCursorId": identifier,
              "elementCursorChildPos": 0,
              "elementCursorPos": 0
            })
        })
    }

    mouseHoverAndClickOnCitation(citationNumber) {
        cy.xpath("//citation[" + citationNumber + "]").realHover().click();
    }

    mouseHoverAndClickOnRecital(recitalNumber) {
        cy.xpath("//recital[" + recitalNumber + "]").realHover().click();
    }

    mouseHoverOnThreeDots() {
        this.elements.threeDots().trigger('mouseover');
    }

    getAllParagraphFromArticle(articleNumber) {
        return cy.xpath("//article[" + articleNumber + "]//paragraph");
    }

    getCitation(citationNumber) {
        return cy.xpath("//citation[" + citationNumber + "]");
    }

    getRecital(recitalNumber) {
        return cy.xpath("//recital[" + recitalNumber + "]");
    }

    getParagraphFromArticle(paragraphNumber, articleNumber) {
        return cy.xpath("//article[" + articleNumber + "]//paragraph[" + paragraphNumber + "]");
    }

    // openCKEditor(identifier, elementType){
        
    // }

}
export default new legalActPage();
import '@cypress/xpath';
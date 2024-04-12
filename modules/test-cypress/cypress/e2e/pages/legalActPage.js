import headerPage  from './headerPage';
class legalActPage extends headerPage{
    elements = {
        closeBtn: () => cy.contains('Close'),
        saveBtn: () => cy.contains('Save'),
        importFromOjBtn: () => cy.contains('Import from OJ '),
        exportsBtn: () => cy.contains('Exports'),
        searchBtn: () => cy.contains('Search'),
        seeUserGuidanceToggle: () => cy.xpath("//*[text()='See user guidance']//preceding-sibling::eui-slide-toggle//input"),
        enableTrackChangesToggle: () => cy.xpath("//*[text()='Enable track changes']//preceding-sibling::eui-slide-toggle//input"),
        seeTrackChangesToggle: () => cy.xpath("//*[text()='See track changes']//preceding-sibling::eui-slide-toggle//input"),
        annotationSideBar: () => cy.contains('Annotations & document notes')
    }

    mouseHoverOnArticle(articleNumber){
        cy.get("#_art_" + articleNumber).trigger('mouseover');
    }

    openCkEditorForArticle(articleNumber){
        cy.window().then((w) => {
            w.EditorConnector.handleEdit({
                "action": "edit",
                "elementId": "_art_" + articleNumber,
                "elementType": "article",
                "elementCursorId": "_art_" + articleNumber,
                "elementCursorChildPos": 0,
                "elementCursorPos": 0
            })
        });
    }

    getParagraphFromArticle(articleNumber){
        return cy.xpath("//article[" + articleNumber + "]//paragraph");
    }
    
}
export default new legalActPage();
import '@cypress/xpath';
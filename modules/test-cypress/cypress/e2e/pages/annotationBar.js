class annotationBar {
    elements = {
        annotationPane: () => cy.get('eui-page-column.annotations-pane'),
    }
}
export default new annotationBar();
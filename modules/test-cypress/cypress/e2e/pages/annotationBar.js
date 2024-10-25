class annotationBar {
    elements = {
        annotationPane: () => cy.get('eui-page-column.annotations-pane'),
        annotationPaneMinimized: () => this.elements.annotationPane().find("div.eui-page-column__header-right-content").find("button eui-icon-svg[icon='eui-chevron-forward']"),
        annotationPaneMaximized: () => this.elements.annotationPane().find("div.eui-page-column__header-right-content").find("button eui-icon-svg[icon='eui-chevron-back']")
    }

    clickAnnotationForwardPane() {
        this.elements.annotationPaneMinimized().click();
    }

    clickAnnotationBackPane() {
        this.elements.annotationPaneMaximized().click();
    }
}
export default new annotationBar();
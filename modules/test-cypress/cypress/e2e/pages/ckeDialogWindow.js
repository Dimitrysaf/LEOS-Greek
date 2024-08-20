class ckeDialogWindow {
    elements = {
        ckeEditorDialog: () => cy.get("div[role='dialog']:not([style='display: none;'])"),
        dialogTitle: () => this.elements.ckeEditorDialog().find('.cke_dialog_title'),
        okBtn: () => cy.get('.cke_dialog_footer_buttons').contains('OK'),
        dialogTextArea: () => cy.get('.cke_dialog_ui_input_textarea textarea'),
        dialogUIHBoxTable: () => cy.get('.cke_dialog_ui_hbox_first table tbody')
    }

    clickOkBtn() {
        this.elements.okBtn().click();
    }

    typeInCkeDialogTextArea(text) {
        this.elements.dialogTextArea().type(text);
    }

    clickTrTdDialogUIHBoxTable(cell, row) {
        this.elements.dialogUIHBoxTable().find('tr').eq(row - 1).find('td').eq(cell - 1).find('a').click();
    }
}

export default new ckeDialogWindow();
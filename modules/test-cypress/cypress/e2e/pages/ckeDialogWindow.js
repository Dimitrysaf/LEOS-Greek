class ckeDialogWindow {
    elements = {
        ckeEditorDialog: () => cy.get("div[role='dialog']:not([style='display: none;'])"),
        dialogTitle: () => this.elements.ckeEditorDialog().find('.cke_dialog_title'),
        okBtn: () => cy.get('.cke_dialog_footer_buttons').contains('OK'),
        activeDialogBox: () => cy.get("div[role='dialog'][style='display: block;'],div[role='dialog']:not([style])"),
        dialogOkBtn: () => this.elements.activeDialogBox().find('.cke_dialog_ui_button_ok'),
        dialogCancelBtn: () => this.elements.activeDialogBox().find('.cke_dialog_ui_button_cancel'),
        dialogTextArea: () => cy.get('.cke_dialog_ui_input_textarea textarea'),
        dialogUIHBoxTable: () => cy.get('.cke_dialog_ui_hbox_first table tbody'),
        cancelButton:()=>cy.get("tr.cke_dialog_ui_hbox span").contains("Cancel")
    }

    clickCancelButton(){
        this.elements.cancelButton().click();
    }

    clickOkBtn() {
        this.elements.okBtn().click();
    }

    clickDialogCancelBtn() {
        this.elements.dialogCancelBtn().click();
    }

    typeInCkeDialogTextArea(text) {
        this.elements.dialogTextArea().type(text);
    }

    clickTrTdDialogUIHBoxTable(cell, row) {
        this.elements.dialogUIHBoxTable().find('tr').eq(row - 1).find('td').eq(cell - 1).find('a').click();
    }

    clickDialogOkBtn() {
        this.elements.dialogOkBtn().click();
    }
}

export default new ckeDialogWindow();
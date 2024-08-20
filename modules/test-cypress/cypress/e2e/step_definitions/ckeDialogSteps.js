import { When, And, Then } from "cypress-cucumber-preprocessor/steps";
import ckeDialogWindow from "../pages/ckeDialogWindow";

Then(`cke dialog window is displayed with title {string}`, (title) => {
    ckeDialogWindow.elements.dialogTitle().should('have.text', title);
});

When(`click on ok button in cke dialog window`, () => {
    ckeDialogWindow.clickOkBtn();
});

When('type {string} in cke dialog textarea', function (text) {
    ckeDialogWindow.typeInCkeDialogTextArea(text);
});

When('click on cell {int} of row {int} of special character table in cke dialog window', function (cell, row) {
    ckeDialogWindow.clickTrTdDialogUIHBoxTable(cell, row);
});
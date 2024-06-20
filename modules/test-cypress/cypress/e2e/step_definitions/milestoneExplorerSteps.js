import { When, Then } from "cypress-cucumber-preprocessor/steps";
import dialogBoxPage from "../pages/dialogBoxPage";
import milestoneExplorer from "../pages/milestoneExplorer";

Then(`user is on milestone explorer window`, () => {
    dialogBoxPage.elements.dialogHeader().should('have.text', 'Milestone Explorer');
});

When(`click on close button in milestone explorer view`, () => {
    dialogBoxPage.clickCloseBtn();
});

Then(`milestone explorer window contains below tabs`, (datatable) => {
    const givenTabNameList = [];
    datatable.hashes().forEach((milestoneTabList) => {
        givenTabNameList.push(milestoneTabList.TabName);
    });
    milestoneExplorer.elements.tabItemLabel()
        .then(($els) => {
            return (
                Cypress.$.makeArray($els)
                    .map((el) => el.childNodes[0].textContent.trim())
            )
        })
        .should('deep.equal', givenTabNameList);
});

When(`click on export button present in milestone explorer window`, () => {
    if (Cypress.env('CE_ENV').includes("@nonlocal")) {
        milestoneExplorer.clickExportBtn();
    }
});
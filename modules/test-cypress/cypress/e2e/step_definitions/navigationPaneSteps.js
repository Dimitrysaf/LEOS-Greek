import { When, And, Then } from "cypress-cucumber-preprocessor/steps";
import navigationPane from "../pages/navigationPane";

And('toc editing button is displayed and enabled', () => {
    navigationPane.elements.editBtn().should('be.visible');
    navigationPane.elements.editBtn().should('not.be.disabled');
})

When(`click on toc edit button`, () => {
    navigationPane.clickEditBtn();
});

Then(`cancel button in navigation pane is displayed and enabled`, () => {
    navigationPane.elements.cancelBtn().should('be.visible');
    navigationPane.elements.cancelBtn().should('not.be.disabled');
});

Then(`below element lists are displayed in Elements menu`, (datatable) => {
    const actualElementList = [];
    datatable.hashes().forEach((element) => {
        actualElementList.push(element.ElementList);
    });
    navigationPane.elements.menuOptions()
        .then(($els) => {
            return (
                Cypress.$.makeArray($els)
                    // and extract inner text from each
                    .map((el) => el.innerText)
            )
        })
        .should('deep.equal', actualElementList)
});

When(`click on cancel button present in navigation pane`, () => {
    navigationPane.clickCancelBtn();
});
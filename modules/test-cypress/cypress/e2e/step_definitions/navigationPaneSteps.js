import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
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
//    datatable.hashes().forEach((element) => {
//        cy.contains(element.errormessage);
//        });
});

When(`click on cancel button present in navigation pane`, () => {
    navigationPane.clickCancelBtn();
});
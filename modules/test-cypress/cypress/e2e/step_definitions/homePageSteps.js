import { When, Then } from "cypress-cucumber-preprocessor/steps";
import homePage from "../pages/homePage";

Then('user is on home page', () => {
    homePage.elements.euiLabel().should('have.text', 'The online collaboration tool for drafting legislation');
})

When('click on view all acts button', () => {
    homePage.clickViewAllActs();
})
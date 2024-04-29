import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import navigationPane from "../pages/navigationPane";

And('toc editing button is displayed and enabled', () => {
    navigationPane.elements.editBtn().should('be.visible');
    navigationPane.elements.editBtn().should('be.enabled');
})



  
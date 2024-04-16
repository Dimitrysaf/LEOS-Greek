import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import navigationPane from "../pages/navigationPane";

And('toc editing button is available', () => {
    navigationPane.elements.editBtn().should('be.visible');
})



  
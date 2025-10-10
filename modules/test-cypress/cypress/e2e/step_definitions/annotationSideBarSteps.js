import { Then } from "@badeball/cypress-cucumber-preprocessor";
import annotationBar from "../pages/annotationBar";

Then('annotation side bar is present', () => {
    annotationBar.elements.annotationPane().should('be.visible');
})
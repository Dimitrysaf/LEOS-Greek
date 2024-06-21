import { And } from "cypress-cucumber-preprocessor/steps";
import annotationBar from "../pages/annotationBar";

And('annotation side bar is present', () => {
    annotationBar.elements.annotationPane().should('be.visible');
})
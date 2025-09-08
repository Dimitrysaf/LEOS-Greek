import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
require('@cypress/xpath');
import annotationBar from "../pages/annotationBar";

Then(/^annotation pane is minimized$/, function () {
    annotationBar.elements.annotationPaneMinimized().should('be.visible');
});

When(/^click on annotation forward pane$/, function () {
    annotationBar.clickAnnotationForwardPane();
});

Then(/^annotation pane is maximized$/, function () {
    annotationBar.elements.annotationPaneMaximized().should('be.visible');
});

When(/^click on annotation back pane$/, function () {
    annotationBar.clickAnnotationBackPane();
});
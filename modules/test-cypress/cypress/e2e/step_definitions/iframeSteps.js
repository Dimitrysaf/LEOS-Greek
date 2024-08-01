import { And } from "cypress-cucumber-preprocessor/steps";

And('click on option {string} in {string} iframe', function (option, iframeClass) {
    const iframe = cy.get("." + iframeClass).eq(0).its('0.contentDocument.body').then(cy.wrap);
    iframe.find(".cke_menuitem a[title='"+option+"']").click();
});

And('mouseover on option {string} in {string} iframe', function (option, iframeClass) {
    const iframe = cy.get("." + iframeClass).eq(0).its('0.contentDocument.body').then(cy.wrap);
    iframe.find(".cke_menuitem a[title='"+option+"']").click({ force: true });
});

When('click on sub option {string} in {string} iframe', function (subOption, iframeClass) {
    const iframe = cy.get("." + iframeClass).eq(1).its('0.contentDocument.body').then(cy.wrap);
    iframe.find(".cke_menuitem a[title='"+subOption+"']").click();
});
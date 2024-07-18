import { And } from "cypress-cucumber-preprocessor/steps";

const {When} = require("cucumber");

And(/^click on option "([^"]*)" in "([^"]*)" iframe$/, function (option, iframeClass) {
    const iframe = cy.get(iframeClass).eq(0).its('0.contentDocument.body').then(cy.wrap);
    iframe.find(".cke_menuitem a[title='"+option+"']").click();
});

And(/^mouseover on option "([^"]*)" in "([^"]*)" iframe$/, function (option, iframeClass) {
    const iframe = cy.get(iframeClass).eq(0).its('0.contentDocument.body').then(cy.wrap);
    iframe.find(".cke_menuitem a[title='"+option+"']").realHover({ position: "center" });
});

When(/^click on sub option "([^"]*)" in "([^"]*)" iframe$/, function (subOption, iframeClass) {
    const iframe = cy.get(iframeClass).eq(1).its('0.contentDocument.body').then(cy.wrap);
    iframe.find(".cke_menuitem a[title='"+subOption+"']").click();
});
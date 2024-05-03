const { defineConfig } = require("cypress");
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = defineConfig({
  defaultCommandTimeout: 15000,
  viewportHeight: 720,
  viewportWidth: 1280,
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('file:preprocessor', cucumber());
    },
    experimentalStudio: true,
    specPattern: "cypress/e2e/**/*.feature",
    watchForFileChanges: false
  },
  env: {
    localDraftingUrl: "localhost:8080/leos-pilot/ui/workspace",
    devDraftingUrl: "intragate.development.ec.europa.eu/decide-drafting/ui/",
    localUser1: "dasatya",
    localPasswordUser1: "demo",
    remoteUser1: "n000181h",
    remotePasswordUser1: "Poland1235"
  }
});

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
    watchForFileChanges: false,
  },
  env: {
    "localDraftingUrl": "localhost:8080/leos-pilot/ui",
    "devDraftingUrl": "intragate.development.ec.europa.eu/decide-drafting/ui/",
    "localImportProposalApiUrl": "http://localhost:8080/leos-pilot/api/secured/editlight/importProposal",
    "devImportProposalApiUrl": "https://intragate.development.ec.europa.eu/decide-drafting/api/secured/editlight/importProposal",
    "bearerTokenLocalUser1": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsIm5iZiI6MTcxODExNjQ1MSwiaXNzIjoiTGVvc0FwaUlkIiwiZXhwIjo0ODczNzkwMDUxLCJpYXQiOjE3MTgxMTY0NTEsInVzZXIiOiJqYW5lIn0.xekTwcJXri0tfCWkmt4niIeNDErsi7VWRnZT6SSX4rc',
    "bearerTokenRemoteUser1": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsIm5iZiI6MTcxODExNjczNywiaXNzIjoiUTJ4cFpXNTBTV1JPYjI1TWIyTmhiRVZ1ZG1seWIyNXRaVzUwY3ciLCJleHAiOjE3MTgxMjAzMzcsImlhdCI6MTcxODExNjczNywidXNlciI6Im4wMDAxODFoIn0.AFdV2VKO44zRPqgUpt0oQHzfXeU10sHPiRAXEgCkmFk'
  },
  browser: 'chrome',
});
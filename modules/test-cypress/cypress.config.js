const decompress = require('decompress');
const { defineConfig } = require("cypress");
const unzip = ({ path, file }) => decompress(path + '/' + file, path);
const path = require('path');
const fs = require('fs');

const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const esbuildPkg = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const createEsbuildPlugin =
    esbuildPkg.createEsbuildPlugin || esbuildPkg.default || esbuildPkg;

module.exports = {
  unzip,
}

module.exports = defineConfig({
  defaultCommandTimeout: 15000,
  viewportHeight: 720,
  viewportWidth: 1280,
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 1,
  video: false,
  e2e: {
    retries: {
        runMode: 2,    // CI
        openMode: 0    // local
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config, {
        experimentalSingleBuild: true,
        // // Enable Cucumber Messages and JSON reports
        // messages: { enabled: true, output: 'cucumber-messages.ndjson' }, // For low-level messages
        // json: { enabled: true, output: 'cucumber-report.json' }, // For Cucumber JSON output
      });
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-popup-blocking');
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--disable-features=VizDisplayCompositor');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--js-flags=--max-old-space-size=3072');
        }
        return launchOptions;
      });
      on("file:preprocessor", createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));
      on('task', {
        deleteFolder(folderName) {
          if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
          }
          return new Promise((resolve, reject) => {
            fs.rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
              if (err) {
                console.error(err)
                return reject(err)
              }
              resolve(null)
            })
          })
        },
      });
      on('task', {
        'unzipping': unzip
      });
      on('task', {
        getFiles: ({ downloadsPath, extension }) => {
          const files = fs.readdirSync(downloadsPath);
          const result = [];
          files.forEach(
              function (file) {
                const newBase = path.join(downloadsPath, file);
                if (!fs.statSync(newBase).isDirectory()) {
                  if (file.substr(-1 * (extension.length + 1)) === '.' + extension) {
                    result.push(file);
                  }
                }
                // else {
                //   result = getFiles({ downloadspath: newbase, extension: extension });
                // }
              }
          )
          return result;
        }
      });
      on('task', {
        getLatestFileName(folderPath) {
          const files = fs.readdirSync(folderPath);
          const sortedFiles = files
              .map(name => {
                const filePath = path.join(folderPath, name);
                return {
                  name,
                  time: fs.statSync(filePath).mtime.getTime(),
                };
              })
              .sort((a, b) => b.time - a.time);

          return sortedFiles.length ? sortedFiles[0].name : null;
        }
      });
      on('task', {
        log(message) {
          console.log(message)
          return null;
        },
      })
      return config;
    },
    experimentalStudio: true,
    specPattern: "cypress/e2e/**/*.feature",
    watchForFileChanges: false,
    chromeWebSecurity: false,
  },
  env: {
    "localDraftingUrl": "localhost:8080/leos-pilot/ui",
    "eCasAcceptanceUrl": "https://intragate.acceptance.ec.europa.eu/cas/login",
    "eCasProductionUrl": "https://intragate.ec.europa.eu/cas/login",
    "featureDraftingUrl": "https://intragate.development.ec.europa.eu/decide-features/ui/",
    "devDraftingUrl": "https://intragate.development.ec.europa.eu/decide-drafting/ui/",
    "testDraftingUrl": "https://intragate.test.ec.europa.eu/decide-drafting/ui/",
    "localImportProposalApiUrl": "http://localhost:8080/leos-pilot/api/secured/editlight/importProposal",
    "localImportDocumentApiUrl": "http://localhost:8080/leos-pilot/api/secured/leos-light/import-document",
    "localContextTokenApiUrl": "http://localhost:8080/leos-pilot/api/leos-light/context-token",
    "devImportProposalApiUrl": "https://intragate.development.ec.europa.eu/decide-drafting/api/secured/editlight/importProposal",
    "bearerTokenLocalUser1": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsIm5iZiI6MTcxODExNjQ1MSwiaXNzIjoiTGVvc0FwaUlkIiwiZXhwIjo0ODczNzkwMDUxLCJpYXQiOjE3MTgxMTY0NTEsInVzZXIiOiJqYW5lIn0.xekTwcJXri0tfCWkmt4niIeNDErsi7VWRnZT6SSX4rc',
    "bearerTokenRemoteUser1": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsIm5iZiI6MTcxODExNjczNywiaXNzIjoiUTJ4cFpXNTBTV1JPYjI1TWIyTmhiRVZ1ZG1seWIyNXRaVzUwY3ciLCJleHAiOjE3MTgxMjAzMzcsImlhdCI6MTcxODExNjczNywidXNlciI6Im4wMDAxODFoIn0.AFdV2VKO44zRPqgUpt0oQHzfXeU10sHPiRAXEgCkmFk'
  },
  browser: 'chrome',
});
const cucumber = require('cypress-cucumber-preprocessor').default;
const decompress = require('decompress');
const { defineConfig } = require("cypress");
const unzip = ({ path, file }) => decompress(path + '/' + file, path);
const path = require('path');
const fs = require('fs');

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
    setupNodeEvents(on) {
      // implement node event listeners here
      on("before:browser:launch", (browser, launchOptions) => {
        if (["chrome", "edge"].includes(browser.name)) {
          if (browser.isHeadless) {
            launchOptions.args.push("--no-sandbox");
            launchOptions.args.push("--disable-gl-drawing-for-tests");
            launchOptions.args.push("--disable-gpu");
          }
          launchOptions.args.push('--disable-dev-shm-usage');
        }
        return launchOptions;
      });
      on('file:preprocessor', cucumber());
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
        getFiles: ({ downloadspath, extension }) => {
          const files = fs.readdirSync(downloadspath);
          const result = [];
          files.forEach(
              function (file) {
                const newbase = path.join(downloadspath, file);
                if (!fs.statSync(newbase).isDirectory()) {
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
      })
    },
    experimentalStudio: true,
    specPattern: "cypress/e2e/**/*.feature",
    watchForFileChanges: false
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
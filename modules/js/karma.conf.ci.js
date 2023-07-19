/*
 * Copyright 2023 European Commission
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */

/**
 * Configuration used from Maven plugin
 */
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  console.log("*************** Running karma in CI pipeline ***************");
  config.set({
    basePath: '', // base path that will be used to resolve all patterns (eg. files, exclude)

    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      "karma.requirejs.config.js",
      "node_modules/requirejs/require.js",
      "node_modules/karma-requirejs/lib/adapter.js",
      "src/main/js/leosModulesBootstrap.js",
      {pattern: 'src/test/**/*.js', watched: true, served: true, included: false},
      {pattern: 'src/main/**/*.js', watched: true, served: true, included: false},
      "karma.main.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
    },

    plugins: [
        require('karma-jasmine'),
        require('karma-requirejs'),
        require('karma-spec-reporter'),
        require('karma-chrome-launcher')
    ],

    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false // disable the random running order
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['spec'],
    port: 9876,  // web server port
    colors: true,  // enable / disable colors in the output (reporters and logs)
    logLevel: config.LOG_INFO,
    autoWatch: true, // enable / disable watching file and executing tests whenever any file changes

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ["ChromeHeadless"],

    browserNoActivityTimeout: 60000,
    browserDisconnectTimeout: 60000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity
  })
}

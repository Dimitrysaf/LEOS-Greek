define(function specRunner(require) {
    "use strict";

    var $ = require("jquery");

    $.ajax({
        url: `/specs`,
        success: function(specs) {
            if (specs && specs.length > 0) {
                require(specs, function() {
                    var env = jasmine.getEnv();
                    const queryString = new jasmine.QueryString({
                        getWindowLocation: function() {
                          return window.location;
                        }
                    });
                    const filterSpecs = !!queryString.getParam('spec');
                    const htmlReporter = new jasmine.HtmlReporter({
                        env: env,
                        navigateWithNewParam: function(key, value) {
                          return queryString.navigateWithNewParam(key, value);
                        },
                        addToExistingQueryString: function(key, value) {
                          return queryString.fullStringWithNewParam(key, value);
                        },
                        getContainer: function() {
                          return document.body;
                        },
                        createElement: function() {
                          return document.createElement.apply(document, arguments);
                        },
                        createTextNode: function() {
                          return document.createTextNode.apply(document, arguments);
                        },
                        timer: new jasmine.Timer(),
                        filterSpecs: filterSpecs
                    });
                    env.addReporter(jsApiReporter);
                    env.addReporter(htmlReporter);
                    htmlReporter.initialize();
                    env.configure({ random: false });
                    env.execute();
                });
            }
        }
    });

});
define(function specRunner(require) {
    "use strict";

    var $ = require("jquery");

    $.ajax({
        url: `/specs`,
        success: function(specs) {
            if (specs && specs.length > 0) {
                require(specs, function() {
                    jasmine.getEnv().execute();
                });
            }
        }
    });

});
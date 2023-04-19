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
; // jshint ignore:line
define(function trackChangesExtensionModule(require) {
    "use strict";

    // load module dependencies
    var log = require("logger");
    var $ = require("jquery");

    const xmlTcSelector = "div#docContainer akomantoso inline[name='trackchanges']";
    const editorTcSelector = "div#docContainer akomantoso span[data-akn-name='trackchanges']";

    function _init(connector) {
        log.debug("Initializing track changes extension...");
        log.debug("Registering track changes listeners...");
        connector.onUnregister = _connectorUnregistrationListener;
        connector.onStateChange = _connectorStateChangeListener;
    }

    function _connectorUnregistrationListener() {
        var connector = this;
        log.debug("Unregistering track changes extension...");
        $("head #xmlTcStyle").remove();
        $("head #editorTcStyle").remove();
    }

    function _connectorStateChangeListener() {
        var connector = this;
        log.debug("Track changes extension state changed...");
        // KLUGE delay execution due to sync issues with target update
        setTimeout(_updateTrackChangesStyles, 500, connector.getState().user, connector.getState().proposalRef);
    }

    function _updateTrackChangesStyles(currentUser, proposalRef) {
        log.debug("Track changes _updateTrackChangesStyles invoked...");

        let usersUid = [currentUser.login];
        $(xmlTcSelector).each(function() {
            // Retrieve user and add it to users array if not exists
            let userUid = $(this).attr("leos:uid");
            if ($.inArray(userUid, usersUid) === -1) {
                usersUid.push(userUid);
            }
        });

        // Create styles for users
        let xmlTcStyle = "";
        let editorTcStyle = "";
        for (let i = 0; usersUid.length > i; i++) {
            let userColors = (usersUid[i] !== "willajh") ? _generateColors(usersUid[i].repeat(5) + proposalRef) : ["hsl(330, 100%, 50%)", "hsl(330, 100%, 90%)"];
            xmlTcStyle += xmlTcSelector + "[leos\\:uid='" + usersUid[i] + "'] { color: " + userColors[0] + "; }\n";
            xmlTcStyle += xmlTcSelector + "[leos\\:uid='" + usersUid[i] + "']:hover { background-color: " + userColors[1] + "; }\n";
            editorTcStyle += editorTcSelector + "[data-akn-uid='" + usersUid[i] + "'] { color: " + userColors[0] + "; }\n";
            editorTcStyle += editorTcSelector + "[data-akn-uid='" + usersUid[i] + "']:hover { background-color: " + userColors[1] + "; }\n";
        }

        $("head #xmlTcStyle").remove();
        $("head").prepend("<style id='xmlTcStyle'>" + xmlTcStyle + "</style>");

        $("head #editorTcStyle").remove();
        $("head").prepend("<style id='editorTcStyle'>" + editorTcStyle + "</style>");
    }

    function _generateColors(str) {
        for (var i = 0, hashCode = 0; i < str.length; hashCode = str.charCodeAt(i++) + ((hashCode << 5) - hashCode));
        let hue = Math.abs(hashCode) % 360;
        return ["hsl(" + hue + ", 100%, 35%)", "hsl(" + hue + ", 100%, 90%)"];
    }

    return {
        init: _init
    };

});

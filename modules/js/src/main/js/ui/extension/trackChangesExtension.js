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

    function _init(connector) {
        log.debug("Initializing Track Changes extension...");
        log.debug("Registering Track Changes listeners...");
        connector.onUnregister = _connectorUnregistrationListener;
        connector.onStateChange = _connectorStateChangeListener;
    }

    function _connectorUnregistrationListener() {
        var connector = this;
        log.debug("Unregistering Track Changes extension...");
    }

    function _connectorStateChangeListener() {
        var connector = this;
        log.debug("Track Changes extension state changed...");
        // KLUGE delay execution due to sync issues with target update
        setTimeout(_updateTrackChangesStyles, 500, connector.getState().user, connector.getState().proposalRef);
    }

    function _updateTrackChangesStyles(currentUser, proposalRef) {
        log.debug("Track Changes _updateTrackChangesStyles invoked...");

        let usersUid = [currentUser.login];
        $("div#docContainer akomantoso inline[name='trackchanges']").each(function() {
            let userUid = $(this).attr("leos:uid");
            if ($.inArray(userUid, usersUid) === -1) {
                usersUid.push(userUid);
            }
        });

        let xmlStyle = "";
        let editorStyle = "";
        for (let i = 0; usersUid.length > i; i++) {
            let userColor = (usersUid[i] !== "willajh") ? _generateColor(usersUid[i].repeat(5) + proposalRef) : "hsl(330, 100%, 50%)";
            xmlStyle += "div#docContainer akomantoso inline[name='trackchanges'][leos\\:uid='" + usersUid[i] + "'] { color: " + userColor + " }\n";
            editorStyle += "div#docContainer akomantoso span[data-akn-name='trackchanges'][data-akn-uid='" + usersUid[i] + "'] { color: " + userColor + " }\n";
        }

        $("head #trackChangesXmlStyle").remove();
        $("head").prepend("<style id='trackChangesXmlStyle'>" + xmlStyle + "</style>");

        $("head #trackChangesEditorStyle").remove();
        $("head").prepend("<style id='trackChangesEditorStyle'>" + editorStyle + "</style>");

        $("div#docContainer akomantoso inline[name='trackchanges']").hover(
            function() {
                $(this).append("<div>" + $(this).attr("leos:title") + "</div>");
                $(this).find("div").css("left", $(this).position().left + 10).fadeIn("fast");
            }, function() {
                $("div", this).remove();
            });
    }

    function _generateColor(str) {
        for (var i = 0, hashCode = 0; i < str.length; hashCode = str.charCodeAt(i++) + ((hashCode << 5) - hashCode));
        return "hsl(" + (Math.abs(hashCode) % 360) + ", 100%, 50%)";
    }

    return {
        init: _init
    };

});

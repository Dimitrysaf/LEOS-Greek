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
    var UTILS = require("core/leosUtils");

    function _init(connector) {
        log.debug("Initializing track changes extension...");
        log.debug("Registering track changes listeners...");
        connector.onUnregister = _connectorUnregistrationListener;
        connector.onStateChange = _connectorStateChangeListener;
    }

    function _connectorUnregistrationListener() {
        var connector = this;
        log.debug("Unregistering track changes extension...");
        $("head style[id$=TcStyle]").remove();
    }

    function _connectorStateChangeListener() {
        var connector = this;
        log.debug("Track changes extension state changed...");
        // KLUGE delay execution due to sync issues with target update
        setTimeout(_updateTrackChangesStyles, 500, connector.getState().user.login, connector.getState().proposalRef, connector.getState().isTrackChangesShowed);
    }

    function _updateTrackChangesStyles(currentUserId, proposalRef, isTrackChangesShowed) {
        var docTcStyle = UTILS.generateTrackChangesStyles(currentUserId, proposalRef, isTrackChangesShowed,
            "akomantoso inline[name='trackchanges']", "leos:uid", "leos:action");
        $("head #docTcStyle").remove();
        $("head").prepend("<style id='docTcStyle'>" + docTcStyle + "</style>");
    }

    return {
        init: _init
    };

});

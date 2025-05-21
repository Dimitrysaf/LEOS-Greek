/*
 * Copyright 2024 European Union
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
define(function refToLinkExtensionModule(require) {
    "use strict";

    // load module dependencies
    var log = require("logger");
    var $ = require("jquery");
    var refToLink = require("refToLink");
    var UTILS = require("core/leosUtils");
    var target;
    var otherTargets;
    var refLinkExecuted = false;

    function _initRefToLink(connector) {
        log.debug("Initializing refToLink extension...");

        target = UTILS.getParentElement(connector);
        otherTargets = connector.otherTargets;

        let R2L = window['R2L'];
        // configure ref2Link
        // See https://webgate.ec.europa.eu/fpfis/wikis/spaces/Ref2Link/pages/800752769/Ref2Link+Javascript+API+advanced+v1.3 for available options
        R2L.setOptions({
            //tooltipTrigger: 'notooltip',  //Disabling the tooltip
            worker: true,  // use a web worker for a smoother UX
            linkeddata: true // enable linked data
        });

        R2L.setFilter('environments', ['EC-PRD']);// enable sets of rules

        let elementsMetadata = JSON.parse(connector.getState().documentsMetadataJsonArray);

        if (Array.isArray(elementsMetadata) && elementsMetadata.length > 0 && elementsMetadata[0]?.language) {
            let lang = elementsMetadata[0].language.toUpperCase();
            require(['text!lib/ref2Link_1.3.29/data/rules.' + lang + '.json'], function (rulesJson) {
                const rules = JSON.parse(rulesJson);
                R2L.importRules(rules);

                log.debug("Registering refToLink extension unregistration listener...");
                connector.onUnregister = _connectorUnregistrationListener;

                log.debug("Registering refToLink extension state change listener...");
                connector.onStateChange = _connectorStateChangeListener;

                if (!refLinkExecuted){
                    _connectorStateChangeListener();
                }

            });
        } else {
            console.warn('No valid document or language found.');

            log.debug("Registering refToLink extension unregistration listener...");
            connector.onUnregister = _connectorUnregistrationListener;

            log.debug("Registering refToLink extension state change listener...");
            connector.onStateChange = _connectorStateChangeListener;
        }
    }

    // handle connector unregistration on client-side
    function _connectorUnregistrationListener() {
        log.debug("Unregistering refToLink extension...");
        R2L.clearCache();
    }

    // handle connector state change on client-side
    function _connectorStateChangeListener() {
        log.debug("refToLink extension state changed...");
        refLinkExecuted = true;
        // KLUGE delay execution due to sync issues with target update
        setTimeout(_registerObservers, 500);
    }

    function _registerObservers() {
        log.debug("Registering observers for elements...");
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting === true) { // Element appears in the screen
                    observer.unobserve(entry.target); // Element refreshed then not needed to observe anymore
                    setTimeout(_renderLinks, 1000, entry.target);
                }
            });
        });

        _addToObserver(["preface", "preamble", "aknbody > *", "mainbody > *", ".leos-authnote-table"]);

        function _addToObserver(selectors) {
            selectors.forEach(selector => {
                const elementsToObserve = document.querySelectorAll("#" + target.id + " " + selector);
                elementsToObserve.forEach(elementToObserve => observer.observe(elementToObserve));

                if (!!otherTargets && otherTargets.length > 0) {
                    for (const t of otherTargets) {
                        const targetElt = document.getElementById(t);
                        if (!!targetElt) {
                            const elementsToObserve = document.querySelectorAll("#" + targetElt.id + " " + selector);
                            elementsToObserve.forEach(elementToObserve => observer.observe(elementToObserve));
                        }
                    }
                }
            });
        }
    }

    function _renderLinks(el) {
        $(el).parseDeferred();
    }

    return {
        init: _initRefToLink
    };
});

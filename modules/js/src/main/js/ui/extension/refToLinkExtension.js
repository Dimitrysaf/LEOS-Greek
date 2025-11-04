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
    var CKEDITOR = require("promise!ckEditor");
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
            worker: true,  // use a web worker for a smoother UX
            linkeddata: true // enable linked data
        });

        R2L.setFilter('environments', ['EC-PRD']);// enable sets of rules

        let elementsMetadata;

        if (connector.getState().documentsMetadataJsonArray) {
            elementsMetadata = JSON.parse(connector.getState().documentsMetadataJsonArray);
        }

        if (Array.isArray(elementsMetadata) && elementsMetadata.length > 0 && elementsMetadata[0]?.language) {
            let lang = elementsMetadata[0].language.toUpperCase();
            require(['text!lib/ref2Link_1.3.30/data/rules.' + lang + '.json'], function (rulesJson) {
                const rules = JSON.parse(rulesJson);
                R2L.importRules(rules);
                R2L.bindTooltips();

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
                if (entry.isIntersecting === true) {
                    observer.unobserve(entry.target);
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

    function _getEditor() {
        var editor = CKEDITOR.currentInstance;
        if (!editor) {
            for (var name in CKEDITOR.instances) {
                if (CKEDITOR.instances.hasOwnProperty(name)) {
                    editor = CKEDITOR.instances[name];
                    break;
                }
            }
        }
        return editor;
    }


    function _renderLinks(el) {
        // Check 1: R2L library loaded
        if (!window['R2L'] || typeof window['R2L'].parse !== 'function') {
            console.warn('R2L not ready, retrying...');
            setTimeout(_renderLinks, 500, el);
            return;
        }

        const $clone = $(el).clone();

        // Check 2: jQuery extension loaded
        if (typeof $clone.parseDeferred !== 'function') {
            console.warn('parseDeferred not available, retrying...');
            setTimeout(_renderLinks, 500, el);
            return;
        }

        let editor = _getEditor();

        $clone.parseDeferred()[0].then(() => {
            const $links = $clone.find('.ref2link-generated');

            $links.each(function () {
                const $clonedLink = $(this);
                const refText = $clonedLink.text();

                safeInsertRef2Link(el, refText, $clonedLink, editor);
            });

            console.log('Ref2Link rendering completed.');
        }).catch(err => {
            console.error('Ref2Link parseDeferred failed:', err);
        });
    }


    function safeInsertRef2Link(targetElement, refText, $refLink, editor) {
        const linkNode = $refLink[0];
        const isEditorReady = editor && editor.status === 'ready';

        const walker = document.createTreeWalker(targetElement, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                const container = node.parentNode;
                if (container.closest('.cke_editable.cke_focus') || container.closest('.leos-editor-focus-first-double')) {
                    return NodeFilter.FILTER_REJECT;
                }
                if (node.parentNode.closest('.ref2link-generated')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return node.nodeValue.includes(refText)
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_SKIP;
            }
        });

        let node;
        while ((node = walker.nextNode())) {
            const text = node.nodeValue;
            const start = text.indexOf(refText);

            if (start === -1) {
                continue;
            }

            const parts = text.split(refText);
            if (parts.length === 2) {
                const frag = document.createDocumentFragment();
                if (parts[0]) frag.appendChild(document.createTextNode(parts[0]));
                frag.appendChild(linkNode.cloneNode(true));
                if (parts[1]) frag.appendChild(document.createTextNode(parts[1]));
                node.parentNode.replaceChild(frag, node);
            }


            return;
        }
    }

    return {
        init: _initRefToLink
    };
});

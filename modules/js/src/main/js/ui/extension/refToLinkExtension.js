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
define(["logger", "jquery", "refToLink", "core/leosUtils", "promise!ckEditor"], function refToLinkExtensionModule(log, $, refToLink, UTILS, CKEDITOR) {
    "use strict";

    // module dependencies are now properly loaded
    var target;
    var otherTargets;
    var refLinkExecuted = false;

    function _initRefToLink(connector) {
        console.log('[REF2LINK] Initializing refToLink extension...');
        log.debug("Initializing refToLink extension...");

        target = UTILS.getParentElement(connector);
        otherTargets = connector.otherTargets;

        let R2L = window['R2L'];
        console.log('[REF2LINK] R2L library status:', !!R2L, typeof R2L);
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
            console.log('[REF2LINK] Loading rules for language:', lang);
            require(['text!lib/ref2Link_1.3.30/data/rules.' + lang + '.json'], function (rulesJson) {
                console.log('[REF2LINK] Rules loaded successfully for', lang);
                const rules = JSON.parse(rulesJson);
                R2L.importRules(rules);
                R2L.bindTooltips();

                log.debug("Registering refToLink extension unregistration listener...");
                connector.onUnregister = _connectorUnregistrationListener;

                log.debug("Registering refToLink extension state change listener...");
                connector.onStateChange = _connectorStateChangeListener;

                if (!refLinkExecuted){
                    console.log('[REF2LINK] Triggering initial state change');
                    _connectorStateChangeListener();
                }

            }, function(error) {
                console.error('[REF2LINK] Failed to load rules for', lang, ':', error);
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
        console.log('[REF2LINK] State change triggered, refLinkExecuted:', refLinkExecuted);
        log.debug("refToLink extension state changed...");
        refLinkExecuted = true;
        // KLUGE delay execution due to sync issues with target update
        setTimeout(_registerObservers, 500);
    }

    function _registerObservers() {
        console.log('[REF2LINK] Registering observers for target:', target?.id);
        log.debug("Registering observers for elements...");
        const observer = new IntersectionObserver(function (entries) {
            console.log('[REF2LINK] Observer triggered for', entries.length, 'entries');
            entries.forEach(entry => {
                if (entry.isIntersecting === true) {
                    console.log('[REF2LINK] Element intersecting, scheduling render for:', entry.target.tagName);
                    observer.unobserve(entry.target);
                    setTimeout(_renderLinks, 1000, entry.target);
                }
            });
        });

        _addToObserver(["preface", "preamble", "aknbody > *", "mainbody > *", ".leos-authnote-table"]);

        function _addToObserver(selectors) {
            selectors.forEach(selector => {
                const elementsToObserve = document.querySelectorAll("#" + target.id + " " + selector);
                console.log('[REF2LINK] Found', elementsToObserve.length, 'elements for selector:', selector);
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
        console.log('[REF2LINK] _renderLinks called for element:', el.tagName, el.id);
        
        // Check 1: R2L library loaded
        if (!window['R2L'] || typeof window['R2L'].parse !== 'function') {
            console.warn('[REF2LINK] R2L not ready, retrying... Available methods:', Object.keys(window['R2L'] || {}));
            setTimeout(_renderLinks, 500, el);
            return;
        }

        // Check 2: jQuery extension loaded (from ref2link bundle)
        if (typeof $.fn.parseDeferred !== 'function') {
            console.warn('[REF2LINK] parseDeferred not available, retrying... Available jQuery methods:', Object.keys($.fn).filter(k => k.includes('parse')));
            // Force load ref2link bundle if not loaded
            if (!document.querySelector('script[src*="ref2link.bundle.js"]')) {
                console.log('[REF2LINK] ref2link bundle not found, may need manual loading');
            }
            setTimeout(_renderLinks, 500, el);
            return;
        }
        
        console.log('[REF2LINK] All dependencies ready, proceeding with parseDeferred');
        const $clone = $(el).clone();

        let editor = _getEditor();

        $clone.parseDeferred()[0].then(() => {
            const $links = $clone.find('.ref2link-generated');
            console.log('[REF2LINK] parseDeferred completed, found', $links.length, 'generated links');

            $links.each(function () {
                const $clonedLink = $(this);
                const refText = $clonedLink.text();
                console.log('[REF2LINK] Processing link with text:', refText);

                safeInsertRef2Link(el, refText, $clonedLink, editor);
            });

            console.log('[REF2LINK] Ref2Link rendering completed for', $links.length, 'links');
        }).catch(err => {
            console.error('[REF2LINK] parseDeferred failed:', err);
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

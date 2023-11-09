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
define(function leosTextHighlightPluginModule(require) {
    "use strict";

    var LOG = require("logger");
    var pluginTools = require("plugins/pluginTools");
    var pluginName = "leosTextHighlight";
    var DEFAULT_AUTO_TITLE = "Default";

    var pluginDefinition = {
        init: function init(editor) {
            _enableHighlightButton(editor);
            editor.on("saveSnapshot", _resolveOverlappedSpans);
            editor.on("activeFilterChange", _cancelActiveFilter, null, null, 1);
            editor.on("lockSnapshot", _changeColorDialogAutoTitle);
            editor.on("toHtml", _disableContentFilterInHeading, null, null, 1);
        }
    }

    function _disableContentFilterInHeading(event) {
        if(event.data && event.data.context === 'h2' && !event.data.filter.disabled) {
                event.data.filter.disabled = true;
        }
    }

    function _changeColorDialogAutoTitle(event) {
        var langCode = event.editor.langCode;
        var autoTitle = langCode &&  event.editor.plugins.colorbutton && event.editor.plugins.colorbutton.langEntries[langCode].auto;
        if (autoTitle && autoTitle.trim() !== DEFAULT_AUTO_TITLE) {
            event.editor.plugins.colorbutton.langEntries[langCode].auto = DEFAULT_AUTO_TITLE;
        }
    }

    function _cancelActiveFilter(ev) {
        /*This change is done for bug(#3) here https://code.europa.eu/leos/core/-/issues/897#note_66261.
        Highlight plugin of Ckeditor 4, is not associated with any explicit command definition. So it is not possible
        to change the state. So to prevent state change here activeFilterChange event is cancelled.*/
        ev.cancel();
    }

    function _resolveOverlappedSpans(evt) {
        var editedElement = evt.editor.element.getChildren().toArray()
            .find((element) => element && element.getAttribute && (element.getAttribute('data-akn-element') === evt.editor.LEOS.elementType
                || element.getAttribute('data-akn-name') === evt.editor.LEOS.elementType));
        var highlightedSpans = editedElement && $(editedElement.$).find('span[data-akn-style]').toArray();
        if (highlightedSpans) {
            for (let i = 0; i < highlightedSpans.length; i++) {
                var childSpans = $(highlightedSpans[i]).children('span[style]');
                var datAknStyleAttr = highlightedSpans[i].getAttribute('data-akn-style');
                var styleAttr = highlightedSpans[i].getAttribute('style');
                if (childSpans.length > 0) {
                    childSpans.insertAfter($(highlightedSpans[i]));
                    $(highlightedSpans[i]).remove();
                } else if (!(datAknStyleAttr && datAknStyleAttr === "bgcolor" && styleAttr)) {
                    highlightedSpans[i].insertAdjacentText('afterend', highlightedSpans[i].textContent);
                    highlightedSpans[i].remove();
                }
            }
        }
    }

    function _enableHighlightButton(editor) {
        if (!editor.LEOS.isTrackChangesEnabled) {
            if(editor.config.removeButtons === "") {
                editor.config.removeButtons = 'BGColor';
            } else {
                editor.config.removeButtons = editor.config.removeButtons + ',BGColor';
            }
        }
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var transformationConfig = {
        akn : "inline[name=bgcolor]",
        html : "span[style]",
        attr : [{
            akn : "xml:id",
            html : "id"
        },{
            akn: "style",
            html : "style"
        },{
            akn: "name=bgcolor",
            html : "data-akn-style=bgcolor"
        }],
        sub : {
            akn : "text",
            html : "span/text"
        }
    };

    // return plugin module
    var pluginModule = {
        name : pluginName,
        transformationConfig : transformationConfig
    };

    pluginTools.addTransformationConfigForPlugin(transformationConfig, pluginName);

    return pluginModule;
});

/*
 * Copyright 2025 European Union
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
define(function aknHTMLPluginUtilsModule(require) {
    "use strict";

    var $ = require('jquery');

    function _resolveNestedStyleElements(event) {
        const selection = event.editor.getSelection();
        const range = selection.getRanges()[0];
        const startContainer = range.startContainer.$;
        const endContainer = range.endContainer.$;
        if (!(startContainer === endContainer)) {
            // Get the parent element
            var parentSub = $(event.editor.getSelection().getRanges()[0].endContainer.$).parent();
            // Find the child element inside the parent
            var childSub = parentSub && parentSub.find(event.data.command.style.element);
            // Get the text of the child
            var childText = childSub && childSub.text();
            // Prepend the child text to the parent's own text
            parentSub.prepend(childText);
            // Remove the child element
            childSub && childSub.remove();
        }
    }

    return {
        resolveNestedStyleElements: _resolveNestedStyleElements,
    };
});

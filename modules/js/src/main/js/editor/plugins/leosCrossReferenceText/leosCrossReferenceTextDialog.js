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
define(function leosCrossReferenceTextDialogModule(require) {
    "use strict";

    var pluginTools = require("plugins/pluginTools");
    var $ = require("jquery");
    var pluginName = "leosCrossReferenceText";
    var cssPath = pluginTools.getResourceUrl(pluginName, "css/leosCrossReferenceText.css");

    var dialogDefinition = {
        dialogName: "leosCrossReferenceTextDialog"
    };

    dialogDefinition.initializeDialog = function initializeDialog(editor) {
        return {
            title: "Edit Internal Reference Text",
            minWidth: 400,
            minHeight: 50,
            resizable: CKEDITOR.DIALOG_RESIZE_NONE,
            contents: [{
                id: "crossReferenceTextTab",
                elements: [{
                    id: "crossReferenceTextInputs",
                    type: "html",
                    html: '<div id="crossReferenceTextContainer"></div>' +
                          '<div id="crossReferenceTextLegend">' +
                              '<span class="crossref-legend-swatch crossref-legend-swatch--ref"></span> Reference &nbsp;&nbsp;' +
                              '<span class="crossref-legend-swatch crossref-legend-swatch--text"></span> Text' +
                          '</div>' +
                          '<div id="crossReferenceTextError"></div>'
                }]
            }],
            onLoad: function() {
                appendPluginCss(cssPath);
            },
            onShow: function() {
                var mrefElement = editor.LEOS.mrefElement;
                if (!mrefElement) return;

                var parts = parseCrossReferenceText(mrefElement);
                this._.mrefParts = parts;
                renderInputs(parts);
            },
            onOk: function() {
                var parts = this._.mrefParts;
                var mrefElement = editor.LEOS.mrefElement;
                if (!parts || !mrefElement) return;

                var valid = true;
                parts.forEach(function(part, i) {
                    if (part.type === "ref") {
                        var input = document.getElementById("crossRefInput_" + i);
                        if (input && input.value.trim() === "") {
                            input.classList.add("crossref-input--invalid");
                            valid = false;
                        }
                    }
                });
                if (!valid) {
                    document.getElementById("crossReferenceTextError").textContent = "Reference text cannot be empty.";
                    return false;
                }

                var changed = false;
                parts.forEach(function(part, i) {
                    var input = document.getElementById("crossRefInput_" + i);
                    if (input && input.value !== part.text) {
                        part.text = input.value;
                        changed = true;
                    }
                });

                if (changed) {
                    applyToCrossReferenceText(mrefElement, parts);
                    editor.fire("change");
                }
            }
        };
    };

    function parseCrossReferenceText(mrefElement) {
        var parts = [];
        var childNodes = mrefElement.$.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (node.nodeType === Node.TEXT_NODE) {
                parts.push({ type: "text", text: node.textContent });
            } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === "ref") {
                parts.push({ type: "ref", text: node.textContent, element: node });
            }
        }
        if (parts.length === 0 || parts[0].type !== "text") {
            parts.unshift({ type: "text", text: "" });
        }
        if (parts[parts.length - 1].type !== "text") {
            parts.push({ type: "text", text: "" });
        }
        for (var j = parts.length - 1; j > 0; j--) {
            if (parts[j].type === "ref" && parts[j - 1].type === "ref") {
                parts.splice(j, 0, { type: "text", text: "" });
            }
        }
        return parts;
    }

    function renderInputs(parts) {
        var container = document.getElementById("crossReferenceTextContainer");
        container.innerHTML = "";
        document.getElementById("crossReferenceTextError").textContent = "";

        parts.forEach(function(part, i) {
            var input = document.createElement("input");
            input.type = "text";
            input.id = "crossRefInput_" + i;
            input.value = part.text;
            input.className = "crossref-input crossref-input--" + part.type;
            input.placeholder = part.type === "ref" ? "ref" : "...";
            input.title = part.type === "ref" ? "Click to edit reference" : "Click to edit text";

            autoResizeInput(input);
            input.addEventListener("input", function() {
                autoResizeInput(this);
                if (part.type === "ref") {
                    this.classList.remove("crossref-input--invalid");
                    document.getElementById("crossReferenceTextError").textContent = "";
                }
            });

            container.appendChild(input);
        });
    }

    function autoResizeInput(input) {
        // Create a temporary span to measure text width
        var span = document.createElement("span");
        span.style.fontFamily = input.style.fontFamily;
        span.style.fontSize = input.style.fontSize;
        span.style.visibility = "hidden";
        span.style.whiteSpace = "pre";
        span.textContent = input.value || input.placeholder || "";
        document.body.appendChild(span);
        var width = Math.max(span.offsetWidth + 6, 30);
        document.body.removeChild(span);

        input.style.width = width + "px";
    }

    function applyToCrossReferenceText(mrefElement, parts) {
        while (mrefElement.$.firstChild) {
            mrefElement.$.removeChild(mrefElement.$.firstChild);
        }
        parts.forEach(function(part) {
            if (part.type === "text") {
                if (part.text) {
                    mrefElement.$.appendChild(document.createTextNode(part.text));
                }
            } else if (part.type === "ref") {
                part.element.textContent = part.text;
                mrefElement.$.appendChild(part.element);
            }
        });
    }

    function appendPluginCss(css) {
        $('<link>').appendTo('head').attr({
            type: 'text/css',
            rel: 'stylesheet',
            href: css
        });
    }

    return dialogDefinition;
});

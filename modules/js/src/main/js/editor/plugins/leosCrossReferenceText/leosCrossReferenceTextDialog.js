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
                    html: '<div id="crossReferenceTextContainer" style="display:flex;flex-wrap:wrap;align-items:center;font-family:serif;font-size:14px;line-height:1.5;padding:10px 0;"></div>' +
                          '<div style="margin-top:8px;font-size:11px;color:#666;"><span style="display:inline-block;width:10px;height:10px;background:#e6f3ff;border:1px solid #0066cc;border-radius:2px;vertical-align:middle;margin-right:3px;"></span> Reference &nbsp;&nbsp;<span style="display:inline-block;width:10px;height:10px;background:transparent;border:1px dashed #ccc;border-radius:2px;vertical-align:middle;margin-right:3px;"></span> Text</div>' +
                          '<div id="crossReferenceTextError" style="color:red;font-weight:bold;margin-top:8px;font-size:12px;"></div>'
                }]
            }],
            onShow: function() {
                var dialog = this;
                var mrefElement = editor.LEOS.mrefElement;
                if (!mrefElement) return;

                var parts = parseCrossReferenceText(mrefElement);
                dialog._.mrefParts = parts;
                renderInputs(parts);
            },
            onOk: function() {
                var dialog = this;
                var parts = dialog._.mrefParts;
                var mrefElement = editor.LEOS.mrefElement;
                if (!parts || !mrefElement) return;

                // Validate: ref inputs must not be blank
                var valid = true;
                parts.forEach(function(part, i) {
                    if (part.type === "ref") {
                        var input = document.getElementById("mrefInput_" + i);
                        if (input && input.value.trim() === "") {
                            input.style.backgroundColor = "#ffdddd";
                            input.style.borderColor = "#cc0000";
                            valid = false;
                        }
                    }
                });
                if (!valid) {
                    var errEl = document.getElementById("crossReferenceTextError");
                    if (errEl) errEl.textContent = "Reference text cannot be empty.";
                    return false;
                }

                var changed = false;
                parts.forEach(function(part, i) {
                    var input = document.getElementById("mrefInput_" + i);
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
        // Ensure there's a text part before the first ref and after the last ref
        if (parts.length === 0 || parts[0].type !== "text") {
            parts.unshift({ type: "text", text: "" });
        }
        if (parts[parts.length - 1].type !== "text") {
            parts.push({ type: "text", text: "" });
        }
        // Ensure there's a text part between consecutive refs
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
            input.id = "mrefInput_" + i;
            input.value = part.text;

            // Common styles
            input.style.fontFamily = "inherit";
            input.style.fontSize = "inherit";
            input.style.padding = "2px 1px";
            input.style.margin = "2px";
            input.style.minWidth = "30px";
            input.style.boxSizing = "border-box";
            input.style.outline = "none";

            input.style.cursor = "text";
            input.style.transition = "box-shadow 0.15s, border-color 0.15s";

            if (part.type === "ref") {
                input.style.backgroundColor = "#e6f3ff";
                input.style.border = "1px solid #0066cc";
                input.style.borderRadius = "3px";
                input.placeholder = "ref";
                input.title = "Click to edit reference";
            } else {
                input.style.backgroundColor = "transparent";
                input.style.border = "1px dashed #ccc";
                input.style.borderRadius = "2px";
                input.placeholder = "...";
                input.title = "Click to edit text";
            }

            // Hover effect
            input.addEventListener("mouseenter", function() {
                if (document.activeElement !== this) {
                    this.style.boxShadow = "0 0 3px rgba(0,102,204,0.3)";
                }
            });
            input.addEventListener("mouseleave", function() {
                if (document.activeElement !== this) {
                    this.style.boxShadow = "none";
                }
            });

            // Focus effect
            input.addEventListener("focus", function() {
                this.style.boxShadow = "0 0 4px rgba(0,102,204,0.5)";
                this.style.borderColor = "#0066cc";
            });
            input.addEventListener("blur", function() {
                this.style.boxShadow = "none";
                if (part.type !== "ref") {
                    this.style.borderColor = "#ccc";
                }
            });

            // Auto-resize based on content
            autoResizeInput(input);
            input.addEventListener("input", function() {
                autoResizeInput(this);
                if (part.type === "ref") {
                    this.style.backgroundColor = "#e6f3ff";
                    this.style.borderColor = "#0066cc";
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
        var width = span.offsetWidth + 6; // Add padding
        document.body.removeChild(span);
        input.style.width = Math.max(width, 30) + "px";
    }

    function applyToCrossReferenceText(mrefElement, parts) {
        // Clear existing content
        while (mrefElement.$.firstChild) {
            mrefElement.$.removeChild(mrefElement.$.firstChild);
        }
        // Rebuild from parts
        parts.forEach(function(part) {
            if (part.type === "text") {
                if (part.text) {
                    mrefElement.$.appendChild(document.createTextNode(part.text));
                }
            } else if (part.type === "ref") {
                var refEl = part.element;
                refEl.textContent = part.text;
                mrefElement.$.appendChild(refEl);
            }
        });
    }

    return dialogDefinition;
});

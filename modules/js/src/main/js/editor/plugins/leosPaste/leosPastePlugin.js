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
/**
 * @fileOverview Handles the tables. It uses the transformer 'leosPasteTransformer' more information could be found here
 * https://webgate.ec.europa.eu/CITnet/confluence/display/LEOS/Annex+Mappings
 */
; // jshint ignore:line
define(function leosPastePluginModule(require) {
    'use strict';

    // load module dependencies
    let pluginTools = require('plugins/pluginTools');
    let pluginName = 'leosPaste';
    let REF = "ref";
    let MREF = "mref";

    let pluginDefinition = {
        init: function init(editor) {

            editor.on('paste', function (evt) {
                let dataValue = evt.data.dataValue.trim();
                let hasTable = dataValue.includes('<table');
                let isWordContent = isContentFromWordOrXls(dataValue);

                // In tableOnlyMode, treat table paste as regular content (only extract text, don't create new tables)
                if (hasTable && (isWordContent || dataValue.startsWith('<table')) && !editor.config.tableOnlyMode) {
                    evt.data.dataValue = cleanWordTable(dataValue);
                } else {
                    evt.data.dataValue = processRegularContent(editor, dataValue, evt.data.type);
                }
            }, 7);
        }
    };

    // Process regular (non-table, non-image) content
    function processRegularContent(editor, dataValue, type) {
        // Clean up HTML entities and tags
        dataValue = dataValue.replaceAll(/\sid=".*?"/g, '')
            .replaceAll(/\sdata-akn-mp-id=".*?"/g, '')
            .replaceAll(/<em /g, '<i ')
            .replaceAll(/<em>/g, '<i>')
            .replaceAll(/<\/em>/g, '<\/i>')
            .replaceAll(/<strong/g, '<b')
            .replaceAll(/strong>/g, 'b>')
            .replace(/&amp;nbsp;/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&#xa0;/g, ' ')
            .replace(/&amp;#xa0;/g, ' ')
            .replace(/\u00A0/g, ' ')
            .replace(/&#160;/g, ' ');

        dataValue = _stripHtmlSecurely(dataValue);
        let fragment = CKEDITOR.htmlParser.fragment.fromHtml(dataValue);
        fragment.forEach(function (node) {
            node.editor = editor;
        });

        _processPaste(editor, fragment, type);

        let writer = new CKEDITOR.htmlParser.basicWriter();
        fragment.writeHtml(writer);
        return writer.getHtml(false);
    }

    function isContentFromWordOrXls(htmlString) {
        return htmlString.includes('MsoTable') || htmlString.includes('data-tablestyle') ||
        htmlString.includes('mso-') || htmlString.includes('class=Mso') || htmlString.includes('xmlns:w=') ;
    }

    function cleanWordTable(htmlString, isWordContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const table = doc.querySelector('table');

        if (!table) return '';

        // 1. Remove Word/Excel specific attributes from table
        const wordAttrs = ['border', 'dir', 'data-tablestyle', 'data-tablelook', 'aria-rowcount',
            'cellspacing', 'cellpadding', 'class', 'style'];
        wordAttrs.forEach(attr => table.removeAttribute(attr));

        // 2. Normalize table structure (keep tbody for proper HTML)
        let tbody = table.querySelector('tbody');
        if (!tbody) {
            tbody = doc.createElement('tbody');
            const rows = Array.from(table.querySelectorAll('tr'));
            rows.forEach(row => tbody.appendChild(row));
            table.appendChild(tbody);
        }

        // 3. Process all Rows
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            // Remove Word-specific row attributes
            const rowAttrsToRemove = [];
            for (let i = 0; i < row.attributes.length; i++) {
                const attr = row.attributes[i];
                // Keep only data-akn-* attributes
                if (!attr.name.startsWith('data-akn-')) {
                    rowAttrsToRemove.push(attr.name);
                }
            }
            rowAttrsToRemove.forEach(attr => row.removeAttribute(attr));

            // 4. Process all Cells (td and th)
            const cells = row.querySelectorAll('td, th');
            cells.forEach(cell => {
                // Preserve colspan/rowspan before cleaning
                const colspan = cell.getAttribute('colspan');
                const rowspan = cell.getAttribute('rowspan');
                const width = cell.getAttribute('width');

                // Get clean text content
                const cleanText = cell.textContent.trim();

                // Remove all attributes
                while (cell.attributes.length > 0) {
                    cell.removeAttribute(cell.attributes[0].name);
                }

                // Restore structural attributes if they existed and are meaningful
                if (colspan && colspan !== '1') {
                    cell.setAttribute('colspan', colspan);
                }
                if (rowspan && rowspan !== '1') {
                    cell.setAttribute('rowspan', rowspan);
                }

                // Optionally preserve width for better layout
                if (width && isWordContent) {
                    cell.setAttribute('width', width);
                }

                // Replace messy innerHTML with clean <p> tag
                if (cleanText) {
                    cell.innerHTML = `<p>${cleanText}</p>`;
                } else {
                    // Handle empty cells
                    cell.innerHTML = '<p>&nbsp;</p>';
                }
            });
        });

        table.setAttribute('border', '1');
        table.setAttribute('style', 'width: 100%; border-collapse: collapse;');
        table.setAttribute('data-akn-name', 'leosTable');

        return table.outerHTML;
    }

    var numberingRegex = new RegExp(/^\s*[([{]?.{1,3}(\..{1,2})*[.)\]}]?\s*$/);
    var htmlFilter = new CKEDITOR.htmlParser.filter({
        elements: {
            $: function (element) {
                //remove all styles and classes
                delete element.attributes.style;
                delete element.attributes.class;

                if (numberingRegex.test(element.getHtml()) && element.name !== REF && element.name !== MREF && element.parent) {
                    return false;
                }

                //remove element if element is block element and not allowed in editor
                if (element.parent
                    && (CKEDITOR.dtd.$block[element.name] // p etc any block element
                        || !allowedInEditor(element) )) { //TODO find solution for table in article
                    element.replaceWithChildren();
                }

                function allowedInEditor(element){
                    return (element.editor.config.pasteFilter.replace(/\[\*\]/g,'').split('; ').includes(element.name));
                }
            },
            u: function (element) {
                if (element.parent) {// if not already removed
                    var textContent = convertElementToText(element).trim();
                    if (!textContent) {//if empty, remove
                        return false;
                    }
                    element.replaceWith(element);
                }
            },
            b: function (element) {
                if (element.parent) {// if not already removed
                    var textContent = convertElementToText(element).trim();
                    if (!textContent) {//if empty, remove
                        return false;
                    }
                    element.replaceWith(element);
                }
            },
            i: function (element) {
                if (element.parent) {// if not already removed
                    var textContent = convertElementToText(element).trim();
                    if (!textContent) {//if empty, remove
                        return false;
                    }
                    element.replaceWith(element);
                }
            },
            sup: function (element) {
                if (element.parent) {// if not already removed
                    var textContent = convertElementToText(element).trim();
                    if (!textContent) {//if empty, remove
                        return false;
                    }
                    element.replaceWith(element);
                }
            },
            sub: function (element) {
                if (element.parent) {// if not already removed
                    var textContent = convertElementToText(element).trim();
                    if (!textContent) {//if empty, remove
                        return false;
                    }
                    element.replaceWith(element);
                }
            },
            a: function (element) {
                if (element.parent) {// if not already removed
                    //Convert to Authnote??
                    var textContent = convertElementToText(element).trim();
                    if (!textContent) {//if empty, remove
                        return false;
                    }
                    element.replaceWith(new CKEDITOR.htmlParser.text(textContent));
                }
            },
            span: function (element) {
                //Span needs to be kept as text only
                if (element.parent) {// if not already removed
                    var textContent = convertElementToText(element);//TODO find solution for bold/italic
                    element.replaceWith(new CKEDITOR.htmlParser.text(textContent));
                }
            },
            p:function (element) {
                //P will stay as it is but all its children will be accumulated into a single text node
                if (element.parent) {
                    // 1. Filter the children first (allows $ handler to clean up nested junk)
                    element.filterChildren(htmlFilter);
                    var text = '';
                    var childrenToRemove = []; // Store children references to remove them safely later
                    // 2. Iterate and collect all text content
                    for (var i = 0; i < element.children.length; i++) {
                        var child = element.children[i];
                        // If a child somehow lost its parent but is still in the list, re-assign it
                        // (This handles intermediate filtering steps)
                        if (!child.parent) {
                            child.parent = element;
                        }
                        // Convert the child node (and its descendants) to plain text
                        text += convertElementToText(child);
                        // Mark the child for removal
                        childrenToRemove.push(child);
                    }
                    // 3. Clean up the children first (important to avoid confusion with the parser)
                    for (var j = 0; j < childrenToRemove.length; j++) {
                        // Check if the child still has a parent (i.e., is still attached) before removing
                        if (childrenToRemove[j].parent) {
                            childrenToRemove[j].remove();
                        }
                    }
                    // 4. Add the single, concatenated text node back to the parent <p> element
                    if (text) {
                        element.add(new CKEDITOR.htmlParser.text(text));
                    }
                }
            },
            br: function (element) {
                if (element.parent) {
                    return false;
                }
            }
        }
    });

    function convertElementToText(node){
        if(node.type == CKEDITOR.NODE_TEXT){
            return node.value;
        }
        var text = '';
        for ( var i = 0, len = node.children.length; i < len; i++ ) {
            if(node.children[i].type == CKEDITOR.NODE_ELEMENT) {
                text += convertElementToText(node.children[i]);
            }
            else if(node.children[i].type == CKEDITOR.NODE_TEXT) {
                text+=node.children[i].value;
            }
        }
        return text;
    }

    function _processPaste(editor, fragment, type) {
        //Check for <span> as widget and extract its child to be added as first child
        var idx = _isWidgetPresent(fragment);
        if(idx && idx != -1) {
            let child = fragment.children[idx].getFirst(); //get first child as widget
            fragment.children[idx].replaceWith(child);
        }
        if (type === 'html') {
            fragment.filter(htmlFilter); //clean using filter for html and text
            _convertToAknXmlFragment(editor, fragment);
            _wrapUnderMref(fragment);
        }
        else if (type === 'text') {
            if(_hasElementNodes(fragment)) {
                fragment.filter(htmlFilter);//clean using filter for html and text
                _convertToAknXmlFragment(editor, fragment);
            }
            //it will come here as text for PDF
            //TODO
        }
    }

    function _isWidgetPresent(fragment) {
        if(!fragment || !fragment.children || fragment.children.length <= 0) {
            return -1;
        }
        for ( var idx = 0, len = fragment.children.length; idx < len; idx++ ) {
            if(fragment.children[idx].type == CKEDITOR.NODE_ELEMENT) {
                return fragment.children[idx].attributes && fragment.children[idx].attributes.class &&
                fragment.children[idx].attributes.class.includes('cke_widget_wrapper') ? idx : -1;
            }
        }
    }

    function _wrapUnderMref(fragment) {

        let refChildren = fragment.children.filter(function (child) {
            return child.name === REF;
        });
        if(refChildren && refChildren.length > 0) {
            // Create a new mref node
            let mref = new CKEDITOR.htmlParser.element('mref');
            //add existing children to mref
            fragment.children.forEach(function (child) {
                mref.add(child);
            });
            //clear the exising children
            fragment.children = [];
            //add the new mref node to fragment
            fragment.add(mref);
        }
    }

    function _hasElementNodes(fragment) {
        if(!fragment || !fragment.children || fragment.children.length <= 0) {
            return false;
        }
        for ( var idx = 0, len = fragment.children.length; idx < len; idx++ ) {
            if(fragment.children[idx].type == CKEDITOR.NODE_ELEMENT) {
                return true;
            }
        }
        return false;
    }

    function _convertToAknXmlFragment(editor, fragment) {
        var configElement = editor.config.defaultPasteElement;// this should come from profile
        if (configElement) {
            configElement
                .split('/')
                .reverse()
                .filter(tag =>(tag !== 'text'))
                .forEach(
                    function (currentValue, index, array) {
                        for (var i = 0; i < fragment.children.length; i++) {
                            fragment.children[i].wrapWith(new CKEDITOR.htmlParser.element(currentValue, {}));
                        }
                    }
                );
        }//else let it be text
    }

    function _stripHtmlSecurely(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Select all script and style tags and remove them
        const elements = doc.querySelectorAll('script, style');
        elements.forEach(el => el.remove());

        return doc.body.textContent || "";
    }

    pluginTools.addPlugin(pluginName, pluginDefinition);

    // return plugin module
    var pluginModule = {
        name: pluginName,
    };

    return pluginModule;
});

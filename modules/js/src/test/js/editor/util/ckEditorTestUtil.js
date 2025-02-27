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

define(function ckEditorTestUtil(require) {
    "use strict";

    var CKEDITOR = require("promise!ckEditor");

    function findOrCreatePlaceholder() {
        var placeholder = document.getElementById("leos-placeholder");
        if(!placeholder || placeholder == null) {
            var htmlString = '<div id="leos-placeholder" class="leos-placeholder" data-wrapped-id="123" style="height:10px"></div>';
            placeholder = document.createElement('div');
            placeholder.innerHTML = htmlString.trim();
            document.body.appendChild(placeholder.firstChild);
            placeholder = document.getElementById("leos-placeholder");
        }
        return placeholder;
    }

    async function _initializeEditor(extraPluginsName) {
        console.log("Initializing editor...");
       
        var promise = new Promise((resolve, reject) => {
            var placeholder = findOrCreatePlaceholder();

            var config = {
                language: "en",
                plugins: ["toolbar", "widget", "richcombo"],
                extraPlugins: extraPluginsName,
                toolbar: [{
                    name: "trackChanges",
                    items: ['trackChanges']
                }]
            };

            var editor = CKEDITOR.inline(placeholder, config);

            editor.LEOS = {
                isClonedProposal: true,
                isTrackChangesEnabled: true,
                isTrackChangesShowed: true,
                proposalRef: "",
                user: {
                    name: "testuser",
                    login: "testuser",
                    permissions: ["CAN_ACCEPT_CHANGES", "CAN_REJECT_CHANGES"],
                    roles: ["SUPPORT"]
                },
                dialog: {
                    current: "5"
                }
            };

            editor.on('instanceReady', (evt) => resolve(editor));
        });
        
        var editor = await promise;        
        _printElementEditor(editor, "After Editor Init:");
        return editor;
    }

    function _destroyEditor(editor) {
        console.log("Destroying editor...");
        editor.setReadOnly(true);

        // destroy editor instance, without updating DOM
        var placeholder = document.getElementById("leos-placeholder");
        if (placeholder != null) {
            placeholder.innerHTML = null; //used to avoid flickering text
        }

        // clear LEOS data from editor
        editor.LEOS = null;

        editor.destroy(true);
    }

    function _fireKeyEvent(editor, keyCode) {
        var ckEditorEvent = new CKEDITOR.dom.event(
            new KeyboardEvent('key', {
                keyCode: keyCode,
                ctrlKey: false,
                shiftKey: false
            })
        )
        ckEditorEvent.getKey = function() {
            return false;
        }
        var event = {
            name: "key",
            domEvent: ckEditorEvent
        }
        editor.fire('key', event);
        return event;
    }

    function _split_at_index(value, index) {
        return [value.substring(0, index), value.substring(index)];
    }

    function _splitAtIndex(element, index) {
        var splits = _split_at_index(element.getText(), index);
        var firstNode = new CKEDITOR.dom.text(splits[0]);
        var secondNode = new CKEDITOR.dom.text(splits[1]);
        if(element.getChildCount() > 0) {
            element.getChildren().toArray().forEach(node => node.remove());
        }        
        firstNode.appendTo(element);
        secondNode.appendTo(element);
    }

    function _selectElement(editor, element) {
        var range = editor.createRange();
        range.selectNodeContents(element);    
        range.moveToPosition(element, CKEDITOR.POSITION_AFTER_START);
        
        editor.getSelection().removeAllRanges();
        range.select();
    }

    function _movePosition(editor, element, index) {
        _splitAtIndex(element, index);

        _selectElement(editor, element.getChildren().getItem(1));
        
        console.info("After moving the cursor to position ", index);
        _printElementEditor(editor);
    }

    function _printElementEditor(editor, msgToPrint, printHtml) {
        if(msgToPrint && msgToPrint!=="") {
            console.info(msgToPrint)
        }
       
        var result = {};
        _printText(editor.element, result);
        console.log(JSON.stringify(result, null, 2));
    }

    function _printText(element, result) {
        if(element.type === CKEDITOR.NODE_TEXT) {
            result['name'] = 'text';
            result['value'] = element.getText();
            return result;
        }
        result['name'] = element.getName();
        result['children'] = [];
        if(element.getChildCount() > 0) {
            element.getChildren().toArray().forEach(child => result['children'].push(_printText(child, {})));
        }
        return result;
    }

    function _printOffsetsWithinSelection(editor) {
        var ranges = editor.getSelection().getRanges()
        var range = editor.getSelection().getRanges()[0]
        console.log("Selection: Nr. Ranges:", ranges.length, ", startOffset:", range.startOffset, ", endOffset:", range.endOffset);
    }

    return {
        initializeEditor: _initializeEditor,
        destroyEditor: _destroyEditor,
        fireKeyEvent: _fireKeyEvent,
        selectElement:_selectElement,
        movePosition: _movePosition,
        printElementEditor: _printElementEditor,
        printOffsetsWithinSelection: _printOffsetsWithinSelection
    };
});
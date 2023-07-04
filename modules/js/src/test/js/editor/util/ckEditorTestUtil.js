define(function ckEditorTestUtil(require) {
    "use strict";

    var CKEDITOR = require("promise!ckEditor");

    async function _initializeEditor(extraPluginsName, placeholder) {
        console.log("Initializing editor...");
       
        var promise = new Promise((resolve, reject) => {
            var config = {
                language: "en",
                plugins: "toolbar",
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
                    permissions: ["CAN_ACCEPT_CHANGES", "CAN_REJECT_CHANGES"]
                },
                dialog: {
                    current: "5"
                }
            };

            editor.on('instanceReady', (evt) => resolve(editor));
        });
        
        var editor = await promise;
        // console.log(editor);
        return editor;
    }

    function _destroyEditor(editor, placeholder) {
        console.log("Destroying editor...");
        editor.setReadOnly(true);

        // destroy editor instance, without updating DOM
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

    function _createPlaceHolder(div) {
        var placeholder = document.getElementById("leos-placeholder")
        placeholder.innerHTML = div;
        return placeholder;
    }

    function _split_at_index(value, index) {
        return [value.substring(0, index), value.substring(index)];
    }

    function _movePosition(editor, index) {
        var selection = editor.getSelection();
        var range = selection.getRanges()[0];
        var element = selection.getStartElement();
        var splits = _split_at_index(element.getText(), index);
        var firstNode = new CKEDITOR.dom.text(splits[0]);
        var secondNode = new CKEDITOR.dom.text(splits[1]);
        element.getChildren().getItem(0).remove();
        firstNode.appendTo(element);
        secondNode.appendTo(element);
        range.moveToPosition(secondNode, CKEDITOR.POSITION_AFTER_START);
        range.select();
        console.info("After moving the cursor to position ", index, ", editor.element: ")
        _printElementEditor(editor);
    }

    function _printElementEditor(editor, msgToPrint) {
        if(msgToPrint && msgToPrint!=="") {
            console.info(msgToPrint)
        }
        var childNodes = editor.element.getChildren().getItem(0).getChildren();
        console.log(childNodes.toArray().map(child => child.getText()));
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
        createPlaceHolder: _createPlaceHolder,
        movePosition: _movePosition,
        printElementEditor: _printElementEditor,
        printOffsetsWithinSelection: _printOffsetsWithinSelection
    };
});
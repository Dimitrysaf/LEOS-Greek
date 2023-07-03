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


    return {
        "initializeEditor": _initializeEditor,
        "destroyEditor": _destroyEditor,
        "fireKeyEvent": _fireKeyEvent
    };
});
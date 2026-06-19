/*
 * Copyright 2026 European Union
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
 * @fileOverview Undo/Redo plugin using queued snapshots.
 */
; // jshint ignore:line
define(function leosUndoPluginModule(require) {
    'use strict';

    var pluginTools = require('plugins/pluginTools');

    var pluginName = 'leosUndo';

    var SAVE_DELAY = 500;
    var MAX_STACK_SIZE = 50;

    function UndoManager(editor) {
        this.editor = editor;
        this.undoStack = [];
        this.redoStack = [];
        this.snapshots = [];
        this.locked = false;
        this.ignoreInput = false;
        this.ready = false;
        this.saveTimer = null;
        this.currentContent = null;
        this.currentBookmark = null;
    }

    UndoManager.prototype = {
        getContent: function() {
            return this.editor.getSnapshot();
        },

        getBookmark: function() {
            var sel = this.editor.getSelection();
            return sel ? sel.createBookmarks2(true) : null;
        },

        restoreBookmark: function(bookmark) {
            if (!bookmark) return;
            try {
                var sel = this.editor.getSelection();
                if (sel) {
                    sel.selectBookmarks(bookmark);
                }
            } catch (e) {
                // Bookmark may be invalid after content change
            }
        },

        save: function() {
            if (this.locked || !this.ready) return;

            var content = this.getContent();
            if (content === false || content === null) return;
            if (content === this.currentContent) return;

            this.undoStack.push({ content: this.currentContent, bookmark: this.currentBookmark });
            if (this.undoStack.length > MAX_STACK_SIZE) {
                this.undoStack.shift();
            }
            this.redoStack = [];
            this.currentContent = content;
            this.currentBookmark = this.getBookmark();
            this.onChange();
        },

        saveInitial: function() {
            this.currentContent = this.getContent();
            this.currentBookmark = this.getBookmark();
            this.ready = true;
            this.onChange();
        },

        queueSave: function() {
            var self = this;
            if (this.saveTimer) {
                clearTimeout(this.saveTimer);
            }
            this.saveTimer = setTimeout(function() {
                self.saveTimer = null;
                self.save();
            }, SAVE_DELAY);
        },

        runQueuedSave: function() {
            if (this.saveTimer) {
                clearTimeout(this.saveTimer);
                this.saveTimer = null;
                this.save();
            }
        },

        undo: function() {
            if (!this.undoable()) return false;

            this.runQueuedSave();

            this.redoStack.push({ content: this.currentContent, bookmark: this.currentBookmark });
            var entry = this.undoStack.pop();
            this.currentContent = entry.content;
            this.currentBookmark = entry.bookmark;

            this.locked = true;
            this.ignoreInput = true;
            this.editor.loadSnapshot(entry.content);
            this.restoreBookmark(entry.bookmark);
            this.locked = false;
            var self = this;
            setTimeout(function() { self.ignoreInput = false; }, 100);

            this.onChange();
            return true;
        },

        redo: function() {
            if (!this.redoable()) return false;

            this.runQueuedSave();

            var entry = this.redoStack.pop();
            this.undoStack.push({ content: this.currentContent, bookmark: this.currentBookmark });
            this.currentContent = entry.content;
            this.currentBookmark = entry.bookmark;

            this.locked = true;
            this.ignoreInput = true;
            this.editor.loadSnapshot(entry.content);
            this.restoreBookmark(entry.bookmark);
            this.locked = false;
            var self = this;
            setTimeout(function() { self.ignoreInput = false; }, 100);

            this.onChange();
            return true;
        },

        undoable: function() {
            return this.undoStack.length > 0;
        },

        redoable: function() {
            return this.redoStack.length > 0;
        },

        reset: function() {
            this.undoStack = [];
            this.redoStack = [];
            if (this.saveTimer) {
                clearTimeout(this.saveTimer);
                this.saveTimer = null;
            }
            this.currentContent = this.getContent();
            this.currentBookmark = null;
            this.onChange();
        },

        onChange: function() {
            // overridden in init
        }
    };

    var pluginDefinition = {
        icons: 'undo,redo,undo-rtl,redo-rtl',
        hidpi: true,
        init: function init(editor) {
            var undoManager = new UndoManager(editor);

            var undoCommand = editor.addCommand('undo', {
                exec: function() {
                    if (undoManager.undo()) {
                        editor.selectionChange();
                        this.fire('afterUndo');
                    }
                },
                startDisabled: true,
                canUndo: false
            });

            var redoCommand = editor.addCommand('redo', {
                exec: function() {
                    if (undoManager.redo()) {
                        editor.selectionChange();
                        this.fire('afterRedo');
                    }
                },
                startDisabled: true,
                canUndo: false
            });

            editor.setKeystroke([
                [CKEDITOR.CTRL + 90 /*Z*/, 'undo'],
                [CKEDITOR.CTRL + 89 /*Y*/, 'redo'],
                [CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 /*Z*/, 'redo']
            ]);

            undoManager.onChange = function() {
                undoCommand.setState(undoManager.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                redoCommand.setState(undoManager.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
            };

            // Save snapshot before and after commands
            var commandInProgress = false;

            editor.on('beforeCommandExec', function(event) {
                if (event.data.command.canUndo !== false) {
                    undoManager.runQueuedSave();
                    undoManager.save();
                    commandInProgress = true;
                }
            });

            editor.on('afterCommandExec', function(event) {
                if (event.data.command.canUndo !== false) {
                    commandInProgress = false;
                    undoManager.queueSave();
                }
            });

            // Save on explicit saveSnapshot event
            editor.on('saveSnapshot', function() {
                if (commandInProgress) return;
                undoManager.runQueuedSave();
                undoManager.save();
            });

            // Listen for content changes via contentDom
            editor.on('contentDom', function() {
                var editable = editor.editable();

                editable.attachListener(editable, (CKEDITOR.env.ie ? 'keypress' : 'input'), function() {
                    if (!undoManager.locked && !undoManager.ignoreInput) {
                        undoManager.queueSave();
                    }
                });

                editable.attachListener(editable, 'paste', function() {
                    undoManager.runQueuedSave();
                });

                editable.attachListener(editable, 'drop', function() {
                    undoManager.runQueuedSave();
                });
            });

            editor.on('blur', function() {
                undoManager.runQueuedSave();
            });

            editor.on('focus', function() {
                setTimeout(function() {
                    undoManager.onChange();
                }, 0);
            });

            editor.on('instanceReady', function() {
                undoManager.saveInitial();
            });

            editor.on('lockSnapshot', function() {
                undoManager.locked = true;
            });

            editor.on('unlockSnapshot', function() {
                undoManager.locked = false;
            });

            if (editor.ui.addButton) {
                editor.ui.addButton('Undo', {
                    label: 'Undo',
                    command: 'undo',
                    toolbar: 'undo,10'
                });

                editor.ui.addButton('Redo', {
                    label: 'Redo',
                    command: 'redo',
                    toolbar: 'undo,20'
                });
            }

            editor.resetUndo = function() {
                undoManager.reset();
            };
        }
    };

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var pluginModule = {
        name: pluginName
    };

    return pluginModule;
});

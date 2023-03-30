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
define(function leosTrackChangesPluginModule(require) {
    "use strict";

    // load module dependencies
    var log = require("logger");
    var pluginTools = require("plugins/pluginTools");
    var diff_match_patch = require("diff_match_patch");

    var pluginName = "leosTrackChanges";

    var pluginDefinition = {
        init: function init(editor) {
            // Plugin only allowed for cloned proposals
            if (!editor.LEOS.isClonedProposal) {
                return;
            }

            var core = trackChanges.core, actions = trackChanges.actions;
            var isTrackChangesVisible = true, isTrackChangesEnabled = editor.LEOS.isTrackChangesEnabled;
            var defaultTrackChangesEditorStyle = $("head #editorTcStyle");

            // Add toggle display
            editor.ui.addButton("toggleDisplay", {
                label: "Toggle track changes display",
                icon: this.path + "icons/display.png",
                command: "toggleDisplayCommand",
                toolbar: "trackChanges",
                isToggle: true
            });
            editor.addCommand("toggleDisplayCommand", {
                canUndo: false,
                exec: function(editor) {
                    isTrackChangesVisible = !isTrackChangesVisible;
                    this.setState(isTrackChangesVisible ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
                    $("head #editorTcStyle").remove();
                    if (isTrackChangesVisible) {
                        $("head").prepend(defaultTrackChangesEditorStyle);
                    } else {
                        var editorTcStyle = core.TRACKCHANGES_ELEMENT_SELECTOR + "[data-akn-action='insert'] { text-decoration: none; }\n";
                        editorTcStyle += core.TRACKCHANGES_ELEMENT_SELECTOR + "[data-akn-action='delete'] { display: none; }\n";
                        $("head").prepend("<style id='editorTcStyle'>" + editorTcStyle + "</style>");
                    }
                }
            });

            // Update toggle display state when editor has focus
            editor.on("focus", function () {
                editor.getCommand("toggleDisplayCommand")
                    .setState(isTrackChangesVisible ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
            });

            // Bind events if the Dom is ready!
            editor.on("contentDom", function() {
                var savedSnapshot, savedTcLocation, keyCodeLock, betweenFix, wasInsert, wasCollapsed;
                var ctrlDown = false, cutText;
                var editable = editor.editable();

                // Delete functionality - keydown - catch snapshots
                editable.attachListener(editor.document, "keydown", function(e) {
                    if(editor.getSelection().getRanges().length > 0)
                    {
                        if(isTrackChangesEnabled)
                        {
                            var event = new EventWrapper(e);

                            if(event.isCtrl())//ctrl with mac support
                            {
                                ctrlDown = true; // Track ctrl down for the CTRL + x event
                            }

                            //On Delete Functionality (Prevents/backup of text)
                            if(event.getKeyCode() === 8 || event.getKeyCode() === 46)
                            {
                                wasInsert = false;

                                var range = editor.getSelection().getRanges()[0];
                                range.optimize();
                                var startContainer = range.startContainer;
                                var deleteKey = (event.getKeyCode() === 46);

                                if(!keyCodeLock && range.collapsed)
                                {
                                    wasCollapsed = true;
                                    keyCodeLock = true;

                                    //prevent of between 2 deletes.
                                    var pTcElement = core.searchTrackChangeElement_ParentChecked(editor,core.DELETE_ACTION);
                                    var parentTcElement = (pTcElement && (pTcElement[1] === core.PARENT || pTcElement[1] === core.CURRENT));
                                    var nextTcElement = core.searchNextTrackChangeElement(editor, core.DELETE_ACTION, deleteKey);
                                    var previousTcElement = core.searchPreviousTrackChangeElement(editor, core.DELETE_ACTION, deleteKey);
                                    betweenFix = null; //Clean Previous

                                    if(parentTcElement && nextTcElement && deleteKey)
                                    {
                                        betweenFix = [pTcElement,nextTcElement, deleteKey];
                                    }
                                    else if (parentTcElement && previousTcElement && !deleteKey)
                                    {
                                        betweenFix = [previousTcElement, pTcElement, !deleteKey];
                                    }
                                    //end prevent

                                    savedSnapshot = core.getCleanData(editor);

                                    //Search with direction. No parent Check.
                                    var tcElement = core.searchTrackChangeElement(editor, core.DELETE_ACTION, false, deleteKey);
                                    //logic of tc before of after the change.
                                    savedTcLocation = (tcElement ? (deleteKey? (tcElement[1] === core.CARET_END ? core.BEFORE : core.AFTER) :(tcElement[1] === core.CARET_START ? core.AFTER : core.BEFORE)) : core.NONE);

                                    //Checks for no delete of delete.
                                    //Prevent is different search, if still found tc.
                                    var tcElementPrevent = core.searchTrackChangeElement(editor, core.DELETE_ACTION);

                                    if(tcElementPrevent)
                                    {
                                        if(savedTcLocation === core.BEFORE && !deleteKey)
                                        {
                                            event.getInstance().data.preventDefault();
                                            savedSnapshot = null;
                                        }
                                        else if(savedTcLocation === core.AFTER && deleteKey)
                                        {
                                            event.getInstance().data.preventDefault();
                                            savedSnapshot = null;
                                        }
                                    }

                                    ///INSERT LAST CHARACTER DELETE FIX
                                    //Search with direction. No parent Check.
                                    var tcElementIns = core.searchTrackChangeElement_ParentChecked(editor, core.INSERT_ACTION);
                                    /*
                                    //logic of tc before of after the change.
                                    if(tcElementIns && tcElementIns[0].getText().length === 1 && !deleteKey && range.startOffset === 1)
                                    {
                                        event.getInstance().data.preventDefault();
                                        savedSnapshot = null;
                                        tcElementIns[0].remove();
                                    }
                                    */

                                    if (tcElementIns) {
                                        if (!range.checkBoundaryOfElement(range.startContainer,CKEDITOR.END) && !range.checkBoundaryOfElement(range.startContainer,CKEDITOR.START) && tcElementIns[1]===core.PARENT) {
                                            wasInsert = true;
                                        } else if (!deleteKey) {
                                            if ((range.checkBoundaryOfElement(range.startContainer,CKEDITOR.END) && tcElementIns[1]===core.PARENT) ||
                                                (range.checkBoundaryOfElement(range.startContainer,CKEDITOR.END)  && tcElementIns[1]===core.CURRENT) ||
                                                (!range.checkBoundaryOfElement(range.startContainer,CKEDITOR.END) && tcElementIns[1]===core.CARET_END)) {
                                                wasInsert = true;
                                            }
                                        } else if (deleteKey) {
                                            if ((range.checkBoundaryOfElement(range.startContainer,CKEDITOR.START) && tcElementIns[1]===core.PARENT) ||
                                                (!range.checkBoundaryOfElement(range.startContainer,CKEDITOR.START) && tcElementIns[1]===core.CARET_START)) {
                                                wasInsert = true;
                                            }
                                        }
                                    }
                                    //END

                                    //Worked with RANGY for ie & Mozilla support
                                    //Rangy is only used to check parentNodes and Offset in a slightly better way.
                                    //var selection = core.getSelection();
                                    //range = selection.getAllRanges()[0];
                                    var selection = editor.getSelection();
                                    range = selection.getRanges()[0];
                                    startContainer = range.startContainer;

                                    //TODO: Improve this workflow with the improved search method.
                                    if(!tcElement) // Check if no TrackChange element is found.
                                    {
                                        if(typeof(startContainer.getAttribute) != 'undefined' && startContainer.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION)
                                        {
                                            //This scenario only happens within mozilla because of other dom handling.
                                            if((range.startOffset === 0 && deleteKey) || ( range.startOffset !== 0 && !deleteKey))
                                            {
                                                event.getInstance().data.preventDefault();
                                                savedSnapshot = null;
                                            }
                                        }
                                        else if(typeof(startContainer.parentNode.getAttribute) != 'undefined' && startContainer.parentNode.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION)
                                        {
                                            if(!CKEDITOR.env.ie)
                                            {
                                                //TODO: Check which workflow is better. Prevent move or make move!
                                                //Non Ie version sets the caret to other side of element.
                                                if(!deleteKey)
                                                {
                                                    range.collapseBefore(startContainer.parentNode);
                                                }
                                                else if(deleteKey)
                                                {
                                                    range.collapseAfter(startContainer.parentNode);
                                                }

                                                event.getInstance().data.preventDefault();
                                                savedSnapshot = null;
                                            }
                                            else
                                            {
                                                //IE Version
                                                //Prevent rules
                                                //Check if Child equals firsnode of parent && isBackspace && offSet == 0
                                                //OR Check if is delete and offset doesn't equal 0
                                                if(!((!deleteKey && range.startContainer === startContainer.parentNode.firstChild && range.startOffset === 0) || ( range.startOffset !== 0 && deleteKey)))
                                                {
                                                    event.getInstance().data.preventDefault();
                                                    savedSnapshot = null;
                                                }
                                            }
                                        }
                                    }
                                }
                                else if(!range.collapsed)
                                {
                                    wasCollapsed = false;
                                    //Here is the delete of all selection handeld.

                                    editor.fire('saveSnapshot');

                                    //Deny Changes

                                    var childerenOfSelection = editor.getSelection().getRanges()[0].extractContents(true).getChildren();
                                    var firstItem = null, lastItem = null;
                                    var objNonReferencedArray = core.toArray(childerenOfSelection); //Fix for reference problems.
                                    var updatedRange = editor.getSelection().getRanges()[0]; //New Var because. it is not rangy library


                                    //Walking the elements.
                                    for(var i = 0; objNonReferencedArray.length > i; i++)
                                    {
                                        //To prevent the undo to catch every part
                                        editor.fire('lockSnapshot');

                                        var item = objNonReferencedArray[i];
                                        var tcItem = core.addTrackChangesNested(editor, item);
                                        if(tcItem != null)
                                        {
                                            if(!updatedRange.collapsed)
                                            {
                                                updatedRange.collapse(true);
                                                updatedRange.select();
                                            }
                                            editor.insertElement(tcItem);
                                        }

                                        if(firstItem == null)
                                        {
                                            firstItem = tcItem;
                                        }
                                        else
                                        {
                                            lastItem = tcItem;
                                        }
                                        editor.fire('unlockSnapshot');
                                    }

                                    editor.fire('updateSnapshot');

                                    //Merge Changes with previous HTML
                                    if(firstItem != null && firstItem.$.nodeType === CKEDITOR.NODE_ELEMENT)
                                    {
                                        firstItem.mergeSiblings(false);
                                    }
                                    if(lastItem != null && lastItem.$.nodeType === CKEDITOR.NODE_ELEMENT)
                                    {
                                        lastItem.mergeSiblings(false);
                                    }

                                    event.getInstance().data.preventDefault();

                                }
                                else
                                {
                                    //Prevent if lock exists
                                    event.getInstance().data.preventDefault();
                                }
                            }
                        }
                    }
                });

                // Delete functionality - keyup
                editable.attachListener(editor.document, "keyup", function(e) {
                    if(editor.getSelection().getRanges().length > 0)
                    {
                        if(isTrackChangesEnabled)
                        {
                            editor.getSelection().getRanges()[0].optimize();

                            //Define vars
                            var event = new EventWrapper(e);
                            var range = editor.getSelection().getRanges()[0];

                            var tcInsert = core.searchTrackChangeElement_ParentChecked(editor, core.INSERT_ACTION);

                            //On Delete Complete Functionality. This part doesn't work without the keydown part.
                            //Because the keydown part is leading to track the changes.
                            try
                            {
                                if((event.getKeyCode() === 8 || event.getKeyCode() === 46) && savedSnapshot)
                                {
                                    var diff = new diff_match_patch();
                                    var foundDiff = false;
                                    var differences = diff.diff_main(savedSnapshot,core.getCleanData(editor));
                                    // The diff functionality of the package has the possibility to find multiple differences.
                                    // Only because we use it on a delete or backspace event, there should be only one change!
                                    // This change should be a -1 which point to a delete.
                                    for (var i = differences.length - 1; i >= 0; i--) {
                                        if(differences[i][0] === -1)
                                        {
                                            foundDiff = true;
                                            differences = differences[i][1];
                                            break;
                                        }
                                    }

                                    editor.fire('lockSnapshot');
                                    //Insert deleted contents
                                    if(foundDiff)
                                    {
                                        actions.deleteCharacter(editor, event, savedTcLocation, differences, betweenFix, wasInsert, wasCollapsed);
                                        if(tcInsert && tcInsert[0].getText().length === 0)//empty tag check.. if so remove..
                                        {
                                            tcInsert[0].remove();
                                        }
                                    }
                                    editor.fire('unlockSnapshot');
                                }

                                if(cutText !== null &&  cutText !== undefined && event.isCtrl())
                                {
                                    //After cut  insert track change element
                                    core.insertTrackChangeElement(editor, core.DELETE_ACTION, cutText, true, true);
                                    cutText = null;
                                }

                                if (event.isCtrl())//ctrl release (This is tracked for the Cut event)
                                {
                                    ctrlDown = false;
                                }
                                //No prevent because the text needs to be deleted
                                //event.getInstance().data.preventDefault();
                            }
                            finally
                            {
                                //Release lock!
                                keyCodeLock = false;
                            }
                        }
                    }
                });

                // - Prevent of insert in Delete
                // - Insert functionality
                editable.attachListener(editor.document, "keypress", function(e) {
                    var notPrevent = true;
                    var event = new EventWrapper(e);
                    if(isTrackChangesEnabled)
                    {
                        // Do not capture CTRL hotkeys & escape.
                        if (!e.data.$.ctrlKey && !e.data.$.metaKey && event.getKeyCode() != 8 && event.getKeyCode() != 46 && event.getKeyCode() != 29 )
                        {
                            var character = event.getChar();
                            if(character)
                            {
                                var range = editor.getSelection().getRanges()[0];
                                //Actions of KeyPress
                                if(!range.collapsed)
                                {
                                    editor.fire('saveSnapshot');

                                    // Lines removed because it caused insert on text selected not working
                                    // trackChanges.core.partialSelectionFix(editor);
                                    // editor.commands.denySelectedChanges.exec();
                                    var style = new CKEDITOR.style({attributes: core.getTrackChangeAttributes(editor, core.DELETE_ACTION)});
                                    editor.applyStyle(style);

                                    //Collapse range to write at end.
                                    var endContainer = editor.getSelection().getRanges()[0].endContainer;
                                    if(CKEDITOR.env.ie && endContainer.$.type === 1 || !CKEDITOR.env.ie) //TODO: Refactor
                                    {
                                        core.setToEditablePosition(editor, endContainer, true);
                                    }
                                    else
                                    {
                                        core.setToEditablePosition(editor, endContainer.getParent(), true);
                                    }
                                    editor.fire('saveSnapshot');

                                    actions.preventInsertInDelete(editor); //Moves the caret if needed
                                    var insEl = core.insertTrackChangeElement(editor, core.INSERT_ACTION, character, core.CARET_END);
                                    core.setToEditablePosition(editor, insEl, true);			//Set Cursor inside the tag
                                }
                                else
                                {
                                    actions.preventInsertInDelete(editor); //Moves the caret if needed
                                    notPrevent = actions.insertNewData(editor, event);  //Inserts the new data
                                }

                                //Prevent standard insert
                                if(notPrevent != false)
                                {
                                    event.getInstance().data.preventDefault();
                                }
                            }
                        }
                    }
                    else
                    {
                        // Normal text add flow with break tag For no track changes
                        var elIns = core.searchTrackChangeElement_ParentChecked(editor, core.INSERT_ACTION);
                        var elDel = core.searchTrackChangeElement_ParentChecked(editor, core.DELETE_ACTION);
                        var elToBreak;

                        if(elIns && (elIns[1] === core.CURRENT || elIns[1] ===core.PARENT))
                        {
                            elToBreak = elIns[0];
                        }
                        else if(elDel && (elDel[1] === core.CURRENT || elDel[1] ===core.PARENT))
                        {
                            elToBreak = elDel[0];
                        }

                        if(elToBreak)
                        {
                            var newElement = core.insertTrackChangeElement(editor, core.INSERT_ACTION, event.getChar(), true);
                            newElement.breakParent(elToBreak);
                            core.setToEditablePosition(editor, newElement, true);
                            newElement.remove();
                            editor.insertHtml(event.getChar(), 'text');

                            //Prevent standard insert
                            event.getInstance().data.preventDefault();
                        }
                    }

                });

                // Prevent dropping and dragging text
                editable.attachListener(editor.document, "drop", function(e) {
                    e.data.preventDefault();
                });

                editable.attachListener(editor.document, "dragstart", function(e) {
                    e.data.preventDefault();
                });

                editor.on("paste", function(e) {
                    if(isTrackChangesEnabled)
                    {
                        var newValue = e.data.dataValue;
                        //$('span[name=delete]', newValue).each(function(){$(this).remove();}); // Delete delete tags.
                        var jElement = $('<div/>').html(newValue);
                        $(jElement).find('span[data-akn-action=delete]').remove();
                        var text = jElement.html();

                        //var text = trackChanges.textHandling.escapeHTMLDecode(newValue);
                        var el = trackChanges.core.makeTrackChangeElement(editor, trackChanges.core.INSERT_ACTION, text, true);

                        if(editor.getSelection().getSelectedText().length > 0)
                        {
                            //On selection delete selection
                            var delEl = trackChanges.core.makeTrackChangeElement(editor, trackChanges.core.DELETE_ACTION, core.getSelectedHtml(editor), true);
                            e.data.dataValue = delEl.$.outerHTML + el.$.outerHTML;
                        }
                        else
                        {
                            //normale paste flow with track changes
                            e.data.dataValue = el.$.outerHTML;
                        }
                        editor.insertHtml(e.data.dataValue, 'html');
                        e.cancel();
                    }
                });

                editable.attachListener(editor.document, "cut", function(e) {
                    //Save the text for the cut element
                    if(isTrackChangesEnabled)
                    {
                        cutText = core.getSelectedHtml(editor);
                    }
                });
            });
        }
    }

    var trackChanges = {

        getUserAndId: function(editor) {
            return [editor.LEOS.user.name, editor.LEOS.user.login];
        },

        getUserId: function(editor) {
            return editor.LEOS.user.login;
        }

    };

    trackChanges.actions = {

        preventInsertInDelete: function(editor)
        {
            //Prevent typing Within A Delete Element!
            //Check if next, last or current is delete element
            //If this is the case move to end.

            //Define Start Variables
            editor.getSelection().getRanges()[0].optimize();	//!! Important to avoid problems in cross-browser use
            var range = editor.getSelection().getRanges()[0];
            var startContainer = range.startContainer;
            var core = trackChanges.core;

            var tcElement = core.searchTrackChangeElement_ParentChecked(editor, core.DELETE_ACTION);

            //If parent or current is delete element overwrite output of above.
            if(tcElement && (tcElement[1] === core.PARENT || tcElement[1] === core.CURRENT))
            {
                tcElement = [tcElement[0],core.CARET_START];	// Move to start of elment behind the delete
            }

            //Set Caret after delete if something is found.
            if(tcElement && tcElement[0] && tcElement[1] == core.CARET_START )
            {

                if(tcElement[0].$.nodeType === CKEDITOR.NODE_TEXT && !CKEDITOR.env.ie)
                    tcElement[0] = tcElement[0].getParent();

                var next = tcElement[0].getNextSourceNode().getNextSourceNode();

                range = editor.createRange();
                if(next) // IF not null and not first/highest item
                {
                    range.selectNodeContents(next);
                    range.collapse(true);
                } //TODO: Add if next is Insert Element set to start insert Element!!
                else
                {
                    //IE Only fix. Ie doesn't find a element at end of line. And break the line to place the new inserted text
                    // in a new paragraff.. to prevent this we place the text before the delete
                    //Exception for last element.
                    range.setStartBefore(tcElement[0]);
                }
                range.select();
            }
        },

        insertNewData: function(editor, event)
        {
            editor.getSelection().getRanges()[0].optimize();	//!! Important to avoid problems in cross-browser use

            //Define Start Variables
            var range = editor.getSelection().getRanges()[0];
            var startContainer = range.startContainer;
            var character = event.getChar();
            var core = trackChanges.core;

            var tcEl = core.searchTrackChangeElement_ParentChecked(editor, core.INSERT_ACTION);
            //Check if new Tag is required
            if(tcEl && (tcEl[1] === core.PARENT || tcEl[1] === core.CURRENT) && tcEl[0].getAttribute(core.UID_ATTR) === trackChanges.getUserId(editor))
            {
                //editor.insertHtml(character, 'text');
                return false;
            }
            else
            {
                if(tcEl && tcEl[0] && tcEl[0].getAttribute(core.UID_ATTR) === trackChanges.getUserId(editor))
                {
                    if( tcEl[1]  === core.CARET_START)
                    {
                        //IE before insert fix.
                        core.setToEditablePosition(editor, tcEl[0], core.CARET_START);
                        //editor.insertHtml(character, 'text');
                        return false;
                    }
                    else
                    {
                        var text = (tcEl[1]  === core.CARET_END ? tcEl[0].getText() + character : character + tcEl[0].getText());
                        tcEl[0].setText(text);
                    }
                }
                else
                {
                    var newElement = core.insertTrackChangeElement(editor, core.INSERT_ACTION, character, true); // Insert new TC Element

                    if(tcEl && tcEl[0] && tcEl[0].getAttribute(core.UID_ATTR) !== trackChanges.getUserId(editor) && (tcEl[1] === core.CURRENT || tcEl[1] === core.PARENT))
                    {
                        newElement.breakParent(tcEl[0]);
                        core.setToEditablePosition(editor, newElement, true);//Set Cursor inside the tag
                    }
                }
            }
            return true;
        },

        deleteCharacter: function(editor, event, savedTcLocation, differences, betweenFix, wasInsert, wasCollapsed)
        {
            //Define
            editor.getSelection().getRanges()[0].optimize();
            var range = editor.getSelection().getRanges()[0],
                startContainer = range.startContainer,
                tcLocation, tcElement, tcText, setToEl,
                deleteKey = (event.getKeyCode() === 46),
                core = trackChanges.core;

            if(betweenFix)
            {
                betweenFix[0][0].setText(betweenFix[0][0].getText() + differences + betweenFix[1][0].getText());
                betweenFix[1][0].remove();
                core.setToEditablePosition(editor, betweenFix[0][0], betweenFix[2]);
                betweenFix = null; //clean old value
            }
            else if(wasInsert)
            {
                return;
            }
            else
            {
                var tcInsertElement = core.searchTrackChangeElement_ParentChecked(editor, core.INSERT_ACTION);

                //Get current TC Element Place?
                tcElement = core.searchTrackChangeElement_ParentChecked(editor, core.DELETE_ACTION);
                if(tcElement && tcInsertElement == undefined)
                {
                    setToEl = tcElement[0];
                    if(deleteKey && ((tcElement[1] === core.CURRENT && !CKEDITOR.env.ie) || (tcElement[1] === core.PARENT && CKEDITOR.env.ie)))
                    {
                        savedTcLocation = core.BEFORE;
                    }
                }
                else if (savedTcLocation != core.NONE)
                {
                    var node = startContainer;
                    if(savedTcLocation == core.AFTER)
                    {
                        while(node.hasNext() && node.type != 1)
                        {
                            node = node.getNextSourceNode();
                        }
                    }
                    else
                    {
                        while(node.hasPrevious() && node.type != 1)
                        {
                            node = node.getPreviousSourceNode();
                        }
                    }
                    setToEl = node;
                }
                else
                {
                    setToEl = null;
                }


                //Set tcLocation en caretMove, depends on delete
                if(deleteKey)
                {
                    if(savedTcLocation === core.NONE && tcElement)
                    {
                        tcLocation = (tcElement[1] === core.CARET_END ? core.BEFORE : core.AFTER);
                    }
                    else
                    {
                        tcLocation = savedTcLocation;
                    }
                }
                else
                {
                    if(savedTcLocation === core.NONE && tcElement)
                    {
                        tcLocation = (tcElement[1] === core.CARET_START ? core.AFTER : core.BEFORE);
                    }
                    else
                    {
                        tcLocation = savedTcLocation;
                    }
                }

                //Select text order by tclocation if not none.
                if(tcLocation != core.NONE && setToEl)
                {
                    tcText = (tcLocation === core.BEFORE ? setToEl.getText() + differences : differences + setToEl.getText());
                }
                else if(setToEl) //If not new element and see below
                {
                    //If the caret stayed in contact with the tcElement normal behaviour
                    tcText = (deleteKey ? setToEl.getText() + differences : differences + setToEl.getText());
                }

                if(setToEl && tcElement && tcElement[0].getAttribute(core.UID_ATTR) === trackChanges.getUserId(editor))
                {
                    //Add to already existing element
                    setToEl.setText(tcText);
                    if(!CKEDITOR.env.ie && deleteKey)
                    {
                        //IF delete charet in gecko is set to start? Fix
                        core.setToEditablePosition(editor, setToEl, core.CARET_END);
                    }
                }
                else
                {
                    if(!wasCollapsed && tcInsertElement && tcInsertElement[0].getAttribute(core.UID_ATTR) === trackChanges.getUserId(editor) && (tcInsertElement[1] === core.CURRENT || tcInsertElement[1] === core.PARENT))
                    {
                        //These checke are fixes to prevent deleting of users own added text.
                        //With help of rangy fixed this.
                        //Improve this workflow
                        //var selection = core.getSelection();
                        //range = selection.getAllRanges()[0];
                        var selection = editor.getSelection();
                        range = selection.getRanges()[0];
                        startContainer = range.startContainer;
                        if(typeof(startContainer.getAttribute) != 'undefined' && startContainer.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION)
                        {
                            if(!CKEDITOR.env.ie)
                            {
                                if((range.startOffset === 0 && deleteKey) || (range.startOffset !== 0 && range.startOffset !== startContainer.length))
                                {
                                    return; //normal workflow
                                }

                            }
                            else
                            {
                                //IE Version
                                //Prevent rules
                                //Check if Child equals firsnode of parent && isBackspace && offSet == 0
                                //OR Check if is delete and offset doesn't equal 0
                                if(!((!deleteKey && range.startContainer === startContainer.parentNode.firstChild && range.startOffset === 0) || ( range.startOffset !== 0 && deleteKey)))
                                {
                                    return;
                                }
                            }
                        }
                        else if(typeof(startContainer.parentNode.getAttribute) != 'undefined' && startContainer.parentNode.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION)
                        {
                            if(!CKEDITOR.env.ie)	{
                                if((range.startOffset === 0 && deleteKey) || (range.startOffset !== 0 && range.startOffset !== startContainer.length))
                                {
                                    return; //normal workflow
                                }

                            } else {
                                //IE Version
                                //Prevent rules
                                //Check if Child equals firsnode of parent && isBackspace && offSet == 0
                                //OR Check if is delete and offset doesn't equal 0
                                if(!((!deleteKey && range.startContainer === startContainer.parentNode.firstChild && range.startOffset === 0) || ( range.startOffset !== 0 && deleteKey)))
                                {
                                    return;
                                }
                            }
                        }
                        else
                        {
                            //Possible Deep nested flow.
                            return;
                        }
                        range = editor.getSelection().getRanges()[0];
                        startContainer = range.startContainer;
                    }
                    //New Trackchange "delete" element
                    var newElement = core.insertTrackChangeElement(editor, core.DELETE_ACTION, differences, deleteKey); // Add New TC Element
                    if(tcInsertElement && (tcInsertElement[1] === core.PARENT || tcInsertElement[1] === core.CURRENT))
                    {
                        newElement.breakParent(tcInsertElement[0]);
                        core.setToEditablePosition(editor, newElement, deleteKey);			//Set Cursor inside the tag
                    }
                }
            }
        }

    };

    trackChanges.core = {

        // Track changes names and element types
        TRACKCHANGES_ELEMENT: "span", TRACKCHANGES_ELEMENT_SELECTOR: "div#docContainer akomantoso span[data-akn-name='trackchanges']",
        ACTION_ATTR: "data-akn-action", INSERT_ACTION: "insert", DELETE_ACTION: "delete",
        UID_ATTR: "data-akn-uid",

        // Caret definitions
        CARET_START: false, CARET_END: true,

        //TC Locations / where the tc is found
        BEFORE: "before", AFTER: "after", NONE: "none", CURRENT: "current", PARENT: "parent",

        getCleanData: function(editor) {
            var data = editor.getData().replace( /<[^<|>]+?>/gi, '').replace(/[\r\n]/g,''); // Cleanup Break etc.
            return trackChanges.textHandling.escapeHTMLDecode(data); // Decode html
        },

        searchTrackChangeElement_ParentChecked: function(editor, action) {
            var range = editor.getSelection().getRanges()[0];
            editor.getSelection().getRanges()[0].optimize();
            var startContainer = range.startContainer;

            if(typeof(startContainer.getAttribute) != 'undefined' && startContainer.getAttribute(this.ACTION_ATTR) === action)
            {
                return [startContainer, this.CURRENT];
            }
            else if(typeof(startContainer.getParent().getAttribute) != 'undefined' && startContainer.getParent().getAttribute(this.ACTION_ATTR) === action)
            {
                return [startContainer.getParent(), this.PARENT];
            }
            else
            {
                //If other checks not have found anything. This should be an parent.
                var tempEl = this.findElementInPathByName(editor, this.TRACKCHANGES_ELEMENT, action);
                if(tempEl){
                    return [tempEl, this.PARENT];
                }
            }

            //Check element before and after Caret
            var tcElement = this.searchTrackChangeElement(editor, action);
            if(tcElement){
                return tcElement;
            }
        },

        searchTrackChangeElement: function(editor, action, previousFirst, deleteKey) {
            editor.getSelection().getRanges()[0].optimize();

            var setToEl;
            var previousSearched = false;
            var nextSearched = false;
            while(!previousSearched || !nextSearched)
            {
                if(previousFirst || nextSearched)
                {
                    setToEl = this.searchPreviousTrackChangeElement(editor,action, deleteKey);
                    previousSearched = true;
                }
                else
                {
                    setToEl = this.searchNextTrackChangeElement(editor,action, deleteKey);
                    nextSearched = true;
                }

                if(setToEl)
                    return setToEl;

                if(previousSearched && nextSearched)
                    return null; //Break it.
            }

        },

        searchPreviousTrackChangeElement: function(editor, action, deleteKey) {
            var node = editor.getSelection().getRanges()[0].getPreviousNode();
            if(node && node.type === CKEDITOR.NODE_ELEMENT && typeof(node.getAttribute) != 'undefined' && node.getAttribute(this.ACTION_ATTR) === action)
            {
                return [node, this.CARET_END];
            }
            else if(node && node.type === CKEDITOR.NODE_TEXT && node.hasPrevious() && deleteKey === false && node.getText().length === CKEDITOR.NODE_ELEMENT)
            {
                node = node.getPrevious();
                if(node && node.type === CKEDITOR.NODE_ELEMENT && typeof(node.getAttribute) != 'undefined' && node.getAttribute(this.ACTION_ATTR) === action)
                {
                    return [node, this.CARET_END];
                }
            }
        },

        searchNextTrackChangeElement: function(editor, action, deleteKey) {
            var node = editor.getSelection().getRanges()[0].getNextNode();
            if(node && node.type === CKEDITOR.NODE_ELEMENT && typeof(node.getAttribute) != 'undefined' && node.getAttribute(this.ACTION_ATTR) === action)
            {
                return [node, this.CARET_START];
            }
            else if(node && node.type === CKEDITOR.NODE_TEXT && node.hasNext() && deleteKey === true && node.getText().length === CKEDITOR.NODE_ELEMENT)
            {
                node = node.getNext();
                if(node && node.type === CKEDITOR.NODE_ELEMENT && typeof(node.getAttribute) != 'undefined' && node.getAttribute(this.ACTION_ATTR) === action)
                {
                    return [node, this.CARET_START];
                }
            }
        },

        getTrackChangeAttributes: function(editor, action) {
            var user = trackChanges.getUserAndId(editor);
            var tcAttributes = {
                "data-akn-name" : "trackchanges",
                "data-akn-action": action,
                "data-akn-uid": user[1],
                "title": user[0] + " : " + this.getDateFormat()
            };
            return tcAttributes;
        },

        makeTrackChangeElement: function(editor, elementType, text, isHtml) {
            var newElement = new CKEDITOR.dom.element(this.TRACKCHANGES_ELEMENT);
            newElement.setAttributes(this.getTrackChangeAttributes(editor,elementType));
            if(isHtml ? newElement.setHtml(text) : newElement.setText(text));
            return newElement;
        },

        insertTrackChangeElement: function(editor, elementType, text, toEnd, isHtml) {
            if(text !== undefined)
            {
                var newElement = this.makeTrackChangeElement(editor, elementType, text, isHtml);
                editor.insertElement( newElement);
                this.setToEditablePosition(editor, newElement, toEnd);			//Set Cursor inside the tag
                return newElement;
            }
        },

        //Set Caret(Cursor) at end of the given element
        /* Editor: the editor from CKEditor init function*/
        /* setToEnd: A boolean to define if the caret is set to the end*/
        setToEditablePosition: function(editor, element, setToEnd) {
            if(element !== null && element.type !== null)
            {
                //element.$.type = element.type;
                var range = editor.createRange();
                range.moveToElementEditablePosition(element, setToEnd);
                range.select();
            }
        },

        partialSelectionFix: function(editor) {
            var selection = editor.getSelection();
            var range = selection.getRanges()[0];

            if(range.endContainer.$ != range.startContainer.$)
            {
                var firstNode = range.startContainer.getParent();
                var lastNode = range.endContainer.getParent();

                //TODO: Check tc element.
                //Make end Get full if is tcElement
                if(lastNode.type === CKEDITOR.NODE_ELEMENT && lastNode.getName() === this.TRACKCHANGES_ELEMENT)
                {
                    range.setEndAfter(lastNode);
                }

                //Make end Get full if is tcElement
                if(firstNode.type === CKEDITOR.NODE_ELEMENT && firstNode.getName() === this.TRACKCHANGES_ELEMENT)
                {
                    range.setStartBefore(firstNode);
                }

                range.select();
            }
        },

        addTrackChangesNested: function(editor, item) {
            if(item)
            {
                if(item.$.nodeType === CKEDITOR.NODE_ELEMENT && item.getName().toLowerCase() === this.TRACKCHANGES_ELEMENT && item.getAttribute(this.ACTION_ATTR) === this.INSERT_ACTION)
                {
                    //Span Insert element!
                    if(item.getAttribute(this.UID_ATTR) != trackChanges.getUserId(editor))
                    {
                        // If not own insert. make Delete tag
                        item = this.makeTrackChangeElement(editor, this.DELETE_ACTION, item.$.innerHTML, true);
                    }
                    else
                    {
                        //Empty The item but prevent crash. if is own delete
                        item = null;
                    }
                }
                else if(item.$.nodeType === CKEDITOR.NODE_ELEMENT && item.getName().toLowerCase() === this.TRACKCHANGES_ELEMENT && item.getAttribute(this.ACTION_ATTR) === this.DELETE_ACTION )
                {
                    //Span Delete element! - Maintain. no actions needed
                    //Nothing yet.. Prevent reaching Else.

                }
                else if(item.$.nodeType === CKEDITOR.NODE_TEXT)
                {

                    if(item.getParent() != null && item.getParent().$.nodeType === CKEDITOR.NODE_ELEMENT && item.getParent().getName().toLowerCase() === this.TRACKCHANGES_ELEMENT && item.getParent().getAttribute(this.ACTION_ATTR) === this.INSERT_ACTION)
                    {//IE8 only fix.
                        //Span Insert element!
                        if(item.getAttribute(this.UID_ATTR) != trackChanges.getUserId(editor))
                        {
                            // If not own insert. make Delete tag
                            item = this.makeTrackChangeElement(editor, this.DELETE_ACTION, item.$.innerHTML, true);
                        }
                        else
                        {
                            //Empty The item but prevent crash. if is own delete
                            item = null;
                        }
                    }
                    else
                    {
                        //Normal Flow - Make Delete element
                        if(editor.getSelection().getStartElement().getAttribute(this.UID_ATTR) != trackChanges.getUserId(editor)) {
                            item = this.makeTrackChangeElement(editor, this.DELETE_ACTION, item.getText(), true);
                        } else {
                            item = null;
                        }
                    }
                }
                else
                {
                    //Normal objects, walk recursive
                    var elementGeneratedHTML = "";
                    var tempArray = this.toArray(item.getChildren());
                    for(var e = 0; tempArray.length > e; e++)
                    {
                        var tempItem = this.addTrackChangesNested(editor, tempArray[e]);
                        elementGeneratedHTML += (tempItem != null? tempItem.$.outerHTML : "");
                    }

                    if(editor.getSelection().getStartElement().getAttribute(this.UID_ATTR) != trackChanges.getUserId(editor)) {
                        item.$.innerHTML = elementGeneratedHTML;
                    }
                }
            }
            return item;
        },

        toArray: function(list) {
            var array = new Array();
            for (var i=0; i<list.count();i++) { array[i] = list.getItem(i); }
            return array;
        },

        getDateFormat: function() {
            var d = new Date();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            return (day < 10 ? '0' : '') + day + "/" + (month < 10 ? '0' : '') + month + '/' + d.getFullYear() + " " + d.toLocaleTimeString();
        },

        getSelectedHtml: function(editor) {
            if (CKEDITOR.env.ie) {
                editor.focus();
                selection = editor.getSelection();
            } else {
                selection = editor.getSelection();
            }
            if (selection) {
                var bookmarks = selection.createBookmarks(),
                    range = selection.getRanges()[0],
                    fragment = range.clone().cloneContents();

                selection.selectBookmarks(bookmarks);

                var retval = "",
                    childList = fragment.getChildren(),
                    childCount = childList.count();
                for (var i = 0; i < childCount; i++) {
                    var child = childList.getItem(i);
                    console.log(child);
                    retval += (child.getOuterHtml ?
                        child.getOuterHtml() : child.getText());
                }
                return retval;
            }
        },

        findElementInPathByName: function(editor, elType, elName) {
            var selection = editor.getSelection();
            if (selection) {
                var path = selection.getRanges()[0].startPath();
                for(var i = 0; path.elements.length > i; i++)
                {
                    var el = path.elements[i];
                    if(el.getName() == elType && el.getAttribute(this.ACTION_ATTR) == elName)
                    {
                        return el;
                    }
                }
            }
            return null;
        }

    };

    trackChanges.textHandling = {

        escapeHTMLEncode: function(str) {
            var div = document.createElement('div');
            var text = document.createTextNode(str);
            div.appendChild(text);
            return div.innerHTML;
        },

        escapeHTMLDecode: function(str) {
            return $('<div/>').html(str).text();
        }

    };

    var EventWrapper = function(_event) {
        var event = function() {
            return _event || window.event;
        }
        this.getInstance = function() {
            return event();
        }
        this.isCtrl = function() {
            var e = event();
            return e.data.$.metaKey || e.data.$.ctrlKey || (this.getKeyCode() === 17) || (this.getKeyCode() === 91) || (this.getKeyCode() === 224);
        }
        this.getChar = function() {
            var charCode = getCharCode();
            if (charCode === 0) {
                return null;
            }
            return String.fromCharCode(charCode);
        }
        this.getKeyCode = function() {
            var e = event();
            var charCode = e.data.$.keyCode;
            return charCode;
        }
        var getCharCode = function() {
            var e = event();
            var charCode = (CKEDITOR.env.ie ? e.data.$.keyCode : e.data.$.charCode);
            return charCode;
        }
    };

    pluginTools.addPlugin(pluginName, pluginDefinition);

    var transformationConfig = {
        akn : "inline[name=trackchanges]",
        html : "span[data-akn-name=trackchanges]",
        attr : [{
            akn : "xml:id",
            html : "id"
        }, {
            akn: "name",
            html : "data-akn-name"
        }, {
            akn: "leos:action",
            html : "data-akn-action"
        }, {
            akn : "leos:uid",
            html : "data-akn-uid"
        }, {
            akn : "leos:title",
            html : "title"
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

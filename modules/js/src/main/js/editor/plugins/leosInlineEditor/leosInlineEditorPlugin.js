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
define(function leosInlineEditorPluginModule(require) {
    "use strict";
    /*
     * This plugin should be the first one to be loaded.
     */
    
    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var pluginName = "leosInlineEditor";
	var contentScroller = require("contentScroller");
    var UTILS = require("core/leosUtils");

    const DATA_AKN_SOFTUSER = "data-akn-attr-softuser";
    const DATA_AKN_SOFTDATE = "data-akn-attr-softdate";

    var pluginDefinition = {

        init : function init(editor) {

            var contentHeight = _getContentHeight(editor.element);
            var docContainer = UTILS.getDocContainer();
            docContainer.addEventListener('mousedown', _onMouseDown);

            editor.on("change", function(event) {
                var newContentHeight = _getContentHeight(event.editor.element);
                if (contentHeight != newContentHeight) {
                    event.editor.fire("contentChange");
                    contentHeight = newContentHeight;
                }
                _addSoftAttributeToParent(event.editor);
            });

			editor.on('contentDom', function(event) {
                var editor = event.editor,
                    editable = editor.editable();
                editable.attachListener(editable, 'keydown', function(event) {
                    if (event.data.getKeystroke() == CKEDITOR.CTRL + 36) {
                        var element = editor.element.$;
						contentScroller.scrollTo(element, null, null, false);
						editor.focus();
                    }
                }, null, null, -9999);
            });

            function _getContentHeight(element) {
            	if (element) {
            		var editorElem = element.$;
            		return editorElem.getBoundingClientRect().height;
            	} else {
            		return 0;
            	}
            }

            function _addSoftAttributeToParent(editor) {
                editor.fire( 'lockSnapshot' );
                if (editor.LEOS.isClonedProposal) {
                    const selection = editor.getSelection();
                    if (selection) {
                        let parentElement = selection.getStartElement();
                        while (parentElement && !parentElement.is(CKEDITOR.dtd.$block)) {
                            parentElement = parentElement.getParent();
                        }
                        if (parentElement) {
                            var user = editor.LEOS.user;
                            parentElement.setAttribute(DATA_AKN_SOFTUSER, user.name.concat("(").concat(user.entity).concat(")"));
                            parentElement.setAttribute(DATA_AKN_SOFTDATE, UTILS.toIsoString(new Date()));
                        }
                    }
                }
                editor.fire( 'unlockSnapshot' );
            }

            editor.on('blur', function (evt) {
                if ((evt.editor.LEOS.implicitSaveEnabled.toString() !== "false") && !evt.editor.LEOS.bookmarkNavigatorClicked &&
                    !evt.editor.LEOS.saveCmdExecuted) {
                	if (UTILS.isMouseOutsideEditor(evt.editor) && !_isMouseOnDocumentScrollbar()) {
                        if (evt.editor.checkDirty()) {
                            if (editor.fire("canBeSaved")) {
                                editor.fire("save", {
                                    data: editor.getData(),
                                    isSaveAndClose: true
                                });
                                editor.fire("close");
                            }
                        } else {
                            _paddParent(evt.editor.element);
                            editor.fire("close");
                        }
                    }
                } else {
                    evt.editor.LEOS.bookmarkNavigatorClicked = false;
                    evt.editor.LEOS.saveCmdExecuted = false;
                }
            });

            function _isMouseOnDocumentScrollbar() {
                var positionEditor = UTILS.getElementPosition(docContainer);
                var right = positionEditor[0] + parseInt(window.getComputedStyle(docContainer).width) - 20;
                var bottom = positionEditor[1] + parseInt(window.getComputedStyle(docContainer).height) - 20;
                var mouseX = editor.LEOS.mousePosition[0] - docContainer.scrollLeft, mouseY = editor.LEOS.mousePosition[1] - docContainer.scrollTop;
                return mouseX >= right || mouseY >= bottom;
            }

            function _onMouseDown(event) {
                var posx = 0;
                var posy = 0;
                if (event.pageX || event.pageY) {
                    posx = event.pageX + docContainer.scrollLeft;
                    posy = event.pageY + docContainer.scrollTop;
                }
                editor.LEOS.mousePosition = [posx, posy];
			}

            editor.on('focus', function(evt) {
                if(evt.editor.element.getParent().getChild(0).equals(evt.editor.element)
                    && evt.editor.element.getParent().getName() != 'list') {
                    _paddParent(evt.editor.element);
                } else {
                    _paddElement(evt.editor.element);
                }
                if (evt.editor.LEOS.elementType === "num" && evt.editor.LEOS.type === "annex") {
                    $(document.getElementsByClassName('cke_top')).css("margin-left", "-89px");
                }
            });

            editor.on('close', function(evt) {
                var placeholder = evt.editor.placeholder;
                _resetPaddingNumElement(placeholder);
                docContainer.removeEventListener('mousedown', _onMouseDown);
            });

            function _paddElement(element) {
                let ICON_COUNT_THRESHOLD_SECOND_LINE = 19;
                let iconCount = _getIconsCount(editor);
                if (iconCount <= ICON_COUNT_THRESHOLD_SECOND_LINE) {
                    element.removeClass("leos-editor-focus-double");
                    element.addClass("leos-editor-focus");
                } else {
                    element.removeClass("leos-editor-focus");
                    element.addClass("leos-editor-focus-double");
                    _paddNumElement(element);
                }
            }

            function _paddParent(element) {
                let ICON_COUNT_THRESHOLD_SECOND_LINE = 19;
                let iconCount = _getIconsCount(editor);
                if (iconCount <= ICON_COUNT_THRESHOLD_SECOND_LINE) {
                    element.addClass("leos-editor-focus-first");
                } else {
                    element.addClass("leos-editor-focus-first-double");
                }
            }

            function _getIconsCount(editor) {
                let icons = 0;
                editor.toolbar.forEach(function (data) {
                    if (data.items) {
                        icons += data.items.length;
                    }
                });
                return icons;
            }

            function _paddNumElement(element) {
                if (!element.getParent().is("article")
                    && !!element.getPrevious()
                    && element.getPrevious() instanceof CKEDITOR.dom.element
                    && element.getPrevious().is("num")) {
                    element.getPrevious().setStyle("padding-top", "66pt");
                } else if (!element.getParent().is("article")
                    && !element.getPrevious()
                    && element.getParent().is("list")
                    && !!element.getParent().getPrevious()
                    && element.getParent().getPrevious().is("num")) {
                    element.getParent().getPrevious().setStyle("padding-top", "66pt");
                }
            }

            function _resetPaddingNumElement(placeholder) {
                if (!$(placeholder).parent().is("article") && $(placeholder).prev().is("num")) {
                    $(placeholder).prev().css({
                        "padding-top": "6pt"
                    });
                }
            }
        }
    };

    pluginTools.addPlugin(pluginName, pluginDefinition);

    // return plugin module
    var pluginModule = {
        name : pluginName
    };

    return pluginModule;
});
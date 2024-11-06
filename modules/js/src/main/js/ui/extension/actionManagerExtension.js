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
define(function actionManagerExtensionModule(require) {
    "use strict";

    // load module dependencies
    var CONFIG = require("core/leosConfig");
    var UTILS = require("core/leosUtils");
    var log = require("logger");
    var $ = require("jquery");
    var postal = require("postal");
    var CKEDITOR = require("promise!ckEditor");

    // configuration
    var EDITOR_CHANNEL_CFG = CONFIG.channels.editor;
    var IGNORE_EDIT_CLICK = {
        elementName: ["A", "AUTHORIALNOTE", "HYPOTHESIS-HIGHLIGHT", "MREF", "REF", "IMG", "GUIDANCE","INLINE"],
        elementClass: ["leos-soft-move-label", "leos-content-soft-removed"]
    };

    var actionsListOpened = false;
    var zIndex = 1;
    var tocItemsList = [];

    // handle extension initialization
    function _initExtension(connector) {
        log.debug("Initializing Action Manager extension...");

        // initialize listener and semaphore to avoid concurrent edition initialisation
        connector.semaphoreInitEditorOngoing = false;
        CKEDITOR.on("editorInitEnds", _resetSemaphore, undefined, connector);
        CKEDITOR.on("editorInitOngoing", _setSemaphore, undefined, connector);

        // restrict scope to the extended target
        let $rootElement = $(UTILS.getParentElement(connector));
        connector.editedElementsIdList = [];
        connector.instanceType = connector.getState().instanceType;
        tocItemsList = JSON.parse(connector.getState().tocItemsJsonArray);

        _setupEditorChannel(connector, $rootElement);
        _registerEditorChannelSubscriptions(connector, $rootElement);
        _registerActionTriggers(connector, $rootElement);
        _registerActionsHandler(connector, $rootElement);

        log.debug("Registering Action Manager extension unregistration listener...");
        connector.onUnregister = _connectorUnregistrationListener;
    }

    function _getElementId($element) {
        return $element.attr("id");
    }

    function _getOriginAttribute($element) {
        return $element.attr("leos:origin");
    }

    function _getType($element) {
        let tagName = $element.prop('tagName').toLowerCase();
        let tocItemElement = _getTocItemElement(tocItemsList, tagName);
        return tocItemElement ? tocItemElement.aknTag : tagName;
    }

    function _getTocItemElement(tocItemsList, tagName) {
        let tocItemElement = tocItemsList.find(function (e) {
            return e.aknTag.toLowerCase() === tagName
        });
        return tocItemElement;
    }

    function _getEditable($element) {
        return _getDataDefaultedTrue($element, "leos:editable");
    }

    function _getDeletable($element) {
        return _getDataDefaultedTrue($element, "leos:deletable");
    }

    function _getDataDefaultedTrue($element, key) {
        if ($element.attr(key)) {
            return ($element.attr(key) === 'true');
        } else {
            return true;
        }
    }

    function _registerActionsHandler(connector, $rootElement) {
        // register delegated event handlers for content
        if(connector.getState().isAngularUI){
            $rootElement.on("click.actions", ".leos-editable-content", _handleElementClickAction.bind(undefined, connector, "edit"));
        } else {
            // LEOS-2764 Listening on 'mouseup' events for double clicks in place of
            // 'dblclick' to avoid that double click will be managed by annotate
            $rootElement.on("mouseup.actions", ".leos-editable-content", _handleDoubleClickAction.bind(undefined, connector, "edit"));
        }
        // register delegated event handlers for widgets
        $rootElement.on("click.actions", "[data-widget-type='insert.before']", _handleAction.bind(undefined, connector, "insert.before"));
        $rootElement.on("click.actions", "[data-widget-type='edit']", _handleAction.bind(undefined, connector, "edit"));
        $rootElement.on("click.actions", "[data-widget-type='delete']", _handleAction.bind(undefined, connector, "delete"));
        $rootElement.on("click.actions", "[data-widget-type='insert.after']", _handleAction.bind(undefined, connector, "insert.after"));
    }

    function _registerActionTriggers(connector, $rootElement) {
        var EDITABLE_ELEMENTS = "";

        tocItemsList.forEach(function(element) {
            if (element.editable && element.profiles) {
                element.profiles["profiles"].forEach(function(profile) {
                    var selector = profile.elementSelector ? profile.elementSelector : element.aknTag.toLowerCase();
                    EDITABLE_ELEMENTS = EDITABLE_ELEMENTS + selector + ", ";
                });
            }
        });

        EDITABLE_ELEMENTS = EDITABLE_ELEMENTS.substring(0, EDITABLE_ELEMENTS.length - 2);
        $rootElement.off("mouseenter.actions");
        $rootElement.off("mouseleave.actions");
        $rootElement.off("click.actions");
        $rootElement.on("mouseenter.actions", EDITABLE_ELEMENTS, _attachActions.bind(undefined, connector));
        $rootElement.on("mouseleave.actions", EDITABLE_ELEMENTS, _detachActions.bind(undefined, connector));

        $rootElement.on("mouseenter.actions", ".leos-actions", _showActionsSingleIcon.bind(undefined, connector));
        $rootElement.on("mouseleave.actions", ".leos-actions", _hideActions.bind(undefined, connector));

        $rootElement.on("click.actions", ".leos-actions-icon", _showHideActionsList.bind(undefined, connector));
        $rootElement.on("mouseleave.actions", ".leos-actions-icon", _resetActionsOpened.bind(undefined, connector));

        $rootElement.on("mouseenter.actions", ".leos-actions-icon", _showActionsListWithDelay.bind(undefined, connector));
    }

    function _registerEditorChannelSubscriptions(connector, $rootElement) {
        if (connector.editorChannel) {
            let channel = connector.editorChannel;
            if(channel.bus?.subscriptions) {
                channel.bus.unsubscribeFor({"topic": "editor.open"});
                channel.bus.unsubscribeFor({"topic": "editor.close"});
            }
            channel.subscribe("editor.open", _editorOpen.bind(undefined, connector));
            channel.subscribe("editor.close", _editorClose.bind(undefined, connector));
        }
    }

    function _isElementBeingEdited(connector, element) {
        return connector.editedElementsIdList.includes(_getElementId($(element)));
    }

    function _attachActions(connector, event) {
        event.stopPropagation();

        let element = event.currentTarget;
        if (_isElementBeingEdited(connector, element)) {
            return;
        }

        let actions = _getActionButtons(connector, element);
        actions.target = element;
        element.actions = actions;

        _showActionButtons(actions, element, false);
    }

    function _detachActions(connector, event) {
        event.stopPropagation();
        let element = event.currentTarget;
        _hideActionButtons(element.actions, element);
    }

    function _editorOpen(connector, data) {
        connector.editedElementsIdList.push(data.elementId);
        let element = document.getElementById(data.elementId);
        if(element?.actions){
            _hideActionButtons(element.actions, element);
            $(element.actions).remove();
            element.actions = null;
        }
    }

    function _editorClose(connector, data) {
        connector.editedElementsIdList = connector.editedElementsIdList
            .filter(elementId => elementId !== data.elementId);
    }

    function _resetSemaphore(event) {
        var connector = event.listenerData;
        connector.semaphoreInitEditorOngoing = false;
    }

    function _setSemaphore(event) {
        var connector = event.listenerData;
        connector.semaphoreInitEditorOngoing = true;
    }

    function _resetActionsOpened(connector, event) {
        actionsListOpened = false;
    }

    function _showActionsListWithDelay(connector, event) {
        var area = event.currentTarget;
        var delay = setTimeout(function () {
            _showActions(connector, event, true);
        }, 2000);
        area.onmouseout = function () {
            clearTimeout(delay);
        };
    }

    function _showActionsSingleIcon(connector, event) {
        event.stopPropagation();

        let actions = event.currentTarget;
        if (_isElementBeingEdited(connector, actions.target)) {
            return;
        }

        _showActionButtons(actions, actions.target, false)
    }

    function _showActions(connector, event, showActionsList) {
        event.stopPropagation();

        let actions = event.currentTarget;
        if (_isElementBeingEdited(connector, actions.target)) {
            return;
        }

        _showActionButtons(actions, actions.target, showActionsList)
    }

    function _hideActions(connector, event) {
        event.stopPropagation();

        let actions = event.currentTarget;
        _hideActionButtons(actions, actions.target)
    }

    function _showActionButtons(actions, element, showActionsList) {
        let $actions = $(actions);
        if ($actions.children().length) {
            let $element = $(element);
            $element.addClass("leos-editable-content");

            var elementHeight = element.clientHeight;
            if(elementHeight === 0){
                elementHeight = $('#'+$element[0].id)[0].clientHeight;
            }
            var remainingSpace = _getRemainingSpace($element, elementHeight, showActionsList);
            var top = (remainingSpace / 3.33);

            let tocItemElement = tocItemsList.find(function(e){return e.aknTag.toLowerCase() === element.tagName.toLowerCase()});
            var left_position;

            var offsetLeft = $element[0].offsetLeft;
            if(offsetLeft === 0){
                offsetLeft = $('#'+$element[0].id)[0].offsetLeft;
            }

            if (
              tocItemElement &&
              tocItemElement.actionsPosition &&
              "LEFT" === tocItemElement.actionsPosition
            ) {
              left_position = offsetLeft - 30;
            } else {
                var offsetWidth = element.offsetWidth;
                if(offsetWidth === 0){
                    offsetWidth = $('#'+$element[0].id)[0].offsetWidth;
                }
                left_position = offsetLeft + offsetWidth + 10;
            }
            var elementOffsetTop = $element[0].offsetTop;
            if(elementOffsetTop === 0){
                elementOffsetTop = $('#'+$element[0].id)[0].offsetTop;
            }
            $actions.css({
              top: elementOffsetTop - top,
              left: left_position,
              height: elementHeight + remainingSpace,
              zIndex: zIndex++, //last inserted has the precedence
            });

        }

        if(showActionsList) {
            if (actionsListOpened) {
                $actions.children().css({display: "none"})
                $($actions.children()[0]).css({display: "inline-block"})
            } else {
                $actions.children().css({display: "inline-block"})
                $($actions.children()[0]).css({display: "none"})
                if(isCoedition($(element))){
                    $actions.children("[data-widget-type='delete']").css({display: "none"});
                }
            }
            actionsListOpened = !actionsListOpened;
        } else {
            $($actions.children()[0]).css({display: "inline-block"});
        }
    }

    function _getRemainingSpace($element, elementHeigh, showActionsList) {
        let heightForSingleIcon = 31;
        var totChildren = $element.next().children().length - 1;
        var actionButtonsHeigh = totChildren * heightForSingleIcon;

        var remainingSpace = 0;
        if (!actionsListOpened && showActionsList && (actionButtonsHeigh > elementHeigh)) {
            remainingSpace = actionButtonsHeigh - elementHeigh;
        }
        return remainingSpace;
    }

    function _showHideActionsList(connector, event) {
        event.stopPropagation();

        let icon = event.currentTarget;
        let actions = $(icon)[0].parentElement;
        let element = actions.previousSibling;

        if (_isElementBeingEdited(connector, element)) {
            return;
        }

        _showActionButtons(actions, element, true)
    }

    function _hideActionButtons(actions, element) {
        $(actions).children().css({display: "none"});
        $(element).removeClass("leos-editable-content").filter("[class='']").removeAttr("class");
    }

    function _handleElementClickAction(connector, action, event) {
        const selection = window.getSelection();
        // Means the event was fired from single click and not selection
        if (selection.isCollapsed && selection.type === "Caret") {
            const isInstanceReady = CKEDITOR.currentInstance ? CKEDITOR.currentInstance.instanceReady : false;
            const targetElementId = event.currentTarget.getAttribute('id');
            const currentElementId = CKEDITOR.currentInstance ? CKEDITOR.currentInstance.element.getChildren().getItem(0).getAttribute('id') : '';
            // Ignore clicks coming from specific elements
            const shouldBeIgnored = connector.getState().isAngularUI &&
                (IGNORE_EDIT_CLICK.elementName.includes(event.target.nodeName) ||
                 IGNORE_EDIT_CLICK.elementClass.some((cl) => event.target?.classList?.contains(cl)) ||
                 IGNORE_EDIT_CLICK.elementName.includes(event.target?.offsetParent?.nodeName) ||
                 (isInstanceReady && targetElementId === currentElementId)
                );
            if (!shouldBeIgnored) {
                _handleAction(connector, "edit", event);
            }
        }
    }

    function _handleDoubleClickAction(connector, action, event) {
        if (event.detail > 1) /*Means 'double mouseup' == double click */ {
            _handleAction(connector, "edit", event)
        }
    }


    function _isCouncilInstance(connector) {
        return UTILS.COUNCIL_INSTANCE === connector.instanceType;
    }

    function _handleAction(connector, action, event) {
        // LEOS-2764 Set an attribute on these events to avoid them to be managed other components like annotate
        event.originalEvent.hostEventType = 'ckEvent';
        let $element = $(event.currentTarget);
        //disable buttons to not allow duplicate actions
        _disableActions($element);
        let originIsButton = $element.parents('.leos-actions')[0];
        if (originIsButton) {
            $element = $(originIsButton.target);
        }
        var elementId = _getElementId($element);
        var elementType = _getType($element);
        var editable = _getEditable($element);
        var deletable = _getDeletable($element);
        let optional = $element.attr('leos\:optional');
        let guidance = $element.attr('leos\:guidance');
        let differentMessageForLast = guidance && guidance === 'true' ? false : true;
        var user = connector.user;
        if (_isValidAction(action, elementId, elementType, editable, deletable, user) || optional) {
            var data = {
                action: action,
                elementId: elementId,
                elementType: elementType,
                differentMessageForLast: differentMessageForLast
            };
            var topic = "actions." + action + ".element";
            if (action == 'edit') {
                var cursorAndChildPos = getTextPositionFromElement(event.target, event.originalEvent.clientX, event.originalEvent.clientY);
                data.elementCursorPos = cursorAndChildPos[0];
                data.elementCursorChildPos = cursorAndChildPos[1];
                data.elementCursorId = getElementIdForCursorPos(event.target);
                var id = setInterval(function() {
                    if (!connector.semaphoreInitEditorOngoing) {
                        CKEDITOR.fire("editorInitOngoing");
                        if (connector.editorChannel) {
                            connector.editorChannel.publish(topic, data);
                        }
                        clearInterval(id);
                    }
                }, 50);
            } else {
                connector.editorChannel.publish(topic, data);
            }
        }
    }

    function isElementTransformedToText(node) {
        // For External References or Annotation Elements
        return node.nodeType === Node.ELEMENT_NODE
            && ((node.localName === "a" && node.hasAttribute("data-ref2link-initial"))
                || (node.localName === "hypothesis-highlight"));
    }

    function getTextPositionFromElement(element, clickX, clickY) {
        var posFound = 0;
        var childIndex = 0;
        if (element.localName === 'paragraph' || element.localName === 'subparagraph' || element.localName === 'point') {
            var elementToFind = new CKEDITOR.dom.element(element);
            elementToFind = elementToFind.findOne("aknp");
            if (elementToFind) {
                element = elementToFind.$;
            }
        }
        if (element.localName !== 'num') {
            var nodes = element.childNodes;
            var sizeOfLastTextNode = 0;
            var cumulativeSizeForElementTransformedToText = 0;
            var countElementsTransformedToText = 0;
            var countEmptyElements = 0;
            var selection = window.getSelection();
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (node.textContent && node.textContent === "") {
                    countEmptyElements++;
                    continue;
                }
                if (isElementTransformedToText(node)) {
                    cumulativeSizeForElementTransformedToText = cumulativeSizeForElementTransformedToText + sizeOfLastTextNode + node.textContent.length;
                    countElementsTransformedToText++;
                } else if (node.nodeType === Node.TEXT_NODE) {
                    sizeOfLastTextNode = node.textContent.length;
                    if (node === selection.anchorNode) {
                        break
                    }
                } else {
                    cumulativeSizeForElementTransformedToText = 0;
                }
            }
            if(selection?.anchorNode?.parentNode?.childNodes) {
                childIndex = Array.prototype.indexOf.call(selection.anchorNode.parentNode.childNodes, selection.anchorNode) - (countElementsTransformedToText*2) - countEmptyElements;
            }
            posFound = selection.anchorOffset + cumulativeSizeForElementTransformedToText;
        }
        return [posFound, childIndex];
    }

    function getElementIdForCursorPos(element) {
        var id = "";
        if (element.localName === "num" && element.parentElement && element.parentElement.localName === "article") {
            id = element.nextElementSibling.id;
        } else {
            var elementsWithoutValidId = ["num", "aknp", "content", "mp", "inline"];
            var selection = window.getSelection();
            if (selection.anchorNode) {
                var elementToGetId = selection.anchorNode.parentElement;
                while (elementToGetId.parentElement && elementsWithoutValidId.includes(elementToGetId.localName)) {
                    elementToGetId = elementToGetId.parentElement;
                }
                id = elementToGetId.id;
            }
        }
        return id;
    }

    function _disableActions($element){
        $element.css("pointer-events", "none" );
        $element.parents('.leos-actions').children().css( "pointer-events", "none" );
    }

    function _enableActions(elementId) {
        let element = document.querySelector(`#${elementId}`);
        $(element).css( "pointer-events", "all" );
        $(element).next().children().css( "pointer-events", "all" );
    }
    function _isValidAction(action, elementId, elementType, editable, deletable, user) {
        if (action && elementId && elementType) {
            return ((!editable && action === "edit") ||
                (!deletable && action === "delete")) ? false : true;
        }
        return false;
    }

    function _cancelActionElement(elementId) {
        CKEDITOR.fire("editorInitEnds");
        _enableActions(elementId);
    }

    // handle connector unregistration from server-side
    function _connectorUnregistrationListener() {
        log.debug("Unregistering Action Manager extension...");
        var connector = this;
        CKEDITOR.removeListener("editorInitEnds", _resetSemaphore);
        CKEDITOR.removeListener("editorInitOngoing", _setSemaphore);
        _teardownEditorChannel(connector);
        // clean connector
        connector.user = null;
    }

    function _setupEditorChannel(connector) {
        // retrieve editor channel
        connector.editorChannel = postal.channel(EDITOR_CHANNEL_CFG.name);
        connector.cancelActionElement = _cancelActionElement;
    }

    function _teardownEditorChannel(connector) {
        // clear editor channel
        connector.editorChannel = null;
    }

    function _getActionButtons(connector, element) {
        let actions = element.actions;
        if (!actions) {
            let $element = $(element);
            let nextSibling = $element.next();
            if(nextSibling && nextSibling[0]?.tagName == 'DIV' && nextSibling.hasClass('leos-actions')){
                actions = nextSibling;
            }else{
                let actionString = _generateActions($element, _getEditable($element), _getDeletable($element), connector);
                actions = ($.parseHTML(actionString))[0];
                $element.after(actions);
            }
        }
        return actions;
    }

    function _insertBeforeAndAfterIcon($element, insertBeforeAndAfterParam) {
        var insertBeforeAndAfter;
        let type = _getType($element).toLowerCase();
        switch (type) {
            case 'citation':
            case 'recital':
            case 'article':
            case 'level':
            case 'content':
            case 'paragraph':
            case 'subparagraph':
            case 'point':
            case 'indent':
            case 'block':
            case 'crossHeading':
            case 'alinea': {
                insertBeforeAndAfter = insertBeforeAndAfterParam;
                break;
            }
            default: insertBeforeAndAfter = false; //for all the rest false
        }
        return insertBeforeAndAfter;
    }

    function _isDeletable($element, deletable, connector) {
        let type = _getType($element);
        let tocItemElement =  _getTocItemElement(tocItemsList, type);
        switch (type) {
            case 'clause': deletable = false; break;
            case 'heading': deletable = false; break;
            default: deletable = tocItemElement && deletable ? _getTocItemElement(tocItemsList, type).deletable : deletable;
        }
        return deletable;
    }

    function isCoedition($element){
       return $element && $element[0]?.previousSibling?.hasAttribute('class')
        && $element[0]?.previousSibling?.getAttribute('class').includes('leos-user-coedition');
    }

    function _generateActions($element, editable, deletable, connector) {
        let type = _getType($element);
        type = type === 'level' ? 'point' : type;
        type = type === 'alinea' || type === 'subparagraph' ? 'sub-point' : type;
        type = type === 'crossHeading' ? 'crossheading' : type;
        type = type === 'block' ? 'crossheading' : type;
        let isHeadingOfAnOptionalLevel = false;
        let optional = $element.attr('leos:optional');
        let repeatable = $element.attr('leos:repeatable');
        let action = $element.attr('leos:action');
        let leosAction = "";
        if (optional === 'true' && $element[0] && $element[0].parentNode && $element[0].parentNode.localName === 'level') {
            isHeadingOfAnOptionalLevel = true;
            leosAction = $element[0].parentNode.getAttribute("leos:action");
        }
        // If we don't have leos:optional, uses deletable because it was previously using this variable
        // So, to avoid conflicts, we add the same old value in this case
        let hasBeforeAndAfter = optional ? false : deletable;
        if(optional && repeatable) {
            hasBeforeAndAfter = true;
        }
        var insertBeforeAndAfter = _insertBeforeAndAfterIcon($element, hasBeforeAndAfter);
        editable = editable || (editable && $element.attr('leos\:optionlist'));
        deletable = (optional === 'true' && action !== 'delete') || _isDeletable($element, deletable, connector);

        let template = ['<div class="leos-actions Vaadin-Icons">']; //FIXME: we can directly create elements

        if(connector.getState().hasUpdatePermission) {
            if (insertBeforeAndAfter && connector.getState().tocEdition) {
                template.push(`<span data-widget-type="insert.before" title="Insert ${type} before">&#xe622</span>`);
            }
            if (editable) {
                template.push(`<span data-widget-type="edit" title="Edit text">&#xe7fa</span>`);
            }
            if (deletable && connector.getState().tocEdition) {
                let title = '';
                if (!isHeadingOfAnOptionalLevel) {
                    title = `Delete ${type}`;
                } else if (leosAction !== 'delete') {
                    title = 'Delete entire section';
                }
                if (title) {
                    template.push(`<span data-widget-type="delete" title="${title}">&#xe80b</span>`);
                }
            }
            if (insertBeforeAndAfter && connector.getState().tocEdition) {
                template.push(`<span style="transform: rotate(180deg);" data-widget-type="insert.after" title="Insert ${type} after">&#xe623</span>`);
            }
        }

        //add three dots only if any action is present
        if(template.length > 2){
            template.splice(1, 0, `<span class="leos-actions-icon" data-widget-type="show.all.actions" title="Show all actions">&#xe774</span>`);
        }

        template.push('</div>');
        return template.join('');
    }

    return {
        init: _initExtension
    };
});

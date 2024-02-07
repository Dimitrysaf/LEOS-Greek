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
define(function mergeContributionExtensionModule(require) {
    "use strict";

    var log = require("logger");
    var $ = require("jquery");
    var UTILS = require("core/leosUtils");

    var MAIN_ELEMENT_SELECTOR = "article, citation, paragraph, recital, num, level, crossheading, block, akntitle, chapter, division";
    var MERGE_ACTION_ATTR = "leos:mergeAction";
    var LEOS_SOFT_ACTION = "leos:softaction";
    var LEOS_ACTION = "leos:action";
    var CONTRIBUTION_SELECTED = "selected-contribution-wrapper";
    var LEOS_CONTENT_NEW = "leos-content-new";
    var MERGE_CONTRIBUTION = "merge-contribution-wrapper";
    var REVISION_MOVED = "revision-moved_";
    var MERGE_ACTION_WRAPPER = ".merge-actions-wrapper";
    var MOVE_FROM = "move_from",MOVE_TO = "move_to", PARENT_AFFECTED = "parent_affected";
    var MOVE = "move", DELETE = "delete", ADD = "add", CONTENT_CHANGE = "content_change";

    var wrapperElementsList;
    var mergeActionList = new Array();
    var zIndex = 1;

    function _initExtension(connector) {
        connector.refreshContributions = _refreshContributions;
        connector.populateMergeActionList = _populateMergeActionList;
        connector.populateTocItemList = _populateTocItemList;
        connector.onStateChange = _connectorStateChangeListener;
        log.debug("Registering merge contribution extension unregistration listener...");
        connector.onUnregister = _unregisterActionTriggers;
        mergeActionList = new Array();
    }

    function _connectorStateChangeListener() {
        var connector = this;
        log.debug("Change details extension state changed...");
        _requestTocItemList(connector);
    }

    function _registerActionTriggers(connector) {
        var removed_elements = $("[leos\\:action='delete'], del");
        var new_elements = $("[leos\\:action='insert'], ins");
        var move_elements = $("[leos\\:softaction='" + MOVE_FROM + "']");
        var changed_element = $.merge(removed_elements, new_elements, move_elements);
        changed_element.each(function (index) {
            var $element = $(changed_element[index]);
            if ($element.attr('id').includes('revision-')) {
                var $main_element = $element.closest(MAIN_ELEMENT_SELECTOR);
                if ($main_element.length > 0 && UTILS.getElementTagName($main_element).toLowerCase() !== "num") {
                    if ($main_element.attr('id') != $element.attr('id')) {
                        $main_element.attr(PARENT_AFFECTED, "true");
                    } else {
                        $main_element.removeAttr(PARENT_AFFECTED);
                    }
                    _attachWrapperActionEvents(connector, $main_element)
                }
                if ($main_element.length > 0 && UTILS.getElementTagName($main_element).toLowerCase() !== "num")
                {
                    var $parent_element = $main_element.parents(MAIN_ELEMENT_SELECTOR);
                    if ($parent_element.length > 0 && UTILS.getElementTagName($parent_element).toLowerCase() !== "num") {
                        $parent_element.attr(PARENT_AFFECTED, "true");
                        _attachWrapperActionEvents(connector, $parent_element)
                    }
                }
            }
        });
    }

    function _attachWrapperActionEvents(connector, $element) {
       if (!$element.hasClass(MERGE_CONTRIBUTION)) {
           $element.addClass(MERGE_CONTRIBUTION);
            _attachActions(connector, $element);
            _createClickActions(connector, $element);
       } else if ($element.hasClass(CONTRIBUTION_SELECTED)) {
            let $parent = UTILS.getParentWrapper($element, wrapperElementsList);
            $parent.children(MERGE_ACTION_WRAPPER).remove();
            $parent.removeClass(CONTRIBUTION_SELECTED);
            _attachActions(connector, $element);
            _createClickActions(connector, $element);
       }
    }

    function _createClickActions(connector, $element) {
        $($element.actions).on("click.actions", "[data-widget-type='show.all.actions']", _showActionButtons.bind(undefined, $element.actions, $element, true));
        $($element.actions).on("click.actions", "[data-widget-type='accept']", _handleAction.bind(undefined, connector, "accept", $element));
        $($element.actions).on("click.actions", "[data-widget-type='reject']", _handleAction.bind(undefined, connector, "reject", $element));
        $($element.actions).on("click.actions", "[data-widget-type='undo']", _handleAction.bind(undefined, connector, "undo", $element));
        $($element.actions).on("click.actions", "[data-widget-type='unselect']", _handleAction.bind(undefined, connector, "unselect", $element));
        $($element.actions).on("mouseleave.actions", ".merge-actions", _showActionButtons.bind(undefined, $element.actions, $element, false));
    }

    function _attachActions(connector, element) {
        let actions = _getActionButtons(connector, element);
        actions.target = element;
        element.actions = actions;
        _showActionButtons(actions, element, false);
    }

    function _getRemainingSpace($element, elementHeigh, showActionsList) {
        let heightForSingleIcon = 31;
        var totChildren = $element.next().children().length - 1;
        var actionButtonsHeigh = totChildren * heightForSingleIcon;

        var remainingSpace = 0;
        if (actionButtonsHeigh > elementHeigh) {
            remainingSpace = actionButtonsHeigh - elementHeigh;
        }
        return remainingSpace;
    }

    function _showActionButtons(actions, $element, showActionsList) {
        let $actions = $(actions);
        if ($actions.children().length) {
            $(function() {
                var elementHeigh = $element[0].clientHeight;
                var remainingSpace = _getRemainingSpace($element, elementHeigh);
                var left_position = $element.position().left + $element[0].offsetWidth - 8;
                $actions.css({
                    top: $element.position().top + 9,
                    left: left_position - 13,
                    height: elementHeigh + remainingSpace,
                });
            });
        }

        if(showActionsList) {
            $actions.children().css({display: "inline-grid"})
            $($actions.children()[0]).css({display: "none"})
        } else {
            $actions.children().css({display: "none"})
            $(actions.children[0]).css({display: "inline-block"})
        }
        if ($actions.children().length == 1) {
            $actions.children().css({display: "inline-block"})
        }
    }

    function _generateActions(connector, processed) {
        let permissions = connector.getState().permissions;
        let canAccept = permissions.includes("CAN_ACCEPT_CHANGES");
        let canReject = permissions.includes("CAN_REJECT_CHANGES");
        //TODO for now assign decision on each element. The logic should be extended in a second story.
        let template = ['<div class="Vaadin-Icons merge-actions-wrapper">'];
        template.push('<div class="merge-actions">');
        if (processed) {
            template.push('<span class="undo" data-widget-type="undo" title="Undo">reply</span>');
        } else {
            if(canAccept){
                template.push('<span class="accept" data-widget-type="accept" title="Accept">check</span>');
            }
            if(canReject){
                template.push('<span class="reject" data-widget-type="reject" title="Reject">close</span>');
            }
        }
        //add three dots only if any action is present
        if(template.length > 1){
            template.splice(1, 0, `<span class="merge-actions-icon" data-widget-type="show.all.actions" title="Show all actions">&#xe774</span>`);
        }
        template.push('</div>');
        template.push('</div>');
        return template.join('');
    }

    function _generateUnselectAction(connector, action) {
        let canAccept = connector.getState().canAccept;
        let canReject = connector.getState().canReject;
        let template = ['<div class="Vaadin-Icons merge-actions-wrapper">'];
        template.push('<span class="unselect" data-widget-type="unselect" title="Unselect">rotate-left</span>');
        if (action === 'accept' && canAccept) {
            template.push('<span class="accept" data-widget-type="accept" title="Accepted">check</span>');
        } else if (action === 'reject' && canReject ) {
            template.push('<span class="reject" data-widget-type="reject" title="Rejected">close</span>');
        }

        template.push('</div>');
        return template.join('');
    }

    function _handleAction(connector, action, $element, event) {
        log.debug("Handling action for: "+$element);
        event.stopPropagation();
        _executeAction(connector, action, $element)
        _handleMovedElement(connector, action, $element);
    }

    function _handleMovedElement(connector, action, $element) {
        var softAction = $element.attr(LEOS_SOFT_ACTION);
        if(softAction) {
            var $movedElement;
            if( softAction === MOVE_FROM) {
                $movedElement = $('#'+$element.attr('leos:softmove_from'));
            } else if(softAction === MOVE_TO) {
                $movedElement = $('#'+ $element.attr('leos:softmove_to'));
            }
            if($movedElement) {
                _executeAction(connector, action, $movedElement)
            }
        }
    }

    function _executeAction(connector, action, $element) {
        let element = $element[0];
        let $parent = $element.hasClass(MERGE_CONTRIBUTION) ? $element : UTILS.getParentWrapper($element, wrapperElementsList);
        let wrapperId = $parent[0].getAttribute("id");
        let elementState = getElementState($element);
        const data = {
            action: action,
            elementState: elementState,
            elementId: element.id,
            elementTagName: element.localName,
            withTrackChanges: true
        };
        if (action === 'unselect') {
            $parent.children(MERGE_ACTION_WRAPPER).remove();
            $parent.removeClass(CONTRIBUTION_SELECTED);
            let actionString = _generateActions(connector, $parent.attr(MERGE_ACTION_ATTR) && $parent.attr(MERGE_ACTION_ATTR) !== null);
            let actions = ($.parseHTML(actionString))[0];
            $parent.next('div.merge-actions-wrapper').remove();
            $(actions).insertAfter($parent);
            actions.target = $parent;
            $parent.actions = actions;
            _showActionButtons(actions, $parent, false);
            _createClickActions(connector, $parent);
            let index = mergeActionList.findIndex(element => element.elementId === data.elementId);
            if (index !== -1) {
                mergeActionList.splice(index, 1);
            }
            const selectionData = {
                selected : false,
            };
            connector.handleContributionSelection(selectionData);
        } else if (!$parent.hasClass(CONTRIBUTION_SELECTED)) {
            $parent.addClass(CONTRIBUTION_SELECTED);
            $parent.children(MERGE_ACTION_WRAPPER).remove();
            let unselectActionString = _generateUnselectAction(connector, action);
            let unseletAction = ($.parseHTML(unselectActionString))[0];
            $parent.next('div.merge-actions-wrapper').remove();
            $(unseletAction).insertAfter($parent);
            unseletAction.target = $parent;
            $parent.actions = unseletAction;
            _showActionButtons(unseletAction, $parent, true);
            _createClickActions(connector, $parent);
            //in case of move there are two elements TO & FROM, element TO should not be sent for processing, only FROM
            // element is sent, FROM element is first removed from original (left side) document and then inserted at new position
            if (wrapperId !== null && wrapperId !== undefined && !wrapperId.startsWith(REVISION_MOVED)) {
                mergeActionList.push(data);
            }
            const selectionData = {
                selected : true,
            };
            connector.handleContributionSelection(selectionData);
        }
    }

    function getElementState($element) {
        let elementState;
        if ($element.attr(LEOS_SOFT_ACTION) && ($element.attr(LEOS_SOFT_ACTION) === MOVE_FROM || $element.attr(LEOS_SOFT_ACTION) === MOVE_TO)) {
            elementState = MOVE;
        } else if ($element.prop("tagName") === 'del' || $element.attr(LEOS_ACTION) === 'delete') {
            elementState = DELETE;
        } else if ($element.prop("tagName") === 'ins' || $element.attr(LEOS_ACTION) === 'insert') {
            elementState = ADD;
        } else if (($element.attr(PARENT_AFFECTED))) {
            elementState = CONTENT_CHANGE;
        }
        return elementState;
    }

    function _getActionButtons(connector, $element) {
        let actions = $element.actions;
        if (!actions) {
            let mergeActionAttrVal = $element.attr(MERGE_ACTION_ATTR);
            let processed = mergeActionAttrVal != null ? true : false;
            let actionString = _generateActions(connector, processed);
            actions = ($.parseHTML(actionString))[0];
            $(actions).insertAfter($element);
        }
        return actions;
    }

    function _requestTocItemList(connector) {
        connector.requestTocItemList();
    }

    function _populateTocItemList() {
        let connector = this;
        wrapperElementsList = JSON.parse(connector.getState().tocItemsJsonArray);
        _registerActionTriggers(connector);
    }

    function _refreshContributions() {
        let connector = this;
        mergeActionList = new Array();
        _registerActionTriggers(connector);
    }

    function _populateMergeActionList(selectAll) {
        let connector = this;
        return connector.handleMergeAction(selectAll === true ? _acceptAllElements(connector) : mergeActionList);
    }

    function _acceptAllElements(connector) {
        mergeActionList = new Array();
        var removed_elements = $("[leos\\:action='delete'], del");
        var new_elements = $("[leos\\:action='insert'], ins");
        var move_elements = $("[leos\\:softaction='" + MOVE_FROM + "']");
        var changed_element = $.merge(removed_elements, new_elements, move_elements);
        changed_element.each(function (index) {
            var $element = $(changed_element[index]);
            if ($element.attr('id').includes('revision-')) {
                var $main_element = $element.closest(MAIN_ELEMENT_SELECTOR);
                if ($main_element.length > 0 && UTILS.getElementTagName($main_element).toLowerCase() !== "num") {
                    _triggerAction(connector, $main_element, "accept")
                }
            }
        });
        return mergeActionList;
    }

    function _triggerAction(connector, $element, action) {
       if ($element.hasClass(MERGE_CONTRIBUTION)) {
             _executeAction(connector, action, $element)
             _handleMovedElement(connector, action, $element);
       }
    }

    function _unregisterActionTriggers() {
        log.debug("Unregistering action triggers...");
        let connector = this;
        connector.target = null;
    }

    return {
        init: _initExtension,
    };
});

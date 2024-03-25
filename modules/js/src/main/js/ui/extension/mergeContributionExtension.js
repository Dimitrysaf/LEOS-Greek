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

    var MAIN_ELEMENT_SELECTOR = "";
    var REVISION_PREFIX = "revision-";
    var MOVED_PREFIX = "moved_";
    var DELETED_PREFIX = "deleted_";
    var MERGE_ACTION_ATTR = "leos:mergeAction";
    var SELECTED_ACTION_ATTR = "leos:selectedAction";
    var TRACK_ACTION_ATTR = "leos:action";
    var SOFT_ACTION_ATTR = "leos:softaction";
    var MERGE_CONTRIBUTION = "merge-contribution-wrapper";
    var MERGE_ACTION_WRAPPER = ".merge-actions-wrapper";
    var ACTION_DONE_CLASS = "contribution-wrapper-after-merge";
    var MOVE_FROM = "move_from", INSERT = "insert", DELETE = "delete", PARENT_AFFECTED = "parent_affected", UNDO = "UNDO"
        , PROCESSED = "PROCESSED", ACCEPT = "ACCEPT", ACCEPT_TC = "ACCEPT_TC";

    var callback = (mutationList, observer) => {
        var $elements = $('.' + MERGE_CONTRIBUTION);
        for (var i = 0; i < $elements.length; i++) {
            var $element = $($elements[i]);
            var $actions = $element.next(MERGE_ACTION_WRAPPER);
            _setActionsPosition($element, $actions);
       }
    };
    var wrapperElementsList;
    var higherElements = [];

    function _initExtension(connector) {
        connector.refreshContributions = _refreshContributions;
        connector.populateMergeActionList = _populateMergeActionList;
        connector.updateMergeActionList = _updateMergeActionList;
        connector.populateTocItemList = _populateTocItemList;
        connector.onStateChange = _connectorStateChangeListener;
        log.debug("Registering merge contribution extension unregistration listener...");
        connector.onUnregister = _unregisterActionTriggers;
    }

    function _connectorStateChangeListener() {
        var connector = this;
        log.debug("Change details extension state changed...");
        _requestTocItemList(connector);
        _refreshContributions(connector);
    }

    function _registerActionTriggers(connector) {
        const $changed_element = $("[leos\\:action='" + DELETE + "'], del, [leos\\:action='" + INSERT + "'], ins, [leos\\:softaction='" + MOVE_FROM + "']");
        var $parent_element;
        for (let i = 0; i < $changed_element.length; i++) {
            var $element = $($changed_element[i]);
            if ($element.length > 0 && $element.attr(UTILS.ID) && $element.attr(UTILS.ID).includes(REVISION_PREFIX) && UTILS.getElementTagName($element).toLowerCase() !== UTILS.NUM) {
                var $main_element = $element.closest(MAIN_ELEMENT_SELECTOR);
                if ($main_element.length > 0 && UTILS.getElementTagName($main_element).toLowerCase() !== UTILS.NUM) {
                    const mainEltTag = UTILS.getElementTagName($main_element).toLowerCase();
                    if ($main_element.attr(UTILS.ID) != $element.attr(UTILS.ID)) {
                        $main_element.attr(PARENT_AFFECTED, "true");
                    } else {
                        $main_element.removeAttr(PARENT_AFFECTED);
                    }
                    if (higherElements.indexOf(mainEltTag) === -1) {
                        _attachWrapperActionEvents(connector, $main_element);
                        checkIfAlreadyProcessedAndSetCssClass($changed_element, $element, $main_element);
                    } else {
                        _attachWrapperActionEvents(connector, $element);
                    }
                }
                if ($main_element.length > 0 && UTILS.getElementTagName($main_element).toLowerCase() !== UTILS.NUM) {
                    $parent_element = $main_element.parents(MAIN_ELEMENT_SELECTOR);
                    if ($parent_element.length > 0) {
                        for (let j = 0; j < $parent_element.length; j++) {
                            var $parent = $($parent_element[j]);
                            const parentEltTag = UTILS.getElementTagName($parent).toLowerCase();
                            if (parentEltTag !== UTILS.NUM
                                && higherElements.indexOf(parentEltTag) === -1 && $changed_element.index($parent) === -1) {
                                $parent.attr(PARENT_AFFECTED, "true");
                                _attachWrapperActionEvents(connector, $parent);
                            }
                        }
                    }
                }
            }
        }
        _checkAndRemoveInvalidActions();
    }

    function checkIfAlreadyProcessedAndSetCssClass($changed_elements, $element, $main_element) {
        const $originalElementWithChangedID =$("#" + $element.attr(UTILS.ID).replace(REVISION_PREFIX, ''));
        const $originalElement =$("#" + $element.attr(UTILS.ID).replace(REVISION_PREFIX, '').replace(MOVED_PREFIX, '').replace(DELETED_PREFIX, ''));
        const action = $element.attr(MERGE_ACTION_ATTR);
        const selectedAction = $element.attr(SELECTED_ACTION_ATTR);
        if (!action && !selectedAction) {
            if ($originalElementWithChangedID.length > 0 && $changed_elements.index($originalElementWithChangedID) !== -1 &&
                ($element.attr(TRACK_ACTION_ATTR) || $element.attr(TRACK_ACTION_ATTR)) &&
                ($element.attr(TRACK_ACTION_ATTR) === $originalElementWithChangedID.attr(TRACK_ACTION_ATTR)
                    || $element.attr(SOFT_ACTION_ATTR) === $originalElementWithChangedID.attr(SOFT_ACTION_ATTR))) {
                $main_element[0].classList.add(ACTION_DONE_CLASS);
            } else if ($originalElement.length === 0 && $changed_elements.index($originalElement) === -1 && $element.attr(TRACK_ACTION_ATTR) === DELETE) {
                $main_element[0].classList.add(ACTION_DONE_CLASS);
            } else if ($originalElement.length > 0 && $changed_elements.index($originalElement) === -1  && $element.attr(TRACK_ACTION_ATTR) === INSERT && !$element.attr(SOFT_ACTION_ATTR)) {
                $main_element[0].classList.add(ACTION_DONE_CLASS);
            }
        } else if (!!action) {
            $main_element[0].classList.add(ACTION_DONE_CLASS);
        }
    }

    function _refreshActions($element, $actions) {
        const action = $element.attr(MERGE_ACTION_ATTR);
        const selectedAction = $element.attr(SELECTED_ACTION_ATTR);
        if ($actions.length > 0) {
            $actions.removeClass("selectedAccept");
            $actions.removeClass("selectedAcceptTc");
            $actions.removeClass("selectedProcessed");
            $actions.removeClass("selectedUndo");
            if (!action && !selectedAction && $element.hasClass(ACTION_DONE_CLASS)) {
                $actions.css({display: "none"});
            } else if (!!selectedAction && !!action && action !== UNDO) {
                $actions.addClass("selectedUndo");
            } else if (!!selectedAction && (!action || action === UNDO)) {
                if (selectedAction === ACCEPT) {
                    $actions.addClass("selectedAccept");
                } else if (selectedAction === ACCEPT_TC) {
                    $actions.addClass("selectedAcceptTc");
                } else if (selectedAction === PROCESSED) {
                    $actions.addClass("selectedProcessed");
                } else if (selectedAction === UNDO) {
                    $actions.addClass("selectedUndo");
                }
            } else if (!selectedAction && !!action && action !== UNDO) {
                if (action === ACCEPT) {
                    $actions.addClass("selectedAccept");
                } else if (action === ACCEPT_TC) {
                    $actions.addClass("selectedAcceptTc");
                } else if (action === PROCESSED) {
                    $actions.addClass("selectedProcessed");
                } else if (action === UNDO) {
                    $actions.addClass("selectedUndo");
                }
            }
        }
    }

    function _checkAndRemoveInvalidActions() {
        const $wrappedElements = $("." + MERGE_CONTRIBUTION);

        for (let i = 0; i < $wrappedElements.length; i++) {
            const $wrappedElement = $($wrappedElements[i]);
            const $wrappedParent = $wrappedElement.parents("." + MERGE_CONTRIBUTION);
            let $wrappedChildren = null;
            if (!!$wrappedParent && !!$wrappedParent.length > 0) {
                $wrappedChildren = $wrappedParent.find("." + MERGE_CONTRIBUTION);
            }

            // Checks if sub element has been moved to an added element
            if (!!$wrappedParent && $wrappedParent.length > 0) {
                const id = $wrappedElement.attr(UTILS.ID);
                if (!!id && id.includes(MOVED_PREFIX)) {
                    const $moveDestElt = $('#' + id.replaceAll(MOVED_PREFIX, ''));
                    if ($moveDestElt.length === 1) {
                        const $wrappedDestParent = $moveDestElt.parents("." + MERGE_CONTRIBUTION);
                        if ($wrappedDestParent.length === 1 && !$wrappedDestParent.hasClass(ACTION_DONE_CLASS)
                            && !!$wrappedDestParent.attr(TRACK_ACTION_ATTR) && $wrappedDestParent.attr(TRACK_ACTION_ATTR) === INSERT) {
                            _removeWrapperAndAction($wrappedElement);
                            // If action is not on parent and all children are not wrapped anymore, remove action on parent
                            const $updatedMrappedChildren = $wrappedParent.find("." + MERGE_CONTRIBUTION);
                            if ($updatedMrappedChildren.length === 0 && !$wrappedParent.attr(TRACK_ACTION_ATTR) && !$wrappedParent.attr(SOFT_ACTION_ATTR)) {
                                _removeWrapperAndAction($wrappedParent);
                            }
                        }
                    }
                }
            }

            // Checks if sub element is included in element not yet added, action should be made on added parent
            if ($wrappedParent.length === 1 && !$wrappedParent.hasClass(ACTION_DONE_CLASS)
                && !!$wrappedParent.attr(TRACK_ACTION_ATTR) && $wrappedParent.attr(TRACK_ACTION_ATTR) === INSERT) {
                _removeWrapperAndAction($wrappedElement);
            }
        }
    }

    function _removeWrapperAndAction($element) {
        $element[0].classList.remove(MERGE_CONTRIBUTION);
        let $actions = $element.next(MERGE_ACTION_WRAPPER);
        if (!!$actions && $actions.length > 0) {
            $actions.remove();
        }
        $element.actions = null;
    }

    function _attachWrapperActionEvents(connector, $element) {
       if (!$element.hasClass(MERGE_CONTRIBUTION)) {
           $element[0].classList.add(MERGE_CONTRIBUTION);
           _attachActions(connector, $element);
           _createClickActions(connector, $element);
           let observer = new MutationObserver(callback);
           $element[0].observer = observer;
           observer.observe($element[0], { childList: true, subtree: true });
       }
    }

    function _createClickActions(connector, $element) {
        var threeDots = $($element.actions).find("[data-widget-type='show.all.actions']");
        if (threeDots.length > 0) {
            threeDots[0].addEventListener("click", (event) => {
                connector.showActionMenu(event, $element[0], $element.actions);
            });
        }
        var undo = $($element.actions).find("[data-widget-type='undo']");
        if (undo.length > 0) {
            undo[0].addEventListener("click", (event) => {
                connector.undo(event, $element[0], $element.actions);
            });
        }
    }

    function _attachActions(connector, element) {
        let actions = _getActionButtons(connector, element);
        actions.target = element;
        element.actions = actions;
        _showActionButtons(actions, element);
    }

    function _getRemainingSpace($element, elementHeigh) {
        let heightForSingleIcon = 31;
        var totChildren = $element.next().children().length - 1;
        var actionButtonsHeigh = totChildren * heightForSingleIcon;

        var remainingSpace = 0;
        if (actionButtonsHeigh > elementHeigh) {
            remainingSpace = actionButtonsHeigh - elementHeigh;
        }
        return remainingSpace;
    }

    function _setActionsPosition($element, $actions) {
        if ($actions.length > 0) {
            var elementHeigh = $element[0].clientHeight;
            var actionsWidth = $actions[0].offsetWidth;
            var remainingSpace = _getRemainingSpace($element, elementHeigh);

            var left_position;

            left_position = $element.position().left + $element[0].offsetWidth /*- 8*/;

            $actions.css({
                top: $element.position().top + 9,
                left: left_position + 5 /*- actionsWidth*/,
            });
        }
    }

    function _showActionButtons(actions, $element) {
        let $actions = $(actions);
        if ($actions.children().length) {
            $(function() {
                _refreshActions($element, $actions);
                _setActionsPosition($element, $actions);
            });
        }
    }

    function _generateActions(action) {
        let template = ['<div class="Vaadin-Icons merge-actions-wrapper">'];
        template.push(`<span class="merge-actions-icon" data-widget-type="show.all.actions" title="Show all actions">&#xe774</span>`);
        template.push('<div class="merge-actions">');
        template.push('<span class="accepted_tc" data-widget-type="accepted_tc"><img src="assets/images/accepted_tc.png" alt="" height="16"/></span>');
        template.push('<span class="accepted" data-widget-type="accepted"><img src="assets/images/accepted.png" alt="" height="16"/></span>');
        template.push('<span class="processed" data-widget-type="processed"><img src="assets/images/processed.png" alt="" height="16"/></span>');
        template.push('<span class="undo" data-widget-type="undo" title="Undo">reply</span>');
        template.push('</div>');
        template.push('</div>');
        return template.join('');
    }

    function _updateMergeActionList(mergeAction) {
        var $elements = $('.' + MERGE_CONTRIBUTION);
        for (var i = 0; i < $elements.length; i++) {
            var $element = $($elements[i]);
            var $actions = $element.next(MERGE_ACTION_WRAPPER);
            _refreshActions($element, $actions);
            _setActionsPosition($element, $actions);
        }
    }

    function _getActionButtons(connector, $element) {
        let actions = $element.actions;
        if (!actions) {
            let mergeActionAttrVal = $element.attr(MERGE_ACTION_ATTR) || $element.attr(SELECTED_ACTION_ATTR);
            let action = mergeActionAttrVal != null ? true : false;
            let actionString = _generateActions(action);
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
        higherElements = wrapperElementsList.filter(elt => elt.draggable && elt.childrenAllowed).map(elt => elt.aknTag);
        var wrappedEltsList = wrapperElementsList.filter(elt => elt.draggable).map(elt => elt.aknTag);
        wrappedEltsList.push(UTILS.NUM);
        wrappedEltsList.push(UTILS.PARAGRAPH);
        wrappedEltsList.push(UTILS.HEADING);
        MAIN_ELEMENT_SELECTOR = wrappedEltsList.join(',');
        _registerActionTriggers(connector);
    }

    function _refreshContributions() {
        let connector = this;
        _registerActionTriggers(connector);
    }

    function _populateMergeActionList(selectAll) {
        let connector = this;
        return connector.handleMergeAction();
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

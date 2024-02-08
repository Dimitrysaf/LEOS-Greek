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
    var MERGE_ACTION_ATTR = "leos:mergeAction";
    var MERGE_CONTRIBUTION = "merge-contribution-wrapper";
    var MERGE_ACTION_WRAPPER = ".merge-actions-wrapper";
    var MOVE_FROM = "move_from",MOVE_TO = "move_to", PARENT_AFFECTED = "parent_affected";

    var callback = (mutationList, observer) => {
        var $elements = $('.' + MERGE_CONTRIBUTION);
        for (var i = 0; i < $elements.length; i++) {
            var $element = $($elements[i]);
            var $actions = $element.next(MERGE_ACTION_WRAPPER);
            _setActionsPosition($element, $actions);
       }
    };
    var wrapperElementsList;

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

    function _refreshActions($element, $actions) {
        const action = $element.attr(MERGE_ACTION_ATTR);
        if ($actions.length > 0) {
            if (!!action) {
                const accepted = $actions.find("[data-widget-type='accepted']");
                const accepted_tc = $actions.find("[data-widget-type='accepted_tc']");
                const processed = $actions.find("[data-widget-type='processed']");
                if ($actions.children()[0].style.display !== 'none') {
                    $actions.children().css({display: "inline-block"});
                    $($actions.children()[0]).css({display: "none"});
                    if (action === 'ACCEPT') {
                        accepted.css({display: "inline-block"});
                        accepted_tc.css({display: "none"});
                        processed.css({display: "none"});
                    } else if (action === 'ACCEPT_TC') {
                        accepted.css({display: "none"});
                        accepted_tc.css({display: "inline-block"});
                        processed.css({display: "none"});
                    } else if (action === 'PROCESSED') {
                        accepted.css({display: "none"});
                        accepted_tc.css({display: "none"});
                        processed.css({display: "inline-block"});
                    }
                }
            } else {
                if ($actions.children()[1].style.display !== 'none') {
                    $actions.children().css({display: "none"});
                    $($actions.children()[0]).css({display: "inline-block"});
                }
            }
        }
    }

    function _attachWrapperActionEvents(connector, $element) {
       if (!$element.hasClass(MERGE_CONTRIBUTION)) {
           $element.addClass(MERGE_CONTRIBUTION);
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

            left_position = $element.position().left + $element[0].offsetWidth - 8;

            $actions.css({
                top: $element.position().top + 9,
                left: left_position + 5 - actionsWidth,
                height: elementHeigh + remainingSpace,
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
            let mergeActionAttrVal = $element.attr(MERGE_ACTION_ATTR);
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
        var wrappedEltsList = wrapperElementsList.filter(elt => elt.draggable).map(elt => elt.aknTag);
        wrappedEltsList.push("num");
        wrappedEltsList.push("paragraph");
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

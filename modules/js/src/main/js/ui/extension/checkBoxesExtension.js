/*
 * Copyright 2022 European Commission
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
define(function checkBoxesExtensionModule(require) {
    "use strict";

    let log = require("logger");
    let UTILS = require("core/leosUtils");

    let UNCHECKED;
    let CHECKED;
    let CHECKBOX_TAGNAME;
    let NAME_ATTR;
    let NAME_ATTR_CHECKED;
    let NAME_ATTR_UNCHECKED;
    const NUM = "num";
    const INLINE = "inline";


    function _initExtension(connector) {
        log.debug("Initializing checkBoxes extension...");

        // restrict scope to the extended target
        connector.target = UTILS.getParentElement(connector);

        log.debug("Registering checkBoxes extension unregistration listener...");
        connector.onUnregister = _connectorUnregistrationListener;

        log.debug("Registering checkBoxes extension state change listener...");
        connector.onStateChange = _connectorStateChangeListener;

        _initAndAddListenersToCheckBoxes(connector);
    }

    // handle connector unregistration on client-side
    function _connectorUnregistrationListener() {
        let connector = this;
        log.debug("Unregistering checkBoxes extension...");
        // clean connector
        connector.target = null;
    }

    // handle connector state change on client-side
    function _connectorStateChangeListener() {
        let connector = this;
        setTimeout(function () {
            _initAndAddListenersToCheckBoxes(connector);
        }, 0); //move it to the event queue to be executed after the current thread
        log.debug("checkBoxes extension state changed...");
    }

    function _toggleCheckBox(connector, event) {
        event.stopImmediatePropagation();
        (this.text().includes(UNCHECKED)) ? this.html(this.html().replace(UNCHECKED, CHECKED)) : this.html(this.html().replace(CHECKED, UNCHECKED));
        (this.attr(NAME_ATTR) == NAME_ATTR_UNCHECKED) ? this.attr(NAME_ATTR, NAME_ATTR_CHECKED) : this.attr(NAME_ATTR, NAME_ATTR_UNCHECKED);
        let data = {
            elementId: this.attr("id"),
            elementType: this.prop("tagName").toLowerCase(),
            elementFragment: this.prop('outerHTML').replace(" id=", " xml:id="),
        };
        connector.saveElement(data);
    }

    function _initAndAddListenersToCheckBoxes(connector) {
        let state = connector.getState();
        CHECKBOX_TAGNAME = state.checkBoxTagName;
        CHECKED = state.checkedBoxValue;
        UNCHECKED = state.uncheckedBoxValue;
        NAME_ATTR = state.checkBoxAttributeName;
        NAME_ATTR_CHECKED = state.checkedBoxAttribute;
        NAME_ATTR_UNCHECKED = state.uncheckedBoxAttribute;
        _addListeners(connector, CHECKBOX_TAGNAME, NAME_ATTR, NAME_ATTR_CHECKED);
        _addListeners(connector, CHECKBOX_TAGNAME, NAME_ATTR, NAME_ATTR_UNCHECKED);
    }
    function _addListeners(connector, tagName, attrName, attrValue) {
        let target = connector.target;
        $(target).find(tagName).each(function( index ) {
            if ($(this).children(NUM).length > 0) {
                let num = $($(this).children(NUM)[0]);
                if(!!num && num.children(INLINE).length > 0){
                    let inline = $(num.children(INLINE)[0]);
                    if (!!inline.attr(attrName) && inline.attr(attrName) === attrValue) {
                        inline.on("click", _toggleCheckBox.bind(inline, connector));
                    }
                }
            }
        });
    }


    return {
        init: _initExtension
    };
});

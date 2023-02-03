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
define(function datePickerExtensionModule(require) {
    "use strict";

    // load module dependencies
    var log = require("logger");
    var $ = require("jquery");
    var jqueryUi = require("jqueryUi");
    var UTILS = require("core/leosUtils");
    var dateFormats = new Map();
    dateFormats.set('yy', 'YYYY');
    dateFormats.set('dd/mm/yy', '[DD/MM]YYYY');
    var selector = "inline[name='date']";


    function _initDatePicker(connector) {
        log.debug("Initializing DatePicker extension...");

        // restrict scope to the extended target
        connector.target = UTILS.getParentElement(connector);

        _initDatePickerWidget(connector);
        log.debug("Registering DatePicker extension un-registration listener...");
        connector.onUnregister = _connectorUnregistrationListener;

        log.debug("Registering DatePicker extension state change listener...");
        connector.onStateChange = _connectorStateChangeListener;
    }

    function _initDatePickerWidget(connector) {
        $(selector).each(function(e) {
            var idAttr = $(this).attr('id');
            var element = $('#'+idAttr);
            var format = $(this).attr('period');
            var formName = $(this).attr('name');
            var hiddenInput = document.createElement('input');
            hiddenInput.name = formName;
            hiddenInput.type = 'hidden';
            $(this).after(hiddenInput);
            $(hiddenInput).datepicker({
                changeMonth: true,
                changeYear: true,
                showOn: "button",
                dateFormat: format,
                constrainInput: true,
                showButtonPanel: true,
                closeText: 'Reset',
                onClose: function (dateText, inst) {
                    let dateFormat = dateFormats.get(element.attr('period'));
                    if ($(event.srcElement).hasClass('ui-datepicker-close') && !(dateFormat === element.text())) {
                        element.text(dateFormat);
                        var data = {
                            elementId: element.attr('id'),
                            elementFragment: element[0].outerHTML,
                            elementType: element[0].localName
                        }
                        connector.saveDocument(data);
                    }
                },
                onSelect : function(dateText, inst) {
                    var dateVal = $(this).attr('value');
                    if(dateVal && !(dateVal === element.text())) {
                        element.text(dateVal);
                        var data = {
                            elementId: element.attr('id'),
                            elementFragment: element[0].outerHTML,
                            elementType: element[0].localName
                        }
                        connector.saveDocument(data);
                    }
                }
            });

        });


    }

    // handle connector un-registration on client-side
    function _connectorUnregistrationListener() {
        var connector = this;
        log.debug("Unregistering DatePicker extension...");
        // clean connector
        connector.target = null;
    }

    // handle connector state change on client-side
    function _connectorStateChangeListener() {
        var connector = this;
        log.debug("DatePicker extension state changed...");
    }

    return {
        init: _initDatePicker
    };
});

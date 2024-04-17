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
define(function actionHandlerModule(require) {
    "use strict";

    // load module dependencies
    var log = require("logger");
    var $ = require('jquery');

    function _setupActionHandler(connector) {
        log.debug("Setting up action handler...");
        if (connector.editorChannel) {
            let channel = connector.editorChannel;
            if(channel.bus?.subscriptions) {
                channel.bus.unsubscribeFor({"topic": "actions.insert.*.element"});
                channel.bus.unsubscribeFor({"topic": "actions.edit.element"});
                channel.bus.unsubscribeFor({"topic": "actions.delete.element"});
            }
            connector.actionSubscriptions = [];
            // subscribe to editor channel action topics
            connector.actionSubscriptions.push(channel.subscribe("actions.insert.*.element", _insertElementAction.bind(undefined, connector)));
            connector.actionSubscriptions.push(channel.subscribe("actions.edit.element", _editElementAction.bind(undefined, connector)));
            connector.actionSubscriptions.push(channel.subscribe("actions.delete.element", _deleteElementAction.bind(undefined, connector)));
        }
    }

    function _insertElementAction(connector, data) {
        log.debug("Insert element action...");
        let regExp = /(?:^insert)\.(\w+).*$/i;
        let matches = regExp.exec(data.action);
        if (matches) {
            data.position = matches[1];
            connector.insertElementAction(data);
        }
    }

    function _editElementAction(connector, data) {
        let currentInstance = _getCurrentEditorInstance();
        if (!currentInstance) {
            log.debug("Edit element action...");
            connector.editElementAction(data);
        } else {
            log.debug("Closing the old editor and editing element...");
            if (!currentInstance.checkDirty()) {
                currentInstance.fire("close");
                connector.editElementAction(data);
            } else {
                if (currentInstance.fire("canBeSaved")) {
                    currentInstance.readOnly = false;
                    currentInstance.fire("save", {
                        data: currentInstance.getData(),
                        isSaveAndClose: true
                    });
                    currentInstance.fire("close");
                    connector.editElementAction(data);
                } else {
                    _cancelActionElement(data.elementId);
                }
            }
        }
    }

    function _cancelActionElement(elementId) {
        CKEDITOR.fire("editorInitEnds");
        let element = document.querySelector(`#${elementId}`);
        $(element).css( "pointer-events", "all" );
        $(element).next().children().css( "pointer-events", "all" );
    }

    function _getCurrentEditorInstance() {
        for ( let currentInstance in CKEDITOR.instances) {
            return CKEDITOR.instances[currentInstance];
        }
    }

    function _deleteElementAction(connector, data) {
        log.debug("Delete element action...");
        connector.deleteElementAction(data);
    }

    function _teardownActionHandler(connector) {
        log.debug("Tearing down action handler...");
        // unsubscribe from editor channel action topics
        if (connector.actionSubscriptions) {
            connector.actionSubscriptions.forEach(function(subscription) {
                subscription.unsubscribe();
            });
            connector.actionSubscriptions = null;
        }
    }

    return {
        setup: _setupActionHandler,
        teardown: _teardownActionHandler
    };
});
/*
 * Copyright 2025 European Union
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
define(function leosOrientationPluginModule(require) {
    "use strict";

    // load module dependencies
    var pluginTools = require("plugins/pluginTools");
    var pluginName = "leosOrientation";
    var $ = require("jquery");
    var ORIENTATION_CMD_NAME = "orientation";
    var iconOrientation =  'icons/orientation.png';

    var LANDSCAPE = CKEDITOR.TRISTATE_ON;
    var PORTRAIT = CKEDITOR.TRISTATE_OFF;
    var ORIENTATION_MODE = LANDSCAPE;

    var pluginDefinition = {
        requires: 'richcombo',
        icons: pluginName.toLowerCase(),

        init: function(editor) {

            editor.ui.addButton('leosOrientation', {
                label: 'Orientation',
                command: ORIENTATION_CMD_NAME,
                toolbar: 'orientation',
                icon: this.path + iconOrientation,
            });

            var orientationCommand = editor.addCommand(ORIENTATION_CMD_NAME, {
                exec: function(editor) {
                    _changeOrientationMode(this, editor);
                }
            });

            editor.on("focus", _setCurrentOrientationMode, null, orientationCommand);
            editor.on("dataReady", _setCurrentOrientationMode, null, orientationCommand);
        }
    };

    function _changeOrientationMode(cmd, editor) {
        ORIENTATION_MODE = cmd.state === LANDSCAPE ? PORTRAIT : LANDSCAPE;
        cmd.setState(ORIENTATION_MODE);

        var rootElement = editor.element.getFirst();
        if(!rootElement.getAttribute('data-akn-name')){
            rootElement = rootElement.getNext();
        }

        var dataAknAttribute = rootElement.getAttribute("class");
        var isClassAtrr = true;
        if(!dataAknAttribute || rootElement.getName() == 'h2'){
            isClassAtrr = false;
            dataAknAttribute = rootElement.getAttribute("data-akn-class");
        }
        var isLandscape = !!dataAknAttribute && dataAknAttribute.includes("landscape");
        var oldClass = isLandscape ? "landscape" : "portrait";
        var newClass = isLandscape ? "portrait" : "landscape";
        if(!!dataAknAttribute){
            if(dataAknAttribute.includes(oldClass)){
                dataAknAttribute = dataAknAttribute.replace(oldClass, newClass);
            }else{
                dataAknAttribute = dataAknAttribute.concat( ' ' + newClass);
            }
        }else{
            dataAknAttribute = newClass;
        }
        var attrToReplace = isClassAtrr ? "class" : "data-akn-class";
        rootElement.setAttribute(attrToReplace, dataAknAttribute);

        editor.fire("change");
    }

    //This method sets the current orientation mode (Portrait/Landscape) to the command state.
    function _setCurrentOrientationMode(event) {
        var cmd = event.listenerData;
        var rootElement = event.editor.element.getFirst();
        if(!rootElement.getAttribute('data-akn-name')){
            rootElement = rootElement.getNext();
        }
        var dataAknAttribute = rootElement.getAttribute("data-akn-class");
        var isLandscape = !!dataAknAttribute && dataAknAttribute.includes("landscape");
        ORIENTATION_MODE = isLandscape ? LANDSCAPE :PORTRAIT

        cmd.setState(ORIENTATION_MODE);
    }


    pluginTools.addPlugin(pluginName, pluginDefinition);

    // return plugin module
    var pluginModule = {
        name: pluginName
    };

    return pluginModule;
});
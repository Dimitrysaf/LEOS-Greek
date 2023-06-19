/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* jshint browser: false, node: true */

'use strict';

// var plugin = require( '/src/main/js/editor/plugins/leosInlineSave/leosInlineSavePlugin.js' )
// var plugin = require( 'C:\\Users\\admin\\Documents\\Projects\\EC\\os\\core\\modules\\js\\src\\main\\js\\editor\\plugins\\leosInlineSave\\leosInlineSavePlugin.js' )


module.exports = {
  name: 'bender-ckeditor-leos',
  // 'src/main/js/editor/plugins',

  attach: function () {
    console.info("brigde-leos-wrraper.js.............")
    var bender = this
    var files = [];
    var pluginName = 'C:\\Users\\admin\\Documents\\Projects\\EC\\os\\core\\modules\\js\\src\\main\\js\\editor\\plugins\\leosInlineSave\\leosInlineSavePlugin.js'
    var plugin = require(pluginName)
    console.info("plugin.files: ", plugin.files)
    
    if (plugin.files) {
      files = files.concat(plugin.files);
    }
    bender.use(plugin);
    console.info("files : ", files)
    
    bender.plugins.addFiles(files);
  }
};

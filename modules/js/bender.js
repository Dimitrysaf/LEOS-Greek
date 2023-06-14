/* jshint browser: false, node: true */

/**
 * Bender configuration file
 *
 * @param {Object}   applications       Applications used in current project
 * @param {Array}    browsers           List of browsers used for testing
 * @param {Number}   captureTimeout     Timeout before which a launched browser should connect to the server
 * @param {String}   certificate        Location of the certificate file
 * @param {Boolean}  debug              Enable debug logs
 * @param {Number}   defermentTimeout   Timeout before which a plugin should finish initializing on a test page
 * @param {String}   framework          Default framework used for the tests
 * @param {String}   hostname           Host on which the HTTP and WebSockets servers will listen
 * @param {Array}    manualBrowsers     List of browsers accepting manual tests
 * @param {Number}   manualTestTimeout  Timeout after which a manual test is marked as failed
 * @param {Array}    plugins            List of Bender plugins to load at startup (Required)
 * @param {Number}   port               Port on which the HTTP and WebSockets servers will listen
 * @param {String}   privateKey         Location of the private key file
 * @param {Boolean}  secure             Flag telling whether to serve contents over HTTPS and WSS
 * @param {Number}   slowAvgThreshold   Average test case duration threshold above which a test is marked as slow
 * @param {Number}   slowThreshold      Test duration threshold above which a test is marked as slow
 * @param {String}   startBrowser       Name of a browser to start when executing bender run command
 * @param {Number}   testRetries        Number of retries to perform before marking a test as failed
 * @param {Object}   tests              Test groups for the project (Required)
 * @param {Number}   testTimeout        Timeout after which a test will be fetched again
 */

'use strict';

var config = {

	applications: {
		ckeditor: {
			path: 'src/main/lib/ckeditor_4.12.1',
			files: [
				'ckeditor.js'
			]
		}
	},

	framework: 'yui',

	// secure: true,
	privateKey: 'src/test/ckeditor/_benderjs/ssl/key.pem',
	certificate: 'src/test/ckeditor/_benderjs/ssl/cert.pem',

	coverage: {
		paths: [
			// 'adapters/**/*',
			// 'core/**/*',
			// 'dev/**/*',
			// 'lang/**/*',
			// 'plugins/**/*',
			// 'samples/**/*',
			'*.js'
		],
		options: {
			checkTrackerVar: true
		}
	},

	plugins: [
		'benderjs-coverage',
		'benderjs-yui',
		'benderjs-sinon',
		'benderjs-jquery',
		'src/test/ckeditor/_benderjs/ckeditor',
        // 'src/main/js/editor/plugins',
        // 'editor/plugins',
		'benderjs-yui-beautified'
	],

	tests: {
		'Plugins': {
			applications: [ 'ckeditor' ],
			basePath: 'src/test/ckeditor',
            paths: [
                'plugins/**',
                '!**/_*/**'
            ]
		},
        'External Plugins': {
            applications: [ 'ckeditor' ],
            basePath: 'src/main/js/editor/plugins/',
            paths: [
                '*/tests/**',
                '!**/_*/**'
            ]
        },
	},

	'yui-beautified': {
		indent_with_tabs: true,
		wrap_line_length: 0,
		// All tags should be reformatted.
		unformatted: 'none',
		indent_inner_html: true,
		preserve_newlines: true,
		max_preserve_newlines: 0,
		indent_handlebars: false,
		end_with_newline: true,
		extra_liners: 'head, body, div, p, /html'
	},
	mathJaxLibPath: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML'
};

module.exports = config;

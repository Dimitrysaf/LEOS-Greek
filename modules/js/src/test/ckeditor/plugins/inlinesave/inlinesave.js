/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,save,wysiwygarea,sourcearea,leosInlineSave */

function saveTest( editor ) {
	var count = 0;

    // var CMD_NAME = "inlinesave";
    var CMD_NAME = "leosInlineSave";

	editor.on( 'instanceReady', function() {
		editor.execCommand( CMD_NAME );
		console.log("save")
		setTimeout( function() {
			resume( function() {
				assert.areSame( 1, count, 'save was fired once' );
			} );
		} );
	} );

	editor.on( CMD_NAME, function() {
		count++;
		return false;
	} );

	wait();
}

bender.test( {
	'test save event in WYSIWYG mode': function() {
		var editor = CKEDITOR.replace( 'editor1' );
		saveTest( editor );
	},

	'test save event in source mode': function() {
		var editor = CKEDITOR.replace( 'editor2' , { startupMode: 'source' } );
		saveTest( editor );
	}
} );

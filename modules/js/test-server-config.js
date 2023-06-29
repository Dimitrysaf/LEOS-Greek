module.exports = {
    indexFile: "/index.html",
    jsSrcDir: "/src/main/js",
    jsTestSrcDir: "/src/test/js",
    // specDir: "/src/test/js/editor/unit",
    specDir: "/src/test/js/editor/unit/pluginModules/leosTrackChanges",
    excludes: [
        "backspace",
        "deleteMultipleCharacter",
        "leosTrackChangesUtil",
        "testLeosTrackChangesPlugin",
        "testLeosTrackChangesPlugin_deleteCharacter",
        "testLeosTrackChangesPlugin_TC",
        "testLeosTrackChangesPlugin_TC2",
        "testLeosTrackChangesPlugin_trackChanges_deleteCharacter.js",
    ],
};

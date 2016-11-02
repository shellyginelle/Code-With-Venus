define(function(require,exports,module){"use strict";var ProjectManager=brackets.getModule("project/ProjectManager"),PreferencesManager=brackets.getModule("preferences/PreferencesManager"),prefs=PreferencesManager.getExtensionPrefs("code-folding"),FOLDS_PREF_KEY="code-folding.folds",ENABLE_CODE_FOLDING="Enable code folding",MIN_FOLD_SIZE="Minimum fold size",MIN_FOLD_SIZE_HELP="Minimum number of lines to allow in a foldable range",SAVE_FOLD_STATES="Save fold states",SAVE_FOLD_STATES_HELP="Save fold states to disk when editor is closed and restore the folds when reopened",ALWAYS_USE_INDENT_FOLD="Always use indent fold",ALWAYS_USE_INDENT_FOLD_HELP="Fall back to using level of indentation as a folding guideline if no range finder is found for the current mode.",HIDE_FOLD_BUTTONS="Hide fold triangles",HIDE_FOLD_BUTTONS_HELP="Hide fold triangles unless the mouse is over the gutter",MAX_FOLD_LEVEL="Max fold level",MAX_FOLD_LEVEL_HELP="Used to limit the number of nested folds to find and collapse when View -> Collapse All is called or Alt is held down when collapsing. Should improve performance for large files.";prefs.definePreference("enabled","boolean",true,{name:ENABLE_CODE_FOLDING,description:ENABLE_CODE_FOLDING});prefs.definePreference("minFoldSize","number",2,{name:MIN_FOLD_SIZE,description:MIN_FOLD_SIZE_HELP});prefs.definePreference("saveFoldStates","boolean",true,{name:SAVE_FOLD_STATES,description:SAVE_FOLD_STATES_HELP});prefs.definePreference("alwaysUseIndentFold","boolean",false,{name:ALWAYS_USE_INDENT_FOLD,description:ALWAYS_USE_INDENT_FOLD_HELP});prefs.definePreference("hideUntilMouseover","boolean",false,{name:HIDE_FOLD_BUTTONS,description:HIDE_FOLD_BUTTONS_HELP});prefs.definePreference("maxFoldLevel","number",2,{name:MAX_FOLD_LEVEL,description:MAX_FOLD_LEVEL_HELP});PreferencesManager.stateManager.definePreference(FOLDS_PREF_KEY,"object",{});function simplify(folds){if(!folds){return}var res={},range;Object.keys(folds).forEach(function(line){range=folds[line];res[line]=Array.isArray(range)?range:[[range.from.line,range.from.ch],[range.to.line,range.to.ch]]});return res}function inflate(folds){if(!folds){return}var ranges={},obj;Object.keys(folds).forEach(function(line){obj=folds[line];ranges[line]={from:{line:obj[0][0],ch:obj[0][1]},to:{line:obj[1][0],ch:obj[1][1]}}});return ranges}function getViewStateContext(){var projectRoot=ProjectManager.getProjectRoot();return{location:{scope:"user",layer:"project",layerID:projectRoot&&projectRoot.fullPath}}}function getFolds(path){var context=getViewStateContext();var folds=PreferencesManager.getViewState(FOLDS_PREF_KEY,context);return inflate(folds[path])}function setFolds(path,folds){var context=getViewStateContext();var allFolds=PreferencesManager.getViewState(FOLDS_PREF_KEY,context);allFolds[path]=simplify(folds);PreferencesManager.setViewState(FOLDS_PREF_KEY,allFolds,context)}function getSetting(key){return prefs.get(key)}function clearAllFolds(){PreferencesManager.setViewState(FOLDS_PREF_KEY,{})}module.exports.getFolds=getFolds;module.exports.setFolds=setFolds;module.exports.getSetting=getSetting;module.exports.clearAllFolds=clearAllFolds;module.exports.prefsObject=prefs});
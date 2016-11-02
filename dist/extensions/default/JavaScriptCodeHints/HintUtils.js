define(function(require,exports,module){"use strict";var Acorn=require("thirdparty/acorn/acorn");var LANGUAGE_ID="javascript",HTML_LANGUAGE_ID="html",SUPPORTED_LANGUAGES=[LANGUAGE_ID,HTML_LANGUAGE_ID],SINGLE_QUOTE="'",DOUBLE_QUOTE='"';function makeToken(value,positions){positions=positions||[];return{value:value,positions:positions}}function maybeIdentifier(key){var result=false,i;for(i=0;i<key.length;i++){result=Acorn.isIdentifierChar(key.charCodeAt(i));if(!result){break}}return result}function hintable(token){function _isInsideRegExp(token){return token.state&&(token.state.lastType==="regexp"||token.state.localState&&token.state.localState.lastType==="regexp")}switch(token.type){case"comment":case"number":case"regexp":case"string":case"def":return false;case"string-2":return!_isInsideRegExp(token);default:return true}}function hintableKey(key,showOnDot){return key===null||showOnDot&&key==="."||maybeIdentifier(key)}function eventName(name){var EVENT_TAG="brackets-js-hints";return name+"."+EVENT_TAG}function annotateLiterals(literals,kind){return literals.map(function(t){t.literal=true;t.kind=kind;t.origin="ecma5";if(kind==="string"){if(/[\\\\]*[^\\]"/.test(t.value)){t.delimiter=SINGLE_QUOTE}else{t.delimiter=DOUBLE_QUOTE}}return t})}function annotateKeywords(keywords){return keywords.map(function(t){t.keyword=true;t.origin="ecma5";return t})}function isSupportedLanguage(languageId){return SUPPORTED_LANGUAGES.indexOf(languageId)!==-1}var KEYWORD_NAMES=["break","case","catch","continue","debugger","default","delete","do","else","finally","for","function","if","in","instanceof","new","return","switch","this","throw","try","typeof","var","void","while","with"],KEYWORD_TOKENS=KEYWORD_NAMES.map(function(t){return makeToken(t,[])}),KEYWORDS=annotateKeywords(KEYWORD_TOKENS);var LITERAL_NAMES=["true","false","null"],LITERAL_TOKENS=LITERAL_NAMES.map(function(t){return makeToken(t,[])}),LITERALS=annotateLiterals(LITERAL_TOKENS);exports.makeToken=makeToken;exports.hintable=hintable;exports.hintableKey=hintableKey;exports.maybeIdentifier=maybeIdentifier;exports.eventName=eventName;exports.annotateLiterals=annotateLiterals;exports.isSupportedLanguage=isSupportedLanguage;exports.KEYWORDS=KEYWORDS;exports.LITERALS=LITERALS;exports.LANGUAGE_ID=LANGUAGE_ID;exports.SINGLE_QUOTE=SINGLE_QUOTE;exports.DOUBLE_QUOTE=DOUBLE_QUOTE;exports.SUPPORTED_LANGUAGES=SUPPORTED_LANGUAGES});
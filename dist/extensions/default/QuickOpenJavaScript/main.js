define(function(require,exports,module){"use strict";var EditorManager=brackets.getModule("editor/EditorManager"),QuickOpen=brackets.getModule("search/QuickOpen"),JSUtils=brackets.getModule("language/JSUtils"),DocumentManager=brackets.getModule("document/DocumentManager"),StringMatch=brackets.getModule("utils/StringMatch");function FileLocation(fullPath,line,chFrom,chTo,functionName){this.fullPath=fullPath;this.line=line;this.chFrom=chFrom;this.chTo=chTo;this.functionName=functionName}function createFunctionList(){var doc=DocumentManager.getCurrentDocument();if(!doc){return}var functionList=[];var docText=doc.getText();var lines=docText.split("\n");var functions=JSUtils.findAllMatchingFunctionsInText(docText,"*");functions.forEach(function(funcEntry){var chFrom=lines[funcEntry.lineStart].indexOf(funcEntry.name);var chTo=chFrom+funcEntry.name.length;functionList.push(new FileLocation(null,funcEntry.lineStart,chFrom,chTo,funcEntry.name))});return functionList}function search(query,matcher){var functionList=matcher.functionList;if(!functionList){functionList=createFunctionList();matcher.functionList=functionList}query=query.slice(query.indexOf("@")+1,query.length);var filteredList=$.map(functionList,function(fileLocation){var searchResult=matcher.match(fileLocation.functionName,query);if(searchResult){searchResult.fileLocation=fileLocation}return searchResult});StringMatch.basicMatchSort(filteredList);return filteredList}function match(query){return query[0]==="@"}function itemFocus(selectedItem,query,explicit){if(!selectedItem||query.length<2&&!explicit){return}var fileLocation=selectedItem.fileLocation;var from={line:fileLocation.line,ch:fileLocation.chFrom};var to={line:fileLocation.line,ch:fileLocation.chTo};EditorManager.getCurrentFullEditor().setSelection(from,to,true)}function itemSelect(selectedItem,query){itemFocus(selectedItem,query,true)}QuickOpen.addQuickOpenPlugin({name:"JavaScript functions",languageIds:["javascript"],search:search,match:match,itemFocus:itemFocus,itemSelect:itemSelect})});
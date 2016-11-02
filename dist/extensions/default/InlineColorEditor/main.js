define(function(require,exports,module){"use strict";var EditorManager=brackets.getModule("editor/EditorManager"),ExtensionUtils=brackets.getModule("utils/ExtensionUtils"),InlineColorEditor=require("InlineColorEditor").InlineColorEditor,ColorUtils=brackets.getModule("utils/ColorUtils");function prepareEditorForProvider(hostEditor,pos){var colorRegEx,cursorLine,match,sel,start,end,endPos,marker;sel=hostEditor.getSelection();if(sel.start.line!==sel.end.line){return null}colorRegEx=new RegExp(ColorUtils.COLOR_REGEX);cursorLine=hostEditor.document.getLine(pos.line);do{match=colorRegEx.exec(cursorLine);if(match){start=match.index;end=start+match[0].length}}while(match&&(pos.ch<start||pos.ch>end));if(!match){return null}pos.ch=start;endPos={line:pos.line,ch:end};marker=hostEditor._codeMirror.markText(pos,endPos);hostEditor.setSelection(pos,endPos);return{color:match[0],marker:marker}}function inlineColorEditorProvider(hostEditor,pos){var context=prepareEditorForProvider(hostEditor,pos),inlineColorEditor,result;if(!context){return null}else{inlineColorEditor=new InlineColorEditor(context.color,context.marker);inlineColorEditor.load(hostEditor);result=new $.Deferred;result.resolve(inlineColorEditor);return result.promise()}}ExtensionUtils.loadStyleSheet(module,"css/main.css");EditorManager.registerInlineEditProvider(inlineColorEditorProvider);exports.prepareEditorForProvider=prepareEditorForProvider;exports.inlineColorEditorProvider=inlineColorEditorProvider});
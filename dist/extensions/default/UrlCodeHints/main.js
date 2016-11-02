define(function(require,exports,module){"use strict";var AppInit=brackets.getModule("utils/AppInit"),CodeHintManager=brackets.getModule("editor/CodeHintManager"),CSSUtils=brackets.getModule("language/CSSUtils"),FileSystem=brackets.getModule("filesystem/FileSystem"),FileUtils=brackets.getModule("file/FileUtils"),HTMLUtils=brackets.getModule("language/HTMLUtils"),ProjectManager=brackets.getModule("project/ProjectManager"),StringUtils=brackets.getModule("utils/StringUtils"),Data=require("text!data.json"),urlHints,data,htmlAttrs,styleModes=["css","text/x-less","text/x-scss"];function UrlCodeHints(){}UrlCodeHints.prototype._getUrlList=function(query){var directory,doc,docDir,queryDir="",queryUrl,result=[],self,targetDir,unfiltered=[];doc=this.editor&&this.editor.document;if(!doc||!doc.file){return result}docDir=FileUtils.getDirectoryPath(doc.file.fullPath);queryUrl=window.PathUtils.parseUrl(query.queryStr);if(queryUrl){queryDir=queryUrl.directory}if(queryDir.length>0&&queryDir[0]==="/"){targetDir=ProjectManager.getProjectRoot().fullPath+decodeURI(queryDir).substring(1)}else{targetDir=docDir+decodeURI(queryDir)}if(this.cachedHints){if(!this.cachedHints.query||this.cachedHints.query.tag!==query.tag||this.cachedHints.query.attrName!==query.attrName||this.cachedHints.queryDir!==queryDir||this.cachedHints.docDir!==docDir){this.cachedHints=null}}if(this.cachedHints){unfiltered=this.cachedHints.unfiltered}else{directory=FileSystem.getDirectoryForPath(targetDir);self=this;if(self.cachedHints&&self.cachedHints.deferred){self.cachedHints.deferred.reject()}self.cachedHints={};self.cachedHints.deferred=$.Deferred();self.cachedHints.unfiltered=[];directory.getContents(function(err,contents){var currentDeferred,entryStr,syncResults;if(!err){contents.forEach(function(entry){if(ProjectManager.shouldShow(entry)){entryStr=queryDir+entry._name;if(entry._isDirectory){entryStr+="/"}unfiltered.push(entryStr)}});self.cachedHints.unfiltered=unfiltered;self.cachedHints.query=query;self.cachedHints.queryDir=queryDir;self.cachedHints.docDir=docDir;if(self.cachedHints.deferred.state()!=="rejected"){currentDeferred=self.cachedHints.deferred;syncResults=self._getUrlList(query);if(syncResults instanceof Array){currentDeferred.resolveWith(self,[syncResults])}else{if(currentDeferred&&currentDeferred.state()==="pending"){currentDeferred.reject()}if(self.cachedHints.deferred&&self.cachedHints.deferred.state()==="pending"){self.cachedHints.deferred.reject();self.cachedHints.deferred=null}}}}});return self.cachedHints.deferred}if(queryUrl.filename==="."){result.push(queryDir+".")}else if(queryUrl.filename===".."){result.push(queryDir+"..")}unfiltered.forEach(function(item){result.push(item)});return result};UrlCodeHints.prototype._getUrlHints=function(query){var hints=[],sortFunc;if(query.queryStr.indexOf("?")===-1){this.closeOnSelect=false;hints=this._getUrlList(query);sortFunc=StringUtils.urlSort}return{hints:hints,sortFunc:sortFunc}};UrlCodeHints.prototype.hasHints=function(editor,implicitChar){var mode=editor.getModeForSelection();if(mode==="html"){return this.hasHtmlHints(editor,implicitChar)}else if(styleModes.indexOf(mode)>-1){return this.hasCssHints(editor,implicitChar)}return false};UrlCodeHints.prototype.hasCssHints=function(editor,implicitChar){this.editor=editor;var cursor=this.editor.getCursorPos();this.info=CSSUtils.getInfoAtPos(editor,cursor);if(this.info.context!==CSSUtils.PROP_VALUE&&this.info.context!==CSSUtils.IMPORT_URL){return false}var i,val="";for(i=0;i<=this.info.index&&i<this.info.values.length;i++){if(i<this.info.index){val+=this.info.values[i]}else{val+=this.info.values[i].substring(0,this.info.offset)}}if(val.match(/^\s*url\(/i)){return true}return false};UrlCodeHints.prototype.hasHtmlHints=function(editor,implicitChar){var tagInfo,query,tokenType;this.editor=editor;tagInfo=HTMLUtils.getTagInfo(editor,editor.getCursorPos());query=null;tokenType=tagInfo.position.tokenType;if(tokenType===HTMLUtils.ATTR_VALUE){if(htmlAttrs[tagInfo.attr.name]){if(tagInfo.position.offset>=0){query=tagInfo.attr.value.slice(0,tagInfo.position.offset)}else{query=""}var hintsAndSortFunc=this._getUrlHints({queryStr:query}),hints=hintsAndSortFunc.hints;if(hints instanceof Array){var i,foundPrefix=false;query=query.toLowerCase();for(i=0;i<hints.length;i++){if(hints[i].toLowerCase().indexOf(query)===0){foundPrefix=true;break}}if(!foundPrefix){query=null}}}}return query!==null};UrlCodeHints.prototype.getHints=function(key){var mode=this.editor.getModeForSelection(),cursor=this.editor.getCursorPos(),filter="",hints=[],sortFunc,query={queryStr:""},result=[];if(mode==="html"){var tagInfo=HTMLUtils.getTagInfo(this.editor,cursor),tokenType=tagInfo.position.tokenType;if(tokenType!==HTMLUtils.ATTR_VALUE||!htmlAttrs[tagInfo.attr.name]){return null}if(tagInfo.position.offset>=0){query.queryStr=tagInfo.attr.value.slice(0,tagInfo.position.offset)}this.info=tagInfo}else if(styleModes.indexOf(mode)>-1){this.info=CSSUtils.getInfoAtPos(this.editor,cursor);var context=this.info.context;if(context!==CSSUtils.PROP_VALUE&&context!==CSSUtils.IMPORT_URL){return null}if(this.info.index!==-1){var i,val="";for(i=0;i<this.info.index;i++){val+=this.info.values[i]}if(this.info.index<this.info.values.length){val+=this.info.values[this.info.index].substr(0,this.info.offset)}val=val.replace(/^\s*url\(/i,"");var matchWhitespace=val.match(/^\s*/);if(matchWhitespace){this.info.leadingWhitespace=matchWhitespace[0];val=val.substring(matchWhitespace[0].length)}else{this.info.leadingWhitespace=null}if(val.match(/^["']/)){this.info.openingQuote=val[0];val=val.substring(1)}else{this.info.openingQuote=null}query.queryStr=val}}else{return null}if(query.queryStr!==null){filter=query.queryStr;var hintsAndSortFunc=this._getUrlHints(query);hints=hintsAndSortFunc.hints;sortFunc=hintsAndSortFunc.sortFunc}this.info.filter=filter;if(hints instanceof Array&&hints.length){var lowerCaseFilter=filter.toLowerCase();console.assert(!result.length);result=$.map(hints,function(item){if(item.toLowerCase().indexOf(lowerCaseFilter)===0){return item}}).sort(sortFunc);return{hints:result,match:query.queryStr,selectInitial:true,handleWideResults:false}}else if(hints instanceof Object&&hints.hasOwnProperty("done")){var deferred=$.Deferred();hints.done(function(asyncHints){var lowerCaseFilter=filter.toLowerCase();result=$.map(asyncHints,function(item){if(item.toLowerCase().indexOf(lowerCaseFilter)===0){return item}}).sort(sortFunc);deferred.resolveWith(this,[{hints:result,match:query.queryStr,selectInitial:true,handleWideResults:false}])});return deferred}return null};UrlCodeHints.prototype.insertHint=function(completion){var mode=this.editor.getModeForSelection();completion=encodeURI(completion);if(mode==="html"){return this.insertHtmlHint(completion)}else if(styleModes.indexOf(mode)>-1){return this.insertCssHint(completion)}return false};UrlCodeHints.prototype.getCharOffset=function(array,pos1,pos2){var i,count=0;if(pos1.index===pos2.index){return pos2.offset>=pos1.offset?pos2.offset-pos1.offset:0}else if(pos1.index<pos2.index){if(pos1.index<0||pos1.index>=array.length||pos2.index<0||pos2.index>=array.length){return 0}for(i=pos1.index;i<=pos2.index;i++){if(i===pos1.index){count+=array[i].length-pos1.offset}else if(i===pos2.index){count+=pos2.offset}else{count+=array[i].length}}}return count};UrlCodeHints.prototype.findNextPosInArray=function(array,ch,pos){var i,o,searchOffset;for(i=pos.index;i<array.length;i++){searchOffset=i===pos.index?pos.offset:0;o=array[i].indexOf(ch,searchOffset);if(o!==-1){return{index:i,offset:o}}}return{index:-1,offset:-1}};UrlCodeHints.prototype.insertCssHint=function(completion){var cursor=this.editor.getCursorPos(),start={line:cursor.line,ch:cursor.ch},end={line:cursor.line,ch:cursor.ch};var hasClosingQuote=false,hasClosingParen=false,insertText=completion,moveLen=0,closingPos={index:-1,offset:-1},searchResult={index:-1,offset:-1};if(this.info.context!==CSSUtils.PROP_VALUE&&this.info.context!==CSSUtils.IMPORT_URL){return false}if(!this.closeOnSelect&&completion.match(/\/$/)===null){this.closeOnSelect=true}if(this.info.openingQuote){closingPos=this.findNextPosInArray(this.info.values,this.info.openingQuote,this.info);hasClosingQuote=closingPos.index!==-1}if(hasClosingQuote){searchResult=this.findNextPosInArray(this.info.values,")",closingPos);hasClosingParen=searchResult.index!==-1}else{closingPos=this.findNextPosInArray(this.info.values,")",this.info);hasClosingParen=closingPos.index!==-1}if(this.closeOnSelect){if(closingPos.index!==-1){end.ch+=this.getCharOffset(this.info.values,this.info,closingPos)}}else{var nextSlash=this.findNextPosInArray(this.info.values,"/",this.info);if(nextSlash.index===this.info.index&&nextSlash.offset===this.info.offset){end.ch+=1}}if(this.info.filter.length>0){start.ch-=this.info.filter.length}if(this.info.openingQuote&&!hasClosingQuote){insertText+=this.info.openingQuote}if(!hasClosingParen){if(this.info.leadingWhitespace){insertText+=this.info.leadingWhitespace}insertText+=")"}this.editor._codeMirror.replaceRange(insertText,start,end);if(this.closeOnSelect){moveLen=(hasClosingQuote?1:0)+(hasClosingParen?1:0);if(moveLen>0){this.editor.setCursorPos(start.line,start.ch+completion.length+moveLen)}return false}else{moveLen=(this.info.openingQuote&&!hasClosingQuote?1:0)+(!hasClosingParen?1:0);if(moveLen>0){this.editor.setCursorPos(start.line,start.ch+completion.length)}}return true};UrlCodeHints.prototype.insertHtmlHint=function(completion){var cursor=this.editor.getCursorPos(),start={line:-1,ch:-1},end={line:-1,ch:-1},tagInfo=HTMLUtils.getTagInfo(this.editor,cursor),tokenType=tagInfo.position.tokenType,charCount=0,endQuote="",shouldReplace=false;if(tokenType===HTMLUtils.ATTR_VALUE){if(!this.closeOnSelect&&completion.match(/\/$/)===null){this.closeOnSelect=true;shouldReplace=true}if(!tagInfo.attr.hasEndQuote){endQuote=tagInfo.attr.quoteChar;if(endQuote){completion+=endQuote}else if(tagInfo.position.offset===0){completion='"'+completion+'"'}}else if(completion===tagInfo.attr.value){shouldReplace=false}if(shouldReplace){charCount=tagInfo.attr.value.length}else{charCount=this.info.filter.length;if(this.info.attr.value.length>charCount&&this.info.attr.value[charCount]==="/"){charCount+=1}}}end.line=start.line=cursor.line;start.ch=cursor.ch-tagInfo.position.offset;end.ch=start.ch+charCount;this.editor.document.replaceRange(completion,start,end);if(!this.closeOnSelect){if(tokenType===HTMLUtils.ATTR_VALUE&&!tagInfo.attr.hasEndQuote){this.editor.setCursorPos(start.line,start.ch+completion.length-1)}return true}if(tokenType===HTMLUtils.ATTR_VALUE&&tagInfo.attr.hasEndQuote){this.editor.setCursorPos(start.line,start.ch+completion.length+1)}return false};function _clearCachedHints(){if(urlHints&&urlHints.cachedHints&&urlHints.cachedHints.deferred&&urlHints.cachedHints.deferred.state()!=="pending"){urlHints.cachedHints=null}}AppInit.appReady(function(){data=JSON.parse(Data);htmlAttrs=data.htmlAttrs;urlHints=new UrlCodeHints;CodeHintManager.registerHintProvider(urlHints,["css","html","less","scss"],5);FileSystem.on("change",_clearCachedHints);FileSystem.on("rename",_clearCachedHints);exports.hintProvider=urlHints})});
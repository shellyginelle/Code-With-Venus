define(function(require,exports,module){"use strict";var BrambleEvents=brackets.getModule("bramble/BrambleEvents");var MainViewManager=brackets.getModule("view/MainViewManager");var ViewCommandHandlers=brackets.getModule("view/ViewCommandHandlers");var Path=brackets.getModule("filesystem/impls/filer/FilerUtils").Path;var PreferencesManager=brackets.getModule("preferences/PreferencesManager");var UI=require("lib/UI");var Theme=require("lib/Theme");function sendEvent(data){parent.postMessage(JSON.stringify(data),"*")}function sendLayoutEvent(){var $firstPane=$("#first-pane");var $secondPane=$("#second-pane");var $sidebar=$("#sidebar");sendEvent({type:"bramble:layout",sidebarWidth:$sidebar.is(":visible")?$sidebar.width():0,firstPaneWidth:$firstPane?$firstPane.width():0,secondPaneWidth:$secondPane?$secondPane.width():0})}function sendActiveEditorChangeEvent(file){var fullPath=file.fullPath;var filename=Path.basename(fullPath);sendEvent({type:"bramble:activeEditorChange",fullPath:fullPath,filename:filename})}function start(){BrambleEvents.on("bramble:updateLayoutStart",sendLayoutEvent);BrambleEvents.on("bramble:updateLayoutEnd",sendLayoutEvent);BrambleEvents.on("bramble:previewModeChange",function(e,mode){sendEvent({type:"bramble:previewModeChange",mode:mode})});BrambleEvents.on("bramble:sidebarChange",function(e,visible){sendEvent({type:"bramble:sidebarChange",visible:visible})});var lastKnownEditorFilePath;MainViewManager.on("currentFileChange",function(e,file){if(!file){return}if(file.fullPath!==lastKnownEditorFilePath){lastKnownEditorFilePath=file.fullPath;sendActiveEditorChangeEvent(file)}});BrambleEvents.on("fileRenamed",function(e,oldFilePath,newFilePath){if(oldFilePath===lastKnownEditorFilePath){lastKnownEditorFilePath=newFilePath;sendActiveEditorChangeEvent({fullPath:newFilePath})}});BrambleEvents.on("bramble:themeChange",function(e,theme){sendEvent({type:"bramble:themeChange",theme:theme})});BrambleEvents.on("bramble:tutorialVisibilityChange",function(e,visible){sendEvent({type:"bramble:tutorialVisibilityChange",visible:visible})});BrambleEvents.on("bramble:inspectorChange",function(e,enabled){sendEvent({type:"bramble:inspectorChange",enabled:enabled})});ViewCommandHandlers.on("fontSizeChange",function(e,fontSize){sendEvent({type:"bramble:fontSizeChange",fontSize:fontSize})});PreferencesManager.on("change","wordWrap",function(){sendEvent({type:"bramble:wordWrapChange",wordWrap:PreferencesManager.get("wordWrap")})})}function loaded(){var initialFile=MainViewManager.getCurrentlyViewedFile();var fullPath=initialFile.fullPath;var filename=Path.basename(fullPath);var $firstPane=$("#first-pane");var $secondPane=$("#second-pane");var $sidebar=$("#sidebar");sendEvent({type:"bramble:loaded",sidebarVisible:$sidebar.is(":visible"),sidebarWidth:$sidebar.is(":visible")?$sidebar.width():0,firstPaneWidth:$firstPane?$firstPane.width():0,secondPaneWidth:$secondPane?$secondPane.width():0,fullPath:fullPath,filename:filename,previewMode:UI.getPreviewMode(),fontSize:ViewCommandHandlers.getFontSize(),theme:Theme.getTheme(),wordWrap:PreferencesManager.get("wordWrap")})}exports.start=start;exports.loaded=loaded});
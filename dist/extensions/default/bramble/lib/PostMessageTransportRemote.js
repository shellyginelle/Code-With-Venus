(function(global){"use strict";var parent=window.opener||window.parent;var postMessageTransport={_callbacks:null,setCallbacks:function(callbacks){this._callbacks=callbacks},connect:function(url){var self=this;parent.postMessage(JSON.stringify({type:"connect",url:global.location.href}),"*");if(self._callbacks&&self._callbacks.connect){self._callbacks.connect()}},send:function(msgStr){parent.postMessage(JSON.stringify({type:"message",message:msgStr}),"*")},enable:function(){this.connect();var self=this;window.addEventListener("message",function(event){if(self._callbacks&&self._callbacks.message){self._callbacks.message(event.data)}})}};global._Brackets_LiveDev_Transport=postMessageTransport})(this);
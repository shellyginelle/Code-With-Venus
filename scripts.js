window.addEventListener("load", doFirst, false);

doFirst() {
  //Image reference, add dragstart function
  toolImage = document.getElementByI('venus');
  toolImage.addEventListener("dragstart", startDrag, false);

  editorBox = document.getElementByI('editorBox');
  editorBox.addEventListener("dragenter", function(e){ev.preventDefault();}, false);
  editorBox.addEventListener("dragover", dragOver, false);
  editorBox.addEventListener("drop", dropElem, false);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function startDrag(ev) {
    var code = "<header></header>";
    ev.dataTransfer.setData("text", code);
}

function dragOver(ev) {
    editorBox.
}

function dropElem(ev) {
    ev.preventDefault();
    editorBox.innerHTML = ev.dataTransfer.getData("text");
}

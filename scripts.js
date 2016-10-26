/* Editor (utilizing Code Mirror) Functions */
window.onload = function () {
  var editableCodeMirror = CodeMirror.fromTextArea(document.getElementById('editorTextArea'), {
    mode: "html",
    theme: "default",
    lineNumbers: true
  });
}

/* Drag and Drop Functions */

function allowDrop(ev) {
    ev.preventDefault();
}

function onDrag(ev) {
    /* //On Drag
    var code = "<example> Hello World </example>";
    ev.dataTransfer.setData("text", ev.code); */
    ev.dataTransfer.setData("text", ev.target.id);
}

function onDrop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data).cloneNode(true));
}

/* Editor (utilizing Code Mirror) Functions */
window.onload = function () {
    var editableCodeMirror = CodeMirror.fromTextArea(document.getElementById('editorTextArea'), {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        mode: 'text/html',
        tabMode: 'indent',
        lineWrapping: true,
        autoCloseTags: true,
    });

    editableCodeMirror.style.width = 200 + "px";
    editableCodeMirror.style.height = 200 + "px";

    t = document.getElementById('editorTextArea');
    t.addEventListener('input',function(){
      document.getElementById('websitePreview').innerHTML = t.value;
    });
}

function loadCode () {
  t = document.getElementById('editorTextArea');
  t.addEventListener('input',function(){
    document.getElementById('websitePreview').innerHTML = t.value;
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

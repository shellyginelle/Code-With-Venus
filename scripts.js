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

var dragAndDrop = {

    limit: 4,
    count: 0,

    init: function () {
        this.dragula();
        this.eventListeners();
    },

    eventListeners: function () {
        this.dragula.on('drop', this.dropped.bind(this));
    },

    dragula: function () {
        this.dragula = dragula([document.querySelector('#left'), document.querySelector('#right')],
        {
            moves: this.canMove.bind(this),
            copy: true,
        });
    },

    canMove: function () {
        return this.count < this.limit;
    },

    dropped: function (el) {
        this.count++;
    }

};

dragAndDrop.init();

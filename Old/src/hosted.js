/**
 * NOTE: this is meant for debugging Bramble, and as an example
 * of how to do basic things with the API. It wasn't intended as a production setup.
 *
 * Use ?forceFiles=1 to force startup to re-install the default files
 */
(function() {
    "use strict";

    require.config({
        baseUrl: './'
    });

    // Allow the user to override what we do with default files using `?forceFiles=1`
    var forceFiles = window.location.search.indexOf("forceFiles=1") > -1;

    // Default filesystem content
    var projectRoot = "/7/projects/30";

    var index = "<html>\n"                                                +
                "  <head>\n"                                              +
                "    <title>Code with Venus</title>\n"                    +
                "  </head>\n"                                             +
                "  <body>\n"                                              +
                "    <p>Welcome to the world of web-based programming!\n" +
                "    Venus aims to help new developers to learn and\n"    +
                "    code productively, while introducing you to\n"       +
                "    the fundamentals of coding. Let's get started</p>\n" +
                "  </body>\n"                                             +
                "</html>";

    var tutorial = "<html>\n"                                             +
                   "  <head>\n"                                           +
                   "    <title>Venus Tutorial</title>\n"                  +
                   "  </head>\n"                                          +
                   "  <body>\n"                                           +
                   "    <p>This is the tutorial.</p>\n"                   +
                   "  </body>\n"                                          +
                   "</html>";

    var css = "p {\n"                                                     +
              "  color: purple;\n"                                        +
              "}";

    var script = "function add(a, b) {\n"                                 +
                 "  return a|0 + b|0;\n"                                  +
                 "}";

    var header = '<h1>\n' +
                 'Enter Header Text Here\n'+
                 '</h1>\n';

    function installDefaultFiles(Bramble, callback) {
        var fs = Bramble.getFileSystem();
        var sh = new fs.Shell();
        var Path = Bramble.Filer.Path;

        // Simulate a more complex root, like Thimble does
        sh.mkdirp(projectRoot, function(err) {
            // If we run this multiple times, the dir will exist
            if (err && err.code !== "EEXIST") {
                throw err;
            }

            // Stick things in the project root
            function writeProjectFile(path, data, callback) {
                path = Path.join(projectRoot, path);

                fs.writeFile(path, data, function(err) {
                    if(err) {
                        throw err;
                    }
                    callback();
                });
            }

            writeProjectFile("script.js", script, function() {
                writeProjectFile("style.css", css, function() {
                    writeProjectFile("index.html", index, function() {
                        writeProjectFile("tutorial.html", tutorial, function() {
                            callback();
                        });
                    });
                });
            });
        });
    }

    function writeHTML() {
      var fs = Bramble.getFileSystem();
      var sh = new fs.Shell();
      var Path = Bramble.Filer.Path;

      // Simulate a more complex root, like Thimble does
      sh.mkdirp(projectRoot, function(err) {
          // If we run this multiple times, the dir will exist
          if (err && err.code !== "EEXIST") {
              throw err;
          }

          // Stick things in the project root
          function writeProjectFile(path, data, callback) {
              path = Path.join(projectRoot, path);

              fs.writeFile(path, data, function(err) {
                  if(err) {
                      throw err;
                  }
                  callback();
              });
          }

          writeProjectFile("index.html", header, function() {
          });
      });
    }

    function ensureFiles(Bramble, callback) {
        var fs = Bramble.getFileSystem();

        // If there's already a project dir there, don't create it again
        // so that we don't overwrite user's files.
        fs.exists(projectRoot, function(exists) {
            if(!exists || forceFiles) {
                return installDefaultFiles(Bramble, callback);
            }
            callback();
        });
    }

    function load(Bramble) {
        Bramble.load("#bramble",{
            url: "index.html",
            useLocationSearch: true
        });

        // Event listeners
        Bramble.on("ready", function(bramble) {
            console.log("Bramble ready");
            // For debugging, attach to window.
            window.bramble = bramble;
        });

        Bramble.once("error", function(err) {
            console.error("Bramble error", err);
            alert("Fatal Error: " + err.message + ". If you're in Private Browsing mode, data can't be written.");
        });

        Bramble.on("readyStateChange", function(previous, current) {
            console.log("Bramble readyStateChange", previous, current);
        });

        // Setup the filesystem while Bramble is loading
        ensureFiles(Bramble, function() {
            // Now that fs is setup, tell Bramble which root dir to mount
            // and which file within that root to open on startup.
            Bramble.mount(projectRoot);
        });
    }

    // Support loading from src/ or dist/ to make local dev easier
    require(["bramble/client/main"], function(Bramble) {
        load(Bramble);
    }, function(err) {
        console.log("Unable to load Bramble from src/, trying from dist/");
        require(["bramble"], function(Bramble) {
            load(Bramble);
        });
    });
}());

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

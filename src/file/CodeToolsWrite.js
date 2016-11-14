/**
 * Set of utilities for working with files and text content.
 */
define(function (require, exports, module) {
    "use strict";

    require("utils/Global");

    var FileSystemError     = require("filesystem/FileSystemError"),
        DeprecationWarning  = require("utils/DeprecationWarning"),
        LanguageManager     = require("language/LanguageManager"),
        PerfUtils           = require("utils/PerfUtils"),
        Strings             = require("strings"),
        StringUtils         = require("utils/StringUtils");

        // These will be loaded asynchronously
        var DocumentCommandHandlers, LiveDevelopmentUtils;

        /**
         * @const {Number} Maximium file size (in megabytes)
         *   (for display strings)
         *   This must be a hard-coded value since this value
         *   tells how low-level APIs should behave which cannot
         *   have a load order dependency on preferences manager
         */
        var MAX_FILE_SIZE_MB = 16;

        /**
         * @const {Number} Maximium file size (in bytes)
         *   This must be a hard-coded value since this value
         *   tells how low-level APIs should behave which cannot
         *   have a load order dependency on preferences manager
         */
        var MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

    /**
     * Asynchronously writes a file as UTF-8 encoded text.
     * @param {!File} file File to write
     * @param {!string} text
     * @param {boolean=} allowBlindWrite Indicates whether or not CONTENTS_MODIFIED
     *      errors---which can be triggered if the actual file contents differ from
     *      the FileSystem's last-known contents---should be ignored.
     * @return {$.Promise} a jQuery promise that will be resolved when
     * file writing completes, or rejected with a FileSystemError string constant.
     */
    function writeHTML(file, text, allowBlindWrite) {
    /**
     * Font Styles
     */
        var header = '<h1>\n' +
                     'Enter Header Text Here\n'+
                     '</h1>\n';

        var paragraph = '<p>\n' +
                        'Enter Paragraph Text Here\n'+
                        '</p>\n';

        var link = '<a href=" Enter URL Here "> Enter Link Text Here </a>\n';

        var separator = '<br>';

        var bold = '<b>\n' +
                   'Enter Text Here\n' +
                   '</b>\n';

        var italic = '<i>\n' +
                     'Enter Text Here\n' +
                     '</i>\n';

        var underline = '<u>\n' +
                        'Enter Text Here\n' +
                        '</u>\n';
    /**
     * Basic Elements
     */
        var table = '<table style="width:100%">\n' +
                    ' <tr>\n' +
                    '   <th> Enter Titles Here </th>\n' +
                    '   <th> Enter Titles Here </th>\n' +
                    ' </tr>\n' +
                    ' <tr>\n' +
                    '   <th> Enter Content Here </th>\n' +
                    '   <th> Enter Content Here </th>\n' +
                    ' </tr>\n' +
                    ' <tr>\n' +
                    '   <th> Enter Content Here </th>\n' +
                    '   <th> Enter Content Here </th>\n' +
                    ' </tr>\n' +
                    '</table>\n';

        var list = '<ul>\n' +
                   '  <li> Enter List Item Here </li>\n' +
                   '  <li> Enter List Item Here </li>\n' +
                   '  <li> Enter List Item Here </li>\n' +
                   '<ul>\n' +

    /**
     * Media Elements
     */
        var video = '<video width="320" height="240" controls>' +
                    '<source src="Enter Video File.mp4" type="video/mp4">' +
                    '</video>\n';

        var image = '<img src=" Enter Image File.jpeg" alt=" Enter Image Description " width="100" height="100">\n';

        var audio = '<audio controls>' +
                    '<source src="Enter Audio File.mp3" type="audio/mpeg">' +
                    '</audio>\n';

        var result = new $.Deferred(),
            options = {};

        if (allowBlindWrite) {
            options.blind = true;
        }

        file.write(text, options, function (err) {
            if (!err) {
                result.resolve();
            } else {
                result.reject(err);
            }
        });

        return result.promise();
    }

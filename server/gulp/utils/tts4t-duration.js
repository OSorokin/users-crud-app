/**
 * Basically this module is the same as 'gulp-duration'
 * Except the fact that logger can be configured. It is useful in case of providing gulp output in the same style.
 */

'use strict';

var pretty = require('pretty-hrtime');
var through2 = require('through2');
var gutil = require('gulp-util');

var PLUGIN_NAME = 'tts4t-duration';

module.exports.start = start;
module.exports.logger = logger;

function start(log) {
  log = log || logger(console);
  var startTime = process.hrtime();

  return {
    step: function (name) {
      var stream = through2.obj({
        objectMode: true
      });

      stream.once('end', function () {
        var time = process.hrtime(startTime);

        log(name, time);
      });

      return stream;
    }
  };
}

function logger(logWriter, isInternalFormat) {
  return function (name, time) {
    if (isInternalFormat) {
      logWriter.info(name, time);
      return;
    }
    logWriter.info(gutil.colors.blue('[' + PLUGIN_NAME + ']'), name + '.', gutil.colors.magenta(pretty(time)));
  }
}

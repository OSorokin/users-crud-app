var through2 = require('through2');
var gutil = require('gulp-util');

var PLUGIN_NAME = 'tts4t-process-env-mode';

module.exports = function (mode, logger) {
  var previous = process.env.mode;

  process.env.mode = mode;
  logger.info(
    gutil.colors.blue('[' + PLUGIN_NAME + ']'),
    '"process.env.mode" set to:',
    gutil.colors.cyan(JSON.stringify(mode))
  );

  var stream = through2.obj({
    objectMode: true
  });

  stream.restore = function () {
    var restorer = through2.obj({
      objectMode: true
    });

    restorer.once('end', function () {
      process.env.mode = previous;
      logger.info(
        gutil.colors.blue('[' + PLUGIN_NAME + ']'),
        '"process.env.mode" restored to:',
        gutil.colors.cyan(previous)
      );
    });

    return restorer;
  };

  return stream;
};
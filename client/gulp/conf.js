'use strict';

var gutil = require('gulp-util');

exports.logger = _logger;

exports.paths = {
  src: {
    root:'src',
    common:'../common',
    packageJson: 'package.json'
  },
  folderToContainBundleFiles: '../distribution',
  folderToContainBundle: '../distribution/client/bundle'
};

var EXTENSION_ZIP = 'zip';

exports.bundle = {
  paths: {
    client: 'client'
  },
  constructRevisionName: _constructRevisionName,
  fileExt: '.' + EXTENSION_ZIP
};

function _constructRevisionName() {
  var logger = _logger('angular2cruds');
  var suffix = '';

  var args = require('yargs').argv;
  if (args.revisionNameSuffix != null) {
    suffix = args.revisionNameSuffix;
    logger.info('Suffix "' + suffix + '" is set from "--revisionNameSuffix" command line parameter');
  }
  if (process.env.REVISION_NAME_SUFFIX != null) {
    suffix = process.env.REVISION_NAME_SUFFIX;
    logger.info('Suffix "' + suffix + '" is set from "REVISION_NAME_SUFFIX" environment variable');
  }

  var invalidSymbols = /[^_-a-zA-Z0-9]/gi;
  if (suffix.match(invalidSymbols)) {
    var newSuffix = suffix.replace(invalidSymbols, '');
    logger.warning('Suffix "' + suffix + '" replaced with "' + newSuffix + '"');
    suffix = newSuffix;
  }

  return 'CLIENT_' + (new Date()).getTime() + (suffix.length > 0 ? '_' + suffix : '') + '.' + EXTENSION_ZIP;
}

function _logger(title) {
  return {
    info: function () {
      var args = Array.prototype.slice.call(arguments);
      args = [].concat(gutil.colors.green('[' + title + ']')).concat(args);
      gutil.log.apply(gutil, args);
    },
    warning: function () {
      var args = Array.prototype.slice.call(arguments);
      args = [].concat(gutil.colors.blue('[' + title + ']')).concat(args);
      gutil.log.apply(gutil, args);
    },
    error: function () {
      var args = Array.prototype.slice.call(arguments);
      args = [].concat(gutil.colors.red('[' + title + ']')).concat(args);
      gutil.log.apply(gutil, args);
    }
  };
}
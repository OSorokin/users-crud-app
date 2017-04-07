'use strict';

var gulp = require('gulp');
var conf = require('./conf');

var tsPaths = {
  app: conf.paths.src.app + '/**/*.ts',
  bin: conf.paths.src.bin + '/**/*.ts',
  common: conf.paths.src.common + '/**/*.ts'
};

gulp.task('watch', ['build:clean-and-compile'], function () {
  return gulp.watch([tsPaths.app, tsPaths.bin,  tsPaths.common], ['build:compile']);
});

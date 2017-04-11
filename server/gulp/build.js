'use strict';

var cache = require('gulp-cached');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var merge2 = require('merge2');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');

var conf = require('./conf');
var logger = conf.logger('build');
var tts4tDuration = require('./utils/tts4t-duration');

var tsconfig = require('../tsconfig.json');
var tsPaths = {
  app: conf.paths.src.app + '/**/*.ts',
  bin: conf.paths.src.bin + '/**/*.ts',
  typings: conf.paths.src.typings + '/**/*.ts',
  commonIndex: conf.paths.src.common + '/index.ts',
  commonMain: conf.paths.src.commonMain + '/**/*.ts'
};

gulp.task('build:tslint', function () {
  return gulp.src([tsPaths.app, tsPaths.bin, tsPaths.commonIndex, tsPaths.commonMain])
    .pipe(tslint({configuration: '../tslint.json'}))
    .pipe(tslint.report())
});

gulp.task('build:clean', function (done) {
  return del([
    conf.paths.src.app + '/**/*.js',
    conf.paths.src.app + '/**/*.js.map',
    conf.paths.src.bin + '/**/*.js',
    conf.paths.src.bin + '/**/*.js.map',
    conf.paths.src.typings + '/**/*.js',
    conf.paths.src.typings + '/**/*.js.map',
    conf.paths.src.common + '/*.js',
    conf.paths.src.common + '/*.js.map',
    conf.paths.src.commonMain + '/**/*.js',
    conf.paths.src.commonMain + '/**/*.js.map'
  ], {force: true}, done);
});

gulp.task('build:compile', function () {

  var app = tsCompile(tsPaths.app);
  var bin = tsCompile(tsPaths.bin);
  var typings = tsCompile(tsPaths.typings);
  var commonIndex = tsCompile(tsPaths.commonIndex);
  var commonMain = tsCompile(tsPaths.commonMain);

  return merge2([
    app.pipe(gulp.dest(conf.paths.src.app)),
    bin.pipe(gulp.dest(conf.paths.src.bin)),
    typings.pipe(gulp.dest(conf.paths.src.typings)),
    commonIndex.pipe(gulp.dest(conf.paths.src.common)),
    commonMain.pipe(gulp.dest(conf.paths.src.commonMain))
  ]);
});

gulp.task('build:clean-and-compile', function (done) {
  return runSequence('build:clean', 'build:compile', done);
});

gulp.task('build', ['build:clean-and-compile']);

function tsCompile(path) {
  var durationLogger = tts4tDuration.logger(logger);
  var duration = tts4tDuration.start(durationLogger);
  var compilerOptions = tsconfig.compilerOptions;
  compilerOptions.typescript = require('typescript');
  console.info('compile_path: ' + path);
  return gulp.src(path)
    .pipe(cache('serverCompile'))
    .pipe(duration.step('Cache generation for ' + path))
    .pipe(sourcemaps.init())
    .pipe(duration.step('Sourcemaps init for ' + path))
    .pipe(ts(compilerOptions))
    .pipe(duration.step('Compiling ' + path))
    .pipe(sourcemaps.write('.', {sourceRoot: ''}))
    .pipe(duration.step('Sourcemaps write for ' + path));
}

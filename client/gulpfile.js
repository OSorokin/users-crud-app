var gulp = require('gulp');
var cache = require('gulp-cached');
var del = require('del');
var fs = require('fs');
var merge2 = require('merge2');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var tsconfig = require('./src/tsconfig.json');
var tts4tDuration = require('../server/gulp/utils/tts4t-duration');
var conf = require('../server/gulp/conf');
var logger = conf.logger('build');

function tsCompile(path) {
  var durationLogger = tts4tDuration.logger(logger);
  var duration = tts4tDuration.start(durationLogger);
  var compilerOptions = tsconfig.compilerOptions;
  compilerOptions.typescript = require('typescript');
  return gulp.src(path)
    .pipe(cache('tsCompile'))
    .pipe(duration.step('Cache generation for ' + path))
    .pipe(sourcemaps.init())
    .pipe(duration.step('Sourcemaps init for ' + path))
    .pipe(ts(compilerOptions))
    .pipe(duration.step('Compiling ' + path))
    .pipe(sourcemaps.write('.', {sourceRoot: ''}))
    .pipe(duration.step('Sourcemaps write for ' + path));
}

gulp.task('build:compile', function () {
  var app = tsCompile('src/**/*.ts');
  var common = tsCompile('../common/**/*.ts');
  return merge2([
    app.pipe(gulp.dest('../distribution/client/src')),
    common.pipe(gulp.dest('../distribution/common'))
  ]);
});

gulp.task('build:clean', function (done) {
  return del([
    '../distribution/**/*'
  ], {force: true}, done);
});

gulp.task('copy', function () {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('../distribution/client/src'))

  gulp.src('src/**/*.sass')
    .pipe(gulp.dest('../distribution/client/src'))

  gulp.src('src/assets/**/*')
    .pipe(gulp.dest('../distribution/client/src/assets'))

  gulp.src('../client/package.json')
    .pipe(gulp.dest('../distribution/client'))
});

gulp.task('bundle:zip:clean', function (done) {
  return del([ '../distribution/client/*.zip'], {force: true}, done);
});

gulp.task('build:clean-and-compile', function (done) {
  return runSequence('build:clean', 'build:compile','copy', done);
});
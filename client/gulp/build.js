var gulp = require('gulp');
var cache = require('gulp-cached');
var del = require('del');
var fs = require('fs');
var merge2 = require('merge2');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var tsconfig = require('../src/tsconfig.json');
var tts4tDuration = require('../../server/gulp/utils/tts4t-duration');
var conf = require('./conf');
var logger = conf.logger('build');

var appPaths = {
  src: conf.paths.src.root + '/**/*.ts'
};

function tsCompile(path) {
  var durationLogger = tts4tDuration.logger(logger);
  var duration = tts4tDuration.start(durationLogger);
  var compilerOptions = tsconfig.compilerOptions;
  compilerOptions.typescript = require('typescript');
  return gulp.src(path)
    .pipe(cache('clientCompile'))
    .pipe(duration.step('Cache generation for ' + path))
    .pipe(sourcemaps.init())
    .pipe(duration.step('Sourcemaps init for ' + path))
    .pipe(ts(compilerOptions))
    .pipe(duration.step('Compiling ' + path))
    .pipe(sourcemaps.write('.', {sourceRoot: ''}))
    .pipe(duration.step('Sourcemaps write for ' + path));
}

gulp.task('build:compile', function () {
  var app = tsCompile(appPaths.src);
  return merge2([
    app.pipe(gulp.dest(conf.paths.src.root)),
  ]);
});

gulp.task('build:clean', function (done) {
  return del([
    conf.paths.src.root + '/**/*.js',
    conf.paths.src.root + '/**/*.js.map'
  ], {force: true}, done);
});

gulp.task('build', function (done) {
  return runSequence('build:clean', 'build:compile', done);
});
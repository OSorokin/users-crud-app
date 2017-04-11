'use strict';

var gulp = require('gulp');
var conf = require('./conf');
var del = require('del');
var merge2 = require('merge2');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');

var tts4tLog = require('../../server/gulp/utils/tts4t-log');
var logger = conf.logger('bundle');

gulp.task('bundle:clean', function (done) {
  return del([
    conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.client + '/*.*'
  ], {force: true}, done);
});

gulp.task('bundle:copy', ['bundle:clean'], function () {
  return merge2([
    gulp.src([
      conf.paths.src.packageJson,
    ]).pipe(gulp.dest(conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.client)),
    gulp.src([
      conf.paths.src.root + '/**/*',
      '!' + conf.paths.src.root + '/**/*.ts',
      '!' + conf.paths.src.root + '/**/*.map'
    ]).pipe(gulp.dest(conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.client + '/' + conf.paths.src.root)),
  ]);
});

gulp.task('bundle:zip:clean', function (done) {
  return del([conf.paths.folderToContainBundle + '/*.zip'], {force: true}, done);
});

gulp.task('bundle:zip', ['bundle:zip:clean'], function () {
  var bundleFilename = conf.bundle.constructRevisionName();
  return gulp.src(conf.paths.folderToContainBundleFiles + '/**/*')
    .pipe(zip(bundleFilename))
    .pipe(gulp.dest(conf.paths.folderToContainBundle))
    .pipe(tts4tLog(logger, 'Zip file created: ' + bundleFilename))
    ;
});

gulp.task('bundle', function (done) {
  return runSequence('build', 'bundle:copy', 'bundle:zip', done);
});

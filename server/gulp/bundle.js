'use strict';

var gulp = require('gulp');
var conf = require('./conf');
var del = require('del');
var merge2 = require('merge2');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');

var tts4tLog = require('./utils/tts4t-log');
var logger = conf.logger('bundle');

gulp.task('bundle:clean', function (done) {
  return del([
    conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.codeDeploy + '/*.*',
    conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.codeDeploy + '/scripts/**/*',
    conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.common + '/**/*',
    conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.server + '/**/*'
  ], {force: true}, done);
});

gulp.task('bundle:copy', ['bundle:clean'], function () {
  return merge2([
    gulp.src([
      conf.paths.src.packageJson,
    ]).pipe(gulp.dest(conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.server)),

    gulp.src([
      conf.paths.src.migrations + '/**/*',
    ]).pipe(gulp.dest(conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.server + '/' + conf.paths.src.migrations)),

    gulp.src([
      conf.paths.src.typings + '/**/*',
      '!' + conf.paths.src.typings + '/**/*.ts',
      '!' + conf.paths.src.typings + '/**/*.map'
    ]).pipe(gulp.dest(conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.server + '/' + conf.paths.src.typings)),

    gulp.src([
      conf.paths.src.app + '/**/*',
      '!' + conf.paths.src.app + '/**/*.ts',
      '!' + conf.paths.src.app + '/**/*.map'
    ]).pipe(gulp.dest(conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.server + '/' + conf.paths.src.app)),

    gulp.src([
      conf.paths.src.bin + '/**/*',
      '!' + conf.paths.src.bin + '/**/*.ts',
      '!' + conf.paths.src.bin + '/**/*.map'
    ]).pipe(gulp.dest(conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.server + '/' + conf.paths.src.bin)),

    gulp.src([
      conf.paths.src.common + '/index.js'
    ]).pipe(gulp.dest(conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.common)),

    gulp.src([
      conf.paths.src.commonMain + '/**/*.*',
      '!' + conf.paths.src.commonMain + '/**/*.ts',
      '!' + conf.paths.src.commonMain + '/**/*.map',
    ]).pipe(gulp.dest(conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.common + '/main')),

    gulp.src([
      conf.paths.codeDeploy + '/**/*'
    ]).pipe(gulp.dest(conf.paths.folderToContainBundleFiles + '/' + conf.bundle.paths.codeDeploy))
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

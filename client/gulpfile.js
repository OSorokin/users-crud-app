var gulp = require('gulp');
var ip = require('ip');
var fs = require('fs');
var path = require('path');
var del = require('del');

var bundlePaths = {
  currentBuild: 'dist',
  bundleFiles: '../distribution/files/client'
};

gulp.task('deployment:copy', ['deployment:clean'], function () {
  return gulp.src([
    bundlePaths.currentBuild + '/**/*',
  ]).pipe(gulp.dest(bundlePaths.bundleFiles));
});

gulp.task('deployment', ['deployment:copy']);

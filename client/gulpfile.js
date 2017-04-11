'use strict';

var gulp = require('gulp');
var fsExtra = require('fs-extra');

fsExtra.walkSync('./gulp')
  .filter(function (file) {
    if ((/\.spec\.(js|coffee)$/i).test(file)) {
      return false;
    }
    return (/\.(js|coffee)$/i).test(file);
  })
  .map(function (file) {
    require('./' + file);
  });
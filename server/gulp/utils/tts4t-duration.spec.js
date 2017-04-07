'use strict';

describe('tts4tDurationTest', function () {
  var tts4tDuration = require('./tts4t-duration');
  var assert = require('assert');

  describe('Logger', function () {
    var logger;

    beforeEach('Init logger', function () {
      logger = testLogger();
    });

    it('Logger internal format', function () {
      var log = tts4tDuration.logger(logger, true);

      log('Name', seconds(1));
      var logs = logger.getLogs();
      assert.equal(logs.length, 1);
      assert.deepEqual(logs[0], ['Name', [1, 0]]);

      log('Another name', seconds(2));
      logs = logger.getLogs();
      assert.equal(logs.length, 2);
      assert.deepEqual(logs[1], ['Another name', [2, 0]]);
    });

    // ATTENTION! Strings color assertions do not work in IDEA
    it('Logger pretty format', function () {
      var log = tts4tDuration.logger(logger);

      log('Name', seconds(1));
      var logs = logger.getLogs();
      assert.equal(logs.length, 1);
      assert.deepEqual(logs[0], ['\u001b[34m[tts4t-duration]\u001b[39m', 'Name.', '\u001b[35m1 s\u001b[39m']);

      log('Another name', seconds(2));
      logs = logger.getLogs();
      assert.equal(logs.length, 2);
      assert.deepEqual(logs[1], ['\u001b[34m[tts4t-duration]\u001b[39m', 'Another name.', '\u001b[35m2 s\u001b[39m']);
    });

    function testLogger() {
      var strings = [];
      return {
        info: function () {
          var args = Array.prototype.slice.call(arguments);
          strings.push(args);
        },
        getLogs: function () {
          return strings;
        }
      };
    }

    // returns time in process.hrtime() style
    function seconds(sec) {
      return [sec, 0];
    }
  });

  describe('Duration', function () {
    var logger;
    var duration;
    var delta = 100;

    beforeEach('init logger and duration', function () {
      logger = testLogger();
      var durationLogger = tts4tDuration.logger(logger, true);
      duration = tts4tDuration.start(durationLogger);
    });

    it('Simple sequential case', function () {
      var step = duration.step('Some step');
      step.emit('end');

      assertLogsCount(1);
      assertLog(0, 'Some step', 0, 0);
    });

    it('The first deferred step that ends after 500 ms timeout', function (done) {
      var firstStep = duration.step('Deferred step');

      setTimeout(function () {
        firstStep.emit('end');

        try {
          assertLogsCount(1);
          assertLog(0, 'Deferred step', 0, 500);
          done();
        } catch (err) {
          done(err);
        }
      }, 500)
    });

    it('The first deferred step that ends after 1s 100ms timeout', function (done) {
      var firstStep = duration.step('Deferred step');

      setTimeout(function () {
        firstStep.emit('end');

        try {
          assertLogsCount(1);
          assertLog(0, 'Deferred step', 1, 100);
          done();
        } catch (err) {
          done(err);
        }
      }, 1100)
    });

    it('The first ends in 1 sec 100 ms, the second ends in more 300 ms', function (done) {
      var firstStep = duration.step('firstStep');
      var secondStep = duration.step('secondStep');

      setTimeout(function () {
        firstStep.emit('end');

        try {
          assertLogsCount(1);
          assertLog(0, 'firstStep', 1, 100);

          setTimeout(function () {
            secondStep.emit('end');

            try {
              assertLogsCount(2);
              assertLog(1, 'secondStep', 1, 400);
              done();
            } catch (err) {
              done(err);
            }
          }, 300);

        } catch (err) {
          done(err);
        }
      }, 1100);
    });

    function testLogger() {
      var strings = [];
      return {
        info: function (name, time) {
          strings.push({
            name: name,
            time: time
          });
        },
        getLogs: function () {
          return strings;
        }
      };
    }

    function assertLogsCount(count) {
      assert.equal(logger.getLogs().length, count, 'Logs count');
    }

    function assertLog(index, name, timeSeconds, timeMillis) {
      timeMillis = timeMillis + delta;

      var log = logger.getLogs()[index];
      assert.equal(log.name, name);
      assert.equal(log.time[0], timeSeconds, 'timeSeconds: ' + JSON.stringify(log.time));
      assert.ok(log.time[1] < timeMillis * 1000 * 1000, 'timeMillis: ' + JSON.stringify(log.time));
    }
  });
});
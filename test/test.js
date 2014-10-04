'use strict';


var request = require('supertest'),
    test = require('tape');


test('ks-stats-overview', function (t) {

    t.test('root', function onRoot (t) {

      t.plan(1);

      request('http://localhost:8006')
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/plain')
        .expect('\n    =====  API  =====\n\n' +
                '  * GET    /poll       \n' +
                '  * GET    /poll/:date \n' +
                '  * POST   /poll/:date \n' +
                '  * PUT    /poll/:date \n' +
                '  * DELETE /poll/:date \n')
        .end(function onEnd (err) {

          if (err) throw (err);
          t.ok('GET /', 'GET /')
          t.end();

        });
    });

    t.test('poll', function onPoll (t) {

      t.plan(1);

      function hasValidKeys (res) {
        var validKeys = ['total_dollars',
                         'successful_projects',
                         'total_backers',
                         'repeat_backers',
                         'total_pledges'];

        validKeys.forEach(function (key) {
          if (!res.body[key]) return new Error('missing ' + key);
          if (typeof res.body[key] !== 'number') return new Error('invalid type ' + key);
        });
      }

      request('http://localhost:8006')
        .get('/poll')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(hasValidKeys)
        .end(function onEnd (err) {

          if (err) throw (err);
          t.ok('GET /poll', 'GET /poll')
          t.end();

        });
    });
});

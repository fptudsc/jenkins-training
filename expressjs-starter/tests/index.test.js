require('debug').enable('superagent');

const assert = require('chai').assert;
const superagent = require('superagent');

const app = require('../src/app');


describe('app', function () {

  let server;

  beforeEach(function (done) {
    server = app.listen(3000, function (err) {
      done(err);
    })
  });

  afterEach(function (done) {
    server.close(function (err) {
      done(err);
    });
  });


  it('should return Hello World at /', function (done) {

    superagent.get('http://localhost:3000/').end(function (err, res) {
      if (err) { return done(err); }

      assert.equal(res.status, 200);
      assert.equal(res.text, 'Visit /user/0 or /users/0-2');
      done();
    });

  });

  it('should return a 200 at /users/1', function (done) {

    superagent.get('http://localhost:3000/user/0').end(function (err, res) {
      assert.equal(res.status, 200);
      done();
    });

  });

  it('should return a 404 at /users/3', function (done) {

    superagent.get('http://localhost:3000/users/3').end(function (err, res) {
      if (err) {
        assert.equal(res.status, 404);
        return done();
      }

      done(new Error('Request to /foo should have failed'));
    });

  });
});
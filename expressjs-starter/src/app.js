'use strict'

// Clone from https://github.com/expressjs/express/blob/master/examples/params/index.js

/**
 * Module dependencies.
 */

const createError = require('http-errors')
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();
const morgan = require('morgan');

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Stream log to file
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: accessLogStream }));
// Stream log to console
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Faux database

const users = [
  { name: 'tj' }
  , { name: 'tobi' }
  , { name: 'loki' }
  , { name: 'jane' }
  , { name: 'bandit' }
];

// Convert :to and :from to integers

app.param(['to', 'from'], function(req, res, next, num, name){
  req.params[name] = parseInt(num, 10);
  if( isNaN(req.params[name]) ){
    next(createError(400, 'failed to parseInt '+num));
  } else {
    next();
  }
});

// Load user by id

app.param('user', function(req, res, next, id){
  if (req.user = users[id]) {
    next();
  } else {
    next(createError(404, 'failed to find user'));
  }
});

/**
 * GET index.
 */

app.get('/', function(req, res){
  res.send('Visit /user/0 or /users/0-2');
});

/**
 * GET :user.
 */

app.get('/user/:user', function (req, res) {
  res.send('user ' + req.user.name);
});

/**
 * GET users :from - :to.
 */

app.get('/users/:from-:to', function (req, res) {
  const from = req.params.from;
  const to = req.params.to;
  const names = users.map(function(user){ return user.name; });
  res.send('users ' + names.slice(from, to + 1).join(', '));
});

module.exports = app;
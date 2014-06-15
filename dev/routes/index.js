'use strict';

var homeRouter = require('express').Router();

homeRouter.get('/', function home(req, res, next) {
  res.render('home');
});

module.exports = function (config) {
  return {
    '': homeRouter,
    'search': require('./search')(config)
  };
};

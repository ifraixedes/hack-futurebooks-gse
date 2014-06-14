'use strict';

module.exports = function (config) {
  var db = config.db;
  var router = require('express').Router();

  router.post('/', function (req, res, next) {
    //Added checking
    var body = req.body;

    db.save({
      text: body.text,
      location: {
        lat: body.location.latitude,
        lon: body.location.longitude
      }
    })
  });

  return router;
};

'use strict';

module.exports = function (config) {
  var Gossip = require(config.rootPath + '/models/gossip')(config);
  var router = require('express').Router();

  router.post('/', function (req, res, next) {
    //Added checking
    var gossip = new Gossip(req.body);

    gossip.save()
    .then(function (result) {
      res.redirect(303, '/search/' + result.id);
    }, next);
  });

  router.get('/:gossipId', function (req, res, next) {
    Gossip.findById(req.params.gossipId);
    res.send('ok');
  });

  return router;
};

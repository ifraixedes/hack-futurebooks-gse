'use strict';

module.exports = function (config) {
  var Gossip = require(config.rootPath + '/models/gossip')(config);
  var Book = require(config.rootPath + '/models/book')(config);
  var router = require('express').Router();

  router.post('/', function (req, res, next) {
    //Added checking
    var gossip = new Gossip(req.body);

    gossip.save()
    .then(function (result) {
      res.redirect(303, '/search/' + gossip.id);
    }, next);
  });

  router.get('/:gossipId', function (req, res, next) {
    Gossip.findById(req.params.gossipId)
    .then(function (gossipDoc) {
      //Book.findSome(gossipDoc.text)
      return Book.findByGossip(gossipDoc.text)
      .then(function (books) {
        res.render('gossip-search', { books: books, gossip: gossipDoc });
      });
    }, next);
  });

  return router;
};

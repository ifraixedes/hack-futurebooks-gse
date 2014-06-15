'use strict';

module.exports = function (config) {
  var Gossip = require(config.rootPath + '/models/gossip')(config);
  var Book = require(config.rootPath + '/models/book')(config);
  var router = require('express').Router();


  router.get('/:bookIsbn/:gossipId?', function (req, res, next) {
    Book.findByIsbn(req.params.bookIsbn)
    .then(function (bookDoc) {
      if (req.params.gossipId) {
        return Gossip.findById(req.params.gossipId)
        .then(function (gossipDoc) {
          res.render('book', { book: bookDoc._source, gossip: gossipDoc });
        });
      } else {
        res.render('book', { book: bookDoc._source });
      }
    }, next);
  });

  return router;
};

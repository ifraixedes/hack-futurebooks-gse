'use strict';

var _ = require('lodash');
var modelHelper = require('./_helper');

var _extend = _.extend;

module.exports = function (config) {
  function Book(data) {
  }

  Book.findByIsbn = function (isbn) {
    var queryObj = _extend({
      body: {
        query: {
          match: {
            isbn: isbn
          }
        }
      }
    }, baseBookData);

    return db.search(queryObj)
    .then(modelHelper.dbResultFromSearchToData)
    .then(function (bookDocsList) {
      return bookDocksList[0] || null;
    });
  };
  /**
   *
   * [distance] (number|string): distance radius in kilometers when number. Default 50km
   * */
  Book.findSome = function (text, limit) {
    var queryObj = _extend({
      body: {
          filter: {
            limit: { value: limit || 10 }
          }
      }
    }, baseBookData);

    queryObj.body.query = {
      match: {
        _all: {
          query: text,
          operator: "or"
        }
      }
    };

    return db.search(queryObj)
    .then(modelHelper.dbResultFromSearchToData);
  };

  var baseBookData = {
    index: 'books',
    type: 'book'
  };
  var db = config.db;
  return Book;
};

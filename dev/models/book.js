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
      return bookDocsList[0] || null;
    });
  };


  Book.findByGossip = function (gossipText, limit) {
    var queryObj = {
      query: {
        bool: {
        }
      }
    };
    var parametrisedQuery = modelHelper.gossipTextToBookFields(gossipText);

    if (parametrisedQuery === null) {
      return Book.findSome(gossipText, limit);
    }

    queryObj.query.bool.should = Object.keys(parametrisedQuery.queryFields).map(function (fieldName) {
      var queryElem = { match : {} };
      queryElem.match[fieldName] = parametrisedQuery.queryFields[fieldName];

      return queryElem;
    });

    if (parametrisedQuery.textLeft) {
      queryObj.query.bool.must = { match: { _all: parametrisedQuery.textLeft }};
    }

    return db.search(_extend({}, baseBookData, { body: queryObj }))
    .then(modelHelper.dbResultFromSearchToData);
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
